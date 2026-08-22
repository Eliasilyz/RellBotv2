const { UserNumber, isMongoConnected } = require("./mongoose.js");

function isValidSender(sender) {
 return sender && !sender.includes("@newsletter") && sender.endsWith("@s.whatsapp.net");
}

async function handleNewUser(sender) {
 if (!isMongoConnected() || !isValidSender(sender)) return;
 try {
  const existing = await UserNumber.findOne({ number: sender });
  if (!existing) {
   await UserNumber.create({ number: sender });
  }
 } catch (err) {
  console.error("handleNewUser error:", err.message);
 }
}

async function loadUserList() {
 if (!isMongoConnected()) return [];
 try {
  const users = await UserNumber.find({});
  return users.map((u) => u.number);
 } catch (err) {
  console.error("loadUserList error:", err.message);
  return [];
 }
}

async function getAllNumbers() {
 if (!isMongoConnected()) return [];
 try {
  const numbers = await UserNumber.find().distinct("number");
  return numbers;
 } catch (err) {
  console.error("getAllNumbers error:", err.message);
  return [];
 }
}

module.exports = {
 handleNewUser,
 loadUserList,
 getAllNumbers,
};
