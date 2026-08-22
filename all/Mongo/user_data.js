const { UserData, connectDB, isMongoConnected } = require("./mongoose");
const { getNextRankByLevel, getRankByLevel } = require("./leveling");

connectDB().catch(() => {});

exports.addUser = async function (user) {
 if (!user?._id) return;
 const nameSafe = typeof user.name === "string" && user.name.trim() !== "" ? user.name : "Unknown";

 // Always maintain in local db
 if (!global.db?.data?.users) {
  if (!global.db) global.db = {};
  if (!global.db.data) global.db.data = {};
  if (!global.db.data.users) global.db.data.users = {};
 }
 if (!global.db.data.users[user._id]) {
  global.db.data.users[user._id] = {};
 }
 const local = global.db.data.users[user._id];
 if (!local.name) local.name = nameSafe;
 if (!local.ppuser && user.ppuser) local.ppuser = user.ppuser;
 if (typeof local.exp !== "number") local.exp = 0;
 if (typeof local.level !== "number") local.level = 1;
 if (!local.rank) local.rank = getRankByLevel(local.level);

 if (isMongoConnected()) {
  try {
   let existing = await UserData.findById(user._id);
   if (existing) {
    if (!existing.name && user.name) existing.name = user.name;
    if (!existing.ppuser && user.ppuser) existing.ppuser = user.ppuser;
    await existing.save();
   } else {
    const newUser = new UserData({
     _id: user._id,
     name: nameSafe,
     ppuser: typeof user.ppuser === "string" ? user.ppuser : null,
     exp: local.exp,
     level: local.level,
     rank: local.rank,
    });
    await newUser.save();
   }
  } catch (err) {
   console.error("Failed to sync user to Mongo:", err.message);
  }
 }
};

exports.getUser = async function (_id) {
 if (!_id) return null;
 const local = global.db?.data?.users?.[_id] || {};
 const level = local.level || 1;
 const exp = local.exp || 0;
 const rank = local.rank || getRankByLevel(level);
 const nextRank = getNextRankByLevel(level);

 if (isMongoConnected()) {
  try {
   const user = await UserData.findById(_id);
   if (user) {
    return {
     ...user.toObject(),
     nextRank: getNextRankByLevel(user.level || 1),
    };
   }
  } catch (err) {
   // fallback to local on error
  }
 }

 return {
  _id,
  name: local.name || "Unknown",
  ppuser: local.ppuser || null,
  exp,
  level,
  rank,
  nextRank,
 };
};

exports.topUsersLevel = async function (limit = 10) {
 if (isMongoConnected()) {
  try {
   const users = await UserData.find({}).sort({ level: -1, exp: -1 }).limit(limit).lean();
   if (users && users.length > 0) {
    return users.map((user, index) => ({
     rank: index + 1,
     id: user._id,
     name: user.name || "Unknown",
     level: user.level || 1,
     exp: user.exp || 0,
     title: user.rank || getRankByLevel(user.level || 1),
    }));
   }
  } catch (err) {
   console.error("topUsersLevel Mongo error:", err.message);
  }
 }

 // Fallback to local db users
 const localUsers = global.db?.data?.users || {};
 const sorted = Object.entries(localUsers)
  .map(([id, u]) => ({
   id,
   name: u.name || id.split("@")[0] || "Unknown",
   level: u.level || 1,
   exp: u.exp || 0,
   title: u.rank || getRankByLevel(u.level || 1),
  }))
  .sort((a, b) => b.level - a.level || b.exp - a.exp)
  .slice(0, limit);

 return sorted.map((u, index) => ({ ...u, rank: index + 1 }));
};

exports.getUserRank = async function (userId) {
 if (!userId) return null;
 if (isMongoConnected()) {
  try {
   const users = await UserData.find({}).sort({ level: -1, exp: -1 }).select("_id").lean();
   const rank = users.findIndex((user) => user._id.toString() === userId.toString());
   if (rank !== -1) {
    return { userId, rank: rank + 1 };
   }
  } catch (err) {
   // fallback to local
  }
 }

 const localUsers = global.db?.data?.users || {};
 const sorted = Object.entries(localUsers)
  .map(([id, u]) => ({ id, level: u.level || 1, exp: u.exp || 0 }))
  .sort((a, b) => b.level - a.level || b.exp - a.exp);

 const rank = sorted.findIndex((u) => u.id === userId);
 return rank === -1 ? null : { userId, rank: rank + 1 };
};
