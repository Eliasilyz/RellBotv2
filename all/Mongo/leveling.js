const { UserData, connectDB, isMongoConnected } = require("./mongoose");

const RANKS = [
 { name: "ʙᴇɢɪɴɴᴇʀ", minLevel: 1 },
 { name: "ɴᴏᴠɪᴄᴇ", minLevel: 5 },
 { name: "ᴀᴘᴘʀᴇɴᴛɪᴄᴇ", minLevel: 10 },
 { name: "ᴡᴀʀʀɪᴏʀ", minLevel: 15 },
 { name: "ᴇʟɪᴛᴇ", minLevel: 20 },
 { name: "ꜱᴀᴍᴜʀᴀɪ", minLevel: 30 },
 { name: "ʀᴏɴɪɴ", minLevel: 40 },
 { name: "ʙᴜꜱʜɪ", minLevel: 50 },
 { name: "ʜᴀɴᴛᴇʀ", minLevel: 60 },
 { name: "ᴍᴀꜱᴛᴇʀ", minLevel: 70 },
 { name: "ꜱʜɪɴᴏʙɪ", minLevel: 80 },
 { name: "ᴛᴇɴꜱʜɪ", minLevel: 90 },
 { name: "ᴋᴇɴꜱʜɪɴ", minLevel: 100 },
 { name: "ʏᴀᴍɪ", minLevel: 120 },
 { name: "ᴋᴀɢᴇ", minLevel: 140 },
 { name: "ꜱᴀɢᴇ", minLevel: 160 },
 { name: "ᴅʀᴀɢᴏɴ", minLevel: 180 },
 { name: "ꜱᴇɪʀᴇɪ", minLevel: 200 },
 { name: "ʀʏᴜᴊɪɴ", minLevel: 230 },
 { name: "ᴛᴇɴɢᴜ", minLevel: 260 },
 { name: "ᴍʏᴛʜɪᴄ", minLevel: 300 },
 { name: "ᴛᴇɴᴋᴀ", minLevel: 340 },
 { name: "ꜱʜɪɴ ᴋᴀᴍɪ", minLevel: 380 },
 { name: "ᴋᴀᴍɪɢᴀᴍɪ", minLevel: 420 },
 { name: "ᴏᴛꜱᴜᴛꜱᴜᴋɪ", minLevel: 460 },
 { name: "ᴍᴀᴋᴀɪ", minLevel: 500 },
 { name: "ᴏɴᴍʏᴏᴊɪ", minLevel: 550 },
 { name: "ᴋᴜʀᴏɪ ᴛᴇɴꜱʜɪ", minLevel: 600 },
 { name: "ʜᴀᴋᴀɪ ɴᴏ ᴋᴀᴍɪ", minLevel: 650 },
 { name: "ꜱʜᴜʀᴀ ɴᴏ ᴋᴀᴍɪ", minLevel: 700 },
 { name: "ᴢᴇɴᴛꜱᴜ", minLevel: 750 },
 { name: "ꜱᴇɴꜱʜɪɴ", minLevel: 800 },
 { name: "ᴋᴀᴍɪ ɴᴏ ᴋɪꜱʜɪ", minLevel: 850 },
 { name: "ꜱʜɪɴ ᴍᴀᴏᴜ", minLevel: 900 },
 { name: "ᴇɴᴍᴀ ᴅᴀɪᴏᴜ", minLevel: 950 },
 { name: "ꜱᴇɪᴊᴜᴜʀᴏᴜ", minLevel: 1000 },
 { name: "ᴛᴇɴꜱᴇɪ ᴏᴜ", minLevel: 1100 },
 { name: "ᴋᴀᴍɪ ɴᴏ ᴍᴀᴏᴜ", minLevel: 1200 },
 { name: "ꜱʜɪɴ ꜱᴇᴋᴀɪ ɴᴏ ᴋᴀᴍɪ", minLevel: 1300 },
 { name: "ᴢᴇᴛꜱᴜᴇɴ ɴᴏ ᴋᴀᴍɪ", minLevel: 1500 },
 { name: "ɪɴꜱʜɪɴ ɴᴏ ᴋᴀɴᴀᴛᴀ", minLevel: 1700 },
 { name: "ᴍᴜɢᴇɴ ɴᴏ ᴛᴀᴋᴀɴᴏ", minLevel: 1900 },
 { name: "ᴋᴀᴍɪɴᴀʀɪ ɴᴏ ʀᴀɪᴏᴜ", minLevel: 2100 },
 { name: "ᴛᴇɴꜱᴀɪ ɴᴏ ꜱᴏᴜʀᴏ", minLevel: 2300 },
 { name: "ꜱʜɪɴ ᴏᴜ ɴᴏ ᴋᴀɴᴀᴍᴇ", minLevel: 2600 },
 { name: "ꜱᴀɪɢᴏ ɴᴏ ᴋᴀᴍɪ", minLevel: 3000 },
];

function getRequiredExp(level) {
 if (level <= 20) return Math.floor(level * 100);
 if (level <= 40) return Math.floor(level ** 1.8 * 50);
 if (level <= 60) return Math.floor(level ** 2.0 * 60);
 return Math.floor(level ** 2.2 * 70);
}

function getRankByLevel(level) {
 let rank = RANKS[0].name;
 for (let i = RANKS.length - 1; i >= 0; i--) {
  if (level >= RANKS[i].minLevel) {
   rank = RANKS[i].name;
   break;
  }
 }
 return rank;
}

function getNextRankByLevel(level) {
 for (let i = 0; i < RANKS.length; i++) {
  if (level < RANKS[i].minLevel) {
   return RANKS[i].name;
  }
 }
 return "basic";
}

async function levelup(sender, m, sock, qkontak, pushname) {
 try {
  if (!sender || typeof sender !== "string") return;
  const safeName = (typeof pushname === "string" && pushname.trim()) || "Unknown";

  // Update local database (always fast & available)
  if (!global.db?.data?.users) {
   if (!global.db) global.db = {};
   if (!global.db.data) global.db.data = {};
   if (!global.db.data.users) global.db.data.users = {};
  }
  if (!global.db.data.users[sender]) {
   global.db.data.users[sender] = {
    name: safeName,
    exp: 0,
    level: 1,
    rank: getRankByLevel(1),
   };
  }

  const localUser = global.db.data.users[sender];
  if (typeof localUser.exp !== "number") localUser.exp = 0;
  if (typeof localUser.level !== "number") localUser.level = 1;

  const now = new Date();
  const isActive = localUser.expMultiplierUntil && new Date(localUser.expMultiplierUntil) > now;
  const multiplier = isActive ? localUser.expMultiplier || 1 : 1;

  localUser.exp = Math.max(0, localUser.exp + 1 * multiplier);
  let leveledUp = false;

  while (localUser.exp >= getRequiredExp(localUser.level)) {
   localUser.exp -= getRequiredExp(localUser.level);
   localUser.level += 1;
   leveledUp = true;
  }

  localUser.rank = getRankByLevel(localUser.level);
  localUser.name = safeName;

  // Sync to Mongo in background if available
  if (isMongoConnected()) {
   UserData.findById(sender)
    .then(async (mongoUser) => {
     if (!mongoUser) {
      mongoUser = new UserData({
       _id: sender,
       name: safeName,
       exp: localUser.exp,
       level: localUser.level,
       rank: localUser.rank,
      });
     } else {
      mongoUser.name = safeName;
      mongoUser.exp = localUser.exp;
      mongoUser.level = localUser.level;
      mongoUser.rank = localUser.rank;
     }
     await mongoUser.save();
    })
    .catch((e) => console.error("Mongo sync level error:", e.message));
  }

  if (leveledUp) {
   const teks = `*${safeName}* Leveled up! 🎉
Check leaderboard: .toplevel
┌───⊷ *STATUS*
│ ◦ *Progress* : ${localUser.level - 1} ➠ ${localUser.level}
│ ◦ *Rank* : ${localUser.rank}
└───────────────`;

   await sock.sendMessage(
    m.chat,
    {
     text: teks,
     contextInfo: {
      showAdAttribution: true,
      mentionedJid: [m.sender],
      businessMessageForwardInfo: {
       businessOwnerJid: sock.decodeJid(sock.user.id),
      },
      forwardedNewsletterMessageInfo: {
       newsletterJid: global.idsaluran,
       newsletterName: `Hello ${safeName} ✨`,
      },
     },
    },
    { quoted: qkontak }
   );
  }
 } catch (err) {
  console.error("Levelup Error:", err);
 }
}

module.exports = {
 levelup,
 getRequiredExp,
 getRankByLevel,
 getNextRankByLevel,
};
