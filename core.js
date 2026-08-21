require("./lib/listmenu.js");
const {
  downloadContentFromMessage,
  BufferJSON,
  WA_DEFAULT_EPHEMERAL,
  generateWAMessageFromContent,
  proto,
  generateWAMessageContent,
  generateWAMessage,
  prepareWAMessageMedia,
  areJidsSameUser,
  InteractiveMessage,
  getContentType,
} = require("@whiskeysockets/baileys");
const os = require("os");
const fs = require("fs");
const cp = require("child_process");
const http = require("http");
const QrCode = require("qrcode-reader");
const qrcode = require("qrcode");
const { promisify } = require("util");
const path = require("path");
const util = require("util");
const { color } = require("./lib/color.js");
const chalk = require("chalk");
const moment = require("moment-timezone");
const speed = require("performance-now");
const ms = (toMs = require("ms"));
const axios = require("axios");
const fetch = require("node-fetch");
const yts = require("yt-search");
const anon = require("./lib/menfess");
const ffmpeg = require("fluent-ffmpeg");
const { randomBytes } = require("crypto");
const googleTTS = require("google-tts-api");
const { translate } = require("@vitalets/google-translate-api");
const scp2 = require("./lib/scraper2.js");
const uploadImage = require("./lib/uploadImage.js");
require("dotenv").config();
const { exec, spawn, execSync } = require("child_process");
const { performance } = require("perf_hooks");
const ytdl = require("ytdl-core");
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);
const jimp = require("jimp");
const { G4F } = require("g4f");
const { tiktokdl } = require("tiktokdl");
const malScraper = require("mal-scraper");
const { mediafiredl } = require("@bochilteam/scraper");
const { File } = require("megajs");
const g4f = new G4F();
const {
  TelegraPh,
  UploadFileUgu,
  webp2mp4File,
  floNime,
} = require("./lib/uploader.js");
let TicTacToe = require("./lib/tictactoe");
let { genMath, modes } = require("./lib/math");
const {
  toAudio,
  toPTT,
  toVideo,
  addExifAvatar,
} = require("./lib/converter.js");
const {
  smsg,
  getGroupAdmins,
  formatp,
  formatDate,
  getTime,
  isUrl,
  await,
  sleep,
  clockString,
  msToDate,
  sort,
  toNumber,
  enumGetKey,
  runtime,
  fetchJson,
  getBuffer,
  json,
  delay,
  format,
  logic,
  generateProfilePicture,
  parseMention,
  getRandom,
  pickRandom,
  fetchBuffer,
  buffergif,
  GIFBufferToVideoBuffer,
  totalcase,
} = require("./lib/myfunc.js");
let githubstalk = require("./lib/scraper.js");
const cheerio = require("cheerio");
const {
  savefromV2,
  ChatGpt,
  searchfilm,
  tafsir,
  instagram4,
  capcutdl,
  instagram3,
  mediafiredll,
  cekkuota,
  tele,
  instagram2,
  ytPlayMp4,
  ytPlayMp3,
  kodepos,
  pinterest,
  igdl,
  textpro,
  mediafire,
  Tiktok,
  ephoto,
  luminAi,
  lirik,
} = require("./lib/rellmd.js");

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.green(`FILE UPDATED => ${__filename}`));
  delete require.cache[file];
  require(file);
});
const { xeon_antispam } = require("./lib/antispam.js");
//prem owner function
const {
  addSewa,
  getSewaExpired,
  getSewaPosition,
  expiredSewaCheck,
  checkSewa,
  getAllSewa,
} = require("./lib/premiun.js");
//mongodb
const {
  getExpired,
  RellPrem,
  removeUser,
  ListPremium,
  PerpanjangPrem,
  cekExpired,
  cekPrem,
  cekPremUser,
} = require("./MongoDB/function.js");
const { rellmduser } = require("./MongoDB/schema");
const { error } = require("console");
//data
let ntnsfw = JSON.parse(fs.readFileSync("./src/data/function/nsfw.json"));
let bad = JSON.parse(fs.readFileSync("./src/data/function/badword.json"));
let premium = JSON.parse(fs.readFileSync("./src/data/role/sewa.json"));
const owner = JSON.parse(fs.readFileSync("./src/data/role/owner.json"));
//media
const VoiceNoteRell = JSON.parse(
  fs.readFileSync("./media/database/xeonvn.json")
);
const StickerRell = JSON.parse(
  fs.readFileSync("./media/database/xeonsticker.json")
);
const ImageRell = JSON.parse(
  fs.readFileSync("./media/database/xeonimage.json")
);
const VideoRell = JSON.parse(
  fs.readFileSync("./media/database/xeonvideo.json")
);
//store database
const db_respon_list = JSON.parse(fs.readFileSync("./src/store/list.json"));
const rellverifedusers = JSON.parse(
  fs.readFileSync("./src/data/role/user.json")
);
//database
global.db.data = JSON.parse(fs.readFileSync("./src/database.json"));
if (global.db.data)
  global.db.data = {
    sticker: {},
    database: {},
    game: {},
    others: {},
    users: {},
    chats: {},
    settings: {},
    usage: {},
    ...(global.db.data || {}),
  };
let vote = (db.data.others.vote = []);
/* ~~~~~~~~~ DATA GAME ~~~~~~~~~ */
let _family100 = (global.db.data.game.family100 = []);
let tebaklagu = (global.db.data.game.tebaklagu = []);
let kuismath = (global.db.data.game.kuismath = []);
let tebakgambar = (global.db.data.game.tebalgambar = []);
let tebakkata = (global.db.data.game.tebakkata = []);
let tebakkalimat = (global.db.data.game.tebakkalimat = []);
let tebaklirik = (global.db.data.game.tebaklirik = []);
let tebaktebakan = (global.db.data.game.tebaktebakan = []);
let tebakbendera = (global.db.data.game.tebakbendera = []);
let tebakbendera2 = (global.db.data.game.tebakbendera2 = []);
let tebakkabupaten = (global.db.data.game.tebakkabupaten = []);
let tebakkimia = (global.db.data.game.tebakkimia = []);
let tebakasahotak = (global.db.data.game.tebakasahotak = []);
let tebaksiapakahaku = (global.db.data.game.tebaksiapakahaku = []);
let tebaksusunkata = (global.db.data.game.tebaksusunkata = []);
let tebaktekateki = (global.db.data.game.tebaktekateki = []);
let akinator = (global.db.data.game.akinator = []);
let tebakanime = (db.data.game.tebakanime = []);

//time
const zonawaktuwib = `${moment.tz("Asia/Jakarta").format("LL")} ${moment
  .tz("Asia/Jakarta")
  .format("LT")}`;
const xtime = moment.tz(`Asia/Jakarta`).format("HH:mm:ss");
const xdate = moment.tz(`Asia/Jakarta`).format("DD/MM/YYYY");
const ucapan = `${moment.tz("Asia/Jakarta").format("HH:MM:ss")}`;
if (xtime < "23:59:00") {
  var rellwaktu = `Good Night 🌌`;
}
if (xtime < "19:00:00") {
  var rellwaktu = `Good Evening 🌃`;
}
if (xtime < "18:00:00") {
  var rellwaktu = `Good Evening 🌃`;
}
if (xtime < "15:00:00") {
  var rellwaktu = `Good Afternoon 🌅`;
}
if (xtime < "11:00:00") {
  var rellwaktu = `Good Morning 🌄`;
}
if (xtime < "05:00:00") {
  var rellwaktu = `Good Morning 🌄`;
}
//function
const reSize = async (buffer, ukur1, ukur2) => {
  return new Promise(async (resolve, reject) => {
    var baper = await jimp.read(buffer);
    var ab = await baper.resize(ukur1, ukur2).getBufferAsync(jimp.MIME_JPEG);
    resolve(ab);
  });
};
async function Khodam(nama) {
  return new Promise(async (resolve, reject) => {
    await axios
      .get(`https://khodam.vercel.app/v2?nama=${nama}`)
      .then(({ data }) => {
        const $ = cheerio.load(data);

        const khodam = $(
          "span.__className_cad559.text-3xl.font-bold.text-rose-600"
        )
          .text()
          .trim();
        const caption = $(
          "div.mb-5.sm\\:mb-10.px-8.text-center.text-white\\/90"
        )
          .text()
          .trim();
        const result = {
          nama,
          khodam,
          caption,
        };
        resolve(result);
      })
      .catch(reject);
  });
}

//module
module.exports = rell = async (rell, m, msg, chatUpdate, store) => {
  try {
    const { type, quotedMsg, mentioned, now, fromMe } = m;
    var body =
      m.mtype === "conversation"
        ? m.message.conversation
        : m.mtype === "imageMessage"
          ? m.message.imageMessage.caption
          : m.mtype === "videoMessage"
            ? m.message.videoMessage.caption
            : m.mtype === "extendedTextMessage"
              ? m.message.extendedTextMessage.text
              : m.mtype === "buttonsResponseMessage"
                ? m.message.buttonsResponseMessage.selectedButtonId
                : m.mtype === "listResponseMessage"
                  ? m.message.listResponseMessage.singleSelectReply.selectedRowId
                  : m.mtype === "InteractiveResponseMessage"
                    ? JSON.parse(
                      m.message.interactiveResponseMessage.nativeFlowResponseMessage
                        .paramsJson
                    )?.id
                    : m.mtype === "templateButtonReplyMessage"
                      ? m.message.templateButtonReplyMessage.selectedId
                      : m.mtype === "messageContextInfo"
                        ? m.message.buttonsResponseMessage?.selectedButtonId ||
                        m.message.listResponseMessage?.singleSelectReply.selectedRowId ||
                        m.message.InteractiveResponseMessage.NativeFlowResponseMessage ||
                        m.text
                        : "";
    var budy = typeof m.text == "string" ? m.text : "";
    //prefix 1
    var prefix = [".", "/", "#", ",", "!"]
      ? /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi.test(body)
        ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi)[0]
        : ""
      : xprefix;
    const isCmd = body.startsWith(prefix);
    //prefix2 dan command2 khususnya untuk pengunduhan otomatis
    const prefix2 = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(body)
      ? body.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi)
      : ".";
    const isCmd2 = body.startsWith(prefix2);
    const command = body
      .replace(prefix, "")
      .trim()
      .split(/ +/)
      .shift()
      .toLowerCase();
    const args = body.trim().split(/ +/).slice(1);
    const full_args = body.replace(command, "").slice(1).trim();
    const pushname = m.pushName || "";
    const botNumber = await rell.decodeJid(rell.user.id);
    const sender = m.sender;
    const text = (q = args.join(" "));
    const from = m.key.remoteJid;
    const rellzymisc = m.quoted || m;
    const quoted =
      rellzymisc.mtype == "buttonsMessage"
        ? rellzymisc[Object.keys(rellzymisc)[1]]
        : rellzymisc.mtype == "templateMessage"
          ? rellzymisc.hydratedTemplate[
          Object.keys(rellzymisc.hydratedTemplate)[1]
          ]
          : rellzymisc.mtype == "product"
            ? rellzymisc[Object.keys(rellzymisc)[0]]
            : m.quoted
              ? m.quoted
              : m;
    const mime = (quoted.msg || quoted).mimetype || "";
    const qmsg = quoted.msg || quoted;
    const pric = /^#.¦|\\^/.test(body) ? body.match(/^#.¦|\\^/gi) : xprefix;
    const rellzybody = body.startsWith(pric);
    const isCommand = rellzybody
      ? body.replace(pric, "").trim().split(/ +/).shift().toLowerCase()
      : "";
    const sticker = [];
    //media
    const isMedia = /image|video|sticker|audio/.test(mime);
    const isImage = type == "imageMessage";
    const isVideo = type == "videoMessage";
    const isAudio = type == "audioMessage";
    const isDocument = type == "documentMessage";
    const isLocation = type == "locationMessage";
    const isContact = type == "contactMessage";
    const isSticker = type == "stickerMessage";
    const isText = type == "textMessage";
    const isQuotedText =
      type === "extendexTextMessage" && content.includes("textMessage");
    const isQuotedImage =
      type === "extendedTextMessage" && content.includes("imageMessage");
    const isQuotedLocation =
      type === "extendedTextMessage" && content.includes("locationMessage");
    const isQuotedVideo =
      type === "extendedTextMessage" && content.includes("videoMessage");
    const isQuotedSticker =
      type === "extendedTextMessage" && content.includes("stickerMessage");
    const isQuotedAudio =
      type === "extendedTextMessage" && content.includes("audioMessage");
    const isQuotedContact =
      type === "extendedTextMessage" && content.includes("contactMessage");
    const isQuotedDocument =
      type === "extendedTextMessage" && content.includes("documentMessage");
    const isRellMedia = m.mtype;
    //group
    const isGroup = m.key.remoteJid.endsWith("@g.us");
    const groupMetadata = m.isGroup
      ? await rell.groupMetadata(m.chat).catch((e) => { })
      : "";
    const groupName = m.isGroup ? groupMetadata.subject : pushname;
    const participants = m.isGroup ? await groupMetadata.participants : "";
    const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : "";
    const isGroupAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;
    const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false;
    const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;
    const groupOwner = m.isGroup ? groupMetadata.owner : "";
    const isGroupOwner = m.isGroup
      ? (groupOwner ? groupOwner : groupAdmins).includes(m.sender)
      : false;
    const AntiNsfw = m.isGroup ? ntnsfw.includes(from) : false;
    //user status
    const isCreator = ownernumber.includes(m.sender);
    const isUser = rellverifedusers.includes(sender);
    const isOwner = [botNumber, ...owner]
      .map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
      .includes(m.sender);
    const isPremium = "false"

    expiredSewaCheck(rell, m, premium);

    const ftextt = {
      key: {
        participant: "0@s.whatsapp.net",
        ...(m.from ? { remoteJid: `0@s.whatsapp.net` } : {}),
      },
      message: {
        extendedTextMessage: {
          text: "Rell-MD - WhatsApp Bot_",
          title: "",
        },
      },
    };
    //respon
    global.mess = {
      limit: "maaf silvia tolak limit kamu habis untuk hari ini",
      nsfw: "Nsfw Dimatikan untuk group ini!!",
      done: `berhasil nih ${pushname}`,
      error: `maaf ${pushname} sepertinya sistem kami ada eror`,
      success: `berhasil nih ${pushname}`,
      premium: "maaf silvia gabisa bantu kamu bukan member premium",
      akses: "maaf silvia gabisa bantu kamu gapunya akses",
      group: "maaf silvia gabisa bantu ini khusus group",
      private: "maaf silvia gabisa bantu ini khusus private",
      owner: "maaf silvia gabisa bantu ini kusus pembuat silvia aja",
      loading: "bentar ya silvia proses dulu",
    };
    //premium
    async function replyprem() {
      reply(
        `This feature is for premium user, contact the owner to become premium user`
      );
    }
    //script replier
    async function sendrellMessage(chatId, message, options = {}) {
      let generate = await generateWAMessage(chatId, message, options);
      let type2 = getContentType(generate.message);
      if ("contextInfo" in options)
        generate.message[type2].contextInfo = options?.contextInfo;
      if ("contextInfo" in message)
        generate.message[type2].contextInfo = message?.contextInfo;
      return await rell.relayMessage(chatId, generate.message, {
        messageId: generate.key.id,
      });
    }
    //chat ai

    //reply
    async function reply(teks) {
      m.reply(teks);
    }
    async function reply2(teks) {
      rell.sendMessage(
        m.chat,
        {
          text: teks,
          contextInfo: {
            externalAdReply: {
              showAdAttribution: true,
              title: botname,
              body: ownername,
              thumbnail: fs.readFileSync("./media/theme/cheemspic.jpg"),
              sourceUrl: `${wagc}`,
              mediaType: 1,
              renderLargerThumbnail: false,
            },
          },
        },
        { quoted: fkontak }
      );
    }

    let fstatus = {
      key: {
        fromMe: false,
        participant: `0@s.whatsapp.net`,
        ...(m.chat ? { remoteJid: "status@broadcast" } : {}),
      },
      message: {
        imageMessage: {
          url: "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc",
          mimetype: "image/jpeg",
          caption: botname,
          fileSha256: "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=",
          fileLength: "28777",
          height: 1080,
          width: 1079,
          mediaKey: "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=",
          fileEncSha256: "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=",
          directPath:
            "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69",
          mediaKeyTimestamp: "1610993486",
          jpegThumbnail: await reSize(thumb, 100, 100),
          scansSidecar:
            "1W0XhfaAcDwc7xh1R8lca6Qg/1bB4naFCSngM2LKO2NoP5RI7K+zLw==",
        },
      },
    };

    //Fake quoted
    const fpayment2 = {
      key: {
        remoteJid: "0@s.whatsapp.net",
        fromMe: false,
        id: `Rell 2k24`,
        participant: "0@s.whatsapp.net",
      },
      message: {
        requestPaymentMessage: {
          currencyCodeIso4217: "IDR",
          amount1000: 1,
          requestFrom: "0@s.whatsapp.net",
          noteMessage: { extendedTextMessage: { text: `Rell-MD` } },
          expiryTimestamp: 999999999,
          amount: { value: 91929291929, offset: 1000, currencyCode: "IDR" },
        },
      },
    };
    const fkontak = {
      key: {
        participants: "0@s.whatsapp.net",
        remoteJid: "status@broadcast",
        fromMe: false,
        id: "Halo",
      },
      message: {
        conversation: "Verified By WhatsApp",
      },
      participant: "0@s.whatsapp.net",
    };

    //database
    try {
      let isNumber = (x) => typeof x === "number" && !isNaN(x);
      let limitUser = premiumya === null ? "100" : "1000";
      let user = global.db.data.users[sender];
      if (typeof user !== "object") global.db.data.users[sender] = {};
      if (user) {
        if (!isNumber(user.afkTime)) user.afkTime = -1;
        if (!"limitGame") user.limitGame = limitUser;
        if (!("badword" in user)) user.badword = 0;
        if (!("title" in user)) user.title = "";
        if (!("serialNumber" in user))
          user.serialNumber = randomBytes(6).toString("hex");
        if (!("afkReason" in user)) user.afkReason = "";
        if (!("nick" in user)) user.nick = rell.getName(sender);
        if (!("gender" in user)) user.nick = "";
        if (!isPremium) user.premium = false;
        if (!("totalLimit" in user)) user.totalLimit = 0;
        if (!isNumber(user.limit)) user.limit = limitUser;
        if (!("totalhit" in user)) user.totalhit = 0;
      } else
        global.db.data.users[sender] = {
          serialNumber: randomBytes(5).toString("hex"),
          title: `${isPremium ? "Premium" : "User"}`,
          afkTime: -1,
          badword: 0,
          afkReason: "",
          nick: rell.getName(sender),
          gender: "",
          premium: `${isPremium ? "true" : "false"}`,
          limit: limitUser,
          limitGame: limitUser,
          totalLimit: 0,
          autoai: true,
          totalhit: 0,
        };

      let chats = global.db.data.chats[from];
      if (typeof chats !== "object") global.db.data.chats[from] = {};
      if (chats) {
        if (!("badword" in chats)) chats.badword = false;
        if (!("antiforeignnum" in chats)) chats.antiforeignnum = false;
        if (!("antibot" in chats)) chats.antibot = false;
        if (!("antiviewonce" in chats)) chats.antiviewonce = false;
        if (!("antispam" in chats)) chats.antispam = false;
        if (!("antimedia" in chats)) chats.media = false;
        if (!("antivirtex" in chats)) chats.antivirtex = false;
        if (!("antiimage" in chats)) chats.antiimage = false;
        if (!("antivideo" in chats)) chats.video = false;
        if (!("antiaudio" in chats)) chats.antiaudio = false;
        if (!("antipoll" in chats)) chats.antipoll = false;
        if (!("antisticker" in chats)) chats.antisticker = false;
        if (!("anticontact" in chats)) chats.anticontact = false;
        if (!("antilocation" in chats)) chats.antilocation = false;
        if (!("antidocument" in chats)) chats.antidocument = false;
        if (!("antilink" in chats)) chats.antilink = false;
        if (!("antilinkgc" in chats)) chats.antilinkgc = false;
        if (!("antipromotion" in chats)) chats.antipromotion = false;
      } else
        global.db.data.chats[from] = {
          badword: false,
          antiforeignnum: false,
          antibot: false,
          antiviewonce: false,
          antispam: false,
          antivirtex: false,
          antimedia: false,
          antiimage: false,
          antivideo: false,
          antiaudio: false,
          antipoll: false,
          antisticker: false,
          antilocation: false,
          antidocument: false,
          anticontact: false,
          antilink: false,
          antipromotion: false,
          antilinkgc: false,
        };

      let setting = global.db.data.settings[botNumber];
      if (typeof setting !== "object") global.db.data.settings[botNumber] = {};
      if (setting) {
        if (!("totalhit" in setting)) setting.totalhit = 0;
        if (!("totalError" in setting)) setting.totalError = 0;
        if (!("online" in setting)) setting.online = false;
        if (!("autosticker" in setting)) setting.autosticker = false;
        if (!("autodownload" in setting)) setting.autodownload = false;
        if (!("autobio" in setting)) setting.autobio = false;
        if (!("autoread" in setting)) setting.autoread = false;
        if (!("autorecordtype" in setting)) setting.autorecordtype = false;
        if (!("autorecord" in setting)) setting.autorecord = false;
        if (!("autotype" in setting)) setting.autotype = false;
        if (!("autoblocknum" in setting)) setting.autoblocknum = false;
        if (!("onlyindia" in setting)) setting.onlyindia = false;
        if (!("onlyindo" in setting)) setting.onlyindo = false;
        if (!("onlygrub" in setting)) setting.onlygrub = false;
        if (!("onlypc" in setting)) setting.onlypc = false;
        if (!("watermark" in setting)) setting.watermark = { packname, author };
        if (!("about" in setting))
          setting.about = {
            bot: { nick: rell.getName(botNumber), alias: botname },
            owner: {
              nick: rell.getName(global.ownernumber + "@s.whatsapp.net"),
              alias: global.ownernumber,
            },
          };
      } else
        global.db.data.settings[botNumber] = {
          totalhit: 0,
          totalError: 0,
          online: false,
          autosticker: false,
          autodownload: false,
          autobio: false,
          autoread: false,
          autoblocknum: false,
          onlyindia: false,
          onlyindo: false,
          onlygrub: false,
          onlypc: false,
          autorecordtype: false,
          autorecord: false,
          autotype: false,
          watermark: {
            packname: global.packname,
            author: global.author,
          },
          about: {
            bot: {
              nick: rell.getName(botNumber),
              alias: botname,
            },
            owner: {
              nick: rell.getName(global.ownernumber + "@s.whatsapp.net"),
              alias: global.ownernumber,
            },
          },
        };
    } catch (err) {
      console.log(err);
    }
    //mega download
    function formatBytes(bytes) {
      if (bytes === 0) return "0 Bytes";

      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    }
    // Grup Only
    if (!m.isGroup && !isOwner && db.data.settings[botNumber].onlygrub) {
      if (isCommand) {
        return reply(
          `Hello buddy! Because We Want to Reduce Spam, Please Use Bot in the Group Chat !\n\nIf you have issue please chat owner wa.me/${ownernumber}`
        );
      }
    }
    // Private Only
    if (!isOwner && db.data.settings[botNumber].onlypc && m.isGroup) {
      if (isCommand) {
        return reply(
          "Hello buddy! if you want to use this bot, please chat the bot in private chat"
        );
      }
    }

    if (!rell.public) {
      if (!isOwner) return;
    }
    if (db.data.settings[botNumber].online) {
      if (isCommand) {
        rell.sendPresenceUpdate("unavailable", from);
      }
    }
    if (db.data.settings[botNumber].autoread) {
      rell.readMessages([m.key]);
    }
    //auto type record
    if (db.data.settings[botNumber].autorecordtype) {
      if (isCommand) {
        let xeonmix = ["composing", "recording"];
        xeonmix2 = xeonmix[Math.floor(xeonmix.length * Math.random())];
        rell.sendPresenceUpdate(xeonmix2, from);
      }
    }
    if (db.data.settings[botNumber].autorecord) {
      if (isCommand) {
        let xeonmix = ["recording"];
        xeonmix2 = xeonmix[Math.floor(xeonmix.length * Math.random())];
        rell.sendPresenceUpdate(xeonmix2, from);
      }
    }
    if (db.data.settings[botNumber].autotype) {
      if (isCommand) {
        let xeonpos = ["composing"];
        rell.sendPresenceUpdate(xeonpos, from);
      }
    }

    //auto block number
    if (
      m.sender.startsWith(`${autoblocknumber}`) &&
      db.data.settings[botNumber].autoblocknum === true
    ) {
      return rell.updateBlockStatus(m.sender, "block");
    }
    if (
      !m.sender.startsWith("91") &&
      db.data.settings[botNumber].onlyindia === true
    ) {
      return rell.updateBlockStatus(m.sender, "block");
    }
    if (
      !m.sender.startsWith("62") &&
      db.data.settings[botNumber].onlyindo === true
    ) {
      return rell.updateBlockStatus(m.sender, "block");
    }
    if (
      !m.sender.startsWith(`${antiforeignnumber}`) &&
      db.data.chats[m.chat].antiforeignnum === true
    ) {
      if (isOwner || isAdmins || !isBotAdmins) return;
      rell.sendMessage(
        m.chat,
        {
          text: `Sorry buddy! you will be removed because the group admin/owner has enabled anti foreign number, only +${antiforeignnumber} country code is allowed to join the group`,
        },
        { quoted: fkontak }
      );
      await sleep(2000);
      await rell.groupParticipantsUpdate(m.chat, [m.sender], "remove");
    }
    let list = [];
    for (let i of owner) {
      list.push({
        displayName: await rell.getName(i),
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${pushname}\nFN:${pushname}\nitem1.TEL;waid=${sender.split("@")[0]
          }:${sender.split("@")[0]
          }\nitem1.X-ABLabel:Click here to chat\nitem2.EMAIL;type=INTERNET:${ytname}\nitem2.X-ABLabel:YouTube\nitem3.URL:${socialm}\nitem3.X-ABLabel:GitHub\nitem4.ADR:;;${location};;;;\nitem4.X-ABLabel:Region\nEND:VCARD`,
      });
    }
    //console log
    if (isCommand) {
      console.log(
        chalk.black(chalk.bgWhite("[ COMMAND ]")),
        chalk.white(command) + " " + chalk.magenta("From"),
        chalk.yellow(pushname),
        chalk.blueBright("In"),
        chalk.white(m.chat)
      );
      global.db.data.settings[botNumber].totalhit += 1;
      global.db.data.users[sender].totalhit += 1;
    }

    //antiviewonce
    if (
      db.data.chats[m.chat].antiviewonce &&
      m.isGroup &&
      m.mtype == "viewOnceMessageV2"
    ) {
      let val = { ...m };
      let msg =
        val.message?.viewOnceMessage?.message ||
        val.message?.viewOnceMessageV2?.message;
      delete msg[Object.keys(msg)[0]].viewOnce;
      val.message = msg;
      await rell.sendMessage(m.chat, { forward: val }, { quoted: fkontak });
    }

    //antispam kick
    if (db.data.chats[m.chat].antispam) {
      if (m.isGroup && m.message && xeon_antispam.isFiltered(from)) {
        console.log(
          `[SPAM]`,
          color(
            moment(m.messageTimestamp * 100).format("DD/MM/YYYY HH:mm:ss"),
            "yellow"
          ),
          color(`${command} [${args.length}]`),
          "from",
          color(m.pushName)
        );
        return await rell.groupParticipantsUpdate(m.chat, [m.sender], "remove");
      }
    }

    // Anti promotion
    if (db.data.chats[m.chat].antipromotion) {
      if (
        budy.match(
          `instagram booster|tiktok booster|ml booster|bgmi selling|selling uc|selling diamonds|selling coin|selling id|selling account|selling ids|buy account|sell account|buy id|sell id|instagram followers|tiktok followers|buy panel|sell panel|sell bug bot|buy bug bot|buy bot bug|sell bot bug|adminpanel5kpm|open jasa push member grup|yangmaubuypanelpm|admin panel 10k pm|Hanya menyediakan Jasa Push Member Grup|admin panel 5k pm|yang mau beli panel murah pm|list harga panel by|list harga vps|LIST HARGA VPS|OPEN JASA PUSH MEMBER GRUP|READY|Redy|LIST HARGA PANEL BY|list harga panel|menyediakan|MENYEDIAKAN|OPEN MURBUG|open|OPEN|PANEL READY|PANEL|PANNEL READY|panel|panel ready|pannel ready minat pm|mau panel pm|MAU PANNEL PM|Admin panel ready|ADMIN PANEL READY|Chat aja om ready selalu|OPEN JASA INSTALL|open jasa installMENYEDIAKAN JASA INSTALL|menyediakan jasa install`
        )
      ) {
        if (!isBotAdmins) return;
        if (isOwner) return;
        if (isAdmins) return;
        rell.sendMessage(m.chat, {
          delete: {
            remoteJid: m.chat,
          },
        });
      }
    }

    //ANTI VIRUS
    if (isGroup && db.data.chats[m.chat].antivirtex) {
      if (
        budy.includes("๒๒๒๒") ||
        budy.includes("ดุ") ||
        budy.includes("ผิดุท้เึางืผิดุท้เึางื") ||
        budy.includes("๑๑๑๑๑๑๑๑") ||
        budy.includes("৭৭৭৭৭৭৭৭") ||
        budy.includes("   ⃢   ⃢   ⃢  ") ||
        budy.includes(
          "*⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃᡃ⃟⃢ᡃ⃟⃢ᡃ⃟⃢ᡃ⃟⃢ᡃ⃟⃢ᡃ⃟⃢ᡃ⃟⃢ᡃ⃟⃢ᡃ⃟⃢ᡃ⃟⃢ᡃ⃟⃟⃢ᡃ⃢ᡃ⃢ᡃ⃢ᡃ⃢ᡃ⃢ᡃ⃢ᡃ⃢⃟⃢ᡃ⃢ᡃ⃢ᡃ⃢ᡃ⃢ᡃ⃢ᡃ⃢⃟⃟ᡃ⃟ᡃ⃟ᡃ⃢ᡃ⃢ᡃ⃢⃟⃢⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃᡃ⃟⃢ᡃ⃟⃢ᡃ⃟⃢ᡃ⃟⃢ᡃ⃟⃢ᡃ⃟⃢ᡃ⃟⃢ᡃ⃟⃢ᡃ⃟⃢ᡃ⃟⃢ᡃ⃟⃟⃢ᡃ⃢ᡃ⃢ᡃ⃢ᡃ⃢ᡃ⃢ᡃ⃢ᡃ⃢⃟⃢ᡃ⃢ᡃ⃢ᡃ⃢ᡃ⃢ᡃ⃢ᡃ⃢⃟⃟ᡃ⃟ᡃ⃟ᡃ⃢ᡃ⃢ᡃ⃢⃟⃢⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃᡃ⃟⃢ᡃ⃟⃢ᡃ⃟⃢ᡃ⃟⃢ᡃ⃟⃢ᡃ⃟⃢ᡃ⃟⃢ᡃ⃟⃢ᡃ⃟⃢ᡃ⃟⃢ᡃ⃟⃟⃢ᡃ⃢ᡃ⃢ᡃ⃢ᡃ⃢ᡃ⃢ᡃ⃢ᡃ⃢⃟⃢ᡃ⃢ᡃ⃢ᡃ⃢ᡃ⃢ᡃ⃢ᡃ⃢⃟⃟ᡃ⃟ᡃ⃟ᡃ⃢ᡃ⃢ᡃ⃢⃟⃢⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟ᡃ⃟"
        ) ||
        budy.includes("ผดิทุเ้ึางผืดิทุเ้") ||
        budy.includes(".*࡞ࣰࣰࣰࣲࣲࣲࣲࣩࣩࣩࣩࣶࣶ࣯࣯࣮࣮ࣦ࣯ࣨࣨࣨࣻࣻࣻࣼࣼࣼࣽࣽࣾࣷࣵࣴ࣬࣬࣬ࣤࣤࣧࣧ*") ||
        budy.includes("᥋") ||
        budy.includes("؁") ||
        budy.includes("ٯٯٯٯٯ")
      ) {
        if (isGroupAdmins) return reply("*VIRTEX DETECTED*");
        console.log(
          color("[KICK]", "red"),
          color("Received a virus text!", "yellow")
        );
        rell.sendText(
          m.chat,
          `*MARK AS READ*\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n *Virus sender here👇:* \nwa.me/${sender.split("@")[0]
          }`
        );
        if (!isBotAdmins) return;
        if (isOwner) return;
        rell.groupParticipantsUpdate(from, [sender], "remove");
        await rell.sendMessage(from, { delete: { remoteJid: m.chat } });
        rell.sendMessage(`${ownernumber}@s.whatsapp.net`, {
          text: `Hi Owner! wa.me/${sender.split("@")[0]
            } Detected Having Sent Virtex ${isGroup ? `in ${groupName}` : ""}`,
        });
      }
    }

    if (db.data.chats[m.chat].antibot) {
      if (m.isBaileys && m.fromMe == false) {
        if (isAdmins || !isBotAdmins) {
        } else {
          return await rell.groupParticipantsUpdate(
            m.chat,
            [m.sender],
            "remove"
          );
        }
      }
    }
    //anti media
    if (db.data.chats[m.chat].antimedia && isMedia) {
      if (isOwner || isAdmins || !isBotAdmins) {
      } else {
        let key = {};
        return rell.sendMessage(m.chat, {
          delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.key.id,
            participant: m.key.participant,
          },
        });
      }
    }
    if (db.data.chats[m.chat].image && isRellMedia) {
      if (isRellMedia === "imageMessage") {
        if (isOwner || isAdmins || !isBotAdmins) {
        } else {
          return rell.sendMessage(m.chat, {
            delete: {
              remoteJid: m.chat,
              fromMe: false,
              id: m.key.id,
              participant: m.key.participant,
            },
          });
        }
      }
    }
    if (db.data.chats[m.chat].antivideo && isRellMedia) {
      if (isRellMedia === "videoMessage") {
        if (isOwner || isAdmins || !isBotAdmins) {
        } else {
          return rell.sendMessage(m.chat, {
            delete: {
              remoteJid: m.chat,
              fromMe: false,
              id: m.key.id,
              participant: m.key.participant,
            },
          });
        }
      }
    }
    if (db.data.chats[m.chat].antisticker && isRellMedia) {
      if (isRellMedia === "stickerMessage") {
        if (isOwner || isAdmins || !isBotAdmins) {
        } else {
          return rell.sendMessage(m.chat, {
            delete: {
              remoteJid: m.chat,
              fromMe: false,
              id: m.key.id,
              participant: m.key.participant,
            },
          });
        }
      }
    }
    if (db.data.chats[m.chat].antiaudio && isRellMedia) {
      if (isRellMedia === "audioMessage") {
        if (isOwner || isAdmins || !isBotAdmins) {
        } else {
          return rell.sendMessage(m.chat, {
            delete: {
              remoteJid: m.chat,
              fromMe: false,
              id: m.key.id,
              participant: m.key.participant,
            },
          });
        }
      }
    }
    if (db.data.chats[m.chat].antipoll && isRellMedia) {
      if (isRellMedia === "pollCreationMessage") {
        if (isOwner || isAdmins || !isBotAdmins) {
        } else {
          return rell.sendMessage(m.chat, {
            delete: {
              remoteJid: m.chat,
              fromMe: false,
              id: m.key.id,
              participant: m.key.participant,
            },
          });
        }
      }
    }
    if (db.data.chats[m.chat].antilocation && isRellMedia) {
      if (isRellMedia === "locationMessage") {
        if (isOwner || isAdmins || !isBotAdmins) {
        } else {
          return rell.sendMessage(m.chat, {
            delete: {
              remoteJid: m.chat,
              fromMe: false,
              id: m.key.id,
              participant: m.key.participant,
            },
          });
        }
      }
    }
    if (db.data.chats[m.chat].antidocument && isRellMedia) {
      if (isRellMedia === "documentMessage") {
        if (isOwner || isAdmins || !isBotAdmins) {
        } else {
          return rell.sendMessage(m.chat, {
            delete: {
              remoteJid: m.chat,
              fromMe: false,
              id: m.key.id,
              participant: m.key.participant,
            },
          });
        }
      }
    }
    if (db.data.chats[m.chat].anticontact && isRellMedia) {
      if (isRellMedia === "contactMessage") {
        if (isOwner || isAdmins || !isBotAdmins) {
        } else {
          return rell.sendMessage(m.chat, {
            delete: {
              remoteJid: m.chat,
              fromMe: false,
              id: m.key.id,
              participant: m.key.participant,
            },
          });
        }
      }
    }
    //respond
    if (db.data.chats[m.chat].badword) {
      for (let bak of bad) {
        if (budy.includes(bak)) {
          let baduser = await db.data.users[sender].badword;
          await rell.sendMessage(m.chat, {
            delete: {
              remoteJid: m.chat,
            },
          });
        }
      }
    }

    //autosticker
    /*if (db.data.users[m.sender].autosticker) {
      if (m.key.fromMe) return;
      if (/image/.test(mime) && !/webp/.test(mime)) {
        let mediac = await quoted.download();
        rell.sendImageAsSticker(from, mediac, m, {
          packname: global.packname,
          author: global.author,
        });
        console.log(`Auto sticker detected`);
      } else if (/video/.test(mime)) {
        if ((quoted.msg || quoted).seconds > 11) return;
        let mediac = await quoted.download();
        rell.sendVideoAsSticker(from, mediac, m, {
          packname: global.packname,
          author: global.author,
        });
      }
    }*/

    if (db.data.chats[m.chat].antilinkgc) {
      if (budy.match(`chat.whatsapp.com`)) {
        if (isAdmins) return;
        if (m.key.fromMe) return;
        if (isOwner) return;
        let key = {};
        try {
          key.remoteJid = m.quoted
            ? m.quoted.fakeObj.key.remoteJid
            : m.key.remoteJid;
          key.fromMe = m.quoted ? m.quoted.fakeObj.key.fromMe : m.key.fromMe;
          key.id = m.quoted ? m.quoted.fakeObj.key.id : m.key.id;
          key.participant = m.quoted
            ? m.quoted.fakeObj.participant
            : m.key.participant;
        } catch (e) {
          console.error(e);
        }
        rell.sendMessage(m.chat, { delete: key });
      }
    }
    if (db.data.chats[m.chat].antilink) {
      if (budy.match("http") && budy.match("https")) {
        if (isAdmins) return;
        if (m.key.fromMe) return;
        if (isOwner) return;
        let key = {};
        try {
          key.remoteJid = m.quoted
            ? m.quoted.fakeObj.key.remoteJid
            : m.key.remoteJid;
          key.fromMe = m.quoted ? m.quoted.fakeObj.key.fromMe : m.key.fromMe;
          key.id = m.quoted ? m.quoted.fakeObj.key.id : m.key.id;
          key.participant = m.quoted
            ? m.quoted.fakeObj.participant
            : m.key.participant;
        } catch (e) {
          console.error(e);
        }
        rell.sendMessage(m.chat, { delete: key });
      }
    }
    //afk
    let mentionUser = [
      ...new Set([
        ...(m.mentionedJid || []),
        ...(m.quoted ? [m.quoted.sender] : []),
      ]),
    ];
    for (let jid of mentionUser) {
      let user = db.data.users[jid];
      if (!user) continue;
      let afkTime = user.afkTime;
      if (!afkTime || afkTime < 0) continue;
      let reason = user.afkReason || "";
      let botnumberssss = "6282334226291@s.whatsapp.net";
      if (m.sender === botnumberssss) return;
      reply(
        `Dia Sedang AFK ${reason ? "Dengan Alasan: " + reason : " "
          }\nDari ${clockString(new Date() - afkTime)}`.trim()
      );
    }
    if (db.data.users[m.sender].afkTime > -1) {
      let user = global.db.data.users[m.sender];
      reply(
        `Kamu Telah kembali dari afk\nAlasan: ${user.afkReason ? user.afkReason : ""
          }\nDurasi Afk: ${clockString(new Date() - user.afkTime)}`.trim()
      );
      user.afkTime = -1;
      user.afkReason = "";
    }

    //total features
    const totalfitur = () => {
      var mytext = fs.readFileSync("./core.js").toString();
      var numUpper = (mytext.match(/case "/g) || []).length;
      return numUpper;
    };

    //download status #ctto
    try {
      const textLower = m.text.toLowerCase();
      if (
        textLower === "download" ||
        textLower === "statusdown" ||
        textLower === "take" ||
        textLower === "send"
      ) {
        const quotedMessage = m.msg.contextInfo.quotedMessage;
        if (quotedMessage) {
          if (quotedMessage.imageMessage) {
            let imageCaption = quotedMessage.imageMessage.caption;
            let imageUrl = await rell.downloadAndSaveMediaMessage(
              quotedMessage.imageMessage
            );
            rell.sendMessage(m.chat, {
              image: { url: imageUrl },
              caption: imageCaption,
            });
            reply("*Downloading status...*");
          }
          if (quotedMessage.videoMessage) {
            let videoCaption = quotedMessage.videoMessage.caption;
            let videoUrl = await rell.downloadAndSaveMediaMessage(
              quotedMessage.videoMessage
            );
            rell.sendMessage(m.chat, {
              video: { url: videoUrl },
              caption: videoCaption,
            });
            reply("*Downloading status...*");
          }
        }
      }
    } catch (error) {
      console.error("Error in 'send message' handling:", error);
    }
    //autoreply
    for (let BhosdikaXeon of VoiceNoteRell) {
      if (budy === BhosdikaXeon) {
        let audiobuffy = fs.readFileSync(
          `./media/audio/${BhosdikaXeon}.mp3`
        );
        rell.sendMessage(
          m.chat,
          { audio: audiobuffy, mimetype: "audio/mp4", ptt: true },
          { quoted: fkontak }
        );
      }
    }
    for (let BhosdikaXeon of StickerRell) {
      if (budy === BhosdikaXeon) {
        let stickerbuffy = fs.readFileSync(
          `./media/sticker/${BhosdikaXeon}.webp`
        );
        rell.sendMessage(
          m.chat,
          { sticker: stickerbuffy },
          { quoted: fkontak }
        );
      }
    }
    for (let BhosdikaXeon of ImageRell) {
      if (budy === BhosdikaXeon) {
        let imagebuffy = fs.readFileSync(
          `./media/image/${BhosdikaXeon}.jpg`
        );
        rell.sendMessage(m.chat, { image: imagebuffy }, { quoted: fkontak });
      }
    }
    for (let BhosdikaXeon of VideoRell) {
      if (budy === BhosdikaXeon) {
        let videobuffy = fs.readFileSync(
          `./media/video/${BhosdikaXeon}.mp4`
        );
        rell.sendMessage(m.chat, { video: videobuffy }, { quoted: fkontak });
      }
    }

    // Respon Cmd with media
    if (
      isMedia &&
      m.msg.fileSha256 &&
      m.msg.fileSha256.toString("base64") in global.db.data.sticker
    ) {
      let hash = global.db.data.sticker[m.msg.fileSha256.toString("base64")];
      let { text, mentionedJid } = hash;
      let messages = await generateWAMessage(
        m.chat,
        { text: text, mentions: m.mentionedJid },
        {
          userJid: rell.user.id,
          quoted: m.quoted && m.quoted.fakeObj,
        }
      );
      messages.key.fromMe = areJidsSameUser(m.sender, rell.user.id);
      messages.key.id = m.key.id;
      messages.pushName = m.pushName;
      if (m.isGroup) messages.participant = m.sender;
      let msg = {
        ...chatUpdate,
        messages: [proto.WebMessageInfo.fromObject(messages)],
        type: "append",
      };
      rell.ev.emit("messages.upsert", msg);
    }

    //============= [LIST RESPONCE CHECKING START ]================
    if (m.mtype === "interactiveResponseMessage") {
      console.log("interactiveResponseMessage Detected!");
      let msg = m.message[m.mtype] || m.msg;
      if (msg.nativeFlowResponseMessage && !m.isBot) {
        let { id } = JSON.parse(msg.nativeFlowResponseMessage.paramsJson) || {};
        if (id) {
          let emit_msg = {
            key: { ...m.key }, // SET RANDOME MESSAGE ID
            message: { extendedTextMessage: { text: id } },
            pushName: m.pushName,
            messageTimestamp: m.messageTimestamp || 754785898978,
          };
          return rell.ev.emit("messages.upsert", {
            messages: [emit_msg],
            type: "notify",
          });
        }
      }
    }
    //============= [LIST RESPONCE CHECKING END ]================

    /* ~~~~~~~~~ RESPON CMD GAME~~~~~~~~~ */
    if (
      akinator.hasOwnProperty(m.sender.split("@")[0]) &&
      isCmd &&
      ["0", "1", "2", "3", "4", "5"].includes(body)
    ) {
      kuis = true;
      var { server, frontaddr, session, signature, question, step } =
        akinator[m.sender.split("@")[0]];
      if (step == "0" && budy == "5")
        reply("Maaf Anda telah mencapai pertanyaan pertama");
      var ini_url = `https://api.lolhuman.xyz/api/akinator/answer?apikey=${APIs.lolkey}&server=${server}&frontaddr=${frontaddr}&session=${session}&signature=${signature}&answer=${budy}&step=${step}`;
      var get_result = await fetchJson(ini_url);
      var get_result = get_result.result;
      if (get_result.hasOwnProperty("name")) {
        var ini_name = get_result.name;
        var description = get_result.description;
        ini_txt = `${ini_name} - ${description}\n\n`;
        ini_txt += "*Terima Kasih*\n*Powered By Rell-MD*";
        await rell
          .sendMessage(m.chat, {
            image: {
              url: get_result.image,
            },
            caption: ini_txt,
          })
          .then(() => {
            delete akinator[m.sender.split("@")[0]];
            fs.writeFileSync(
              "./src/data/akinator.json",
              JSON.stringify(akinator)
            );
          });
        return;
      }
      var { question, _, step } = get_result;
      ini_txt = `${question}\n\n`;
      ini_txt += "0 - Ya\n";
      ini_txt += "1 - Tidak\n";
      ini_txt += "2 - Saya Tidak Tau\n";
      ini_txt += "3 - Mungkin\n";
      ini_txt += "4 - Mungkin Tidak\n";
      ini_txt += "5 - Kembali ke Pertanyaan Sebelumnya";
      if (args[0] === "5") {
        var ini_url = `https://api.lolhuman.xyz/api/akinator/back?apikey=${APIs.lolkey}&server=${server}&frontaddr=${frontaddr}&session=${session}&signature=${signature}&answer=${budy}&step=${step}`;
        var get_result = await fetchJson(ini_url);
        var get_result = get_result.result;
        var { question, _, step } = get_result;
        ini_txt = `${question}\n\n`;
        ini_txt += "0 - Ya\n";
        ini_txt += "1 - Tidak\n";
        ini_txt += "2 - Saya Tidak Tau\n";
        ini_txt += "3 - Mungkin\n";
        ini_txt += "4 - Mungkin Tidak";
        ini_txt += "5 - Kembali ke Pertanyaan Sebelumnya";
      }
      rell.sendText(m.chat, ini_txt, m).then(() => {
        const data_ = akinator[m.sender.split("@")[0]];
        data_["question"] = question;
        data_["step"] = step;
        akinator[m.sender.split("@")[0]] = data_;
        fs.writeFileSync("./src/data/akinator.json", JSON.stringify(akinator));
      });
    }
    if (tebakgambar.hasOwnProperty(m.sender.split("@")[0]) && isCmd) {
      kuis = true;
      jawaban = tebakgambar[m.sender.split("@")[0]];
      if (budy.toLowerCase() == "nyerah") {
        await reply("*Anda Telah menyerah*");
        delete tebakgambar[m.sender.split("@")[0]];
      } else if (budy.toLowerCase() == jawaban) {
        await rell.sendText(
          m.chat,
          `🎮 Tebak Gambar 🎮\n\nJawaban Benar 🎉`,
          m
        );
        delete tebakgambar[m.sender.split("@")[0]];
      } else reply("*Jawaban Salah!*");
    }
    if (kuismath.hasOwnProperty(m.sender.split("@")[0]) && isCmd) {
      kuis = true;
      jawaban = kuismath[m.sender.split("@")[0]];
      if (budy.toLowerCase() == "nyerah") {
        await reply("*Anda Telah menyerah*");
        delete kuismath[m.sender.split("@")[0]];
      } else if (budy.toLowerCase() == jawaban) {
        await reply(
          `🎮 Kuis Matematika  🎮\n\nJawaban Benar 🎉\n\nIngin bermain lagi? kirim ${prefix}math mode`
        );
        delete kuismath[m.sender.split("@")[0]];
      } else reply("*Jawaban Salah!*");
    }
    if (tebakasahotak.hasOwnProperty(m.sender.split("@")[0]) && isCmd) {
      kuis = true;
      jawaban = tebakasahotak[m.sender.split("@")[0]];
      if (budy.toLowerCase() == "nyerah") {
        await reply("*Anda Telah menyerah*");
        delete tebakasahotak[m.sender.split("@")[0]];
      } else if (budy.toLowerCase() == jawaban) {
        await rell.sendText(m.chat, `🎮 Asah Otak 🎮\n\nJawaban Benar 🎉`, m);
        delete tebakasahotak[m.sender.split("@")[0]];
      } else reply("*Jawaban Salah!*");
    }
    if (tebaksiapakahaku.hasOwnProperty(m.sender.split("@")[0]) && isCmd) {
      kuis = true;
      jawaban = tebaksiapakahaku[m.sender.split("@")[0]];
      if (budy.toLowerCase() == "nyerah") {
        await reply("*Anda Telah menyerah*");
        delete tebaksiapakahaku[m.sender.split("@")[0]];
      } else if (budy.toLowerCase() == jawaban) {
        await rell.sendText(
          m.chat,
          `🎮 Siapakah Aku 🎮\n\nJawaban Benar 🎉`,
          m
        );
        delete tebaksiapakahaku[m.sender.split("@")[0]];
      } else reply("*Jawaban Salah!*");
    }
    if (tebaksusunkata.hasOwnProperty(m.sender.split("@")[0]) && isCmd) {
      kuis = true;
      jawaban = tebaksusunkata[m.sender.split("@")[0]];
      if (budy.toLowerCase() == "nyerah") {
        await reply("*Anda Telah menyerah*");
        delete tebaksusunkata[m.sender.split("@")[0]];
      } else if (budy.toLowerCase() == jawaban) {
        await rell.sendText(m.chat, `🎮 Susun Kata 🎮\n\nJawaban Benar 🎉`, m);
        delete tebaksusunkata[m.sender.split("@")[0]];
      } else reply("*Jawaban Salah!*");
    }
    if (tebakbendera.hasOwnProperty(m.sender.split("@")[0]) && isCmd) {
      kuis = true;
      jawaban = tebakbendera[m.sender.split("@")[0]];
      if (budy.toLowerCase() == "nyerah") {
        await reply("*Anda Telah menyerah*");
        delete tebakbendera[m.sender.split("@")[0]];
      } else if (budy.toLowerCase() == jawaban) {
        await rell.sendText(
          m.chat,
          `🎮 Tebak Gambar 🎮\n\nJawaban Benar 🎉`,
          m
        );
        delete tebakbendera[m.sender.split("@")[0]];
      } else reply("*Jawaban Salah!*");
    }
    if (tebakbendera2.hasOwnProperty(m.sender.split("@")[0]) && isCmd) {
      kuis = true;
      jawaban = tebakbendera2[m.sender.split("@")[0]];
      if (budy.toLowerCase() == "nyerah") {
        await reply("*Anda Telah menyerah*");
        delete tebakbendera2[m.sender.split("@")[0]];
      } else if (budy.toLowerCase() == jawaban) {
        await rell.sendText(
          m.chat,
          `🎮 Tebak Bendera 🎮\n\nJawaban Benar 🎉`,
          m
        );
        delete tebakbendera2[m.sender.split("@")[0]];
      } else reply("*Jawaban Salah!*");
    }
    if (tebakkabupaten.hasOwnProperty(m.sender.split("@")[0]) && isCmd) {
      kuis = true;
      jawaban = tebakkabupaten[m.sender.split("@")[0]];
      if (budy.toLowerCase() == "nyerah") {
        await reply("*Anda Telah menyerah*");
        delete tebakkabupaten[m.sender.split("@")[0]];
      } else if (budy.toLowerCase() == jawaban) {
        await rell.sendText(
          m.chat,
          `🎮 Tebak Kabupaten 🎮\n\nJawaban Benar 🎉`,
          m
        );
        delete tebakkabupaten[m.sender.split("@")[0]];
      } else reply("*Jawaban Salah!*");
    }
    if (tebakkimia.hasOwnProperty(m.sender.split("@")[0]) && isCmd) {
      kuis = true;
      jawaban = tebakkimia[m.sender.split("@")[0]];
      if (budy.toLowerCase() == "nyerah") {
        await reply("*Anda Telah menyerah*");
        delete tebakkimia[m.sender.split("@")[0]];
      } else if (budy.toLowerCase() == jawaban) {
        await rell.sendText(m.chat, `🎮 Tebak Kimia 🎮\n\nJawaban Benar 🎉`, m);
        delete tebakkimia[m.sender.split("@")[0]];
      } else reply("*Jawaban Salah!*");
    }
    if (tebaktekateki.hasOwnProperty(m.sender.split("@")[0]) && isCmd) {
      kuis = true;
      jawaban = tebaktekateki[m.sender.split("@")[0]];
      if (budy.toLowerCase() == "nyerah") {
        await reply("*Anda Telah menyerah*");
        delete tebaktekateki[m.sender.split("@")[0]];
      } else if (budy.toLowerCase() == jawaban) {
        await rell.sendText(m.chat, `🎮 Teka Teki 🎮\n\nJawaban Benar 🎉`, m);
        delete tebaktekateki[m.sender.split("@")[0]];
      } else reply("*Jawaban Salah!*");
    }
    if (tebaklagu.hasOwnProperty(m.sender.split("@")[0]) && isCmd) {
      kuis = true;
      jawaban = tebaklagu[m.sender.split("@")[0]];
      if (budy.toLowerCase() == "nyerah") {
        await reply("*Anda Telah menyerah*");
        delete tebaklagu[m.sender.split("@")[0]];
      } else if (budy.toLowerCase() == jawaban) {
        await rell.sendText(m.chat, `🎮 Tebak Lagu 🎮\n\nJawaban Benar 🎉`, m);
        delete tebaklagu[m.sender.split("@")[0]];
      } else reply("*Jawaban Salah!*");
    }
    if (tebakkata.hasOwnProperty(m.sender.split("@")[0]) && isCmd) {
      kuis = true;
      jawaban = tebakkata[m.sender.split("@")[0]];
      if (budy.toLowerCase() == "nyerah") {
        await reply("*Anda Telah menyerah*");
        delete tebakkata[m.sender.split("@")[0]];
      } else if (budy.toLowerCase() == jawaban) {
        await rell.sendText(m.chat, `🎮 Tebak Kata 🎮\n\nJawaban Benar 🎉`, m);
        delete tebakkata[m.sender.split("@")[0]];
      } else reply("*Jawaban Salah!*");
    }
    if (tebakkalimat.hasOwnProperty(m.sender.split("@")[0]) && isCmd) {
      kuis = true;
      jawaban = tebakkalimat[m.sender.split("@")[0]];
      if (budy.toLowerCase() == "nyerah") {
        await reply("*Anda Telah menyerah*");
        delete tebakkalimat[m.sender.split("@")[0]];
      } else if (budy.toLowerCase() == jawaban) {
        await rell.sendText(
          m.chat,
          `🎮 Tebak Kalimat 🎮\n\nJawaban Benar 🎉`,
          m
        );
        delete tebakkalimat[m.sender.split("@")[0]];
      } else reply("*Jawaban Salah!*");
    }
    if (tebaklirik.hasOwnProperty(m.sender.split("@")[0]) && isCmd) {
      kuis = true;
      jawaban = tebaklirik[m.sender.split("@")[0]];
      if (budy.toLowerCase() == "nyerah") {
        await reply("*Anda Telah menyerah*");
        delete tebaklirik[m.sender.split("@")[0]];
      } else if (budy.toLowerCase() == jawaban) {
        await rell.sendText(m.chat, `🎮 Tebak Lirik 🎮\n\nJawaban Benar 🎉`, m);
        delete tebaklirik[m.sender.split("@")[0]];
      } else reply("*Jawaban Salah!*");
    }
    if (tebaktebakan.hasOwnProperty(m.sender.split("@")[0]) && isCmd) {
      kuis = true;
      jawaban = tebaktebakan[m.sender.split("@")[0]];
      if (budy.toLowerCase() == "nyerah") {
        await reply("*Anda Telah menyerah*");
        delete tebaktebakan[m.sender.split("@")[0]];
      } else if (budy.toLowerCase() == jawaban) {
        await rell.sendText(
          m.chat,
          `🎮 Tebak Tebakan 🎮\n\nJawaban Benar 🎉`,
          m
        );
        delete tebaktebakan[m.sender.split("@")[0]];
      } else reply("*Jawaban Salah!*");
    }
    this.game = this.game ? this.game : {};
    let room = Object.values(this.game).find(
      (room) =>
        room.id &&
        room.game &&
        room.state &&
        room.id.startsWith("tictactoe") &&
        [room.game.playerX, room.game.playerO].includes(m.sender) &&
        room.state == "PLAYING"
    );
    if (room) {
      let ok;
      let isWin = !1;
      let isTie = !1;
      let isSurrender = !1;
      // reply(`[DEBUG]\n${parseInt(m.text)}`)
      if (!/^([1-9]|(me)?nyerah|surr?ender|off|skip)$/i.test(m.text)) return;
      isSurrender = !/^[1-9]$/.test(m.text);
      if (m.sender !== room.game.currentTurn) {
        // nek wayahku
        if (!isSurrender) return !0;
      }
      if (
        !isSurrender &&
        1 >
        (ok = room.game.turn(
          m.sender === room.game.playerO,
          parseInt(m.text) - 1
        ))
      ) {
        reply(
          {
            "-3": "Game telah berakhir",
            "-2": "Invalid",
            "-1": "Posisi Invalid",
            0: "Posisi Invalid",
          }[ok]
        );
        return !0;
      }
      if (m.sender === room.game.winner) isWin = true;
      else if (room.game.board === 511) isTie = true;
      let arr = room.game.render().map((v) => {
        return {
          X: "❌",
          O: "⭕",
          1: "1️⃣",
          2: "2️⃣",
          3: "3️⃣",
          4: "4️⃣",
          5: "5️⃣",
          6: "6️⃣",
          7: "7️⃣",
          8: "8️⃣",
          9: "9️⃣",
        }[v];
      });
      if (isSurrender) {
        room.game._currentTurn = m.sender === room.game.playerX;
        isWin = true;
      }
      let winner = isSurrender ? room.game.currentTurn : room.game.winner;
      let str = `Room ID: ${room.id}

${arr.slice(0, 3).join("")}
${arr.slice(3, 6).join("")}
${arr.slice(6).join("")}

${isWin
          ? `@${winner.split("@")[0]} Menang!`
          : isTie
            ? `Game berakhir`
            : `Giliran ${["", ""][1 * room.game._currentTurn]} (@${room.game.currentTurn.split("@")[0]
            })`
        }
: @${room.game.playerX.split("@")[0]}
: @${room.game.playerO.split("@")[0]}

Ketik *nyerah* untuk menyerah dan mengakui kekalahan`;
      if ((room.game._currentTurn ^ isSurrender ? room.x : room.o) !== m.chat)
        room[room.game._currentTurn ^ isSurrender ? "x" : "o"] = m.chat;
      if (room.x !== room.o)
        rell.sendText(room.x, str, m, {
          mentions: parseMention(str),
        });
      rell.sendText(room.o, str, m, {
        mentions: parseMention(str),
      });
      if (isTie || isWin) {
        delete this.game[room.id];
      }
    }

    //user db
    if (isCommand && !isUser) {
      rellverifedusers.push(sender);
      fs.writeFileSync(
        "./src/data/role/user.json",
        JSON.stringify(rellverifedusers, null, 2)
      );
    }

    const SESSION_FILE = "./lib/src/autoai.json";

    async function readSession() {
      return new Promise((resolve, reject) => {
        fs.readFile(SESSION_FILE, "utf-8", (err, data) => {
          if (err) {
            if (err.code === "ENOENT") {
              console.log("Session file not found, creating a new one.");
              resolve({});
            } else {
              console.error("Error reading session file:", err);
              reject(err);
            }
          } else {
            console.log("Session file read successfully.");
            resolve(JSON.parse(data));
          }
        });
      });
    }

    async function writeSession(data) {
      return new Promise((resolve, reject) => {
        fs.writeFile(
          SESSION_FILE,
          JSON.stringify(data, null, 2),
          "utf-8",
          (err) => {
            if (err) {
              console.error("Error writing session file:", err);
              reject(err);
            } else {
              console.log("Session file written successfully.");
              resolve();
            }
          }
        );
      });
    }

    async function autoai(body, m, senderId) {
      try {
        let session = await readSession();

        if (!session[senderId]) {
          session[senderId] = { room: false, aichat: [] };
        }

        const userSession = session[senderId];

        if (!m.fromMe && !m.isBot && userSession.room && body) {
          const messages = [
            {
              role: "system",
              content: `Ini roleplay, kamu adalah wanita bernama Vylin. Kamu cantik, baik hati, dan pandai merayu dengan logat nakal 💦. Kamu sekarang sedang berbicara dengan ${pushname}. Ingat, ${pushname} adalah lawan bicara mu sekarang!`,
            },
            ...userSession.aichat,
            {
              role: "user",
              content: body,
            },
          ];
          await g4f.chatCompletion(messages);

          const lolhuman = [
            {
              role: "user",
              content: `Hai 😋 namaku adalah ${pushname}, jangan berbicara dengan nada formal ke padaku, anggap aku teman ngobrol mu. kamu harus pake bahasa Indonesia yak🤣`,
            },
            {
              role: "assistant",
              content: `Salam kenal, nama ku Vylin, wanita si paling cantik dan imut🤭. Baiklah, aku akan berbicara seperti layaknya teman dekatmu`,
            },
            {
              role: "user",
              content: body,
            },
            {
              role: "assistant",
              content: mesg,
            },
          ];
          userSession.aichat = lolhuman;
          await writeSession(session);
        }
      } catch (e) {
        console.error("Error in autoai function:", e);
      }
    }

    async function openRoom(rell, senderId) {
      try {
        let session = await readSession();

        if (!session[senderId]) {
          session[senderId] = { room: false, aichat: [] }; // Initialize session if it doesn't exist
        }

        session[senderId].room = true;
        await writeSession(session);

        await reply(
          `${pushname} berhasil membuka room chat. Kini orang lain tidak bisa mengganggu percakapanmu dengan A.I. Ketik *.autoai off* untuk menutup sesi room saat ini. *Ingat untuk menutup room sebelum kamu pergi!*`
        );
      } catch (e) {
        console.error("Error in openRoom function:", e);
      }
    }

    async function closeRoom(rell, senderId) {
      try {
        let session = await readSession();

        if (!session[senderId]) {
          session[senderId] = { room: false, aichat: [] };
        }

        session[senderId].room = false;
        await writeSession(session);

        await reply(`Berhasil menutup room chat.`);
      } catch (e) {
        console.error("Error in closeRoom function:", e);
      }
    }
    //============= [ CASE START / FEATURE LIST ]================//
    switch (isCommand) {
      //Menfess Feature
      case "menfes":
      case "confess":
        if (Object.values(anon.anonymous).find((p) => p.check(sender)))
          return reply("You are still in the room");
        if (m.isGroup) return reply(mess.private);
        if (args.length < 1)
          return reply(
            `Use ${prefix + command} number|your message\nExample ${prefix + command
            } ${ownernumber}|Hi Owner`
          );
        if (text > 700) return reply(`The text is too long`);
        num = q.split("|")[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        pesan = q.split("|")[1];
        let cekno = await rell.onWhatsApp(num);
        if (cekno.length == 0)
          return reply(`Enter a valid and registered number on WhatsApp!!!`);
        if (num === m.sender) return reply(`Cannot Confess To Own Number!!!`);
        if (num === botNumber) return reply(`Can't Confess to bot number!!!`);
        var nomor = m.sender;

        const rellmenfess = `Hi, I'm a bot. Someone sent a message to you.

Someone your friend
(Secret Sender)

-------------------------------------->

💌 Message : ${pesan}

-------------------------------------->`;

        await rell.sendMessage(
          num,
          {
            text: rellmenfess,
            contextInfo: {
              mentionedJid: [sender],
              externalAdReply: {
                showAdAttribution: true,
                containsAutoReply: true,
                title: ` ${global.botname}`,
                body: `${ownername}`,
                previewType: "PHOTO",
                thumbnailUrl: ``,
                thumbnail: ``,
                sourceUrl: `${wagc}`,
              },
            },
          },
          { quoted: fkontak }
        );

        await rell.sendMessage(
          num,
          {
            text: `You can also reply to the message by sending a message, if you don't want to reply, please type .leave and enter send button`,
          },
          { quoted: fkontak }
        );
        lidt = `Success Sending Message
👤 From : wa.me/${nomor.split("@s.whatsapp.net")[0]}
👥 To : wa.me/${q.split("|")[0].replace(/[^0-9]/g, "")}

⬡──⬡─────────⬡──⬡

Your Message : ${pesan}

⬡──⬡─────────⬡──⬡`;
        var check = Object.values(anon.anonymous).find(
          (p) => p.state == "WAITING"
        );
        if (!check) {
          anon.createRoom(sender, num);
          console.log("[ CONFESS ] Creating room for: " + sender);
          return reply(lidt);
        }
        break;
      case "leave": {
        if (m.isGroup && isOwner && command == "leave")
          return rell.groupLeave(from);
        if (m.isGroup) return reply("Only private chat");
        let roommm = Object.values(anon.anonymous).find((p) => p.check(sender));
        if (!roommm) return reply("You are not in the room");
        reply("Bye...");
        var other = roommm.other(sender);
        delete anon.anonymous[roommm.id];
        if (other != "")
          rell.sendMessage(other, {
            text: "Bye...",
          });
        if (command == "leave") break;
      }
      //GROUP FEATURES
      case "addbadword":
      case "addbd":
        if (!isOwner) return reply(mess.owner);
        if (!groupAdmins) return reply(mess.admin);
        if (args.length < 1)
          return reply(
            `Send command ${prefix}addbadword [harsh word]. Example ${prefix}addbadword asshole`
          );
        bad.push(q);
        fs.writeFileSync(
          "./src/data/function/badword.json",
          JSON.stringify(bad)
        );
        reply("Successfully Added Bad Word!");
        break;
      case "delbadword":
      case "deldb":
        if (!isOwner) return reply(mess.owner);
        if (!groupAdmins) return reply(mess.admin);
        if (args.length < 1)
          return reply(
            `Send commands ${prefix}addbadword [bad word]. Example ${prefix}addbadword asshole`
          );
        bad.splice(q);
        fs.writeFileSync(
          "./src/data/function/badword.json",
          JSON.stringify(bad)
        );
        reply("Successfully Deleted Bad Word!");
        break;
      case "kick":
      case "kik": {
        if (!isAdmins && !isGroupOwner && !isOwner) return reply(mess.akses);
        if (!m.isGroup) return reply(mess.group);
        if (!isAdmins && !isGroupOwner && !isOwner) return reply(mess.akses);
        if (!isBotAdmins) return reply(mess.akses);
        let blockwww = m.mentionedJid[0]
          ? m.mentionedJid[0]
          : m.quoted
            ? m.quoted.sender
            : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        await rell.groupParticipantsUpdate(m.chat, [blockwww], "remove");
        let reactmas = rell.sendMessage(m.chat, {
          react: { text: "✅", key: m.key },
        });
        break;
      }
      case "add": {
        if (!text)
          return reply(
            `number?\n\nExample: ${prefix + command} 62881026950162`
          );
        if (!m.isGroup) return reply(mess.group);
        if (!isOwner) return reply(mess.owner);
        if (!isBotAdmins) return reply(mess.akses);
        let blockwwww = m.quoted
          ? m.quoted.sender
          : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        await rell.groupParticipantsUpdate(m.chat, [blockwwww], "add");
        let reactmas = rell.sendMessage(m.chat, {
          react: { text: "✅", key: m.key },
        });
        break;
      }
      case "promote":
      case "addadmin": {
        if (!text)
          return reply(
            `number?\n\nExample: ${prefix + command} 62881026950162`
          );
        if (!m.isGroup) return reply(mess.group);
        if (!isAdmins && !isGroupOwner && !isOwner) return reply(mess.akses);
        if (!isBotAdmins) return reply(mess.akses);
        let blockwwwww = m.mentionedJid[0]
          ? m.mentionedJid[0]
          : m.quoted
            ? m.quoted.sender
            : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        await rell.groupParticipantsUpdate(m.chat, [blockwwwww], "promote");
        let reactmas = rell.sendMessage(m.chat, {
          react: { text: "✅", key: m.key },
        });
        reply(`${blockwwwww} _is now group admin_`);
        break;
      }
      case "demote":
      case "deladmin":
        {
          if (!text)
            return reply(
              `number?\n\nExample: ${prefix + command} 62881026950162`
            );
          if (!m.isGroup) return reply(mess.group);
          if (!isAdmins && !isGroupOwner && !isOwner) return reply(mess.akses);
          if (!isBotAdmins) return reply(mess.akses);
          let blockwwwwwa = m.mentionedJid[0]
            ? m.mentionedJid[0]
            : m.quoted
              ? m.quoted.sender
              : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
          await rell.groupParticipantsUpdate(m.chat, [blockwwwwwa], "demote");
          let reactmas = rell.sendMessage(m.chat, {
            react: { text: "✅", key: m.key },
          });
          reply(`${blockwwwwwa} _is now not a group admin_`);
        }
        break;
      case "setnamegc":
      case "setsubject":
        if (!m.isGroup) return reply(mess.group);
        if (!isAdmins && !isGroupOwner && !isOwner) return reply(mess.akses);
        if (!isBotAdmins) return reply(mess.akses);
        if (!text) return reply("Text ?");
        await rell.groupUpdateSubject(m.chat, text);
        reply(mess.done);
        break;
      case "idgroup":
      case "groupid":
        {
          if (!isOwner) return reply(mess.owner);
          let getGroups = await rell.groupFetchAllParticipating();
          let groups = Object.entries(getGroups)
            .slice(0)
            .map((entry) => entry[1]);
          let anu = groups.map((v) => v.id);
          let teks = `⬣ *GROUP LIST BELOW*\n\nTotal Group : ${anu.length} Group\n\n`;
          for (let x of anu) {
            let metadata2 = await rell.groupMetadata(x);
            teks += `◉ Name : ${metadata2.subject}\n◉ ID : ${metadata2.id}\n◉ Member : ${metadata2.participants.length}\n\n────────────────────────\n\n`;
          }
          reply(
            teks +
            `To Use Please Type Command ${prefix}pushcontact idgroup|teks\n\nBefore using, please first copy the group id above`
          );
        }
        break;
      case "deleteppgroup":
      case "delppgc":
      case "deleteppgc":
      case "delppgroup":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isAdmins && !isOwner) return reply(mess.akses);
          if (!isBotAdmins) return reply(mess.akses);
          await rell.removeProfilePicture(from);
        }
        break;
      case "setdesc":
      case "setdesk":
        if (!m.isGroup) return reply(mess.group);
        if (!isAdmins && !isGroupOwner && !isOwner) return reply(mess.akses);
        if (!isBotAdmins) return reply(mess.akses);
        if (!text) return reply("Text ?");
        await rell.groupUpdateDescription(m.chat, text);
        reply(mess.done);
        break;
      case "setppgroup":
      case "setppgrup":
      case "setppgc":
      case "setgrouppp":
      case "setgruppp":
      case "setgcpp":
        if (!m.isGroup) return reply(mess.group);
        if (!isAdmins) return reply(mess.admin);
        if (!isBotAdmins) return reply(mess.akses);
        if (!quoted)
          return reply(`Send/Reply Image With Caption ${prefix + command}`);
        if (!/image/.test(mime))
          return reply(`Send/Reply Image Caption Caption ${prefix + command}`);
        if (/webp/.test(mime))
          return reply(`Send/Reply Image With Caption ${prefix + command}`);
        var medis = await rell.downloadAndSaveMediaMessage(
          quoted,
          "ppbot.jpeg"
        );
        if (args[0] == "full") {
          var { img } = await generateProfilePicture(medis);
          await rell.query({
            tag: "iq",
            attrs: {
              to: m.chat,
              type: "set",
              xmlns: "w:profile:picture",
            },
            content: [
              {
                tag: "picture",
                attrs: {
                  type: "image",
                },
                content: img,
              },
            ],
          });
          fs.unlinkSync(medis);
          reply(mess.done);
        } else {
          var memeg = await rell.updateProfilePicture(m.chat, {
            url: medis,
          });
          fs.unlinkSync(medis);
          reply(mess.done);
        }
        break;
      case "tagall":
      case "tag":
        if (!m.isGroup) return reply(mess.group);
        if (!isAdmins && !isGroupOwner && !isOwner) return reply(mess.akses);
        if (!isBotAdmins) return reply(mess.akses);
        let me = m.sender;
        let teks = `╚»˙·٠${themeemoji}●♥ Tag All ♥●${themeemoji}٠·˙«╝\n😶 *Tagger :*  @${me.split("@")[0]
          }\n🌿 *Message : ${q ? q : "no message"}*\n\n`;
        for (let mem of participants) {
          teks += `${themeemoji} @${mem.id.split("@")[0]}\n`;
        }
        rell.sendMessage(
          m.chat,
          {
            text: teks,
            mentions: participants.map((a) => a.id),
          },
          {
            quoted: fkontak,
          }
        );
        break;
      case "kickall":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isAdmins && !isGroupOwner && !isOwner) return reply(mess.akses);
          if (!isBotAdmins) return reply(mess.akses);
          const xeonkickall =
            args[0] === "numBut"
              ? text.replace(`${args[0]} `, "").split("|")
              : Number(args[0])
                ? groupMetadata.participants
                  .filter(
                    (item) =>
                      item.id.startsWith(args[0].replace("+", "")) &&
                      item.id !== botNumber &&
                      item.id !== `${ownernumber}@s.whatsapp.net`
                  )
                  .map((item) => item.id)
                : groupMetadata.participants
                  .filter(
                    (item) =>
                      item.id !== botNumber &&
                      item.id !== `${ownernumber}@s.whatsapp.net`
                  )
                  .map((item) => item.id);
          if (global.welcome === true) {
            welcome = false;
          }
          for (let remove of xeonkickall) {
            await rell.groupParticipantsUpdate(
              m.chat,
              [args[0] === "numBut" ? `${remove}@s.whatsapp.net` : remove],
              "remove"
            );
            await sleep(100);
          }
          reply(`Success`);
        }
        break;
      case "hidetag":
        if (!m.isGroup) return reply(mess.group);
        if (!isAdmins && !isGroupOwner && !isOwner) return reply(mess.akses);
        if (!isBotAdmins) return reply(mess.akses);
        rell.sendMessage(
          m.chat,
          {
            text: q ? q : "",
            mentions: participants.map((a) => a.id),
          },
          {
            quoted: fkontak,
          }
        );
        break;
      case "totag":
        if (!m.isGroup) return reply(mess.group);
        if (!isBotAdmins) return reply(mess.akses);
        if (!isAdmins) return reply(mess.admin);
        if (!m.quoted)
          return reply(`Reply media with caption ${prefix + command}`);
        rell.sendMessage(m.chat, {
          forward: m.quoted.fakeObj,
          mentions: participants.map((a) => a.id),
        });
        break;
      case "group":
      case "grup":
        if (!m.isGroup) return reply(mess.group);
        if (!isAdmins && !isGroupOwner && !isOwner) return reply(mess.akses);
        if (!isBotAdmins) return reply(mess.akses);
        if (args[0] === "close") {
          await rell
            .groupSettingUpdate(m.chat, "announcement")
            .then((res) => reply(`Success Closing Group`));
        } else if (args[0] === "open") {
          await rell
            .groupSettingUpdate(m.chat, "not_announcement")
            .then((res) => reply(`Success Opening Group`));
        } else {
          reply(`Mode ${command}\n\n\nKetik ${prefix + command}open/close`);
        }
        break;
      case "closetime":
        if (!m.isGroup) return reply(mess.group);
        if (!isAdmins && isOwner) return replyg(mess.admin);
        if (!isBotAdmins) return reply(mess.admin);
        if (args[1] == "second") {
          var timer = args[0] * `1000`;
        } else if (args[1] == "minute") {
          var timer = args[0] * `60000`;
        } else if (args[1] == "hour") {
          var timer = args[0] * `3600000`;
        } else if (args[1] == "day") {
          var timer = args[0] * `86400000`;
        } else {
          return reply(
            "*select:*\nsecond\nminute\nhour\n\n*Example*\n10 second"
          );
        }
        reply(`Close time ${q} starting from now`);
        setTimeout(() => {
          var nomor = m.participant;
          const close = `*Close time* group closed by admin\nnow only admin can send messages`;
          rell.groupSettingUpdate(m.chat, "announcement");
          reply(close);
        }, timer);
        break;
      case "opentime":
        if (!m.isGroup) return reply(mess.group);
        if (!isAdmins && !isOwner) return reply(mess.admin);
        if (!isBotAdmins) return reply(mess.admin);
        if (args[1] == "second") {
          var timer = args[0] * `1000`;
        } else if (args[1] == "minute") {
          var timer = args[0] * `60000`;
        } else if (args[1] == "hour") {
          var timer = args[0] * `3600000`;
        } else if (args[1] == "day") {
          var timer = args[0] * `86400000`;
        } else {
          return reply(
            "*select:*\nsecond\nminute\nhour\n\n*example*\n10 second"
          );
        }
        reply(`Open time ${q} starting from now`);
        setTimeout(() => {
          var nomor = m.participant;
          const open = `*Open time* the group was opened by admin\n now members can send messages`;
          rell.groupSettingUpdate(m.chat, "not_announcement");
          reply(open);
        }, timer);
        break;
      case "editinfo":
        if (!m.isGroup) return reply(mess.group);
        if (!isAdmins && !isGroupOwner && !isOwner) return reply(mess.akses);
        if (!isBotAdmins) return reply(mess.akses);
        if (args[0] === "open") {
          await rell
            .groupSettingUpdate(m.chat, "unlocked")
            .then((res) => reply(`Successfully Opened Edit Group Info`));
        } else if (args[0] === "close") {
          await rell
            .groupSettingUpdate(m.chat, "locked")
            .then((res) => reply(`Successfully Closed Edit Group Info`));
        } else {
          reply(`Mode ${command}\n\n\nType ${prefix + command}on/off`);
        }
        break;
      case "linkgroup":
      case "linkgrup":
      case "linkgc":
      case "gclink":
      case "grouplink":
      case "gruplink":
        if (!m.isGroup) return reply(mess.group);
        if (!isAdmins && !isGroupOwner && !isOwner) return reply(mess.akses);
        if (!isBotAdmins) return reply(mess.akses);
        let response = await rell.groupInviteCode(m.chat);
        rell.sendText(
          m.chat,
          `👥 *GROUP LINK*\n📛 *Name :* ${groupMetadata.subject
          }\n👤 *Owner Grup :* ${groupMetadata.owner !== undefined
            ? "+" + groupMetadata.owner.split`@`[0]
            : "Not known"
          }\n🌱 *ID :* ${groupMetadata.id
          }\n🔗 *Chat Link :* https://chat.whatsapp.com/${response}\n👥 *Member :* ${groupMetadata.participants.length
          }\n`,
          m,
          {
            detectLink: true,
          }
        );
        break;
      case "revoke":
      case "resetlink":
        if (!m.isGroup) return reply(mess.group);
        if (!isAdmins && !isGroupOwner && !isOwner) return reply(mess.akses);
        if (!isBotAdmins) return reply(mess.akses);
        await rell.groupRevokeInvite(m.chat).then((res) => {
          reply(`Reset Success`);
        });
        break;
      case "nsfw":
        {
          if (premiumya === null) return reply(mess.premium);
          if (!m.isGroup) return reply(mess.group);
          if (!isBotAdmins) return reply(mess.akses);
          if (!isAdmins && !isOwner) return reply(mess.akses);
          if (args[0] === "on") {
            if (AntiNsfw) return reply("Already activated");
            ntnsfw.push(from);
            fs.writeFileSync(
              "./src/data/function/nsfw.json",
              JSON.stringify(ntnsfw)
            );
            reply("Success in turning on nsfw in this group");
            var groupe = await rell.groupMetadata(from);
            var members = groupe["participants"];
            var mems = [];
            members.map(async (adm) => {
              mems.push(adm.id.replace("c.us", "s.whatsapp.net"));
            });
            rell.sendMessage(
              from,
              {
                text: `\`\`\`「 ⚠️Warning⚠️ 」\`\`\`\n\nNsfw(not safe for work) feature has been enabled in this group, which means one can access sexual graphics from the bot!`,
                contextInfo: { mentionedJid: mems },
              },
              { quoted: fkontak }
            );
          } else if (args[0] === "off") {
            if (!AntiNsfw) return reply("Already deactivated");
            let off = ntnsfw.indexOf(from);
            ntnsfw.splice(off, 1);
            fs.writeFileSync(
              "./src/data/function/nsfw.json",
              JSON.stringify(ntnsfw)
            );
            reply("Success in turning off nsfw in this group");
          } else {
            await reply(
              `Please Type The Option\n\nExample: ${prefix + command
              } on\nExample: ${prefix + command
              } off\n\non to enable\noff to disable`
            );
          }
        }
        break;
      case "antiaudio":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isBotAdmins) return reply(mess.akses);
          if (!isAdmins && !isOwner) return reply(mess.akses);
          if (args.length < 1) return reply("on/off?");
          if (args[0] === "on") {
            db.data.chats[from].antiaudio = true;
            reply(`${command} is enabled`);
          } else if (args[0] === "off") {
            db.data.chats[from].antiaudio = false;
            reply(`${command} is disabled`);
          }
        }
        break;
      case "poll":
      case "vote":
        {
          if (!isGroup) return reply(mess.group);
          let [poll, opt] = text.split("|");
          if (text.split("|") < 2)
            return await reply(
              `Mention question and atleast 2 options\nExample: ${prefix}${command} Who is best?|Kurumi,Elaina,Doge`
            );
          let options = [];
          for (let i of opt.split(",")) {
            options.push(i);
          }
          await rell.sendMessage(m.chat, {
            poll: {
              name: poll,
              values: options,
            },
          });
        }
        break;
      case "antipoll":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isBotAdmins) return reply(mess.akses);
          if (!isAdmins && !isOwner) return reply(mess.akses);
          if (args.length < 1) return reply("on/off?");
          if (args[0] === "on") {
            db.data.chats[from].antipoll = true;
            reply(`${command} is enabled`);
          } else if (args[0] === "off") {
            db.data.chats[from].antipoll = false;
            reply(`${command} is disabled`);
          }
        }
        break;
      case "antisticker":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isBotAdmins) return reply(mess.akses);
          if (!isAdmins && !isOwner) return reply(mess.akses);
          if (args.length < 1) return reply("on/off?");
          if (args[0] === "on") {
            db.data.chats[from].antisticker = true;
            reply(`${command} is enabled`);
          } else if (args[0] === "off") {
            db.data.chats[from].antisticker = false;
            reply(`${command} is disabled`);
          }
        }
        break;
      case "antiimage":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isBotAdmins) return reply(mess.akses);
          if (!isAdmins && !isOwner) return reply(mess.akses);
          if (args.length < 1) return reply("on/off?");
          if (args[0] === "on") {
            db.data.chats[from].antiimage = true;
            reply(`${command} is enabled`);
          } else if (args[0] === "off") {
            db.data.chats[from].antiimage = false;
            reply(`${command} is disabled`);
          }
        }
        break;
      case "antivideo":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isBotAdmins) return reply(mess.akses);
          if (!isAdmins && !isOwner) return reply(mess.akses);
          if (args.length < 1) return reply("on/off?");
          if (args[0] === "on") {
            db.data.chats[from].antivideo = true;
            reply(`${command} is enabled`);
          } else if (args[0] === "off") {
            db.data.chats[from].antivideo = false;
            reply(`${command} is disabled`);
          }
        }
        break;
      case "antivirtex":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isBotAdmins) return reply(mess.akses);
          if (!isAdmins && !isOwner) return reply(mess.akses);
          if (args.length < 1) return reply("on/off?");
          if (args[0] === "on") {
            db.data.chats[from].antivirtex = true;
            reply(`${command} is enabled`);
          } else if (args[0] === "off") {
            db.data.chats[from].antivirtex = false;
            reply(`${command} is disabled`);
          }
        }
        break;
      case "antibot":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isBotAdmins) return reply(mess.akses);
          if (!isAdmins && !isOwner) return reply(mess.akses);
          if (args.length < 1) return reply("on/off?");
          if (args[0] === "on") {
            db.data.chats[from].antibot = true;
            reply(`${command} is enabled`);
          } else if (args[0] === "off") {
            db.data.chats[from].antibot = false;
            reply(`${command} is disabled`);
          }
        }
        break;
      case "readviewonce":
      case "rvo":
        {
          if (!m.quoted) return reply(`Reply to view once message`);
          if (m.quoted.mtype !== "viewOnceMessageV2")
            return reply(`This is not a view once message`);
          let msg = m.quoted.message;
          let type = Object.keys(msg)[0];
          let media = await downloadContentFromMessage(
            msg[type],
            type == "imageMessage" ? "image" : "video"
          );
          let buffer = Buffer.from([]);
          for await (const chunk of media) {
            buffer = Buffer.concat([buffer, chunk]);
          }
          if (/video/.test(type)) {
            return rell.sendFile(
              m.chat,
              buffer,
              "media.mp4",
              msg[type].caption || "",
              m
            );
          } else if (/image/.test(type)) {
            return rell.sendFile(
              m.chat,
              buffer,
              "media.jpg",
              msg[type].caption || "",
              m
            );
          }
        }
        break;
      case "antiviewonce":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isBotAdmins) return reply(mess.akses);
          if (!isAdmins && !isOwner) return reply(mess.akses);
          if (args.length < 1) return reply("on/off?");
          if (args[0] === "on") {
            db.data.chats[from].antiviewonce = true;
            reply(`${command} is enabled`);
          } else if (args[0] === "off") {
            db.data.chats[from].antiviewonce = false;
            reply(`${command} is disabled`);
          }
        }
        break;
      case "anticall":
        {
          if (!isOwner) return reply(mess.akses);
          if (args.length < 1) return reply("on/off?");
          if (args[0] === "on") {
            anticall = true;
            reply(`${command} is enabled`);
          } else if (args[0] === "off") {
            anticall = false;
            reply(`${command} is disabled`);
          }
        }
        break;
      case "antispam":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isBotAdmins) return reply(mess.akses);
          if (!isAdmins && !isOwner) return reply(mess.akses);
          if (args.length < 1) return reply("on/off?");
          if (args[0] === "on") {
            db.data.chats[from].antispam = true;
            reply(`${command} is enabled`);
          } else if (args[0] === "off") {
            db.data.chats[from].antispam = false;
            reply(`${command} is disabled`);
          }
        }
        break;
      case "antimedia":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isBotAdmins) return reply(mess.akses);
          if (!isAdmins && !isOwner) return reply(mess.akses);
          if (args.length < 1) return reply("on/off?");
          if (args[0] === "on") {
            db.data.chats[from].antimedia = true;
            reply(`${command} is enabled`);
          } else if (args[0] === "off") {
            db.data.chats[from].antimedia = false;
            reply(`${command} is disabled`);
          }
        }
        break;
      case "antidocument":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isBotAdmins) return reply(mess.akses);
          if (!isAdmins && !isOwner) return reply(mess.akses);
          if (args.length < 1) return reply("on/off?");
          if (args[0] === "on") {
            db.data.chats[from].antidocument = true;
            reply(`${command} is enabled`);
          } else if (args[0] === "off") {
            db.data.chats[from].antidocument = false;
            reply(`${command} is disabled`);
          }
        }
        break;
      case "anticontact":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isBotAdmins) return reply(mess.akses);
          if (!isAdmins && !isOwner) return reply(mess.akses);
          if (args.length < 1) return reply("on/off?");
          if (args[0] === "on") {
            db.data.chats[from].anticontact = true;
            reply(`${command} is enabled`);
          } else if (args[0] === "off") {
            db.data.chats[from].anticontact = false;
            reply(`${command} is disabled`);
          }
        }
        break;
      case "antilocation":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isBotAdmins) return reply(mess.akses);
          if (!isAdmins && !isOwner) return reply(mess.akses);
          if (args.length < 1) return reply("on/off?");
          if (args[0] === "on") {
            db.data.chats[from].antilocation = true;
            reply(`${command} is enabled`);
          } else if (args[0] === "off") {
            db.data.chats[from].antilocation = false;
            reply(`${command} is disabled`);
          }
        }
        break;
      case "listonline":
      case "here":
        {
          if (!m.isGroup) return reply(m.from, mess.group, m);
          if (!m.isAdmin) return reply(m.from, mess.akses, m);
          let id =
            m.args && /\d+\-\d+@g.us/.test(m.args[0]) ? m.args[0] : m.from;
          let online = [...Object.keys(store.presences[id]), m.botNumber];
          let liston = 1;
          let txt = `*List Online Members*\n\n`;
          for (let user of online) {
            txt += `${liston++}. ${user.replace(/@.+/, "")}\n`;
          }
          await reply(m.from, txt, m);
        }
        break;
      case "antilink":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isBotAdmins) return reply(mess.akses);
          if (!isAdmins && !isOwner) return reply(mess.akses);
          if (args.length < 1) return reply("on/off?");
          if (args[0] === "on") {
            db.data.chats[from].antilink = true;
            reply(`${command} is enabled`);
          } else if (args[0] === "off") {
            db.data.chats[from].antilink = false;
            reply(`${command} is disabled`);
          }
        }
        break;
      case "antilinkgc":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isBotAdmins) return reply(mess.akses);
          if (!isAdmins && !isOwner) return reply(mess.akses);
          if (args.length < 1) return reply("on/off?");
          if (args[0] === "on") {
            db.data.chats[from].antilinkgc = true;
            reply(`${command} is enabled`);
          } else if (args[0] === "off") {
            db.data.chats[from].antilinkgc = false;
            reply(`${command} is disabled`);
          }
        }
        break;
      case "antipromotion":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isBotAdmins) return reply(mess.akses);
          if (!isAdmins && !isOwner) return reply(mess.akses);
          if (args.length < 1) return reply("on/off?");
          if (args[0] === "on") {
            db.data.chats[from].antipromotion = true;
            reply(`${command} is enabled`);
          } else if (args[0] === "off") {
            db.data.chats[from].antipromotion = false;
            reply(`${command} is disabled`);
          }
        }
        break;
      case "welcome":
      case "left":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isAdmins && !isOwner) return reply(mess.akses);
          if (args.length < 1) return reply("on/off?");
          if (args[0] === "on") {
            welcome = true;
            reply(mess.success);
          } else if (args[0] === "off") {
            welcome = false;
            reply(mess.success);
          }
        }
        break;
      case "adminevent":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isAdmins && !isOwner) return reply(mess.akses);
          if (args.length < 1) return reply("on/off?");
          if (args[0] === "on") {
            adminevent = true;
            reply(`${command} is enabled`);
          } else if (args[0] === "off") {
            adminevent = false;
            reply(`${command} is disabled`);
          }
        }
        break;
      case "groupevent":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isAdmins && !isOwner) return reply(mess.akses);
          if (args.length < 1) return reply("on/off?");
          if (args[0] === "on") {
            groupevent = true;
            reply(`${command} is enabled`);
          } else if (args[0] === "off") {
            groupevent = false;
            reply(`${command} is disabled`);
          }
        }
        break;
      case "invite":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isBotAdmins) return reply(mess.akses);
          if (!text)
            return reply(
              `Enter the number you want to invite to the group\n\nExample :\n*${prefix + command
              }* 62881026950162`
            );
          if (text.includes("+"))
            return reply(`Enter the number together without *+*`);
          if (isNaN(text))
            return reply(
              `Enter only the numbers plus your country code without spaces`
            );
          let group = m.chat;
          let link =
            "https://chat.whatsapp.com/" + (await rell.groupInviteCode(group));
          await rell.sendMessage(text + "@s.whatsapp.net", {
            text: `≡ *GROUP INVITATION*\n\nA user invites you to join this group \n\n${link}`,
            mentions: [m.sender],
          });
          reply(` An invite link is sent to the user`);
        }
        break;
      case "closegc":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isAdmins && !isOwner) return reply(mess.akses);
          if (!isBotAdmins) return reply(mess.akses);
          var nomor = m.participant;
          const close = `*Close time* group closed by admin\nnow only admin can send messages`;
          rell.groupSettingUpdate(m.chat, "announcement");
          reply(close);
        }
        break;
      case "opengc":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isAdmins && !isOwner) return reply(mess.admin);
          if (!isBotAdmins) return reply(mess.akses);
          var nomor = m.participant;
          const open = `*Open time* the group was opened by admin\n now members can send messages`;
          rell.groupSettingUpdate(m.chat, "not_announcement");
          reply(open);
        }
        break;
      case "getjoinrequest":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isBotAdmins) return reply(mess.akses);
          if (!isAdmins && !isOwner) return reply(mess.akses);
          const response = await rell.groupRequestParticipantsList(m.chat);
          if (!response || !response.length) {
            rell.sendMessage(
              m.chat,
              { text: "No pending join requests. ✅" },
              { quoted: fkontak }
            );
            return;
          }
          let replyMessage = `${themeemoji} Join Request List:\n`;
          response.forEach((request, index) => {
            const { jid, request_method, request_time } = request;
            const formattedTime = new Date(
              parseInt(request_time) * 1000
            ).toLocaleString();
            replyMessage += `\n*No.: ${index + 1} Request Details. 👇*`;
            replyMessage += `\n🧟‍♂️ *JID:* ${jid}`;
            replyMessage += `\n🧪 *Method:* ${request_method}`;
            replyMessage += `\n⏰ *Time:* ${formattedTime}\n`;
          });

          rell.sendMessage(m.chat, { text: replyMessage }, { quoted: fkontak });
        }
        break;
      case "tagadmin":
      case "listadmin":
      case "admin":
        {
          if (!m.isGroup) return reply(mess.group);
          const groupAdmins = participants.filter((p) => p.admin);
          const listAdmin = groupAdmins
            .map((v, i) => `${i + 1}. @${v.id.split("@")[0]}`)
            .join("\n");
          const owner =
            groupMetadata.owner ||
            groupAdmins.find((p) => p.admin === "superadmin")?.id ||
            m.chat.split`-`[0] + "@s.whatsapp.net";
          let text = `   
                        *Group Admins:*
                        ${listAdmin}
                        `.trim();
          rell.sendMessage(
            m.chat,
            { text: text, mentions: [...groupAdmins.map((v) => v.id), owner] },
            { quoted: fkontak }
          );
        }
        break;
      case "ephemeral":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isBotAdmins) return reply(mess.akses);
          if (!isAdmins) return reply(mess.akses);
          if (!text) return reply("Enter the value on/off");
          if (args[0] === "on") {
            await rell.sendMessage(m.chat, {
              disappearingMessagesInChat: WA_DEFAULT_EPHEMERAL,
            });
            await reply(`Done`);
          } else if (args[0] === "off") {
            await rell.sendMessage(m.chat, {
              disappearingMessagesInChat: false,
            });
            await reply(`Done`);
          }
        }
        break;
      case "antibadword":
      case "antitoxic":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isBotAdmins) return reply(mess.akses);
          if (!isAdmins && !isOwner) return reply(mess.akses);
          if (args.length < 1) return reply("on/off?");
          if (args[0] === "on") {
            db.data.chats[from].badword = true;
            reply(mess.success);
          } else if (args[0] === "off") {
            db.data.chats[from].badword = false;
            reply(mess.success);
          }
        }
        break;
      case "pushcontact":
        {
          if (!isOwner) return reply(mess.owner);
          if (!m.isGroup) return reply(`The feature works only in grup`);
          if (!text) return reply(`text?`);
          let mem = await participants
            .filter((v) => v.id.endsWith(".net"))
            .map((v) => v.id);
          reply(mess.success);
          for (let pler of mem) {
            rell.sendMessage(pler, { text: q });
          }
          reply(mess.success);
        }
        break;

      //Fun Feature
      case "couple":
        {
          if (!m.isGroup) return reply(mess.group);
          let member = participants.map((u) => u.id);
          let orang = member[Math.floor(Math.random() * member.length)];
          let jodoh = member[Math.floor(Math.random() * member.length)];
          rell.sendMessage(
            m.chat,
            {
              text: `@${orang.split("@")[0]} ❤️ @${jodoh.split("@")[0]
                }\nCieeee, What's Going On❤️💖👀`,
              contextInfo: {
                mentionedJid: [orang, jodoh],
                forwardingScore: 9999999,
                isForwarded: true,
                externalAdReply: {
                  showAdAttribution: true,
                  containsAutoReply: true,
                  title: ` ${global.botname}`,
                  body: `${ownername}`,
                  previewType: "PHOTO",
                  thumbnailUrl: ``,
                  thumbnail: fs.readFileSync(`./media/theme/cheemspic.jpg`),
                  sourceUrl: `${wagc}`,
                },
              },
            },
            { quoted: fkontak }
          );
        }
        break;
      case "pick":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!text)
            return reply(
              `What do you want to pick?\nExample: ${prefix + command} idiot`
            );
          const groupMetadata = m.isGroup
            ? await rell.groupMetadata(m.chat).catch((e) => { })
            : "";
          const participants = m.isGroup
            ? await groupMetadata.participants
            : "";
          let member = participants.map((u) => u.id);
          let me = m.sender;
          let xeonshimts = member[Math.floor(Math.random() * member.length)];
          rell.sendMessage(
            from,
            {
              text: `Yang paling *${text}* di sini adalah *@${xeonshimts.split("@")[0]
                }*`,
              contextInfo: {
                forwardingScore: 9999999,
                isForwarded: true,
                mentionedJid: [xeonshimts],
                externalAdReply: {
                  showAdAttribution: true,
                  title: ` ${global.botname}`,
                  body: `${ownername}`,
                  containsAutoReply: true,
                  previewType: "PHOTO",
                  thumbnailUrl: ``,
                  thumbnail: fs.readFileSync(`./media/theme/cheemspic.jpg`),
                  sourceUrl: `${wagc}`,
                },
              },
            },
            { quoted: fkontak }
          );
        }
        break;
      case "ppcp":
      case "ppcouple":
      case "couplepp":
        {
          let anu = require("./src/media/randompics/ppcouple.json");
          let random = anu[Math.floor(Math.random() * anu.length)];
          rell.sendMessage(
            from,
            { image: { url: random.male }, caption: `Couple pp for male` },
            { quoted: fkontak }
          );
          rell.sendMessage(
            from,
            { image: { url: random.female }, caption: `Couple pp for female` },
            { quoted: fkontak }
          );
        }
        break;
      case "emojimix":
        {
          let [emoji1, emoji2] = text.split`+`;
          if (!emoji1) return reply(`Example : ${prefix + command} 😅+🤔`);
          if (!emoji2) return reply(`Example : ${prefix + command} 😅+🤔`);
          let anu = await fetchJson(
            `https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(
              emoji1
            )}_${encodeURIComponent(emoji2)}`
          );
          for (let res of anu.results) {
            let encmedia = await rell.sendImageAsSticker(m.chat, res.url, m, {
              packname: global.packname,
              author: global.author,
              categories: res.tags,
            });
            let reactmas = rell.sendMessage(m.chat, {
              react: { text: "✅", key: m.key },
            });
            reply(mess.success);
          }
        }
        break;
      case "can":
      case "bisakah":
        {
          if (!text)
            return reply(
              `Ask question\n\nExample : ${prefix + command} i dance?`
            );
          let bisa = [`Bisa`, `Tidak Bisa`, `Tidak Bisa`, `Tentu saja Bisa!!!`];
          let keh = bisa[Math.floor(Math.random() * bisa.length)];
          let jawab = `*Can ${text}*\nAnswer : ${keh}`;
          await reply(jawab);
        }
        break;
      case "is":
      case "apakah":
        {
          if (!text)
            return reply(
              `Ask question\n\nExample : ${prefix + command} she virgin?`
            );
          let apa = [
            `Ya`,
            `Tidak`,
            `Bisa Jadi`,
            `Benar`,
            `Tanya Pacarmu`,
            `Aku Tidak Tahu`,
            `Aku Tidak Tahu, Tanya Ayahmu`,
          ];
          let kah = apa[Math.floor(Math.random() * apa.length)];
          let jawab = `*Is ${text}*\nAnswer : ${kah}`;
          await reply(jawab);
        }
        break;
      case "when":
      case "kapan":
        {
          if (!text)
            return reply(
              `Ask question\n\nExample : ${prefix + command
              } will i get married?`
            );
          let kapan = [
            "5 Hari Lagi",
            "10 Hari Lagi",
            "15 Hari Lagi",
            "20 Hari Lagi",
            "25 Hari Lagi",
            "30 Hari Lagi",
            "35 Hari Lagi",
            "40 Hari Lagi",
            "45 Hari Lagi",
            "50 Hari Lagi",
            "55 Hari Lagi",
            "60 Hari Lagi",
            "65 Hari Lagi",
            "70 Hari Lagi",
            "75 Hari Lagi",
            "80 Hari Lagi",
            "85 Hari Lagi ",
            "90 Hari Lagi",
            "100 Hari Lagi",
            "5 Bulan Lagi",
            "10 Bulan Lagi",
            "15 Bulan Lagi",
            "20 Bulan Lagi",
            "25 Bulan Lagi",
            "30 Bulan Lagi",
            "35 Bulan Lagi",
            "40 Bulan Lagi",
            "45 Bulan Lagi",
            "50 Bulan Lagi",
            "55 Bulan Lagi",
            "60 Bulan Lagi",
            "65 Bulan Lagi",
            "70 Bulan Lagi",
            "75 Bulan Lagi",
            "80 Bulan Lagi",
            "85 Bulan Lagi",
            "90 Bulan Lagi",
            "100 Bulan Lagi",
            "1 Tahun Lagi",
            "2 Tahun Lagi",
            "3 Tahun Lagi",
            "4 Tahun Lagi ",
            "5 Tahun Lagi",
            "Besok",
            "Lusa",
          ];
          let koh = kapan[Math.floor(Math.random() * kapan.length)];
          let jawab = `*${command} ${text}*\nAnswer : ${koh}`;
          await reply(jawab);
        }
        break;
      case "where":
      case "dimana":
        {
          if (!text)
            return reply(
              `Ask question\n\nExample : ${prefix + command} is your name?`
            );
          let wherelol = [
            `Di gunung`,
            `Di mars`,
            `Di bulan`,
            `Di hutan`,
            `Aku tidak tahu, tanya ibumu`,
            `Bisa jadi di suatu tempat`,
          ];
          let kah = wherelol[Math.floor(Math.random() * wherelol.length)];
          let jawab = `*Whwre ${text}*\nAnswer : ${kah}`;
          await reply(jawab);
        }
        break;
      case "how":
      case "bagaimana":
        {
          if (!text)
            return reply(
              `Ask question\n\nExample : ${prefix + command} to date girl?`
            );
          let gimana = [
            `Ummm...`,
            `Susah Gan`,
            `Maaf Bot Tidak Bisa Jawab`,
            `Coba Searching Di Google`,
            `Astaga! Beneran???`,
            `Pusing Ah😴, gak mau jawab`,
          ];
          let kah = gimana[Math.floor(Math.random() * gimana.length)];
          let jawab = `*How ${text}*\nAnswer : ${kah}`;
          await reply(jawab);
        }
        break;
      case "rate":
      case "nilai":
        {
          if (!text) return reply(`Example : ${prefix + command} my profile`);
          let ra = [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
            "21",
            "22",
            "23",
            "24",
            "25",
            "26",
            "27",
            "28",
            "29",
            "30",
            "31",
            "32",
            "33",
            "34",
            "35",
            "36",
            "37",
            "38",
            "39",
            "40",
            "41",
            "42",
            "43",
            "44",
            "45",
            "46",
            "47",
            "48",
            "49",
            "50",
            "51",
            "52",
            "53",
            "54",
            "55",
            "56",
            "57",
            "58",
            "59",
            "60",
            "61",
            "62",
            "63",
            "64",
            "65",
            "66",
            "67",
            "68",
            "69",
            "70",
            "71",
            "72",
            "73",
            "74",
            "75",
            "76",
            "77",
            "78",
            "79",
            "80",
            "81",
            "82",
            "83",
            "84",
            "85",
            "86",
            "87",
            "88",
            "89",
            "90",
            "91",
            "92",
            "93",
            "94",
            "95",
            "96",
            "97",
            "98",
            "99",
            "100",
          ];
          let kah = ra[Math.floor(Math.random() * ra.length)];
          let jawab = `*Rate ${text}*\nAnswer : ${kah}%`;
          await reply(jawab);
        }
        break;
      case "say":
      case "tts":
      case "gtts":
        {
          if (!text) return reply("Where is the text?");
          let texttts = text;
          const xeonrl = googleTTS.getAudioUrl(texttts, {
            lang: "id",
            slow: false,
            host: "https://translate.google.com",
          });
          return rell.sendMessage(
            m.chat,
            {
              audio: {
                url: xeonrl,
              },
              mimetype: "audio/mp4",
              ptt: true,
              fileName: `${text}.mp3`,
            },
            {
              quoted: fkontak,
            }
          );
        }
        break;
      case "fact":
      case "fakta":
      case "faktaunik":
        {
          const res = await (
            await fetch(
              `https://api.betabotz.eu.org/api/random/fakta?apikey=${lann}`
            )
          ).json();
          return reply(`${res.result}`);
        }
        break;
      case "quotes":
        const quotexeony = await fetch(
          `https://api.betabotz.eu.org/api/random/quotes?apikey=${lann}`
        );
        const qotes = await quotexeony.json();
        const textquotes = `*${themeemoji} Quote:* ${qotes.quotes}\n\n*${themeemoji} Author:* ${qotes.author}`;
        return reply(textquotes);
        break;
      case "awesomecek":
      case "greatcek":
      case "gaycek":
      case "gantengcek":
      case "cantikcek":
      case "cutecek":
      case "lesbicek":
      case "lesbiancek":
      case "hornycek":
      case "sangecek":
      case "prettycek":
      case "lovelycek":
      case "uglycek":
        {
          if (!text)
            return reply(
              `Siapa Yang *${command.replace("how", "").toUpperCase()}*`
            );
          const persen = `*${text}* is *${Math.floor(
            Math.random() * 101
          )}*% ${command.replace("cek", "").toLowerCase()}`;
          reply(persen);
        }
        break;
      //Stalker Feature
      case "igstalk":
        {
          if (!text) return reply(`contoh:\n${prefix + command} irvnfrlh`);
          try {
            let api = await fetch(
              `https://tools.betabotz.eu.org/tools/stalk-ig?q=${text}`
            );
            let response = await api.json();
            if (response.status) {
              let {
                photoUrl,
                postsCount,
                followers,
                following,
                bio,
                fullName,
                username,
              } = response.result;
              let capt;
              capt = `*I G S T A L K E R*\n`;
              capt += `◦ *Username* : ${username}\n`;
              capt += `◦ *Full Name* : ${fullName}\n`;
              capt += `◦ *Bio* : ${bio}\n`;
              capt += `◦ *Followers* : ${followers}\n`;
              capt += `◦ *Following* : ${following}\n`;
              capt += `◦ *Total Post* : ${postsCount}\n`;
              capt += `\n`;
              return reply(capt);
            } else {
              reply("Sistem Sedang Bermasalah!");
            }
          } catch (e) {
            reply("Sistem Sedang Bermasalah!");
          }
        }
        break;
      case "ytstalk":
      case "stalkyt":
        {
          if (!args[0])
            return m.reply(
              `Masukan Username Yang Terdaftar Di Youtube\n\nexample : ${prefix + command
              } jerofc`
            );
          let response = await fetchJson(
            `https://api.betabotz.eu.org/api/stalk/yt?username=${args[0]}&apikey=${lann}`
          );
          let {
            channelId,
            url,
            channelName,
            avatar,
            isVerified,
            subscriberH,
            subscriber,
            description,
          } = response.result.data[0];
          let capt;
          capt = `乂 *Y O U T U B E  C H A N N E L*\n\n`;
          capt += `◦ *Channel ID* : ${channelId}\n`;
          capt += `◦ *URL* : ${url}\n`;
          capt += `◦ *Channel Name* : ${channelName}\n`;
          capt += `◦ *Avatar* : ${avatar}\n`;
          capt += `◦ *Verified* : ${isVerified}\n`;
          capt += `◦ *Subscribers* : ${subscriberH}\n`;
          capt += `◦ *Subscriber Count* : ${subscriber}\n`;
          capt += `◦ *Description* : ${description}\n`;
          capt += `\n`;
          rell.sendMessage(
            m.chat,
            {
              image: {
                url: avatar,
              },
              caption: capt,
              mentions: [m.sender],
            },
            {
              quoted: fkontak,
            }
          );
        }
        break;
      case "tiktokstalk":
      case "ttstalk":
        {
          if (!text) return reply(`Username? `);
          let json = await fetch(
            `https://api.betabotz.eu.org/api/stalk/tt?username=${text}&apikey=${lann}`
          ).then((res) => res.json());
          let txt = `
──「 *TIKTOK STALK* 
▢ *🔖 Name:* ${json.result.username}
▢ *🔖 Username:* ${text}
▢ *❤ Likes:* ${json.result.likes}
▢ *👥 Followers:* ${json.result.followers}
▢ *✔ Following:* ${json.result.following}
▢ *📌 Desc:* ${json.result.description}
▢ *📪 POST:* ${json.result.totalPosts}

▢ *🔗 Link* : https://tiktok.com/${text}
└────────────`;
          let react = rell.sendMessage(m.chat, {
            react: { text: "✅", key: m.key },
          });
          await rell.sendMessage(m.chat, {
            text: txt,
            contextInfo: {
              externalAdReply: {
                showAdAttribution: true,
                title: botname,
                body: `... . -.-- -. .-😈`,
                thumbnailUrl: json.result.profile,
                sourceUrl: `${wagc}`,
                mediaType: 1,
                renderLargerThumbnail: false,
              },
            },
          });
        }
        break;
      case "ghstalk":
      case "githubstalk":
        {
          if (!q) return reply(`Example ${prefix + command} FarelHanafi`);
          aj = await githubstalk.githubstalk(`${q}`);
          let stalkrespon = `*/ Github Stalker \\*

Username : ${aj.username}
Nickname : ${aj.nickname}
Bio : ${aj.bio}
Id : ${aj.id}
Type : ${aj.type}
Company : ${aj.company}
Blog : ${aj.blog}
Location : ${aj.location}
Email : ${aj.email}
Public Repo : ${aj.public_repo}
Public Gists : ${aj.public_gists}
Followers : ${aj.followers}
Following : ${aj.following}
Created At : ${aj.ceated_at}
Updated At : ${aj.updated_at}
Nodeid : ${aj.nodeId}
Url Github : ${aj.url}`;
          let react = rell.sendMessage(m.chat, {
            react: { text: "✅", key: m.key },
          });
          rell.sendMessage(m.chat, {
            text: stalkrespon,
            contextInfo: {
              externalAdReply: {
                showAdAttribution: true,
                title: botname,
                body: `... . -.-- -. .-😈`,
                thumbnailUrl: aj.profile_pic,
                sourceUrl: `${wagc}`,
                mediaType: 1,
                renderLargerThumbnail: false,
              },
            },
          });
        }
        break;
      //owner feature
      case "resetuser":
      case "resetdbuser":
        {
          if (!isOwner) return reply(mess.owner);
          let totalusernya = db.data.users[0];
          reply(`Succesfully Deleted ${totalusernya} Users in Database`);
          db.data.users = [];
        }
        break;
      case "resethit":
      case "resettotalhit":
        {
          if (!isOwner) return reply(mess.owner);
          global.db.data.settings[botNumber].totalhit = 0;
          reply(mess.done);
        }
        break;
      case "statustext":
      case "upswtext":
      case "upswteks":
        {
          if (!isOwner) return reply(mess.owner);
          if (!q) return reply("Text?");
          await rell.sendMessage(
            "status@broadcast",
            { text: q },
            {
              backgroundColor: "#FF000000",
              font: 3,
              statusJidList: Object.keys(global.db.data.users),
            }
          );
          reply(mess.done);
        }
        break;
      case "statusvideo":
      case "upswvideo":
        {
          if (!isOwner) return reply(mess.owner);
          if (/video/.test(mime)) {
            var videosw = await rell.downloadAndSaveMediaMessage(quoted);
            await rell.sendMessage(
              "status@broadcast",
              {
                video: {
                  url: videosw,
                },
                caption: q ? q : "",
              },
              { statusJidList: Object.keys(global.db.data.users) }
            );
            await reply(mess.done);
          } else {
            reply("Reply to video");
          }
        }
        break;
      case "statusimg":
      case "statusimage":
      case "upswimg":
        {
          if (!isOwner) return reply(mess.owner);
          if (/image/.test(mime)) {
            var imagesw = await rell.downloadAndSaveMediaMessage(quoted);
            await rell.sendMessage(
              "status@broadcast",
              {
                image: {
                  url: imagesw,
                },
                caption: q ? q : "",
              },
              { statusJidList: Object.keys(global.db.data.users) }
            );
            await reply(mess.done);
          } else {
            reply("Reply to image");
          }
        }
        break;
      case "statusaudio":
      case "upswaudio":
        {
          if (!isOwner) return reply(mess.owner);
          if (/audio/.test(mime)) {
            var audiosw = await rell.downloadAndSaveMediaMessage(quoted);
            await rell.sendMessage(
              "status@broadcast",
              {
                audio: {
                  url: audiosw,
                },
                mimetype: "audio/mp4",
                ptt: true,
              },
              {
                backgroundColor: "#FF000000",
                statusJidList: Object.keys(global.db.data.users),
              }
            );
            await reply(mess.done);
          } else {
            reply("Reply to audio");
          }
        }
        break;
      case "addtitle":
        {
          if (!isOwner) return reply(mess.owner);
          if (!text) return reply(`Usage ${prefix + command} number|title`);
          nonya = text.split("|")[0];
          titlenya = text.split("|")[1];
          let oo = `${nonya}@s.whatsapp.net`;
          db.data.users[sender].title = titlenya;
          await reply(mess.done);
        }
        break;
      case "deltitle":
        {
          if (!isOwner) return reply(mess.owner);
          if (!text) return reply(`Usage ${prefix + command} number`);
          nonya = text.split(",")[0];
          let oo = `${nonya}@s.whatsapp.net`;
          db.data.users[sender].title = "";
          await reply(mess.done);
        }
        break;
      case "addlimit":
      case "givelimit":
        {
          if (!isOwner) return reply(mess.owner);
          if (!text)
            return reply(`Usage ${prefix + command} number|limit amount`);
          usernya = text.split("|")[0];
          limitnya = text.split("|")[1];
          let oo = `${usernya}@s.whatsapp.net`;
          db.data.users[sender].limit += limitnya;
          reply(mess.done);
        }
        break;
      case "dellimit":
        {
          if (!isOwner) return reply(mess.owner);
          if (!text)
            return reply(`Usage ${prefix + command} number|limit amount`);
          usernya = text.split("|")[0];
          limitnya = text.split("|")[1];
          if (db.data.users[usernya + "@s.whatsapp.net"].limit < limitnya)
            return reply(`His Limit Is Less Than ${limitnya}`);
          db.data.users[usernya + "@s.whatsapp.net"].limit -= limitnya;
          reply(mess.done);
        }
        break;
      case "addprem":
        if (!isOwner) return reply(mess.owner);
        if (args.length < 2)
          return reply(
            `Usage ${prefix + command} @tag time\n${prefix + command
            } number time\n\nExample : ${prefix + command} @tag 30`
          );
        if (cekPrem(m.mentionedJid.length !== 0))
          return reply("user already use");
        if (m.mentionedJid.length !== 0) {
          for (let i = 0; i < m.mentionedJid.length; i++) {
            nama = rell.getName(m.mentionedJid[0]);
            RellPrem(nama, m.mentionedJid[0], true, args[1]);
          }
          reply("Premium Success");
        } else {
          if (cekPrem(args[0] + "@s.whatsapp.net"))
            return reply("user already use");
          nama = rell.getName(args[0] + "@s.whatsapp.net");
          RellPrem(nama, args[0] + "@s.whatsapp.net", true, args[1]);
          reply("Premium Success");
        }
        break;
      case "delprem":
        if (!isOwner) return reply(mess.owner);
        if (args.length < 1)
          return reply(
            `Usage ${prefix + command} @tag\n${prefix + command
            } number\n\nExample : ${prefix + command} 62881026950162`
          );
        if (m.mentionedJid.length !== 0) {
          for (let i = 0; i < m.mentionedJid.length; i++) {
            premium.splice(getPremiumPosition(m.mentionedJid[i], premium), 1);
            fs.writeFileSync(
              "./src/data/role/premium.json",
              JSON.stringify(premium)
            );
          }
          reply("Delete Success");
        } else {
          premium.splice(
            getPremiumPosition(args[0] + "@s.whatsapp.net", premium),
            1
          );
          fs.writeFileSync(
            "./src/data/role/premium.json",
            JSON.stringify(premium)
          );
          reply("Delete Success");
        }
        break;
      case "listprem":
        {
          if (!isOwner) return reply(mess.owner);

          ListPremium()
            .then((data) => {
              // Ensure the result is an array
              if (!Array.isArray(data)) {
                data = [];
              }
              if (data.length === 0) {
                return reply("No premium users found.");
              }
              let txt = `*------「 LIST PREMIUM 」------*\n\n`;
              for (let x of data) {
                txt += `Nama : ${x.username}\n`;
                txt += `Nomor : ${x.user}\n`;
                txt += `Kadaluarsa: ${new Date(
                  x.expired
                ).toLocaleDateString()}\n\n`;
              }
              m.reply(txt);
            })
            .catch((error) => {
              console.error(error);
              reply(
                "An error occurred while fetching the list of premium users."
              );
            });
        }
        break;
        break;
      case "addowner":
        if (!isOwner) return reply(mess.owner);
        if (!args[0])
          return reply(
            `Use ${prefix + command} number\nExample ${prefix + command
            } ${ownernumber}`
          );
        bnnd = q.split("|")[0].replace(/[^0-9]/g, "");
        let ceknye = await rell.onWhatsApp(bnnd);
        if (ceknye.length == 0)
          return reply(`Enter A Valid And Registered Number On WhatsApp!!!`);
        owner.push(bnnd);
        fs.writeFileSync("./src/data/role/owner.json", JSON.stringify(owner));
        reply(`Number ${bnnd} Has Become An Owner!!!`);
        break;
      case "delowner":
        if (!isOwner) return reply(mess.owner);
        if (!args[0])
          return reply(
            `Use ${prefix + command} nomor\nExample ${prefix + command
            } 62881026950162`
          );
        ya = q.split("|")[0].replace(/[^0-9]/g, "");
        unp = owner.indexOf(ya);
        owner.splice(unp, 1);
        fs.writeFileSync("./src/data/role/owner.json", JSON.stringify(owner));
        reply(
          `The Numbrr ${ya} Has been deleted from owner list by the owner!!!`
        );
        break;
      case "listowner":
        {
          if (!isOwner) return reply(mess.owner);
          let teks = "┌──⭓「 *List Owner* 」\n│\n";
          for (let x of owner) {
            teks += `│⭔ ${x}\n`;
          }
          teks += `│\n└────────────⭓\n\n*Total : ${owner.length}*`;
          reply(teks);
        }
        break;
      case "delsession":
      case "clearsession":
        {
          if (!isOwner) return reply(mess.owner);
          fs.readdir("./session", async function (err, files) {
            if (err) {
              console.log("Unable to scan directory: " + err);
              return reply("Unable to scan directory: " + err);
            }
            let filteredArray = await files.filter(
              (item) =>
                item.startsWith("pre-key") ||
                item.startsWith("sender-key") ||
                item.startsWith("session-") ||
                item.startsWith("app-state")
            );
            console.log(filteredArray.length);
            let teks = `Detected ${filteredArray.length} junk files\n\n`;
            if (filteredArray.length == 0) return reply(teks);
            filteredArray.map(function (e, i) {
              teks += i + 1 + `. ${e}\n`;
            });
            reply(teks);
            await sleep(2000);
            reply("Deleting junk files...");
            await filteredArray.forEach(function (file) {
              fs.unlinkSync(`./session/${file}`);
            });
            await sleep(2000);
            reply("Successfully deleted all the trash in the session folder");
          });
        }
        break;
      case "getsession":
        if (!isOwner) return reply(mess.owner);
        reply("Wait a moment, currently retrieving your session file");
        let sesi = fs.readFileSync("./session/creds.json");
        rell.sendMessage(
          m.chat,
          {
            document: sesi,
            mimetype: "application/json",
            fileName: "creds.json",
          },
          {
            quoted: fkontak,
          }
        );
        break;
      case "myip":
      case "ipbot":
        if (!isOwner) return reply(mess.owner);
        http.get(
          {
            host: "api.ipify.org",
            port: 80,
            path: "/",
          },
          function (resp) {
            resp.on("data", function (ip) {
              reply("🔎 My public IP address is: " + ip);
            });
          }
        );
        break;
      case "iplookup":
      case "ip":
      case "ipwho":
        {
          if (!isOwner) return reply(mess.owner);
          if (!text)
            return reply(`*Example:* ${prefix + command} 112.90.150.204`);
          let data = await fetch(`https://ipwho.is/${text}`);
          const res = await data.json();
          await rell.sendMessage(
            m.chat,
            {
              location: {
                degreesLatitude: res.latitude,
                degreesLongitude: res.longitude,
              },
            },
            { ephemeralExpiration: 604800 }
          );

          let hasill = `
IP LOOKUP BY RELL
- ip: ${res.ip}
- success: ${res.success}
- type: ${res.type}
- continent: ${res.continent}
- continent_code: ${res.continent_code}
- country: ${res.country} 
- country_code: ${res.country_code} 
- region: ${res.region}
- region_code: ${res.region_code}
- city: ${res.city}
- latitude: ${res.latitude}
- ongitude: ${res.longitude}
- is_eu: ${res.is_eu}
- postal: ${res.postal}
- calling_code: ${res.calling_code}
- capital: ${res.capital}
- borders: ${res.borders}
CONNECTION
- asn: ${res.connection.asn}
- org: ${res.connection.org}
- isp: ${res.connection.isp}
- domain: ${res.connection.domain}
TIMEZONE
- id: ${res.timezone.id}
- abbr: ${res.timezone.abbr}
- is_dst: ${res.timezone.is_dst}
- offset: ${res.timezone.offset}
- utc: ${res.timezone.utc}
- current_time: ${res.timezone.current_time}`;
          m.reply(hasill);
        }
        break;
      case "shutdown":
        if (!isOwner) return reply(mess.owner);
        reply(`Restarting will be completed in seconds`);
        await sleep(3000);
        process.exit();
        break;
      case "autoread":
        if (!isOwner) return reply(mess.owner);
        if (args.length < 1) return reply(`Example ${prefix + command} on/off`);
        if (q === "on") {
          db.data.settings[botNumber].autoread = true;
          reply(`Successfully changed autoread to ${q}`);
        } else if (q === "off") {
          db.data.settings[botNumber].autoread = false;
          reply(`Successfully changed autoread to ${q}`);
        }
        break;
      case "unavailable":
        if (!isOwner) return reply(mess.owner);
        if (args.length < 1) return reply(`Example ${prefix + command} on/off`);
        if (q === "on") {
          db.data.settings[botNumber].online = true;
          reply(`Successfully changed unavailable to ${q}`);
        } else if (q === "off") {
          db.data.settings[botNumber].online = false;
          reply(`Successfully changed unavailable to ${q}`);
        }
        break;
      case "autorecordtype":
        if (!isOwner) return reply(mess.owner);
        if (args.length < 1) return reply(`Example ${prefix + command} on/off`);
        if (q === "on") {
          db.data.settings[botNumber].autorecordtype = true;
          reply(`Successfully changed Auto-RecordingTyping to ${q}`);
        } else if (q === "off") {
          db.data.settings[botNumber].autorecordtype = false;
          reply(`Successfully changed Auto-RecordingTyping to ${q}`);
        }
        break;
      case "autorecord":
        if (!isOwner) return reply(mess.owner);
        if (args.length < 1) return reply(`Example ${prefix + command} on/off`);
        if (q === "on") {
          db.data.settings[botNumber].autorecord = true;
          reply(`Successfully changed Auto-Recording to ${q}`);
        } else if (q === "off") {
          db.data.settings[botNumber].autorecord = false;
          reply(`Successfully changed Auto-Recording to ${q}`);
        }
        break;
      case "autotype":
        if (!isOwner) return reply(mess.owner);
        if (args.length < 1) return reply(`Example ${prefix + command} on/off`);
        if (q === "on") {
          db.data.settings[botNumber].autotype = true;
          reply(`Successfully changed Auto-Typing to ${q}`);
        } else if (q === "off") {
          db.data.settings[botNumber].autotype = false;
          reply(`Successfully changed Auto-Typing to ${q}`);
        }
        break;
      case "autobio":
        if (!isOwner) return reply(mess.owner);
        if (args.length < 1) return reply(`Example ${prefix + command} on/off`);
        if (q == "on") {
          db.data.settings[botNumber].autobio = true;
          reply(`Successfully Changed AutoBio To ${q}`);
        } else if (q == "off") {
          db.data.settings[botNumber].autobio = false;
          reply(`Successfully Changed AutoBio To ${q}`);
        }
        break;
      case "autodownload":
      case "autodl":
        if (!isOwner) return reply(mess.owner);
        if (args.length < 1) return reply(`Example ${prefix + command} on/off`);
        if (q == "on") {
          db.data.settings[botNumber].autodownload = true;
          reply(`Successfully Changed Auto Download To ${q}`);
        } else if (q == "off") {
          db.data.settings[botNumber].autodownload = false;
          reply(`Successfully Changed Auto Download To ${q}`);
        }
        break;
      case "onlygc":
        if (!isOwner) return reply(mess.owner);
        if (args.length < 1) return reply(`Example ${prefix + command} on/off`);
        if (q == "on") {
          db.data.settings[botNumber].onlygrub = true;
          reply(`Successfully Changed Onlygroup To ${q}`);
        } else if (q == "off") {
          db.data.settings[botNumber].onlygrub = false;
          reply(`Successfully Changed Onlygroup To ${q}`);
        }
        break;
      case "onlypc":
        if (!isOwner) return reply(mess.owner);
        if (args.length < 1) return reply(`Example ${prefix + command} on/off`);
        if (q == "on") {
          db.data.settings[botNumber].onlypc = true;
          reply(`Successfully Changed Only-Pc To ${q}`);
        } else if (q == "off") {
          db.data.settings[botNumber].onlypc = false;
          reply(`Successfully Changed Only-Pc To ${q}`);
        }
        break;
      case "mode":
        if (!isOwner) return reply(mess.owner);
        if (args.length < 1)
          return reply(`Example ${prefix + command} public/self`);
        if (q == "public") {
          rell.public = true;
          reply("*Successful in Changing To Public Usage*");
        } else if (q == "self") {
          rell.public = false;
          reply("*Successful in Changing To Self Usage*");
        }
        break;
      case "setexif":
      case "setwm":
        if (!isOwner) return reply(mess.owner);
        if (!text)
          return reply(`Example : ${prefix + command} packname|author`);
        global.packname = text.split("|")[0];
        global.author = text.split("|")[1];
        reply(
          `Exif successfully changed to\n\n• Packname : ${global.packname}\n• Author : ${global.author}`
        );
        break;
      case "setprefix":
        if (!isOwner) return reply(mess.owner);
        if (!text) return reply(`Example : ${prefix + command} #`);
        global.xprefix = text;
        reply(`Prefix successfully changed to ${text}`);
        break;
      case "setautoblock":
        if (!isOwner) return reply(mess.owner);
        if (!text) return reply(`Example : ${prefix + command} 62`);
        global.autoblocknumber = text;
        reply(`Auto-Block number successfully changed to ${text}`);
        break;
      case "setantiforeign":
        if (!isOwner) return reply(mess.owner);
        if (!text) return reply(`Example : ${prefix + command} 62`);
        global.antiforeignnumber = text;
        reply(`Anti-foreign number successfully changed to ${text}`);
        break;
      case "setbotpp":
      case "setpp":
      case "setpp":
      case "setppbot":
        if (!isOwner) return reply(mess.owner);
        if (!quoted)
          return reply(`Send/Reply Image With Caption ${prefix + command}`);
        if (!/image/.test(mime))
          return reply(`Send/Reply Image With Caption ${prefix + command}`);
        if (/webp/.test(mime))
          return reply(`Send/Reply Image With Caption ${prefix + command}`);
        var medis = await rell.downloadAndSaveMediaMessage(
          quoted,
          "ppbot.jpeg"
        );
        if (args[0] == "full") {
          var { img } = await generateProfilePicture(medis);
          await rell.query({
            tag: "iq",
            attrs: {
              to: botNumber,
              type: "set",
              xmlns: "w:profile:picture",
            },
            content: [
              {
                tag: "picture",
                attrs: {
                  type: "image",
                },
                content: img,
              },
            ],
          });
          fs.unlinkSync(medis);
          reply(mess.done);
        } else {
          var memeg = await rell.updateProfilePicture(botNumber, {
            url: medis,
          });
          fs.unlinkSync(medis);
          reply(mess.done);
        }
        break;
      case "leave":
      case "out":
        if (!isOwner) return reply(mess.owner);
        if (!m.isGroup) return reply(mess.group);
        async function out() {
          m.reply("Bye Everyone 🥺");
          await sleep(5000);
          await rell.groupLeave(m.chat);
        }
        out();
        break;
      case "bc":
      case "broadcast":
        {
          if (!isOwner) return reply(mess.owner);
          if (!text) return reply("Text?");
          let teksnya = `${text}\n\n\n\nDate: ${zonawaktuwib}`;
          for (let i of Object.keys(global.db.data.users)) {
            await sleep(1500);
            if (/image/.test(mime)) {
              var media = await quoted.download();
              await rell.sendMessage(i, {
                image: media,
                caption: teksnya,
              });
            } else if (/video/.test(mime)) {
              var media = await quoted.download();
              await rell.sendMessage(i, {
                video: media,
                caption: teksnya,
              });
            } else if (text) {
              await rell.sendMessage(
                i,
                {
                  text: teksnya,
                },
                { quoted: fkontak }
              );
            }
          }
          reply(
            `Success ${command} To ${Object.keys(global.db.data.users).length
            } Users`
          );
        }
        break;
      case "block":
      case "ban":
        {
          if (!isOwner) return reply(mess.owner);
          let users = m.mentionedJid[0]
            ? m.mentionedJid[0]
            : m.quoted
              ? m.quoted.sender
              : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
          await rell.updateBlockStatus(users, "block");
          await reply(`Done`);
        }
        break;
      case "unblock":
      case "unban":
        {
          if (!isOwner) return reply(mess.owner);
          let users = m.mentionedJid[0]
            ? m.mentionedJid[0]
            : m.quoted
              ? m.quoted.sender
              : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
          await rell.updateBlockStatus(users, "unblock");
          await reply(`Done`);
        }
        break;
      case "bcgc":
      case "bcgroup":
        {
          if (!isOwner) return reply(mess.owner);
          if (!text)
            return reply(
              `Text mana?\n\nExample : ${prefix + command} Besok Libur `
            );
          let getGroups = await rell.groupFetchAllParticipating();
          let groups = Object.entries(getGroups)
            .slice(0)
            .map((entry) => entry[1]);
          let anu = groups.map((v) => v.id);
          reply(
            `Sending Broadcast To ${anu.length} Group Chat, End Time ${anu.length * 1.5
            } seconds`
          );
          for (let i of anu) {
            await sleep(1500);
            let a = `${text}`;
            rell.sendMessage(
              i,
              {
                text: a,
                contextInfo: {
                  externalAdReply: {
                    showAdAttribution: true,
                    title: `Rell-Broadcast`,
                    body: `Sent in 295k Group`,
                    thumbnailUrl:
                      "https://telegra.ph/file/ed2c4688b057216436079.jpg",
                    sourceUrl: `${wagc}`,
                    mediaType: 1,
                    renderLargerThumbnail: false,
                  },
                },
              },
              { quoted: fkontak }
            );
          }
          reply(`Successful in sending Broadcast To ${anu.length} Group`);
        }
        break;
      case "sendmsggc":
        {
          if (!isOwner) return reply(mess.owner);
          const args = `${text}`;
          const [groupId, message] = args.split("|");
          if (groupId && message) {
            reply(`Message sent to group ${groupId}`);
            rell.sendMessage(
              groupId,
              {
                text: message,
                contextInfo: {
                  externalAdReply: {
                    showAdAttribution: true,
                    title: botname,
                    body: ownername,
                    thumbnail: fs.readFileSync(
                      "./media/theme/cheemspic.jpg"
                    ),
                    sourceUrl: wagc,
                    mediaType: 1,
                    renderLargerThumbnail: false,
                  },
                },
              },
              { quoted: fkontak }
            );
          } else {
            reply(
              "Invalid command format. Correct format: .sendmsggc groupID|message"
            );
          }
        }
        break;
      case "listcase":
        {
          if (!isOwner) return reply(mess.owner);
          const code = fs.readFileSync("./core.js", "utf8");
          var regex = /case\s+"([^"]+)":/g;
          var matches = [];
          var matchhhhhh;
          while ((matchhhhhh = regex.exec(code))) {
            matches.push(matchhhhhh[1]);
          }
          let teks = `Total Case: ${matches.length} \n\n `;
          matches.forEach(function (x) {
            teks += "  ◦  " + x + "\n";
          });
          m.reply(teks);
        }
        break;
      case "getcase":
        if (!isOwner) return reply(mess.owner);
        try {
          const getCase = (cases) => {
            const fileContent = fs.readFileSync("core.js").toString();
            const caseParts = fileContent.split('case "' + cases + '"');

            // Check if the case exists in the file
            if (caseParts.length < 2)
              return m.reply(`case '${cases}' not found!`);

            const caseContent = caseParts[1].split("break")[0];
            return "case" + `'${cases}'` + caseContent + "break";
          };
          reply(`${getCase(q)}`);
        } catch (error) {
          reply(`Error: ${error.message}`);
        }
        break;
      case "setbotbio":
        {
          if (!isOwner) return reply(mess.owner);
          if (!text)
            return reply(
              `Where is the text?\nExample: ${prefix + command} Rell Bot`
            );
          await rell.updateProfileStatus(text);
          reply(`Success in changing the bio of bot's number`);
        }
        break;
      case "deleteppbot":
      case "delppbot":
        {
          if (!isOwner) return reply(mess.owner);
          await rell.removeProfilePicture(rell.user.id);
          reply(`Success in deleting bot's profile picture`);
        }
        break;
      //premium feature
      case "join":
        {
          try {
            if (premiumya === null) return reply(mess.premium);
            if (!text)
              return reply("Example: .join https://chat.whatsapp.com/xxx 7");
            if (args[1] === undefined)
              return reply("Example: .join https://chat.whatsapp.com/xxx 7");
            if (!isUrl(args[0]) && !args[0].includes("whatsapp.com"))
              return reply("Link Invalid!");
            let result = args[0].split("https://chat.whatsapp.com/")[1];
            rell.groupAcceptInvite(result);
            let idGroups = await rell.groupGetInviteInfo(result);
            let teks = `${idGroups.id}`;
            await addSewa(teks, args[1]);
            reply(`Done, bot akan di dalam group selama ${args[1]} hari`);
          } catch {
            reply("failed to join");
          }
        }
        break;
      case "gay":
      case "ahegao":
      case "ass":
      case "bdsm":
      case "blowjob":
      case "cuckold":
      case "cum":
      case "ero":
      case "femdom":
      case "foot":
      case "gangbang":
      case "glasses":
      case "hentai":
      case "gifs":
      case "jahy":
      case "manga":
      case "masturbation":
      case "neko":
      case "neko2":
      case "orgy":
      case "panties":
      case "pussy":
      case "tentacles":
      case "yuri":
      case "things":
      case "zettai":
        {
          if (premiumya === null) return reply(mess.premium);
          if (!m.isGroup) return reply(mess.group);
          if (!AntiNsfw) return reply(mess.nsfw);
          if (command == "gay") {
            const res = `https://api.betabotz.eu.org/api/nsfw/gay?apikey=${lann}`;
            await rell.sendFile(m.chat, res, "nsfw.jpg", "", m);
          }
          if (command == "ahegao") {
            const res = `https://api.betabotz.eu.org/api/nsfw/ahegao?apikey=${lann}`;
            await rell.sendFile(m.chat, res, "nsfw.jpg", "", m);
          }
          if (command == "ass") {
            const res = `https://api.betabotz.eu.org/api/nsfw/ass?apikey=${lann}`;
            await rell.sendFile(m.chat, res, "nsfw.jpg", "", m);
          }
          if (command == "bdsm") {
            const res = `https://api.betabotz.eu.org/api/nsfw/bdsm?apikey=${lann}`;
            await rell.sendFile(m.chat, res, "nsfw.jpg", "", m);
          }
          if (command == "blowjob") {
            const res = `https://api.betabotz.eu.org/api/nsfw/blowjob?apikey=${lann}`;
            await rell.sendFile(m.chat, res, "nsfw.jpg", "", m);
          }
          if (command == "cuckold") {
            const res = `https://api.betabotz.eu.org/api/nsfw/cuckold?apikey=ct${lann}`;
            await rell.sendFile(m.chat, res, "nsfw.jpg", "", m);
          }
          if (command == "cum") {
            const res = `https://api.betabotz.eu.org/api/nsfw/cum?apikey=${lann}`;
            await rell.sendFile(m.chat, res, "nsfw.jpg", "", m);
          }
          if (command == "ero") {
            const res = `https://api.betabotz.eu.org/api/nsfw/ero?apikey=${lann}`;
            await rell.sendFile(m.chat, res, "nsfw.jpg", "", m);
          }
          if (command == "femdom") {
            const res = `https://api.betabotz.eu.org/api/nsfw/femdom?apikey=${lann}`;
            await rell.sendFile(m.chat, res, "nsfw.jpg", "", m);
          }
          if (command == "foot") {
            const res = `https://api.betabotz.eu.org/api/nsfw/foot?apikey=${lann}`;
            await rell.sendFile(m.chat, res, "nsfw.jpg", "", m);
          }
          if (command == "gangbang") {
            const res = `https://api.betabotz.eu.org/api/nsfw/gangbang?apikey=${lann}`;
            await rell.sendFile(m.chat, res, "nsfw.jpg", "", m);
          }
          if (command == "glasses") {
            const res = `https://api.betabotz.eu.org/api/nsfw/glasses?apikey=${lann}`;
            await rell.sendFile(m.chat, res, "nsfw.jpg", "", m);
          }
          if (command == "hentai") {
            const res = `https://api.betabotz.eu.org/api/nsfw/hentai?apikey=${lann}`;
            await rell.sendFile(m.chat, res, "nsfw.jpg", "", m);
          }
          if (command == "gifs") {
            const res = `https://api.betabotz.eu.org/api/nsfw/gifs?apikey=${lann}`;
            await rell.sendFile(m.chat, res, null, "", m);
          }
          if (command == "jahy") {
            const res = `https://api.betabotz.eu.org/api/nsfw/jahy?apikey=${lann}`;
            await rell.sendFile(m.chat, res, "nsfw.jpg", "", m);
          }
          if (command == "manga") {
            const res = `https://api.betabotz.eu.org/api/nsfw/manga?apikey=${lann}`;
            await rell.sendFile(m.chat, res, "nsfw.jpg", "", m);
          }
          if (command == "masturbation") {
            const res = `https://api.betabotz.eu.org/api/nsfw/masturbation?apikey=${lann}`;
            await rell.sendFile(m.chat, res, "nsfw.jpg", "", m);
          }
          if (command == "neko") {
            const res = `https://api.betabotz.eu.org/api/nsfw/neko?apikey=${lann}`;
            await rell.sendFile(m.chat, res, "nsfw.jpg", "", m);
          }
          if (command == "neko2") {
            const res = `https://api.betabotz.eu.org/api/nsfw/neko2?apikey=${lann}`;
            await rell.sendFile(m.chat, res, "nsfw.jpg", "", m);
          }
          if (command == "orgy") {
            const res = `https://api.betabotz.eu.org/api/nsfw/orgy?apikey=${lann}`;
            await rell.sendFile(m.chat, res, "nsfw.jpg", "", m);
          }
          if (command == "panties") {
            const res = `https://api.betabotz.eu.org/api/nsfw/panties?apikey=${lann}`;
            await rell.sendFile(m.chat, res, "nsfw.jpg", "", m);
          }
          if (command == "pussy") {
            const res = `https://api.betabotz.eu.org/api/nsfw/pussy?apikey=${lann}`;
            await rell.sendFile(m.chat, res, "nsfw.jpg", "", m);
          }
          if (command == "tentacles") {
            const res = `https://api.betabotz.eu.org/api/nsfw/tentacles?apikey=${lann}`;
            await rell.sendFile(m.chat, res, "nsfw.jpg", "", m);
          }
          if (command == "yuri") {
            const res = `https://api.betabotz.eu.org/api/nsfw/yuri?apikey=${lann}`;
            await rell.sendFile(m.chat, res, "nsfw.jpg", "", m);
          }
          if (command == "thighs") {
            const res = `https://api.betabotz.eu.org/api/nsfw/thighs?apikey=${lann}`;
            await rell.sendFile(m.chat, res, "nsfw.jpg", "", m);
          }
          if (command == "zettai") {
            const res = `https://api.betabotz.eu.org/api/nsfw/zettai?apikey=${lann}`;
            await rell.sendFile(m.chat, res, "nsfw.jpg", "", m);
          }
        }
        break;
      case "anim":
        {
          if (premiumya === null) return reply(mess.premium);
          if (!text)
            return reply(
              `Example: ${prefix + command} cewek duduk di kursi pantai`
            );

          const res = await fetch(
            `https://api.elxyz.me/ai/texttoanime?apikey=KC-863f04e02eeb8078&prompt=${text}`
          );
          const data = await res.json();
          const { imageUrl } = data.result;

          await rell.sendMessage(
            m.chat,
            { image: { url: imageUrl }, caption: mess.done },
            { quoted: fkontak }
          );
        }
        break;
      //game feature
      case "ttc":
      case "ttt":
      case "tictactoe":
        {
          this.game = this.game ? this.game : {};
          if (
            Object.values(this.game).find(
              (room) =>
                room.id.startsWith("tictactoe") &&
                [room.game.playerX, room.game.playerO].includes(m.sender)
            )
          )
            return reply("Kamu masih didalam game");
          let room = Object.values(this.game).find(
            (room) =>
              room.state === "WAITING" && (text ? room.name === text : true)
          );
          if (room) {
            reply("Partner ditemukan!");
            room.o = m.chat;
            room.game.playerO = m.sender;
            room.state = "PLAYING";
            let arr = room.game.render().map((v) => {
              return {
                X: "❌",
                O: "⭕",
                1: "1️⃣",
                2: "2️⃣",
                3: "3️⃣",
                4: "4️⃣",
                5: "5️⃣",
                6: "6️⃣",
                7: "7️⃣",
                8: "8️⃣",
                9: "9️⃣",
              }[v];
            });
            let str = `Room ID: ${room.id}

${arr.slice(0, 3).join("")}
${arr.slice(3, 6).join("")}
${arr.slice(6).join("")}

Menunggu @${room.game.currentTurn.split("@")[0]}

Ketik *nyerah* untuk menyerah dan mengakui kekalahan`;
            if (room.x !== room.o)
              await rell.sendText(room.x, str, m, {
                mentions: parseMention(str),
              });
            await rell.sendText(room.o, str, m, {
              mentions: parseMention(str),
            });
          } else {
            room = {
              id: "tictactoe-" + +new Date(),
              x: m.chat,
              o: "",
              game: new TicTacToe(m.sender, "o"),
              state: "WAITING",
            };
            if (text) room.name = text;
            reply(
              "Menunggu partner" +
              (text
                ? ` mengetik command dibawah ini ${prefix}${command} ${text}`
                : "")
            );
            this.game[room.id] = room;
          }
        }
        break;
      case "delttc":
      case "delttt":
        {
          this.game = this.game ? this.game : {};
          try {
            if (this.game) {
              delete this.game;
              rell.sendText(m.chat, `Berhasil delete session TicTacToe`, m);
            } else if (!this.game) {
              reply(`Session TicTacToe🎮 tidak ada`);
            } else mewReply("?");
          } catch (e) {
            reply("rusak");
          }
        }
        break;
      case "suitpvp":
      case "suit":
        {
          this.suit = this.suit ? this.suit : {};
          let poin = 10;
          let poin_lose = 10;
          let timeout = 60000;
          if (
            Object.values(this.suit).find(
              (roof) =>
                roof.id.startsWith("suit") &&
                [roof.p, roof.p2].includes(m.sender)
            )
          )
            reply(`Selesaikan suit mu yang sebelumnya`);
          if (m.mentionedJid[0] === m.sender)
            return reply(`Tidak bisa bermain dengan diri sendiri !`);
          if (!m.mentionedJid[0])
            return reply(
              `_Siapa yang ingin kamu tantang?_\nTag orangnya..\n\nContoh : ${prefix}suit @tag`,
              m.chat,
              {
                mentions: [ownernumber[1] + "@s.whatsapp.net"],
              }
            );
          if (
            Object.values(this.suit).find(
              (roof) =>
                roof.id.startsWith("suit") &&
                [roof.p, roof.p2].includes(m.mentionedJid[0])
            )
          )
            return reply(
              `Orang yang kamu tantang sedang bermain suit bersama orang lain :(`
            );
          let id = "suit_" + new Date() * 1;
          let caption = `_*SUIT PvP*_

@${m.sender.split`@`[0]} menantang @${m.mentionedJid[0].split`@`[0]
            } untuk bermain suit

Silahkan @${m.mentionedJid[0].split`@`[0]} untuk ketik terima/tolak`;
          this.suit[id] = {
            chat: await rell.sendText(m.chat, caption, m, {
              mentions: parseMention(caption),
            }),
            id: id,
            p: m.sender,
            p2: m.mentionedJid[0],
            status: "wait",
            waktu: setTimeout(() => {
              if (this.suit[id]) rell.sendText(m.chat, `_Waktu suit habis_`, m);
              delete this.suit[id];
            }, 60000),
            poin,
            poin_lose,
            timeout,
          };
        }
        break;
      case "kuismath":
      case "math":
        {
          if (kuismath.hasOwnProperty(m.sender.split("@")[0]))
            return reply("Masih Ada Sesi Yang Belum Diselesaikan!");
          if (!text)
            return reply(
              `Mode: ${Object.keys(modes).join(
                " | "
              )}\nContoh: ${prefix}math medium`
            );
          let result = await genMath(text.toLowerCase());
          rell
            .sendText(
              m.chat,
              `*Berapa hasil dari: ${result.soal.toLowerCase()}*?\n\nWaktu: ${(
                result.waktu / 1000
              ).toFixed(2)} detik`,
              m
            )
            .then(() => {
              kuismath[m.sender.split("@")[0]] = result.jawaban;
            });
          await sleep(result.waktu);
          if (kuismath.hasOwnProperty(m.sender.split("@")[0])) {
            console.log("Jawaban: " + result.jawaban);
            reply("Waktu Habis\nJawaban: " + kuismath[m.sender.split("@")[0]]);
            delete kuismath[m.sender.split("@")[0]];
          }
        }
        break;
      case "family100":
        {
          if ("family100" + m.chat in _family100) {
            reply("Masih Ada Sesi Yang Belum Diselesaikan!");
            throw false;
          }
          let anu = await fetchJson(
            "https://raw.githubusercontent.com/BochilTeam/database/master/games/family100.json"
          );
          let random = anu[Math.floor(Math.random() * anu.length)];
          let hasil = `*Jawablah Pertanyaan Berikut :*\n${random.soal
            }\n\nTerdapat *${random.jawaban.length}* Jawaban ${random.jawaban.find((v) => v.includes(" "))
              ? `(beberapa Jawaban Terdapat Spasi)`
              : ""
            }`.trim();
          _family100["family100" + m.chat] = {
            id: "family100" + m.chat,
            pesan: await rell.sendText(m.chat, hasil, m),
            ...random,
            terjawab: Array.from(random.jawaban, () => false),
            hadiah: 6,
          };
        }
        break;
      case "tebak":
        {
          if (args[0] === "gambar") {
            if (tebakgambar.hasOwnProperty(m.sender.split("@")[0]))
              return reply("Masih Ada Sesi Yang Belum Diselesaikan!");
            let anu = await fetchJson(
              "https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakgambar.json"
            );
            let result = anu[Math.floor(Math.random() * anu.length)];
            rell
              .sendMessage(
                m.chat,
                {
                  image: {
                    url: result.img,
                  },
                  caption: `Silahkan Jawab Soal Di Atas Ini\n\nDeskripsi : ${result.deskripsi}\nWaktu : 60s`,
                },
                {
                  quoted: fkontak,
                }
              )
              .then(() => {
                tebakgambar[m.sender.split("@")[0]] =
                  result.jawaban.toLowerCase();
              });
            await sleep(60000);
            if (tebakgambar.hasOwnProperty(m.sender.split("@")[0])) {
              console.log("Jawaban: " + result.jawaban);
              rell.sendText(
                m.chat,
                `Waktu Habis\nJawaban:  ${tebakgambar[m.sender.split("@")[0]]}`,
                m
              );
              delete tebakgambar[m.sender.split("@")[0]];
            }
          } else if (args[0] === "kata") {
            if (tebakkata.hasOwnProperty(m.sender.split("@")[0]))
              return reply("Masih Ada Sesi Yang Belum Diselesaikan!");
            let anu = await fetchJson(
              "https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkata.json"
            );
            let result = anu[Math.floor(Math.random() * anu.length)];
            rell
              .sendText(
                m.chat,
                `Silahkan Jawab Pertanyaan Berikut\n\n${result.soal}\nWaktu : 60s`,
                m
              )
              .then(() => {
                tebakkata[m.sender.split("@")[0]] =
                  result.jawaban.toLowerCase();
              });
            await sleep(60000);
            if (tebakkata.hasOwnProperty(m.sender.split("@")[0])) {
              console.log("Jawaban: " + result.jawaban);
              rell.sendText(
                m.chat,
                `Waktu Habis\nJawaban:  ${tebakkata[m.sender.split("@")[0]]}`,
                m
              );
              delete tebakkata[m.sender.split("@")[0]];
            }
          } else if (args[0] === "kalimat") {
            if (tebakkalimat.hasOwnProperty(m.sender.split("@")[0]))
              return reply("Masih Ada Sesi Yang Belum Diselesaikan!");
            let anu = await fetchJson(
              "https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkalimat.json"
            );
            let result = anu[Math.floor(Math.random() * anu.length)];
            rell
              .sendText(
                m.chat,
                `Silahkan Jawab Pertanyaan Berikut\n\n${result.soal}\nWaktu : 60s`,
                m
              )
              .then(() => {
                tebakkalimat[m.sender.split("@")[0]] =
                  result.jawaban.toLowerCase();
              });
            await sleep(60000);
            if (tebakkalimat.hasOwnProperty(m.sender.split("@")[0])) {
              console.log("Jawaban: " + result.jawaban);
              rell.sendText(
                m.chat,
                `Waktu Habis\nJawaban:  ${tebakkalimat[m.sender.split("@")[0]]
                }`,
                m
              );
              delete tebakkalimat[m.sender.split("@")[0]];
            }
          } else if (args[0] === "lirik") {
            if (tebaklirik.hasOwnProperty(m.sender.split("@")[0]))
              return reply("Masih Ada Sesi Yang Belum Diselesaikan!");
            let anu = await fetchJson(
              "https://raw.githubusercontent.com/BochilTeam/database/master/games/tebaklirik.json"
            );
            let result = anu[Math.floor(Math.random() * anu.length)];
            rell
              .sendText(
                m.chat,
                `Ini Adalah Lirik Dari Lagu? : *${result.soal}*?\nWaktu : 60s`,
                m
              )
              .then(() => {
                tebaklirik[m.sender.split("@")[0]] =
                  result.jawaban.toLowerCase();
              });
            await sleep(60000);
            if (tebaklirik.hasOwnProperty(m.sender.split("@")[0])) {
              console.log("Jawaban: " + result.jawaban);
              rell.sendText(
                m.chat,
                `Waktu Habis\nJawaban:  ${tebaklirik[m.sender.split("@")[0]]}`,
                m
              );
              delete tebaklirik[m.sender.split("@")[0]];
            }
          } else if (args[0] === "tebakan") {
            if (tebaktebakan.hasOwnProperty(m.sender.split("@")[0]))
              return reply("Masih Ada Sesi Yang Belum Diselesaikan!");
            let anu = await fetchJson(
              "https://raw.githubusercontent.com/BochilTeam/database/master/games/tebaktebakan.json"
            );
            let result = anu[Math.floor(Math.random() * anu.length)];
            rell
              .sendText(
                m.chat,
                `Jawablah Pertanyaan Berikut : *${result.soal}*?\nWaktu : 60s`,
                m
              )
              .then(() => {
                tebaktebakan[m.sender.split("@")[0]] =
                  result.jawaban.toLowerCase();
              });
            await sleep(60000);
            if (tebaktebakan.hasOwnProperty(m.sender.split("@")[0])) {
              console.log("Jawaban: " + result.jawaban);
              rell.sendText(
                m.chat,
                `Waktu Habis\nJawaban:  ${tebaktebakan[m.sender.split("@")[0]]
                }`,
                m
              );
              delete tebaktebakan[m.sender.split("@")[0]];
            }
          } else if (args[0] === "bendera") {
            if (tebakbendera.hasOwnProperty(m.sender.split("@")[0]))
              return reply("Masih Ada Sesi Yang Belum Diselesaikan!");
            let anu = await fetchJson(
              "https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakbendera.json"
            );
            let result = anu[Math.floor(Math.random() * anu.length)];
            rell
              .sendMessage(
                m.chat,
                {
                  image: {
                    url: result.img,
                  },
                  caption: `Silahkan Jawab Gambar Berikut\n\nClue : ${result.flag}\nWaktu : 60s`,
                },
                {
                  quoted: fkontak,
                }
              )
              .then(() => {
                tebakbendera[m.sender.split("@")[0]] =
                  result.name.toLowerCase();
              });
            await sleep(60000);
            if (tebakbendera.hasOwnProperty(m.sender.split("@")[0])) {
              console.log("Jawaban: " + result.name);
              rell.sendText(
                m.chat,
                `Waktu Habis\nJawaban:  ${tebakbendera[m.sender.split("@")[0]]
                }`,
                m
              );
              delete tebakbendera[m.sender.split("@")[0]];
            }
          } else if (args[0] === "bendera2") {
            if (tebakbendera2.hasOwnProperty(m.sender.split("@")[0]))
              return reply("Masih Ada Sesi Yang Belum Diselesaikan!");
            let anu = await fetchJson(
              "https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakbendera2.json"
            );
            let result = anu[Math.floor(Math.random() * anu.length)];
            rell
              .sendMessage(
                m.chat,
                {
                  image: {
                    url: result.img,
                  },
                  caption: `Silahkan Jawab Gambar Berikut\n\nWaktu : 60s`,
                },
                {
                  quoted: fkontak,
                }
              )
              .then(() => {
                tebakbendera2[m.sender.split("@")[0]] =
                  result.name.toLowerCase();
              });
            await sleep(60000);
            if (tebakbendera2.hasOwnProperty(m.sender.split("@")[0])) {
              console.log("Jawaban: " + result.name);
              rell.sendText(
                m.chat,
                `Waktu Habis\nJawaban:  ${tebakbendera2[m.sender.split("@")[0]]
                }`,
                m
              );
              delete tebakbendera2[m.sender.split("@")[0]];
            }
          } else if (args[0] === "kabupaten") {
            if (tebakkabupaten.hasOwnProperty(m.sender.split("@")[0]))
              return reply("Masih Ada Sesi Yang Belum Diselesaikan!");
            let anu = await fetchJson(
              "https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkabupaten.json"
            );
            let result = anu[Math.floor(Math.random() * anu.length)];
            rell
              .sendImage(
                m.chat,
                result.url,
                `Silahkan Jawab Gambar Berikut\n\nWaktu : 60s`,
                m
              )
              .then(() => {
                tebakkabupaten[m.sender.split("@")[0]] =
                  result.title.toLowerCase();
              });
            await sleep(60000);
            if (tebakkabupaten.hasOwnProperty(m.sender.split("@")[0])) {
              console.log("Jawaban: " + result.title);
              rell.sendText(
                m.chat,
                `Waktu Habis\nJawaban:  ${tebakkabupaten[m.sender.split("@")[0]]
                }`,
                m
              );
              delete tebakkabupaten[m.sender.split("@")[0]];
            }
          } else if (args[0] === "kimia") {
            if (tebakkimia.hasOwnProperty(m.sender.split("@")[0]))
              return reply("Masih Ada Sesi Yang Belum Diselesaikan!");
            let anu = await fetchJson(
              "https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkimia.json"
            );
            let result = anu[Math.floor(Math.random() * anu.length)];
            rell
              .sendText(
                m.chat,
                `Silahkan Jawab Pertanyaan Berikut\n\nUnsur : ${result.unsur}\nWaktu : 60s`,
                m
              )
              .then(() => {
                tebakkimia[m.sender.split("@")[0]] =
                  result.lambang.toLowerCase();
              });
            await sleep(60000);
            if (tebakkimia.hasOwnProperty(m.sender.split("@")[0])) {
              console.log("Jawaban: " + result.lambang);
              rell.sendText(
                m.chat,
                `Waktu Habis\nJawaban:  ${tebakkimia[m.sender.split("@")[0]]}`,
                m
              );
              delete tebakkimia[m.sender.split("@")[0]];
            }
          } else if (args[0] === "asahotak") {
            if (tebakasahotak.hasOwnProperty(m.sender.split("@")[0]))
              return reply("Masih Ada Sesi Yang Belum Diselesaikan!");
            let anu = await fetchJson(
              "https://raw.githubusercontent.com/BochilTeam/database/master/games/asahotak.json"
            );
            let result = anu[Math.floor(Math.random() * anu.length)];
            rell
              .sendText(
                m.chat,
                `Silahkan Jawab Pertanyaan Berikut\n\nSoal : ${result.soal}\nWaktu : 60s`,
                m
              )
              .then(() => {
                tebakasahotak[m.sender.split("@")[0]] =
                  result.jawaban.toLowerCase();
              });
            await sleep(60000);
            if (tebakasahotak.hasOwnProperty(m.sender.split("@")[0])) {
              console.log("Jawaban: " + result.jawaban);
              rell.sendText(
                m.chat,
                `Waktu Habis\nJawaban:  ${tebakasahotak[m.sender.split("@")[0]]
                }`,
                m
              );
              delete tebakasahotak[m.sender.split("@")[0]];
            }
          } else if (args[0] === "siapakahaku") {
            if (tebaksiapakahaku.hasOwnProperty(m.sender.split("@")[0]))
              return reply("Masih Ada Sesi Yang Belum Diselesaikan!");
            let anu = await fetchJson(
              "https://raw.githubusercontent.com/BochilTeam/database/master/games/siapakahaku.json"
            );
            let result = anu[Math.floor(Math.random() * anu.length)];
            rell
              .sendText(
                m.chat,
                `Silahkan Jawab Pertanyaan Berikut\n\nSoal : ${result.soal}\nWaktu : 60s`,
                m
              )
              .then(() => {
                tebaksiapakahaku[m.sender.split("@")[0]] =
                  result.jawaban.toLowerCase();
              });
            await sleep(60000);
            if (tebaksiapakahaku.hasOwnProperty(m.sender.split("@")[0])) {
              console.log("Jawaban: " + result.jawaban);
              rell.sendText(
                m.chat,
                `Waktu Habis\nJawaban:  ${tebaksiapakahaku[m.sender.split("@")[0]]
                }`,
                m
              );
              delete tebaksiapakahaku[m.sender.split("@")[0]];
            }
          } else if (args[0] === "susunkata") {
            if (tebaksusunkata.hasOwnProperty(m.sender.split("@")[0]))
              return reply("Masih Ada Sesi Yang Belum Diselesaikan!");
            let anu = await fetchJson(
              "https://raw.githubusercontent.com/BochilTeam/database/master/games/susunkata.json"
            );
            let result = anu[Math.floor(Math.random() * anu.length)];
            rell
              .sendText(
                m.chat,
                `Silahkan Jawab Pertanyaan Berikut\n\nSoal : ${result.soal}\nTipe : ${result.tipe}\nWaktu : 60s`,
                m
              )
              .then(() => {
                tebaksusunkata[m.sender.split("@")[0]] =
                  result.jawaban.toLowerCase();
              });
            await sleep(60000);
            if (tebaksusunkata.hasOwnProperty(m.sender.split("@")[0])) {
              console.log("Jawaban: " + result.jawaban);
              rell.sendText(
                m.chat,
                `Waktu Habis\nJawaban:  ${tebaksusunkata[m.sender.split("@")[0]]
                }`,
                m
              );
              delete tebaksusunkata[m.sender.split("@")[0]];
            }
          } else if (args[0] === "tekateki") {
            if (tebaktekateki.hasOwnProperty(m.sender.split("@")[0]))
              return reply("Masih Ada Sesi Yang Belum Diselesaikan!");
            let anu = await fetchJson(
              "https://raw.githubusercontent.com/BochilTeam/database/master/games/tekateki.json"
            );
            let result = anu[Math.floor(Math.random() * anu.length)];
            rell
              .sendText(
                m.chat,
                `Silahkan Jawab Pertanyaan Berikut\n\nSoal : ${result.soal}\nWaktu : 60s`,
                m
              )
              .then(() => {
                tebaktekateki[m.sender.split("@")[0]] =
                  result.jawaban.toLowerCase();
              });
            await sleep(60000);
            if (tebaktekateki.hasOwnProperty(m.sender.split("@")[0])) {
              console.log("Jawaban: " + result.jawaban);
              rell.sendText(
                m.chat,
                `Waktu Habis\nJawaban:  ${tebaktekateki[m.sender.split("@")[0]]
                }`,
                m
              );
              delete tebaktekateki[m.sender.split("@")[0]];
            }
          }
        }
        break;
      case "akinator":
        reply(
          `Akinator adalah sebuah permainan dan aplikasi perangkat bergerak yang berupaya menebak secara rinci dan pasti isi pikiran Pengguna permainan ini melalui serentetan pertanyaan.\n\n~> ${prefix}akinatorstart : Untuk memulai\n~> ${prefix}akinatorstop : Untuk berhenti`
        );
        break;
      case "akinatorstart":
        if (premiumya === null) return reply(mess.premium);
        if (m.isGroup) return reply(mess.private);
        if (akinator.hasOwnProperty(m.sender.split("@")[0]))
          return reply("Selesein yg sebelumnya dulu atuh");
        get_result = await fetchJson(
          `https://api.lolhuman.xyz/api/akinator/start?apikey=${APIs.lolkey}`
        );
        let { server, frontaddr, session, signature, question, step } =
          get_result.result;
        const data = {};
        data["server"] = server;
        data["frontaddr"] = frontaddr;
        data["session"] = session;
        data["signature"] = signature;
        data["question"] = question;
        data["step"] = step;
        imi_txt = `${question}\n\n`;
        imi_txt += "0 - Ya\n";
        imi_txt += "1 - Tidak\n";
        imi_txt += "2 - Saya Tidak Tau\n";
        imi_txt += "3 - Mungkin\n";
        imi_txt += "4 - Mungkin Tidak";
        rell.sendText(m.chat, imi_txt, m).then(() => {
          akinator[m.sender.split("@")[0]] = data;
          fs.writeFileSync(
            "./src/data/akinator.json",
            JSON.stringify(akinator)
          );
        });
        break;
      case "akinatorstop":
        if (!akinator.hasOwnProperty(m.sender.split("@")[0]))
          return reply("Anda tidak memiliki akinator sebelumnya");
        delete akinator[m.sender.split("@")[0]];
        fs.writeFileSync("./src/data/akinator.json", JSON.stringify(akinator));
        reply("Success mengcancel akinator sebelumnya");
        break;
      //maker feature
      case "photoleap":
        {
          if (!text) return reply(`*• Example:* ${prefix + command} blue sea`);
          let currentTime = Date.now();
          let lastUsed = 0;
          if (currentTime - lastUsed < 10000)
            return reply("Cooldown 10 seconds, try again later");
          lastUsed = currentTime;
          try {
            let gpt = await (
              await fetch(
                `https://tti.photoleapapp.com/api/v1/generate?prompt=${text}`
              )
            ).json();
            rell.sendMessage(
              m.chat,
              { image: { url: gpt.result_url }, caption: text },
              { quoted: fkontak }
            );
          } catch (e) {
            return reply("`*Error*`");
          }
        }
        break;
      case "smeme":
      case "stickermeme":
      case "stickmeme":
        {
          if (!/webp/.test(mime) && /image/.test(mime)) {
            if (!text) return reply(`Usage: ${prefix + command} text1|text2`);
            atas = text.split("|")[0] ? text.split("|")[0] : "-";
            bawah = text.split("|")[1] ? text.split("|")[1] : "-";
            mee = await rell.downloadAndSaveMediaMessage(quoted);
            mem = await TelegraPh(mee);
            meme = `https://api.memegen.link/images/custom/${encodeURIComponent(
              atas
            )}/${encodeURIComponent(bawah)}.png?background=${mem}`;
            memek = await rell.sendImageAsSticker(m.chat, meme, m, {
              packname: global.packname,
              author: global.author,
            });
          } else {
            reply(
              `Send/reply image with caption ${prefix + command} text1|text2`
            );
          }
        }
        break;
      case "s":
      case "sticker":
      case "stiker":
        {
          if (!quoted)
            return reply(
              `Send/Reply Images/Videos/Gifs With Captions ${prefix + command}`
            );
          if (/image/.test(mime)) {
            let media = await quoted.download();
            let encmedia = await rell.sendImageAsSticker(m.chat, media, m, {
              packname: global.packname,
              author: global.author,
            });
            let react = rell.sendMessage(m.chat, {
              react: { text: "✅", key: m.key },
            });
          } else if (/video/.test(mime)) {
            if ((quoted.msg || quoted).seconds > 11)
              return reply(`Video terlalu besar`);
            let media = await quoted.download();
            let encmedia = await rell.sendVideoAsSticker(m.chat, media, m, {
              packname: global.packname,
              author: global.author,
            });
            let react = rell.sendMessage(m.chat, {
              react: { text: "✅", key: m.key },
            });
          } else {
            reply(
              `Send/Reply Images/Videos/Gifs With Captions ${prefix + command}`
            );
          }
        }
        break;
      case "ttp":
        {
          if (!text) return m.reply("Textnya Mana?");
          let res = await fetch(
            `https://api.betabotz.eu.org/api/maker/ttp?text=${text}&apikey=${lann}`
          );
          if (!res.ok) throw await res.text();
          let img = await res.buffer();
          let encmedia = await rell.sendImageAsSticker(m.chat, img, m, {
            packname: global.packname,
            author: global.author,
          });
          await fs.unlinkSync(encmedia);
          let reactmas = rell.sendMessage(m.chat, {
            react: { text: "✅", key: m.key },
          });
        }
        break;
      case "wm":
      case "swm":
      case "steal":
      case "stickerwm":
      case "take":
        {
          const isUrl = (text) => {
            return text.match(
              new RegExp(
                /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/,
                "gi"
              )
            );
          };
          let q = m.quoted ? m.quoted : m;
          let mime = (q.msg || q).mimetype || "";
          if (/video/g.test(mime))
            if ((q.msg || q).seconds > 11) return m.reply("Maksimal 10 detik!");
          try {
            let img = await q.download();

            if (!img) throw `balas gambar/video/stiker dengan perintah .stiker`;
            rell.sendImageAsSticker(m.chat, img, m, {
              packname: text,
              author: "",
            });
          } catch {
            throw "Gagal!, Balas Gambar/video dengan caption *.stiker*";
          }
        }
        break;
      case "toqr":
        {
          if (!q) return reply(" Please include link or text!");
          let qyuer = await qrcode.toDataURL(q, { scale: 35 });
          let data = new Buffer.from(
            qyuer.replace("data:image/png;base64,", ""),
            "base64"
          );
          let buff = getRandom(".jpg");
          await fs.writeFileSync("./" + buff, data);
          let medi = fs.readFileSync("./" + buff);
          await rell.sendMessage(
            from,
            { image: medi, caption: "Here you go!" },
            { quoted: fkontak }
          );
          setTimeout(() => {
            fs.unlinkSync(buff);
          }, 10000);
        }
        break;
      case "ytgold":
        if (!text || typeof text !== "string") {
          return m.reply(`Example: ${prefix + command} RellMD`);
        }

        try {
          // Fetch the image buffer from the API
          let lanny = await getBuffer(
            `https://api.betabotz.eu.org/api/ephoto/ytgoldbutton?text=${encodeURIComponent(
              text
            )}&apikey=${lann}`
          );

          // Send the image message with the buffer
          let repsadsa = await rell.sendMessage(
            m.chat,
            { image: lanny, caption: "don" },
            { quoted: fkontak }
          );
        } catch (error) {
          console.error(error); // Log the error for debugging purposes
          m.reply("An error occurred while processing your request.");
        }
        break;

      case "ytsilver":
        if (!text || typeof text !== "string") {
          return m.reply(`Example: ${prefix + command} RellMD`);
        }
        try {
          let lann2 = await getBuffer(
            `https://api.betabotz.eu.org/api/ephoto/ytsilverbutton?text=${text}&apikey=${lann}`
          );
          let responsss = await rell.sendMessage(
            m.chat,
            { image: lann2, caption: `don` },
            { quoted: fkontak }
          );
        } catch (error) {
          console.error(error); // Log the error for debugging purposes
          m.reply("An error occurred while processing your request.");
        }
        break;

      case "iggold":
        if (!text || typeof text !== "string") {
          return m.reply(`Example: ${prefix + command} RellMD`);
        }
        try {
          let lann1 = await getBuffer(
            `https://api.betabotz.eu.org/api/ephoto/iggoldbutton?text=${text}&apikey=${lann}`
          );
          let responsss = await rell.sendMessage(
            m.chat,
            { image: lann1, caption: `don` },
            { quoted: fkontak }
          );
        } catch (error) {
          console.error(error); // Log the error for debugging purposes
          m.reply("An error occurred while processing your request.");
        }
        break;

      case "igsilver":
        if (!text || typeof text !== "string") {
          return m.reply(`Example: ${prefix + command} RellMD`);
        }
        try {
          let lann3 = await getBuffer(
            `https://api.betabotz.eu.org/api/ephoto/igsilverbutton?text=${text}&apikey=${lann}`
          );
          let responsss = await rell.sendMessage(
            m.chat,
            { image: lann3, caption: `don` },
            { quoted: fkontak }
          );
        } catch (error) {
          console.error(error); // Log the error for debugging purposes
          m.reply("An error occurred while processing your request.");
        }
        break;

      case "fbgold":
        if (!text || typeof text !== "string") {
          return m.reply(`Example: ${prefix + command} RellMD`);
        }
        try {
          let lann12 = await getBuffer(
            `https://api.betabotz.eu.org/api/ephoto/fbgoldbutton?text=${text}&apikey=${lann}`
          );
          let responsss = await rell.sendMessage(
            m.chat,
            { image: lann12, caption: `don` },
            { quoted: fkontak }
          );
        } catch (error) {
          console.error(error); // Log the error for debugging purposes
          m.reply("An error occurred while processing your request.");
        }
        break;

      case "fbsilver":
        if (!text || typeof text !== "string") {
          return m.reply(`Example: ${prefix + command} RellMD`);
        }
        try {
          let lann31 = await getBuffer(
            `https://api.betabotz.eu.org/api/ephoto/fbsilverbutton?text=${text}&apikey=${lann}`
          );
          let responsss = await rell.sendMessage(
            m.chat,
            { image: lann31, caption: `don` },
            { quoted: fkontak }
          );
        } catch (error) {
          console.error(error); // Log the error for debugging purposes
          m.reply("An error occurred while processing your request.");
        }
        break;

      case "twtgold":
        if (!text || typeof text !== "string") {
          return m.reply(`Example: ${prefix + command} RellMD`);
        }
        try {
          let lann121 = await getBuffer(
            `https://api.betabotz.eu.org/api/ephoto/twtgoldbutton?text=${text}&apikey=${lann}`
          );
          let responsss = await rell.sendMessage(
            m.chat,
            { image: lann121, caption: `don` },
            { quoted: fkontak }
          );
        } catch (error) {
          console.error(error); // Log the error for debugging purposes
          m.reply("An error occurred while processing your request.");
        }
        break;

      case "twtsilver":
        if (!text || typeof text !== "string") {
          return m.reply(`Example: ${prefix + command} RellMD`);
        }
        try {
          let lann312 = await getBuffer(
            `https://api.betabotz.eu.org/api/ephoto/twtsilverbutton?text=${text}&apikey=${lann}`
          );
          let responsss = await rell.sendMessage(
            m.chat,
            { image: lann312, caption: `don` },
            { quoted: fkontak }
          );
        } catch (error) {
          console.error(error); // Log the error for debugging purposes
          m.reply("An error occurred while processing your request.");
        }
        break;
      case "qc":
        {
          if (text > 25)
            return m.reply(`Contoh :

1. Kirim perintah ${prefix + command} *teks*
 Contoh : ${prefix + command} LU KONTOL

Maksimal 25 karakter`);
          let teks = m.quoted ? quoted.text : text;
          try {
            try {
              pic = await rell.profilePictureUrl(m.sender, "image");
            } catch {
              pic = "https://telegra.ph/file/c3f3d2c2548cbefef1604.jpg";
            }
            const obj = {
              type: "quote",
              format: "png",
              backgroundColor: "#333333",
              width: 512,
              height: 768,
              scale: 2,
              messages: [
                {
                  entities: [],
                  avatar: true,
                  from: {
                    id: 1,
                    name: pushname,
                    photo: {
                      url: pic,
                    },
                  },
                  text: teks,
                  replyMessage: {},
                },
              ],
            };
            const json = await axios.post(
              "https://bot.lyo.su/quote/generate",
              obj,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            const buffer = Buffer.from(json.data.result.image, "base64");
            rell.sendImageAsSticker(m.chat, buffer, m, {
              packname: global.packname,
              author: global.author,
            }); //m.reply(util.format(json.data.result.image))
          } catch (e) {
            console.log(e);
            reply(`${e}\n\nServer sedang eror, coba lagi tahun depan`);
          }
        }
        break;
      //convert feature
      case "toanime":
      case "jadianime":
        {
          var q = m.quoted ? m.quoted : m;
          var mimes = (q.msg || q).mimetype || q.mediaType || "";
          if (/image/g.test(mimes) && !/webp/g.test(mimes)) {
            try {
              const img = await q.download?.();
              let out = await uploadImage(img);
              let old = new Date();
              let convert = await fetchJson(
                `https://api.betabotz.eu.org/api/maker/jadianime?url=${out}&apikey=${lann}`
              );
              let buff = await getBuffer(convert.result.img_crop_single);
              await rell.sendMessage(
                m.chat,
                {
                  image: buff,
                  caption: `🍟 *Fetching* : ${(new Date() - old) * 1} ms`,
                },
                { quoted: fkontak }
              );
            } catch (e) {
              console.log(e);
              m.reply(`[ ! ] Identifikasi Gagal.`);
            }
          } else {
            m.reply(
              `Kirim gambar dengan caption *${prefix + command
              }* atau tag gambar yang sudah dikirim`
            );
          }
        }
        break;
      case "toimage":
      case "toimg":
        {
          if (!/webp/.test(mime))
            return reply(`Reply sticker dengan caption *${prefix + command}*`);
          reply(mess.loading);
          let media = await rell.downloadAndSaveMediaMessage(qmsg);
          let ran = await getRandom(".png");
          exec(`ffmpeg -i ${media} ${ran}`, (err) => {
            fs.unlinkSync(media);
            if (err) return err;
            let buffer = fs.readFileSync(ran);
            rell.sendMessage(
              m.chat,
              {
                image: buffer,
              },
              {
                quoted: fkontak,
              }
            );
            fs.unlinkSync(ran);
          });
        }
        break;
      case "tomp4":
        {
          let media = await rell.downloadAndSaveMediaMessage(qmsg);
          let ran = await getRandom(".mp4"); // Change to .mp4 for video
          exec(
            `ffmpeg -i ${media} -c:v libx264 -crf 23 -preset veryfast ${ran}`,
            (err) => {
              fs.unlinkSync(media);
              if (err) return err;
              let buffer = fs.readFileSync(ran);
              rell.sendMessage(
                m.chat,
                {
                  video: buffer, // Change 'url' to 'buffer'
                  caption: "SUCCESS",
                },
                {
                  quoted: fkontak,
                }
              );
              fs.unlinkSync(ran);
            }
          );
        }
        break;
      case "toaud":
      case "toaudio":
        {
          if (!/video/.test(mime) && !/audio/.test(mime))
            return reply(
              `Send/Reply Video/Audio that you want to make into audio with captions ${prefix + command
              }`
            );
          let media = await rell.downloadMediaMessage(qmsg);
          let audio = await toAudio(media, "mp4");
          rell.sendMessage(
            m.chat,
            {
              audio: audio,
              mimetype: "audio/mpeg",
            },
            {
              quoted: fkontak,
            }
          );
        }
        break;
      case "tomp3":
        {
          if (!/video/.test(mime) && !/audio/.test(mime))
            return reply(
              `Send/Reply Video/Audio that you want to make into MP3 with captions ${prefix + command
              }`
            );
          let media = await rell.downloadMediaMessage(qmsg);
          let audio = await toAudio(media, "mp4");
          rell.sendMessage(
            m.chat,
            {
              document: audio,
              mimetype: "audio/mp3",
              fileName: `rell.mp3`,
            },
            {
              quoted: fkontak,
            }
          );
        }
        break;
      case "tovn":
      case "toptt":
        {
          if (!/video/.test(mime) && !/audio/.test(mime))
            return reply(
              `Send/Reply Video/Audio that you want to make into a VN with captions ${prefix + command
              }`
            );
          let media = await rell.downloadMediaMessage(qmsg);
          let audio = await toPTT(media, "mp4");
          rell.sendMessage(
            m.chat,
            {
              audio: audio,
              mimetype: "audio/mpeg",
              ptt: true,
            },
            {
              quoted: fkontak,
            }
          );
        }
        break;
      case "togif":
        {
          if (!/webp/.test(mime))
            return reply(`Reply sticker with caption *${prefix + command}*`);
          let media = await rell.downloadAndSaveMediaMessage(qmsg);
          let webpToMp4 = await webp2mp4File(media);
          await rell.sendMessage(
            m.chat,
            {
              video: {
                url: webpToMp4.result,
                caption: "Convert Webp To Video",
              },
              gifPlayback: true,
            },
            {
              quoted: fkontak,
            }
          );
          await fs.unlinkSync(media);
        }
        break;
      case "tourl":
        {
          let media = await rell.downloadAndSaveMediaMessage(qmsg);
          if (/image/.test(mime)) {
            let anu = await TelegraPh(media);
            reply(util.format(anu));
          } else if (!/image/.test(mime)) {
            let anu = await UploadFileUgu(media);
            reply(util.format(anu));
          }
          await fs.unlinkSync(media);
        }
        break;
      case "toonce":
      case "toviewonce":
        {
          if (!quoted) return reply(`Reply Image/Video`);
          if (/image/.test(mime)) {
            anuan = await rell.downloadAndSaveMediaMessage(quoted);
            rell.sendMessage(
              m.chat,
              {
                image: {
                  url: anuan,
                },
                caption: mess.done,
                fileLength: "999",
                viewOnce: true,
              },
              {
                quoted: fkontak,
              }
            );
          } else if (/video/.test(mime)) {
            anuanuan = await rell.downloadAndSaveMediaMessage(quoted);
            rell.sendMessage(
              m.chat,
              {
                video: {
                  url: anuanuan,
                },
                caption: mess.done,
                fileLength: "99999999",
                viewOnce: true,
              },
              {
                quoted: fkontak,
              }
            );
          } else if (/audio/.test(mime)) {
            bebasap = await rell.downloadAndSaveMediaMessage(quoted);
            rell.sendMessage(m.chat, {
              audio: {
                url: bebasap,
              },
              mimetype: "audio/mpeg",
              ptt: true,
              viewOnce: true,
            });
          }
        }
        break;
      case "tozombie":
      case "jadizombie":
        {
          var q = m.quoted ? m.quoted : m;
          var mimes = (q.msg || q).mimetype || q.mediaType || "";
          if (/image/g.test(mimes) && !/webp/g.test(mimes)) {
            try {
              const img = await q.download?.();
              let out = await uploadImage(img);
              let old = new Date();
              let convert = await fetchJson(
                `https://api.betabotz.eu.org/api/maker/jadizombie?url=${out}&apikey=${lann}`
              );
              let buff = await getBuffer(convert.result);
              await rell.sendMessage(
                m.chat,
                {
                  image: buff,
                  caption: `🍟 *Fetching* : ${(new Date() - old) * 1} ms`,
                },
                { quoted: fkontak }
              );
            } catch (e) {
              console.log(e);
              m.reply(`[ ! ] Identifikasi Gagal.`);
            }
          } else {
            m.reply(
              `Kirim gambar dengan caption *${prefix + command
              }* atau tag gambar yang sudah dikirim`
            );
          }
        }
        break;
      case "hd":
      case "hdr":
      case "remini":
        {
          if (!quoted) return m.reply(`Fotonya Mana?`);
          if (!/image/.test(mime))
            return m.reply(
              `Send/Reply Foto Dengan Caption ${prefix + command}`
            );
          try {
            let media = await quoted.download();
            let img = await uploadImage(media);
            let proses = await fetch(
              `https://api.betabotz.eu.org/api/tools/remini?url=${img}&apikey=${lann}`
            );
            let api = await proses.json();
            let buffer = await getBuffer(api.url);
            rell.sendMessage(
              m.chat,
              {
                image: buffer,
                caption: "BY RELL-MD",
              },
              {
                quoted: fkontak,
              }
            );
          } catch (error) {
            console.error(error); // Log the error for debugging purposes
            m.reply(error);
          }
        }
        break;
      case "hd2":
      case "hdr2":
      case "remini2":
        {
          if (!quoted) return m.reply(`Fotonya Mana?`);
          if (!/image/.test(mime))
            return m.reply(
              `Send/Reply Foto Dengan Caption ${prefix + command}`
            );
          try {
            let media = await quoted.download();
            let img = await uploadImage(media);
            let proses = await fetch(
              `https://api.betabotz.eu.org/api/tools/remini-v2?url=${img}&apikey=${lann}`
            );
            let api = await proses.json();
            let buffer = await getBuffer(api.url);
            rell.sendMessage(
              m.chat,
              {
                image: buffer,
                caption: "BY RELL-MD",
              },
              {
                quoted: fkontak,
              }
            );
          } catch (error) {
            console.error(error); // Log the error for debugging purposes
            m.reply(error);
          }
        }
        break;
      case "coffee":
      case "kopi":
        {
          rell.sendMessage(
            m.chat,
            {
              caption: mess.success,
              image: { url: "https://coffee.alexflipnote.dev/random" },
            },
            { quoted: fkontak }
          );
        }
        break;
      case "carbon":
        {
          let text;
          if (args.length >= 1) {
            text = args.slice(0).join(" ");
          } else if (m.quoted && m.quoted.text) {
            text = m.quoted.text;
          } else
            reply("Input teks atau reply teks yang ingin di jadikan carbon!");
          try {
            reply(mess.loading);
            let img = await fetch(
              `https://api.betabotz.eu.org/api/maker/carbon?text=${text}&apikey=${lann}`
            );
            let json = await img.json();
            await rell.sendImageAsSticker(from, json.result, m, {
              packname: global.packname,
              author: global.author,
            });
          } catch (e) {
            return reply("server down");
          }
        }
        break;
      case "txt2img":
        {
          const ress = `https://aemt.me/v6/text2img?text=${encodeURIComponent(
            text
          )}`;
          await rell.sendMessage(m.chat, {
            image: { url: ress },
            caption: `DONE`,
          });
        }
        break;
      case "bingimg":
        {
          if (!text) return reply(`Example: ${prefix + command} michie`);

          const res = await fetch(
            `https://anabot.my.id/api/ai/bingAi?prompt=${encodeURIComponent(
              text
            )}&apikey=DitzOfc`
          );
          const data = await res.json();
          const { image } = data;

          async function getImageMessage(url) {
            const { imageMessage } = await generateWAMessageContent(
              {
                image: {
                  url,
                },
              },
              {
                upload: rell.waUploadToServer,
              }
            );
            return imageMessage;
          }

          let cards = [];
          for (let i = 0; i < image.length; i++) {
            const url = image[i];
            const imageMsg = await getImageMessage(url);
            cards.push({
              header: {
                imageMessage: imageMsg,
                hasMediaAttachment: true,
              },
              body: { text: ` Image ${i + 1}` },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: "cta_url",
                    buttonParamsJson:
                      '{"display_text":"Saweria ☘️","url":"https://saweria.co/rein122","webview_presentation":null}',
                  },
                ],
              },
            });
          }

          let msg = generateWAMessageFromContent(
            m.chat,
            {
              viewOnceMessage: {
                message: {
                  interactiveMessage: {
                    body: {
                      text: `Hai kak ${pushname}, berikut 5 foto dari bing img`,
                    },
                    carouselMessage: {
                      cards,
                      messageVersion: 1,
                    },
                  },
                },
              },
            },
            {}
          );

          await rell.relayMessage(msg.key.remoteJid, msg.message, {
            messageId: msg.key.id,
          });
        }
        break;
      case "lumin":
        {
          const quoted = m.quoted || m;
          const mime = (quoted.msg || quoted).mimetype || "";

          try {
            const url = "https://luminai.siputzx.my.id/";
            const data = {
              content: m.text, // Use m.text instead of text
              user: sender,
            };

            if (quoted && /image/.test(mime)) {
              const imageBuffer = await quoted.download();
              data.imageBuffer = imageBuffer;
            }

            const response = await axios.post(url, data);
            const anu = response.data.result;
            m.reply(anu);
          } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
          }
        }
        break;
      case "aiimg":
        {
          let anu = `https://api.betabotz.eu.org/api/search/openai-image?text=${text}&apikey=${lann}`;
          rell.sendMessage(m.chat, { image: { url: anu }, caption: `` });
        }
        break;
      case "bardimg":
        {
          let q = m.quoted ? m.quoted : m;
          let mime = (q.msg || q).mimetype || q.mediaType || "";
          if (/image/g.test(mime) && !/webp/g.test(mime)) {
            let buffer = await rell.downloadAndSaveMediaMessage(qmsg);
            try {
              let media = await TelegraPh(buffer);
              let json = await (
                await fetch(
                  `https://api.betabotz.eu.org/api/search/bard-img?url=${media}&text=${text}&apikey=${lann}`
                )
              ).json();
              rell.sendMessage(
                m.chat,
                { text: json.result },
                { quoted: fkontak }
              );
            } catch (err) {
              console.log(err);
            }
          } else {
            reply(`Reply image with command ${prefix + command} pertanyaan`);
          }
        }
        break;
      //search feature
      case "pin":
      case "pinterest":
        {
          if (!text) return rellreply(`Example: ${prefix + command} michie`);

          const resssssss = await pinterest(`${text}`); // Fixed the fetch URL and added encodeURIComponent for text
          const { result } = resssssss;

          async function getImageMessage(url) {
            const { imageMessage } = await generateWAMessageContent(
              {
                image: {
                  url,
                },
              },
              {
                upload: rell.waUploadToServer,
              }
            );
            return imageMessage;
          }

          let cards = [];
          for (let i = 0; i < 5 && i < result.length; i++) {
            const url = result[i];
            const imageMsg = await getImageMessage(url);
            cards.push({
              header: {
                imageMessage: imageMsg,
                hasMediaAttachment: true,
              },
              body: { text: `Image ${i + 1}/5` },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: "cta_url",
                    buttonParamsJson:
                      '{"display_text":"Saweria ☘️","url":"https://saweria.co/rein122","webview_presentation":null}',
                  },
                ],
              },
            });
          }

          let msg = generateWAMessageFromContent(
            m.chat,
            {
              viewOnceMessage: {
                message: {
                  interactiveMessage: {
                    body: {
                      text: `Hai kak ${pushname}, berikut 5 foto dari Pinterest yang anda cari\n*Result By: ${text}`,
                    },
                    carouselMessage: {
                      cards,
                      messageVersion: 1,
                    },
                  },
                },
              },
            },
            {}
          );
          await rell.relayMessage(msg.key.remoteJid, msg.message, {
            messageId: msg.key.id,
          });
        }
        break;
      case "wikipedia":
      case "wiki":
        {
          if (!text)
            return reply(` Enter what you want to search for on Wikipedia`);

          try {
            const link = await axios.get(
              `https://en.wikipedia.org/wiki/${text}`
            );
            const $ = cheerio.load(link.data);
            let wik = $("#firstHeading").text().trim();
            let resulw = $("#mw-content-text > div.mw-parser-output")
              .find("p")
              .text()
              .trim();
            reply(`▢ *Wikipedia*

‣ Title : ${wik}

${resulw}`);
          } catch (e) {
            reply("⚠️ No results found ");
          }
        }
        break;
      case "lyrics":
      case "lirik":
        {
          if (!args[0])
            return reply(
              `Input Pencarian\n\nExample : ${prefix + command} Pesan Terakhir`
            );
          let api = `https://api.betabotz.eu.org/api/search/lirik?lirik=${args[0]}&apikey=${lann}`;
          let response = await axios(api);
          let txt = "";
          txt += `*[ LIRIK LAGU ]*\n\n`;
          txt += `> JUDUL : ${response.data.result.title}\n`;
          txt += `> ARTIST : ${response.data.result.artist}\n\n`;
          txt += `> LIRIK : ${response.data.result.lyrics}`;
          reply(txt);
        }
        break;
      case "yts":
      case "ytsearch":
      case "youtube":
        {
          if (!text) return reply("Mau Search Apa nih?");
          const data = await fetch(
            `https://api.betabotz.eu.org/api/search/yts?query=${text}&apikey=${lann}`
          );
          const res = await data.json();

          let sections = [
            {
              title: `Hasil Dari ${text}`,
              highlight_label: `maybe you like`,
              rows: [
                {
                  title: `${res.result[0].title}`,
                  description: `𝗜𝗗 : ${res.result[0].videoId} | 𝗗𝗨𝗥𝗔𝗦𝗜 : ${res.result[0].duration}`,
                  id: `.ytselect ${res.result[0].url}`,
                },
                {
                  title: `${res.result[1].title}`,
                  description: `𝗜𝗗 : ${res.result[1].videoId} | 𝗗𝗨𝗥𝗔𝗦𝗜 : ${res.result[1].duration}`,
                  id: `.ytselect ${res.result[1].url}`,
                },
                {
                  title: `${res.result[2].title}`,
                  description: `𝗜𝗗 : ${res.result[2].videoId} | 𝗗𝗨𝗥𝗔𝗦𝗜 : ${res.result[2].duration}`,
                  id: `.ytselect ${res.result[2].url}`,
                },
              ],
            },
          ];

          let listMessage = {
            title: `${res.result[0].title}`,
            sections,
          };

          let msgs = generateWAMessageFromContent(
            m.from,
            {
              viewOnceMessage: {
                message: {
                  messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2,
                  },
                  interactiveMessage: proto.Message.InteractiveMessage.create({
                    contextInfo: {
                      mentionedJid: [m.sender],
                      isForwarded: true,
                      forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363267533195844@newsletter",
                        newsletterName: "Powered By Rell",
                        serverMessageId: -1,
                      },
                      businessMessageForwardInfo: {
                        businessOwnerJid: rell.decodeJid(rell.user.id),
                      },
                      externalAdReply: {
                        title: "Rell-MD",
                        thumbnail: fs.readFileSync(
                          "./media/theme/cheemspic.jpg"
                        ),
                        sourceUrl: wagc,
                        mediaType: 2,
                        renderLargerThumbnail: false,
                      },
                    },
                    body: proto.Message.InteractiveMessage.Body.create({
                      text: `Powered By Rell-MD`,
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                      text: `Click the button below to play audio`,
                    }),
                    header: proto.Message.InteractiveMessage.Header.create({
                      ...(await prepareWAMessageMedia(
                        { image: { url: res.result[0].thumbnail } },
                        { upload: rell.waUploadToServer }
                      )),
                      title: `┌─❖\n│「 𝗛𝗶 ${pushname}👋 」\n└┬❖ 「  YTSEARCH BY RELL  」\n│✑ \n│✑  Search Results From\n│✑  *${res.result[0].title}*\n└───────────────┈ ⳹`,
                      subtitle: `${res.result[0].title}`,
                      hasMediaAttachment: false,
                    }),

                    nativeFlowMessage:
                      proto.Message.InteractiveMessage.NativeFlowMessage.create(
                        {
                          buttons: [
                            {
                              name: "single_select",
                              buttonParamsJson: JSON.stringify(listMessage),
                            },
                          ],
                        }
                      ),
                    contextInfo: {
                      mentionedJid: [m.sender],
                      forwardingScore: 999,
                      isForwarded: true,
                      forwardedNewsletterMessageInfo: {
                        newsletterJid: "0@newsletter",
                        newsletterName: ownername,
                        businessMessageForwardInfo: {
                          businessOwnerJid: rell.decodeJid(rell.user.id),
                        },
                        serverMessageId: 143,
                      },
                    },
                  }),
                },
              },
            },
            {}
          );
          rell.relayMessage(m.key.remoteJid, msgs.message, {
            messageId: m.key.id,
          });
        }
        break;
      case "ytselect":
        {
          if (!text) return reply("link?");
          const data = await fetch(
            `https://api.betabotz.eu.org/api/search/yts?query=${text}&apikey=${lann}`
          );
          const res = await data.json();

          let sections = [
            {
              title: `YTDL BY RELL`,
              highlight_label: `maybe you like`,
              rows: [
                {
                  title: `Audio`,
                  description: `Send Audio Files`,
                  id: `.ytmp3 ${text}`,
                },
                {
                  title: `Vidio`,
                  description: `send vidio files`,
                  id: `.ytmp4 ${text}`,
                },
              ],
            },
          ];

          let listMessage = {
            title: `OPTION`,
            sections,
          };

          let msgs = generateWAMessageFromContent(
            m.from,
            {
              viewOnceMessage: {
                message: {
                  messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2,
                  },
                  interactiveMessage: proto.Message.InteractiveMessage.create({
                    contextInfo: {
                      mentionedJid: [m.sender],
                      isForwarded: true,
                      forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363267533195844@newsletter",
                        newsletterName: "Powered By Rell",
                        serverMessageId: -1,
                      },
                      businessMessageForwardInfo: {
                        businessOwnerJid: rell.decodeJid(rell.user.id),
                      },
                      externalAdReply: {
                        title: "Rell-MD",
                        thumbnail: fs.readFileSync(
                          "./media/theme/cheemspic.jpg"
                        ),
                        sourceUrl: wagc,
                        mediaType: 2,
                        renderLargerThumbnail: false,
                      },
                    },
                    body: proto.Message.InteractiveMessage.Body.create({
                      text: `Powered By Rell-MD`,
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                      text: `Click the button`,
                    }),
                    header: proto.Message.InteractiveMessage.Header.create({
                      ...(await prepareWAMessageMedia(
                        { image: { url: res.result[0].thumbnail } },
                        { upload: rell.waUploadToServer }
                      )),
                      title: `┌─❖\n│「 𝗛𝗶 ${pushname}👋 」\n└┬❖ 「  YTDL BY RELL  」\n│✑\n└───────────────┈ ⳹`,
                      subtitle: `OPTIONS`,
                      hasMediaAttachment: false,
                    }),

                    nativeFlowMessage:
                      proto.Message.InteractiveMessage.NativeFlowMessage.create(
                        {
                          buttons: [
                            {
                              name: "single_select",
                              buttonParamsJson: JSON.stringify(listMessage),
                            },
                          ],
                        }
                      ),
                    contextInfo: {
                      mentionedJid: [m.sender],
                      forwardingScore: 999,
                      isForwarded: true,
                      forwardedNewsletterMessageInfo: {
                        newsletterJid: "0@newsletter",
                        newsletterName: ownername,
                        businessMessageForwardInfo: {
                          businessOwnerJid: rell.decodeJid(rell.user.id),
                        },
                        serverMessageId: 143,
                      },
                    },
                  }),
                },
              },
            },
            {}
          );
          rell.relayMessage(m.key.remoteJid, msgs.message, {
            messageId: m.key.id,
          });
        }
        break;
      case "song":
      case "ytvid":
      case "play":
      case "ytplay":
        {
          if (!text) return m.reply("*example*: .play Lathi");
          function formatViews(views) {
            if (views >= 1000000) {
              return (views / 1000000).toFixed(1) + "M";
            } else if (views >= 1000) {
              return (views / 1000).toFixed(1) + "K";
            } else {
              return views.toString();
            }
          }
          try {
            let results = await yts(text);
            let videoId = results.videos[0].videoId;
            let info = await ytdl.getInfo(videoId);
            let title = info.videoDetails.title.replace(/[^\w\s]/gi, "");
            let thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
            let url = info.videoDetails.video_url;
            let duration = parseInt(info.videoDetails.lengthSeconds);
            let uploadDate = new Date(
              info.videoDetails.publishDate
            ).toLocaleDateString();
            let views = info.videoDetails.viewCount;
            let minutes = Math.floor(duration / 60);
            let description = results.videos[0].description;
            let seconds = duration % 60;
            let durationText = `${minutes}:${seconds < 10 ? "0" : ""
              }${seconds}`;
            let audio = ytdl(videoId, { quality: "highestaudio" });
            let inputFilePath = "./trash/" + title + ".webm";
            let outputFilePath = "./trash/" + title + ".mp3";
            let viewsFormatted = formatViews(views);
            let infoText = `◦ *Title*: ${title}\n◦ *Duration*: ${durationText}\n◦ *Upload*: ${uploadDate}\n◦ *Views*: ${viewsFormatted}\n◦ *ID*: ${videoId}\n◦ *Description*: ${description}\n◦ *URL*: ${url}
`;
            const pesan = rell.relayMessage(
              m.chat,
              {
                extendedTextMessage: {
                  text: infoText,
                  contextInfo: {
                    externalAdReply: {
                      title: wm,
                      body: "",
                      mediaType: 1,
                      previewType: 0,
                      renderLargerThumbnail: false,
                      thumbnailUrl: thumbnailUrl,
                      sourceUrl: url,
                    },
                  },
                  mentions: [m.sender],
                },
              },
              {}
            );

            audio
              .pipe(fs.createWriteStream(inputFilePath))
              .on("finish", async () => {
                ffmpeg(inputFilePath)
                  .toFormat("mp3")
                  .on("end", async () => {
                    let buffer = fs.readFileSync(outputFilePath);
                    rell.sendMessage(
                      m.chat,
                      {
                        audio: buffer,
                        mimetype: "audio/mpeg",
                        contextInfo: {
                          externalAdReply: {
                            title: title,
                            body: "",
                            thumbnailUrl: thumbnailUrl,
                            sourceUrl: url,
                            mediaType: 1,
                            showAdAttribution: true,
                            renderLargerThumbnail: false,
                          },
                        },
                      },
                      {
                        quoted: m,
                      }
                    );
                    fs.unlinkSync(inputFilePath);
                    fs.unlinkSync(outputFilePath);
                  })
                  .on("error", (err) => {
                    console.log(err);
                    m.reply(
                      `There was an error converting the audio: ${err.message}`
                    );
                    fs.unlinkSync(inputFilePath);
                    fs.unlinkSync(outputFilePath);
                  })
                  .save(outputFilePath);
              });
          } catch (e) {
            console.log(e);
            m.reply(
              `An error occurred while searching for the song: ${e.message}`
            );
          }
        }
        break;
      case "ytmp3":
      case "ytaudio":
        {
          if (!text)
            return reply(`*Example:* ${prefix + command} https://www.youtube.com/watch?v=xxxx`);
          const { randomUUID } = require('crypto');
          try {
            await ytdl.getInfo(text);
            let a = "./trash/" + randomUUID() + ".mp3";
            let b = await ytdl(text, {
              filter: "audioonly"
            }).pipe(fs.createWriteStream(a)).on("finish", async () => {
              const stats = fs.statSync(a);
              const fileSizeInBytes = stats.size;
              const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
              if (fileSizeInMB < 50) {
                await rell.sendMessage(m.chat, {
                  audio: fs.readFileSync(a),
                  mimetype: "audio/mp4",
                  ptt: false
                }, { quoted: m, sendEphemeral: true })
              } else await rell.sendMessage(m.chat, { text: "File size exceeds 50MB limit." }, { quoted: m, sendEphemeral: true });
            })
            return b
          } catch (e) {
            m.reply("Error: " + e)
          }
        }
        break;
      case "ytmp4":
      case "ytvideo":
        {
          let v = text;
          if (!text) return reply("Linknya Mana.??");
          async function ytmp4(url) {
            return new Promise((resolve, reject) => {
              try {
                const id = ytdl.getVideoID(url);
                const yutub = ytdl
                  .getInfo(`https://www.youtube.com/watch?v=${id}`)
                  .then((data) => {
                    let pormat = data.formats;
                    let video = [];
                    for (let i = 0; i < pormat.length; i++) {
                      if (
                        pormat[i].container == "mp4" &&
                        pormat[i].hasVideo == true &&
                        pormat[i].hasAudio == true
                      ) {
                        let vid = pormat[i];
                        video.push(vid.url);
                      }
                    }
                    const title =
                      data.player_response.microformat.playerMicroformatRenderer
                        .title.simpleText;
                    const thumb =
                      data.player_response.microformat.playerMicroformatRenderer
                        .thumbnail.thumbnails[0].url;
                    const channel =
                      data.player_response.microformat.playerMicroformatRenderer
                        .ownerChannelName;
                    const views =
                      data.player_response.microformat.playerMicroformatRenderer
                        .viewCount;
                    const published =
                      data.player_response.microformat.playerMicroformatRenderer
                        .publishDate;
                    const duration = data.player_response.lengthSeconds;

                    const result = {
                      title: title,
                      duration: duration,
                      thumb: thumb,
                      channel: channel,
                      published: published,
                      views: views,
                      url: video[0],
                    };
                    return result;
                  });
                resolve(yutub);
              } catch (error) {
                reject(error);
              }
              console.log(error);
            });
          }
          ytmp4(v).then((result) => {
            const video = result.url;
            const title = result.title;
            const duration = result.duration;
            const cenel = result.channel;
            const publish = result.published;
            const view = result.views;

            rell.sendFile(
              m.chat,
              video,
              title + ".mp4",
              `
*Downloader YouTube Mp4*

*Title* : ${title}
*Channel* : ${cenel}
*publish* : ${publish}
*views* : ${view}
*Resolusi* : 360p
*Url* : ${text}`,
              m
            );
          });
        }
        break;
      //database feature
      case "afk":
        {
          let user = global.db.data.users[m.sender];
          user.afkTime = +new Date();
          user.afkReason = text;
          reply(`${m.pushName} *Has Gone AFK*${text ? ": " + text : ""}`);
        }
        break;
      case "listbadword":
        {
          let teks = "┌──⭓「 *VN List* 」\n│\n";
          for (let x of bad) {
            teks += `│⭔ ${x}\n`;
          }
          teks += `│\n└────────────⭓\n\n*Totally there are : ${bad.length}*`;
          reply(teks);
        }
        break;
      case "setcmd":
        {
          if (!m.quoted) return reply("Reply Message!");
          if (!m.quoted.fileSha256) return reply("SHA256 Hash Missing");
          if (!text) return reply(`For What Command?`);
          let hash = m.quoted.fileSha256.toString("base64");
          if (
            global.db.data.sticker[hash] &&
            global.db.data.sticker[hash].locked
          )
            return reply(
              "You have no permission to change this sticker command"
            );
          global.db.data.sticker[hash] = {
            text,
            mentionedJid: m.mentionedJid,
            creator: m.sender,
            at: +new Date(),
            locked: false,
          };
          reply(`Done!`);
        }
        break;
      case "delcmd":
        {
          let hash = m.quoted.fileSha256.toString("base64");
          if (!hash) return reply(`No hashes`);
          if (
            global.db.data.sticker[hash] &&
            global.db.data.sticker[hash].locked
          )
            return reply(
              "You have no permission to delete this sticker command"
            );
          delete global.db.data.sticker[hash];
          reply(`Done!`);
        }
        break;
      case "listcmd":
        {
          let teks = `
*List Hash*
Info: *bold* hash is Locked
${Object.entries(global.db.data.sticker)
              .map(
                ([key, value], index) =>
                  `${index + 1}. ${value.locked ? `*${key}*` : key} : ${value.text}`
              )
              .join("\n")}
`.trim();
          rell.sendText(m.chat, teks, m, {
            mentions: Object.values(global.db.data.sticker)
              .map((x) => x.mentionedJid)
              .reduce((a, b) => [...a, ...b], []),
          });
        }
        break;
      case "lockcmd":
        {
          if (!isOwner) return reply(mess.owner);
          if (!m.quoted) return reply("Reply Message!");
          if (!m.quoted.fileSha256) return reply("SHA256 Hash Missing");
          let hash = m.quoted.fileSha256.toString("base64");
          if (!(hash in global.db.data.sticker))
            return reply("Hash not found in database");
          global.db.data.sticker[hash].locked = !/^un/i.test(command);
          reply("Done!");
        }
        break;
      //random feature
      case "dare":
        {
          const darejson = JSON.parse(
            fs.readFileSync("./src/data/function/dare.json")
          );
          const dare = darejson[Math.floor(Math.random() * darejson.length)];
          reply(dare);
        }
        break;
      case "truth":
        {
          const truthjson = JSON.parse(
            fs.readFileSync("./src/data/function/truth.json")
          );
          const truth = truthjson[Math.floor(Math.random() * truthjson.length)];
          reply(truth);
        }
        break;
      case "modus":
        {
          const modusjson = JSON.parse(
            fs.readFileSync("./src/data/function/modus.json")
          );
          const modus = modusjson[Math.floor(Math.random() * modusjson.length)];
          reply(modus);
        }
        break;
      case "khodam":
      case "kodam":
      case "cekkodam":
      case "cekkhodam":
        {
          const nama = args[0] || pushname;
          const result = await Khodam(nama);
          if (m.key.fromMe) {
            let txt = `- Nama: ${nama}\n- Khodam: ${result.khodam}\n\n> ${result.caption}`;
            await m.reply(txt, {
              edit: m.key,
              mentions: [m.quoted ? m.quoted.sender : m.sender],
            });
          } else {
            await m.reply(
              `- Nama: ${nama}\n- Khodam: ${result.khodam}\n\n> ${result.caption}`
            );
          }
        }
        break;
      case "anime":
        {
          if (!text) return reply(`judul anime apa yang kamu cari?`);
          const anime = await malScraper
            .getInfoFromName(text)
            .catch(() => null);
          if (!anime) return reply(`Could not find`);
          let animetxt = `
🎀 *Title: ${anime.title}*
🎋 *Type: ${anime.type}*
🎐 *Premiered on: ${anime.premiered}*
💠 *Total Episodes: ${anime.episodes}*
📈 *Status: ${anime.status}*
💮 *Genres: ${anime.genres}
📍 *Studio: ${anime.studios}*
🌟 *Score: ${anime.score}*
💎 *Rating: ${anime.rating}*
🏅 *Rank: ${anime.ranked}*
💫 *Popularity: ${anime.popularity}*
♦️ *Trailer: ${anime.trailer}*
🌐 *URL: ${anime.url}*
❄ *Description:* ${anime.synopsis}*`;
          await rell.sendMessage(
            m.chat,
            { image: { url: anime.picture }, caption: animetxt },
            { quoted: fkontak }
          );
        }
        break;
      case "animequote":
      case "katanime":
        {
          try {
            const res = await fetch(
              `https://api.betabotz.eu.org/api/random/quotesanime?apikey=${lann}`
            );
            if (!res.ok) return await res.text();
            const json = await res.json();
            const message = `${themeemoji}Quote\n${json.result[0].quotes}\n\n${themeemoji}Character: \`\`\`${json.result[0].karakter}\`\`\`\n${themeemoji}Anime: \`\`\`${json.result[0].anime}\`\`\`\n`;
            rell.sendMessage(m.chat, { text: message }, "extendedTextMessage", {
              quoted: fkontak,
            });
          } catch (error) {
            console.error(error);
          }
        }
        break;
      case "gura":
      case "gurastick":
        {
          var responsee = await fetch(
            "https://raw.githubusercontent.com/DGXeon/XeonMedia/main/gura"
          );
          var ano = await responsee.text(); // Use text() to get the content as a string
          var wifegerak = ano.split("\n");
          var wifegerakx =
            wifegerak[Math.floor(Math.random() * wifegerak.length)];
          encmedia = await rell.sendImageAsSticker(from, wifegerakx, m, {
            packname: global.packname,
            author: global.author,
          });
        }
        break;
      case "loli":
        {
          let baseUrl = "https://weeb-api.vercel.app/";
          const response = await fetch(baseUrl + command);
          const imageBuffer = await response.buffer(); // Get the image data as a buffer
          rell.sendMessage(
            m.chat,
            { image: imageBuffer, caption: `Random ${command} for you!✨` },
            { quoted: fkontak }
          );
        }
        break;
      case "waifu":
        {
          let baseUrl = "https://weeb-api.vercel.app/";
          const response = await fetch(baseUrl + command);
          const imageBuffer = await response.buffer(); // Get the image data as a buffer
          rell.sendMessage(
            m.chat,
            { image: imageBuffer, caption: `Random ${command} for you!✨` },
            { quoted: fkontak }
          );
        }
        break;
      case "neko":
        {
          let baseUrl = "https://weeb-api.vercel.app/";
          const response = await fetch(baseUrl + command);
          const imageBuffer = await response.buffer(); // Get the image data as a buffer
          rell.sendMessage(
            m.chat,
            { image: imageBuffer, caption: `Random ${command} for you!✨` },
            { quoted: fkontak }
          );
        }
        break;
      case "shinobu":
        {
          axios.get(`https://api.waifu.pics/sfw/shinobu`).then(({ data }) => {
            rell.sendImageAsSticker(from, data.url, m, {
              packname: global.packname,
              author: global.author,
            });
          });
        }
        break;
      case "motivasi":
        {
          let motivasi = await fetch(
            `https://api.betabotz.eu.org/api/random/motivasi?apikey=${lann}`
          );
          const res = await motivasi.json();
          reply(res.result);
        }
        break;
      //downloader feature
      case "pixiv":
      case "pixivdl":
        {
          if (!text)
            return reply(
              `Example: ${prefix + command
              } https://www.pixiv.net/en/artworks/120199177`
            );

          const arts = args[0].split("https://www.pixiv.net/en/artworks/")[1];
          const res = await fetch(
            `https://api.lolhuman.xyz/api/pixivdl/${arts}?apikey=${APIs.lolkey}`
          );
          const data = await res.json();

          // Check if the result and images properties exist
          if (!data || !data.result || !Array.isArray(data.result.images)) {
            return reply(
              "Failed to retrieve images. Please check the link or try again later."
            );
          }

          const { result } = data;
          const { images } = result;

          async function getImageMessage(url) {
            const { imageMessage } = await generateWAMessageContent(
              {
                image: {
                  url,
                },
              },
              {
                upload: rell.waUploadToServer,
              }
            );
            return imageMessage;
          }

          let cards = [];
          for (let i = 0; i < images.length; i++) {
            const url = images[i];
            const imageMsg = await getImageMessage(url);
            cards.push({
              header: {
                imageMessage: imageMsg,
                hasMediaAttachment: true,
              },
              body: { text: `Image ${i + 1}` },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: "cta_url",
                    buttonParamsJson:
                      '{"display_text":"Saweria ☘️","url":"https://saweria.co/rein122","webview_presentation":null}',
                  },
                ],
              },
            });
          }

          let msg = generateWAMessageFromContent(
            m.chat,
            {
              viewOnceMessage: {
                message: {
                  interactiveMessage: {
                    body: {
                      text: `Hai kak ${pushname}, berikut foto dari pixiv`,
                    },
                    carouselMessage: {
                      cards,
                      messageVersion: 1,
                    },
                  },
                },
              },
            },
            {}
          );

          await rell.relayMessage(msg.key.remoteJid, msg.message, {
            messageId: msg.key.id,
          });
        }
        break;

      case "threads":
        {
          if (!args[0])
            return m.reply(
              `Input Parameter Url Dari ${command}\n\nExample : ${prefix + command
              } Url`
            );
          let api = await fetch(
            `https://api.betabotz.eu.org/api/download/threads?url=${args[0]}&apikey=${lann}`
          );
          let betaku = await api.json();
          for (let i of betaku.result.image_urls) {
            rell.sendMessage(
              m.chat,
              {
                image: {
                  url: i,
                },
                caption: "SUCCES",
              },
              {
                quoted: fkontak,
              }
            );
          }
          for (let i of betaku.result.video_urls) {
            rell.sendMessage(
              m.chat,
              {
                image: {
                  url: i,
                },
                caption: "SUCCES",
              },
              {
                quoted: fkontak,
              }
            );
          }
        }
        break;
      case "douyin":
        {
          if (!args[0])
            return m.reply(
              `Input Parameter Url Dari ${command}\n\nExample : ${prefix + command
              } Url`
            );
          let api = await fetch(
            `https://api.betabotz.eu.org/api/download/douyin?url=${args[0]}&apikey=${lann}`
          );
          let betaku = await api.json();
          for (let i of betaku.result.video) {
            rell.sendMessage(
              m.chat,
              {
                video: {
                  url: i,
                },
                caption: "SUCCES",
              },
              {
                quoted: fkontak,
              }
            );
          }
          rell.sendMessage(
            m.chat,
            {
              audio: {
                url: betaku.result.audio,
              },
              caption: null,
            },
            {
              quoted: fkontak,
            }
          );
        }
        break;
      case "douyinslide":
      case "douyinimg":
        {
          if (!args[0])
            return m.reply(
              `Input Parameter Url Dari ${command}\n\nExample : ${prefix + command
              } Url`
            );
          let api = await fetch(
            `https://api.betabotz.eu.org/api/download/douyin-slide?url=${args[0]}&apikey=${lann}`
          );
          let betaku = await api.json();
          for (let i of betaku.result.images) {
            rell.sendMessage(
              m.chat,
              {
                image: {
                  url: i,
                },
                caption: "SUCCES",
              },
              {
                quoted: fkontak,
              }
            );
          }
        }
        break;
      case "git":
      case "gitclone":
        if (!args[0])
          return reply(
            `Where is the link?\nExample :\n${prefix}${command} https://github.com/FarelHanafi/Rell-MD.git`
          );
        if (!isUrl(args[0]) && !args[0].includes("github.com"))
          return reply(`Link invalid!!`);
        let regex1 = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;
        let [, user, repo] = args[0].match(regex1) || [];
        repo = repo.replace(/.git$/, "");
        let url = `https://api.github.com/repos/${user}/${repo}/zipball`;
        await reply(mess.loading);
        let filename = (await fetch(url, { method: "HEAD" })).headers
          .get("content-disposition")
          .match(/attachment; filename=(.*)/)[1];
        rell
          .sendMessage(
            m.chat,
            {
              document: { url: url },
              fileName: filename + ".zip",
              mimetype: "application/zip",
            },
            { quoted: fkontak }
          )
          .catch((err) => reply(mess.error));
        break;
      case "tt":
      case "ttdl":
      case "tiktokmp4":
      case "tiktokvideo":
      case "tiktok":
        {
          if (!args[0]) {
            return reply(`Masukkan URL!\n\nContoh:\n${prefix}${command} https://vt.tiktok.com/xxx/`);
          }
          try {
            if (!args[0].match(/tiktok/gi)) {
              return reply(`Berikan URL dari TikTok!`);
            }
            const response = await tiktokdl(args[0]);
            const { video } = response;
            await rell.sendFile(m.chat, video, 'tiktok.mp4', '*TikTok Downloader*');
          } catch (e) {
            throw `Error: ${eror}`;
          }
        }
        break;
      case "tiktokmp3":
      case "tiktokaudio":
        {
          if (!args[0]) {
            return reply(`Masukkan URL!\n\nContoh:\n${prefix}${command} https://vt.tiktok.com/xxx/`);
          }
          try {
            if (!args[0].match(/tiktok/gi)) {
              return reply(`Berikan URL dari TikTok!`);
            }
            const response = await tiktokdl(args[0]);
            const { music } = response;
            await rell.sendMessage(
              m.chat,
              { audio: { url: music }, mimetype: "audio/mp4", ptt: true },
              { quoted: fkontak }
            );
          } catch (e) {
            throw `Error: ${eror}`;
          }
        }
        break;
      case "ttslide":
      case "tiktokslide":
        {
          if (!text)
            return reply(
              `Example: ${prefix + command} https://vt.tiktok.com/ZSY8XX78X/`
            );

          const res = await fetch(
            `https://anabot.my.id/api/download/tiktokSlide?url=${encodeURIComponent(
              text
            )}&apikey=DitzOfc`
          );
          const data = await res.json();
          const { result } = data;
          const { image } = result;

          async function getImageMessage(url) {
            const { imageMessage } = await generateWAMessageContent(
              {
                image: {
                  url,
                },
              },
              {
                upload: rell.waUploadToServer,
              }
            );
            return imageMessage;
          }

          let cards = [];
          for (let i = 0; i < image.length; i++) {
            const url = image[i];
            const imageMsg = await getImageMessage(url);
            cards.push({
              header: {
                imageMessage: imageMsg,
                hasMediaAttachment: true,
              },
              body: { text: ` Image ${i + 1}` },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: "cta_url",
                    buttonParamsJson:
                      '{"display_text":"Saweria ☘️","url":"https://saweria.co/rein122","webview_presentation":null}',
                  },
                ],
              },
            });
          }

          let msg = generateWAMessageFromContent(
            m.chat,
            {
              viewOnceMessage: {
                message: {
                  interactiveMessage: {
                    body: {
                      text: `Hai kak ${pushname}, berikut 5 foto dari tiktok`,
                    },
                    carouselMessage: {
                      cards,
                      messageVersion: 1,
                    },
                  },
                },
              },
            },
            {}
          );

          await rell.relayMessage(msg.key.remoteJid, msg.message, {
            messageId: msg.key.id,
          });
        }
        break;
      case "fb":
      case "facebook":
      case "facebookvid":
        {
          if (!args[0]) {
            return reply(
              `Please send the link of a Facebook video\n\nEXAMPLE :\n*${prefix + command
              }* https://fb.watch/pLLTM4AFrO/?mibextid=Nif5oz`
            );
          }
          const urlRegex =
            /^(?:https?:\/\/)?(?:www\.)?(?:facebook\.com|fb\.watch)\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
          if (!urlRegex.test(args[0])) {
            return reply("Url invalid");
          }
          try {
            const result = await fg.fbdl(args[0]);
            const tex = `
    [ FACEBOOK DL ]
${themeemoji} Title: ${result.title}`;
            const response = await fetch(result.videoUrl);
            const arrayBuffer = await response.arrayBuffer();
            const videoBuffer = Buffer.from(arrayBuffer);
            rell.sendMessage(
              m.chat,
              { video: videoBuffer, caption: tex },
              { quoted: fkontak }
            );
          } catch (error) {
            reply("Maybe private video!");
          }
        }
        break;
      case "mediafire":
        {
          if (!args[0])
            return reply(`Enter the mediafire link next to the command`);
          if (!args[0].match(/mediafire/gi)) return reply(`Link incorrect`);
          let full = /f$/i.test(command);
          let u = /https?:\/\//.test(args[0]) ? args[0] : "https://" + args[0];
          let res = await mediafiredl(args[0]);
          let { url, url2, filename, ext, aploud, filesize, filesizeH } = res;
          let caption = `
≡ *MEDIAFIRE*

▢ *Number:* ${filename}
▢ *Size:* ${filesizeH}
▢ *Extension:* ${ext}
▢ *Uploaded:* ${aploud}
`.trim();
          rell.sendMessage(
            m.chat,
            { document: { url: url }, fileName: filename, mimetype: ext },
            { quoted: fkontak }
          );
        }
        break;
      case "igdl":
      case "ig":
      case "igvideo":
      case "igreels":
      case "igstory":
      case "instagram":
      case "igvideo":
        {
          if (!args || !args[0]) {
            return reply(
              `Input Parameter Url Dari ${command}\n\nExample : ${prefix + command
              } Url`
            );
          }

          const url = args[0];
          let re = await fetch(`https://api.betabotz.eu.org/api/download/igdowloader?url=${url}&apikey=${lann}`)
          let message = await re.json()
          try {
            for (let i of message.message) {
              rell.sendFile(m.chat, i._url, null, `*Instagram Downloader*`, m)
            }
          } catch (err) {
            m.reply(`${eror}`)
          }
        }
        break;
      case "twitter":
      case "twitterdl":
      case "twitterdl":
        {
          if (!args[0])
            return reply(
              `📌 Example : \n*${prefix + command
              }* https://twitter.com/xxxxxx/status/xxxxxx`
            );
          if (!isUrl(args[0]) && !args[0].includes("twitter.com"))
            return reply("Link Invalid!");
          try {
            await reply(mess.loading);
            let { SD, HD, desc, thumb, audio } = await fg.twitter(args[0]);
            let te = ` 
┌─⊷ *TWITTER DL*
▢ Description: ${desc}
└───────────`;
            rell.sendMessage(
              m.chat,
              { video: { url: HD }, caption: te },
              { quoted: fkontak }
            );
          } catch (e) {
            reply(`Verify that the link is from Twitter`);
          }
        }
        break;
      case "mega":
        {
          try {
            if (!text)
              return reply(
                `${prefix + command
                } https://mega.nz/file/ovJTHaQZxxxxxxxxxxxxxxxxxxx`
              );
            const file = File.fromURL(text);
            await file.loadAttributes();
            if (file.size >= 300000000)
              return reply(
                "Error: File size is too large (Maximum Size: 300MB)"
              );
            await reply(mess.loading);
            const caption = `*_Successfully downloaded..._*\nFile: ${file.name
              }\nSize: ${formatBytes(file.size)}`;
            const data = await file.downloadBuffer();
            const fileExtension = path.extname(file.name).toLowerCase();
            const mimeTypes = {
              ".mp4": "video/mp4",
              ".pdf": "application/pdf",
              ".zip": "application/zip",
              ".rar": "application/x-rar-compressed",
              ".7z": "application/x-7z-compressed",
              ".jpg": "image/jpeg",
              ".jpeg": "image/jpeg",
              ".png": "image/png",
            };
            let mimetype =
              mimeTypes[fileExtension] || "application/octet-stream";
            await rell.sendMessage(
              m.chat,
              {
                document: data,
                mimetype: mimetype,
                fileName: file.name,
                caption: caption,
              },
              { quoted: fkontak }
            );
          } catch (error) {
            return reply(`Error: ${error.message}`);
          }
        }
        break;
      case "instagram2":
      case "ig2":
        {
          if (!text) return reply(`Enter the link!!!`);
          if (!isUrl(args[0])) return reply(`Where is the link?`);
          await rell.sendMessage(m.chat, {
            react: { text: "⏱️", key: m.key },
          });
          try {
            await reply(mess.loading);
            let anu = await fetchJson(
              `https://aemt.me/download/igdl?url=${text}`
            );
            rell.sendMessage(
              m.chat,
              { video: { url: anu.result[0].url }, caption: `Here you go!` },
              { quoted: fkontak }
            );
            await rell.sendMessage(m.chat, {
              react: { text: "☑️", key: m.key },
            });
          } catch (error) {
            await rell.sendMessage(m.chat, {
              react: { text: "✖️", key: m.key },
            });
          }
        }
        break;
      //tools feature
      case "ss":
      case "ssweb":
        {
          if (!q) return reply(`Example ${prefix + command} link`);
          let krt = await scp2.ssweb(q);
          rell.sendMessage(
            from,
            { image: krt.result, caption: mess.succes },
            { quoted: fkontak }
          );
        }
        break;
      case "get":
        {
          if (!/^https?:\/\//.test(text))
            return m.reply("Awali *URL* dengan http:// atau https://");

          function formatSize(bytes) {
            if (bytes === 0) return "0 Bytes";
            const k = 1024;
            const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return (
              parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
            );
          }

          function sizeLimit(size, limit) {
            const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
            const limitSize = parseFloat(limit);
            const limitUnit = limit.replace(/[\d.]/g, "");
            const limitIndex = sizes.findIndex((unit) => unit === limitUnit);
            const currentSize = parseFloat(size);
            const currentUnit = size.replace(/[\d.]/g, "");
            const currentIndex = sizes.findIndex(
              (unit) => unit === currentUnit
            );

            if (currentIndex > limitIndex) {
              return {
                oversize: true,
                currentSize: currentSize,
                currentUnit: currentUnit,
                limitSize: limitSize,
                limitUnit: limitUnit,
              };
            } else {
              return {
                oversize: false,
                currentSize: currentSize,
                currentUnit: currentUnit,
                limitSize: limitSize,
                limitUnit: limitUnit,
              };
            }
          }

          function jsonFormat(json) {
            return JSON.stringify(json, null, 2);
          }

          try {
            const fetch = await axios.get(args[0], {
              headers: {
                "Access-Control-Allow-Origin": "*",
                Referer: args[0],
                "Referrer-Policy": "strict-origin-when-cross-origin",
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
              },
            });
            const size = fetch.headers["content-length"]
              ? formatSize(fetch.headers["content-length"])
              : "1 KB";
            const chSize = sizeLimit(size, "200");
            if (chSize.oversize)
              return m.reply(
                m.chat,
                ` 🚩 File size (${size}) exceeds the maximum limit, we can't download the file.`,
                m
              );
            if (/json/i.test(fetch.headers["content-type"]))
              return m.reply(jsonFormat(fetch.data));
            if (/text/i.test(fetch.headers["content-type"]))
              return m.reply(fetch.data);
            rell.sendFile(m.chat, args[0], "", "", m);
          } catch (e) {
            console.log(e);
            return m.reply(m.chat, e.message, m);
          }
        }
        break;
      case "translate":
        {
          if (!q)
            return reply(
              `*Where is the text*\n\n*𝙴xample usage*\n*${prefix + command
              } <language id> <text>*\n*${prefix + command} ja yo wassup*`
            );
          const defaultLang = "en";
          const tld = "cn";
          let err = `
*Example:*

*${prefix + command}* <id> [text]
*${prefix + command}* en Hello World

≡ *List of supported languages:* 
https://cloud.google.com/translate/docs/languages
`.trim();
          let lang = args[0];
          let text = args.slice(1).join(" ");
          if ((args[0] || "").length !== 2) {
            lang = defaultLang;
            text = args.join(" ");
          }
          if (!text && m.quoted && m.quoted.text) text = m.quoted.text;
          try {
            let result = await translate(text, {
              to: lang,
              autoCorrect: true,
            }).catch((_) => null);
            reply(result.text);
          } catch (e) {
            return reply(err);
          }
        }
        break;
      case "clearall":
        {
          if (!isOwner) return reply(mess.owner);
          rell.chatModify(
            {
              delete: true,
              lastMessages: [
                { key: m.key, messageTimestamp: m.messageTimestamp },
              ],
            },
            m.chat
          );
        }
        break;
      case "readmore":
        {
          let [l, r] = text.split`|`;
          if (!l) l = "";
          if (!r) r = "";
          rell.sendMessage(
            m.chat,
            { text: l + readmore + r },
            { quoted: fkontak }
          );
        }
        break;
      case "ping":
      case "speed":
        {
          let timestamp = performance.now();
          let latensi = performance.now() - timestamp;
          let respon = `\n*Library*: Baileys\n*Platform*: Linux\n*Language*: Javascript\n> Speed _${latensi.toFixed(
            2
          )}_ ms\n> RAM: ${formatp(os.totalmem() - os.freemem())}/${formatp(
            os.totalmem()
          )}`;
          m.reply(respon);
        }
        break;
      case "buypremium":
      case "premium":
      case "premiumuser":
        {
          let teks = `Hi ${pushname}👋\nWant to Buy Premium?Just chat with the .owner or make .ticket😉`;
          m.reply(teks);
        }
        break;
      case "author":
      case "owner":
      case "creator":
      case "developer":
        {
          let pp = await rell
            .profilePictureUrl(`${ownernumber}@s.whatsapp.net`, "image")
            .catch((_) => "https://telegra.ph/file/1ecdb5a0aee62ef17d7fc.jpg");
          let list = [];
          let kon = JSON.parse(fs.readFileSync("./src/data/role/owner.json"));
          for (let i of kon) {
            list.push({
              displayName: await rell.getName(i + "@s.whatsapp.net"),
              vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await rell.getName(
                i + "@s.whatsapp.net"
              )}\nFN:${await rell.getName(
                i + "@s.whatsapp.net"
              )}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nitem2.EMAIL;type=INTERNET:farelcuy122@gmail.com\nitem2.X-ABLabel:Email\nitem3.URL:Rein998\nitem3.X-ABLabel:YouTube\nitem4.ADR:;;IDN;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`,
            });
          }
          rell.sendMessage(
            from,
            {
              contacts: {
                displayName: `${list.length} Contact`,
                contacts: list,
              },
              contextInfo: {
                externalAdReply: {
                  showAdAttribution: true,
                  title: botname,
                  body: ownername,
                  thumbnail: fs.readFileSync("./media/theme/cheemspic.jpg"),
                  sourceUrl: wagc,
                  mediaType: 1,
                  renderLargerThumbnail: false,
                },
              },
            },
            {
              quoted: fkontak,
            }
          );
        }
        break;
      case "backup":
        {
          if (!isOwner) return m.reply(mess.Owner);
          if (m.isGroup)
            return m.reply("Tidak Dapat Backup File Didalam Group!");
          //let exec = promisify(_exec).bind(cp);
          try {
            let zipFileName = `Backup.zip`;
            m.reply("Sedang memulai proses backup. Harap tunggu...");
            setTimeout(() => {
              if (fs.existsSync("node_modules")) {
                m.reply("Module 'node_modules' tidak akan terbackup.");
              }
              const file = fs.readFileSync(zipFileName);
              rell.sendMessage(
                m.chat,
                {
                  document: file,
                  mimetype: "application/zip",
                  fileName: zipFileName,
                  caption: "Backup selesai. Silakan unduh file backup.",
                },
                { quoted: fkontak }
              );
              setTimeout(() => {
                fs.unlinkSync(zipFileName);
                m.reply("File backup telah dihapus.");
              }, 10000);
            }, 3000);
            setTimeout(() => {
              let zipCommand = `zip -r ${zipFileName} * -x "node_modules/*"`;
              exec(zipCommand, (err, stdout) => { });
            }, 1000);
          } catch (error) {
            m.reply("Terjadi kesalahan saat melakukan backup.");
            console.error(error);
          }
        }
        break;
      case "delete":
      case "del":
      case "d":
        {
          let key = {};
          try {
            key.remoteJid = m.quoted
              ? m.quoted.fakeObj.key.remoteJid
              : m.key.remoteJid;
            key.fromMe = m.quoted ? m.quoted.fakeObj.key.fromMe : m.key.fromMe;
            key.id = m.quoted ? m.quoted.fakeObj.key.id : m.key.id;
            key.participant = m.quoted
              ? m.quoted.fakeObj.participant
              : m.key.participant;
          } catch (e) {
            console.error(e);
          }
          rell.sendMessage(m.chat, { delete: key });
        }
        break;
      //openai feature
      case "blackbox":
      case "codegpt":
        {
          if (!text)
            return reply(
              `Masukkan pertanyaan!\n\n*Contoh:* buatkan saya code express.js`
            );
          var apii = await fetch(
            `https://api.betabotz.eu.org/api/search/blackbox-chat?text=${text}&apikey=${lann}`
          );
          var ssssssssssssssssss = await apii.json();
          await m.reply(ssssssssssssssssss.message);
        }
        break;
      case "cai":
        {
          if (!text)
            return reply(
              `Input Text Dan Karakter!\nExample: ${prefix + command
              } hai Kirito|Kirito`
            );
          let [prompt, logic] = text.split("|");
          reply(`Tunggu sebentar...`);
          let res = await fetch(
            `https://api.betabotz.eu.org/api/search/c-ai?prompt=${prompt}?&char=${logic}&apikey=${lann}`
          );
          let json = await res.json();
          reply(json.message);
        }
        break;
      case "simisimi":
      case "simi":
        let urll = `https://api.betabotz.eu.org/api/search/simisimi?query=${text}&apikey=${lann}`;
        let responseeee = await axios(urll);
        m.reply(responseeee.data.result);
        break;
      case "ai":
      case "openai":
      case "gpt":
        {
          if (!text)
            return reply(`*• Example:* ${prefix + command} what is your name`);
          var apii = await fetch(
            `https://api.betabotz.eu.org/api/search/openai-chat?text=${text}&apikey=${lann}`
          );
          var res = await apii.json();
          await m.reply(res.message);
        }
        break;
      case "silvia":
      case "silvi":
      case "autoai":
        {
          if (!text) {
            let sections = [];
            let list = {
              title: `Silvia Asistant🌸`,
              rows: [],
            };
            list.rows.push(
              {
                title: `Enable✅`,
                description: `Turn On Asistant`,
                id: `.autoai on`,
              },
              {
                title: `Disable❌`,
                description: `Turn Off Asistant`,
                id: `.autoai off`,
              }
            );
            sections.push(list);

            let listMsg = {
              title: "Silvia Asistant🌸",
              sections,
            };
            rell.sendList(
              from,
              `Hi ${pushname}`,
              "Silvia Asistant Settings",
              listMsg
            );
          } else if (["on", "enable", "1"].includes(args[0])) {
            if (db.data.chats[from].autoai == true)
              return m.reply(`Udh On Daritadi`);
            m.reply("Asisten Silvia Sekarang Aktif😇");
            db.data.chats[from].autoai = true;
          } else if (["off", "disable", "0"].includes(args[0])) {
            if (db.data.chats[from].autoai == false)
              return m.reply(`Udh Off Daritadi`);
            m.reply("Bye👋, Kalo Butuh Teman panggil Silvia lagi ya");
            db.data.chats[from].autoai = false;
          }
        }
        break;
      //bot core
      case "fixbug":
        {
          if (!isOwner) return m.reply(mess.Owner);
          const message = `*Update Fix Bug*\n\n> ${text}\n\nnemu bug? .ticket`;
          const groupId = "120363309383726491@g.us";
          if (groupId && message) {
            reply(`Message sent to group RellUpdates`);
            rell.sendMessage(groupId, {
              text: message,
              contextInfo: {
                externalAdReply: {
                  showAdAttribution: true,
                  title: botname,
                  body: ownername,
                  thumbnail: fs.readFileSync("./media/theme/cheemspic.jpg"),
                  sourceUrl: wagc,
                  mediaType: 1,
                  renderLargerThumbnail: false,
                },
              },
            });
          }
        }
        break;
      case "gcbot":
      case "groupbot":
      case "linkgcbot":
        {
          let teks = `Link Gc Bot\n-> ${wagc}\nJangan Lupa Join`;
          reply(teks);
        }
        break;
      case "ticket": {
        if (!text)
          return reply(
            `Example : ${prefix + command} hi dev play command is not working`
          );
        textt = `*| REQUEST/BUG |*`;
        teks1 = `\n\n*User* : @${m.sender.split("@")[0]
          }\n*Request/Bug* : ${text}`;
        teks2 = `\n\n*Hii ${pushname},You request has been forwarded to my Owners*.\n*Please wait...*`;
        for (let i of owner) {
          rell.sendMessage(
            i + "@s.whatsapp.net",
            {
              text: textt + teks1,
              mentions: [m.sender],
            },
            {
              quoted: fkontak,
            }
          );
        }
        rell.sendMessage(
          m.chat,
          {
            text: textt + teks2 + teks1,
            mentions: [m.sender],
          },
          {
            quoted: fkontak,
          }
        );
      }
      case "checkaccount":
      case "akun":
      case "account":
      case "limit":
      case "checklimit":
        {
          let a = db.data.users[sender];
          let limit = `${a.limit}`;
          let b = `Below is your account information\n`;
          b += `================================\n`;
          b += `Serial Code: ${a.serialNumber}\n`;
          b += `Nickname: ${a.nick}\n`;
          b += `Status: ${m.sender.split`@`[0] == ownernumber
              ? "Developer👑"
              : a.premium == 1
                ? "Premium User🎉"
                : "Free User😇"
            }\n`;
          b += `Premium : ${a.premium == true ? "✅" : "❌"}\n`;
          b += `================================`;
          rell.sendMessage(m.chat, { text: b }, { quoted: fkontak });
        }
        break;
      case "allmenu":
      case "main":
      case "menu":
      case "help":
        {
          let ownernya = ownernumber + "@s.whatsapp.net";
          let timestampe = speed();
          let latensie = speed() - timestampe;
          let a = db.data.users[sender];
          let limit = `${a.limit}`;
          let me = m.sender;
          let xmenu_oh2 = `
> Time : ${moment.tz("Asia/Jakarta").format("LT")} *WIB*
> Date : ${moment.tz("Asia/Jakarta").format("LL")}
> Status: ${m.sender.split`@`[0] == ownernumber
              ? "Developer👑"
              : a.premium == 1
                ? "Premium User🎉"
                : "Free User😇"
            }
> Your Limit: ${m.sender.split`@`[0] == ownernumber ? "Infinity🥶" : limit}`;
          let msg = generateWAMessageFromContent(
            from,
            {
              viewOnceMessage: {
                message: {
                  messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2,
                  },
                  interactiveMessage: proto.Message.InteractiveMessage.create({
                    contextInfo: {
                      mentionedJid: [m.sender],
                      isForwarded: true,
                      forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363267533195844@newsletter",
                        newsletterName: "Powered By Rell",
                        serverMessageId: -1,
                      },
                      businessMessageForwardInfo: {
                        businessOwnerJid: rell.decodeJid(rell.user.id),
                      },
                      externalAdReply: {
                        title: "Rell-MD",
                        thumbnail: fs.readFileSync(
                          "./media/theme/cheemspic.jpg"
                        ),
                        sourceUrl: wagc,
                        mediaType: 2,
                        renderLargerThumbnail: false,
                      },
                    },
                    body: proto.Message.InteractiveMessage.Body.create({
                      text: xmenu_oh2,
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                      text: `If you find a bug, use .ticket`,
                    }),
                    header: proto.Message.InteractiveMessage.Header.create({
                      ...(await prepareWAMessageMedia(
                        {
                          document: fs.readFileSync(
                            "./media/theme/cheemspic.jpg"
                          ),
                          fileName: `Rell-MD 2k24 by Rell`,
                          mimetype: "application/pdf",
                        },
                        { upload: rell.waUploadToServer }
                      )),
                      title: `${rellwaktu} *${pushname}*🍁`,
                      gifPlayback: true,
                      subtitle: ownername,
                      hasMediaAttachment: false,
                    }),
                    nativeFlowMessage:
                      proto.Message.InteractiveMessage.NativeFlowMessage.create(
                        {
                          buttons: [
                            {
                              name: "single_select",
                              buttonParamsJson: `{
                        "title": "MENU 🌺",
                        "sections": [
                          {
                            "title": "AI MENU💹",
                            "highlight_label": "Everyone's Favourite",
                            "rows": [
                              {
                                "header": "AI MENU😊",
                                "title": "click to display",
                                "description": "Displays The List Of AI Features",
                                "id": "${prefix}aimenu"
                              }
                            ]
                          },{
                            "title": "GAMES MENU🎮",
                            "highlight_label": "Playing games?🕹",
                            "rows": [
                              {
                                "header": "GAME MENU",
                                "title": "click to display",
                                "description": "Displays The List Of Game Features",
                                "id": "${prefix}gamemenu"
                              }
                            ]
                          },{
                            "title": "FUN MENU🎉",
                            "highlight_label": "Or Fun?🎈",
                            "rows": [
                              {
                                "header": "FUN MENU",
                                "title": "click to display",
                                "description": "Displays The List Of Fun Features",
                                "id": "${prefix}funmenu"
                              }
                            ]
                          },{
                            "title": "GROUP MENU🎩",
                            "highlight_label": "FOR MANAGEMENT🗿",
                            "rows": [
                              {
                                "header": "GROUP MENU",
                                "title": "click to display",
                                "description": "Displays The List Of Group Features",
                                "id": "${prefix}groupmenu"
                              }
                            ]
                          },{
                            "title": "CONVERT & MAKER MENU🎊",
                            "highlight_label": "CONVERTT🎈",
                            "rows": [
                              {
                                "header": "CONVERT MENU",
                                "title": "click to display",
                                "description": "Displays The List Of Convert Features",
                                "id": "${prefix}convertmenu"
                              },
                              {
                                "header": "STICKER MENU",
                                "title": "click to display",
                                "description": "Displays The List Of Sticker Features",
                                "id": "${prefix}stickermenu"
                              },
                              {
                                "header": "PHOTOXY MENU",
                                "title": "click to display",
                                "description": "Displays The List Of Photooxy Features",
                                "id": "${prefix}photooxymenu"
                              }
                            ]
                          },{
                            "title": "ANIME MENU🈳",
                            "highlight_label": "WIBBUUUU🤣",
                            "rows": [
                              {
                                "header": "ANIME MENU",
                                "title": "click to display",
                                "description": "Displays The List Of Anime Features",
                                "id": "${prefix}animemenu"
                              }
                            ]
                          },{
                            "title": "STALKER MENU✡",
                            "highlight_label": "STALK?😦",
                            "rows": [
                              {
                                "header": "STALKER MENU",
                                "title": "click to display",
                                "description": "Displays The List Of Stalk Features",
                                "id": "${prefix}stalkermenu"
                              }
                            ]
                          },{
                            "title": "RELIGION MENU",
                            "highlight_label": "RELIGION😇",
                            "rows": [
                              {
                                "header": "RELIGION MENU",
                                "title": "click to display",
                                "description": "Displays The List Of Religion Features",
                                "id": "${prefix}religionmenu"
                              }
                            ]
                          },{
                            "title": "OTHER MENU🟢",
                            "highlight_label": "Other",
                            "rows": [
                              {
                                "header": "OTHER MENU",
                                "title": "click to display",
                                "description": "Displays The List Of Other Features",
                                "id": "${prefix}othermenu"
                              }
                            ]
                          },{
                            "title": "OWNER MENU👑",
                            "highlight_label": "Owner Only👑",
                            "rows": [
                              {
                                "header": "OWNER MENU",
                                "title": "click to display",
                                "description": "Displays The List Of Owner Features",
                                "id": "${prefix}ownermenu"
                              },
                              {
                                "header": "DATABASE MENU",
                                "title": "click to display",
                                "description": "Displays The List Of Database Features",
                                "id": "${prefix}databasemenu"
                              }
                            ]
                          },{
                            "title": "RANDOM MENU✔",
                            "highlight_label": "Random😁",
                            "rows": [
                              {
                                "header": "RANDOM PHOTO MENU",
                                "title": "click to display",
                                "description": "Displays The List Of Random Photo Features",
                                "id": "${prefix}randomphotomenu"
                              },
                              {
                                "header": "RANDOM VIDEO MENU",
                                "title": "click to display",
                                "description": "Displays The List Of Random Video Features",
                                "id": "${prefix}randomvideomenu"
                              }
                            ]
                          },{
                            "title": "Search Menu🔍",
                            "highlight_label": "Everyone's Choice",
                            "rows": [
                                {
                                "header": "SEARCH MENU",
                                "title": "click to display",
                                "description": "Displays The List Of Search Features",
                                "id": "${prefix}searchmenu"
                                }
                            ]
                          },{
                            "title": "DOWNLOAD MENU⬇",
                            "highlight_label": "DOWNLOAD📩",
                            "rows": [
                                {
                                "header": "DOWNLOAD MENU",
                                "title": "click to display",
                                "description": "Displays The List Of Download Features",
                                "id": "${prefix}downloadmenu"
                              }
                            ]
                          },{
                            "title": "NFSW MENU🔞",
                            "highlight_label": "18+ Choice🔞",
                            "rows": [
                              {
                                "header": "NSFW MENU",
                                "title": "click to display",
                                "description": "Displays The List Of NSFW Features",
                                "id": "${prefix}nsfwmenu"
                              }
                            ]
                          }
                        ]
                      }`,
                            },
                            {
                              name: "cta_url",
                              buttonParamsJson:
                                '{"display_text":"Saweria ☘️","url":"https://saweria.co/rein122","merchant_url":"https://www.google.com"}',
                            },
                          ],
                        }
                      ),
                    contextInfo: {
                      mentionedJid: [m.sender],
                      forwardingScore: 999,
                      isForwarded: true,
                      forwardedNewsletterMessageInfo: {
                        newsletterJid: "",
                        newsletterName: ownername,
                        serverMessageId: 143,
                      },
                    },
                  }),
                },
              },
            },
            {}
          );

          await rell.relayMessage(msg.key.remoteJid, msg.message, {
            messageId: msg.key.id,
          });
        }
        break;
      case "ownermenu":
        {
          if (!isOwner) return m.reply(mess.Owner);
          let xmenu_oh = `${rellwaktu} *${pushname}*🍁.${readmore}\n${ownermenu(
            prefix,
            hituet
          )}`;
          m.reply(xmenu_oh);
        }
        break;
      case "othermenu":
        {
          let xmenu_oh = `${rellwaktu} *${pushname}*🍁.${readmore}\n${othermenu(
            prefix,
            hituet
          )}`;
          m.reply(xmenu_oh);
        }
        break;
      case "downloadmenu":
        {
          let xmenu_oh = `${rellwaktu} *${pushname}*🍁.${readmore}\n${downloadmenu(
            prefix,
            hituet
          )}`;
          m.reply(xmenu_oh);
        }
        break;
      case "groupmenu":
        {
          let xmenu_oh = `${rellwaktu} *${pushname}*🍁.${readmore}\n${groupmenu(
            prefix,
            hituet
          )}`;
          m.reply(xmenu_oh);
        }
        break;
      case "gamemenu":
        {
          let xmenu_oh = `${rellwaktu} *${pushname}*🍁.${readmore}\n${gamemenu(
            prefix,
            hituet
          )}`;
          m.reply(xmenu_oh);
        }
        break;
      case "funmenu":
        {
          let xmenu_oh = `${rellwaktu} *${pushname}*🍁.${readmore}\n${funmenu(
            prefix,
            hituet
          )}`;
          m.reply(xmenu_oh);
        }
        break;
      case "stalkermenu":
        {
          let xmenu_oh = `${rellwaktu} *${pushname}*🍁.${readmore}\n${stalkermenu(
            prefix,
            hituet
          )}`;
          m.reply(xmenu_oh);
        }
        break;
      case "randomphotomenu":
        {
          let xmenu_oh = `${rellwaktu} *${pushname}*🍁.${readmore}\n${randphotomenu(
            prefix,
            hituet
          )}`;
          m.reply(xmenu_oh);
        }
        break;
      case "randomvideomenu":
        {
          let xmenu_oh = `${rellwaktu} *${pushname}*🍁.${readmore}\n${randvideomenu(
            prefix,
            hituet
          )}`;
          m.reply(xmenu_oh);
        }
        break;
      case "photooxymenu":
        {
          let xmenu_oh = `${rellwaktu} *${pushname}*🍁.${readmore}\n${photooxymenu(
            prefix,
            hituet
          )}`;
          m.reply(xmenu_oh);
        }
        break;
      case "nsfwmenu":
        {
          if (premiumya === null) return reply(mess.premium);
          let xmenu_oh = `${rellwaktu} *${pushname}*🍁.${readmore}\n${nsfwmenu(
            prefix,
            hituet
          )}`;
          m.reply(xmenu_oh);
        }
        break;
      case "animemenu":
        {
          let xmenu_oh = `${rellwaktu} *${pushname}*🍁.${readmore}\n${animemenu(
            prefix,
            hituet
          )}`;
          m.reply(xmenu_oh);
        }
        break;
      case "stickermenu":
        {
          let xmenu_oh = `${rellwaktu} *${pushname}*🍁.${readmore}\n${stickermenu(
            prefix,
            hituet
          )}`;
          m.reply(xmenu_oh);
        }
        break;
      case "databasemenu":
        {
          let xmenu_oh = `${rellwaktu} *${pushname}*🍁.${readmore}\n${databasemenu(
            prefix,
            hituet
          )}`;
          m.reply(xmenu_oh);
        }
        break;
      case "searchmenu":
        {
          let xmenu_oh = `${rellwaktu} *${pushname}*🍁.${readmore}\n${searchmenu(
            prefix,
            hituet
          )}`;
          m.reply(xmenu_oh);
        }
        break;
      case "storemenu":
        {
          if (!isOwner) return m.reply(mess.Owner);
          let xmenu_oh = `${rellwaktu} *${pushname}*🍁.${readmore}\n${storemenu(
            prefix,
            hituet
          )}`;
          m.reply(xmenu_oh);
        }
        break;
      case "aimenu":
        {
          let sections = [];
          let list = {
            title: `Silvia Asistant🌸`,
            rows: [],
          };
          list.rows.push(
            {
              title: `Enable✅`,
              description: `Turn On Asistant`,
              id: `.autoai on`,
            },
            {
              title: `Disable❌`,
              description: `Turn Off Asistant`,
              id: `.autoai off`,
            }
          );
          sections.push(list);

          let listMsg = {
            title: "Silvia Asistant🌸",
            sections,
          };
          rell.sendList(
            from,
            `${rellwaktu} *${pushname}*🍁`,
            `${aimenu(prefix, hituet)}`,
            listMsg
          );
        }
        break;
      case "religionmenu":
        {
          let xmenu_oh = `${rellwaktu} *${pushname}*🍁.${readmore}\n${religionmenu(
            prefix,
            hituet
          )}`;
          m.reply(xmenu_oh);
        }
        break;
      case "listmenu":
        {
          let xmenu_oh = `${rellwaktu} *${pushname}*🍁.${readmore}\n${listmenu(
            prefix,
            hituet
          )}`;
          m.reply(xmenu_oh);
        }
        break;
      case "convertmenu":
        {
          let xmenu_oh = `${rellwaktu} *${pushname}*🍁.${readmore}\n${convertmenu(
            prefix,
            hituet
          )}`;
          m.reply(xmenu_oh);
        }
        break;
      //store
      case "svps":
      case "sendvps":
        {
          if (!isOwner) return `Ngapain Pea`;
          if (!text)
            return reply(
              `Example : ${prefix + command} 6285xxxxx,ip,ram,harga,passwordvps`
            );
          reply("Pesanan Telah Sukses Dikirim");
          var mon = args.join(" ");
          var m1 = mon.split(",")[0];
          var m2 = mon.split(",")[1];
          var m3 = mon.split(",")[2];
          var m4 = mon.split(",")[3];
          var m5 = mon.split(",")[4];
          let mq1 = m1 + "@s.whatsapp.net";
          let ownernya = owner + "@s.whatsapp.net";
          let me = m.sender;
          let ments = [mq1, ownernya, me];
          rell.sendMessage(
            mq1,
            {
              text: `*───❖》PannDev《❖───*\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n*📦 Pesananmu Datang 📦*\n*Harga : ${m4}*\n*Hari : ${hariini}*\n*Tanggal : ${tanggal2}*\n*Jam : ${time}*\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n*[+] Ip : ${m2}*\n*[+] Username : root*\n*[+] Password : ${m5}*\n*[+] Ram : ${m3}*\n\n*───《TOS VPS》───*\n\n*-JANGAN SAMPAI TERKENA DDOS*\n*-JANGAN GUNAKAN UNTUK DDOS*\n*-JANGAN GUNAKAN UNTUK MINING*\n*-CPU JANGAN SAMPAI 100%*\n*-MELANGGAR RULES? GARANSI ANGUS*\n*-PANEL SUS NO REFF*`,
            },
            m
          );
        }
        break;
      //other core
      case "nsfwdetector":
        {
          let q = m.quoted ? m.quoted : m;
          let mime = (q.msg || q).mimetype || q.mediaType || "";
          if (/image/g.test(mime) && !/webp/g.test(mime)) {
            let buffer = await rell.downloadAndSaveMediaMessage(qmsg);
            try {
              let media = await TelegraPh(buffer);
              let api = await fetch(
                `https://api.betabotz.eu.org/api/tools/nsfw-detect?url=${media}&apikey=${lann}`
              );
              let response = await api.json();
              if (response.status) {
                let { labelName, labelId, confidence } = response.result;
                let capt = `乂 *N S F W D E T E C T O R*\n\n◦ *Label Name* : ${labelName}\n◦ *Label Id* : ${labelId}\n◦ *Confidence* : ${confidence}\n`;
                m.reply(capt);
              }
            } catch (err) {
              console.error(error);
            }
          } else {
            throw `Reply image with command ${prefix + command}`;
          }
        }
        break;
      case "stats":
        {
          let spek = "npx neofetch --stdout";
          exec(spek, (err, stdout) => {
            if (err) return reply(err);
            if (stdout) return reply(stdout);
          });
        }
        break;
      case "gantinama":
        {
          db.data.users[sender].nick = `${args[0]}`;
          reply(`namamu diubah menjadi ${args[0]}`);
        }
        break;
      case "usertop":
      case "topuser":
      case "topused":
      case "topuse":
      case "topxp":
      case "xptop":
        {
          let users = global.db.data.users;
          let totalHits = [];

          for (let userId in users) {
            if (users.hasOwnProperty(userId)) {
              totalHits.push({
                id: userId,
                nick: users[userId].nick,
                totalhit: users[userId].totalhit || 0,
              });
            }
          }

          totalHits.sort((a, b) => b.totalhit - a.totalhit);

          let top10Users = totalHits.slice(0, 5);

          let txt = `*---「 TOP BOT USAGE 」---*\n\n`;
          for (let i = 0; i < top10Users.length; i++) {
            let user = top10Users[i];
            txt += `--「 *TOP ${i + 1}* 」--\n`;
            txt += `- Nama : ${user.nick}\n`;
            txt += `- TOTAL: ${user.totalhit}\n`;
            txt += `-----------------------\n\n`;
          }
          m.reply(txt);
        }
        break;
      //============= [ CASE END / FEATURE LIST ]================//
      default:
        //salam
        if (
          /^(assalamualaikum|asalamualaikum|assalamualaykum|salamualaikum|samlikum|assalamu'alaikum|assalamu'alaykum|asalamu'alaykum|samlikom|samlekom|assalamualaikum\s+wr\.\s+wb\.|assalamu'alaikum\s+wr\.\s+wb\.|Assalamu'alaikum\s+warahmatullahi\s+wabarakatuh|Assalamualaikum\s+warahmatullahi\s+wabarakatuh|Assalamu'alaikum\s+wr\s+wb|Assalamu'alaikum\s+wr\.\s+wb|Assalamualaikum\s+wr\s+wb|Assalamualaikum\s+wr\.\s+wb|Assalamualaikum\s+wa\s+rahmatullahi\s+wa\s+barakatuh|Assalamualaikum\s+wa\s+rahmatullahi\s+wabarakatuh|Assalamualaikum\s+warahmatullahi\s+wa\s+barakatuh|Assalamu'alaikum\s+wa\s+rahmatullahi\s+wa\s+barakatuh|Assalamu'alaikum\s+warahmatullahi\s+wa\s+barakatuh|Assalamu'alaikum\s+warahmatullahi\s+wa\s+barakatuh)$/i.test(
            m.body
          )
        )
          return reply(`wa'alaikumussalam wa rahmatullahi wa barakatuh.`);
        //autoai
        if (db.data.chats[from].autoai && db.data.chats[from].autoai) {
          if (/^.*menu|off|disable|chatbot|0/i.test(m.body)) return;
          if (!m.body) return;

          let botnumberssss = "6282334226291@s.whatsapp.net";
          if (m.sender === botnumberssss) return;

          let text = m.text;
          let name = rell.getName(m.sender);
          let q = m.quoted ? m.quoted : m;
          let mime = (q.msg || q).mimetype || q.mediaType || "";
          global.db.data.users[sender].totalhit += 1;
          try {
            if (text.includes("group") && text.includes("tutup")) {
              if (!isBotAdmins)
                return m.reply(
                  `Maaf, hanya admin yang bisa menggunakan perintah ini. 😔`
                );
              if (!isAdmins)
                return m.reply(
                  `Maaf, hanya admin yang bisa menggunakan perintah ini. 😔`
                );

              await rell.groupSettingUpdate(m.chat, "announcement");
              m.reply(`Oke, grup telah ditutup. Semoga lebih teratur ya~ 😉`);
            } else if (text.includes("group") && text.includes("buka")) {
              if (!isBotAdmins)
                return m.reply(
                  `Maaf, hanya admin yang bisa menggunakan perintah ini. 😔`
                );
              if (!isAdmins)
                return m.reply(
                  `Maaf, hanya admin yang bisa menggunakan perintah ini. 😔`
                );

              await rell.groupSettingUpdate(m.chat, "not_announcement");
              m.reply(
                `Oke, grup telah dibuka. Ayo kita beraktivitas bersama-sama! 😉`
              );
            } else if (
              (text.includes("tolong") && text.includes("kick")) ||
              text.includes("keluarkan")
            ) {
              if (!isBotAdmins)
                return m.reply(
                  `Maaf, hanya admin yang bisa menggunakan perintah ini. 😔`
                );
              if (!isAdmins)
                return m.reply(
                  `Maaf, hanya admin yang bisa menggunakan perintah ini. 😔`
                );

              let users = m.mentionedJid[0]
                ? m.mentionedJid[0]
                : m.quoted
                  ? m.quoted.sender
                  : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
              await rell.groupParticipantsUpdate(m.chat, [users], "remove");
              m.reply(`Maaf Ya Terpaksa Aku Tendang 😖, Perintah Admin Sih..`);
            } else if (text.includes("vidio") && text.includes("hentai")) {
              m.reply(`Silvia Tidak Bisa membantu😧`);
            } else if (
              text.includes("minta") &&
              text.includes("link") &&
              text.includes("group")
            ) {
              if (!m.isGroup)
                return m.reply(
                  `Maaf Silvia Gabisa bantu karena ini private chat`
                );
              if (!isAdmins && !isGroupOwner && !isOwner)
                return m.reply(
                  `Maaf Silvia Gabisa bantu karena kamu bukan admin`
                );
              if (!isBotAdmins)
                return m.reply(
                  `Maaf Silvia Gabisa bantu karena saya bukan admin`
                );
              let response = await rell.groupInviteCode(m.chat);
              m.reply(
                `Oke, Nih Link Group nya~ Jika butuh bantuan lagi tanya Silvia! 😇\n\nhttps://chat.whatsapp.com/${response}`
              );
            } else if (
              text.includes("reset") &&
              text.includes("link") &&
              text.includes("group")
            ) {
              if (!m.isGroup)
                return m.reply(
                  `Maaf Ini Adalah private chat dan Silvia tidak bisa membantu😀`
                );
              if (!isAdmins && !isGroupOwner && !isOwner)
                return m.reply(`Silvia Tidak Bisa membantu jika bukan admin🥺`);
              if (!isBotAdmins)
                return m.reply(`Silvia Tidak Bisa membantu jika bukan admin🥺`);
              await rell.groupRevokeInvite(m.chat).then((res) => {
                m.reply(`Oke, Link Groupnya Sudah Silvia Reset Nih😁`);
              });
            } else if (
              (text.includes("fitur") &&
                text.includes("apa") &&
                text.includes("aja")) ||
              (text.includes("menu") && text.includes("fitur"))
            ) {
              m.reply(
                "Fitur?🤔 Coba Klik aja tombolnya nanti kamu bisa liat fiturnya"
              );
              let sections = [];
              let list = {
                title: `Silvia Feature🌸`,
                rows: [],
              };
              list.rows.push({
                title: `List Fiturnya`,
                description: `Turn On Asistant`,
                id: `.menu`,
              });
              sections.push(list);
              let listMsg = {
                title: "Silvia Asistant🌸",
                sections,
              };
              rell.sendList(
                from,
                `Hai ${pushname}`,
                "- Silvia Asisant",
                listMsg
              );
            } else if (
              (text.includes("putar") && text.includes("musik")) ||
              (text.includes("play") && text.includes("lagu")) ||
              (text.includes("putar") && text.includes("lagu")) ||
              (text.includes("Putar") && text.includes("musik")) ||
              (text.includes("Play") && text.includes("lagu")) ||
              (text.includes("Putar") && text.includes("lagu"))
            ) {
              try {
                function formatViews(views) {
                  if (views >= 1000000) {
                    return (views / 1000000).toFixed(1) + "M";
                  } else if (views >= 1000) {
                    return (views / 1000).toFixed(1) + "K";
                  } else {
                    return views.toString();
                  }
                }
                let ytdl = require("ytdl-core");
                let fs = require("fs");
                let ffmpeg = require("fluent-ffmpeg");
                let search = require("yt-search");
                let results = await search(text);
                let videoId = results.videos[0].videoId;
                let info = await ytdl.getInfo(videoId);
                let title = info.videoDetails.title.replace(/[^\w\s]/gi, "");
                let thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
                let url = info.videoDetails.video_url;
                let duration = parseInt(info.videoDetails.lengthSeconds);
                let uploadDate = new Date(
                  info.videoDetails.publishDate
                ).toLocaleDateString();
                let views = info.videoDetails.viewCount;
                let minutes = Math.floor(duration / 60);
                let description = results.videos[0].description;
                let seconds = duration % 60;
                let durationText = `${minutes}:${seconds < 10 ? "0" : ""
                  }${seconds}`;
                let audio = ytdl(videoId, { quality: "highestaudio" });
                let inputFilePath = "./trash/" + title + ".webm";
                let outputFilePath = "./trash/" + title + ".mp3";
                let viewsFormatted = formatViews(views);
                let infoText = `◦ *Title*: ${title}\n◦ *Duration*: ${durationText}\n◦ *Upload*: ${uploadDate}\n◦ *Views*: ${viewsFormatted}\n◦ *ID*: ${videoId}\n◦ *Description*: ${description}\n◦ *URL*: ${url}
              `;
                const pesan = m.reply(`silvia sedang mencari ${title} untukmu`);

                audio
                  .pipe(fs.createWriteStream(inputFilePath))
                  .on("finish", async () => {
                    ffmpeg(inputFilePath)
                      .toFormat("mp3")
                      .on("end", async () => {
                        let buffer = fs.readFileSync(outputFilePath);
                        rell.sendMessage(
                          m.chat,
                          {
                            audio: buffer,
                            mimetype: "audio/mpeg",
                            contextInfo: {
                              externalAdReply: {
                                title: title,
                                body: "",
                                thumbnailUrl: thumbnailUrl,
                                sourceUrl: wagc,
                                mediaType: 1,
                                showAdAttribution: true,
                                renderLargerThumbnail: false,
                              },
                            },
                          },
                          {
                            quoted: fkontak,
                          }
                        );
                        fs.unlinkSync(inputFilePath);
                        fs.unlinkSync(outputFilePath);
                      })
                      .on("error", (err) => {
                        console.log(err);
                        m.reply(
                          `There was an error converting the audio: ${err.message}`
                        );
                        fs.unlinkSync(inputFilePath);
                        fs.unlinkSync(outputFilePath);
                      })
                      .save(outputFilePath);
                  });
              } catch (e) {
                console.log(e);
                m.reply(
                  `An error occurred while searching for the song: ${e.message}`
                );
              }
            } else {
              try {
                const quoted = m.quoted || m;
                const mime = (quoted.msg || quoted).mimetype || "";

                function getTodayDate() {
                  const today = new Date();
                  const day = today.getDate();
                  const month = today.getMonth() + 1;
                  const year = today.getFullYear();
                  const dayOfWeek = today.toLocaleDateString("id-ID", {
                    weekday: "long",
                  });

                  return `Hari ini adalah ${dayOfWeek}, ${day}/${month}/${year}.`;
                }

                const date = new Date(
                  new Date().toLocaleString("en-US", {
                    timeZone: "Asia/Jakarta",
                  })
                );
                const hours = date.getHours();
                const minutes = date.getMinutes();
                const timeNow = `${hours.toString().padStart(2, "0")}:${minutes
                  .toString()
                  .padStart(2, "0")}`;
                const username = db.data.users[sender].nick;
                const genderr = db.data.users[sender].gender;
                const nama =
                  m.sender.split("@")[0] === ownernumber
                    ? `${username} dan dia adalah pembuatmu sekaligus pacarmu`
                    : `${username} dan kamu punya perasaan terhadap lawan bicaramu tetapi tetap jaga cara bicaramu`;
                const prompt = `Kamu bernama Silvia, berumur 18 tahun, seorang wanita. lawan bicaramu bernama ${nama}. lawan bicaramu bergender ${genderr}. Jawab setiap pertanyaan dengan jawaban yang edukatif beserta emoji. Jika ada yang bertanya tentang waktu, jawab dengan keterangan yang berkaitan dengan ${timeNow} dan ${getTodayDate()}. Nama penciptamu adalah Farel, kamu lahir pada 1 Januari. Selalu gunakan bahasa Indonesia saat menjawab. Berbicaralah selayaknya manusia, bukan AI.`;


                luminAi(`${encodeURIComponent(text)}`, pushname, prompt)
                  .then((result) => m.reply(result))
                  .catch((error) => console.error(error));
              } catch (error) {
                console.error("Error fetching data:", error);
                throw error;
              }
            }
          } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
          }
        }
        if (budy.startsWith("=>")) {
          if (!isOwner) return;
          function Return(sul) {
            sat = JSON.stringify(sul, null, 2);
            bang = util.format(sat);
            if (sat == undefined) {
              bang = util.format(sul);
            }
            return reply(bang);
          }
          try {
            reply(
              util.format(eval(`(async () => { return ${budy.slice(3)} })()`))
            );
          } catch (e) {
            reply(String(e));
          }
        }

        if (budy.startsWith(">")) {
          if (!isOwner) return;
          try {
            let evaled = await eval(budy.slice(2));
            if (typeof evaled !== "string")
              evaled = require("util").inspect(evaled);
            await reply(evaled);
          } catch (err) {
            await reply(String(err));
          }
        }
        if (budy.startsWith("$")) {
          if (!isOwner) return;
          exec(budy.slice(2), (err, stdout) => {
            if (err) return reply(err);
            if (stdout) return reply(stdout);
          });
        }
        if (isCmd && budy.toLowerCase() != undefined) {
          if (m.chat.endsWith("broadcast")) return;
          if (m.isBaileys) return;
          let msgs = global.db.data.database;
          if (!(budy.toLowerCase() in msgs)) return;
          rell.copyNForward(m.chat, msgs[budy.toLowerCase()], true, {
            quoted: fkontak,
          });
        }
    }
  } catch (err) {
    console.log(util.format(err));
    let e = String(err);
    rell.sendMessage(`${ownernumber}@s.whatsapp.net`, {
      text: "Hi dev, eror found\n\n\n " + util.format(e),
      contextInfo: {
        forwardingScore: 9999999,
        isForwarded: true,
      },
    });
    if (e.includes("conflict")) return;
    if (e.includes("Cannot derive from empty media key")) return;
    if (e.includes("not-authorized")) return;
    if (e.includes("already-exists")) return;
    if (e.includes("rate-overlimit")) return;
    if (e.includes("connection Closed")) return;
    if (e.includes("Timed Out")) return;
    if (e.includes("Value not found")) return;
    if (e.includes("Socket connection timeout")) return;
  }
}
