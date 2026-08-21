const { connectDB, User, Log, UserLog } = require("./mongoose");
const moment = require("moment-timezone");

connectDB();

function parseDuration(durationStr) {
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

exports.addUser = async function (user) {
 try {
  const existingUser = await User.findOne({ phone_number: user.phone_number });
  if (existingUser) return;

  const newUser = {
   phone_number: user.phone_number,
   premium: false,
   premiumUntil: null,
   banned: false,
   bannedUntil: null,
   username: user.username || "",
   last_active: null,
   usage: 0,
  };

  await new User(newUser).save();
 } catch (err) {
  console.error("Failed to add user", err);
 }
};

exports.getUser = async function (phone_number) {
 try {
  return await User.findOne({ phone_number });
 } catch (err) {
  console.error("Failed to retrieve user", err);
  return null;
 }
};

exports.banUser = async function (phone_number, durationStr) {
 try {
  const ms = parseDuration(durationStr);
  if (!ms) return "Invalid duration format. Use 1d, 7d, 1w, etc.";

  const user = await User.findOne({ phone_number });
  if (!user) return "User not found.";

  const now = moment();
  const current = moment(user.bannedUntil);
  const baseTime = current.isValid() && current.isAfter(now) ? current : now;

  const newBanUntil = new Date(baseTime.valueOf() + ms);
  user.banned = true;
  user.bannedUntil = newBanUntil;

  await user.save();

  const formatted = moment(newBanUntil).tz("Asia/Jakarta").format("YYYY/MM/DD HH:mm:ss");
  return `🚫 User ${phone_number} banned until ${formatted}`;
 } catch (err) {
  console.error("Failed to ban user:", err);
  return "An error occurred while banning user.";
 }
};

exports.setPremium = async function (phone_number, durationStr) {
 try {
  const ms = parseDuration(durationStr); // eg: 7d => 604800000
  if (!ms || isNaN(ms)) return "⚠️ Invalid duration format. Use formats like `1d`, `7d`, `2w`, etc.";

  const user = await User.findOne({ phone_number });
  if (!user) return "❌ User not found.";

  const now = moment();
  const currentPremiumUntil = moment(user.premiumUntil);
  const baseTime = currentPremiumUntil.isValid() && currentPremiumUntil.isAfter(now) ? currentPremiumUntil : now;

  const newPremiumUntil = new Date(baseTime.valueOf() + ms);
  user.premium = true;
  user.premiumUntil = newPremiumUntil;

  await user.save();

  // Format output date
  const formattedDate = moment(newPremiumUntil)
   .tz("Asia/Tokyo") // atau "Asia/Jakarta"
   .format("YYYY/MM/DD HH:mm:ss");

  return `🌸 Premium added to ${phone_number}\n📅 Until: ${formattedDate}`;
 } catch (err) {
  console.error("❌ Failed to update premium status:", err);
  return "🚫 An error occurred while updating premium status.";
 }
};

exports.delPremium = async function (phone_number) {
 try {
  await User.updateOne({ phone_number }, { $set: { premium: false, premiumUntil: null } });
 } catch (err) {
  console.error("Failed to remove premium status", err);
 }
};

exports.unBan = async function (phone_number) {
 try {
  await User.updateOne({ phone_number }, { $set: { banned: false, bannedUntil: null } });
 } catch (err) {
  console.error("Failed to remove premium status", err);
 }
};

exports.findPremiumUsers = async function () {
 try {
  return await User.find({ premium: true });
 } catch (err) {
  console.error("Failed to show premium users", err);
 }
};

exports.checkPremiumStatus = async function (phone_number) {
 try {
  const user = await User.findOne({ phone_number });
  if (!user) return;

  const expiry = moment(user.premiumUntil);

  if (user.premium && expiry.isValid() && moment().isAfter(expiry)) {
   user.premium = false;
   user.premiumUntil = null;
   await user.save();
   console.log(`[⏰ Premium expired] ${phone_number}`);
  }
 } catch (err) {
  console.error("❌ Failed to check premium status:", err);
 }
};

exports.checkBanStatus = async function (phone_number) {
 try {
  const user = await User.findOne({ phone_number });
  if (!user) return;

  const expiry = moment(user.bannedUntil);

  if (user.banned && expiry.isValid() && moment().isAfter(expiry)) {
   user.banned = false;
   user.bannedUntil = null;
   await user.save();
   console.log(`[🔓 Unbanned] ${phone_number}`);
  }
 } catch (err) {
  console.error("❌ Failed to check banned status:", err);
 }
};

exports.getPremiumStatus = async function (phone_number) {
 try {
  const user = await User.findOne({ phone_number });
  return user ? user.premium : null;
 } catch (err) {
  console.error("Error fetching premium status:", err);
  return null;
 }
};

exports.getBannedStatus = async function (phone_number) {
 try {
  const user = await User.findOne({ phone_number });
  if (user?.bannedUntil && moment().isAfter(moment(user.bannedUntil))) {
   await exports.checkBanStatus(phone_number);
   return false;
  }
  return user?.banned || false;
 } catch (err) {
  console.error("Error fetching banned status:", err);
  return null;
 }
};

setInterval(async () => {
 try {
  const users = await User.find({
   $or: [{ premium: true }, { banned: true }],
  });

  for (const user of users) {
   await exports.checkPremiumStatus(user.phone_number);
   await exports.checkBanStatus(user.phone_number);
  }
 } catch (err) {
  console.error("Status check interval failed:", err);
 }
}, 60 * 60 * 1000);
