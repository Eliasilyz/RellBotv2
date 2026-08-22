const { connectDB, isMongoConnected, User } = require("./mongoose");
const moment = require("moment-timezone");

connectDB().catch(() => {});

function parseDuration(durationStr) {
 if (typeof durationStr !== "string") return null;
 const match = durationStr.match(/^(\d+)([smhdwMy])$/);
 if (!match) return null;

 const value = parseInt(match[1]);
 const unit = match[2];

 const multipliers = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
  w: 7 * 24 * 60 * 60 * 1000,
  M: 30 * 24 * 60 * 60 * 1000,
  y: 365 * 24 * 60 * 60 * 1000,
 };

 const ms = value * (multipliers[unit] || 0);
 return ms > 0 ? ms : null;
}

function ensureLocalUser(phone_number) {
 if (!global.db?.data?.users) {
  if (!global.db) global.db = {};
  if (!global.db.data) global.db.data = {};
  if (!global.db.data.users) global.db.data.users = {};
 }
 if (!global.db.data.users[phone_number]) {
  global.db.data.users[phone_number] = {
   phone_number,
   premium: false,
   premiumUntil: null,
   banned: false,
   bannedUntil: null,
   tickets: 0,
   lastGacha: 0,
   gachaCount: 0,
   waifuCollection: [],
   tempGacha: null,
  };
 }
 return global.db.data.users[phone_number];
}

exports.addUser = async function (user) {
 if (!user?.phone_number) return;
 const local = ensureLocalUser(user.phone_number);
 if (user.username && !local.username) local.username = user.username;

 if (isMongoConnected()) {
  try {
   const existingUser = await User.findOne({ phone_number: user.phone_number });
   if (!existingUser) {
    const newUser = {
     phone_number: user.phone_number,
     premium: local.premium || false,
     premiumUntil: local.premiumUntil || null,
     banned: local.banned || false,
     bannedUntil: local.bannedUntil || null,
     username: user.username || local.name || "",
     last_active: null,
     usage: 0,
     tickets: local.tickets || 0,
     waifuCollection: local.waifuCollection || [],
    };
    await new User(newUser).save();
   }
  } catch (err) {
   console.error("Failed to sync user to Mongo:", err.message);
  }
 }
};

exports.getUser = async function (phone_number) {
 if (!phone_number) return null;
 const local = ensureLocalUser(phone_number);

 if (isMongoConnected()) {
  try {
   const mongoUser = await User.findOne({ phone_number });
   if (mongoUser) {
    // Merge mongo values into local cache
    if (mongoUser.premium !== undefined) local.premium = mongoUser.premium;
    if (mongoUser.premiumUntil !== undefined) local.premiumUntil = mongoUser.premiumUntil;
    if (mongoUser.banned !== undefined) local.banned = mongoUser.banned;
    if (mongoUser.bannedUntil !== undefined) local.bannedUntil = mongoUser.bannedUntil;
    if (mongoUser.tickets !== undefined) local.tickets = mongoUser.tickets;
    if (mongoUser.waifuCollection !== undefined) local.waifuCollection = mongoUser.waifuCollection;
    return mongoUser;
   }
  } catch (err) {
   // fallback to local on error
  }
 }

 return {
  _id: phone_number,
  phone_number,
  username: local.name || local.username || "",
  premium: local.premium || false,
  premiumUntil: local.premiumUntil || null,
  banned: local.banned || false,
  bannedUntil: local.bannedUntil || null,
  tickets: local.tickets || 0,
  waifuCollection: local.waifuCollection || [],
  gachaCount: local.gachaCount || 0,
  lastGacha: local.lastGacha || null,
  createdAt: local.registeredAt || new Date(),
 };
};

exports.banUser = async function (phone_number, durationStr) {
 if (!phone_number) return "❌ Phone number is required.";
 const ms = parseDuration(durationStr);
 if (!ms) return "Invalid duration format. Use 1d, 7d, 1w, etc.";

 const local = ensureLocalUser(phone_number);
 const now = moment();
 const current = moment(local.bannedUntil);
 const baseTime = current.isValid() && current.isAfter(now) ? current : now;
 const newBanUntil = new Date(baseTime.valueOf() + ms);

 local.banned = true;
 local.bannedUntil = newBanUntil;

 if (isMongoConnected()) {
  User.findOne({ phone_number }).then(async (u) => {
   if (u) {
    u.banned = true;
    u.bannedUntil = newBanUntil;
    await u.save();
   }
  }).catch(() => {});
 }

 const formatted = moment(newBanUntil).tz("Asia/Jakarta").format("YYYY/MM/DD HH:mm:ss");
 return `🚫 User ${phone_number} banned until ${formatted}`;
};

exports.setPremium = async function (phone_number, durationStr) {
 if (!phone_number) return "❌ Phone number is required.";
 const ms = parseDuration(durationStr);
 if (!ms || isNaN(ms)) return "⚠️ Invalid duration format. Use formats like `1d`, `7d`, `2w`, etc.";

 const local = ensureLocalUser(phone_number);
 const now = moment();
 const currentPremiumUntil = moment(local.premiumUntil);
 const baseTime = currentPremiumUntil.isValid() && currentPremiumUntil.isAfter(now) ? currentPremiumUntil : now;
 const newPremiumUntil = new Date(baseTime.valueOf() + ms);

 local.premium = true;
 local.premiumUntil = newPremiumUntil;

 if (isMongoConnected()) {
  User.findOne({ phone_number }).then(async (u) => {
   if (u) {
    u.premium = true;
    u.premiumUntil = newPremiumUntil;
    await u.save();
   }
  }).catch(() => {});
 }

 const formattedDate = moment(newPremiumUntil).tz("Asia/Tokyo").format("YYYY/MM/DD HH:mm:ss");
 return `🌸 Premium added to ${phone_number}\n📅 Until: ${formattedDate}`;
};

exports.delPremium = async function (phone_number) {
 if (!phone_number) return;
 const local = ensureLocalUser(phone_number);
 local.premium = false;
 local.premiumUntil = null;

 if (isMongoConnected()) {
  User.updateOne({ phone_number }, { $set: { premium: false, premiumUntil: null } }).catch(() => {});
 }
};

exports.unBan = async function (phone_number) {
 if (!phone_number) return;
 const local = ensureLocalUser(phone_number);
 local.banned = false;
 local.bannedUntil = null;

 if (isMongoConnected()) {
  User.updateOne({ phone_number }, { $set: { banned: false, bannedUntil: null } }).catch(() => {});
 }
 return `✅ User ${phone_number} unbanned.`;
};

exports.findPremiumUsers = async function () {
 const localUsers = global.db?.data?.users || {};
 const list = Object.entries(localUsers)
  .filter(([_, u]) => u.premium)
  .map(([phone, u]) => ({
   phone_number: phone,
   username: u.name || u.username || "",
   premium: true,
   premiumUntil: u.premiumUntil,
  }));

 if (isMongoConnected()) {
  try {
   const mongoUsers = await User.find({ premium: true });
   const phoneSet = new Set(list.map((u) => u.phone_number));
   for (const mu of mongoUsers) {
    if (!phoneSet.has(mu.phone_number)) {
     list.push({
      phone_number: mu.phone_number,
      username: mu.username || "",
      premium: true,
      premiumUntil: mu.premiumUntil,
     });
    }
   }
  } catch (_) {}
 }

 return list;
};

exports.checkPremiumStatus = async function (phone_number) {
 if (!phone_number) return;
 const local = global.db?.data?.users?.[phone_number];
 if (local?.premium && local.premiumUntil) {
  const expiry = moment(local.premiumUntil);
  if (expiry.isValid() && moment().isAfter(expiry)) {
   local.premium = false;
   local.premiumUntil = null;
  }
 }
};

exports.checkBanStatus = async function (phone_number) {
 if (!phone_number) return;
 const local = global.db?.data?.users?.[phone_number];
 if (local?.banned && local.bannedUntil) {
  const expiry = moment(local.bannedUntil);
  if (expiry.isValid() && moment().isAfter(expiry)) {
   local.banned = false;
   local.bannedUntil = null;
  }
 }
};

// Fast in-memory sync lookup
exports.getPremiumStatus = function (phone_number) {
 if (!phone_number) return false;
 const local = global.db?.data?.users?.[phone_number];
 if (local?.premiumUntil && moment().isAfter(moment(local.premiumUntil))) {
  local.premium = false;
  local.premiumUntil = null;
  return false;
 }
 return !!local?.premium;
};

// Fast in-memory sync lookup
exports.getBannedStatus = function (phone_number) {
 if (!phone_number) return false;
 const local = global.db?.data?.users?.[phone_number];
 if (local?.bannedUntil && moment().isAfter(moment(local.bannedUntil))) {
  local.banned = false;
  local.bannedUntil = null;
  return false;
 }
 return !!local?.banned;
};

setInterval(async () => {
 const localUsers = global.db?.data?.users || {};
 for (const phone of Object.keys(localUsers)) {
  await exports.checkPremiumStatus(phone);
  await exports.checkBanStatus(phone);
 }
}, 10 * 60 * 1000);
