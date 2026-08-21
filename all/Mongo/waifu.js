const { Waifu, User, Trade } = require("./mongoose.js");
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

async function getRandomWaifuFromPackage(userId) {
 const user = await User.findOne({ phone_number: userId });
 if (!user || !user.waifuCollection) {
  throw new Error("The parameter 'user' is invalid or does not have a waifuCollection.");
 }

 let attempt = 0;
 const maxAttempt = 10;

 while (attempt++ < maxAttempt) {
  const waifuData = bostoken.waifuGatcha();

  const existing = await Waifu.findOne({ name: waifuData.name, anime: waifuData.anime });
  const waifu =
   existing ||
   (await new Waifu({
    name: waifuData.name,
    source: waifuData.anime,
    image: waifuData.picture,
    rarity: getRarityName(waifuData.star),
   }).save());

  const alreadyOwned = user.waifuCollection.find((entry) => entry.waifu?.toString() === waifu._id.toString());

  if (!alreadyOwned) return waifu;
 }

 return null; // Gagal dapat waifu unik
}

async function getRandomWaifu() {
 const count = await Waifu.countDocuments();
 const rand = Math.floor(Math.random() * count);
 return await Waifu.findOne().skip(rand);
}

async function handleDailyGacha(userId) {
 const user = await User.findOne({ phone_number: userId });
 const isPremium = !!(await USERSTATUS.getPremiumStatus(userId));
 if (!user) return { error: "User not found." };

 const now = Date.now();
 const lastGachaDate = new Date(user.lastGacha);
 const today = new Date().setHours(0, 0, 0, 0);

 // Reset gachaCount jika sudah hari baru
 if (lastGachaDate < today) {
  user.gachaCount = 0;
 }

 const limit = isPremium ? 5 : 1;

 if (user.gachaCount >= limit) {
  return { cooldown: true, message: `⏳ Gacha limit reached. Use .reroll if you have tickets.` };
 }

 const waifu = await getRandomWaifuFromPackage(userId);
 user.tempGacha = waifu._id;
 user.gachaCount += 1;
 user.lastGacha = now;
 await user.save();

 return {
  status: true,
  data: waifu,
  message: `Type ".claim" to claim, ".skip" to skip.`,
 };
}

async function handleClaim(userId) {
 const user = await User.findOne({ phone_number: userId });
 if (!user?.tempGacha) return { error: "No waifu to claim." };

 user.waifuCollection.push({ waifu: user.tempGacha });
 user.tempGacha = null;
 await user.save();

 return { message: "🎉 Waifu added to your collection!" };
}

async function handleSkip(userId) {
 const user = await User.findOne({ phone_number: userId });
 if (!user?.tempGacha) return { error: "No waifu to skip." };
 user.tempGacha = null;
 await user.save();
 return { message: "⏩ Skipped." };
}

async function rerollGacha(userId) {
 const user = await User.findOne({ phone_number: userId });
 if (!user) return { error: "User not found." };

 if (user.tickets <= 0) {
  return { error: "❌ Tickets not available." };
 }

 const waifu = await getRandomWaifuFromPackage(userId);

 user.tempGacha = waifu._id;
 user.tickets -= 1; // Kurangi tiket

 await user.save();

 return {
  status: true,
  data: waifu,
  message: "🎟️ Tickets are used for rerolls.",
 };
}

async function getUserHarem(userId) {
 const user = await User.findOne({ phone_number: userId }).populate("waifuCollection.waifu");
 if (!user) {
  return { status: false, message: "User not found." };
 }

 const collection = user.waifuCollection.map((c) => c.waifu).filter(Boolean);

 if (!collection.length) {
  return { status: false, message: "Your harem is still empty." };
 }

 return {
  status: true,
  data: collection,
  count: collection.length,
 };
}

async function checkTickets(userId) {
 const user = await User.findOne({ phone_number: userId });
 if (!user) return { error: "User not found." };

 return {
  status: true,
  tickets: user.tickets,
  message: `🎟️ You have ${user.tickets} tickets.`,
 };
}

async function addTicket(userId, amount = 1) {
 const user = await User.findOne({ phone_number: userId });
 if (!user) return { error: "User not found." };

 user.tickets += amount;
 await user.save();

 return { status: true, message: `🎟️ ${amount} tickets added successfully.` };
}

async function addWaifu(data) {
 const waifu = new Waifu(data);
 await waifu.save();
 return { message: `Successfully added: ${waifu.name}` };
}

async function addWaifuImage(userId, imageUrl) {
 const user = await User.findOne({ phone_number: userId });
 if (!user?.tempGacha) return { error: "No waifu currently being rolled." };

 const waifu = await Waifu.findById(user.tempGacha);
 waifu.image = imageUrl;
 await waifu.save();

 return { message: `📷 Image of ${waifu.name} updated.` };
}

// Step 1: A (premium) offer trade
async function initiateTrade(fromPhone, toPhone, waifuName) {
 const isPremium = !!(await USERSTATUS.getPremiumStatus(fromPhone));
 const fromUser = await User.findOne({ phone_number: fromPhone });
 const toUser = await User.findOne({ phone_number: toPhone });
 if (!isPremium) return { error: "Only premium users can initiate trades." };
 if (!toUser) return { error: "Destination user not found." };

 const offerEntry = fromUser.waifuCollection.find(async (c) => {
  const w = await Waifu.findById(c.waifu);
  return w.name.toLowerCase() === waifuName.toLowerCase();
 });
 if (!offerEntry) return { error: "Waifu not found in your collection." };

 const trade = new Trade({
  fromUser: fromUser._id,
  toUser: toUser._id,
  offerWaifu: offerEntry.waifu,
 });
 await trade.save();

 return { message: `Trade sent to ${toPhone}. Wait for response with .acctrade.`, tradeId: trade._id };
}

// Step 2: B accept trade and offer own waifu
async function acceptTrade(toPhone, fromPhone, waifuName) {
 const fromUser = await User.findOne({ phone_number: fromPhone });
 const toUser = await User.findOne({ phone_number: toPhone });
 if (!fromUser || !toUser) return { error: "One of the users was not found." };

 const trade = await Trade.findOne({ fromUser: fromUser._id, toUser: toUser._id, status: "waiting_accept" });
 if (!trade) return { error: "Trade not found or already processed." };

 const acceptEntry = toUser.waifuCollection.find(async (c) => {
  const w = await Waifu.findById(c.waifu);
  return w.name.toLowerCase() === waifuName.toLowerCase();
 });
 if (!acceptEntry) return { error: "Your waifu was not found." };

 trade.acceptWaifu = acceptEntry.waifu;
 trade.status = "waiting_confirm";
 await trade.save();

 return { message: `Trade accepted. ${fromPhone} can approve with .tradeyes.` };
}

// Step 3: A confirms and executes trade
async function confirmTrade(fromPhone) {
 const fromUser = await User.findOne({ phone_number: fromPhone });
 if (!fromUser) return { error: "User not found." };

 const trade = await Trade.findOne({ fromUser: fromUser._id, status: "waiting_confirm" });
 if (!trade) return { error: "There are no trades waiting for confirmation." };

 const toUser = await User.findById(trade.toUser);
 if (!toUser) return { error: "Destination user not found." };

 // Proses penghapusan dan pertukaran waifu
 const removeFrom = (user, waifuId) => {
  const index = user.waifuCollection.findIndex((c) => c.waifu.toString() === waifuId.toString());
  if (index >= 0) user.waifuCollection.splice(index, 1);
 };

 removeFrom(fromUser, trade.offerWaifu);
 removeFrom(toUser, trade.acceptWaifu);

 fromUser.waifuCollection.push({ waifu: trade.acceptWaifu });
 toUser.waifuCollection.push({ waifu: trade.offerWaifu });

 trade.status = "completed";
 await fromUser.save();
 await toUser.save();
 await trade.save();

 return { message: "✅ Trade successfully completed!" };
}

async function swaifu(query) {
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

  const char = response.data.data.Character;
  if (!char) {
   return {
    success: false,
    message: `Character "${query}" not found.`,
   };
  }

  const birthDate = char.dateOfBirth;
  const formattedBirthDate = birthDate?.day && birthDate?.month ? `${birthDate.day}-${birthDate.month}` + (birthDate.year ? `-${birthDate.year}` : "") : "Unknown";

  const cleanDesc = (char.description || "No description available.").replace(/<[^>]+>/g, "").split("\n")[0];

  const relatedMedia = char.media.nodes.map((m) => ({
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
    large: char.image.large,
    medium: char.image.medium,
   },
   description: cleanDesc,
   birthDate: formattedBirthDate,
   favourites: char.favourites || 0,
   relatedMedia,
   siteUrl: char.siteUrl,
  };

  return result;
 } catch (err) {
  console.error(err.message);
  return {
   success: false,
   message: "An error occurred while fetching data from AniList.",
  };
 }
}

async function removeWaifu(userPhone, waifuName) {
 const user = await User.findOne({ phone_number: userPhone });
 if (!user) return { error: "User tidak ditemukan." };

 const waifu = await Waifu.findOne({ name: new RegExp(`^${waifuName}$`, "i") });
 if (!waifu) return { error: "Waifu tidak ditemukan di database." };

 const index = user.waifuCollection.findIndex((c) => c.waifu.toString() === waifu._id.toString());
 if (index === -1) return { error: `❌ Kamu tidak memiliki waifu bernama ${waifuName}.` };

 user.collection.splice(index, 1);
 await user.save();

 return { message: `✅ Waifu *${waifu.name}* berhasil dihapus dari koleksi kamu.` };
}

async function getHaremChar(name) {
 try {
  const waifu = await Waifu.findOne({
   name: { $regex: new RegExp(`^${name}$`, "i") },
  });
  const id = typeof waifu._id === "string" ? new mongoose.Types.ObjectId(waifu._id) : waifu._id;
  const users = await User.find({
   "waifuCollection.waifu": id,
  }).select("phone_number username waifuCollection");

  return {
   status: true,
   user: users,
   waifu,
  };
 } catch (error) {
  console.error("getHaremChar error:", error);
  return null;
 }
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
