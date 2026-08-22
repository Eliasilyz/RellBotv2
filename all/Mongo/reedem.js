const { User, RedeemCode, UserData, isMongoConnected } = require("./mongoose");
const moment = require("moment");

// Parse durasi (e.g. 1d, 2w, 30m)
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

 return value * (multipliers[unit] || 0);
}

function parseDurationToDate(durationStr) {
 const ms = parseDuration(durationStr);
 if (!ms) return null;
 return new Date(Date.now() + ms);
}

function getLocalCodes() {
 if (!global.db?.data) {
  if (!global.db) global.db = {};
  if (!global.db.data) global.db.data = {};
 }
 if (!global.db.data.redeemCodes) {
  global.db.data.redeemCodes = {};
 }
 return global.db.data.redeemCodes;
}

// 🎯 REDEEM KODE
async function redeemCode(userId, codeInput) {
 if (!codeInput) return { success: false, message: "❌ Code is required." };
 const codeKey = codeInput.trim().toUpperCase();
 const localCodes = getLocalCodes();

 let codeObj = localCodes[codeKey];

 if (!codeObj && isMongoConnected()) {
  try {
   const mongoCode = await RedeemCode.findOne({ code: codeKey });
   if (mongoCode) {
    codeObj = {
     code: mongoCode.code,
     reward: mongoCode.reward,
     usedBy: mongoCode.usedBy || [],
     maxUses: mongoCode.maxUses || 1,
     expiresAt: mongoCode.expiresAt,
    };
    localCodes[codeKey] = codeObj;
   }
  } catch (_) {}
 }

 if (!codeObj) return { success: false, message: "❌ Code not found." };
 if (codeObj.expiresAt && new Date() > new Date(codeObj.expiresAt)) return { success: false, message: "⚠️ This code has expired." };
 if (codeObj.usedBy.includes(userId)) return { success: false, message: "⚠️ You have already claimed this code." };
 if (codeObj.usedBy.length >= codeObj.maxUses) return { success: false, message: "⚠️ Codes have already reached max uses." };

 // Process reward locally
 if (!global.db?.data?.users) global.db.data.users = {};
 if (!global.db.data.users[userId]) global.db.data.users[userId] = {};
 const localUser = global.db.data.users[userId];

 switch (codeObj.reward.type) {
  case "premium": {
   const days = Number(codeObj.reward.value) || 1;
   const ms = days * 24 * 60 * 60 * 1000;
   const now = moment();
   const current = moment(localUser.premiumUntil);
   const baseTime = current.isValid() && current.isAfter(now) ? current : now;
   localUser.premium = true;
   localUser.premiumUntil = baseTime.add(ms, "ms").toDate();
   break;
  }
  case "exp_multiplier": {
   const multiplier = Number(codeObj.reward.value?.value || codeObj.reward.value);
   const durationStr = codeObj.reward.value?.duration || "1d";
   const expiresAt = parseDurationToDate(durationStr);
   localUser.expMultiplier = multiplier || 2;
   localUser.expMultiplierUntil = expiresAt;
   break;
  }
  default:
   return { success: false, message: "⚠ Reward type not recognized." };
 }

 codeObj.usedBy.push(userId);

 // Sync to Mongo in background
 if (isMongoConnected()) {
  RedeemCode.findOne({ code: codeKey }).then(async (c) => {
   if (c) {
    c.usedBy.push(userId);
    await c.save();
   }
  }).catch(() => {});

  User.findOne({ phone_number: userId }).then(async (u) => {
   if (u && localUser.premium) {
    u.premium = true;
    u.premiumUntil = localUser.premiumUntil;
    await u.save();
   }
  }).catch(() => {});
 }

 return { success: true, message: `✅ Code ${codeObj.code} successfully claimed!` };
}

// 🎁 BUAT KODE BARU
async function createCustomCode(code, rewardType, value, maxUses = 1, expiresInStr = null) {
 if (!code || !rewardType) return { success: false, message: "❌ Invalid parameters." };
 const codeKey = code.trim().toUpperCase();
 const localCodes = getLocalCodes();

 if (localCodes[codeKey]) return { success: false, message: "❌ The code already exists." };

 const expiresAt = expiresInStr ? parseDurationToDate(expiresInStr) : null;

 localCodes[codeKey] = {
  code: codeKey,
  reward: { type: rewardType, value },
  usedBy: [],
  maxUses: Number(maxUses) || 1,
  expiresAt,
 };

 if (isMongoConnected()) {
  try {
   const newCode = new RedeemCode({
    code: codeKey,
    reward: { type: rewardType, value },
    usedBy: [],
    maxUses: Number(maxUses) || 1,
    expiresAt: expiresAt || undefined,
   });
   await newCode.save();
  } catch (err) {
   console.error("createCustomCode Mongo sync error:", err.message);
  }
 }

 return {
  success: true,
  message: `✅ Code ${codeKey} successfully created!` + (expiresAt ? ` Valid until ${expiresAt.toLocaleString()}` : ""),
 };
}

// 📜 LIST KODE
async function listAllCodes() {
 const localCodes = getLocalCodes();
 const entries = Object.values(localCodes);
 if (!entries.length) return "📭 There is no code at this time.";
 return entries.map((c) => `🆔 ${c.code} - ${c.reward.type} (${typeof c.reward.value === "object" ? JSON.stringify(c.reward.value) : c.reward.value}) - ${c.usedBy.length}/${c.maxUses} used`).join("\n");
}

module.exports = {
 redeemCode,
 createCustomCode,
 listAllCodes,
};
