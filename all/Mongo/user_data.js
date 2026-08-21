const { UserData, connectDB } = require("./mongoose");
const { getNextRankByLevel, getRankByLevel } = require("./leveling");

exports.addUser = async function (user) {
 try {
  let existing = await UserData.findById(user._id);
  if (existing) {
   if (!existing.name && user.name) existing.name = user.name;
   if (!existing.ppuser && user.ppuser) existing.ppuser = user.ppuser;
   await existing.save();
   return;
  }

  const nameSafe = typeof user.name === "string" && user.name.trim() !== "" ? user.name : "Unknown";

  const newUser = new UserData({
   _id: user._id,
   name: nameSafe,
   ppuser: typeof user.ppuser === "string" ? user.ppuser : null,
   exp: 0,
   level: 1,
   rank: "Beginner",
  });
  await newUser.save();
 } catch (err) {
  console.error("Failed to add user", err);
 }
};

exports.getUser = async function (_id) {
 try {
  const user = await UserData.findById(_id);
  if (!user) return null;
  const nextRank = getNextRankByLevel(user.level || 1);
  return { ...user.toObject(), nextRank };
 } catch (err) {
  console.error("Failed to get user", err);
  return null;
 }
};

exports.topUsersLevel = async function (limit = 10) {
 try {
  const users = await UserData.find({}).sort({ level: -1, exp: -1 }).limit(limit).lean();

  return users.map((user, index) => ({
   rank: index + 1,
   id: user._id,
   name: user.name || "Unknown",
   level: user.level,
   exp: user.exp,
   title: user.rank,
  }));
 } catch (err) {
  console.error(err);
  return [];
 }
};

exports.getUserRank = async function (userId) {
 try {
  const users = await UserData.find({}).sort({ level: -1, exp: -1 }).select("_id").lean();

  const rank = users.findIndex((user) => user._id.toString() === userId.toString());

  if (rank === -1) return null;

  return {
   userId,
   rank: rank + 1,
  };
 } catch (err) {
  console.error(err);
  return null;
 }
};
