const { User, RedeemCode } = require("./mongoose");
const moment = require("moment");

// Parse durasi (e.g. 1d, 2w, 30m)
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

 return value * multipliers[unit];
}

function parseDurationToDate(durationStr) {
 const ms = parseDuration(durationStr);
 if (!ms) return null;
 return new Date(Date.now() + ms);
}

// ✅ Fungsi untuk menambahkan durasi premium ke user
async function addPremiumDuration(user, durationStr) {
 const ms = parseDuration(durationStr);
 if (!ms) return false;

 const now = moment();
 const current = moment(user.premiumUntil);
 const baseTime = current.isValid() && current.isAfter(now) ? current : now;

 user.premium = true;
 user.premiumUntil = baseTime.add(ms, "ms").toDate();
 await user.save();
 return true;
}

// 🎯 REDEEM KODE
async function redeemCode(userId, codeInput) {
 const codeObj = await RedeemCode.findOne({ code: codeInput.toUpperCase() });
 if (!codeObj) return { success: false, message: "❌ Code not found." };

 if (codeObj.expiresAt && new Date() > codeObj.expiresAt) return { success: false, message: "⚠️ This code has expired." };

 if (codeObj.usedBy.includes(userId)) return { success: false, message: "⚠️ You have already claimed this code." };

 if (codeObj.usedBy.length >= codeObj.maxUses) return { success: false, message: "⚠️ Codes have been used." };

 const user = await User.findOne({ phone_number: userId });
 if (!user) return { success: false, message: "❌ User not found." };

 switch (codeObj.reward.type) {
  case "premium":
   const durationStr = `${codeObj.reward.value}d`;
   const success = await addPremiumDuration(user, durationStr);
   if (!success) return { success: false, message: "❌ Invalid premium duration." };
   break;
  case "exp_multiplier": {
   const multiplier = Number(codeObj.reward.value.value);
   const durationStr = codeObj.reward.value.duration || "1d";
   if (!multiplier || isNaN(multiplier)) return { success: false, message: "❌ Invalid multiplier value." };
   const expiresAt = parseDurationToDate(durationStr);
   if (!expiresAt) return { success: false, message: "❌ Invalid duration format." };
   const userData = (await User.findById(userId)) || new UserData({ _id: userId });
   userData.expMultiplier = multiplier;
   userData.expMultiplierUntil = expiresAt;
   await userData.save();
   break;
  }

  // Tambahkan case reward lain sesuai sistemmu
  default:
   return { success: false, message: "⚠ Reward not recognized." };
 }

 codeObj.usedBy.push(userId);
 await codeObj.save();

 return { success: true, message: `✅ Code ${codeObj.code} successfully claimed!` };
}

// 🎁 BUAT KODE BARU
async function createCustomCode(code, rewardType, value, maxUses = 1, expiresInStr = null) {
 const exists = await RedeemCode.findOne({ code: code.toUpperCase() });
 if (exists) return { success: false, message: "❌ The code already exists." };

 const expiresAt = expiresInStr ? parseDurationToDate(expiresInStr) : undefined;

 const newCode = new RedeemCode({
  code: code.toUpperCase(),
  reward: { type: rewardType, value },
  usedBy: [],
  maxUses,
  expiresAt,
 });

 await newCode.save();
 return {
  success: true,
  message: `✅ Code ${newCode.code} successfully created!` + (expiresAt ? ` Valid until ${expiresAt.toLocaleString()}` : ""),
 };
}

// 📜 LIST KODE
async function listAllCodes() {
 const codes = await RedeemCode.find().sort({ createdAt: -1 });
 if (!codes.length) return "📭 There is no code at this time.";
 return codes.map((c) => `🆔 ${c.code} - ${c.reward.type} (${c.reward.value}) - ${c.usedBy.length}/${c.maxUses} used`).join("\n");
}

module.exports = {
 redeemCode,
 createCustomCode,
 listAllCodes,
};
