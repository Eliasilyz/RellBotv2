const { Waifu, User, Trade, isMongoConnected } = require("./mongoose.js");
const mongoose = require("mongoose");
const bostoken = require("@bostoken/waifu-gatcha");
const axios = require("axios");
const USERSTATUS = require("./user_status.js");

function getRarityName(star) {
 const rarities = {
  1: "⭐ C",
  2: "⭐⭐ R",
  3: "⭐⭐⭐ SR",
  4: "🌟🌟🌟🌟 UR",
  5: "✨✨✨ SSR",
 };
 return rarities[star] || "⭐ C";
}

function ensureLocalUser(userId) {
 if (!global.db?.data?.users) {
  if (!global.db) global.db = {};
  if (!global.db.data) global.db.data = {};
  if (!global.db.data.users) global.db.data.users = {};
 }
 if (!global.db.data.users[userId]) {
  global.db.data.users[userId] = {};
 }
 const u = global.db.data.users[userId];
 if (!Array.isArray(u.waifuCollection)) u.waifuCollection = [];
 if (typeof u.tickets !== "number") u.tickets = 0;
 if (typeof u.gachaCount !== "number") u.gachaCount = 0;
 if (typeof u.lastGacha !== "number") u.lastGacha = 0;
 return u;
}

async function getRandomWaifuFromPackage(userId) {
 const localUser = ensureLocalUser(userId);
 let attempt = 0;
 const maxAttempt = 10;

 while (attempt++ < maxAttempt) {
  const waifuData = bostoken.waifuGatcha();
  const waifuObj = {
   _id: waifuData.name.toLowerCase().replace(/[^a-z0-9]/g, "_"),
   name: waifuData.name,
   source: waifuData.anime,
   image: waifuData.picture,
   rarity: getRarityName(waifuData.star),
  };

  if (isMongoConnected()) {
   try {
    const existing = await Waifu.findOne({ name: waifuData.name, source: waifuData.anime });
    const waifuMongo =
     existing ||
     (await new Waifu({
      name: waifuData.name,
      source: waifuData.anime,
      image: waifuData.picture,
      rarity: getRarityName(waifuData.star),
     }).save());
    waifuObj._id = waifuMongo._id.toString();
   } catch (_) {}
  }

  const alreadyOwned = localUser.waifuCollection.find(
   (entry) => (entry.waifu?._id || entry.waifu)?.toString() === waifuObj._id.toString() || (entry.waifu?.name || entry.name) === waifuObj.name
  );

  if (!alreadyOwned) return waifuObj;
 }

 const fallbackData = bostoken.waifuGatcha();
 return {
  _id: fallbackData.name.toLowerCase().replace(/[^a-z0-9]/g, "_"),
  name: fallbackData.name,
  source: fallbackData.anime,
  image: fallbackData.picture,
  rarity: getRarityName(fallbackData.star),
 };
}

async function handleDailyGacha(userId) {
 const localUser = ensureLocalUser(userId);
 const isPremium = USERSTATUS.getPremiumStatus(userId);

 const now = Date.now();
 const lastGachaDate = new Date(localUser.lastGacha || 0);
 const today = new Date().setHours(0, 0, 0, 0);

 if (lastGachaDate < today) {
  localUser.gachaCount = 0;
 }

 const limit = isPremium ? 5 : 1;
 if (localUser.gachaCount >= limit) {
  return { cooldown: true, message: `⏳ Gacha limit reached. Use .reroll if you have tickets.` };
 }

 const waifu = await getRandomWaifuFromPackage(userId);
 if (!waifu) return { error: "Failed to fetch waifu. Please try again." };

 localUser.tempGacha = waifu;
 localUser.gachaCount += 1;
 localUser.lastGacha = now;

 if (isMongoConnected()) {
  User.findOne({ phone_number: userId }).then(async (u) => {
   if (u) {
    u.gachaCount = localUser.gachaCount;
    u.lastGacha = now;
    await u.save();
   }
  }).catch(() => {});
 }

 return {
  status: true,
  data: waifu,
  message: `Type ".claim" to claim, ".skip" to skip.`,
 };
}

async function handleClaim(userId) {
 const localUser = ensureLocalUser(userId);
 if (!localUser.tempGacha) return { error: "No waifu to claim." };

 const waifu = localUser.tempGacha;
 localUser.waifuCollection.push({
  waifu: waifu,
  obtainedAt: new Date(),
 });
 localUser.tempGacha = null;

 if (isMongoConnected()) {
  User.findOne({ phone_number: userId }).then(async (u) => {
   if (u) {
    u.waifuCollection = localUser.waifuCollection.map((c) => ({
     waifu: c.waifu?._id || c.waifu,
     obtainedAt: c.obtainedAt || new Date(),
    }));
    u.tempGacha = null;
    await u.save();
   }
  }).catch(() => {});
 }

 return { message: `🎉 *${waifu.name || "Waifu"}* added to your collection!` };
}

async function handleSkip(userId) {
 const localUser = ensureLocalUser(userId);
 if (!localUser.tempGacha) return { error: "No waifu to skip." };
 localUser.tempGacha = null;
 return { message: "⏩ Skipped." };
}

async function rerollGacha(userId) {
 const localUser = ensureLocalUser(userId);
 if ((localUser.tickets || 0) <= 0) {
  return { error: "❌ Tickets not available. Earn more tickets or wait for tomorrow!" };
 }

 const waifu = await getRandomWaifuFromPackage(userId);
 if (!waifu) return { error: "Failed to fetch waifu. Please try again." };

 localUser.tempGacha = waifu;
 localUser.tickets -= 1;

 if (isMongoConnected()) {
  User.findOne({ phone_number: userId }).then(async (u) => {
   if (u) {
    u.tickets = localUser.tickets;
    await u.save();
   }
  }).catch(() => {});
 }

 return {
  status: true,
  data: waifu,
  message: "🎟️ Tickets are used for rerolls.",
 };
}

async function getUserHarem(userId) {
 const localUser = ensureLocalUser(userId);
 let collection = (localUser.waifuCollection || []).map((c) => c.waifu || c).filter(Boolean);

 if (isMongoConnected()) {
  try {
   const user = await User.findOne({ phone_number: userId }).populate("waifuCollection.waifu");
   if (user && user.waifuCollection?.length) {
    collection = user.waifuCollection.map((c) => c.waifu).filter(Boolean);
    localUser.waifuCollection = user.waifuCollection;
   }
  } catch (_) {}
 }

 if (!collection.length) {
  return { status: false, message: "Your harem is still empty. Use .waifu to start collecting!" };
 }

 return {
  status: true,
  data: collection,
  count: collection.length,
 };
}

async function checkTickets(userId) {
 const localUser = ensureLocalUser(userId);
 const tickets = localUser.tickets || 0;
 return {
  status: true,
  tickets,
  message: `🎟️ You have ${tickets} tickets.`,
 };
}

async function addTicket(userId, amount = 1) {
 const localUser = ensureLocalUser(userId);
 localUser.tickets = (localUser.tickets || 0) + amount;

 if (isMongoConnected()) {
  User.findOne({ phone_number: userId }).then(async (u) => {
   if (u) {
    u.tickets = localUser.tickets;
    await u.save();
   }
  }).catch(() => {});
 }

 return { status: true, message: `🎟️ ${amount} tickets added successfully.` };
}

async function addWaifu(data) {
 if (isMongoConnected()) {
  try {
   const waifu = new Waifu(data);
   await waifu.save();
   return { message: `Successfully added: ${waifu.name}` };
  } catch (e) {
   return { message: "Error: " + e.message };
  }
 }
 return { message: `Successfully added: ${data.name}` };
}

async function addWaifuImage(userId, imageUrl) {
 const localUser = ensureLocalUser(userId);
 if (localUser.tempGacha) {
  localUser.tempGacha.image = imageUrl;
 }
 if (isMongoConnected()) {
  try {
   const user = await User.findOne({ phone_number: userId });
   if (user?.tempGacha) {
    const waifu = await Waifu.findById(user.tempGacha);
    if (waifu) {
     waifu.image = imageUrl;
     await waifu.save();
    }
   }
  } catch (_) {}
 }
 return { message: `📷 Image updated.` };
}

// Step 1: A (premium) offer trade
async function initiateTrade(fromPhone, toPhone, waifuName) {
 const isPremium = USERSTATUS.getPremiumStatus(fromPhone);
 const fromLocal = ensureLocalUser(fromPhone);
 const toLocal = ensureLocalUser(toPhone);

 if (!isPremium) return { error: "Only premium users can initiate trades." };

 const offerEntry = (fromLocal.waifuCollection || []).find((c) => {
  const w = c.waifu || c;
  return w.name && w.name.toLowerCase() === waifuName.toLowerCase();
 });
 if (!offerEntry) return { error: "Waifu not found in your collection." };

 if (!global.db.data.trades) global.db.data.trades = {};
 const tradeId = `${fromPhone}_${toPhone}_${Date.now()}`;
 global.db.data.trades[tradeId] = {
  fromUser: fromPhone,
  toUser: toPhone,
  offerWaifu: offerEntry.waifu || offerEntry,
  status: "waiting_accept",
 };

 return { message: `Trade offer sent to ${toPhone}. Wait for response with .acctrade.`, tradeId };
}

// Step 2: B accept trade and offer own waifu
async function acceptTrade(toPhone, fromPhone, waifuName) {
 const toLocal = ensureLocalUser(toPhone);
 const trades = global.db?.data?.trades || {};
 const tradeEntry = Object.entries(trades).find(
  ([_, t]) => t.fromUser === fromPhone && t.toUser === toPhone && t.status === "waiting_accept"
 );

 if (!tradeEntry) return { error: "Trade not found or already processed." };
 const [tradeId, trade] = tradeEntry;

 const acceptEntry = (toLocal.waifuCollection || []).find((c) => {
  const w = c.waifu || c;
  return w.name && w.name.toLowerCase() === waifuName.toLowerCase();
 });
 if (!acceptEntry) return { error: "Your waifu was not found in your collection." };

 trade.acceptWaifu = acceptEntry.waifu || acceptEntry;
 trade.status = "waiting_confirm";

 return { message: `Trade accepted. ${fromPhone} can approve with .tradeyes.` };
}

// Step 3: A confirms and executes trade
async function confirmTrade(fromPhone) {
 const trades = global.db?.data?.trades || {};
 const tradeEntry = Object.entries(trades).find(
  ([_, t]) => t.fromUser === fromPhone && t.status === "waiting_confirm"
 );

 if (!tradeEntry) return { error: "There are no trades waiting for confirmation." };
 const [tradeId, trade] = tradeEntry;

 const fromLocal = ensureLocalUser(trade.fromUser);
 const toLocal = ensureLocalUser(trade.toUser);

 const removeFrom = (localU, waifu) => {
  const idx = localU.waifuCollection.findIndex((c) => {
   const w = c.waifu || c;
   return (w._id && w._id === waifu._id) || w.name === waifu.name;
  });
  if (idx >= 0) localU.waifuCollection.splice(idx, 1);
 };

 removeFrom(fromLocal, trade.offerWaifu);
 removeFrom(toLocal, trade.acceptWaifu);

 fromLocal.waifuCollection.push({ waifu: trade.acceptWaifu, obtainedAt: new Date() });
 toLocal.waifuCollection.push({ waifu: trade.offerWaifu, obtainedAt: new Date() });

 trade.status = "completed";
 return { message: "✅ Trade successfully completed!" };
}

async function swaifu(query) {
 if (!query || typeof query !== "string") {
  return { success: false, message: "⚠️ Please enter a character name." };
 }
 const url = "https://graphql.anilist.co";

 const anilistQuery = {
  query: `
      query ($search: String) {
        Character(search: $search) {
          id
          name {
            full
            native
            alternative
          }
          gender
          description(asHtml: false)
          image {
            large
            medium
          }
          dateOfBirth {
            year
            month
            day
          }
          media(perPage: 5, sort: POPULARITY_DESC) {
            nodes {
              id
              title {
                romaji
                english
                native
              }
              type
            }
          }
          siteUrl
          favourites
        }
      }
    `,
  variables: {
   search: query,
  },
 };

 try {
  const response = await axios.post(url, anilistQuery, {
   headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
   },
  });

  const char = response.data?.data?.Character;
  if (!char) {
   return {
    success: false,
    message: `Character "${query}" not found.`,
   };
  }

  const birthDate = char.dateOfBirth;
  const formattedBirthDate = birthDate?.day && birthDate?.month ? `${birthDate.day}-${birthDate.month}` + (birthDate.year ? `-${birthDate.year}` : "") : "Unknown";

  const cleanDesc = (char.description || "No description available.").replace(/<[^>]+>/g, "").split("\n")[0];

  const relatedMedia = (char.media?.nodes || []).map((m) => ({
   id: m.id,
   title: m.title.romaji || m.title.english || m.title.native || "-",
   type: m.type,
  }));

  const result = {
   success: true,
   id: char.id,
   name: {
    full: char.name.full,
    native: char.name.native,
    alternative: char.name.alternative,
   },
   gender: char.gender || "Unknown",
   image: {
    large: char.image?.large,
    medium: char.image?.medium,
   },
   description: cleanDesc,
   birthDate: formattedBirthDate,
   favourites: char.favourites || 0,
   relatedMedia,
   siteUrl: char.siteUrl,
  };

  return result;
 } catch (err) {
  console.error("swaifu error:", err.message);
  return {
   success: false,
   message: "An error occurred while fetching data from AniList.",
  };
 }
}

async function removeWaifu(userPhone, waifuName) {
 const localUser = ensureLocalUser(userPhone);
 const index = (localUser.waifuCollection || []).findIndex((c) => {
  const w = c.waifu || c;
  return w.name && w.name.toLowerCase() === waifuName.toLowerCase();
 });

 if (index === -1) return { error: `❌ Kamu tidak memiliki waifu bernama ${waifuName}.` };
 const removed = localUser.waifuCollection.splice(index, 1)[0];

 if (isMongoConnected()) {
  try {
   const user = await User.findOne({ phone_number: userPhone });
   if (user) {
    user.waifuCollection = localUser.waifuCollection.map((c) => ({ waifu: c.waifu?._id || c.waifu }));
    await user.save();
   }
  } catch (_) {}
 }

 const wName = (removed?.waifu || removed)?.name || waifuName;
 return { message: `✅ Waifu *${wName}* berhasil dihapus dari koleksi kamu.` };
}

async function getHaremChar(name) {
 const usersWithWaifu = [];
 const localUsers = global.db?.data?.users || {};
 for (const [phone, u] of Object.entries(localUsers)) {
  const hasIt = (u.waifuCollection || []).some((c) => {
   const w = c.waifu || c;
   return w.name && w.name.toLowerCase() === name.toLowerCase();
  });
  if (hasIt) {
   usersWithWaifu.push({ phone_number: phone, username: u.name || u.username });
  }
 }

 const sampleWaifu = { name, source: "Anime", rarity: "⭐ C", image: global.imgreply || "" };
 return {
  status: true,
  user: usersWithWaifu,
  waifu: sampleWaifu,
 };
}

module.exports = {
 handleDailyGacha,
 handleClaim,
 handleSkip,
 rerollGacha,
 getUserHarem,
 addWaifu,
 initiateTrade,
 acceptTrade,
 confirmTrade,
 swaifu,
 removeWaifu,
 addTicket,
 checkTickets,
 getHaremChar,
};
