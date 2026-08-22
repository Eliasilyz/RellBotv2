require("../global");
const mongoose = require("mongoose");

function isMongoConnected() {
 return mongoose.connection.readyState === 1;
}

let isConnecting = false;

async function connectDB() {
 if (mongoose.connection.readyState === 1) return true;
 if (isConnecting) return false;

 const mongoUrl = (global.mongoDB || "").trim();
 if (!mongoUrl || (!mongoUrl.startsWith("mongodb://") && !mongoUrl.startsWith("mongodb+srv://"))) {
  console.log(color("[!] MONGO_URL not configured or invalid in .env. MongoDB features (waifu gacha, leveling, redeem) will be disabled.", "yellow"));
  return false;
 }

 try {
  isConnecting = true;
  await mongoose.connect(mongoUrl, {
   dbName: "mashadatabase",
   serverSelectionTimeoutMS: 5000,
  });
  isConnecting = false;
  console.log(color("[✔] DATABASE Ready"));
  return true;
 } catch (err) {
  isConnecting = false;
  console.log(color(`[✖] DATABASE Connection Failed: ${err.message}. Continuing without MongoDB.`, "red"));
  return false;
 }
}

// Attempt non-blocking connection
connectDB().catch(() => {});

// Schemas
const userSchema = new mongoose.Schema(
 {
  phone_number: { type: String, index: true },
  username: String,
  premium: Boolean,
  premiumUntil: Date,
  banned: Boolean,
  bannedUntil: Date,
  usage: Number,
  last_active: Date,
  waifuCollection: [
   {
    waifu: { type: mongoose.Schema.Types.ObjectId, ref: "Waifu" },
    obtainedAt: { type: Date, default: Date.now },
   },
  ],
  pGacha: { type: mongoose.Schema.Types.ObjectId, ref: "Waifu" },
  tempGacha: { type: mongoose.Schema.Types.ObjectId, ref: "Waifu" },
  tickets: { type: Number, default: 0 },
  lastGacha: { type: Date, default: 0 },
  gachaCount: { type: Number, default: 0 },
  lastGacha: { type: Date, default: 0 },
 },
 { timestamps: true }
);

const userDataSchema = new mongoose.Schema(
 {
  _id: String,
  name: { type: String, default: "Unknown" },
  ppuser: { type: String, default: null },
  exp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  rank: { type: String, default: "Beginner" },
 },
 { timestamps: true }
);

const redeemCodeSchema = new mongoose.Schema(
 {
  code: { type: String, unique: true },
  reward: {
   type: {
    type: String, // e.g. 'premium', 'coins', 'exp_multiplier'
    required: true,
   },
   value: {
    type: mongoose.Schema.Types.Mixed, // <== GANTI DARI Number KE Mixed
    required: true,
   },
  },
  usedBy: [{ type: String }], // phone_number
  maxUses: { type: Number, default: 1 },
  expiresAt: { type: Date },
 },
 { timestamps: true }
);

const waifuSchema = new mongoose.Schema(
 {
  name: { type: String, required: true },
  source: { type: String, default: "Unknown" },
  image: { type: String, required: true },
  rarity: {
   type: String,
   enum: ["⭐ C", "⭐⭐ R", "⭐⭐⭐ SR", "🌟🌟🌟🌟 UR", "✨✨✨ SSR"],
   default: "⭐ C",
  },
  description: { type: String, default: "No description" },
  createdAt: { type: Date, default: Date.now },
 },
 { timestamps: true }
);

const tradeSchemas = new mongoose.Schema(
 {
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  offerWaifu: { type: mongoose.Schema.Types.ObjectId, ref: "Waifu", required: true },
  acceptWaifu: { type: mongoose.Schema.Types.ObjectId, ref: "Waifu" },
  status: {
   type: String,
   enum: ["waiting_accept", "waiting_confirm", "completed", "rejected"],
   default: "waiting_accept",
  },
  createdAt: { type: Date, default: Date.now },
 },
 { timestamps: true }
);

const userNumberSchema = new mongoose.Schema({
 number: { type: String, unique: true, required: true },
});

// Models
const User = mongoose.model("User", userSchema, "users");
const UserData = mongoose.model("UserData", userDataSchema, "user_data");
const RedeemCode = mongoose.model("RedeemCode", redeemCodeSchema, "redeem_codes");
const Waifu = mongoose.model("Waifu", waifuSchema, "waifu_data");
const Trade = mongoose.model("Trade", tradeSchemas, "trade_data");
const UserNumber = mongoose.model("UserNumber", userNumberSchema, "user_jid");

module.exports = {
 connectDB,
 isMongoConnected,
 User,
 UserData,
 RedeemCode,
 Waifu,
 Trade,
 UserNumber,
};
