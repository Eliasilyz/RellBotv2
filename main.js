// 🌐 Global Config & Library
require("./all/global");
require("./all/Mongo/mongoose.js");
const func = require("./all/place");
const readline = require("readline");
const chalk = require("chalk");
const yargs = require("yargs/yargs");
const NodeCache = require("node-cache");
const _ = require("lodash");
const groupCache = new NodeCache({ stdTTL: 5 * 60, useClones: false });
const PhoneNumber = require("awesome-phonenumber");
const { loadUserList, handleNewUser } = require("./all/Mongo/users_id.js");
const { getProfilePicture, getGroupDescription, replacePlaceholders, buildContextInfo } = require("./all/library/suport/welcome.js");
const { useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require("baileys");
const { makeInMemoryStore } = require("./all/library/store");
const { Boom } = require("@hapi/boom");
const pino = require("pino");
const cron = require('node-cron');
const autoBackup = require('./backup.js');
const low = require("./all/library/lowdb");
const { Low, JSONFile } = low;

const usePairingCode = true;
const more = String.fromCharCode(8206);
const readmore = more.repeat(4800);

const store = makeInMemoryStore({
  logger: pino().child({ level: "silent", stream: "store" }),
});

const opts = yargs(process.argv.slice(2)).exitProcess(false).parse();
global.opts = opts;
const dbPath = "./all/json/database.json";
const db = new JSONFile(dbPath);

global.db = new Low(db);
global.DATABASE = global.db;

global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!global.db.READ) {
          clearInterval(interval);
          resolve(global.db.data == null ? global.loadDatabase() : global.db.data);
        }
      }, 1000);
    });
  }
  if (global.db.data !== null) return global.db.data;

  global.db.READ = true;
  await global.db.read();
  global.db.READ = false;

  global.db.data = {
    users: {},
    chats: {},
    game: {},
    menfess: {},
    settings: {},
    others: {},
    ...(global.db.data || {}),
  };

  global.db.chain = _.chain(global.db.data);
  return global.db.data;
};

global.loadDatabase();
loadUserList().catch(() => { });

if (global.db) {
  setInterval(async () => {
    if (global.db.data) await global.db.write();
  }, 30 * 1000);
}

const question = (text) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(text, (ans) => {
      rl.close();
      resolve(ans);
    });
  });
};

function getFormattedYear() {
  const currentYear = new Date().getFullYear().toString();
  return currentYear.replace('0', 'K');
}

async function startSesi() {
  await global.loadDatabase();
  const { state, saveCreds } = await useMultiFileAuthState(`./session`);
  const { version } = await fetchLatestBaileysVersion();

  const connectionOptions = {
    version,
    keepAliveIntervalMs: 30000,
    printQRInTerminal: !usePairingCode,
    logger: pino({ level: "silent" }),
    auth: state,
    browser: ["Mac OS", "Safari", "10.15.7"],
    cachedGroupMetadata: async (jid) => groupCache.get(jid),
    shouldSyncHistoryMessage: (msg) => {
      console.log(`\x1b[32mMemuat Chat [${msg.progress || 0}%]\x1b[39m`);
      return !!msg.syncType;
    },

    getMessage: async (key) => {
      if (store) {
        const msg = await store.loadMessage(key.remoteJid, key.id);
        return msg?.message || undefined;
      }
      return { conversation: "" };
    },
    patchMessageBeforeSending: async (msg) => {
      await sock.uploadPreKeysToServerIfRequired();
      return msg;
    }
  };

  const sock = func.makeWASocket(connectionOptions);
  if (usePairingCode && !sock.authState.creds.registered) {
    var phoneNumber = await question(chalk.black(chalk.bgCyan(`\nPlease enter your phone number:\n`)));
    phoneNumber = phoneNumber.replace(/[^0-9]/g, "");
    var code = await sock.requestPairingCode(phoneNumber.trim());
    code = code?.match(/.{1,4}/g)?.join("-") || code;
    console.log(chalk.black(chalk.bgCyan(`Code : `)), chalk.black(chalk.bgWhite(code)));
  }

  sock.ev.on("creds.update", await saveCreds);
  store?.bind(sock.ev);

  sock.ev.on("call", async (user) => {
    if (!global.anticall) return;
    for (let ff of user) {
      if (ff.status == "offer") {
        await sock.rejectCall(ff.id, ff.from);
      }
    }
  });

  sock.ev.on("contacts.update", async (update) => {
    for (let contact of update) {
      let id = sock.decodeJid(contact.id);
      if (store && store.contacts) store.contacts[id] = { id, name: contact.notify };
    }
  });

  sock.getName = async (jid, withoutContact = false) => {
    const id = sock.decodeJid(jid);
    let v;
    if (id.endsWith("@g.us")) {
      v = store.contacts[id] || {};
      if (!(v.name || v.subject)) {
        try {
          v = await sock.groupMetadata(id) || {};
        } catch {
          v = {};
        }
      }
      return v.name || v.subject || PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber("international");
    } else {
      v = id === "0@s.whatsapp.net" ? { id, name: "WhatsApp" } : id === sock.decodeJid(sock.user.id) ? sock.user : store.contacts[id] || {};
      return (withoutContact ? "" : v.name) || v.subject || v.verifiedName || PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber("international");
    }
  };

  const rateLimit = new Map();

  function isSpamming(userId) {
    const now = Date.now();
    const window = 1000;
    const maxCmd = 1;

    if (!rateLimit.has(userId)) {
      rateLimit.set(userId, [now]);
      return false;
    }

    const timestamps = rateLimit.get(userId).filter((ts) => now - ts < window);
    timestamps.push(now);
    rateLimit.set(userId, timestamps);

    return timestamps.length > maxCmd;
  }

  setInterval(() => {
    const now = Date.now();
    for (let [userId, timestamps] of rateLimit.entries()) {
      const filtered = timestamps.filter((ts) => now - ts < 3000);
      if (filtered.length > 0) {
        rateLimit.set(userId, filtered);
      } else {
        rateLimit.delete(userId);
      }
    }
  }, 60 * 1000);

  sock.ev.on("messages.upsert", async (chatUpdate) => {
    try {
      let m = chatUpdate.messages?.[0];
      if (!m || !m.message) return;
      const sender = sock.decodeJid(m.key.participantAlt || m.key.participant || m.key.remoteJidAlt || m.key.remoteJid || "");
      await handleNewUser(sender).catch(() => { });
      m.message = Object.keys(m.message)[0] === "ephemeralMessage" ? m.message.ephemeralMessage.message : m.message;
      if (m.key && m.key.remoteJid === "status@broadcast") {
        if (global.db?.data?.settings?.autoread) sock.readMessages([m.key]);
      }
      if (m.isBaileys) return;
      if (global.db?.data?.settings?.autoread) sock.readMessages([m.key]);
      m = func.smsg(sock, m, store);
      const teks = m.text || "";
      const isCmd = teks.startsWith(".");
      if (isCmd) {
        if (isSpamming(sender)) return;
      }
      require("./system.js")(sock, m, chatUpdate, store);
    } catch (err) {
      console.log(err);
    }
  });

  setInterval(async () => {
    try {
      if (global.db?.data?.settings?.autobio) {
        const userCount = Object.keys(global.db?.data?.users || {}).length;
        const isPublic = global.db?.data?.settings?.public !== false;
        const truthjson = [`Rein 👑 || ${userCount} Active Users`, `Rein 👑 || Status: ${!isPublic ? "Maintenance" : "Online"}`];
        if (!global.currentIndex) global.currentIndex = 0;
        const truth = truthjson[global.currentIndex];
        sock.updateProfileStatus(truth).catch((_) => _);
        global.currentIndex = (global.currentIndex + 1) % truthjson.length;
      }
    } catch (err) {
      // ignore autobio errors
    }
  }, 15 * 1000);

  cron.schedule('0 0,1 * * *', () => {
    autoBackup(sock, '62881026950162@s.whatsapp.net');
  });


  sock.ev.on("group-participants.update", async (anu) => {
    try {
      const botNumber = await sock.decodeJid(sock.user.id);
      const { id: groupId, participants, action, author } = anu;
      if (!global.db?.data?.chats) global.db.data.chats = {};
      const chatSettings = global.db.data.chats[groupId] || {};
      const isPublic = global.db?.data?.settings?.public !== false;

      if (participants.includes(botNumber) || !chatSettings.welcomer || !isPublic) return;

      const metadata = await sock.groupMetadata(groupId);
      const totalMembers = metadata.participants.length;
      const groupName = metadata.subject;
      const groupDesc = getGroupDescription(metadata);

      for (let num of participants) {
        const isKickBySomeoneElse = author && author !== num && author.length > 1;
        const tagList = isKickBySomeoneElse ? [author, num] : [num];
        const userName = await sock.getName(num);
        const userPp = await getProfilePicture(sock, num);
        const placeholders = {
          user: `@${num.split("@")[0]}`,
          group: groupName,
          desc: groupDesc,
          readmore,
          member: totalMembers,
        };

        if (action === "add") {
          const welcomeTemplate = chatSettings.welcometxt;
          const welcomeText = replacePlaceholders(welcomeTemplate, placeholders);
          await sock.sendMessage(groupId, {
            text: welcomeText,
            contextInfo: buildContextInfo({
              mentionedJid: tagList,
              title: userName,
              body: global.namabot + " " + getFormattedYear(),
              thumbnailUrl: userPp,
            }),
          });
        }

        if (action === "remove") {
          const leftTemplate = chatSettings.leftxt;
          const leftText = replacePlaceholders(leftTemplate, placeholders);
          await sock.sendMessage(groupId, {
            text: leftText,
            contextInfo: buildContextInfo({
              mentionedJid: tagList,
              title: userName,
              body: global.namabot + " " + getFormattedYear(),
              thumbnailUrl: userPp,
            }),
          });
        }
      }
    } catch (err) {
      console.error("Error di handler group-participants.update:", err);
    }
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
      console.log(color("[✖️] SOCKET failed", "red"));
      //console.log(color(lastDisconnect?.error, "deeppink"));

      if (reason === DisconnectReason.badSession) {
        console.log(color("Bad Session File", "red"));
        process.exit(1);
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log(color("Connection closed", "deeppink"));
        process.exit(1);
      } else if (reason === DisconnectReason.restartRequired) {
        console.log(color("Restart Required", "yellow"));
        process.exit(1);
      } else if (reason === DisconnectReason.connectionLost) {
        console.log(color("Connection lost", "deeppink"));
        process.exit(1);
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log(color("Connection Replaced", "red"));
        sock.logout();
      } else if (reason === DisconnectReason.loggedOut) {
        console.log(color("Device Logged Out", "red"));
        sock.logout();
      } else if (reason === DisconnectReason.timedOut) {
        console.log(color("Connection TimedOut", "deeppink"));
        process.exit(1);
      } else {
        console.log(color("Unhandled reason", "red"));
        process.exit(1);
      }
    } else if (connection === "open") {
      console.log(color("[✔] SOCKET Ready"));
    }
  });

  return sock;
}

startSesi();

process.on("uncaughtException", function (err) {
  console.log("Caught exception: ", err);
});
