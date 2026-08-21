require("dotenv").config();
const fs = require("fs");
const chalk = require("chalk");
const moment = require("moment-timezone");

// ========== GLOBAL SETTINGS ========== //
global.owner = "6282334226291";
global.ownerName = "Farel Hanafi";
global.namabot = "楓「Kaede」";
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
global.mongoDB = process.env.MONGO_URL;

global.GROQ_API = process.env.GROQ_API;

// ========== RESPONSE MESSAGES ========== //
global.msg = {
    done: "[🤗] 操作が正常に完了しました！",
    wait: "[⏳] 少々お待ちください、リクエストを処理中です...",
    admin: "[❌] このコマンドはグループ管理者のみが使用できます。",
    adminbot: "[❌] この操作にはボットが管理者である必要があります。",
    group: "[❌] この機能はグループチャットでのみ使用できます。",
    acces: "[❌] このコマンドへのアクセス権がありません。",
    private: "[❌] この機能はプライベートチャットでのみ利用可能です。",
    endLimit: "[🕊️] 上限に達しました！最大50個、5分ごとに1個回復。プレミアムなら無制限！",
    error: "[❌] エラーが発生しました。1分後にもう一度お試しください。",
    prem: "[❌] この機能はプレミアムユーザー専用です。",
    owner: "[❌] このコマンドはボット所有者専用です。",
};

// ========== HOT-RELOAD ========== //
let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.redBright(`↻ Update detected in '${__filename}'`));
    delete require.cache[file];
    require(file);
});
