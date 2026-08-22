require("dotenv").config();
const fs = require("fs");
const chalk = require("chalk");
const moment = require("moment-timezone");

// ========== GLOBAL SETTINGS ========== //
global.owner = "6282334226291";
global.ownerName = "Farel Hanafi";
global.namabot = "楓「Kaede」";
global.namabot2 = "楓「Kaede」2k26";
global.mail = "farellh12@gmail.com";
global.idsaluran = "120363400223227222@newsletter";

global.packname = "楓「Kaede」";
global.author = `Date: ${moment.tz("Asia/Tokyo").format("DD/MM/YY")}\nBot: 0823-3422-6291`;

// ========== BEHAVIOR SETTINGS ========== //
global.autoread = true;
global.anticall = true;
global.autoreadsw = true;

// ========== MEDIA ========== //
global.imgreply = "https://files.catbox.moe/zv3f14.jpg";
global.thumb = "https://files.catbox.moe/rva3ue.png";

// ========== PAYMENT ========== //
global.dana = "0881-0269-50162";
global.gopay = "0881-0269-50162";
global.saweria = "https://saweria.co/rein122";
global.trakteer = "https://trakteer.id/rein122";
global.sociabuzz = "https://sociabuzz.com/franklinelias/tribe";

// ========== SECRETS ========== //
global.mongoDB = (process.env.MONGO_URL && process.env.MONGO_URL.trim()) || "";
global.GROQ_API = (process.env.GROQ_API && process.env.GROQ_API.trim()) || "";

// ========== RESPONSE MESSAGES ========== //
global.msg = {
    done: "[🤗] Successfully completed!",
    wait: "[⏳] Please wait, processing your request...",
    admin: "[❌] This command can only be used by group admins.",
    adminbot: "[❌] The bot must be an admin to perform this action.",
    group: "[❌] This feature can only be used in group chats.",
    acces: "[❌] You do not have permission to use this command.",
    private: "[❌] This feature is only available in private chats.",
    endLimit: "[🕊️] You have reached your limit! Max 50, recovers 1 every 5 minutes. Unlimited for Premium!",
    error: "[❌] An error occurred. Please try again in 1 minute.",
    prem: "[❌] This feature is for Premium users only.",
    owner: "[❌] This command is only for the bot owner.",
    mongoRequired: "[❌] Feature unavailable: MongoDB is not connected. Please set MONGO_URL in .env.",
    groqRequired: "[❌] Feature unavailable: GROQ_API key is not set. Please set GROQ_API in .env.",
};

// ========== HOT-RELOAD ========== //
let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.redBright(`↻ Update detected in '${__filename}'`));
    delete require.cache[file];
    require(file);
});
