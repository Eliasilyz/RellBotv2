const fs = require("fs");
const os = require("os");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const webp = require("node-webpmux");
const chalk = require("chalk");
var crypto = require("crypto");

async function imageToWebp(media) {
 const tmpFileOut = path.join(os.tmpdir(), `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
 const tmpFileIn = path.join(os.tmpdir(), `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.jpg`);
 fs.writeFileSync(tmpFileIn, media);
 await new Promise((resolve, reject) => {
  ffmpeg(tmpFileIn)
   .on("error", reject)
   .on("end", () => resolve(true))
   .addOutputOptions([
    "-vcodec",
    "libwebp",
    "-vf",
    "scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1",
    "-lossless",
    "0",
    "-compression_level",
    "6",
    "-q:v",
    "90",
   ])
   .toFormat("webp")
   .save(tmpFileOut);
 });
 const buff = fs.readFileSync(tmpFileOut);
 if (fs.existsSync(tmpFileOut)) fs.unlinkSync(tmpFileOut);
 if (fs.existsSync(tmpFileIn)) fs.unlinkSync(tmpFileIn);
 return buff;
}

async function videoToWebp(media) {
 const tmpFileOut = path.join(os.tmpdir(), `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
 const tmpFileIn = path.join(os.tmpdir(), `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.mp4`);
 fs.writeFileSync(tmpFileIn, media);
 await new Promise((resolve, reject) => {
  ffmpeg(tmpFileIn)
   .on("error", reject)
   .on("end", () => resolve(true))
   .addOutputOptions([
    "-vcodec",
    "libwebp",
    "-vf",
    "scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1,split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=00000000:stats_mode=diff [p]; [b][p] paletteuse=dither=bayer:bayer_scale=3",
    "-loop",
    "0",
    "-ss",
    "00:00:00",
    "-t",
    "00:00:06",
    "-preset",
    "default",
    "-an",
    "-vsync",
    "0",
    "-q:v",
    "70",
    "-compression_level",
    "6",
   ])
   .toFormat("webp")
   .save(tmpFileOut);
 });
 const buff = fs.readFileSync(tmpFileOut);
 if (fs.existsSync(tmpFileOut)) fs.unlinkSync(tmpFileOut);
 if (fs.existsSync(tmpFileIn)) fs.unlinkSync(tmpFileIn);
 return buff;
}

async function writeExifImg(media, metadata = {}) {
 let wMedia = await imageToWebp(media);
 const tmpFileIn = path.join(os.tmpdir(), `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
 const tmpFileOut = path.join(os.tmpdir(), `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
 fs.writeFileSync(tmpFileIn, wMedia);
 if (metadata.packname || metadata.author) {
  const img = new webp.Image();
  const json = {
   "sticker-pack-name": metadata.packname || "",
   "sticker-pack-publisher": metadata.author || "",
   emojis: metadata.categories ? metadata.categories : [""],
  };
  const exifAttr = Buffer.from([0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
  const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8");
  const exif = Buffer.concat([exifAttr, jsonBuff]);
  exif.writeUIntLE(jsonBuff.length, 14, 4);
  await img.load(tmpFileIn);
  if (fs.existsSync(tmpFileIn)) fs.unlinkSync(tmpFileIn);
  img.exif = exif;
  await img.save(tmpFileOut);
  return tmpFileOut;
 } else {
  return tmpFileIn;
 }
}

async function writeExifVid(media, metadata = {}) {
 let wMedia = await videoToWebp(media);
 const tmpFileIn = path.join(os.tmpdir(), `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
 const tmpFileOut = path.join(os.tmpdir(), `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
 fs.writeFileSync(tmpFileIn, wMedia);
 if (metadata.packname || metadata.author) {
  const img = new webp.Image();
  const json = {
   "sticker-pack-name": metadata.packname || "",
   "sticker-pack-publisher": metadata.author || "",
   emojis: metadata.categories ? metadata.categories : [""],
  };
  const exifAttr = Buffer.from([0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
  const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8");
  const exif = Buffer.concat([exifAttr, jsonBuff]);
  exif.writeUIntLE(jsonBuff.length, 14, 4);
  await img.load(tmpFileIn);
  if (fs.existsSync(tmpFileIn)) fs.unlinkSync(tmpFileIn);
  img.exif = exif;
  await img.save(tmpFileOut);
  return tmpFileOut;
 } else {
  return tmpFileIn;
 }
}

async function writeExif(media, metadata = {}) {
 let wMedia = /webp/.test(media.mimetype) ? media.data : /image/.test(media.mimetype) ? await imageToWebp(media.data) : /video/.test(media.mimetype) ? await videoToWebp(media.data) : "";
 const tmpFileIn = path.join(os.tmpdir(), `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
 const tmpFileOut = path.join(os.tmpdir(), `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
 fs.writeFileSync(tmpFileIn, wMedia);
 if (metadata.packname || metadata.author) {
  const img = new webp.Image();
  const json = {
   "sticker-pack-name": metadata.packname || "",
   "sticker-pack-publisher": metadata.author || "",
   emojis: metadata.categories ? metadata.categories : [""],
  };
  const exifAttr = Buffer.from([0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
  const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8");
  const exif = Buffer.concat([exifAttr, jsonBuff]);
  exif.writeUIntLE(jsonBuff.length, 14, 4);
  await img.load(tmpFileIn);
  if (fs.existsSync(tmpFileIn)) fs.unlinkSync(tmpFileIn);
  img.exif = exif;
  await img.save(tmpFileOut);
  return tmpFileOut;
 } else {
  return tmpFileIn;
 }
}

module.exports = {
 imageToWebp,
 videoToWebp,
 writeExifImg,
 writeExifVid,
 writeExif,
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
 fs.unwatchFile(file);
 console.log(chalk.redBright(`Update ${__filename}`));
 delete require.cache[file];
 require(file);
});
