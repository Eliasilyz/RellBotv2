const fs = require("fs");
const Crypto = require("crypto");
const axios = require("axios");
const child_process = require("child_process");
const moment = require("moment-timezone");
const { unlink } = require("fs").promises;
const { sizeFormatter } = require("human-readable");
const util = require("util");
const Jimp = require("jimp");

const unixTimestampSeconds = (date = new Date()) => Math.floor(date.getTime() / 1000);

exports.unixTimestampSeconds = unixTimestampSeconds;

exports.formatter = (integer) => {
 let numb = parseInt(integer);
 return Number(numb).toLocaleString().replace(/,/g, ".");
};

exports.formatNumber = (integer) => {
 let numb = parseInt(integer);
 return Number(numb).toLocaleString().replace(/,/g, ".");
};

exports.formatNumber2 = (num) => {
 if (num >= 1e18) {
  return (num / 1e18).toFixed(1) + "QT";
 } else if (num >= 1e15) {
  return (num / 1e15).toFixed(1) + "Q";
 } else if (num >= 1e12) {
  return (num / 1e12).toFixed(1) + "T";
 } else if (num >= 1e9) {
  return (num / 1e9).toFixed(1) + "B";
 } else if (num >= 1e6) {
  return (num / 1e6).toFixed(1) + "M";
 } else if (num >= 1e3) {
  return (num / 1e3).toFixed(1) + "K";
 } else {
  return num;
 }
};

exports.Greetings = () => {
 const hour = moment().tz("Asia/Tokyo").hour();
 if (hour >= 4 && hour < 10) {
  return "☀️ おはよう";
 } else if (hour >= 10 && hour < 18) {
  return "🌤️ こんにちは";
 } else if (hour >= 18 && hour < 24) {
  return "🌙 こんばんは";
 } else {
  return "🌌 おやすみ";
 }
};

exports.randomNomor = async (ext) => {
 return `${Math.floor(Math.random() * 10000)}${ext}`;
};

exports.jsonFormat = (obj) => {
 try {
  let print = obj && (obj.constructor.name == "Object" || obj.constructor.name == "Array") ? require("util").format(JSON.stringify(obj, null, 2)) : require("util").format(obj);
  return print;
 } catch {
  return require("util").format(obj);
 }
};

exports.totalcase = () => {
 var file = fs.readFileSync("../../system.js").toString();
 var jumlah = (file.match(/case "/g) || []).length;
 return jumlah;
};

exports.generateMessageTag = (epoch) => {
 let tag = (0, exports.unixTimestampSeconds)().toString();
 if (epoch) tag += ".--" + epoch; // attach epoch if provided
 return tag;
};

exports.formatDate = function (dateInput) {
 const date = new Date(dateInput);
 return date.toLocaleString("ja-JP-u-ca-japanese", {
  timeZone: "Asia/Tokyo",
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
 });
};

exports.getJapanDate = function () {
 const now = new Date();
 const utc = now.getTime() + now.getTimezoneOffset() * 60000;
 return new Date(utc + 9 * 60 * 60000);
};

exports.processTime = (timestamp, now) => {
 return moment.duration(now - moment(timestamp * 1000)).asSeconds();
};

exports.getRandom = (ext) => {
 return `${Math.floor(Math.random() * 10000)}${ext}`;
};

exports.getBuffer = async (url, options) => {
 try {
  options ? options : {};
  const res = await axios({
   method: "get",
   url,
   headers: {
    DNT: 1,
    "Upgrade-Insecure-Request": 1,
   },
   ...options,
   responseType: "arraybuffer",
  });
  return res.data;
 } catch (err) {
  return err;
 }
};

exports.getImg = async (url, options) => {
 try {
  options ? options : {};
  const res = await axios({
   method: "get",
   url,
   headers: {
    DNT: 1,
    "Upgrade-Insecure-Request": 1,
   },
   ...options,
   responseType: "arraybuffer",
  });
  return res.data;
 } catch (err) {
  return err;
 }
};

exports.fetchJson = async (url, options) => {
 try {
  options ? options : {};
  const res = await axios({
   method: "GET",
   url: url,
   headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
   },
   ...options,
  });
  return res.data;
 } catch (err) {
  return err;
 }
};
exports.webp2mp4File = async (path) => {
 return new Promise((resolve, reject) => {
  const form = new BodyForm();
  form.append("new-image-url", "");
  form.append("new-image", fs.createReadStream(path));
  axios({
   method: "post",
   url: "https://s6.ezgif.com/webp-to-mp4",
   data: form,
   headers: {
    "Content-Type": `multipart/form-data; boundary=${form._boundary}`,
   },
  })
   .then(({ data }) => {
    const bodyFormThen = new BodyForm();
    const $ = cheerio.load(data);
    const file = $('input[name="file"]').attr("value");
    bodyFormThen.append("file", file);
    bodyFormThen.append("convert", "Convert WebP to MP4!");
    axios({
     method: "post",
     url: "https://ezgif.com/webp-to-mp4/" + file,
     data: bodyFormThen,
     headers: {
      "Content-Type": `multipart/form-data; boundary=${bodyFormThen._boundary}`,
     },
    })
     .then(({ data }) => {
      const $ = cheerio.load(data);
      const result = "https:" + $("div#output > p.outfile > video > source").attr("src");
      resolve({
       status: true,
       message: "Created By Rein",
       result: result,
      });
     })
     .catch(reject);
   })
   .catch(reject);
 });
};

exports.fetchUrl = async (url, options) => {
 try {
  options ? options : {};
  const res = await axios({
   method: "GET",
   url: url,
   headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
   },
   ...options,
  });
  return res.data;
 } catch (err) {
  return err;
 }
};

exports.WAVersion = async () => {
 let get = await exports.fetchUrl("https://web.whatsapp.com/check-update?version=1&platform=web");
 let version = [get.currentVersion.replace(/[.]/g, ", ")];
 return version;
};

exports.isNumber = (number) => {
 const int = parseInt(number);
 return typeof int === "number" && !isNaN(int);
};
exports.TelegraPh = (Path) => {
 return new Promise(async (resolve, reject) => {
  if (!fs.existsSync(Path)) return reject(new Error("File not Found"));
  try {
   const form = new BodyForm();
   form.append("file", fs.createReadStream(Path));
   const data = await axios({
    url: "https://telegra.ph/upload",
    method: "POST",
    headers: {
     ...form.getHeaders(),
    },
    data: form,
   });
   return resolve("https://telegra.ph" + data.data[0].src);
  } catch (err) {
   return reject(new Error(String(err)));
  }
 });
};
const sleepy = async (ms) => {
 return new Promise((resolve) => setTimeout(resolve, ms));
};
exports.buffergif = async (image) => {
 const filename = `${Math.random().toString(36)}`;
 await fs.writeFileSync(`../tmp/${filename}.gif`, image);
 child_process.exec(`ffmpeg -i ../tmp/${filename}.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ../tmp/${filename}.mp4`);
 await sleepy(4000);

 var buffer5 = await fs.readFileSync(`../tmp/${filename}.mp4`);
 Promise.all([unlink(`../tmp/${filename}.mp4`), unlink(`../tmp/${filename}.gif`)]);
 return buffer5;
};
exports.fetchBuffer = async (url, options) => {
 try {
  options ? options : {};
  const res = await axios({
   method: "GET",
   url,
   headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36",
    DNT: 1,
    "Upgrade-Insecure-Request": 1,
   },
   ...options,
   responseType: "arraybuffer",
  });
  return res.data;
 } catch (err) {
  return err;
 }
};
exports.runtime = function (seconds) {
 seconds = Number(seconds);
 var d = Math.floor(seconds / (3600 * 24));
 var h = Math.floor((seconds % (3600 * 24)) / 3600);
 var m = Math.floor((seconds % 3600) / 60);
 var s = Math.floor(seconds % 60);
 var dDisplay = d > 0 ? d + (d == 1 ? "d : " : "D : ") : "";
 var hDisplay = h > 0 ? h + (h == 1 ? "h : " : "H : ") : "";
 var mDisplay = m > 0 ? m + (m == 1 ? "m : " : "M : ") : "";
 var sDisplay = s > 0 ? s + (s == 1 ? "s" : "S") : "";
 return dDisplay + hDisplay + mDisplay + sDisplay;
};

exports.clockString = (ms) => {
 let h = isNaN(ms) ? "--" : Math.floor(ms / 3600000);
 let m = isNaN(ms) ? "--" : Math.floor(ms / 60000) % 60;
 let s = isNaN(ms) ? "--" : Math.floor(ms / 1000) % 60;
 return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(":");
};

exports.sleep = async (ms) => {
 return new Promise((resolve) => setTimeout(resolve, ms));
};

exports.isUrl = (url) => {
 return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, "gi"));
};

exports.getTime = (format, date) => {
 if (date) {
  return moment(date).locale("ja-JP-u-ca-japanese").format(format);
 } else {
  return moment.tz("Asia/Tokyok").locale("ja-JP-u-ca-japanese").format(format);
 }
};

exports.formatp = sizeFormatter({
 std: "JEDEC", //'SI' = default | 'IEC' | 'JEDEC'
 decimalPlaces: 2,
 keepTrailingZeroes: false,
 render: (literal, symbol) => `${literal} ${symbol}B`,
});

exports.json = (string) => {
 return JSON.stringify(string, null, 2);
};

function format(...args) {
 return util.format(...args);
}

exports.pickRandom = (arr) => {
 return arr[Math.floor(Math.random() * arr.length)];
};

exports.logic = (check, inp, out) => {
 if (inp.length !== out.length) throw new Error("Input and Output must have same length");
 for (let i in inp) if (util.isDeepStrictEqual(check, inp[i])) return out[i];
 return null;
};

exports.generateProfilePicture = async (buffer) => {
 const jimp = await Jimp.read(buffer);
 const min = jimp.getWidth();
 const max = jimp.getHeight();
 const cropped = jimp.crop(0, 0, min, max);
 return {
  img: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG),
  preview: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG),
 };
};

exports.generateUserProfile = function (userData) {
 const {
  username,
  id,
  level = 1,
  exp = 0,
  requiredExp = 100,
  haremCount = 0,
  limit = 0,
  limitMax = 10,
  tickets = 0,
  rerollTickets = 0,
  gachaCount = 0,
  tradeCount = 0,
  isPremium = false,
  premiumUntil = "-",
  lastGacha = "-",
  dailyCooldown = "-",
  timezone = "Asia/Tokyo",
  registeredAt = "-",
 } = userData;

 const formatDate = (date) => (date && date !== "-" ? moment(date).tz(timezone).format("YY/MM/DD HH:mm") : "-");

 return `
👤 *プロフィール - ${username}*
🆔 ユーザーID: *${id}*

📊 *ステータス:*
• 🎚️ レベル: *${level}*
• 🔋 経験値: *${exp} / ${requiredExp} XP*
• 💞 ハーレム人数: *${haremCount}*
• 🎲 ガチャ回数: *${gachaCount}*

🎟️ *チケット:*
• 🔄 リロールチケット: *${tickets} 枚*
• 📦 リミット使用: *${50 - limit} / ${limitMax}*

💎 *プレミアム:*
• ステータス: *${isPremium ? "✅ 有効" : "❌ 無効"}*
${isPremium ? `• ⏳ 有効期限: *${formatDate(premiumUntil)}*` : ""}

🕒 *タイミング:*
• 🗓️ 最終ガチャ: *${formatDate(lastGacha)}*
• 📝 登録日: *${formatDate(registeredAt)}*

📅 更新日時: ${moment().tz(timezone).format("YY/MM/DD HH:mm")}
`.trim();
};

exports.bytesToSize = (bytes, decimals = 2) => {
 if (bytes === 0) return "0 Bytes";

 const k = 1024;
 const dm = decimals < 0 ? 0 : decimals;
 const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

 const i = Math.floor(Math.log(bytes) / Math.log(k));

 return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

exports.getSizeMedia = (path) => {
 return new Promise((resolve, reject) => {
  if (/http/.test(path)) {
   axios.get(path).then((res) => {
    let length = parseInt(res.headers["content-length"]);
    let size = exports.bytesToSize(length, 3);
    if (!isNaN(length)) resolve(size);
   });
  } else if (Buffer.isBuffer(path)) {
   let length = Buffer.byteLength(path);
   let size = exports.bytesToSize(length, 3);
   if (!isNaN(length)) resolve(size);
  } else {
   reject("I dont know what the error is");
  }
 });
};

exports.parseMention = (text = "") => {
 return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + "@s.whatsapp.net");
};

exports.getGroupAdmins = (participants) => {
 let admins = [];
 for (let i of participants) {
  i.admin === "superadmin" ? admins.push(i.id) : i.admin === "admin" ? admins.push(i.id) : "";
 }
 return admins || [];
};

exports.reSize = (buffer, ukur1, ukur2) => {
 return new Promise(async (resolve, reject) => {
  var baper = await Jimp.read(buffer);
  var ab = await baper.resize(ukur1, ukur2).getBufferAsync(Jimp.MIME_JPEG);
  resolve(ab);
 });
};

exports.GIFBufferToVideoBuffer = async (image) => {
 const filename = `${Math.random().toString(36)}`;
 await fs.writeFileSync(`../tmp/${filename}.gif`, image);
 child_process.exec(`ffmpeg -i ../tmp/${filename}.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ../tmp/${filename}.mp4`);
 await sleepy(4000);

 var buffer5 = await fs.readFileSync(`../tmp/${filename}.mp4`);
 Promise.all([unlink(`../tmp/${filename}.mp4`), unlink(`../tmp/${filename}.gif`)]);
 return buffer5;
};
