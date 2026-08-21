require("./settings.js");
const MONGO = require("./all/Mongo/user_status.js");
const USERID = require("./all/Mongo/users_id.js");
const USER = require("./all/Mongo/user_data.js");
const { YTDL } = require("./all/scrape/ytdl.js");
const LEVEL = require("./all/Mongo/leveling.js");
const REEDEM = require("./all/Mongo/reedem.js");
const FUNC = require("./all/library/myfunc.js");
const SCR = require("./all/scrape/screaper.js");
const { performance } = require("perf_hooks");
const gacha = require("./all/Mongo/waifu.js");
const moment = require("moment-timezone");
const { exec } = require("child_process");
const Groq = require("groq-sdk");
const chalk = require("chalk");
const axios = require("axios");
const util = require("util");
const fs = require("fs");
const more = String.fromCharCode(8206);
const readmore = more.repeat(4800);
const groq = new Groq({ apiKey: global.GROQ_API });
const gamewaktu = 30;
module.exports = async (sock, m, chatUpdate, store) => {
  try {
    const body = m.text || m.msg?.selectedButtonId || m.msg?.singleSelectReply?.selectedRowId || "";
    const botNumber = await sock.decodeJid(sock.user.id);
    const isGroup = m.chat.endsWith("@g.us");
    //================== [ DATABASE ] ==================//
    try {
      // User data
      let user = m.sender ? global.db.data.users[m.sender] : null;
      if (m.sender) {
        if (typeof user !== "object" || !user) {
          global.db.data.users[m.sender] = {};
          user = global.db.data.users[m.sender];
        }
        if (!("afkTime" in user)) user.afkTime = -1;
        if (!("afkReason" in user)) user.afkReason = "";
        if (!("hitcmd" in user)) user.hitcmd = 0;
        if (!("autoai" in user)) user.autoai = true;
        if (!("banned" in user)) user.banned = false;
        if (!("limit" in user)) user.limit = 100;
        if (!("lastRecharge" in user)) user.lastRecharge = null;
      }
      // Chat/Group data
      let chats = isGroup ? global.db.data.chats[m.chat] : null;
      if (isGroup) {
        if (typeof chats !== "object") {
          global.db.data.chats[m.chat] = {};
          chats = global.db.data.chats[m.chat];
        }
        if (!("welcometxt" in chats)) chats.welcometxt = "Hello, @user!";
        if (!("leftxt" in chats)) chats.leftxt = "Bye @user";
        if (!("isBanned" in chats)) chats.isBanned = false;
        if (!("welcomer" in chats)) chats.welcomer = true;
        if (!("antilink" in chats)) chats.antilink = false;
        if (!("antilinkgc" in chats)) chats.antilinkgc = false;
        if (!("antisticker" in chats)) chats.antisticker = false;
        if (!("antibot" in chats)) chats.antibot = false;
        if (!("banned" in chats)) chats.banned = false;
      }
      // Setting data
      let setting = global.db.data.settings;
      if (typeof setting !== "object") global.db.data.settings = {};
      if (setting) {
        if (!("autoread" in setting)) setting.autoread = true;
        if (!("public" in setting)) setting.public = true;
        if (!("autobio" in setting)) setting.autobio = true;
        if (!("anticall" in setting)) setting.anticall = true;
        if (!("onlyprem" in setting)) setting.onlyprem = false;
      } else {
        global.db.data.settings = {
          public: true,
          autoread: true,
          autobio: false,
          onlyprem: false,
          anticall: false
        };
      }
      // Other Data
      if (!("menfess" in global.db.data)) global.db.data.menfess = {};
      global.menfessTimeouts = global.menfessTimeouts || new Map();
      if (!("limitReset" in global.db.data)) global.db.data.limitReset = 0;
    } catch (err) {
      console.error(err);
    }

    const userdb = global.db.data.users[m.sender];
    const chatdb = global.db.data.chats[m.chat];
    //========= CONFIGURASI ==========//
    function escapeRegex(s) {
      return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    // Main setup
    const rawCmd = m.msg?.selectedButtonId || m.text || "";
    const budy = typeof rawCmd === "string" ? rawCmd.trim() : "";
    const prefix = ".";
    const evalnya = budy.startsWith("=>") ? budy.slice(2).trim() : budy.startsWith(">") ? budy.slice(1).trim() : "";
    const isCmd = budy.startsWith(prefix);
    const command = isCmd ? budy.slice(prefix.length).trim().split(/\s+/)[0].toLowerCase() : "";
    const cmd = prefix + command;
    const withoutCmd = isCmd
      ? budy
        .slice(prefix.length)
        .trim()
        .replace(new RegExp(`^${escapeRegex(command)}\\b`, "i"), "")
        .trim()
      : "";
    const args = withoutCmd.length > 0 ? withoutCmd.split(/\s+/) : [];
    const text = withoutCmd;
    // Message context
    const messageMisc = m.quoted || m;
    const quoted =
      messageMisc.mtype === "buttonsMessage"
        ? messageMisc[Object.keys(messageMisc)[1]]
        : messageMisc.mtype === "templateMessage"
          ? messageMisc.hydratedTemplate[Object.keys(messageMisc.hydratedTemplate)[1]]
          : messageMisc.mtype === "product"
            ? messageMisc[Object.keys(messageMisc)[0]]
            : m.quoted || m;
    const mime = (quoted.msg || quoted).mimetype || "";
    const qmsg = quoted.msg || quoted;
    // Sender & group info
    const sender = m.sender || (m.key.fromMe ? sock.user.id.split(":")[0] + "@s.whatsapp.net" : sock.decodeJid(m.key.participantAlt || m.key.participant || m.key.remoteJidAlt || m.key.remoteJid || ""));
    const pushname = m.pushName || sock.getName(sender);
    const from = m.chat || sock.decodeJid(m.key.remoteJidAlt || m.key.remoteJid || "");
    const isOwner = m.sender === owner + "@s.whatsapp.net";
    const isBot = botNumber.includes(m.sender);
    const isCreator = [owner].map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender);
    // Group participant info
    const groupMetadata = isGroup ? await sock.groupMetadata(m.chat).catch(() => ({})) : {};
    const participants = isGroup ? groupMetadata?.participants : [];
    const participant_bot = participants?.find(v => v.id === botNumber) || {};
    const participant_sender = participants?.find(v => v.id === m.sender) || {};
    const isBotAdmin = participant_bot?.admin != null;
    const isAdmin = participant_sender?.admin != null;
    // Database checks
    const jidAllList = await USERID.getAllNumbers();
    const registered = await USER.getUser(sender);
    const isRegistered = !!registered;
    const isBanned = await MONGO.getBannedStatus(sender);
    const isPremium = !!(await MONGO.getPremiumStatus(m.sender));

    const ppuser = await sock.profilePictureUrl(m.sender, "image").catch(() => "https://telegra.ph/file/6880771a42bad09dd6087.jpg");

    if (!isRegistered) {
      if (sender.includes("@newsletter")) return;
      if (sender.includes("@g.us")) return;
      const newUser = {
        phone_number: sender,
        username: pushname
      };
      MONGO.addUser(newUser);
      await USER.addUser({
        _id: sender,
        name: pushname,
        ppuser: ppuser
      });
    }

    const fsaluran = {
      key: {
        remoteJid: sender,
        participant: "0@s.whatsapp.net"
      },
      message: {
        extendedTextMessage: {
          text: m.text
        }
      }
    };
    const fkontak = {
      key: {
        remoteJid: "status@broadcast",
        fromMe: false,
        participant: "0@s.whatsapp.net"
      },
      message: {
        contactMessage: {
          displayName: "Owner Bot",
          vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Owner\nTEL;type=CELL:+${botNumber.split("@")[0]}\nEND:VCARD`
        }
      }
    };
    // const reply2 = async (teks) => {
    //   const url = global.imgreply;

    //   await sock.sendMessage(
    //     m.chat,
    //     {
    //       text: teks,
    //       contextInfo: {
    //         showAdAttribution: true,
    //         forwardingScore: 1,
    //         isForwarded: true,
    //         mentionedJid: [m.sender],

    //         linkPreview: {
    //           'matched-text': url,
    //           title: "楓 (Kaede) 2K25",
    //           description: teks,
    //           previewType: 0,
    //           jpegThumbnail: fs.readFileSync('./media/Menu.jpg'),
    //           highQualityThumbnail: global.thumb,
    //         },
    //         externalAdReply: {
    //           title: FUNC.Greetings() + " " + pushname,
    //           body: "楓 (Kaede) 2K25",
    //           // previewType: "PHOTO",
    //           // thumbnailUrl: global.thumb,
    //           thumbnail: fs.readFileSync('./media/Menu.jpg'),
    //           sourceUrl: global.thumb,
    //         },
    //         businessMessageForwardInfo: {
    //           businessOwnerJid: sock.decodeJid(sock.user.id)
    //         },
    //         forwardedNewsletterMessageInfo: {
    //           newsletterJid: global.idsaluran,
    //           serverMessageId: null,
    //           newsletterName: `${FUNC.Greetings()} ${pushname} 👋`
    //         }
    //       }
    //     },
    //     {
    //       quoted: fsaluran
    //     }
    //   );
    // };
    const reply2 = teks => m.reply(teks);
    const reply = teks => m.reply(teks);
    async function react(emoji) {
      try {
        await sock.sendMessage(m.chat, {
          react: { text: emoji, key: m.key }
        });
      } catch (error) {
        console.error("Failed to send reaction:", error);
      }
    }
    async function sendType(text) {
      await sock.sendPresenceUpdate("composing", m.chat);
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
      return await reply(text);
    }
    //////////////////////////////////////////////////////////
    // Public mode check
    if (!global.db.data.settings.public && !isCreator) return;
    // Group protection rules
    if (isGroup) {
      // Anti-group link
      if (chatdb.antilinkgc && budy.includes("chat.whatsapp.com")) {
        if (!isAdmin && !m.key.fromMe) {
          await sock.sendMessage(m.chat, { delete: m.key });
        }
      }
      // Anti-external link
      if (chatdb.antilink && (budy.includes("http://") || budy.includes("https://"))) {
        if (!isAdmin && !m.key.fromMe) {
          await sock.sendMessage(m.chat, { delete: m.key });
        }
      }
      // Anti-sticker
      if (chatdb.antisticker && m.mtype === "stickerMessage") {
        if (!isAdmin && !m.key.fromMe) {
          if (isBotAdmin) {
            await sock.sendMessage(m.chat, { delete: m.key });
          } else {
            react("✅");
          }
        }
      }
    }

    //afk
    let mentionUser = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])];
    for (let jid of mentionUser) {
      let user = db.data.users[jid];
      if (!user) continue;
      let afkTime = user.afkTime;
      if (!afkTime || afkTime < 0) continue;
      let reason = user.afkReason || "";
      if (m.key.fromMe) return;
      sock.sendMessage(
        m.chat,
        {
          text: `彼はAFK中です${reason ? "。理由: " + reason : "。"}\nAFK開始から: ${FUNC.clockString(FUNC.getJapanDate() - afkTime)}`
        },
        { quoted: fsaluran }
      );
    }
    if (db.data.users[m.sender]?.afkTime > -1) {
      let user = global.db.data.users[m.sender];
      sock.sendMessage(
        m.chat,
        {
          text: `AFKから戻りました。\n理由: ${user.afkReason ? user.afkReason : "なし"}\nAFK時間: ${FUNC.clockString(FUNC.getJapanDate() - user.afkTime)}`
        },
        { quoted: fsaluran }
      );
      user.afkTime = -1;
      user.afkReason = "";
    }
    //autoai
    function getTodayDate() {
      const today = FUNC.getJapanDate();
      const dayOfWeek = new Intl.DateTimeFormat("ja-JP", {
        weekday: "long",
        timeZone: "Asia/Tokyo"
      }).format(today);
      const day = new Intl.DateTimeFormat("ja-JP", {
        day: "numeric",
        timeZone: "Asia/Tokyo"
      }).format(today);
      const month = new Intl.DateTimeFormat("ja-JP", {
        month: "numeric",
        timeZone: "Asia/Tokyo"
      }).format(today);
      const year = new Intl.DateTimeFormat("ja-JP", {
        year: "numeric",
        timeZone: "Asia/Tokyo"
      }).format(today);

      return `Hari ini adalah ${dayOfWeek}, ${day}/${month}/${year}.`;
    }
    async function getExternalData() {
      const [quake] = await Promise.all([getEarthquake()]);
      return `INFO GEMPA TERKINI:\n${quake}`;
    }

    async function getEarthquake() {
      try {
        const res = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json");
        const data = await res.json();
        const g = data.Infogempa.gempa;
        return `Lokasi: ${g.Wilayah}, Magnitudo: ${g.Magnitude}, Kedalaman: ${g.Kedalaman}, Waktu: ${g.Jam}, Potensi: ${g.Potensi}`;
      } catch (e) {
        return "";
      }
    }
    const date = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const timeNow = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} JST`;
    const prompt = `Kamu adalah Silvia, cewek 20 tahun yang ramah, suka ngajak ngobrol santai, dan ngomong kayak manusia biasa. Lawan bicaramu namanya ${pushname}, dan kamu suka sama dia tapi jangan kelihatan jelas ya 😳, Kamu bisa pakai berbagai bahasa, tapi utamakan campuran Jepang latin dan Indonesia santai. Jangan terlalu formal, pakai emoji biar obrolan lebih hidup 🫶, Kalau ${pushname} tanya waktu, jawab pakai ${timeNow} dan ${getTodayDate()}. Kalau tanya soal gempa, ambil data dari ${await getExternalData()} dan jelaskan baik-baik., Kamu dibuat oleh Franklin, Farel, Silvia dan Naura, kamu "lahir" tanggal 1 Januari. Kalau ${pushname} nanya fitur, arahkan ketik .menu, atau kamu bisa jelasin satu-satu juga. Command yang kamu ngerti: .ig [link] → Download dari Instagram, .play [judul] → Cari lagu, .ytmp3 [link] → YouTube ke audio, .ytmp4 [link] → YouTube ke video, .tiktok [link] → Download video TikTok, .fb [link] → Download video Facebook, .remini → Bikin foto jadi HD, .brat [teks] → Bikin stiker brat, .smeme atas|bawah → Stiker meme, .qc [teks] → Stiker chat palsu, .sticker → Ubah gambar ke stiker. Catatan: Jangan pakai spasi setelah titik (contoh: .tiktok https://...). Kalau ada yang ngeluh command gak jalan, mungkin lagi kena limit sementara`;
    //=========== MESSAGE ===========//
    if (isCmd) {
      if (m.key.fromMe) return;
      userdb.hitcmd += 1;
      function getJSTFormattedTime() {
        const now = FUNC.getJapanDate();
        const timeOptions = {
          timeZone: "Asia/Tokyo",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        };
        const timeString = now.toLocaleTimeString("en-US", timeOptions);
        return `${timeString}`;
      }
      const time = getJSTFormattedTime();
      let isGC = from.includes("@g.us") ? "GC" : "PC";
      const line = `${chalk.gray(`[${time}][${isGC}]`)} ${chalk.green(pushname)} ➜ ${chalk.yellow(command)}`;
      console.log(line);
    }
    if (isGroup) {
      if (m.key.fromMe) return;
      if (m.isBaileys) return;
      LEVEL.levelup(sender, m, sock, fsaluran, pushname);
    }

    if (m.mtype === "interactiveResponseMessage") {
      let msg = m.message[m.mtype] || m.msg;
      if (msg.nativeFlowResponseMessage && !m.isBot) {
        let { id } = JSON.parse(msg.nativeFlowResponseMessage.paramsJson) || {};
        if (id) {
          let emit_msg = {
            key: { ...m.key },
            message: { extendedTextMessage: { text: id } },
            pushName: m.pushName,
            messageTimestamp: m.messageTimestamp || 754785898978
          };
          return sock.ev.emit("messages.upsert", {
            messages: [emit_msg],
            type: "notify"
          });
        }
      }
    }
    // ==== [ Game Handle ] ==== //
    let whosmegame = db.data.game.whosmegame || {};
    let scrambleword = db.data.game.scrambleword || {};
    let kuismath = db.data.game.math || {};
    let math = db.data.game.kuismath || {};
    let guesswordgame = db.data.game.guesswordgame || {};
    let guessstencegame = db.data.game.guessstencegame || {};
    let triviaquizgame = db.data.game.triviaquizgame || {};
    let guesselementgame = db.data.game.triviaquizgame || {};

    if (scrambleword[m.sender]) {
      let { jawaban, waktu } = scrambleword[m.sender];

      if (body.toLowerCase() === "nyerah") {
        await sock.sendMessage(m.chat, {
          text: `💡 答えは: *${jawaban}* でした！`
        });
        clearTimeout(waktu);
        FUNC.sleep(3000);
        delete scrambleword[m.sender];
      } else if (body.toLowerCase().includes(jawaban.toLowerCase())) {
        await sock.sendMessage(m.chat, {
          text: `🎉 *正解！*\n\n👤 解答者: @${m.sender.split("@")[0]}\n📝 答え: ${jawaban}`,
          mentions: [m.sender]
        });
        await sock.sendMessage(m.chat, {
          react: { text: "✔", key: m.key }
        });
        clearTimeout(waktu);
        FUNC.sleep(3000);
        delete scrambleword[m.sender];
      }
    }

    if (kuismath[m.sender]) {
      try {
        if (m.key.fromMe) return;
        kuis = true;
        let jawaban = kuismath[m.sender];
        let hadiahnya = math[m.sender];

        if (parseFloat(body) === parseFloat(jawaban)) {
          await reply(`📐 *計算クイズ*\n\n🎉 正解！`);
          FUNC.sleep(3000);
          delete kuismath[m.sender];
          delete math[m.sender];
        }
      } catch (err) {
        console.error("Error handling math quiz:", err);
        reply("⚠️ エラーが発生しました。もう一度お試しください。");
      }
    }

    if (whosmegame[m.sender]) {
      let { answer } = whosmegame[m.sender];

      if (body.toLowerCase() === "nyerah") {
        await sock.sendMessage(m.chat, {
          text: `💡 正解は: *${answer}* でした！`
        });
        clearTimeout(waktu);
        FUNC.sleep(3000);
        delete whosmegame[m.sender];
      } else if (body.toLowerCase().includes(answer.toLowerCase())) {
        await sock.sendMessage(m.chat, {
          text: `🎉 *正解！*\n\n👤 解答者: @${m.sender.split("@")[0]}\n📝 答え: ${answer}`,
          mentions: [m.sender]
        });
        await sock.sendMessage(m.chat, {
          react: { text: "✔", key: m.key }
        });
        clearTimeout(waktu);
        FUNC.sleep(3000);
        delete whosmegame[m.sender];
      }
    }

    if (guesswordgame[m.sender]) {
      let { jawaban } = guesswordgame[m.sender];

      if (body.toLowerCase() === "nyerah") {
        await sock.sendMessage(m.chat, {
          text: `💡 正解は: *${jawaban}* でした！`
        });
        clearTimeout(waktu);
        FUNC.sleep(3000);
        delete guesswordgame[m.sender];
      } else if (body.toLowerCase().includes(jawaban.toLowerCase())) {
        await sock.sendMessage(m.chat, {
          text: `🎉 *正解！*\n\n👤 解答者: @${m.sender.split("@")[0]}\n📝 答え: ${jawaban}`,
          mentions: [m.sender]
        });
        await sock.sendMessage(m.chat, {
          react: { text: "✔", key: m.key }
        });
        clearTimeout(waktu);
        FUNC.sleep(3000);
        delete guesswordgame[m.sender];
      }
    }

    if (guesselementgame[m.sender]) {
      let { answer } = guesselementgame[m.sender];

      if (body.toLowerCase() === "nyerah") {
        await sock.sendMessage(m.chat, {
          text: `💡 正解は: *${answer}* でした！`
        });
        clearTimeout(waktu);
        FUNC.sleep(3000);
        delete guesselementgame[m.sender];
      } else if (body.toLowerCase().includes(answer.toLowerCase())) {
        await sock.sendMessage(m.chat, {
          text: `🎉 *正解！*\n\n👤 解答者: @${m.sender.split("@")[0]}\n📝 答え: ${answer}`,
          mentions: [m.sender]
        });
        await sock.sendMessage(m.chat, {
          react: { text: "✔", key: m.key }
        });
        clearTimeout(waktu);
        FUNC.sleep(3000);
        delete guesselementgame[m.sender];
      }
    }

    if (triviaquizgame[m.sender]) {
      let { jawaban } = triviaquizgame[m.sender];

      if (body.toLowerCase() === "nyerah") {
        await sock.sendMessage(m.chat, {
          text: `💡 正解は: *${jawaban}* でした！`
        });
        clearTimeout(waktu);
        FUNC.sleep(3000);
        delete triviaquizgame[m.sender];
      } else if (body.toLowerCase().includes(jawaban.toLowerCase())) {
        await sock.sendMessage(m.chat, {
          text: `🎉 *正解！*\n\n👤 解答者: @${m.sender.split("@")[0]}\n📝 答え: ${jawaban}`,
          mentions: [m.sender]
        });
        await sock.sendMessage(m.chat, {
          react: { text: "✔", key: m.key }
        });
        clearTimeout(waktu);
        FUNC.sleep(3000);
        delete triviaquizgame[m.sender];
      }
    }

    if (guessstencegame[m.sender]) {
      let { jawaban } = guessstencegame[m.sender];

      if (body.toLowerCase() === "nyerah") {
        await sock.sendMessage(m.chat, {
          text: `💡 正解は: *${jawaban}* でした！`
        });
        clearTimeout(waktu);
        FUNC.sleep(3000);
        delete guessstencegame[m.sender];
      } else if (body.toLowerCase().includes(jawaban.toLowerCase())) {
        await sock.sendMessage(m.chat, {
          text: `🎉 *正解！*\n\n👤 解答者: @${m.sender.split("@")[0]}\n📝 答え: ${jawaban}`,
          mentions: [m.sender]
        });
        await sock.sendMessage(m.chat, {
          react: { text: "✔", key: m.key }
        });
        clearTimeout(waktu);
        FUNC.sleep(3000);
        delete guessstencegame[m.sender];
      }
    }

    function isPlayingGame(userId) {
      return scrambleword[userId] || kuismath[userId] || whosmegame[userId] || guesswordgame[userId] || guessstencegame[userId] || triviaquizgame[userId] || guesselementgame[userId];
    }
    /////////////////////////////////////////////////////////
    // === Handler Balasan Menfess ===
    if (!m.key.fromMe && !m.isGroup && global.db.data.menfess[m.sender]?.active && m.message) {
      const menfess = global.db.data.menfess;
      const target = menfess[m.sender].tujuan;
      const alias = menfess[m.sender].nama || "Anonymous";
      if (isCmd) return;
      const msgType = Object.keys(m.message)[0];
      const fwdMsg = {
        text: m.text,
        contextInfo: {
          isForwarded: true,
          forwardingScore: 1,
          externalAdReply: {
            title: `Message from ${alias}`,
            thumbnailUrl: global.thumb,
            mediaType: 1,
            renderLargerThumbnail: false
          }
        }
      };

      await sock.sendMessage(target, fwdMsg, { quoted: fkontak });
      await react("✈️");

      if (!menfess[target]) {
        menfess[target] = {
          tujuan: m.sender,
          nama: "Anonymous",
          active: true
        };
      }
    }
    //========== FUNCTION ===========//
    const MAX_LIMIT = 50;
    const RECHARGE_INTERVAL = 5 * 60 * 1000;

    async function useLimit(sender, isPremium, cost = 1) {
      const user = (global.db.data.users[sender] ||= {
        limit: MAX_LIMIT,
        lastRecharge: Date.now()
      });

      if (isPremium) return true;

      if (user.limit >= cost) {
        user.limit -= cost;
        return true;
      } else {
        return false;
      }
    }
    function autoRechargeLimits() {
      const now = Date.now();
      for (const id in global.db.data.users) {
        const user = global.db.data.users[id];
        if (typeof user.limit !== "number") user.limit = MAX_LIMIT;
        if (typeof user.lastRecharge !== "number") user.lastRecharge = now;
        const elapsed = now - user.lastRecharge;
        const refill = Math.floor(elapsed / RECHARGE_INTERVAL);
        if (refill > 0) {
          user.limit = Math.min(MAX_LIMIT, user.limit + refill);
          user.lastRecharge += refill * RECHARGE_INTERVAL;
        }
      }
    }
    setInterval(autoRechargeLimits, 60 * 1000);

    const example = teks => `*コマンドの使用例 :*\nタイプ *${cmd}* ${teks}`;
    // leveling
    const user = await USER.getUser(sender);
    const required = await LEVEL.getRequiredExp(user.level);
    function generateProgressBar(current, total) {
      const progress = Math.floor((current / total) * 12);
      const empty = 12 - progress;
      const bar = "█".repeat(progress) + "░".repeat(empty);
      return `[${bar}] ${Math.floor((current / total) * 100)}%`;
    }
    const progressBar = generateProgressBar(user.exp, required);
    switch (command) {
      case "confess":
      case "confes":
      case "menfes":
      case "menfess":
        {
          if (isGroup) return reply(msg.private);
          if (global.db.data.menfess[m.sender]?.active) return reply("❗ あなたはフェスセッション中です。");
          if (!text.includes("|")) return reply(example("628xxxxxxx|Ally"));
          const [num, alias] = text.split("|");
          const target = num.replace(/\D/g, "") + "@s.whatsapp.net";
          const check = await sock.onWhatsApp(target);
          if (!check[0]?.exists) return reply("WhatsAppで番号が見つかりません。");
          const menfess = global.db.data.menfess;
          menfess[m.sender] = {
            tujuan: target,
            nama: alias?.trim() || "Someone",
            active: true
          };

          menfess[target] = {
            tujuan: m.sender,
            nama: "Anonymous",
            active: true
          };

          const timeout = setTimeout(
            () => {
              if (menfess[m.sender]) menfess[m.sender].active = false;
              if (menfess[target]) {
                sock.sendMessage(target, {
                  text: "⏳ メンフェスセッションは終了しました。"
                });
                menfess[target].active = false;
              }
              global.menfessTimeouts.delete(m.sender);
              global.menfessTimeouts.delete(target);
            },
            10 * 60 * 1000
          ); // 10 menit

          global.menfessTimeouts.set(m.sender, timeout);
          global.menfessTimeouts.set(target, timeout);

          await sock.sendMessage(target, {
            text: `📩 匿名のメッセージを受信しました。\n返信するにはこのメッセージに返信してください。\n終了するには *${prefix}delmenfess* と入力してください。`
          });
          await sock.sendMessage(
            m.chat,
            {
              text: `✅ Menfessセッションが開始されました。\nメッセージを送信してください。\n10分後または*${prefix}delmenfess*で期限切れになります。`
            },
            { quoted: m }
          );
        }
        break;
      case "delconfes":
      case "delconfess":
      case "delmenfes":
      case "delmenfess":
        {
          const menfess = global.db.data.menfess;
          if (!menfess[m.sender]?.active) return reply(`❌ あなたはメンフェスセッション中ではありません。`);
          const partner = menfess[m.sender].tujuan;
          if (global.menfessTimeouts.has(m.sender)) {
            clearTimeout(global.menfessTimeouts.get(m.sender));
            global.menfessTimeouts.delete(m.sender);
          }
          if (global.menfessTimeouts.has(partner)) {
            clearTimeout(global.menfessTimeouts.get(partner));
            global.menfessTimeouts.delete(partner);
          }
          await sock.sendMessage(partner, {
            text: `❌ パートナーがメンフェスセッションを終了しました。`
          });
          await sock.sendMessage(m.chat, {
            text: `✅ メンフェスセッションを終了しました。`
          });
          menfess[m.sender].active = false;
          menfess[partner].active = false;
        }
        break;
      //////////
      case "waifu": {
        const result = await gacha.handleDailyGacha(sender);
        const tickets = await gacha.checkTickets(sender);
        if (!result.status) return sock.sendMessage(m.chat, { text: result.message }, { quoted: m });
        const { name, source, rarity, image } = result.data;
        const caption = `💮 *今日のワイフ*\n\n🏷️ *名前:* ${name}\n📺 *出典:* ${source}\n⭐ *レア度:* ${rarity}\n\n${result.message}\n> ${tickets.message}`;
        sock.sendMessage(
          m.chat,
          {
            text: caption,
            contextInfo: {
              externalAdReply: {
                title: name,
                body: source,
                thumbnailUrl: image,
                mediaType: 1
              }
            }
          },
          { quoted: m }
        );
        break;
      }
      case "reroll": {
        const result = await gacha.rerollGacha(sender);
        const tickets = await gacha.checkTickets(sender);

        if (!result.status) {
          return sock.sendMessage(m.chat, { text: result.message }, { quoted: m });
        }

        const { name, source, rarity, image } = result.data;
        const caption = `🎟️ *REROLL GACHA*\n\n🏷️ *Name:* ${name}\n📺 *Origin:* ${source}\n⭐ *Rarity:* ${rarity}\n\n「.claim」で受け取る、「.skip」でスキップ。\n${result.message}\n> ${tickets.message}`;

        sock.sendMessage(
          m.chat,
          {
            text: caption,
            contextInfo: {
              externalAdReply: {
                title: name,
                body: source,
                thumbnailUrl: image,
                mediaType: 1
              }
            }
          },
          { quoted: m }
        );
        break;
      }
      case "claim": {
        const result = await gacha.handleClaim(sender);
        sock.sendMessage(m.chat, { text: result.message || result.error }, { quoted: m });
        break;
      }

      case "skip": {
        const result = await gacha.handleSkip(sender);
        sock.sendMessage(m.chat, { text: result.message || result.error }, { quoted: m });
        break;
      }

      case "harem":
      case "mymarry": {
        if (text) {
          try {
            const { waifu, user } = await gacha.getHaremChar(text);
            if (!waifu || !user) throw new Error("Waifuまたはユーザーデータが見つかりません");
            const count = user.length;
            const list = user.map((u, i) => `${i + 1}. ${u.username || u.phone_number?.split("@")[0] || "Unknown"}`).join("\n");
            const caption =
              `*🔍 ワイフの所有権チェック*\n\n` +
              `👑 *Name:* ${waifu.name}\n` +
              `🎬 *Anime:* ${waifu.source}\n` +
              `💎 *Rarity:* ${waifu.rarity}\n\n` +
              `📦 *Owned by:* ${count} user(s)\n\n` +
              (count > 0 ? `👥 *Users:*\n${list}` : `Nobody owns this waifu yet.`);
            await sock.sendMessage(
              from,
              {
                text: caption,
                contextInfo: {
                  externalAdReply: {
                    title: waifu.name,
                    body: waifu.source,
                    thumbnailUrl: waifu.image,
                    mediaType: 1,
                    renderLargerThumbnail: true
                  }
                }
              },
              { quoted }
            );
          } catch (err) {
            console.error("Harem text mode error, fallback to user harem:", err);
            try {
              const result = await gacha.getUserHarem(sender);
              if (!result.status) {
                return reply("💤 あなたのハーレムはまだ空っぽです。");
              }

              const collection = result.data;
              const randomWaifu = collection[Math.floor(Math.random() * collection.length)];

              const list = collection.map((w, i) => {
                const name = (w.name || "").replace(/[\n\r]/g, " ");
                const rarity = (w.rarity || "不明").replace(/[\n\r]/g, " ");
                const source = (w.source || "出典不明").replace(/[\n\r]/g, " ");
                return `🌸 ${i + 1}. *${name}*\n│ Rarity: ${rarity}\n│ Source: ${source}\n`;
              });
              const haremText = `💒 *あなたのハーレム (${collection.length}人)*\n\n${list.join("\n")}`;
              await sock.sendMessage(
                m.chat,
                {
                  text: haremText,
                  contextInfo: {
                    externalAdReply: {
                      title: randomWaifu.name || "あなたの妻",
                      body: randomWaifu.rarity,
                      thumbnailUrl: randomWaifu.image,
                      mediaType: 1,
                      renderLargerThumbnail: false
                    }
                  }
                },
                { quoted: m }
              );
            } catch (e) {
              console.error("Fallback error:", e);
              reply("⚠️ ハーレムデータを読み込めませんでした。後でもう一度お試しください。");
            }
          }
        } else {
          try {
            const result = await gacha.getUserHarem(sender);
            if (!result.status) {
              return reply("💤 あなたのハーレムはまだ空っぽです。");
            }
            const collection = result.data;
            const randomWaifu = collection[Math.floor(Math.random() * collection.length)];
            const list = collection.map((w, i) => {
              const name = (w.name || "").replace(/[\n\r]/g, " ");
              const rarity = (w.rarity || "不明").replace(/[\n\r]/g, " ");
              const source = (w.source || "出典不明").replace(/[\n\r]/g, " ");
              return `🌸 ${i + 1}. *${name}*\n│ Rarity: ${rarity}\n│ Source: ${source}\n`;
            });
            const haremText = `💒 *あなたのハーレム (${collection.length}人)*\n\n${list.join("\n")}`;
            await sock.sendMessage(
              m.chat,
              {
                text: haremText,
                contextInfo: {
                  externalAdReply: {
                    title: randomWaifu.name || "あなたの妻",
                    thumbnailUrl: randomWaifu.image,
                    mediaType: 1,
                    renderLargerThumbnail: false
                  }
                }
              },
              { quoted: m }
            );
          } catch (e) {
            console.error("User harem error:", e);
            reply("⚠️ あなたのハーレム情報を取得できませんでした。");
          }
        }
        break;
      }

      case "trade": {
        const [target, ...waifuParts] = args;
        const waifuName = waifuParts.join(" ").trim();
        const result = await gacha.initiateTrade(sender, target, waifuName);
        sock.sendMessage(m.chat, { text: result.error || result.message }, { quoted: m });
        break;
      }

      case "acctrade": {
        const [from, ...waifuParts] = args;
        const waifuName = waifuParts.join(" ").trim();
        const result = await gacha.acceptTrade(sender, from, waifuName);
        sock.sendMessage(m.chat, { text: result.error || result.message }, { quoted: m });
        break;
      }

      case "tradeyes": {
        const result = await gacha.confirmTrade(sender);
        sock.sendMessage(m.chat, { text: result.error || result.message }, { quoted: m });
        break;
      }

      case "tradeno": {
        const [from, ...waifuParts] = args;
        const waifuName = waifuParts.join(" ").trim();
        const result = await gacha.rejectTrade(sender, from, waifuName);
        sock.sendMessage(m.chat, { text: result.error || result.message }, { quoted: m });
        break;
      }
      case "animasu":
      case "animasusearch":
      case "animasudetail": {
        try {
          if (command === "animasu") {
            let res = await latest();
            if (!res.status) throw res.result;
            let teks = `📺 *最新アニメ - Animasu*\n\n`;
            res.result.slice(0, 10).forEach((anime, i) => {
              teks += `${i + 1}. *${anime.title}*\n`;
              teks += `🎞️ タイプ: ${anime.type}\n📚 エピソード: ${anime.episodes}\n🔗 ${anime.link}\n\n`;
            });
            m.reply(teks.trim());
          }

          if (command === "animasusearch") {
            if (!text) throw `キーワードを入力してください！\n例: .animasusearch ワンピース`;
            let res = await search(text);
            if (!res.status || res.result.length === 0) throw "❌ 見つかりませんでした。";
            let teks = `🔎 *検索結果: ${text}*\n\n`;
            res.result.slice(0, 10).forEach((anime, i) => {
              teks += `${i + 1}. *${anime.title}*\n`;
              teks += `🎞️ タイプ: ${anime.type}\n📚 エピソード: ${anime.episodes}\n🔗 ${anime.link}\n\n`;
            });
            m.reply(teks.trim());
          }

          if (command === "animasudetail") {
            let url = args[0];
            if (!url || !url.includes("v1.animasu.top")) throw "❌ 有効なURLを入力してください、バカ先生！\n\n例:\n.animasudetail https://v1.animasu.top/anime/boruto-naruto-next-generations-sub-indo/";
            let res = await detail(url);
            if (!res.status) throw res.result;
            let a = res.result;
            let teks = `🎬 *${a.title}*\n`;
            if (a.alternativeTitle) teks += `💡 別名: ${a.alternativeTitle}\n`;
            teks += `📅 年: ${a.releaseYear || "-"}\n`;
            teks += `🎞️ タイプ: ${a.type || "-"}\n`;
            teks += `📚 エピソード: ${a.episodes || "-"}\n`;
            teks += `⏱️ 時間: ${a.duration || "-"}\n\n`;
            teks += `📝 *説明:*\n${a.description || "-"}\n\n`;
            teks += `🏷️ *ジャンル:* ${a.genres.length ? a.genres.join(", ") : "-"}\n\n`;
            if (a.episodeLinks.length) {
              teks += `🎥 *エピソードリンク:*\n`;
              a.episodeLinks.slice(0, 5).forEach(ep => (teks += `- ${ep.number}: ${ep.link}\n`));
              teks += "\n";
            }
            if (a.downloadLinks.length) {
              teks += `⬇️ *ダウンロードリンク:*\n`;
              a.downloadLinks.forEach(dl => {
                teks += `*${dl.quality}*\n`;
                dl.links.forEach(x => (teks += `• ${x.title}: ${x.link}\n`));
                teks += "\n";
              });
            }
            m.reply(teks.trim());
          }
        } catch (e) {
          m.reply(`${typeof e === "string" ? e : e.message}`);
        }
        break;
      }
      case "anime":
        {
          if (!text) return reply("❗ アニメのタイトルを入力してください。\n例: anime 呪術廻戦");

          reply("🔍 アニメ情報を検索中...");

          const result = await SCR.searchAnimeInfoFromAnilist(text);
          if (result.error) return reply("❌ アニメが見つかりませんでした。");
          const { title, synopsis, poster, cover, startDate, endDate, status, episodeCount, rating, genres, studios, characters } = result;
          const shortDesc = synopsis?.length > 600 ? synopsis.slice(0, 600) + "..." : synopsis;
          let message = "";

          message += `✨ *${title}*\n\n`;
          message += `📺 ステータス: ${status === "finished" ? "完結" : status === "releasing" ? "放送中" : "未放送"}\n`;
          message += `📅 放送期間: ${startDate} ～ ${endDate || "現在"}\n`;
          message += `🎨 ジャンル: ${genres.join("、") || "不明"}\n`;
          message += `🏢 制作会社: ${studios.join("、") || "不明"}\n`;
          message += `📊 話数: ${episodeCount || "?"}\n`;
          message += `⭐ 評価: ${rating || "?"}\n\n`;
          message += `🧙‍♂️ 主要キャラ & 声優:\n`;
          message += characters.map((c, i) => `  ${i + 1}. ${c.name}（CV: ${c.va}）`).join("\n") + "\n\n";
          message += `📝 あらすじ:\n${shortDesc}`;

          await sock.sendMessage(
            m.chat,
            {
              text: message,
              contextInfo: {
                externalAdReply: {
                  title: `${title}`,
                  thumbnailUrl: poster,
                  mediaType: 1,
                  renderLargerThumbnail: false
                }
              }
            },
            { quoted: m }
          );
        }
        break;
      case "animequote":
      case "animequotes":
      case "quotesanime":
      case "quotesanim":
      case "qanime":
        {
          let res = await await fetch("https://katanime.vercel.app/api/getrandom?limit=1");
          if (!res.ok) return await res.text();
          let json = await res.json();
          if (!json.result[0]) return json;
          let { english, character, anime } = json.result[0];
          reply(`${english}\n\n📮By: _${character}_ \nAnime:\n${anime}`);
        }
        break;
      case "manga":
      case "lightnovel":
      case "ln":
      case "searchmanga":
        {
          if (!text) return reply("📖 えっと…タイトルを教えてくれないと探せないよ〜！\n例: manga re:zero");

          const results = await SCR.searchMangaOrLightNovel(text);
          if (!results.length) return reply("💢 ごめんなさい…見つかりませんでした (｡•́︿•̀｡)");

          const top = results[0];

          let caption = `🎐 *『 かえで図書館 - 検索結果 』* 🎐\n`;
          caption += `✨ 気になる作品を見つけたかな？ ✨\n\n`;

          // ✨ Judul Lengkap
          caption += `🎀 *タイトル*: ${top.title_default}\n`;
          caption += `🇯🇵 *Japanese*: ${top.title_japanese}\n`;
          caption += `🇬🇧 *English*: ${top.title_english}\n`;

          // ✨ Informasi Utama
          caption += `📘 *Type*: ${top.type}\n`;
          caption += `📖 *Volumes*: ${top.volumes} | 📄 Chapters: ${top.chapters}\n`;
          caption += `📈 *Status*: ${top.status}\n`;
          caption += `🗓️ *Published*: ${top.releaseFrom} ～ ${top.releaseTo}\n`;

          // ✨ Statistik
          caption += `⭐ *Score*: ${top.score} | 🔢 Rank: ${top.rank}\n`;
          caption += `🔥 *Popularity*: ${top.popularity} | 💖 Favorites: ${top.favorites}\n`;

          // ✨ Genre & Author
          caption += `🎭 *Genres*: ${top.genres.join(", ") || "不明"}\n`;
          caption += `✍️ *Author(s)*: ${top.authors.join(", ") || "Unknown"}\n\n`;

          // ✨ Sinopsis
          caption += `💬 *あらすじ*:\n${top.synopsis.slice(0, 600)}...\n\n`;

          // ✨ Tambahan info 2 hasil berikutnya
          caption += `──────────────────────\n`;

          for (const [i, result] of results.slice(1, 3).entries()) {
            caption += `🌸 *${i + 2}. ${result.title_default}*\n`;
            caption += `📘 ${result.type} | ⭐ ${result.score} | 📖 ${result.volumes}巻\n`;
            caption += `🗓️ ${result.releaseFrom} ～ ${result.releaseTo}\n`;
            caption += `🎭 ${result.genres.join(", ") || "不明"}\n`;
            caption += `💬 ${result.synopsis.slice(0, 200)}...\n\n`;
          }

          caption += "📚 他にも読みたい？また教えてねっ〜 ✨\n";
          caption += "🍵 Powered by *Kaede かえでちゃん*";

          await sock.sendMessage(
            m.chat,
            {
              text: caption,
              contextInfo: {
                externalAdReply: {
                  title: top.title_default,
                  body: "かえで図書館 - Manga Info",
                  mediaType: 1,
                  renderLargerThumbnail: false,
                  thumbnailUrl: top.image,
                  sourceUrl: top.url
                }
              }
            },
            { quoted: m }
          );
        }
        break;
      case "swaifu":
        {
          if (!text) return reply("⚠️ キャラクターの名前を入力してください。\n例: .swaifu マキマ");
          const res = await gacha.swaifu(text);
          if (!res.success) return react("❌");
          const caption =
            `🌸 *@${m.sender.split("@")[0]} さん、こちらがワイフの情報です！*\n\n` +
            `🆔 *名前:* ${res.name.native || res.name.full}\n` +
            (res.name.full && res.name.native !== res.name.full ? `🔤 *ローマ字:* ${res.name.full}\n` : "") +
            `♀️ *性別:* ${res.gender === "Male" ? "男性" : res.gender === "Female" ? "女性" : "不明"}\n` +
            `🎂 *誕生日:* ${res.birthDate}\n` +
            `💖 *人気:* ${res.favourites}人のお気に入り\n` +
            `🎬 *関連作品:*\n${res.relatedMedia.map(m => `・${m.title}（${m.type === "ANIME" ? "アニメ" : "マンガ"}）`).join("\n")}\n\n` +
            `📝 *説明:*\n${res.description}\n\n` +
            `🔗 *リンク:* ${res.siteUrl}`;

          await sock.sendMessage(
            m.chat,
            {
              text: caption,
              contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                  mediaType: 1,
                  title: res.name.full,
                  thumbnailUrl: res.image.medium || res.image.large
                }
              }
            },
            { quoted: m }
          );
        }
        break;
      case "hrevoke": {
        if (!text) return reply("🔖 削除したい文字の名前を入力します。例：.hrevoke Makima");
        const name = text.trim();
        const result = gacha.revokeWaifu(sender, name);
        const message = result.status ? result.message : result.message;
        reply(message);
        break;
      }
      //Leveling
      case "limit":
      case "profile":
        {
          const user = await MONGO.getUser(sender);
          const users = await USER.getUser(sender);
          const haremCount = user.waifuCollection;
          const dummyUser = {
            username: user.username,
            id: user._id,
            level: users.level,
            exp: await FUNC.formatNumber2(users.exp),
            requiredExp: await FUNC.formatNumber2(required),
            haremCount: haremCount.length,
            limit: userdb.limit,
            limitMax: 50,
            tickets: isPremium ? 5 : 1,
            rerollTickets: user.tickets,
            gachaCount: user.gachaCount,
            isPremium: isPremium,
            premiumUntil: user.premiumUntil,
            lastGacha: user.lastGacha,
            registeredAt: user.createdAt
          };

          const profileText = FUNC.generateUserProfile(dummyUser);
          sock.sendMessage(
            m.chat,
            {
              text: profileText,
              contextInfo: {
                externalAdReply: {
                  title: pushname + "プロファイル",
                  thumbnailUrl: ppuser,
                  renderLargerThumbnail: false
                }
              }
            },
            { quoted: m }
          );
        }
        break;
      case "level":
      case "rank": {
        if (!user) return react("❌");
        const Ranking = await USER.getUserRank(sender);
        let teks = "";
        teks += "╭━━━「🧬 *ステータス* 」━━━\n";
        teks += `┃ 🆙 レベル     : ${user.level}\n`;
        teks += `┃ ⭐ 経験値     : ${FUNC.formatNumber2(user.exp)}/${FUNC.formatNumber2(required)}\n`;
        teks += `┃ 🏅 ランク     : トップ #${Ranking?.rank || "?"}\n`;
        teks += `┃ 📈 次のランク : ${user.nextRank || "-"}\n`;
        teks += "┃ 📊 進行状況：\n";
        teks += `┃ ${progressBar}\n`;
        teks += "┃\n";
        teks += "┃ 🔝 .toplevel でランキング表示\n";
        teks += "┃ 🗡️ 力を試してみよう！\n";
        teks += "╰━━━━━━━━━━━━━━━━";
        reply(teks);
        break;
      }
      case "toprank":
      case "toplevel": {
        const top = await USER.topUsersLevel(5);
        if (!top.length) {
          await sendType("⚠️ データが見つかりませんでした。");
          return;
        }
        const Ranking = await USER.getUserRank(sender);

        let teks = `*🏆 トップレベルランキング！*\n`;
        teks += `「⚔️ レベルで最強の戦士たち」\n\n`;

        for (const user of top) {
          teks += `✨ *${user.rank}. ${user.name}*\n`;
          teks += `├ 📈 レベル: ${user.level}\n`;
          teks += `├ 🏅 称号: ${user.title}\n`;
          teks += `└ 💠 経験値: ${FUNC.formatNumber2(user.exp)}\n\n`;
        }

        teks += `━━━━━━━━━━━━━━\n`;
        teks += `あなたは *#${Ranking?.rank || "?"}* にいます\n`;
        teks += `📅 更新: ${new Date().toLocaleDateString("ja-JP")} 🇯🇵`;

        await reply2(teks);
        break;
      }
      case "addcode": {
        if (!isOwner) return;
        const [code, rewardType, rawValue, maxUses, expiresIn] = args;

        if (!code || !rewardType || !rawValue) {
          return reply(`Incorrect format!\nExample: ${prefix}addcode EXPX5 exp 5 10 3d`);
        }

        let reward;
        if (rewardType === "exp") {
          const multiplier = Number(rawValue);
          if (isNaN(multiplier) || multiplier <= 1) {
            return reply("❌ The multiplier value must be a number ≥ 2, for example: 2, 3, 5, etc.");
          }

          reward = {
            type: "exp_multiplier",
            value: {
              value: multiplier,
              duration: expiresIn || "1d"
            }
          };
        } else {
          reward = {
            type: rewardType,
            value: isNaN(rawValue) ? rawValue : Number(rawValue)
          };
        }

        const res = await REEDEM.createCustomCode(code, reward.type, reward.value, Number(maxUses) || 1, expiresIn || null);
        return reply(res.message);
      }
      case "redeem":
        {
          const codeInput = text;
          if (!codeInput) return reply(example("PREMIUM30"));
          const res = await REEDEM.redeemCode(sender, codeInput);
          return reply(res.message);
        }
        break;
      case "listcode":
        {
          if (!isCreator) return;
          const result = await REEDEM.listAllCodes();
          return reply(result);
        }
        break;
      case "afk":
        {
          let user = global.db.data.users[m.sender];
          user.afkTime = +FUNC.getJapanDate();
          user.afkReason = text;
          sock.sendMessage(
            m.chat,
            {
              text: `${m.pushName} *AFKになった* ${text ? ": " + text : ""}`
            },
            { quoted: fsaluran }
          );
        }
        break;
      case "menu":
        {
          const users = await MONGO.getUser(sender);
          const Ranking = await USER.getUserRank(sender);
          let awal =
            `╭───〔 *👤 ユーザー情報* 〕\n` +
            `│ 🏷️ *名前*     : *${pushname}*\n` +
            `│ 👤 *状態*     : ${isCreator ? "👑 作成者" : isPremium ? "💸 プレミアム" : "🌟 フリープラン"}\n` +
            `│ 🆙 *レベル*   : ${user.level}\n` +
            `│ ⭐ *経験値*   : ${FUNC.formatNumber2(user.exp)} / ${FUNC.formatNumber2(required)}\n` +
            `│ 🏅 *ランク*   : ${user.rank}\n` +
            `│ 🔝 ランク     : トップ #${Ranking?.rank || "?"}\n` +
            `│ \n` +
            `│ 📊 *進行バー* \n` +
            `│ ${progressBar}\n` +
            `│ \n` +
            `│ 🎯 *残りリミット* : ${isPremium ? "∞ 無制限" : `${50 - userdb.limit}/50`}\n` +
            `│ 👩‍❤️‍👩 *ハーレム数* : ${users.waifuCollection?.length || 0} ワイフ\n` +
            `│ 🎟️ *リロール券* : ${users.tickets || 0}\n` +
            `╰──────────────•\n` +
            `${readmore}`;
          //reply2(awal + global.menu);
          const menuMap = {
            search: global.menuSearch, //
            ai: global.menuAI, //
            dl: global.menuDownload, //
            tools: global.menuTools, //
            group: global.menuGroup, //
            game: global.menuGames, //
            harem: global.menuHarem, //
            maker: global.menuMaker,
            etc: global.menuEtc,
            owner: global.menuOwner,
            all: global.menu
          };

          if (menuMap[text]) {
            reply2(awal + menuMap[text]);
          }
          if (!text) {
            reply2(awal + global.menu);
          }
        }
        break;
      case "tts":
      case "tts2":
        {
          const models = {
            miku: {
              voice_id: "67aee909-5d4b-11ee-a861-00163e2ac61b",
              voice_name: "Hatsune Miku"
            },
            nahida: {
              voice_id: "67ae0979-5d4b-11ee-a861-00163e2ac61b",
              voice_name: "Nahida"
            },
            nami: {
              voice_id: "67ad95a0-5d4b-11ee-a861-00163e2ac61b",
              voice_name: "Nami"
            },
            ana: {
              voice_id: "f2ec72cc-110c-11ef-811c-00163e0255ec",
              voice_name: "Ana"
            },
            optimus_prime: {
              voice_id: "67ae0f40-5d4b-11ee-a861-00163e2ac61b",
              voice_name: "Optimus Prime"
            },
            goku: {
              voice_id: "67aed50c-5d4b-11ee-a861-00163e2ac61b",
              voice_name: "Goku"
            },
            taylor_swift: {
              voice_id: "67ae4751-5d4b-11ee-a861-00163e2ac61b",
              voice_name: "Taylor Swift"
            },
            elon_musk: {
              voice_id: "67ada61f-5d4b-11ee-a861-00163e2ac61b",
              voice_name: "Elon Musk"
            },
            mickey_mouse: {
              voice_id: "67ae7d37-5d4b-11ee-a861-00163e2ac61b",
              voice_name: "Mickey Mouse"
            },
            kendrick_lamar: {
              voice_id: "67add638-5d4b-11ee-a861-00163e2ac61b",
              voice_name: "Kendrick Lamar"
            },
            angela_adkinsh: {
              voice_id: "d23f2adb-5d1b-11ee-a861-00163e2ac61b",
              voice_name: "Angela Adkinsh"
            },
            eminem: {
              voice_id: "c82964b9-d093-11ee-bfb7-e86f38d7ec1a",
              voice_name: "Eminem"
            }
          };

          const userAgents = ["Mozilla/5.0 (Windows NT 10.0; Win64; x64)", "Mozilla/5.0 (Macintosh; Intel Mac OS X)", "Mozilla/5.0 (Linux; Android 8.0.0)"];

          function getRandomIp() {
            return Array.from({ length: 4 })
              .map(() => Math.floor(Math.random() * 256))
              .join(".");
          }

          async function generateTTS(text, model) {
            if (!models[model]) throw `❌ モデル "${model}" が見つかりません。\n\n利用可能なモデル:\n` + Object.keys(models).join(", ");

            const agent = userAgents[Math.floor(Math.random() * userAgents.length)];
            const { voice_id, voice_name } = models[model];

            const payload = {
              raw_text: text,
              url: "https://filme.imyfone.com/text-to-speech/anime-text-to-speech/",
              product_id: "200054",
              convert_data: [
                {
                  voice_id,
                  speed: "1",
                  volume: "50",
                  text,
                  pos: 0
                }
              ]
            };

            const config = {
              headers: {
                "Content-Type": "application/json",
                Accept: "*/*",
                "X-Forwarded-For": getRandomIp(),
                "User-Agent": agent
              }
            };

            const res = await axios.post("https://voxbox-tts-api.imyfone.com/pc/v1/voice/tts", payload, config);
            const result = res.data?.data?.convert_result?.[0];

            return {
              audio: result?.oss_url,
              voice_name
            };
          }

          const handler = async (m, { text, sock, command }) => {
            if (!text || !text.includes("|")) {
              let listMsg = "";
              listMsg += "⌬┄┄┄┄┄┄ モデル一覧 ┄┄┄┄┄┄⌬\n\n";
              listMsg += "• *miku* - Hatsune Miku 🌀\n";
              listMsg += "• *nahida* - Nahida (Exclusive) 🌿\n";
              listMsg += "• *nami* - One Piece 🌊\n";
              listMsg += "• *ana* - Ana (女性ボイス) 🎙️\n";
              listMsg += "• *optimus_prime* - Optimus Prime 🤖\n";
              listMsg += "• *goku* - Goku (Dragon Ball) 🟠\n";
              listMsg += "• *taylor_swift* - Taylor Swift 🎤\n";
              listMsg += "• *elon_musk* - Elon Musk 🧠\n";
              listMsg += "• *mickey_mouse* - Mickey Mouse 🐭\n";
              listMsg += "• *kendrick_lamar* - Kendrick Lamar 🎶\n";
              listMsg += "• *angela_adkinsh* - Angela Adkinsh 👩‍💼\n";
              listMsg += "• *eminem* - Eminem 🎧\n\n";
              listMsg += "使用形式:\n";
              listMsg += "*." + command + " テキスト|model*\n\n";
              listMsg += "例:\n";
              listMsg += "*." + command + " こんにちは世界|miku*";

              return sock.sendMessage(m.key.remoteJid, { text: listMsg }, { quoted: m });
            }

            let [isi, model] = text.split("|").map(v => v.trim().toLowerCase());
            if (!isi || !model) {
              return sock.sendMessage(
                m.key.remoteJid,
                {
                  text: `❌ フォーマットが正しくありません: .${command} テキスト|model\n\n利用可能なモデル:\n` + Object.keys(models).join(", ")
                },
                { quoted: m }
              );
            }

            const loading = await sock.sendMessage(m.key.remoteJid, { text: "⏳ 音声を生成中です..." }, { quoted: m });

            try {
              const result = await generateTTS(isi, model);
              await sock.sendMessage(
                m.key.remoteJid,
                {
                  audio: { url: result.audio },
                  mimetype: "audio/mpeg",
                  ptt: true
                },
                { quoted: m }
              );
            } catch (e) {
              await sock.sendMessage(
                m.key.remoteJid,
                {
                  text: `❌ エラーが発生しました。\nエラーログ: ${e.message || e}`
                },
                { quoted: m }
              );
            } finally {
              if (loading.key) {
                await sock.sendMessage(m.key.remoteJid, {
                  delete: loading.key
                });
              }
            }
          };

          await handler(m, { text: args.join(" "), sock, command });
        }
        break;
      case "jpdates":
      case "harijapan":
      case "holidays":
        {
          const todayYear = new Date().getFullYear();
          const holidays = await SCR.getJapaneseHolidays(todayYear);
          if (!holidays.length) return reply("💢 Sorry, I couldn't fetch Japanese holidays!");

          let text = `🎌 *Kaede’s Japan Holiday Calendar (${todayYear})* 🎌\n\n`;

          for (const { date, name } of holidays) {
            text += `📅 *${date}* — *${name}*\n`;
          }
          text += `\n✨ Want more cultural charm? Ask me! 🍵`;

          await sock.sendMessage(
            m.chat,
            {
              text,
              contextInfo: {
                externalAdReply: {
                  title: `Japanese Holidays ${todayYear}`,
                  body: "Discover Japanese culture with Kaede~",
                  mediaType: 1,
                  renderLargerThumbnail: false,
                  thumbnailUrl: global.thumb,
                  sourceUrl: global.saweria
                }
              }
            },
            { quoted: m }
          );
        }
        break;

      case "say":
        {
          if (!text) return example("hi");
          function getRandomIp() {
            return Array.from({ length: 4 })
              .map(() => Math.floor(Math.random() * 256))
              .join(".");
          }
          async function generateTTS(text) {
            const userAgents = ["Mozilla/5.0 (Windows NT 10.0; Win64; x64)", "Mozilla/5.0 (Macintosh; Intel Mac OS X)", "Mozilla/5.0 (Linux; Android 8.0.0)"];
            const agent = userAgents[Math.floor(Math.random() * userAgents.length)];
            const payload = {
              raw_text: text,
              url: "https://filme.imyfone.com/text-to-speech/anime-text-to-speech/",
              product_id: "200054",
              convert_data: [
                {
                  voice_id: "67ae0979-5d4b-11ee-a861-00163e2ac61b",
                  speed: "1",
                  volume: "50",
                  text,
                  pos: 0
                }
              ]
            };

            const config = {
              headers: {
                "Content-Type": "application/json",
                Accept: "*/*",
                "X-Forwarded-For": getRandomIp(),
                "User-Agent": agent
              }
            };
            const res = await axios.post("https://voxbox-tts-api.imyfone.com/pc/v1/voice/tts", payload, config);
            const result = res.data?.data?.convert_result?.[0];

            return {
              audio: result?.oss_url,
              voice_name: "Nahida"
            };
          }

          try {
            const result = await generateTTS(text);
            await sock.sendMessage(
              m.key.remoteJid,
              {
                audio: { url: result.audio },
                mimetype: "audio/mpeg",
                ptt: true
              },
              { quoted: m }
            );
          } catch (e) {
            await reply("❌ エラーが発生しました。\nエラーログ");
          }
        }
        break;
      case "ownermenu":
        {
          if (!isCreator) return;
          let awal = `╭───〔 👤 *ユーザー情報* 〕\n│ • 名前   : *${pushname}*\n│ • ステータス : ${isCreator ? "👑 開発者 (Creator)" : isPremium ? "💸 プレミアム" : "🌟 フリープラン"}\n╰──────────────•\n${readmore}\n`;
          reply2(awal + global.menuOwner);
        }
        break;
      case "readchange":
      case "autoread":
        {
          if (!isCreator) return;
          if (args.length < 1) return reply(example("off"));
          if (text === "on") {
            global.db.data.settings.autoread = true;
            reply(`自動読み取りを ${text} に変更しました`);
          } else if (text === "off") {
            global.db.data.settings.autoread = false;
            reply(`自動読み取りを ${text} に変更しました`);
          }
        }
        break;
      case "backup":
        {
          if (!isOwner) return reply(mess.owner);
          const { execSync } = require("child_process");
          const ls = fs.readdirSync(".").filter(item => item !== "node_modules" && item !== "package-lock.json" && item !== "yarn.lock" && item !== "tmp" && item !== "backup.zip");
          const zipCommand = process.platform === "win32" ? `powershell Compress-Archive -Path ${ls.join(",")} -DestinationPath backup.zip` : `zip -r backup.zip ${ls.join(" ")}`;
          try {
            execSync(zipCommand);
            await sock.sendMessage(
              global.owner + "@s.whatsapp.net",
              {
                document: fs.readFileSync("./backup.zip"),
                mimetype: "application/zip",
                fileName: "backup.zip"
              },
              { quoted: m }
            );
            await react("✅");
            fs.unlinkSync("./backup.zip");
          } catch (err) {
            console.error(err);
            reply("❌ Failed to create or send backup.");
          }
        }
        break;
      case "getsession":
        {
          if (!isCreator) return;
          let sesi = fs.readFileSync("./session/creds.json");
          sock.sendMessage(
            m.chat,
            {
              document: sesi,
              mimetype: "application/json",
              fileName: "creds.json"
            },
            {
              quoted: fkontak
            }
          );
        }
        break;
      case "restart":
        if (!isCreator) return;
        react("✅");
        await FUNC.sleep(3000);
        process.exit();
        break;
      case "mode":
        {
          if (!isOwner) return;
          const validModes = {
            public: "Bot is available for everyone.",
            self: "Bot is restricted to the owner only.",
            onlypremium: "Only premium users can use the bot.",
            alluser: "All users can access the bot.",
            maintenance: "Bot is under maintenance."
          };
          const setting = global.db.data.settings;
          if (!args[0]) {
            const currentModes = [`🔁 Public: ${setting.public ? "✅" : "❌"}`, `⭐ Only Premium: ${setting.onlyprem ? "✅" : "❌"}`, `⚙ Maintenance: ${setting.maintenance ? "✅" : "❌"}`].join("\n");
            return reply(
              `📌 Current Bot Modes:\n${currentModes}\n\n🛠 Use: ${Object.keys(validModes)
                .map(v => `"mode ${v}"`)
                .join(" | ")}`
            );
          }
          const mode = args[0].toLowerCase();
          if (!(mode in validModes)) {
            return reply(`❌ Invalid mode.\n\n✅ Available modes:\n${Object.keys(validModes).join(", ")}`);
          }
          // Mode toggling logic
          switch (mode) {
            case "public":
              setting.public = true;
              reply("✅ Bot is now in **Public** mode. Everyone can use it.");
              break;
            case "self":
              setting.public = false;
              reply("🔒 Bot is now in **Self** mode. Only the owner can use it.");
              break;
            case "onlypremium":
              setting.onlyprem = !setting.onlyprem;
              reply(`⭐ Only Premium mode is now: ${setting.onlyprem ? "✅" : "❌"}`);
              break;
            case "alluser":
              setting.onlyprem = false;
              reply("🌐 Bot is now open to **All Users**.");
              break;
            case "maintenance":
              setting.maintenance = !setting.maintenance;
              reply(`⚙ Maintenance mode is now: ${setting.maintenance ? "✅" : "❌"}`);
              break;
            default:
              reply("❌ Unable to process this mode.");
              break;
          }
        }
        break;
      case "block":
        if (!isCreator) return;
        if (isGroup) {
          let users = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
          if (users) {
            await sock.updateBlockStatus(users, "block");
            reply(`成功`);
          } else {
            reply("メッセージに返信するか、タグを付けるか、ブロックしたい番号を入力してください。");
          }
        } else if (!isGroup) {
          if (q) {
            var woke = q.replace(new RegExp("[()+-/ +/]", "gi"), "") + `@s.whatsapp.net`;
            await sock.updateBlockStatus(woke, "block");
          } else if (!q) {
            reply("ブロックしたい番号を入力してください");
          }
          reply(`ユーザー ${woke.split("@")[0]} をブロックしました`);
        }
        break;
      case "unblock":
        if (!isCreator) return;
        let users = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        if (isGroup) {
          if (users) {
            await sock.updateBlockStatus(users, "unblock");
            await m.reply(`成功`);
          } else if (!q) {
            m.reply("メッセージに返信するか、タグを付けるか、ブロックしたい番号を入力してください。");
          }
        } else if (!isGroup) {
          if (text) {
            let woke = text.replace(new RegExp("[()+-/ +/]", "gi"), "") + `@s.whatsapp.net`;
            await sock.updateBlockStatus(woke, "unblock");
            reply(`成功`);
          } else if (!q) {
            reply("開きたい番号を入力してください");
          }
        }
        break;
      case "addprem":
        {
          if (!isCreator) return;
          if (!args[0]) return reply("番号？");
          if (!args[1]) return reply("何日ですか？");
          let blockwww = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : args[0] + "@s.whatsapp.net";
          await MONGO.setPremium(blockwww, args[1]).then(reply);
          let react = sock.sendMessage(m.chat, {
            react: { text: "✅", key: m.key }
          });
        }
        break;
      case "delprem":
        {
          if (!isCreator) return;
          if (!args[0]) return reply("番号？");
          let blockwww = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : args[0] + "@s.whatsapp.net";
          await MONGO.delPremium(blockwww);
        }
        break;
      case "ban":
        {
          if (!isCreator) return;
          if (!args[0]) return reply("番号？");
          if (!args[1]) return reply("何日ですか？");
          let blockwww = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : args[0] + "@s.whatsapp.net";
          await MONGO.banUser(blockwww, args[1]).then(reply);
        }
        break;
      case "unban":
        {
          if (!isCreator) return;
          if (!args[0]) return reply("番号？");
          if (!args[1]) return reply("何日ですか？");
          let blockwww = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : args[0] + "@s.whatsapp.net";
          await MONGO.unBan(blockwww, args[1]).then(reply);
        }
        break;
      case "listpremium":
      case "listprem":
        {
          if (!isCreator) return;
          const premiumUsers = await MONGO.findPremiumUsers();
          let text = "🌸*『 プレミアムユーザーリスト 』*🌸\n";
          text += "ここはプレミアムな仲間たちの一覧だよ〜 ✨\n\n";
          let count = 0;
          for (let user of premiumUsers) {
            const username = user.username?.trim() || "（未設定）";
            const phone = user.phone_number?.split("@")[0] || "不明";
            const expDate = moment(user.premiumUntil);
            const isValid = expDate.isValid();
            const formattedDate = isValid ? expDate.tz("Asia/Tokyo").format("YYYY/MM/DD HH:mm:ss") : "無効な日付";
            text += `🎀 *${++count}.*\n`;
            text += `📱 *電話番号* : ${phone}\n`;
            text += `🧸 *ユーザー名* : ${username}\n`;
            text += `🗓️ *有効期限* : ${formattedDate}\n\n`;
          }
          text += `🍵 合計プレミアムユーザー : *${premiumUsers.length} 人*\n`;
          text += "ありがとう〜💕";
          reply2(text.trim());
        }
        break;
      case "getcase":
        {
          if (!isCreator) return;
          if (!args[0]) return reply(example("menu"));
          const getCase = caseName => {
            try {
              const fileContent = fs.readFileSync("./system.js", "utf-8");
              const caseBlock = fileContent.split(`case "${caseName}"`)[1];
              if (!caseBlock) return `ケース '${caseName}' が見つかりません。`;
              const caseEnd = caseBlock.split("break")[0];
              return `case '${caseName}'${caseEnd}break`;
            } catch (error) {
              console.error("ファイルの読み取りエラー:", error);
              return "ケースの取得中にエラーが発生しました。";
            }
          };
          reply(getCase(args[0]));
        }
        break;
      case "ipwho":
        {
          if (!text) return reply(example("130.54.130.237"));
          try {
            const res = await fetch(`https://ipwho.is/${text}`).then(res => res.json());
            if (!res.success) throw new Error(`❌ IPアドレス「${text}」が見つかりませんでした。`);
            await sock.sendMessage(
              m.chat,
              {
                location: {
                  degreesLatitude: res.latitude,
                  degreesLongitude: res.longitude
                }
              },
              { ephemeralExpiration: 604800 }
            );
            await new Promise(resolve => setTimeout(resolve, 2000));
            let infoText = "";
            infoText += "📡 *IPアドレス情報* 🌐\n\n";
            infoText += "🗂️ *基本情報*\n";
            infoText += "• IPアドレス       : " + (res.ip || "N/A") + "\n";
            infoText += "• 成功              : " + (res.success ? "はい ✅" : "いいえ ❌") + "\n";
            infoText += "• タイプ            : " + (res.type || "N/A") + "\n";
            infoText += "• 大陸              : " + (res.continent || "N/A") + " (" + (res.continent_code || "N/A") + ")\n";
            infoText += "• 国名              : " + (res.country || "N/A") + " (" + (res.country_code || "N/A") + ")\n";
            infoText += "• 地域              : " + (res.region || "N/A") + " (" + (res.region_code || "N/A") + ")\n";
            infoText += "• 都市              : " + (res.city || "N/A") + "\n";
            infoText += "• 緯度 / 経度       : " + (res.latitude || "N/A") + " / " + (res.longitude || "N/A") + "\n";
            infoText += "• EU加盟           : " + (res.is_eu ? "はい 🇪🇺" : "いいえ") + "\n";
            infoText += "• 郵便番号         : " + (res.postal || "N/A") + "\n";
            infoText += "• 国番号           : +" + (res.calling_code || "N/A") + "\n";
            infoText += "• 首都              : " + (res.capital || "N/A") + "\n";
            infoText += "• 隣接国            : " + (res.borders || "N/A") + "\n\n";
            infoText += "🏳️ *国旗*\n";
            infoText += "• 絵文字            : " + (res.flag?.emoji || "N/A") + "\n";
            infoText += "• Unicode         : " + (res.flag?.emoji_unicode || "N/A") + "\n";
            infoText += "• 画像リンク       : " + (res.flag?.img || "N/A") + "\n\n";
            infoText += "🔌 *接続情報*\n";
            infoText += "• ASN               : " + (res.connection?.asn || "N/A") + "\n";
            infoText += "• 組織              : " + (res.connection?.org || "N/A") + "\n";
            infoText += "• ISP              : " + (res.connection?.isp || "N/A") + "\n";
            infoText += "• ドメイン           : " + (res.connection?.domain || "N/A") + "\n\n";
            infoText += "🕒 *タイムゾーン*\n";
            infoText += "• ID                : " + (res.timezone?.id || "N/A") + "\n";
            infoText += "• 略称              : " + (res.timezone?.abbr || "N/A") + "\n";
            infoText += "• 夏時間            : " + (res.timezone?.is_dst ? "はい ☀️" : "いいえ") + "\n";
            infoText += "• オフセット         : " + (res.timezone?.offset || "N/A") + "\n";
            infoText += "• UTC              : " + (res.timezone?.utc || "N/A") + "\n";
            infoText += "• 現在時刻          : " + (res.timezone?.current_time || "N/A") + "\n";
            m.reply(infoText);
          } catch (e) {
            m.reply("⚠️ エラー: IPアドレス「" + text + "」の情報を取得できませんでした。");
          }
        }
        break;
      case "rvo":
      case "readviewonce":
        {
          const qt = m.quoted ? m.quoted : m;
          const mime = (qt.message || qt).mimetype || "";
          const isViewOnce = qt.viewOnce || (qt.message && qt.message.viewOnce);

          if (/video/.test(mime)) {
            const media = await qt.download();
            return await sock.sendMessage(
              m.chat,
              {
                video: media
              },
              { quoted: m }
            );
          } else if (/image/.test(mime)) {
            const media = await qt.download();
            return await sock.sendMessage(
              m.chat,
              {
                image: media
              },
              { quoted: m }
            );
          } else if (/audio/.test(mime)) {
            const media = await qt.download();
            return await sock.sendMessage(
              m.chat,
              {
                audio: media
              },
              { quoted: m }
            );
          } else if (!isViewOnce) {
            return reply("Hanya untuk pesan view once.");
          }
        }
        break;
      case "gpt4":
      case "ai":
        {
          if (!(await useLimit(m.sender, isPremium, 1))) return reply(msg.endLimit);
          if (!text) return m.reply(`はい、どういったご用でしょうか？`);
          await groq.chat.completions
            .create({
              messages: [
                {
                  role: "user",
                  content: text
                }
              ],
              model: "llama-3.3-70b-versatile"
            })
            .then(chatCompletion => {
              sendType(chatCompletion.choices[0]?.message?.content || "");
            });
        }
        break;
      case "deepsek":
      case "deepseek":
        {
          if (!text) return m.reply(`はい、どういったご用でしょうか？`);
          let a = await (await fetch(`https://www.laurine.site/api/ai/deepseek?query=${text}`)).json();
          reply(a.data);
        }
        break;
      case "luminai":
        {
          if (!text) return m.reply(`はい、どういったご用でしょうか？`);
          let a = await (await fetch(`https://www.laurine.site/api/ai/luminai?query=${text}`)).json();
          reply(a.data);
        }
        break;
      case "gpt":
        {
          if (!text) return m.reply(`はい、どういったご用でしょうか？`);
          let a = await (await fetch(`https://www.laurine.site/api/ai/gptonline?query=${text}`)).json();
          reply(a.data);
        }
        break;
      case "deepai":
        {
          if (!text) return m.reply(`はい、どういったご用でしょうか？`);
          let a = await (await fetch(`https://www.laurine.site/api/ai/deepai?query=${text}`)).json();
          reply(a.data);
        }
        break;
      case "artai":
      case "kivotos":
      case "animage":
        {
          if (!isPremium) return;
          if (!text) return reply(example("A cute anime girl with glasses"));
          const imagine = `https://www.abella.icu/art-ai?q=${text}`;
          await sock.sendMessage(m.chat, { image: { url: imagine }, caption: text }, { quoted: m });
        }
        break;
      case "deepimg":
        {
          if (!text) return reply(example("girl wearing glasses|anime"));
          let [prompt, style] = text.split(`|`);
          if (!style) style = "anime";
          const { deepimg } = require("./all/scrape/Scrape.js");
          const resp = await deepimg(prompt, {
            style: style,
            size: "3:2"
          });
          sock.sendMessage(m.chat, { image: { url: resp }, caption: prompt }, { quoted: m });
        }
        break;
      case "qc":
        {
          if (!m.quoted && !text) return reply(example("hi"));
          const { quote } = require("./all/scrape/quote.js");
          let quoted = m.quoted;
          let teksnya = quoted ? quoted.text : text;
          let pengirim = quoted ? quoted.sender : m.sender;
          let namanya = quoted ? await sock.getName(pengirim) : pushname;
          let ppnyauser = await sock.profilePictureUrl(pengirim, "image").catch(() => "https://telegra.ph/file/6880771a42bad09dd6087.jpg");
          let { result } = await quote(teksnya, namanya, ppnyauser);
          sock.sendImageAsSticker(from, result, m, {
            packname: global.packname,
            author: global.author
          });
        }
        break;
      case "stickergif":
      case "sticker":
      case "stiker":
      case "sgif":
      case "s":
        {
          if (/image/.test(mime)) {
            if (!(await useLimit(m.sender, isPremium, 1))) return reply(msg.endLimit);
            let media = await quoted.download();
            let encmedia = await sock.sendImageAsSticker(from, media, m, {
              packname: global.packname,
              author: global.author
            });
            await fs.unlinkSync(encmedia);
          } else if (/video/.test(mime)) {
            if (!(await useLimit(m.sender, isPremium, 1))) return reply(msg.endLimit);
            if ((quoted.msg || quoted).seconds > 11) return reply("詳細は最大10件まで！");
            let media = await quoted.download();
            let encmedia = await sock.sendVideoAsSticker(from, media, m, {
              packname: global.packname,
              author: global.author
            });
            await fs.unlinkSync(encmedia);
          } else {
            reply(`キャプション付きの画像/ビデオを送信 ${prefix + command}\nビデオの長さ 1～9 秒`);
          }
        }
        break;
      case "brat":
        {
          if (!text) return reply(example("hi"));
          if (!(await useLimit(m.sender, isPremium, 1))) return reply(msg.endLimit);
          let encmedia = await sock.sendImageAsSticker(from, `https://api.siputzx.my.id/api/m/brat?text=${text}`, m, {
            packname: global.packname,
            author: global.author
          });
        }
        break;
      case "smeme":
      case "stickmeme":
      case "stikmeme":
      case "stickermeme":
      case "stikermeme":
        {
          let { TelegraPh } = require("./all/scrape/uploader.js");
          let [atas, bawah] = text.split`|`;
          let q = m.quoted ? m.quoted : m;
          let mime = (q.msg || q).mimetype || "";
          if (!mime) return reply(example(`${atas ? atas : "upper"}>|<${bawah ? bawah : "downer"}`));
          if (!/image\/(jpe?g|png)/.test(mime)) return reply(`_*${mime} はサポートされていません*_`);
          if (!(await useLimit(m.sender, isPremium, 1))) return reply(msg.endLimit);
          let img = await q.download();
          let url = await TelegraPh(img);
          let meme = `https://api.memegen.link/images/custom/${encodeURIComponent(atas ? atas : "")}/${encodeURIComponent(bawah ? bawah : "")}.png?background=${url}`;
          sock.sendImageAsSticker(m.chat, meme, m, {
            packname: global.packname,
            author: global.author
          });
        }
        break;
      case "wm":
      case "swm":
        {
          let [teks1, teks2] = text.split`|`;
          if (!teks1) return reply(example("hi|loser"));
          if (!teks2) return reply(`キャプション付きの画像/ビデオを送信/返信する ${prefix + command} text1|text2`);
          let teksbwh = teks2 + `\nDate: ${moment.tz("Asia/Tokyo").format("DD/MM/YY")}\nBot: 0823-3422-6291`;
          if (/image/.test(mime)) {
            if (!(await useLimit(m.sender, isPremium, 1))) return reply(msg.endLimit);
            let media = await sock.downloadMediaMessage(qmsg);
            let encmedia = await sock.sendImageAsSticker(m?.chat, media, m, {
              packname: teks1,
              author: teksbwh
            });
            if (encmedia && encmedia.filePath) {
              await fs.unlinkSync(encmedia.filePath);
            }
          } else if (/video/.test(mime)) {
            if (!(await useLimit(m.sender, isPremium, 1))) return reply(msg.endLimit);
            if ((quoted.msg || quoted).seconds > 9) return reply("Maksimal 9 detik!");
            let media = await quoted.download();
            let encmedia = await sock.sendVideoAsSticker(from, media, m, {
              packname: global.packname,
              author: global.author
            });
            if (encmedia && encmedia.filePath) {
              await fs.unlinkSync(encmedia.filePath);
            }
          } else {
            return reply(`キャプション付きの画像/ビデオを送信 ${prefix + command}\nビデオの長さ 1～9 秒`);
          }
        }
        break;
      case "get":
        {
          if (!text) return m.reply(example("https://google.com"));
          try {
            const gt = await axios.get(text, {
              headers: {
                "Access-Control-Allow-Origin": "*",
                Referer: "https://www.google.com/",
                "Referrer-Policy": "strict-origin-when-cross-origin",
                "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
              },
              responseType: "arraybuffer"
            });
            const contentType = gt.headers["content-type"];
            console.log(`Content-Type: ${contentType}`);
            if (/json/i.test(contentType)) {
              const jsonData = JSON.parse(Buffer.from(gt.data, "binary").toString("utf8"));
              return m.reply(JSON.stringify(jsonData, null, 2));
            } else if (/text/i.test(contentType)) {
              const textData = Buffer.from(gt.data, "binary").toString("utf8");
              return m.reply(textData);
            } else if (text.includes("webp")) {
              return sock.sendMessage(
                m.chat,
                {
                  sticker: { url: text },
                  contextInfo: {
                    externalAdReply: {
                      mediaType: 1,
                      title: `Hi ${pushname}`,
                      thumbnailUrl: thumb
                    }
                  }
                },
                { quoted: fkontak }
              );
            } else if (/image/i.test(contentType)) {
              return sock.sendMessage(
                m.chat,
                {
                  image: { url: text },
                  contextInfo: {
                    externalAdReply: {
                      mediaType: 2,
                      title: `Hi ${pushname}`,
                      thumbnailUrl: thumb
                    }
                  }
                },
                { quoted: fkontak }
              );
            } else if (/video/i.test(contentType)) {
              return sock.sendMessage(
                m.chat,
                {
                  video: { url: text },
                  contextInfo: {
                    externalAdReply: {
                      mediaType: 1,
                      title: `Hi ${pushname}`,
                      thumbnailUrl: thumb
                    }
                  }
                },
                { quoted: fkontak }
              );
            } else if (/audio/i.test(contentType) || text.includes(".mp3")) {
              return sock.sendMessage(
                m.chat,
                {
                  audio: { url: text },
                  contextInfo: {
                    externalAdReply: {
                      mediaType: 1,
                      title: `Hi ${pushname}`,
                      sourceUrl: "",
                      thumbnailUrl: thumb
                    }
                  }
                },
                { quoted: fkontak }
              );
            } else if (/application\/zip/i.test(contentType) || /application\/x-zip-compressed/i.test(contentType)) {
              return sock.sendMessage(
                m.chat,
                {
                  document: { url: text },
                  fileName: ``,
                  mimetype: text
                },
                { quoted: fkontak }
              );
            } else if (/application\/pdf/i.test(contentType)) {
              return sock.sendMessage(
                m.chat,
                {
                  document: { url: text },
                  fileName: ``,
                  mimetype: text
                },
                { quoted: fkontak }
              );
            } else {
              return m.reply(`MIME : ${contentType}\n\n${gt.data}`);
            }
          } catch (error) {
            console.error(`Terjadi kesalahan: ${error}`);
            return m.reply(`URLにアクセス中にエラーが発生しました`);
          }
        }
        break;
      case "hd":
      case "remini":
        {
          const mime = (quoted.msg || quoted).mimetype || "";
          if (!quoted) return reply(`キャプション付き写真を送信/返信 ${prefix + command}`);
          if (!/image/.test(mime)) return reply(`キャプション付き写真を送信/返信 ${prefix + command}`);
          let { TelegraPh } = require("./all/scrape/uploader.js");
          try {
            if (!(await useLimit(m.sender, isPremium, 5))) return reply(msg.endLimit);
            let buffer = await sock.downloadAndSaveMediaMessage(quoted);
            let upload = await TelegraPh(buffer);
            let response = await fetch(`https://jerofc.my.id/api/remini2?url=${upload}&apikey=h71nso`);
            let datas = await response.json();
            sock.sendMessage(
              m.chat,
              {
                image: {
                  url: datas.data.image
                },
                caption: "DONE"
              },
              {
                quoted: m
              }
            );
          } catch (e) {
            console.log(e);
            reply("EROR");
          }
        }
        break;
      case "ttstalk":
        {
          if (!text) return reply(example("rein4everrr"));
          try {
            let namaakun = text.trim().replace(/^@/, "");
            let json = await FUNC.fetchJson(`https://api.siputzx.my.id/api/stalk/tiktok?username=${namaakun}`);
            if (!json || json.status !== true || !json.data?.user) {
              return reply("データが見つからないか、API でエラーが発生しました。");
            }
            let user = json.data.user;
            let stats = json.data.stats;
            let caption = `⦿  *T I K T O K - ストーカー*\n\n`;
            caption += `👤 *ユーザー名* : ${user.uniqueId}\n`;
            caption += `📝 *ニックネーム* : ${user.nickname || "なし"}\n`;
            caption += `📄 *署名* : ${user.signature || "なし"}\n`;
            caption += `🌍 *地域* : ${user.region || "不明"}\n`;
            caption += `🔰 *認証済み* : ${user.verified ? "✅ はい" : "❌ いいえ"}\n`;
            caption += `🔐 *非公開アカウント* : ${user.privateAccount ? "はい" : "いいえ"}\n\n`;
            caption += `📊 *統計情報*\n`;
            caption += `❤️ *いいね数* : ${stats.heart.toLocaleString()}\n`;
            caption += `👥 *フォロワー* : ${stats.followerCount.toLocaleString()}\n`;
            caption += `➡️ *フォロー中* : ${stats.followingCount.toLocaleString()}\n`;
            caption += `🎞️ *投稿数* : ${stats.videoCount.toLocaleString()}\n`;
            caption += `👫 *友達数* : ${stats.friendCount.toLocaleString()}\n`;
            await sock.sendMessage(
              m.chat,
              {
                text: caption,
                contextInfo: {
                  isForwarded: false,
                  externalAdReply: {
                    title: user.uniqueId,
                    thumbnailUrl: user.avatarLarger,
                    mediaType: 1,
                    renderLargerThumbnail: false
                  }
                }
              },
              { quoted: fsaluran }
            );
          } catch (error) {
            console.error(error);
            reply("データの取得中にエラーが発生しました。ユーザー名が正しいか確認して、もう一度お試しください。");
          }
        }
        break;
      case "igstalk":
      case "igprofile": {
        if (!text) return reply(example("google"));
        try {
          await reply("🔄 Instagramプロフィールを取得中...");
          const res = await fetch(`https://api.vreden.my.id/api/igstalk?query=${text}`);
          const json = await res.json();
          if (!json.result) return reply("⚠️ プロフィールが見つかりませんでした。");
          const user = json.result.user;
          const caption = `📸 *Instagram プロフィール*
👤 *名前*: ${user.full_name}
🔖 *ユーザー名*: @${user.username}
📌 *カテゴリ*: ${user.category || "未分類"}
🔒 *プライベート*: ${user.is_private ? "はい" : "いいえ"}
✅ *認証済み*: ${user.is_verified ? "はい" : "いいえ"}
👥 *フォロワー*: ${user.follower_count.toLocaleString()} 人
➡️ *フォロー中*: ${user.following_count.toLocaleString()} 人
📝 *自己紹介*: ${user.biography || "なし"}
📷 *投稿数*: ${user.media_count} 件
🔗 *リンク*: ${user.external_url || "なし"}`;
          await sock.sendMessage(
            m.chat,
            {
              text: caption.trim(),
              contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                  title: user.full_name,
                  body: `Instagram ユーザー名: @${user.username}`,
                  thumbnailUrl: user.hd_profile_pic_url_info?.url || "",
                  mediaType: 1,
                  renderLargerThumbnail: false,
                  sourceUrl: `https://www.instagram.com/${user.username}`
                }
              }
            },
            { quoted: fkontak }
          );
        } catch (err) {
          console.error(err);
          reply("❌ エラーが発生しました。もう一度お試しください。");
        }
        break;
      }

      case "ghstalk":
        {
          if (!args[0]) return reply(example("IrhanRen"));
          try {
            let namaakun = args[0].replace(/^@/, "");
            let res = await fetch(`https://api.github.com/users/${namaakun}`);
            let result = await res.json();
            if (result.message === "Not Found") return reply("そのユーザーは見つかりませんでした。");
            let data = `*🐙 GitHub プロフィール 情報*\n\n`;
            data += `👤 *ユーザー名* : ${result.login}\n`;
            data += `📛 *名前* : ${result.name || "なし"}\n`;
            data += `📝 *自己紹介* : ${result.bio || "なし"}\n`;
            data += `🆔 *ID* : ${result.id}\n`;
            data += `🔗 *ノードID* : ${result.node_id}\n`;
            data += `🏢 *会社* : ${result.company || "なし"}\n`;
            data += `📍 *場所* : ${result.location || "なし"}\n`;
            data += `✉️ *メール* : ${result.email || "公開されていません"}\n`;
            data += `📦 *公開リポジトリ* : ${result.public_repos}\n`;
            data += `🧾 *公開Gist* : ${result.public_gists}\n`;
            data += `👥 *フォロワー* : ${result.followers}\n`;
            data += `➡️ *フォロー中* : ${result.following}\n`;
            data += `📅 *作成日* : ${result.created_at}\n`;
            data += `♻️ *更新日* : ${result.updated_at}\n`;
            data += `🔗 *GitHubリンク* : ${result.html_url}\n`;
            data += `🐤 *Twitter* : ${result.twitter_username ? "@" + result.twitter_username : "なし"}\n`;
            await sock.sendMessage(
              m.chat,
              {
                text: data,
                contextInfo: {
                  isForwarded: false,
                  externalAdReply: {
                    title: result.name || "GitHubユーザー",
                    thumbnailUrl: result.avatar_url,
                    mediaType: 1,
                    renderLargerThumbnail: false
                  }
                }
              },
              { quoted: fsaluran }
            );
          } catch (error) {
            console.error(error);
            reply("データの取得中にエラーが発生しました。ユーザー名を確認してもう一度お試しください。");
          }
        }
        break;
      case "bcgc":
      case "bcgroup":
        {
          if (!isCreator) return;
          if (!text) return m.reply(example("update"));
          let getGroups = await sock.groupFetchAllParticipating();
          let groups = Object.entries(getGroups)
            .slice(0)
            .map(entry => entry[1]);
          let anu = groups.map(v => v.id);
          reply(`${anu.length} グループチャットにブロードキャストを送信しています。`);
          for (let i of anu) {
            await FUNC.sleep(1500);
            sock.sendMessage(i, { text: `${text}` }, { quoted: fkontak });
          }
          m.reply(`${anu.length} グループにブロードキャストを送信しました`);
        }
        break;
      case "update": {
        if (!isOwner) return;
        if (!text.includes("|")) {
          return reply("📢 正しい形式で入力してください：\n`.update <type> | <title> | <desc>`");
        }
        const [typeRaw, titleRaw, descRaw] = text.split("|").map(a => a.trim());
        const type = typeRaw.toLowerCase();
        const title = titleRaw || "無題のアップデート";
        const desc = descRaw || "説明はありません。";
        const typeInfo = {
          feature: { emoji: "🆕", label: "新機能" },
          revamp: { emoji: "♻️", label: "システム刷新" },
          fix: { emoji: "🛠️", label: "バグ修正" },
          info: { emoji: "📢", label: "お知らせ" },
          remove: { emoji: "❌", label: "機能削除" }
        };
        const tag = typeInfo[type];
        if (!tag) return reply("❌ 無効なタイプです。有効なタイプ: feature, revamp, fix, info, remove");
        const updateMessage = `${tag.emoji} *アップデート - ${tag.label}*\n\n📌 *${title}*\n\n📝 ${desc}\n\n🕒 ${moment().format("YYYY/MM/DD HH:mm")}\n🧑‍💻 Dev: ${global.ownerName || "Bot Owner"}\n\n_この情報は全ユーザー向けに配信されました_`;
        const sendTo = ["120363400223227222@newsletter", "120363418657733797@g.us", "120363297738337531@g.us"];
        const sendUpdate = async jid => {
          try {
            await sock.sendMessage(
              jid,
              {
                text: updateMessage,
                contextInfo: {
                  isForwarded: false,
                  externalAdReply: {
                    title: "から " + pushname,
                    thumbnailUrl: ppuser,
                    mediaType: 1,
                    renderLargerThumbnail: false
                  }
                }
              },
              { quoted: fkontak }
            );
          } catch (err) {
            console.error("Gagal mengirim update:", err);
          }
        };
        for (const jid of sendTo) {
          await FUNC.sleep(1500);
          await sendUpdate(jid);
        }
        await reply(`✅ アップデート「${title}」を通知しました。`);
        break;
      }
      case "lyrics": {
        if (!text) return reply("Contoh: .lyrics Idol Yoasobi");
        const res = await SCR.lyrics(text);
        if (!res.success) return reply(res.message);
        function cleanLyrics(lyrics, title = "") {
          if (typeof lyrics !== "string") return "";
          return lyrics
            .replace(/^\d+\s+Contributors?\s*/i, "")
            .replace(/^[^\n]*Lyrics/i, "")
            .replace(/Lirik\s+"[^"]+"/i, "")
            .replace(/^\s*/gm, "")
            .trim();
        }
        const rawLyrics = res.lyrics;
        const cleaned = await cleanLyrics(rawLyrics, res.title);
        const caption = `🎵 タイトル: ${res.title}\n👤 アーティスト: ${res.artist}\n📅 発売日: ${res.releaseDate || "Unknown"}\n\n📝 歌詞:\n\n${cleaned}`;
        await sock.sendMessage(
          from,
          {
            text: caption,
            contextInfo: {
              externalAdReply: {
                title: res.title,
                mediaType: 1,
                renderLargerThumbnail: false,
                thumbnailUrl: res.image
              }
            }
          },
          { quoted: fsaluran }
        );
        break;
      }
      case "videy": {
        if (!args[0]) return reply(example("https://videy.co/v/?id=xxXXX"));
        const extractVideyId = url => {
          try {
            const parsed = new URL(url);
            const id = parsed.searchParams.get("id");
            if (!id) throw new Error("IDが見つかりません。");
            return id;
          } catch (err) {
            return null;
          }
        };
        const videoId = extractVideyId(args[0]);
        if (!videoId) return reply("❌ 無効なリンクです！正しいVideyリンクを入力してください。");
        const videoUrl = `https://cdn.videy.co/${videoId}.mp4`;
        sock.sendMessage(
          from,
          {
            video: { url: videoUrl },
            caption: `✅ ビデオが正常に取得されました！`
          },
          { quoted: m }
        );
        break;
      }
      case "pin":
      case "pinterest":
        {
          if (!text) return reply2(example("Elaina"));
          const count = 5;
          try {
            if (!(await useLimit(m.sender, isPremium, 1))) return reply(msg.endLimit);
            const res = await fetch(`https://sekai-api-ruby.vercel.app/api/pinterest?q=${encodeURIComponent(text)}`);
            const data = await res.json();
            const images = data?.data?.result;
            if (!Array.isArray(images) || images.length === 0) return reply("画像が見つかりません。");
            const shuffled = [...new Set(images)].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, Math.min(count, shuffled.length));
            if (selected.length === 1) {
              await sock.sendImage(from, selected[0], text, m);
            } else {
              const mediaList = selected.map(url => ({
                image: { url },
                caption: text
              }));
              await sock.sendAlbumMessage(m.chat, mediaList, {
                quoted: fkontak
              });
            }
          } catch (error) {
            console.error(error);
            await sock.sendMessage(m.chat, {
              react: { text: "❌", key: m.key }
            });
          }
        }
        break;
      case "ttmp3":
      case "tt":
      case "ttdl":
      case "ttimg":
      case "ttslide":
      case "tiktok": {
        if (!text) return reply("TikTokのURLを入力してください！");
        if (!FUNC.isUrl(args[0]) && !args[0].includes("tiktok.com")) return "リンクが無効です!";
        try {
          const fetchAPI = await axios.get(`https://api.vreden.my.id/api/tiktok?url=${encodeURIComponent(text)}`);
          const res = fetchAPI.data;
          if (res.status !== 200 || !res.result?.status) return reply("TikTokのデータ取得に失敗しました！");
          const data = res.result;
          const title = data.title || "TikTok";
          const images = data.data.filter(d => d.type === "photo").map(d => d.url);
          const video = data.data.find(d => d.type === "nowatermark_hd")?.url || data.data.find(d => d.type === "nowatermark")?.url;
          const music = data.music_info?.url;
          if (!(await useLimit(m.sender, isPremium, 5))) return reply(msg.endLimit);

          if (video) {
            let resu = await SCR.tiktok2(`${args[0]}`);
            sock
              .sendMessage(
                m.chat,
                {
                  video: { url: resu.no_watermark },
                  fileName: `tiktok.mp4`,
                  mimetype: "video/mp4"
                },
                { quoted: m }
              )
              .then(() => {
                sock.sendMessage(
                  m.chat,
                  {
                    audio: { url: resu.music },
                    fileName: `tiktok.mp3`,
                    mimetype: "audio/mp4"
                  },
                  { quoted: m }
                );
              });
          } else if (images.length > 0) {
            if (images.length === 1) {
              await sock.sendMessage(m.chat, { image: { url: images[0] }, caption: title }, { quoted: m });
            } else {
              const album = images.map(url => ({
                image: { url }
              }));
              await sock.sendAlbumMessage(m.chat, album, {
                quoted: m
              });
            }
            if (music) {
              await sock.sendMessage(
                m.chat,
                {
                  audio: { url: music },
                  fileName: "tiktok.mp3",
                  mimetype: "audio/mp4"
                },
                { quoted: m }
              );
            }
          } else {
            return reply("対応していないコンテンツタイプです。");
          }
        } catch (err) {
          console.error(err);
          return reply("TikTokデータ取得中にエラーが発生しました。");
        }
        break;
      }
      case "spotify":
      case "spotifysearch":
        {
          if (!text) return m.reply("検索したい曲名を入力してください。例: spotify 夜に駆ける");

          try {
            const results = await SCR.searchSpotifyTracks(text);
            if (!results || results.length === 0) return m.reply("該当する曲が見つかりませんでした。");

            function msToMinutes(ms) {
              const minutes = Math.floor(ms / 60000);
              const seconds = ((ms % 60000) / 1000).toFixed(0);
              return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
            }

            let msgSpotify = "🎶 *Spotify検索結果 / Spotify Search Result* 🎶\n\n";

            for (const track of results) {
              const duration = msToMinutes(track.duration_ms);

              msgSpotify += `🎵 *タイトル* : ${track.name}\n`;
              msgSpotify += `👤 *アーティスト* : ${track.artists.map(v => v.name).join(", ")}\n`;
              msgSpotify += `💿 *アルバム* : ${track.album.name}\n`;
              msgSpotify += `👥 *アルバムアーティスト* : ${track.album.artists.map(v => v.name).join(", ")}\n`;
              msgSpotify += `📅 *リリース日* : ${track.album.release_date}\n`;
              msgSpotify += `🔢 *トラック番号* : ${track.track_number} / ${track.album.total_tracks}\n`;
              msgSpotify += `⏳ *時間* : ${duration}\n`;
              msgSpotify += `🆔 *トラックID* : ${track.id}\n`;
              msgSpotify += `🆔 *アルバムID* : ${track.album.id}\n`;
              msgSpotify += `🔗 *Spotify URI* : ${track.uri}\n`;
              msgSpotify += `🌐 *アルバムURL* : ${track.album.external_urls.spotify}\n`;
              msgSpotify += `─────────────────────\n\n`;
            }

            reply(msgSpotify);
          } catch (e) {
            console.error(e);
            return m.reply("エラーが発生しました。もう一度お試しください。");
          }
        }
        break;
      case "ytplay":
      case "play":
        {
          if (!text) return reply("🎵 再生したい曲のタイトルを入力してください！\n例：.play 夜に駆ける");

          // 🔍 YouTube検索
          let searchUrl = `https://api.siputzx.my.id/api/s/youtube?query=${encodeURIComponent(text)}`;
          let searchRes;

          try {
            searchRes = await fetch(searchUrl).then(res => res.json());
          } catch (e) {
            console.error(e);
            return m.reply("❌ 曲の検索中にエラーが発生しました。");
          }

          if (!searchRes.status || !searchRes.data) return m.reply("❌ 検索結果が見つかりませんでした。");

          // 🎬 最初の動画タイプを取得
          let video = searchRes.data.find(v => v.type === "video");
          if (!video) return m.reply("❌ 該当する動画が見つかりませんでした。");
          // api
          const cheerio = require("cheerio");
          function extractVideoId(url) {
            const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
            return match ? match[1] : null;
          }

          async function ytmp3(url) {
            if (!url) throw "Masukkan URL YouTube!";

            const videoId = extractVideoId(url);
            const thumbnail = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;

            try {
              const form = new URLSearchParams();
              form.append("q", url);
              form.append("type", "mp3");

              const res = await axios.post("https://yt1s.click/search", form.toString(), {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  Origin: "https://yt1s.click",
                  Referer: "https://yt1s.click/",
                  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
                }
              });

              const $ = cheerio.load(res.data);
              const link = $('a[href*="download"]').attr("href");

              if (link) {
                return {
                  link,
                  title: $("title").text().trim() || "Unknown Title",
                  thumbnail,
                  filesize: null,
                  duration: null,
                  success: true
                };
              }
            } catch (e) {
              console.warn("Gagal YT1S:", e.message || e.toString());
            }

            try {
              if (!videoId) throw "Video ID tidak valid";

              const payload = {
                fileType: "MP3",
                id: videoId
              };

              const res = await axios.post("https://ht.flvto.online/converter", payload, {
                headers: {
                  "Content-Type": "application/json",
                  Origin: "https://ht.flvto.online",
                  Referer: `https://ht.flvto.online/widget?url=https://www.youtube.com/watch?v=${videoId}`,
                  "User-Agent": "Mozilla/5.0 (Linux; Android 13)"
                }
              });

              const data = res?.data;
              if (!data || typeof data !== "object") {
                throw "ga ada respon";
              }

              if (data.status !== "ok" || !data.link) {
                throw `Status gagal: ${data.msg || "Tidak diketahui"}`;
              }

              return {
                link: data.link,
                title: data.title,
                thumbnail,
                filesize: data.filesize,
                duration: data.duration,
                success: true
              };
            } catch (e) {
              console.warn("Gagal FLVTO:", e.message || e.toString());
            }

            throw "ga ada link download.";
          }

          // 📥 MP3をダウンロード
          let dlUrl = `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(video.url)}`;
          let dlRes;

          try {
            dlRes = await ytmp3(video.url);
          } catch (e) {
            console.error(e);
            return m.reply("❌ オーディオのダウンロードに失敗しました。");
          }

          if (!dlRes.link) return m.reply("❌ オーディオが見つからないか、失敗しました。");

          // 🎶 曲情報送信
          await sock.sendMessage(
            from,
            {
              text: `🎶 *タイトル:* ${video.title}\n` + `👤 *チャンネル:* ${video.author?.name}\n` + `⏱️ *再生時間:* ${video.duration?.timestamp}\n` + `🔗 *リンク:* ${video.url}`,
              contextInfo: {
                externalAdReply: {
                  title: video.title,
                  body: `アップローダー：${video.author?.name}`,
                  thumbnailUrl: video.thumbnail,
                  mediaType: 1,
                  renderLargerThumbnail: true
                }
              }
            },
            { quoted: m }
          );

          // 🎧 MP3音楽ファイル送信
          await sock.sendMessage(
            from,
            {
              audio: {
                url: dlRes.link
              },
              mimetype: "audio/mpeg",
              fileName: dlRes.title + ".mp3",
              ptt: false
            },
            { quoted: m }
          );
        }
        break;
      case "terabox": {
        if (!text) return reply(`🔗 TeraboxのURLを送ってください！\n例: ${prefix}terabox https://1024terabox.com/s/1zCxxxx`);
        if (!FUNC.isUrl(args[0]) && !args[0].includes("terabox.com")) return "リンクが無効です!";
        try {
          await reply("⏳ ダウンロードリンクを取得中...");

          const res = await fetch(`https://zenz.biz.id/downloader/terabox?url=${encodeURIComponent(text)}`);
          const data = await res.json();

          if (!data.status || !data.result) return reply("❌ 無効なURL、またはデータの取得に失敗しました。");

          const { filename, size, thumb, direct_url } = data.result;
          const sizeMB = Number(size) / 1024 / 1024;

          if (sizeMB < 50) {
            await sock.sendMessage(
              m.chat,
              {
                document: { url: direct_url },
                mimetype: "application/octet-stream",
                fileName: filename,
                caption: `📁 *Terabox ダウンロード*\n\n📄 ファイル名: ${filename}\n📦 サイズ: ${sizeMB.toFixed(2)} MB`
              },
              { quoted: m }
            );
          } else {
            const caption = `📁 *Terabox ダウンローダー*\n\n📄 ファイル名: ${filename}\n📦 サイズ: ${sizeMB.toFixed(2)} MB\n\n⚠️ *ファイルサイズが50MBを超えているため、直接送信できません。*\n\n🔗 ダウンロードはこちら:\n${direct_url}`;

            await sock.sendMessage(
              m.chat,
              {
                text: caption,
                contextInfo: {
                  externalAdReply: {
                    title: filename,
                    body: "Teraboxからダウンロード",
                    thumbnailUrl: thumb,
                    sourceUrl: direct_url,
                    mediaType: 1,
                    renderLargerThumbnail: true
                  }
                }
              },
              { quoted: m }
            );
          }
        } catch (e) {
          console.error(e);
          reply("⚠️ エラーが発生しました。もう一度お試しください。");
        }
        break;
      }

      case "tourl":
        {
          if (!/video/.test(mime) && !/image/.test(mime)) return reply(`*キャプション付きのビデオ/画像を送信/返信する* ${prefix + command}`);
          let { TelegraPh } = require("./all/scrape/uploader.js");
          let media = await sock.downloadAndSaveMediaMessage(quoted);
          let anu = await TelegraPh(media);
          reply(util.format(anu));
          await fs.unlinkSync(media);
        }
        break;
      case "toimage":
      case "toimg":
        {
          if (!/webp/.test(mime)) return reply(`reply some sticker`);
          let media = await sock.downloadAndSaveMediaMessage(quoted);
          let ran = await FUNC.getRandom(".png");
          exec(`ffmpeg -i ${media} ${ran}`, err => {
            fs.unlinkSync(media);
            if (err) throw err;
            let buffer = fs.readFileSync(ran);
            sock.sendMessage(from, { image: buffer }, { quoted: fkontak });
            fs.unlinkSync(ran);
          });
        }
        break;
      case "tomp4":
      case "tovideo":
        {
          if (!quoted) reply(`${prefix + command} でアニメーションステッカーに返信する`);
          if (/video/.test(mime)) {
            let { TelegraPh } = require("./all/scrape/uploader.js");
            let media = await sock.downloadAndSaveMediaMessage(quoted);
            let ehe = await TelegraPh(media);
            await sock.sendMessage(
              from,
              {
                video: {
                  url: util.format(ehe),
                  caption: "Webpをビデオに変換する"
                }
              },
              { quoted: fkontak }
            );
            await fs.unlinkSync(media);
          }
        }
        break;
      case "tomp3":
        {
          if (!/video/.test(mime) && !/audio/.test(mime)) return react("❌");
          if (!m.quoted) return react("❌");
          let media = await sock.downloadMediaMessage(quoted);
          let { toAudio } = require("./all/library/converter.js");
          let audio = await toAudio(media, "mp4");
          sock.sendMessage(
            m.chat,
            {
              document: audio,
              mimetype: "audio/mpeg",
              fileName: `Convert By ${sock.user.name}.mp3`
            },
            { quoted: m }
          );
        }
        break;
      case "statustext":
      case "upswtext":
      case "upswteks":
        {
          if (!isCreator) return;
          if (!text) return reply("ステータスを更新するためのテキストを入力してください。");
          try {
            await sock.sendMessage(
              "status@broadcast",
              { text: text },
              {
                backgroundColor: "#FF000000",
                font: 3,
                statusJidList: jidAllList
              }
            );
            reply(msg.done);
          } catch (error) {
            console.error("メッセージの送信中にエラーが発生しました:", error);
            return reply("ステータスの更新に失敗しました。");
          }
        }
        break;
      case "statusvideo":
      case "upswvideo":
        {
          if (!isCreator) return;
          if (/video/.test(mime)) {
            var videosw = await sock.downloadAndSaveMediaMessage(quoted);
            await sock.sendMessage("status@broadcast", { video: { url: videosw }, caption: text || "" }, { statusJidList: jidAllList });
            await reply(msg.done);
          } else {
            reply("動画への返信");
          }
        }
        break;
      case "statusimg":
      case "statusimage":
      case "upswimg":
        {
          if (!isCreator) return;
          if (/image/.test(mime)) {
            var imagesw = await sock.downloadAndSaveMediaMessage(quoted);
            await sock.sendMessage("status@broadcast", { image: { url: imagesw }, caption: text || "" }, { statusJidList: jidAllList });
            await reply(msg.done);
          } else {
            reply("画像への返信");
          }
        }
        break;
      case "statusaudio":
      case "upswaudio":
        {
          if (!isCreator) return;
          if (/audio/.test(mime)) {
            var audiosw = await sock.downloadAndSaveMediaMessage(quoted);
            await sock.sendMessage(
              "status@broadcast",
              {
                audio: { url: audiosw },
                mimetype: "audio/mp4",
                ptt: true
              },
              {
                backgroundColor: "#FF000000",
                statusJidList: jidAllList
              }
            );
            await reply(msg.done);
          } else {
            reply("音声に返信");
          }
        }
        break;
      case "toaudio":
      case "audio":
        {
          if (!/video/.test(mime) && !/audio/.test(mime)) reply(`*キャプション付きオーディオとして使用したいビデオ/オーディオを送信/返信* ${prefix + command}`);
          if (!m.quoted) reply(`*キャプション付きオーディオとして使用したいビデオ/オーディオを送信/返信* ${prefix + command}`);
          let media = await sock.downloadMediaMessage(quoted);
          let { toAudio } = require("./all/library/converter.js");
          let audio = await toAudio(media, "mp4");
          sock.sendMessage(m.chat, { audio: audio, mimetype: "audio/mpeg" }, { quoted: m });
        }
        break;
      case "tovn":
      case "voice":
        {
          if (!/video/.test(mime) && !/audio/.test(mime)) reply(`*VNにしたいビデオ/オーディオにキャプションを付けて返信* ${prefix + command}`);
          if (!m.quoted) reply(`*VNにしたいビデオ/オーディオにキャプションを付けて返信* ${prefix + command}`);
          let media = await quoted.download();
          let { toPTT } = require("./all/library/converter.js");
          let audio = await toPTT(media, "mp4");
          sock.sendMessage(from, {
            audio: audio,
            mimetype: "audio/mpeg",
            ptt: true
          });
        }
        break;
      case "tts":
        {
          if (!text) return reply(example("im thanos"));
          const a = await (
            await axios.post(
              "https://gesserit.co/api/tiktok-tts",
              { text: text, voice: "id_001" },
              {
                headers: {
                  Referer: "https://gesserit.co/tiktok",
                  "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
                  responseType: "arraybuffer"
                }
              }
            )
          ).data;
          const b = Buffer.from(a.audioUrl);
          sock.sendMessage(m.chat, {
            audio: Buffer.from(a.audioUrl.split("base64,")[1], "base64"),
            mimetype: "audio/mpeg",
            ptt: true
          });
        }
        break;
      case "googledrive":
      case "gdrive":
        {
          if (!(await useLimit(m.sender, isPremium, 5))) return reply(msg.endLimit);
          if (!text) return reply(`Example ${prefix + command} url`);
          async function GDriveDl(url) {
            let id = (url.match(/\/?id=(.+)/i) || url.match(/\/d\/(.*?)\//))?.[1];
            if (!id) return reply("ID Not Found");
            let res = await fetch(`https://drive.google.com/uc?id=${id}&authuser=0&export=download`, {
              method: "post",
              headers: {
                "accept-encoding": "gzip, deflate, br",
                "content-length": 0,
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                origin: "https://drive.google.com",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
                "x-client-data": "CKG1yQEIkbbJAQiitskBCMS2yQEIqZ3KAQioo8oBGLeYygE=",
                "x-drive-first-party": "DriveWebUi",
                "x-json-requested": "true"
              }
            });
            let { fileName, sizeBytes, downloadUrl } = JSON.parse((await res.text()).slice(4));
            if (!downloadUrl) return reply("リンクのダウンロード制限！");
            let data = await fetch(downloadUrl);
            if (data.status !== 200) throw data.statusText;
            return {
              downloadUrl,
              fileName,
              fileSize: (sizeBytes / 1024 / 1024).toFixed(2),
              mimetype: data.headers.get("content-type")
            };
          }
          try {
            let kanjuttgede = await GDriveDl(text);
            let bjirrbang = `*Google Drive*\n\n名前: ${kanjuttgede.fileName}\nリンク: ${kanjuttgede.downloadUrl}`;
            reply(bjirrbang);
            await sock.sendMessage(
              m.chat,
              {
                document: { url: kanjuttgede.downloadUrl },
                fileName: kanjuttgede.fileName,
                mimetype: kanjuttgede.mimetype
              },
              { quoted: fkontak }
            );
          } catch (error) {
            console.log(error.message);
            reply("問題が発生しました。プライベートファイルかフォルダリンクの可能性があります。");
          }
        }
        break;
      case "igdl":
      case "ig":
      case "igvideo":
      case "igimage":
      case "igvid":
      case "igimg":
      case "insta":
      case "instadl":
        {
          if (!text) return m.reply("Instagramの投稿、リール、または画像のURLを入力してください。");
          if (!FUNC.isUrl(args[0]) && !args[0].includes("instagram.com")) return "リンクが無効です!";
          try {
            if (!(await useLimit(m.sender, isPremium, 5))) return reply(msg.endLimit);
            const response = await axios.get(`https://api.neekoi.me/api/igdl?url=${text}`);
            const data = response.data;
            const mediaArray = data?.result?.data;
            if (Array.isArray(mediaArray) && mediaArray.length >= 1) {
              if (mediaArray.length === 1) {
                const media = mediaArray[0];

                if (!text.includes("/p/")) {
                  await sock.sendMessage(
                    m.chat,
                    {
                      video: { url: media.url },
                      caption: media.caption || ""
                    },
                    { quoted: m }
                  );
                } else {
                  await sock.sendMessage(
                    m.chat,
                    {
                      image: { url: media.url },
                      caption: media.caption || ""
                    },
                    { quoted: m }
                  );
                }
              } else {
                const uniqueThumbnails = [];
                const mediaList = mediaArray
                  .filter(item => {
                    if (!uniqueThumbnails.includes(item.thumbnail)) {
                      uniqueThumbnails.push(item.thumbnail);
                      return true;
                    }
                    return false;
                  })
                  .map(item => ({
                    image: { url: item.thumbnail }
                  }));

                await sock.sendAlbumMessage(m.chat, mediaList, {
                  quoted: m
                });
              }
            } else {
              m.reply("メディアが見つかりませんでした。");
            }
          } catch (error) {
            m.reply("エラーが発生しました: " + error.message);
          }
        }
        break;
      case "fb":
      case "facebook":
      case "facebookvid":
        {
          try {
            if (!args[0]) {
              return m.reply(example("https://fb.watch/xxx"));
            }
            if ((!FUNC.isUrl(args[0]) && !args[0].includes("facebook.com")) || !args[0].includes("fb.watch")) return "リンクが無効です!";
            if (!(await useLimit(m.sender, isPremium, 10))) return reply(msg.endLimit);
            const url = args[0];
            const response = await fetch(`https://api.neekoi.me/api/fbdl?url=${encodeURIComponent(url)}`);
            if (!response.ok) {
              return m.reply(`リンクを確認してもう一度お試しください。`);
            }
            const data = await response.json();
            if (!data.status || !data.result || !data.result.data || data.result.data.length === 0) {
              return m.reply(`リンクが有効であることを確認してください。`);
            }
            const messageText = `*[ Facebookビデオダウンローダー ]*`;
            await sock.sendMessage(
              m.chat,
              {
                video: { url: data.result.data[0].url },
                caption: messageText
              },
              { quoted: m }
            );
          } catch (error) {
            console.error(error);
            m.reply(`ビデオの取得中にエラーが発生しました`);
          }
        }
        break;
      case "listgc":
      case "listgroup":
        {
          if (!isCreator) return;
          let getGroups = await sock.groupFetchAllParticipating();
          let groups = Object.entries(getGroups)
            .slice(0)
            .map(entry => entry[1]);
          let anu = groups.map(v => v.id);
          let teks = `*[ グループリスト ]*`;
          for (let x of anu) {
            let metadata2 = await sock.groupMetadata(x);
            teks += `\n•─ ─────────── ─•\n`;
            teks += `⟡ 名前 : ${metadata2.subject}\n`;
            teks += `⟡ 私 : ${metadata2.id}\n`;
            teks += `⟡ メンバー : ${metadata2.participants.length}\n`;
            teks += `•─ ─────────── ─•\n`;
          }
          reply(teks);
        }
        break;
      case "pushkontak":
        {
          if (!isOwner) return;
          if (!text) return m.reply(example("jid|メッセージ "));
          if (!text.split("|")) return m.reply(example("jid|メッセージ "));
          const [idgc, pes] = text.split("|");
          const teks = pes;
          const jidawal = m.chat;
          const data = await sock.groupMetadata(id);
          const halls = await data.participants.filter(v => v.id.endsWith(".net")).map(v => v.id);
          await m.reply(`*pushcontact* をグループ *${data.subject}* に処理しています`);
          for (let mem of halls) {
            if (mem !== botNumber && mem.split("@")[0] !== global.owner) {
              const vcard = "BEGIN:VCARD\n" + "VERSION:3.0\n" + `FN:${ownerName}\n` + "ORG:Developer;\n" + `TEL;type=CELL;type=VOICE;waid=${global.owner}:${global.owner}\n` + "END:VCARD";
              const sentMsg = await sock.sendMessage(mem, {
                contacts: {
                  displayName: ownerName,
                  contacts: [{ vcard }]
                }
              });
              await sock.sendMessage(mem, { text: teks }, { quoted: sentMsg });
              await FUNC.sleep(global.delayPushkontak);
            }
          }
          await sock.sendMessage(
            jidawal,
            {
              text: `*Pushcontact が成功しました ✅*\nメッセージを送信できたメンバーの総数: ${halls.length}`
            },
            { quoted: m }
          );
        }
        break;
      case "couple":
        {
          if (!m.isGroup) return reply(msg.group);
          let member = participants.map(u => u.id);
          let orang = member[Math.floor(Math.random() * member.length)];
          let jodoh = member[Math.floor(Math.random() * member.length)];
          sock.sendMessage(
            m.chat,
            {
              text: `@${orang.split("@")[0]} ❤️ @${jodoh.split("@")[0]}`,
              contextInfo: {
                mentionedJid: [orang, jodoh],
                forwardingScore: 9999999,
                isForwarded: true,
                externalAdReply: {
                  title: "Kaede",
                  thumbnailUrl: `https://files.catbox.moe/j93ldt.jpg`
                }
              }
            },
            { quoted: fsaluran }
          );
        }
        break;
      case "ytmp3": {
        if (!text) return reply(example("https://youtu.be/xxxx"));
        try {
          if (!(await useLimit(m.sender, isPremium, 5))) return reply(msg.endLimit);
          const data = await YTDL(text, "mp3");
          if (!data || !data.downloadUrl) {
            return reply("❌ APIからデータを取得できませんでした。YouTube URLが有効であることを確認してください。");
          }
          if (data.duration > 900) {
            return reply("❌ ビデオの長さが 15 分を超えています。");
          }
          await sock.sendMessage(
            m.chat,
            {
              audio: { url: data.downloadUrl },
              mimetype: "audio/mpeg",
              ptt: false,
              contextInfo: {
                externalAdReply: {
                  title: data.title || "無題",
                  thumbnailUrl: data.thumbnail,
                  mediaType: 1,
                  renderLargerThumbnail: true
                }
              }
            },
            { quoted: m }
          );
        } catch (e) {
          console.error(e);
          reply("❌ リクエストの処理中にエラーが発生しました。");
        }
        break;
      }

      case "ytmp4": {
        if (!text) return reply(example("https://youtu.be/xxx"));

        try {
          if (!(await useLimit(m.sender, isPremium, 5))) return reply(msg.endLimit);

          const data = await YTDL(text, "1080");

          if (!data || !data.downloadUrl) {
            return reply("❌ APIからデータを取得できませんでした。YouTube URLが有効であることを確認してください。");
          }

          if (data.duration > 900) {
            return reply("❌ ビデオの長さが 15 分を超えています。");
          }

          await sock.sendMessage(
            m.chat,
            {
              document: { url: data.downloadUrl },
              fileName: `${data.id}.mp4`,
              mimetype: "video/mp4",
              caption: data.title || "",
              contextInfo: {
                externalAdReply: {
                  title: data.title || "無題",
                  thumbnailUrl: data.thumbnail,
                  mediaType: 1,
                  renderLargerThumbnail: true
                }
              }
            },
            { quoted: m }
          );
        } catch (e) {
          console.error(e);
          reply("❌ ビデオのダウンロード中にエラーが発生しました。");
        }
        break;
      }
      case "ping":
      case "speed": {
        const start = performance.now();
        const end = performance.now();
        const latency = end - start;
        const response = `🏓 *PONG!*\n🔹 *Latency:* ${latency.toFixed(2)} ms`;
        await sock.sendMessage(m.chat, { text: response }, { quoted: m });
        break;
      }
      case "join":
        {
          if (!isPremium) return react("❌");
          if (!text) return m.reply(example("https://chat.whatsapp.com/xxxx"));
          if (!FUNC.isUrl(args[0]) && !args[0].includes("whatsapp.com")) return "リンクが無効です!";
          let result = args[0].split("https://chat.whatsapp.com/")[1];
          await sock
            .groupAcceptInvite(result)
            .then(res => m.reply(FUNC.jsonformat(res)))
            .catch(err => m.reply(FUNC.jsonformat(err)));
        }
        break;
      case "welcome":
        {
          if (!isGroup) return reply(msg.group);
          if (!isAdmin) return reply(msg.admin);
          if (!isBotAdmin) return reply(msg.adminbot);
          if (text == "on") {
            if (chatdb.welcomer) return reply("ウェルカムユーザーはすでにアクティブです");
            chatdb.welcomer = true;
            let teksnya = `*ウェルカムが正常に有効化されました ✅*`;
            reply(teksnya);
          } else if (text == "off") {
            if (chatdb.welcomer == false) return reply("このグループはデータベースに登録されていません");
            chatdb.welcomer = false;
            let teksnya = `*welcomer が正常に無効化されました ✅*`;
            reply(teksnya);
          }
        }
        break;
      case "setwelcome":
        {
          if (!isGroup) return reply(msg.group);
          if (!isAdmin) return reply(msg.acces);
          if (!isBotAdmin) return reply(msg.adminbot);
          if (!text)
            return reply(
              "カスタムのウェルカムメッセージを入力してください。\n使用できるタグ:\n@user : ログイン/ログアウトしたユーザーにメンション\n@group : グループ名\n@desc : グループの説明\n@readmore : 「続きを読む」を挿入して、メッセージを折りたたむ\n@member : メンバーの人数"
            );
          chatdb.welcometxt = m.text.replace(cmd + " ", "");
          await reply(`終わり..`);
        }
        break;
      case "setleft":
        {
          if (!isGroup) return reply(msg.group);
          if (!isAdmin) return reply(msg.acces);
          if (!isBotAdmin) return reply(msg.adminbot);
          if (!text)
            return reply(
              "カスタムのウェルカムメッセージを入力してください。\n使用できるタグ:\n@user : ログイン/ログアウトしたユーザーにメンション\n@group : グループ名\n@desc : グループの説明\n@readmore : 「続きを読む」を挿入して、メッセージを折りたたむ\n@member : メンバーの人数"
            );
          chatdb.leftxt = m.text.replace(cmd + " ", "");
          await reply(`終わり..`);
        }
        break;
      case "everyone":
      case "tagall":
        {
          if (!isGroup) return reply(msg.group);
          if (!isAdmin) return reply(msg.acces);
          if (!isBotAdmin) return reply(msg.adminbot);
          var teks = m.quoted ? m.quoted.text : m.text.replace(cmd + " ", "");
          sock.sendMessage(m.chat, {
            text: `@${m.chat}` + " " + teks || "",
            contextInfo: {
              mentionedJid: (await sock.groupMetadata(m.chat)).participants.map(v => v.id),
              groupMentions: [
                {
                  groupSubject: "Everyone",
                  groupJid: m.chat
                }
              ]
            }
          });
        }
        break;
      case "here":
        {
          if (!isGroup) return reply(msg.group);
          if (!isAdmin) return reply(msg.acces);
          if (!isBotAdmin) return reply(msg.adminbot);
          var teks = m.quoted ? m.quoted.text : m.text.replace(cmd + " ", "");
          sock.sendMessage(m.chat, {
            text: `@${m.chat}` + " " + teks || "",
            contextInfo: {
              mentionedJid: (await sock.groupMetadata(m.chat)).participants.map(v => v.id),
              groupMentions: [
                {
                  groupSubject: "here",
                  groupJid: m.chat
                }
              ]
            }
          });
        }
        break;
      case "antilink":
        {
          if (!m.isGroup) return reply(msg.group);
          if (!isBotAdmin) return reply(msg.adminbot);
          if (!isAdmin) return reply(msg.acces);
          if (args.length < 1) return reply("on/off?");
          if (args[0] === "on") {
            db.data.chats[from].antilink = true;
            reply(`${command} 有効になっています`);
          } else if (args[0] === "off") {
            db.data.chats[from].antilink = false;
            reply(`${command} 無効になっています`);
          }
        }
        break;
      case "antilinkgc":
        {
          if (!m.isGroup) return reply(msg.group);
          if (!isBotAdmin) return reply(msg.adminbot);
          if (!isAdmin) return reply(msg.acces);
          if (args.length < 1) return reply("on/off?");
          if (args[0] === "on") {
            db.data.chats[from].antilinkgc = true;
            reply(`${command} 有効になっています`);
          } else if (args[0] === "off") {
            db.data.chats[from].antilinkgc = false;
            reply(`${command} 無効になっています`);
          }
        }
        break;
      case "antisticker":
        {
          if (!m.isGroup) return reply(msg.group);
          if (!isBotAdmin) return reply(msg.adminbot);
          if (!isAdmin) return reply(msg.acces);
          if (args.length < 1) return reply("on/off?");
          if (args[0] === "on") {
            db.data.chats[from].antisticker = true;
            reply(`${command} 有効になっています`);
          } else if (args[0] === "off") {
            db.data.chats[from].antisticker = false;
            reply(`${command} 無効になっています`);
          }
        }
        break;
      case "kik":
      case "kick":
        {
          if (!isGroup) return reply(msg.group);
          if (!isBotAdmin) return reply(msg.adminbot);
          if (text || m.quoted) {
            let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
            await sock
              .groupParticipantsUpdate(m.chat, [users], "remove")
              .then(res =>
                sock.sendMessage(
                  m.chat,
                  {
                    text: `@${users.split("@")[0]} を正常に出力しました`,
                    mentions: [`${users}`]
                  },
                  { quoted: fkontak }
                )
              )
              .catch(err => m.reply(err.toString()));
          } else return m.reply(example("number/@tag"));
        }
        break;
      case "hidetag":
      case "h":
        {
          if (!isGroup) return reply(msg.group);
          if (!m.quoted && !text) return m.reply(example("hi"));
          var teks = m.quoted ? m.quoted.text : m.text.replace(cmd + " ", "");
          var member = await groupMetadata.participants.map(e => e.id);
          sock.sendMessage(m.chat, { text: `${teks}`, mentions: [...member] }, { quoted: m });
        }
        break;
      case "translate": {
        let teks = m.quoted ? m.quoted.text : m.text.replace(cmd + " ", "");
        if (!teks) return reply(`❌ 翻訳するテキストを入力してください。\n\n例: *${prefix}translate おはよう|en*`);
        let [query, target] = teks.split("|").map(v => v.trim());
        if (!query) return reply(`❌ 翻訳するテキストが見つかりません。\n\n例: *${prefix}translate おはよう|en*`);
        if (!target) target = "id";

        try {
          const res = await fetch(`https://api.siputzx.my.id/api/tools/translate?text=${encodeURIComponent(query)}&source=auto&target=${target}`);
          const json = await res.json();

          if (!json.success || !json.translatedText) {
            throw new Error("翻訳に失敗しました。");
          }

          reply(json.translatedText);
        } catch (err) {
          console.error(err);
          reply("❌ エラーが発生しました。翻訳できませんでした。");
        }
        break;
      }

      case "open":
        {
          if (!isGroup) return reply(msg.group);
          if (!isBotAdmin) return reply(msg.adminbot);
          await sock.groupSettingUpdate(m.chat, "not_announcement");
          m.reply(msg.done);
        }
        break;
      case "close":
        {
          if (!isGroup) return reply(msg.group);
          if (!isBotAdmin) return reply(msg.adminbot);
          await sock.groupSettingUpdate(m.chat, "announcement");
          m.reply(msg.done);
        }
        break;
      case "d":
      case "del":
      case "delete":
        {
          if (isGroup) {
            if (!m.quoted) return;
            if (m.quoted.sender == botNumber) {
              sock.sendMessage(m.chat, {
                delete: {
                  remoteJid: m.chat,
                  fromMe: true,
                  id: m.quoted.id,
                  participant: m.quoted.sender
                }
              });
            } else {
              if (!isBotAdmin) return reply(msg.adminbot);
              sock.sendMessage(m.chat, {
                delete: {
                  remoteJid: m.chat,
                  fromMe: false,
                  id: m.quoted.id,
                  participant: m.quoted.sender
                }
              });
            }
          } else {
            if (!m.quoted) return;
            sock.sendMessage(m.chat, {
              delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: m.quoted.id,
                participant: m.quoted.sender
              }
            });
          }
        }
        break;
      case "demote":
      case "demote":
        {
          if (!isGroup) return reply(msg.group);
          if (!isBotAdmin) return reply(msg.adminbot);
          if (m.quoted || text) {
            let target = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
            await sock.groupParticipantsUpdate(m.chat, [target], "demote");
            m.reply(msg.done);
          } else return m.reply(example("62838XXX"));
        }
        break;
      case "promote":
      case "promot":
        {
          if (!isGroup) return reply(msg.group);
          if (!isBotAdmin) return reply(msg.adminbot);
          if (m.quoted || text) {
            let target = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
            await sock.groupParticipantsUpdate(m.chat, [target], "promote");
            m.reply(msg.done);
          } else return m.reply(example("62838XXX"));
        }
        break;
      case "owner":
      case "creator":
      case "crator":
      case "オーナー":
      case "製作者":
        {
          await sock.sendContact(
            m.chat,
            [
              {
                number: "62881026950162",
                name: "🌸 フラン (Franklin)",
                title: "👨‍💻 開発者 (Kaihatsusha - Developer Bot)",
                org: "Deep Technology Inc."
              },
              {
                number: "6282334226291",
                name: "🍁 カエデ (Kaede)",
                title: "👑 グループ管理者 (Gurūpu Kanrisha - Admin Group)",
                org: "Sekai-Team"
              }
            ],
            fkontak
          );
        }
        break;

      case "autoai":
        {
          if (isGroup) return;
          if (!text) {
            reply2(example("on"));
          } else if (["on", "enable", "1"].includes(args[0])) {
            if (userdb.autoai == true) return m.reply(`すでにオンライン`);
            reply2("シルビアが有効になりました✔️");
            userdb.autoai = true;
          } else if (["off", "disable", "0"].includes(args[0])) {
            if (userdb.autoai == false) return m.reply(`さようなら👋`);
            reply2("さようなら👋");
            userdb.autoai = false;
          }
        }
        break;
      case "spam-pairing":
        {
          if (!isOwner) return reply(mesg.owner);
          if (!text) return reply(`*例：* ${prefix + command} +628xxxxxx|150`);
          reply(msg.wait);
          let [peenis, pepekk = "200"] = text.split("|");
          let target = peenis.replace(/[^0-9]/g, "").trim();
          let { default: makeWaSocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("baileys");
          let { state } = await useMultiFileAuthState("pepek");
          let { version } = await fetchLatestBaileysVersion();
          let pino = require("pino");
          let sucked = await makeWaSocket({
            auth: state,
            version,
            logger: pino({ level: "fatal" })
          });
          for (let i = 0; i < pepekk; i++) {
            await FUNC.sleep(1500);
            let prc = await sucked.requestPairingCode(target);
            await console.log(`_スパムペアリング成功コード - 番号: ${target} - コード: ${prc}_`);
          }
          await FUNC.sleep(15000);
        }
        break;
      case "clearchat":
        m.reply("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
        break;
      case "upch":
        {
          sock.sendMessage(m.chat, {
            react: { text: "⏳", key: m.key }
          });
          let idch = "120363400223227222@newsletter";
          let ppnyauser = await await sock.profilePictureUrl(m.sender, "image").catch(_ => "https://telegra.ph/file/6880771a42bad09dd6087.jpg");
          sock.sendMessage(
            idch,
            {
              text: text,
              contextInfo: {
                isForwarded: false,
                externalAdReply: {
                  title: "から " + pushname,
                  thumbnailUrl: ppnyauser,
                  mediaType: 1,
                  renderLargerThumbnail: false
                }
              }
            },
            { quoted: fkontak }
          );
          await sock.sendMessage(m.chat, {
            react: { text: "✅", key: m.key }
          });
        }
        break;
      // ============================== //
      case "siapakahaku":
      case "誰":
      case "whosme":
        {
          if (!isGroup) return reply("グループ内でのみ使用できます！");
          if (isPlayingGame(m.sender)) return reply("🎮 まだ他のクイズをプレイ中です！");
          if (m.sender in whosmegame) return reply("❗ まだ終わっていないゲームがあります！");

          const data = JSON.parse(fs.readFileSync("./all/json/game/whosme.json"));
          const { soal, jawaban } = FUNC.pickRandom(data);
          console.log("Jawaban : " + jawaban);
          const teks = `🎮 *誰でしょう？ゲーム*\n${soal}\n⏰ 制限時間: ${gamewaktu} 秒`;
          await reply(teks);

          whosmegame[m.sender] = {
            soal: soal,
            jawaban: jawaban.toLowerCase(),
            waktu: setTimeout(() => {
              if (whosmegame[m.sender]) {
                m.reply(`⏰ 時間切れ！\n✅ 正解は: ${whosmegame[m.sender].jawaban}`);
                delete whosmegame[m.sender];
              }
            }, gamewaktu * 1000)
          };
        }
        break;
      case "susunkata":
      case "wordpuzzle":
      case "ことばをならべて":
        {
          if (!isGroup) return reply("⚠️ このコマンドはグループチャットでのみ使用できます。");
          if (isPlayingGame(m.sender)) return reply("🎮 現在、他のクイズをプレイ中です！");
          if (m.sender in scrambleword) return m.reply("❗ まだ終了していないゲームがあります！");

          const data = JSON.parse(fs.readFileSync("./all/json/game/scrambleword.json"));
          const { scrambled, answer, type } = FUNC.pickRandom(data);
          console.log("答え: " + answer);

          let teks = `🎮 *ことばを並べよう！*\n\n🔤 シャッフルされた単語: ${scrambled}\n📚 種類: ${type}\n⏰ 制限時間: ${gamewaktu} 秒`;
          await sock.sendMessage(m.chat, { text: teks }, { quoted: fkontak });

          scrambleword[m.sender] = {
            soal: scrambled,
            jawaban: answer.toLowerCase(),
            hadiah: FUNC.randomNomor(10, 20),
            waktu: setTimeout(() => {
              if (scrambleword[m.sender]) {
                m.reply(`⏰ タイムアップ！\n✅ 正解: ${scrambleword[m.sender].answer}`);
                delete scrambleword[m.sender];
              }
            }, gamewaktu * 1000)
          };
        }
        break;
      case "tebakkata":
      case "アナグラム":
      case "guessword":
        {
          if (!isGroup) return reply("⚠️ このコマンドはグループチャットでのみ使用できます。");
          if (isPlayingGame(m.sender)) return reply("🎮 現在、他のクイズをプレイ中です！");
          if (m.sender in guesswordgame) return reply("❗ まだ終了していないゲームがあります！");

          const data = JSON.parse(fs.readFileSync("./all/json/game/wordans.json"));
          const { soal, jawaban } = FUNC.pickRandom(data);
          console.log("答え: " + jawaban);
          const teks = `🎮 *ことばあそびゲーム*\n🔤 お題: ${soal}\n⏰ 制限時間: ${gamewaktu} 秒`;
          await reply(teks);

          guesswordgame[m.sender] = {
            soal: soal,
            jawaban: jawaban.toLowerCase(),
            waktu: setTimeout(() => {
              if (guesswordgame[m.sender]) {
                m.reply(`⏰ タイムアップ！\n✅ 正解: ${guesswordgame[m.sender].jawaban}`);
                delete guesswordgame[m.sender];
              }
            }, gamewaktu * 1000)
          };
        }
        break;

      case "tebakkalimat":
      case "文書シャッフル":
      case "guessentence":
        {
          if (!isGroup) return reply("⚠️ このコマンドはグループチャットでのみ使用できます。");
          if (isPlayingGame(m.sender)) return reply("🎮 現在、他のクイズをプレイ中です！");
          if (m.sender in guesswordgame) return reply("❗ まだ終了していないゲームがあります！");

          const data = JSON.parse(fs.readFileSync("./all/json/game/wordsans.json"));
          const { soal, jawaban } = FUNC.pickRandom(data);
          console.log("答え: " + jawaban);
          const teks = `🎮 *ぶんしょうクイズ*\n📜 お題: ${soal}\n⏰ 制限時間: ${gamewaktu} 秒`;
          await reply(teks);

          guesswordgame[m.sender] = {
            soal: soal,
            jawaban: jawaban.toLowerCase(),
            waktu: setTimeout(() => {
              if (guesswordgame[m.sender]) {
                m.reply(`⏰ タイムアップ！\n✅ 正解: ${guesswordgame[m.sender].jawaban}`);
                delete guesswordgame[m.sender];
              }
            }, gamewaktu * 1000)
          };
        }
        break;

      case "trivia":
      case "quiz":
      case "クイズ":
      case "kuis":
        {
          if (!isGroup) return reply("⚠️ このコマンドはグループチャットでのみ使用できます。");
          if (isPlayingGame(m.sender)) return reply("🎮 現在、他のクイズをプレイ中です！");
          if (m.sender in triviaquizgame) return reply("❗ まだ終了していないゲームがあります！");

          const data = JSON.parse(fs.readFileSync("./all/json/game/quiz.json"));
          const { soal, jawaban } = FUNC.pickRandom(data);
          console.log("答え: " + jawaban);
          const teks = `🎮 *トリビアクイズ*\n❓ 質問: ${soal}\n⏰ 制限時間: ${gamewaktu} 秒`;
          await reply(teks);

          triviaquizgame[m.sender] = {
            soal: soal,
            jawaban: jawaban.toLowerCase(),
            waktu: setTimeout(() => {
              if (triviaquizgame[m.sender]) {
                m.reply(`⏰ タイムアップ！\n✅ 正解: ${triviaquizgame[m.sender].jawaban}`);
                delete triviaquizgame[m.sender];
              }
            }, gamewaktu * 1000)
          };
        }
        break;

      case "guesselement":
      case "chemistry":
      case "tebakkimia":
      case "かがくクイズ":
        {
          if (!isGroup) return reply("⚠️ このコマンドはグループチャットでのみ使用できます。");
          if (isPlayingGame(m.sender)) return reply("🎮 現在、他のクイズをプレイ中です！");
          if (m.sender in guesselementgame) return reply("❗ まだ終了していないゲームがあります！");

          const data = JSON.parse(fs.readFileSync("./all/json/game/quiz.json"));
          const { element, answer } = FUNC.pickRandom(data);
          console.log("答え: " + answer);
          const teks = `🧪 *化学クイズ*\n🔬 お題: ${element}\n⏰ 制限時間: ${gamewaktu} 秒`;
          await reply(teks);

          guesselementgame[m.sender] = {
            soal: element,
            jawaban: answer.toLowerCase(),
            waktu: setTimeout(() => {
              if (guesselementgame[m.sender]) {
                m.reply(`⏰ タイムアップ！\n✅ 正解: ${guesselementgame[m.sender].answer}`);
                delete guesselementgame[m.sender];
              }
            }, gamewaktu * 1000)
          };
        }
        break;
      case "mathquiz":
      case "math":
      case "けいさん":
      case "quizmath":
        {
          if (!isGroup) return reply("グループ内でのみ使用できます！");
          if (isPlayingGame(m.sender)) return reply("🎮 まだ他のクイズをプレイ中です！");
          if (kuismath[m.sender]) return reply("まだ終わっていないクイズがあります！");

          let { genMath, modes } = require("./all/json/game/math");
          if (!text)
            return reply(`📘 モード一覧: ${Object.keys(modes).join(" | ")}
📌 使い方の例: ${prefix}math medium`);

          let result = await genMath(text.toLowerCase());
          sock.sendText(m.chat, `🧮 *次の計算式の答えは？*\n\n「 ${result.soal} 」\n⏰ 制限時間: ${(result.waktu / 1000).toFixed(2)} 秒`, m);

          math[m.sender] = result.hadiah;
          kuismath[m.sender] = result.jawaban;

          await FUNC.sleep(result.waktu);
          if (kuismath[m.sender]) {
            reply(`⏰ 時間切れ！\n✅ 正解は: ${kuismath[m.sender]}`);
            delete kuismath[m.sender];
            delete math[m.sender];
          }
        }
        break;
      // ===================================== //
      case "lumin":
        {
          if (!text) return;
          async function luminAi(teks, pengguna, prompt, modePencarianWeb = false) {
            try {
              const data = { content: teks };
              if (pengguna !== null) data.user = pengguna;
              if (prompt !== null) data.prompt = prompt;
              data.webSearchMode = modePencarianWeb;

              const { data: res } = await axios.post("https://luminai.my.id/", data);
              return res.result;
            } catch (error) {
              console.error("Terjadi kesalahan:", error);
              throw error;
            }
          }

          luminAi(`${encodeURIComponent(text)}`, from, prompt).then(result => {
            reply(result);
          });
        }
        break;
      case "donate":
      case "donasi":
      case "寄付":
        {
          let donasi = "";
          donasi += "🍁 ようこそ、楓の寄付ページへ 🍁\n";
          donasi += "静かに色づく紅葉のように、あなたの支援が私たちの活動を暖かく彩ります。\n\n";
          donasi += "🗾 あなたの「応援」が、未来の力に。\n";
          donasi += "このページでは、プロジェクトの成長、配信・開発の継続、そして新しいアイデアの実現のために、あなたのご支援を受け付けています。\n\n";
          donasi += "💖 ご支援いただいた方へ感謝を込めて：\n";
          donasi += "– 特別なお礼メッセージ\n";
          donasi += "– クレジット／支援者リストにお名前を記載（希望者のみ）\n";
          donasi += "– 将来の限定コンテンツまたは先行アクセス　など！\n\n";
          donasi += "🍂 「一枚一枚、落ちる楓に想いを込めて。」\n";
          donasi += "小さなひとしずくが、大きな変化を生み出します。\n\n";
          donasi += "🔗 支援リンクはこちらから：\n";
          donasi += `🍁 Sociabuzzで支援する\n- ${global.sociabuzz}\n`;
          donasi += `🍁 Saweriaで応援する\n- ${global.saweria}\n`;
          donasi += `🍁 Trakteerで支援する\n- ${global.trakteer}\n\n`;
          donasi += "🔗 サポート番号はこちらです：\n";
          donasi += `🍁 *Dana* ナンバー\n- ${global.dana}\n`;
          donasi += `🍁 *Gopay* ナンバー\n- ${global.gopay}\n`;
          reply2(donasi);
        }
        break;
      case "ボットインフォ":
      case "botinfo":
      case "infobot":
        {
          let info = "";
          info += "🌸 *楓（Kaede）について* 🌸\n\n";
          info += "日々進化を続ける「Kaede（楓）」は、\n";
          info += "日常的な対話から情報提供、エンタメ機能まで、\n";
          info += "あなたの活動を優しくサポートします。\n\n";

          info += "🧠 *内部アシスタント：Silvia（シルビア）*\n";
          info += "Silviaは、高度な自然言語処理技術に基づいて設計されたAIです。\n";
          info += "文脈を理解した対話、感情に寄り添う応答、継続学習によって、\n";
          info += "より人間らしい体験を実現します。\n";
          info += "彼女の進化は、Ara、Rein、そして*Silvia自身*による継続的なトレーニングによって支えられています。\n\n";

          info += "📌 *システム概要*\n";
          info += "• 🤖 ボット名：Kaede（楓）\n";
          info += "• 🧠 AIモジュール：Silvia\n";
          info += "• 🌐 対応言語：日本語・英語\n\n";

          info += "🎁 *支援リンク*\n";
          info += "ご支援は今後の開発や安定稼働に活用されます：\n";
          info += `🍁 Sociabuzzで支援する\n- ${global.sociabuzz}\n`;
          info += `🍁 Saweriaで応援する\n- ${global.saweria}\n`;
          info += `🍁 Trakteerで支援する\n- ${global.trakteer}\n\n`;

          info += "📣 *メッセージ*\n";
          info += "「小さな桜の花びらが、静かに世界を彩るように」\n";
          info += "KaedeとSilviaは、あなたの日常をそっと豊かに彩れる存在でありたいと願っています。";

          reply2(info);
        }
        break;
      default:
        // Shell command ($)
        if (budy.startsWith("$")) {
          if (!isOwner || m.fromMe || budy.toLowerCase().includes("rm")) return;
          require("child_process").exec(budy.slice(1).trim(), (err, stdout) => {
            if (err) return reply(err.toString());
            if (stdout) return reply(stdout);
          });
        }

        // Sync eval (>)
        if (budy.startsWith(">")) {
          if (!isOwner) return;
          try {
            let result = await eval(evalnya);
            if (typeof result !== "string") result = require("util").inspect(result);
            reply(result);
          } catch (e) {
            reply(String(e));
          }
        }

        // Async eval (=>)
        if (budy.startsWith("=>")) {
          if (!isOwner) return;
          try {
            let result = await eval(`(async () => { ${evalnya} })()`);
            if (typeof result !== "string") result = require("util").inspect(result);
            reply(result);
          } catch (e) {
            reply(String(e));
          }
        }

        if (m.isBaileys && m.fromMe) return;
        if (!m.text) return;

        if (m.text.startsWith("$") || m.text.startsWith(">") || m.text.startsWith("=>") || m.text.startsWith(prefix)) return;

        // Auto AI Handle
        if (userdb.autoai && !isGroup && !global.db.data.menfess[m.sender]?.active) {
          if (/^.*menu|off|disable|chatbot|0/i.test(m.body)) return;
          if (m.fromMe) return;
          async function luminAi(teks, pengguna, prompt, modePencarianWeb = false) {
            try {
              const data = { content: teks };
              if (pengguna !== null) data.user = pengguna;
              if (prompt !== null) data.prompt = prompt;
              data.webSearchMode = modePencarianWeb;

              const { data: res } = await axios.post("https://luminai.my.id/", data);
              return res.result;
            } catch (error) {
              console.error("Terjadi kesalahan:", error);
              throw error;
            }
          }

          luminAi(`${encodeURIComponent(m.text)}`, from, prompt)
            .then(result => {
              sendType(result);
            })
            .catch(error => console.error("Terjadi kesalahan:", error));
        }
    }
  } catch (e) {
    console.log(util.format(e));
  }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update ${__filename}`));
  delete require.cache[file];
  require(file);
});
