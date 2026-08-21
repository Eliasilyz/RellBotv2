const { UserNumber } = require("./mongoose.js");

function isValidSender(sender) {
 return sender && !sender.includes("@newsletter") && sender.endsWith("@s.whatsapp.net");
}

async function handleNewUser(sender) {
 if (!isValidSender(sender)) return;

 const existing = await UserNumber.findOne({ number: sender });
 if (!existing) {
  await UserNumber.create({ number: sender });
 }
}

async function loadUserList() {
 const users = await UserNumber.find({});
 return users.map((u) => u.number);
}
async function getAllNumbers() {
 const numbers = await UserNumber.find().distinct("number");
 return numbers;
}
module.exports = {
 handleNewUser,
 loadUserList,
 getAllNumbers,
};
