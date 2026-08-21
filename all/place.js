const fs = require("fs");
const path = require("path");
const axios = require("axios");
const chalk = require("chalk");
const util = require("util");
const Pino = require("pino");
const FileType = require("file-type");
const { randomBytes } = require("crypto");

const {
  proto,
  WAProto,
  jidDecode,
  chatUpdate,
  uploadMedia,
  makeWASocket,
  getContentType,
  DisconnectReason,
  generateWAMessage,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  prepareMessageFromContent,
  downloadContentFromMessage,
  generateWAMessageFromContent,
} = require("baileys");

const { makeInMemoryStore, resolveLid } = require("./library/store");

const { getBuffer: defaultGetBuffer, getSizeMedia } = require("./library/myfunc");

const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require("./exif");

const { isJidNewsletter } = require("baileys/lib/WABinary");

const store = makeInMemoryStore({
  logger: Pino({ level: "silent" }),
});

const delay = (ms) => ms && new Promise((resolve) => setTimeout(resolve, ms));

const rdm = () => {
  const randomNumbers = [];
  for (let i = 0; i < 10; i++) {
    const randomNumber = Math.floor(Math.random() * 10);
    randomNumbers.push(randomNumber);
  }
  return randomNumbers.join("");
};
let makeid = rdm();
//const makeid = crypto.randomBytes(3).toString('hex')

const getBuffer = async (url, options) => {
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
  } catch (e) {
    console.log(`Error in getBuffer: ${e}`);
  }
};

exports.makeWASocket = (connectionOptions, options = {}) => {
  const RuzXD = makeWASocket(connectionOptions);

  RuzXD.inspectLink = async (code) => {
    const extractGroupInviteMetadata = (content) => {
      const group = getBinaryNodeChild(content, "group");
      const descChild = getBinaryNodeChild(group, "description");
      let desc, descId;
      if (descChild) {
        desc = getBinaryNodeChild(descChild, "body").content.toString();
        descId = descChild.attrs.id;
      }
      const groupId = group.attrs.id.includes("@") ? group.attrs.id : group.attrs.id + "@g.us";
      const metadata = {
        id: groupId,
        subject: group.attrs.subject || "Not Found",
        creator: group.attrs.creator || "Not Found",
        creation: group.attrs.creation || "Not Found",
        desc,
        descId,
      };
      return metadata;
    };
    let results = await RuzXD.query({
      tag: "iq",
      attrs: {
        type: "get",
        xmlns: "w:g2",
        to: "@g.us",
      },
      content: [{ tag: "invite", attrs: { code } }],
    });
    return extractGroupInviteMetadata(results);
  };

  function updateNameToDb(contacts) {
    if (!contacts) return;
    for (let contact of contacts) {
      let id = RuzXD.decodeJid(contact.id);
      if (!id) continue;
      let chats = RuzXD.contacts[id];
      if (!chats) chats = { id };
      let chat = {
        ...chats,
        ...({
          ...contact,
          id,
          ...(id.endsWith("@g.us") ? { subject: contact.subject || chats.subject || "" } : { name: contact.notify || chats.name || chats.notify || "" }),
        } || {}),
      };
      RuzXD.contacts[id] = chat;
    }
  }

  RuzXD.ev.on("contacts.upsert", updateNameToDb);
  RuzXD.ev.on("groups.update", updateNameToDb);

  RuzXD.loadMessage = (messageID) => {
    return Object.entries(RuzXD.chats)
      .filter(([_, { messages }]) => typeof messages === "object")
      .find(([_, { messages }]) => Object.entries(messages).find(([k, v]) => k === messageID || v.key?.id === messageID))?.[1].messages?.[messageID];
  };

  RuzXD.decodeJid = (jid) => {
    if (!jid) return jid;
    if (global.lidToPnMap && global.lidToPnMap[jid]) {
      return global.lidToPnMap[jid];
    }
    if (typeof jid === "string" && jid.endsWith("@lid")) {
      const user = jid.split("@")[0].split(":")[0];
      if (global.lidToPnMap && global.lidToPnMap[user]) {
        return global.lidToPnMap[user];
      }
    }
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return (decode.user && decode.server && decode.user + "@" + decode.server) || jid;
    } else return jid;
  };

  if (RuzXD.user && RuzXD.user.id) RuzXD.user.jid = RuzXD.decodeJid(RuzXD.user.id);
  RuzXD.chats = {};
  RuzXD.contacts = {};

  RuzXD.sendMessageV2 = async (chatId, message, options = {}) => {
    let targetJid = chatId;

    if (chatId?.endsWith('@lid')) {
      const mappedPn =
        await RuzXD.signalRepository?.lidMapping?.getPNForLID(chatId);

      if (mappedPn) {
        targetJid = `${mappedPn}@s.whatsapp.net`;
      }
    }

    console.log('[sendMessageV2]', {
      chatId,
      targetJid
    });

    // Jangan pakai targetJid sebagai key generate
    const generate = await generateWAMessage(
      chatId,
      message,
      options
    );

    const type = getContentType(generate.message);

    if (!type) {
      throw new Error('Unable to determine message type');
    }

    if (options?.contextInfo) {
      generate.message[type].contextInfo = options.contextInfo;
    }

    if (message?.contextInfo) {
      generate.message[type].contextInfo = message.contextInfo;
    }

    return await RuzXD.relayMessage(
      targetJid,
      generate.message,
      {
        messageId: generate.key.id
      }
    );
  };



  RuzXD.logger = {
    ...RuzXD.logger,
    info(...args) {
      console.log(chalk.bold.rgb(57, 183, 16)(`INFO [${chalk.rgb(255, 255, 255)(new Date())}]:`), chalk.cyan(...args));
    },
    error(...args) {
      console.log(chalk.bold.rgb(247, 38, 33)(`ERROR [${chalk.rgb(255, 255, 255)(new Date())}]:`), chalk.rgb(255, 38, 0)(...args));
    },
    warn(...args) {
      console.log(chalk.bold.rgb(239, 225, 3)(`WARNING [${chalk.rgb(255, 255, 255)(new Date())}]:`), chalk.keyword("orange")(...args));
    },
  };

  RuzXD.getFile = async (PATH, returnAsFilename) => {
    let res, filename;
    let data = Buffer.isBuffer(PATH)
      ? PATH
      : /^data:.*?\/.*?;base64,/i.test(PATH)
        ? Buffer.from(PATH.split`,`[1], "base64")
        : /^https?:\/\//.test(PATH)
          ? await (res = await fetch(PATH)).buffer()
          : fs.existsSync(PATH)
            ? ((filename = PATH), fs.readFileSync(PATH))
            : typeof PATH === "string"
              ? PATH
              : Buffer.alloc(0);
    if (!Buffer.isBuffer(data)) throw new TypeError("Result is not a buffer");
    let type = (await FileType.fromBuffer(data)) || {
      mime: "application/octet-stream",
      ext: ".bin",
    };
    if (data && returnAsFilename && !filename) (filename = path.join(__dirname, "../media/tmp/" + new Date() * 1 + "." + type.ext)), await fs.promises.writeFile(filename, data);
    return {
      res,
      filename,
      ...type,
      data,
    };
  };

  RuzXD.waitEvent = (eventName, is = () => true, maxTries = 25) => {
    return new Promise((resolve, reject) => {
      let tries = 0;
      let on = (...args) => {
        if (++tries > maxTries) reject("Max tries reached");
        else if (is()) {
          RuzXD.ev.off(eventName, on);
          resolve(...args);
        }
      };
      RuzXD.ev.on(eventName, on);
    });
  };

  RuzXD.sendMedia = async (jid, path, quoted, options = {}) => {
    let { ext, mime, data } = await RuzXD.getFile(path);
    messageType = mime.split("/")[0];
    pase = messageType.replace("application", "document") || messageType;
    return await RuzXD.sendMessage(jid, { [`${pase}`]: data, mimetype: mime, ...options }, { quoted });
  };

  RuzXD.sendContact = async (jid, contacts = [], quoted = "", opts = {}) => {
    const list = contacts.map((contact) => {
      const {
        number,
        name,
        title = "Developer",
        org = "Sekai-Team",
      } = contact;

      const vcard = "BEGIN:VCARD\n" + "VERSION:3.0\n" + `N:;${name};;;\n` + `FN:${name}\n` + `ORG:${org}\n` + `TITLE:${title}\n` + `TEL;type=CELL;type=VOICE;waid=${number}:${number}\n` + "END:VCARD";

      return {
        displayName: name,
        vcard,
      };
    });

    await RuzXD.sendMessage(
      jid,
      {
        contacts: {
          displayName: `${list.length} Kontak`,
          contacts: list,
        },
        ...opts,
      },
      { quoted }
    );
  };

  RuzXD.setStatus = async (status) => {
    return await RuzXD.query({
      tag: "iq",
      attrs: {
        to: "s.whatsapp.net",
        type: "set",
        xmlns: "status",
      },
      content: [
        {
          tag: "status",
          attrs: {},
          content: Buffer.from(status, "utf-8"),
        },
      ],
    });
  };

  RuzXD.reply = (jid, text = "", quoted, options) => {
    return Buffer.isBuffer(text) ? this.sendFile(jid, text, "file", "", quoted, false, options) : RuzXD.sendMessage(jid, { ...options, text }, { quoted, ...options });
  };

  RuzXD.sendStimg = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], "base64") : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifImg(buff, options);
    } else {
      buffer = await imageToWebp(buff);
    }
    await RuzXD.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
    return buffer;
  };

  RuzXD.sendStvid = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], "base64") : /^https?:\/\//.test(path) ? await getBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifVid(buff, options);
    } else {
      buffer = await videoToWebp(buff);
    }
    await RuzXD.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
    return buffer;
  };

  RuzXD.sendGroupV4Invite = async (jid, participant, inviteCode, inviteExpiration, groupName = "unknown subject", caption = "Invitation to join my WhatsApp group", options = {}) => {
    let msg = proto.Message.fromObject({
      groupInviteMessage: proto.GroupInviteMessage.fromObject({
        inviteCode,
        inviteExpiration: parseInt(inviteExpiration) || +new Date(new Date() + 3 * 86400000),
        groupJid: jid,
        groupName: groupName ? groupName : this.getName(jid),
        caption,
      }),
    });
    let message = await this.prepareMessageFromContent(participant, msg, options);
    await this.relayWAMessage(message);
    return message;
  };

  RuzXD.cMod = async (jid, message, text = "", sender = RuzXD.user.jid, options = {}) => {
    if (options.mentions && !Array.isArray(options.mentions)) options.mentions = [options.mentions];
    let copy = message.toJSON();
    delete copy.message.messageContextInfo;
    delete copy.message.senderKeyDistributionMessage;
    let mtype = Object.keys(copy.message)[0];
    let msg = copy.message;
    let content = msg[mtype];
    if (typeof content === "string") msg[mtype] = text || content;
    else if (content.caption) content.caption = text || content.caption;
    else if (content.text) content.text = text || content.text;
    if (typeof content !== "string") {
      msg[mtype] = { ...content, ...options };
      msg[mtype].contextInfo = {
        ...(content.contextInfo || {}),
        mentionedJid: options.mentions || content.contextInfo?.mentionedJid || [],
      };
    }
    if (copy.participant) sender = copy.participant = sender || copy.participant;
    else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant;
    if (copy.key.remoteJid.includes("@s.whatsapp.net")) sender = sender || copy.key.remoteJid;
    else if (copy.key.remoteJid.includes("@broadcast")) sender = sender || copy.key.remoteJid;
    copy.key.remoteJid = jid;
    copy.key.fromMe = areJidsSameUser(sender, RuzXD.user.id) || false;
    return proto.WebMessageInfo.fromObject(copy);
  };

  RuzXD.copyNForward = async (jid, message, forwardingScore = true, options = {}) => {
    let m = generateForwardMessageContent(message, !!forwardingScore);
    let mtype = Object.keys(m)[0];
    if (forwardingScore && typeof forwardingScore == "number" && forwardingScore > 1) m[mtype].contextInfo.forwardingScore += forwardingScore;
    m = generateWAMessageFromContent(jid, m, { ...options, userJid: RuzXD.user.id });
    await RuzXD.relayMessage(jid, m.message, { messageId: m.key.id, additionalAttributes: { ...options } });
    return m;
  };

  RuzXD.downloadM = async (m, type, filename = "") => {
    if (!m || !(m.url || m.directPath)) return Buffer.alloc(0);
    const stream = await downloadContentFromMessage(m, type);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    if (filename) await fs.promises.writeFile(filename, buffer);
    return filename && fs.existsSync(filename) ? filename : buffer;
  };

  RuzXD.downloadMed = async (message, filename, attachExtension = true) => {
    let mime = (message.msg || message).mimetype || "";
    let messageType = mime.split("/")[0].replace("application", "document") ? mime.split("/")[0].replace("application", "document") : mime.split("/")[0];
    const stream = await downloadContentFromMessage(message, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    let type = await FileType.fromBuffer(buffer);
    let trueFileName = attachExtension ? path.join(__dirname, "../media/tmp", `${makeid}.${type.ext}`) : filename;
    await fs.writeFileSync(trueFileName, buffer);
    return trueFileName;
  };

  RuzXD.chatRead = async (jid, participant, messageID) => {
    return await RuzXD.sendReadReceipt(jid, participant, [messageID]);
  };

  RuzXD.parseMention = (text = "") => {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + "@s.whatsapp.net");
  };

  RuzXD.saveName = async (id, name = "") => {
    if (!id) return;
    id = RuzXD.decodeJid(id);
    let isGroup = id.endsWith("@g.us");
    if (id in RuzXD.contacts && RuzXD.contacts[id][isGroup ? "subject" : "name"] && id in RuzXD.chats) return;
    let metadata = {};
    if (isGroup) metadata = await RuzXD.groupMetadata(id);
    let chat = { ...(RuzXD.contacts[id] || {}), id, ...(isGroup ? { subject: metadata.subject, desc: metadata.desc } : { name }) };
    RuzXD.contacts[id] = chat;
    RuzXD.chats[id] = chat;
  };

  RuzXD.processMessageStubType = async (m) => {
    if (!m.messageStubType) return;
    const chat = RuzXD.decodeJid(m.key.remoteJid || m.message?.senderKeyDistributionMessage?.groupId || "");
    if (!chat || chat === "status@broadcast") return;
    const emitGroupUpdate = (update) => {
      ev.emit("groups.update", [{ id: chat, ...update }]);
    };
    switch (m.messageStubType) {
      case WAMessageStubType.REVOKE:
      case WAMessageStubType.GROUP_CHANGE_INVITE_LINK:
        emitGroupUpdate({ revoke: m.messageStubParameters[0] });
        break;
      case WAMessageStubType.GROUP_CHANGE_ICON:
        emitGroupUpdate({ icon: m.messageStubParameters[0] });
        break;
      default: {
        console.log({
          messageStubType: m.messageStubType,
          messageStubParameters: m.messageStubParameters,
          type: WAMessageStubType[m.messageStubType],
        });
        break;
      }
    }
    const isGroup = chat.endsWith("@g.us");
    if (!isGroup) return;
    let chats = RuzXD.chats[chat];
    if (!chats) chats = RuzXD.chats[chat] = { id: chat };
    chats.isChats = true;
    const metadata = await RuzXD.groupMetadata(chat).catch((_) => null);
    if (!metadata) return;
    chats.subject = metadata.subject;
    chats.metadata = metadata;
  };

  RuzXD.insertAllGroup = async () => {
    const groups = (await RuzXD.groupFetchAllParticipating().catch((_) => null)) || {};
    for (const group in groups) RuzXD.chats[group] = { ...(RuzXD.chats[group] || {}), id: group, subject: groups[group].subject, isChats: true, metadata: groups[group] };
    return RuzXD.chats;
  };

  RuzXD.pushMessage = async (m) => {
    if (!m) return;
    if (!Array.isArray(m)) m = [m];
    for (const message of m) {
      try {
        if (!message) continue;
        if (message.messageStubType && message.messageStubType != WAMessageStubType.CIPHERTEXT) RuzXD.processMessageStubType(message).catch(console.error);
        const _mtype = Object.keys(message.message || {});
        const mtype = (!["senderKeyDistributionMessage", "messageContextInfo"].includes(_mtype[0]) && _mtype[0]) || (_mtype.length >= 3 && _mtype[1] !== "messageContextInfo" && _mtype[1]) || _mtype[_mtype.length - 1];
        const chat = RuzXD.decodeJid(message.key.remoteJid || message.message?.senderKeyDistributionMessage?.groupId || "");
        if (message.message?.[mtype]?.contextInfo?.quotedMessage) {
          let context = message.message[mtype].contextInfo;
          let participant = RuzXD.decodeJid(context.participant);
          const remoteJid = RuzXD.decodeJid(context.remoteJid || participant);
          let quoted = message.message[mtype].contextInfo.quotedMessage;
          if (remoteJid && remoteJid !== "status@broadcast" && quoted) {
            let qMtype = Object.keys(quoted)[0];
            if (qMtype == "conversation") {
              quoted.extendedTextMessage = { text: quoted[qMtype] };
              delete quoted.conversation;
              qMtype = "extendedTextMessage";
            }
            if (!quoted[qMtype].contextInfo) quoted[qMtype].contextInfo = {};
            quoted[qMtype].contextInfo.mentionedJid = context.mentionedJid || quoted[qMtype].contextInfo.mentionedJid || [];
            const isGroup = remoteJid.endsWith("g.us");
            if (isGroup && !participant) participant = remoteJid;
            const qM = {
              key: {
                remoteJid,
                fromMe: areJidsSameUser(RuzXD.user.jid, remoteJid),
                id: context.stanzaId,
                participant,
              },
              message: JSON.parse(JSON.stringify(quoted)),
              ...(isGroup ? { participant } : {}),
            };
            let qChats = RuzXD.chats[participant];
            if (!qChats) qChats = RuzXD.chats[participant] = { id: participant, isChats: !isGroup };
            if (!qChats.messages) qChats.messages = {};
            if (!qChats.messages[context.stanzaId] && !qM.key.fromMe) qChats.messages[context.stanzaId] = qM;
            let qChatsMessages;
            if ((qChatsMessages = Object.entries(qChats.messages)).length > 40) qChats.messages = Object.fromEntries(qChatsMessages.slice(30, qChatsMessages.length)); // maybe avoid memory leak
          }
        }
        if (!chat || chat === "status@broadcast") continue;
        const isGroup = chat.endsWith("@g.us");
        let chats = RuzXD.chats[chat];
        if (!chats) {
          if (isGroup) await RuzXD.insertAllGroup().catch(console.error);
          chats = RuzXD.chats[chat] = { id: chat, isChats: true, ...(RuzXD.chats[chat] || {}) };
        }
        let metadata, sender;
        if (isGroup) {
          if (!chats.subject || !chats.metadata) {
            metadata = (await RuzXD.groupMetadata(chat).catch((_) => ({}))) || {};
            if (!chats.subject) chats.subject = metadata.subject || "";
            if (!chats.metadata) chats.metadata = metadata;
          }
          sender = RuzXD.decodeJid((message.key?.fromMe && RuzXD.user.id) || message.participant || message.key?.participant || chat || "");
          if (sender !== chat) {
            let chats = RuzXD.chats[sender];
            if (!chats) chats = RuzXD.chats[sender] = { id: sender };
            if (!chats.name) chats.name = message.pushName || chats.name || "";
          }
        } else if (!chats.name) chats.name = message.pushName || chats.name || "";
        if (["senderKeyDistributionMessage", "messageContextInfo"].includes(mtype)) continue;
        chats.isChats = true;
        if (!chats.messages) chats.messages = {};
        const fromMe = message.key.fromMe || areJidsSameUser(sender || chat, RuzXD.user.id);
        if (!["protocolMessage"].includes(mtype) && !fromMe && message.messageStubType != WAMessageStubType.CIPHERTEXT && message.message) {
          delete message.message.messageContextInfo;
          delete message.message.senderKeyDistributionMessage;
          chats.messages[message.key.id] = JSON.parse(JSON.stringify(message, null, 2));
          let chatsMessages;
          if ((chatsMessages = Object.entries(chats.messages)).length > 40) chats.messages = Object.fromEntries(chatsMessages.slice(30, chatsMessages.length));
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  RuzXD.getBusinessProfile = async (jid) => {
    const results = await RuzXD.query({
      tag: "iq",
      attrs: {
        to: "s.whatsapp.net",
        xmlns: "w:biz",
        type: "get",
      },
      content: [
        {
          tag: "business_profile",
          attrs: { v: "244" },
          content: [
            {
              tag: "profile",
              attrs: { jid },
            },
          ],
        },
      ],
    });
    const profiles = getBinaryNodeChild(getBinaryNodeChild(results, "business_profile"), "profile");
    if (!profiles) return {}; // if not bussines
    const address = getBinaryNodeChild(profiles, "address");
    const description = getBinaryNodeChild(profiles, "description");
    const website = getBinaryNodeChild(profiles, "website");
    const email = getBinaryNodeChild(profiles, "email");
    const category = getBinaryNodeChild(getBinaryNodeChild(profiles, "categories"), "category");
    return {
      jid: profiles.attrs?.jid,
      address: address?.content.toString(),
      description: description?.content.toString(),
      website: website?.content.toString(),
      email: email?.content.toString(),
      category: category?.content.toString(),
    };
  };

  RuzXD.msToDate = (ms) => {
    let days = Math.floor(ms / (24 * 60 * 60 * 1000));
    let daysms = ms % (24 * 60 * 60 * 1000);
    let hours = Math.floor(daysms / (60 * 60 * 1000));
    let hoursms = ms % (60 * 60 * 1000);
    let minutes = Math.floor(hoursms / (60 * 1000));
    let minutesms = ms % (60 * 1000);
    let sec = Math.floor(minutesms / 1000);
    return days + " Hari " + hours + " Jam " + minutes + " Menit";
  };

  RuzXD.msToTime = (ms) => {
    let h = isNaN(ms) ? "--" : Math.floor(ms / 3600000);
    let m = isNaN(ms) ? "--" : Math.floor(ms / 60000) % 60;
    let s = isNaN(ms) ? "--" : Math.floor(ms / 1000) % 60;
    return [h + " Jam ", m + " Menit ", s + " Detik"].map((v) => v.toString().padStart(2, 0)).join(" ");
  };

  RuzXD.msToHour = (ms) => {
    let h = isNaN(ms) ? "--" : Math.floor(ms / 3600000);
    return [h + " Jam "].map((v) => v.toString().padStart(2, 0)).join(" ");
  };

  RuzXD.msToMinute = (ms) => {
    let m = isNaN(ms) ? "--" : Math.floor(ms / 60000) % 60;
    return [m + " Menit "].map((v) => v.toString().padStart(2, 0)).join(" ");
  };

  RuzXD.msToSecond = (ms) => {
    let s = isNaN(ms) ? "--" : Math.floor(ms / 1000) % 60;
    return [s + " Detik"].map((v) => v.toString().padStart(2, 0)).join(" ");
  };

  RuzXD.clockString = (ms) => {
    let h = isNaN(ms) ? "--" : Math.floor(ms / 3600000);
    let m = isNaN(ms) ? "--" : Math.floor(ms / 60000) % 60;
    let s = isNaN(ms) ? "--" : Math.floor(ms / 1000) % 60;
    return [h + " Jam ", m + " Menit ", s + " Detik"].map((v) => v.toString().padStart(2, 0)).join(" ");
  };

  RuzXD.join = (arr) => {
    let construct = [];
    for (let i = 0; i < arr.length; i++) {
      construct = construct.concat(arr[i]);
    }
    return construct;
  };

  RuzXD.pickRandom = (list) => {
    return list[Math.floor(list.length * Math.random())];
  };

  RuzXD.delay = (ms) => {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
  };

  RuzXD.filter = (text) => {
    let mati = ["q", "w", "r", "t", "y", "p", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"];
    if (/[aiueo][aiueo]([qwrtypsdfghjklzxcvbnm])?$/i.test(text)) return text.substring(text.length - 1);
    else {
      let res = Array.from(text).filter((v) => mati.includes(v));
      let resu = res[res.length - 1];
      for (let huruf of mati) {
        if (text.endsWith(huruf)) {
          resu = res[res.length - 2];
        }
      }
      let misah = text.split(resu);
      return resu + misah[misah.length - 1];
    }
  };

  RuzXD.format = (...args) => {
    return util.format(...args);
  };

  RuzXD.serializeM = (m) => {
    return exports.smsg(RuzXD, m);
  };

  RuzXD.sendText = (jid, text, quoted = "", options) => RuzXD.sendMessage(jid, { text: text, ...options }, { quoted });

  RuzXD.sendImage = async (jid, path, caption = "", setquoted, options) => {
    let buffer = Buffer.isBuffer(path) ? path : await getBuffer(path);
    return await RuzXD.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted: setquoted });
  };

  RuzXD.sendVideo = async (jid, yo, caption = "", quoted = "", gif = false, options) => {
    return await RuzXD.sendMessage(jid, { video: yo, caption: caption, gifPlayback: gif, ...options }, { quoted });
  };

  RuzXD.sendAudio = async (jid, path, quoted = "", ptt = false, options) => {
    let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], "base64") : /^https?:\/\//.test(path) ? await await getBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
    return await RuzXD.sendMessage(jid, { audio: buffer, ptt: ptt, ...options }, { quoted });
  };

  RuzXD.sendTextWithMentions = async (jid, text, quoted, options = {}) => RuzXD.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map((v) => v[1] + "@s.whatsapp.net") }, ...options }, { quoted });

  RuzXD.sendGroupV4Invite = async (jid, participant, inviteCode, inviteExpiration, groupName = "unknown subject", jpegThumbnail, caption = "Invitation to join my WhatsApp group", options = {}) => {
    let msg = WAProto.Message.fromObject({
      groupInviteMessage: WAProto.GroupInviteMessage.fromObject({
        inviteCode,
        inviteExpiration: inviteExpiration ? parseInt(inviteExpiration) : +new Date(new Date() + 3 * 86400000),
        groupJid: jid,
        groupName: groupName ? groupName : (await RuzXD.groupMetadata(jid)).subject,
        jpegThumbnail: jpegThumbnail ? (await getBuffer(jpegThumbnail)).buffer : "",
        caption,
      }),
    });
    const m = generateWAMessageFromContent(participant, msg, options);
    return await RuzXD.relayMessage(participant, m.message, { messageId: m.key.id });
  };

  RuzXD.sendPoll = async (jid, title = "", but = []) => {
    let pollCreation = generateWAMessageFromContent(
      jid,
      proto.Message.fromObject({
        pollCreationMessage: {
          name: title,
          options: but,
          selectableOptionsCount: but.length,
        },
      }),
      { userJid: jid }
    );
    return RuzXD.relayMessage(jid, pollCreation.message, { messageId: pollCreation.key.id });
  };

  RuzXD.sendOrder = async (jid, text, img, itcount, ammount, qnya = m) => {
    const order = generateWAMessageFromContent(
      jid,
      proto.Message.fromObject({
        orderMessage: {
          orderId: "65bh4ddqr90",
          thumbnail: img,
          itemCount: itcount,
          status: "INQUIRY",
          surface: "CATALOG",
          orderTitle: "product",
          message: text,
          sellerJid: m.sender,
          token: "775BBQR0",
          totalAmount1000: ammount,
          totalCurrencyCode: "IDR",
          contextInfo: {
            mentionedJid: [m.sender],
          },
        },
      }),
      { userJid: m.sender, quoted: qnya }
    );
    return RuzXD.relayMessage(jid, order.message, { messageId: order.key.id });
  };

  RuzXD.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
    let quoted = message.msg ? message.msg : message;
    let mime = (message.msg || message).mimetype || "";
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, "") : mime.split("/")[0];
    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    let type = await FileType.fromBuffer(buffer);

    trueFileName = attachExtension ? path.join(__dirname, "../media/tmp", `${makeid}.${type.ext}`) : filename;
    await fs.writeFileSync(trueFileName, buffer);
    return trueFileName;
  };

  RuzXD.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || "";
    let messageType = message.type ? message.type.replace(/Message/gi, "") : mime.split("/")[0];
    const stream = await downloadContentFromMessage(message, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
  };

  RuzXD.sendFile = async (jid, PATH, fileName, quoted = {}, options = {}) => {
    let { filename, size, ext, mime, data } = await RuzXD.getFile(PATH, true);
    let type = "";
    let mimetype = mime;
    let pathFile = filename;

    if (options.asDocument) type = "document";
    if (options.asSticker || /webp/.test(mime)) {
      let media = { mimetype: mime, data };
      pathFile = await writeExifImg(media, {
        packname: global.packname,
        author: global.packname2,
        categories: options.categories || [],
      });
      await fs.promises.unlink(filename);
      type = "sticker";
      mimetype = "image/webp";
    } else if (/image/.test(mime)) type = "image";
    else if (/video/.test(mime)) type = "video";
    else if (/audio/.test(mime)) type = "audio";
    else type = "document";

    await RuzXD.sendMessage(jid, { [type]: { url: pathFile }, mimetype, fileName, ...options }, { quoted, ...options });
    return fs.promises.unlink(pathFile);
  };

  RuzXD.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.+;base64,/i.test(path) ? Buffer.from(path.split`,`[1], "base64") : /^https?:\/\//.test(path) ? await defaultGetBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
    let buffer;
    if (options.packname || options.author) {
      buffer = await writeExifImg(buff, options);
    } else {
      buffer = await imageToWebp(buff);
    }
    await RuzXD.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
    return buffer;
  };

  RuzXD.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.+;base64,/i.test(path) ? Buffer.from(path.split`,`[1], "base64") : /^https?:\/\//.test(path) ? await defaultGetBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
    let buffer;
    if (options.packname || options.author) {
      buffer = await writeExifVid(buff, options);
    } else {
      buffer = await videoToWebp(buff);
    }
    await RuzXD.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
    return buffer;
  };

  RuzXD.sendAlbumMessage = async function (jid, medias = [], options = {}) {
    if (!Array.isArray(medias) || medias.length < 2) throw new RangeError("Minimum 2 media");
    for (const media of medias) {
      if (!media.image && !media.video) throw new TypeError("Each media item must have an image or video property.");
    }
    const time = options.delay || 500;
    const quoted = options.quoted;
    delete options.delay;
    delete options.quoted;
    const userJid = RuzXD.user.id;

    const album = await generateWAMessageFromContent(
      jid,
      {
        albumMessage: {
          expectedImageCount: medias.filter((m) => m.image).length,
          expectedVideoCount: medias.filter((m) => m.video).length,
          ...options,
        },
      },
      { userJid, ...options }
    );
    await RuzXD.relayMessage(jid, album.message, { messageId: album.key.id });

    for (const media of medias) {
      const content = media.image ? { image: media.image } : { video: media.video };
      const msg = await generateWAMessage(
        jid,
        { ...content, ...media, ...options },
        {
          userJid,
          upload: async (readStream, opts) => {
            const up = await RuzXD.waUploadToServer(readStream, { ...opts, newsletter: isJidNewsletter(jid) });
            return up;
          },
          ...options,
        }
      );
      msg.message.messageContextInfo = {
        messageSecret: randomBytes(32),
        messageAssociation: { associationType: 1, parentMessageKey: album.key },
      };
      await RuzXD.relayMessage(jid, msg.message, { messageId: msg.key.id, ...(quoted && { quoted }) });
      await delay(time);
    }
    return album;
  };

  Object.defineProperty(RuzXD, "name", {
    value: { ...(options.chats || {}) },
    configurable: true,
  });
  if (RuzXD.user?.id) RuzXD.user.jid = RuzXD.decodeJid(RuzXD.user.id);
  store.bind(RuzXD.ev);
  return RuzXD;
};
exports.smsg = (conn, m, store) => {
  if (!m) return m;
  let M = proto.WebMessageInfo;
  var m = M.fromObject(m);
  if (m.key) {
    m.id = m.key.id;
    m.isBaileys = m.id.startsWith("BAE5") && m.id.length === 16;

    // m.chat: use original remoteJid (may be @lid) — Baileys v7 routes @lid natively
    m.chat = conn.decodeJid(m.key.remoteJid || "");

    m.fromMe = m.key.fromMe;
    m.isGroup = m.chat.endsWith("@g.us");

    // m.sender: resolve @lid → PN for permission/owner comparisons
    let rawParticipant = m.key.participantAlt || m.key.remoteJidAlt || m.participant || m.key.participant || "";
    if (rawParticipant.endsWith("@lid")) {
      rawParticipant = conn.decodeJid(rawParticipant); // tries lidToPnMap
    }
    const rawSenderFallback = m.key.remoteJidAlt || m.key.remoteJid || "";
    m.sender = conn.decodeJid((m.fromMe && conn.user?.id) || rawParticipant || rawSenderFallback || "");

    if (m.isGroup) {
      m.participant = conn.decodeJid(m.key.participantAlt || m.key.participant) || "";
    }
  }
  if (m.message) {
    m.mtype = getTypeMessage(m.message);
    m.msg = m.mtype == "viewOnceMessage" ? m.message[m.mtype].message[getTypeMessage(m.message[m.mtype].message)] : m.message[m.mtype];
    //		m.body = m.message.conversation || m.msg.caption || m.msg.text || (m.mtype == 'listResponseMessage') && m.msg.singleSelectReply.selectedRowId || (m.mtype == 'buttonsResponseMessage') && m.msg.selectedButtonId || (m.mtype == 'viewOnceMessage') && m.msg.caption || m.tex // (m.mtype === 'conversation' && m.message.conversation) ? m.message.conversation : (m.mtype == 'imageMessage') && m.message.imageMessage.caption ? m.message.imageMessage.caption : (type == 'videoMessage') && m.message.videoMessage.caption ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') && m.message.extendedTextMessage.text ? m.message.extendedTextMessage.text : (m.mtype == 'listResponseMessage') && m.message.listResponseMessage.singleSelectReply.selectedRowId ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'buttonsResponseMessage') && m.message.buttonsResponseMessage.selectedButtonId ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'templateButtonReplyMessage') && m.message.templateButtonReplyMessage.selectedId ? m.message.templateButtonReplyMessage.selectedId : ''

    try {
      m.body =
        m.message.conversation ||
        m.message[m.type].text ||
        m.message[m.type].caption ||
        (m.type === "listResponseMessage" && m.message[m.type].singleSelectReply.selectedRowId) ||
        (m.type === "buttonsResponseMessage" && m.message[m.type].selectedButtonId) ||
        (m.type === "templateButtonReplyMessage" && m.message[m.type].selectedId) ||
        "";
    } catch {
      m.body = "";
    }

    // t
    let quoted = (m.quoted = m.msg.contextInfo ? m.msg.contextInfo.quotedMessage : null);
    //m.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
    m.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : [];
    if (m.quoted) {
      let type = Object.keys(quoted)[0];
      m.quoted = m.quoted[type];
      if (["productMessage"].includes(type)) {
        type = getContentType(m.quoted);
        m.quoted = m.quoted[type];
      }
      if (typeof m.quoted === "string")
        m.quoted = {
          text: m.quoted,
        };
      m.quoted.mtype = type;
      m.quoted.id = m.msg.contextInfo.stanzaId;
      m.quoted.chat = conn.decodeJid(m.msg.contextInfo.remoteJidAlt || m.msg.contextInfo.remoteJid || m.chat);
      m.quoted.isBaileys = m.quoted.id ? m.quoted.id.startsWith("BAE5") && m.quoted.id.length === 16 : false;
      let rawQuotedParticipant = m.msg.contextInfo.participantAlt || m.msg.contextInfo.participant;
      m.quoted.sender = conn.decodeJid(rawQuotedParticipant);
      m.quoted.fromMe = m.quoted.sender === (conn.user && conn.user.jid);
      m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.conversation || m.quoted.contentText || m.quoted.selectedDisplayText || m.quoted.title || "";
      m.quoted.mentionedJid = m.quoted.contextInfo ? m.quoted.contextInfo.mentionedJid : [];
      m.getQuotedObj = m.getQuotedMessage = async () => {
        if (!m.quoted.id) return false;
        let q = await store.loadMessage(m.chat, m.quoted.id, conn);
        return exports.smsg(conn, q, store);
      };
      let vM = (m.quoted.fakeObj = M.fromObject({
        key: {
          remoteJid: m.quoted.chat,
          fromMe: m.quoted.fromMe,
          id: m.quoted.id,
        },
        message: quoted,
        ...(m.isGroup
          ? {
            participant: m.quoted.sender,
          }
          : {}),
      }));

      /**
       *
       * @returns
       */
      m.quoted.delete = () =>
        conn.sendMessage(m.quoted.chat, {
          delete: vM.key,
        });

      /**
       *
       * @param {*} jid
       * @param {*} forceForward
       * @param {*} options
       * @returns
       */
      m.quoted.copyNForward = (jid, forceForward = false, options = {}) => conn.copyNForward(jid, vM, forceForward, options);

      /**
       *
       * @returns
       */
      m.quoted.download = () => conn.downloadMediaMessage(m.quoted);
    }
  }
  if (m.msg.url) m.download = () => conn.downloadMediaMessage(m.msg);
  m.text = m.msg.text || m.msg.caption || m.message.conversation || m.msg.contentText || m.msg.selectedDisplayText || m.msg.title || "";
  /**
   * Reply to this message
   * @param {String|Object} text
   * @param {String|false} chatId
   * @param {Object} options
   */
  m.reply = (text, chatId = m.chat, options = {}) => (Buffer.isBuffer(text) ? conn.sendMedia(chatId, text, "file", "", m, { ...options }) : conn.sendText(chatId, text, m, { ...options }));
  /**
   * Copy this message
   */
  m.copy = () => exports.smsg(conn, M.fromObject(M.toObject(m)));

  /**
   *
   * @param {*} jid
   * @param {*} forceForward
   * @param {*} options
   * @returns
   */
  m.copyNForward = (jid = m.chat, forceForward = false, options = {}) => conn.copyNForward(jid, m, forceForward, options);
  conn.appenTextMessage = async (text, chatUpdate) => {
    let messages = await generateWAMessage(
      m.chat,
      {
        text: text,
        mentions: m.mentionedJid,
      },
      {
        userJid: conn.user.id,
        quoted: m.quoted && m.quoted.fakeObj,
      }
    );
    messages.key.fromMe = areJidsSameUser(m.sender, conn.user.id);
    messages.key.id = m.key.id;
    messages.pushName = m.pushName;
    if (m.isGroup) messages.participant = m.sender;
    let msg = {
      ...chatUpdate,
      messages: [proto.WebMessageInfo.fromObject(messages)],
      type: "append",
    };
    conn.ev.emit("messages.upsert", msg);
  };
  m.timestamp = m.messageTimestamp?.low || m.messageTimestamp || Date.now();
  m.isMedia = ["imageMessage", "videoMessage", "documentMessage", "audioMessage", "stickerMessage"].includes(m.mtype);
  m.mediaType = m.isMedia ? m.mtype.replace("Message", "") : null;
  m.hasQuoted = !!m.quoted?.id;
  m.textLength = m.text?.length || 0;
  m.command = typeof m.text === "string" && m.text.startsWith(global.prefix) ? m.text.slice(1).split(" ")[0].toLowerCase() : null;
  m.args = m.command ? m.text.trim().split(" ").slice(1) : [];
  m.pushName = m.pushName || store.contacts?.[m.sender]?.name || "";
  m.owner = "Rein";

  return m;
};

exports.logic = (check, inp, out) => {
  if (inp.length !== out.length) throw new Error("Input and Output must have same length");
  for (let i in inp) if (util.isDeepStrictEqual(check, inp[i])) return out[i];
  return null;
};

exports.protoType = () => {
  Buffer.prototype.toArrayBuffer = function toArrayBufferV2() {
    const ab = new ArrayBuffer(this.length);
    const view = new Uint8Array(ab);
    for (let i = 0; i < this.length; ++i) {
      view[i] = this[i];
    }
    return ab;
  };

  Buffer.prototype.toArrayBufferV2 = function toArrayBuffer() {
    return this.buffer.slice(this.byteOffset, this.byteOffset + this.byteLength);
  };

  ArrayBuffer.prototype.toBuffer = function toBuffer() {
    return Buffer.from(new Uint8Array(this));
  };

  Uint8Array.prototype.getFileType =
    ArrayBuffer.prototype.getFileType =
    Buffer.prototype.getFileType =
    async function getFileType() {
      return await fileTypeFromBuffer(this);
    };

  String.prototype.isNumber = Number.prototype.isNumber = isNumber;

  String.prototype.capitalize = function capitalize() {
    return this.charAt(0).toUpperCase() + this.slice(1, this.length);
  };

  String.prototype.capitalizeV2 = function capitalizeV2() {
    const str = this.split(" ");
    return str.map((v) => v.capitalize()).join(" ");
  };

  String.prototype.decodeJid = function decodeJid() {
    const str = this.toString();
    if (global.lidToPnMap && global.lidToPnMap[str]) {
      return global.lidToPnMap[str];
    }
    if (str.endsWith("@lid")) {
      const user = str.split("@")[0].split(":")[0];
      if (global.lidToPnMap && global.lidToPnMap[user]) {
        return global.lidToPnMap[user];
      }
    }
    if (/:\d+@/gi.test(str)) {
      const decode = jidDecode(str) || {};
      return ((decode.user && decode.server && decode.user + "@" + decode.server) || str).trim();
    } else return str.trim();
  };

  Number.prototype.toTimeString = function toTimeString() {
    const seconds = Math.floor((this / 1000) % 60);
    const minutes = Math.floor((this / (60 * 1000)) % 60);
    const hours = Math.floor((this / (60 * 60 * 1000)) % 24);
    const days = Math.floor(this / (24 * 60 * 60 * 1000));
    return ((days ? `${days} day(s) ` : "") + (hours ? `${hours} hour(s) ` : "") + (minutes ? `${minutes} minute(s) ` : "") + (seconds ? `${seconds} second(s)` : "")).trim();
  };
  Number.prototype.getRandom = String.prototype.getRandom = Array.prototype.getRandom = getRandom;
};

function isNumber() {
  const int = parseInt(this);
  return typeof int === "number" && !isNaN(int);
}

function getRandom() {
  if (Array.isArray(this) || this instanceof String) return this[Math.floor(Math.random() * this.length)];
  return Math.floor(Math.random() * this);
}

function nullish(args) {
  return !(args !== null && args !== undefined);
}

function getTypeMessage(message) {
  const type = Object.keys(message);
  var restype = (!["senderKeyDistributionMessage", "messageContextInfo"].includes(type[0]) && type[0]) || (type.length >= 3 && type[1] !== "messageContextInfo" && type[1]) || type[type.length - 1] || Object.keys(message)[0];
  return restype;
}

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update ${__filename}`));
  delete require.cache[file];
  require(file);
});
