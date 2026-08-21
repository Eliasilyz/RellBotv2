require('./settings')
const makeWASocket = require("@whiskeysockets/baileys").default
const { uncache, nocache } = require('./lib/loader')
const { color } = require('./lib/color')
const NodeCache = require("node-cache")
const readline = require("readline")
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const { Low, JSONFile } = require('./lib/lowdb')
const yargs = require('yargs/yargs')
const fs = require('fs')
const chalk = require('chalk')
const FileType = require('file-type')
const path = require('path')
const axios = require('axios')
const _ = require('lodash')
const moment = require('moment-timezone')
const { exec, spawn, execSync } = require("child_process")
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, await, sleep, reSize } = require('./lib/myfunc')
const { default: rellConnect, getAggregateVotesInPollMessage, delay, PHONENUMBER_MCC, makeCacheableSignalKeyStore, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto, Browsers } = require("@whiskeysockets/baileys")
const { connectMongoDb } = require("./MongoDB/mongodb")
const { getExpired, RellPrem, removeUser, ListPremium, PerpanjangPrem, cekExpired, cekPrem } = require("./MongoDB/function.js")
const store = makeInMemoryStore({
    logger: pino().child({
        level: 'silent',
        stream: 'store'
    })
})
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.db = new Low(new JSONFile(`src/database.json`))

global.DATABASE = global.db
global.loadDatabase = async function loadDatabase() {
    if (global.db.READ) return new Promise((resolve) => setInterval(function () { (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null) }, 1 * 1000))
    if (global.db.data !== null) return
    global.db.READ = true
    await global.db.read()
    global.db.READ = false
    global.db.data = {
        users: {},
        database: {},
        chats: {},
        game: {},
        settings: {},
        message: {},
        usage: {},
        ...(global.db.data || {})
    }
    global.db.chain = _.chain(global.db.data)
}
loadDatabase()
connectMongoDb()

if (global.db) setInterval(async () => {
    if (global.db.data) await global.db.write()
}, 30 * 1000)

require('./core.js')
nocache('../core.js', module => console.log(color('[ CHANGE ]', 'green'), color(`'${module}'`, 'green'), 'Rell Core Is Updated'))
require('./main.js')
nocache('../main.js', module => console.log(color('[ CHANGE ]', 'green'), color(`'${module}'`, 'green'), 'Rell Main Is Updated'))

//------------------------------------------------------
let phoneNumber = "6282334226291"
let owner = JSON.parse(fs.readFileSync('./src/data/role/owner.json'))

const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))

async function startrell() {
    let { version, isLatest } = await fetchLatestBaileysVersion()
    const { state, saveCreds } = await useMultiFileAuthState(`./session`)
    const msgRetryCounterCache = new NodeCache() // for retry message, "waiting message"
    const rell = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: !pairingCode, // popping up QR in terminal log
        browser: ['Mac OS', 'chrome', '121.0.6167.159'], // for this issues https://github.com/WhiskeySockets/Baileys/issues/328
        patchMessageBeforeSending: (message) => {
            const requiresPatch = !!(
                message.buttonsMessage ||
                message.templateMessage ||
                message.listMessage
            );
            if (requiresPatch) {
                message = {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadataVersion: 2,
                                deviceListMetadata: {},
                            },
                            ...message,
                        },
                    },
                };
            }
            return message;
        },
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
        },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        getMessage: async (key) => {
            if (store) {
                const msg = await store.loadMessage(key.remoteJid, key.id)
                return msg.message || undefined
            }
            return {
                conversation: "Rell Bot Here!"
            }
        },
        msgRetryCounterCache,
        defaultQueryTimeoutMs: undefined,
    })

    store.bind(rell.ev)

    if (pairingCode && !rell.authState.creds.registered) {
        if (useMobile) throw new Error('Cannot use pairing code with mobile api')

        let phoneNumber
        if (!!phoneNumber) {
            phoneNumber = phoneNumber.replace(/[^0-9]/g, '')

            if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
                console.log(chalk.bgBlack(chalk.redBright("Start with country code of your WhatsApp Number, Example : +6282334226291")))
                process.exit(0)
            }
        } else {
            phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Please type your WhatsApp number 😍\nFor example: +6282334226291 : `)))
            phoneNumber = phoneNumber.replace(/[^0-9]/g, '')

            // Ask again when entering the wrong number
            if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
                console.log(chalk.bgBlack(chalk.redBright("Start with country code of your WhatsApp Number, Example : +6282334226291")))

                phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Please type your WhatsApp number 😍\nFor example: +6282334226291 : `)))
                phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
                rl.close()
            }
        }

        setTimeout(async () => {
            let code = await rell.requestPairingCode(phoneNumber)
            code = code?.match(/.{1,4}/g)?.join("-") || code
            console.log(chalk.black(chalk.bgGreen(`Your Pairing Code : `)), chalk.black(chalk.white(code)))
        }, 3000)
    }



    function clearTmp() {
        const tmp = [os.tmpdir(), path.join(__dirname, "./trash")];
        const filename = [];
        tmp.forEach((dirname) =>
            fs
                .readdirSync(dirname)
                .forEach((file) => filename.push(path.join(dirname, file))),
        );
        filename.map(
            (file) => (
                (stats = fs.statSync(file)),
                stats.isFile() && Date.now() - stats.mtimeMs >= 1000 * 60 * 3
                    ? fs.unlinkSync(file)
                    : null
            ),
        );
    }



    rell.ev.on('connection.update', async (update) => {
        const {
            connection,
            lastDisconnect
        } = update
        try {
            if (connection === 'close') {
                let reason = new Boom(lastDisconnect?.error)?.output.statusCode
                if (reason === DisconnectReason.badSession) {
                    console.log(`Bad Session File, Please Delete Session and Scan Again`);
                    startrell()
                } else if (reason === DisconnectReason.connectionClosed) {
                    console.log("Connection closed, reconnecting....");
                    startrell();
                } else if (reason === DisconnectReason.connectionLost) {
                    console.log("Connection Lost from Server, reconnecting...");
                    startrell();
                } else if (reason === DisconnectReason.connectionReplaced) {
                    console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First");
                    startrell()
                } else if (reason === DisconnectReason.loggedOut) {
                    console.log(`Device Logged Out, Please Delete Session and Scan Again.`);
                    startrell();
                } else if (reason === DisconnectReason.restartRequired) {
                    console.log("Restart Required, Restarting...");
                    startrell();
                } else if (reason === DisconnectReason.timedOut) {
                    console.log("Connection TimedOut, Reconnecting...");
                    startrell();
                } else rell.end(`Unknown DisconnectReason: ${reason}|${connection}`)
            }
            if (update.connection == "connecting" || update.receivedPendingNotifications == "false") {
                console.log(color(`\n🌿Connecting...`, 'yellow'))
            }
            if (update.connection == "open" || update.receivedPendingNotifications == "true") {
                console.log(color(` `, 'magenta'))
                console.log(color(`🌿Connected to => ` + `\n` + JSON.stringify(rell.user, null, 2), 'yellow'))
                console.log(chalk.yellow(`\n\n               ${chalk.bold.blue(`[ ${botname} ]`)}\n\n`))
                console.log(color(`< ===================[ Rell-MD ]=================== >`, 'cyan'))
                console.log(color(`\n=>  YT CHANNEL: Rein998`, 'green'))
                console.log(color(`=>  GITHUB: OnlyRein `, 'green'))
                console.log(color(`=>  INSTAGRAM: @irvnfrlh `, 'green'))
                console.log(color(`=>  WA NUMBER: ${owner}`, 'green'))
                console.log(color(`=>  CREDIT: Rell-MD inc.\n`, 'green'))
                console.log(color(`< ================================================= >`, 'cyan'))
            }

        } catch (err) {
            console.log('Error in Connection.update ' + err)
            startrell()
        }
    })
    rell.ev.on('creds.update', saveCreds)
    rell.ev.on("messages.upsert", () => { })
    //------------------------------------------------------

    //farewell/welcome
    rell.ev.on('group-participants.update', async (anu) => {
        if (global.welcome) {
            console.log(`${anu.action} => ${anu.participants} to ${anu.id}`)
            try {
                let metadata = await rell.groupMetadata(anu.id)
                let participants = anu.participants
                for (let num of participants) {
                    try {
                        ppuser = await rell.profilePictureUrl(num, 'image')
                    } catch (err) {
                        ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
                    }
                    try {
                        ppgroup = await rell.profilePictureUrl(anu.id, 'image')
                    } catch (err) {
                        ppgroup = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60'
                    }
                    //welcome\\
                    memb = metadata.participants.length
                    RellWlcm = await getBuffer(ppuser)
                    RellLft = await getBuffer(ppuser)
                    if (anu.action == 'add') {
                        const Rellbuffer = await getBuffer(ppuser)
                        let RellName = num
                        const xtime = moment.tz(`Asia/Jakarta`).format("HH:mm:ss")
                        const xdate = moment.tz(`Asia/Jakarta`).format("DD/MM/YYYY")
                        const pushname = m.pushName || "No Name";
                        const xmembers = metadata.participants.length
                        Rellbody = `┌─❖
│「 Hi @${RellName.split("@")[0]}👋 」
└┬❖ 「  Welcome To  」
   │✑  *${metadata.subject}*
   │  
   │✑  Member ke: ${xmembers}
   │✑  waktu join: ${xtime} ${xdate}
   └───────────────┈ ⳹`
                        rell.sendMessage(anu.id,
                            {
                                text: Rellbody,
                                contextInfo: {
                                    mentionedJid: [num],
                                    "externalAdReply": {
                                        "showAdAttribution": true,
                                        "containsAutoReply": true,
                                        "title": `Hi ${pushname}👋`,
                                        "body": `${global.botname} by ${ownername}`,
                                        "previewType": "PHOTO",
                                        "thumbnailUrl": ``,
                                        "thumbnail": RellWlcm,
                                        "sourceUrl": `${wagc}`
                                    }
                                }
                            })
                    } else if (anu.action == 'remove') {
                        const Rellbuffer = await getBuffer(ppuser)
                        const Relltime = moment.tz('Asia/Jakarta').format('HH:mm:ss')
                        const Relldate = moment.tz('Asia/Jakarta').format('DD/MM/YYYY')
                        const pushname = m.pushName || "No Name";
                        let RellName = num
                        const Rellmembers = metadata.participants.length
                        Rellbody = `┌─❖
│「 Goodbye @${RellName.split("@")[0]}👋 」
└┬❖ 「  Left  」
   │✑  member ke ${Rellmembers}th
   │✑  waktu keluar ${Relltime} ${Relldate}
   └───────────────┈ ⳹`
                        rell.sendMessage(anu.id,
                            {
                                text: Rellbody,
                                contextInfo: {
                                    mentionedJid: [num],
                                    "externalAdReply": {
                                        "showAdAttribution": true,
                                        "containsAutoReply": true,
                                        "title": `Hi ${pushname}👋`,
                                        "body": `${global.botname} by ${ownername}`,
                                        "previewType": "PHOTO",
                                        "thumbnailUrl": ``,
                                        "thumbnail": RellLft,
                                        "sourceUrl": `${wagc}`
                                    }
                                }
                            })
                    }
                }
            } catch (err) {
                console.log(err)
            }
        }
    })
    // Anti Call
    rell.ev.on('call', async (RellPapa) => {
        if (global.anticall) {
            for (let RellFucks of RellPapa) {
                if (RellFucks.isGroup == false) {
                    if (RellFucks.status == "offer") {
                        rell.rejectCall(RellFucks.id, RellFucks.from)
                        console.log("call from: " + RellFucks.from)
                    }
                }
            }
        }
    })
    rell.ev.on('call', async (RellPapa) => {
        if (global.anticall) {
            for (let RellFucks of RellPapa) {
                if (RellFucks.isGroup == true) {
                    if (RellFucks.status == "offer") {
                        rell.rejectCall(RellFucks.id, RellFucks.from)
                        console.log("call from: " + RellFucks.from)
                    }
                }
            }
        }
    })
    //autostatus view
    rell.ev.on('messages.upsert', async chatUpdate => {
        if (global.antiswview) {
            mek = chatUpdate.messages[0]
            if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                await rell.readMessages([mek.key])
            }
        }
    })
    setInterval(
        async () => {
            if (db.data.settings["6282334226291@s.whatsapp.net"].autobio) {
                const { runtime } = require("./lib/myfunc.js");
                totalreg = Object.keys(global.db.data.users).length;
                var mytext = fs.readFileSync("./core.js").toString();
                var numUpper = (mytext.match(/case "/g) || []).length;
                truthjson = [
                    `${botname}🌸 || ${totalreg} Online users`,
                    `${botname}🌸 || ${runtime(process.uptime())}`,
                    `${botname}🌸 || ${numUpper} Features`,
                    `${botname}🌸 ||  Mode: ${rell.public == false ? "Private" : "Public"}`,
                ];
                const truth = truthjson[Math.floor(Math.random() * truthjson.length)];
                rell.updateProfileStatus(truth).catch((_) => _);
            }
        },
        15 * 1000
    );
    //admin event
    rell.ev.on('group-participants.update', async (anu) => {
        if (global.adminevent) {
            console.log(anu)
            try {
                let participants = anu.participants
                for (let num of participants) {
                    try {
                        ppuser = await rell.profilePictureUrl(num, 'image')
                    } catch (err) {
                        ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
                    }
                    try {
                        ppgroup = await rell.profilePictureUrl(anu.id, 'image')
                    } catch (err) {
                        ppgroup = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60'
                    }
                    if (anu.action == 'promote') {
                        const Relltime = moment.tz('Asia/Jakarta').format('HH:mm:ss')
                        const Relldate = moment.tz('Asia/Jakarta').format('DD/MM/YYYY')
                        let RellName = num
                        Rellbody = ` 𝗖𝗼𝗻𝗴𝗿𝗮𝘁𝘀🎉 @${RellName.split("@")[0]}, you have been *promoted* to *admin* 🥳`
                        rell.sendMessage(anu.id,
                            {
                                text: Rellbody,
                                contextInfo: {
                                    mentionedJid: [num],
                                    "externalAdReply": {
                                        "showAdAttribution": true,
                                        "containsAutoReply": true,
                                        "title": ` ${global.botname}`,
                                        "body": `${ownername}`,
                                        "previewType": "PHOTO",
                                        "thumbnailUrl": ``,
                                        "thumbnail": RellWlcm,
                                        "sourceUrl": `${wagc}`
                                    }
                                }
                            })
                    } else if (anu.action == 'demote') {
                        const Relltime = moment.tz('Asia/Jakarta').format('HH:mm:ss')
                        const Relldate = moment.tz('Asia/Jakarta').format('DD/MM/YYYY')
                        let RellName = num
                        Rellbody = `𝗢𝗼𝗽𝘀‼️ @${RellName.split("@")[0]}, you have been *demoted* from *admin* 😬`
                        rell.sendMessage(anu.id,
                            {
                                text: Rellbody,
                                contextInfo: {
                                    mentionedJid: [num],
                                    "externalAdReply": {
                                        "showAdAttribution": true,
                                        "containsAutoReply": true,
                                        "title": ` ${global.botname}`,
                                        "body": `${ownername}`,
                                        "previewType": "PHOTO",
                                        "thumbnailUrl": ``,
                                        "thumbnail": RellLft,
                                        "sourceUrl": `${wagc}`
                                    }
                                }
                            })
                    }
                }
            } catch (err) {
                console.log(err)
            }
        }
    })

    // detect group update
    rell.ev.on("groups.update", async (json) => {
        if (global.groupevent) {
            try {
                ppgroup = await rell.profilePictureUrl(anu.id, 'image')
            } catch (err) {
                ppgroup = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60'
            }
            console.log(json)
            const res = json[0]
            if (res.announce == true) {
                await sleep(2000)
                rell.sendMessage(res.id, {
                    text: `「 Group Settings Change 」\n\nGroup has been closed by admin, Now only admins can send messages !`,
                })
            } else if (res.announce == false) {
                await sleep(2000)
                rell.sendMessage(res.id, {
                    text: `「 Group Settings Change 」\n\nThe group has been opened by admin, Now participants can send messages !`,
                })
            } else if (res.restrict == true) {
                await sleep(2000)
                rell.sendMessage(res.id, {
                    text: `「 Group Settings Change 」\n\nGroup info has been restricted, Now only admin can edit group info !`,
                })
            } else if (res.restrict == false) {
                await sleep(2000)
                rell.sendMessage(res.id, {
                    text: `「 Group Settings Change 」\n\nGroup info has been opened, Now participants can edit group info !`,
                })
            } else if (!res.desc == '') {
                await sleep(2000)
                rell.sendMessage(res.id, {
                    text: `「 Group Settings Change 」\n\n*Group description has been changed to*\n\n${res.desc}`,
                })
            } else {
                await sleep(2000)
                rell.sendMessage(res.id, {
                    text: `「 Group Settings Change 」\n\n*Group name has been changed to*\n\n*${res.subject}*`,
                })
            }
        }
    })

    // respon cmd pollMessage
    async function getMessage(key) {
        if (store) {
            const msg = await store.loadMessage(key.remoteJid, key.id)
            return msg?.message
        }
        return {
            conversation: "Rell Bot Here!"
        }
    }
    rell.ev.on('messages.update', async chatUpdate => {
        for (const { key, update } of chatUpdate) {
            if (update.pollUpdates && key.fromMe) {
                const pollCreation = await getMessage(key)
                if (pollCreation) {
                    const pollUpdate = await getAggregateVotesInPollMessage({
                        message: pollCreation,
                        pollUpdates: update.pollUpdates,
                    })
                    var toCmd = pollUpdate.filter(v => v.voters.length !== 0)[0]?.name
                    if (toCmd == undefined) return
                    var prefCmd = xprefix + toCmd
                    rell.appenTextMessage(prefCmd, chatUpdate)
                }
            }
        }
    })

    rell.ev.on('messages.upsert', async chatUpdate => {
        //console.log(JSON.stringify(chatUpdate, undefined, 2))
        try {
            mek = chatUpdate.messages[0]
            if (!mek.message) return
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
            if (mek.key && mek.key.remoteJid === 'status@broadcast') return
            if (!rell.public && chatUpdate.type === 'notify') return
            if (mek.key.id.startsWith('Rell') && mek.key.id.length === 16) return
            if (mek.key.id.startsWith('BAE5')) return
            m = smsg(rell, mek, store)
            require("./core.js")(rell, m, chatUpdate, store)
        } catch (err) {
            console.log(err)
        }
    })


    rell.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }

    rell.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = rell.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = {
                id,
                name: contact.notify
            }
        }
    })

    rell.getName = (jid, withoutContact = false) => {
        id = rell.decodeJid(jid)
        withoutContact = rell.withoutContact || withoutContact
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = rell.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
            id,
            name: 'WhatsApp'
        } : id === rell.decodeJid(rell.user.id) ?
            rell.user :
            (store.contacts[id] || {})
        return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }

    rell.sendList = async (jid, title, footer, btn, options = {}) => {
        let msg = generateWAMessageFromContent(jid, {
            viewOnceMessage: {
                message: {
                    "messageContextInfo": {
                        "deviceListMetadata": {},
                        "deviceListMetadataVersion": 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        ...options,
                        body: proto.Message.InteractiveMessage.Body.create({ text: title }),
                        footer: proto.Message.InteractiveMessage.Footer.create({ text: footer || "Rell-MD" }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                            buttons: [
                                {
                                    "name": "single_select",
                                    "buttonParamsJson": JSON.stringify(btn)
                                },
                            ]
                        })
                    })
                }
            }
        }, {})
        return await rell.relayMessage(msg.key.remoteJid, msg.message, {
            messageId: msg.key.id
        })
    }

    rell.sendButton = async (jid, title, footer, nama, id, options = {}) => {
        let msg = generateWAMessageFromContent(jid, {
            viewOnceMessage: {
                message: {
                    "messageContextInfo": {
                        "deviceListMetadata": {},
                        "deviceListMetadataVersion": 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        ...options,
                        body: proto.Message.InteractiveMessage.Body.create({ text: title }),
                        footer: proto.Message.InteractiveMessage.Footer.create({ text: footer || "Rell-MD" }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                            buttons: [
                                {
                                    "name": "quick_reply",
                                    "buttonParamsJson": `{\"display_text\":\"${nama}\",\"id\":\"${id}\"}`
                                },
                            ]
                        })
                    })
                }
            }
        }, {})
        return await rell.relayMessage(msg.key.remoteJid, msg.message, {
            messageId: msg.key.id
        })
    }

    rell.sendLinks = async (jid, title, footer, btnname, btnurl, options = {}) => {
        let msg = generateWAMessageFromContent(jid, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        ...options,
                        body: proto.Message.InteractiveMessage.Body.create({ text: title }),
                        footer: proto.Message.InteractiveMessage.Footer.create({ text: footer || "Rell-MD" }),
                        nativeFlowMessage: {
                            buttons: [
                                {
                                    "name": "cta_url",
                                    "buttonParamsJson": `{\"display_text\":\"${btnname}\",\"url\":\"${btnurl}\",\"webview_presentation\":null}`
                                }
                            ]
                        },
                    })
                }
            }
        }, {});

        return await rell.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
    }

    rell.sendContact = async (jid, kon, quoted = '', opts = {}) => {
        let list = []
        for (let i of kon) {
            list.push({
                displayName: await rell.getName(i + '@s.whatsapp.net'),
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await rell.getName(i + '@s.whatsapp.net')}\nFN:${await rell.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nitem2.EMAIL;type=INTERNET:farelcuy122@gmail.com\nitem2.X-ABLabel:Email\nitem3.URL:@Rein998\nitem3.X-ABLabel:YouTube\nitem4.ADR:;;Indonesian;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`
            })
        }
        rell.sendMessage(jid, { contacts: { displayName: `${list.length} Kontak`, contacts: list }, ...opts }, { quoted })
    }

    rell.public = true

    rell.serializeM = (m) => smsg(rell, m, store)

    rell.sendText = (jid, text, quoted = '', options) => rell.sendMessage(jid, {
        text: text,
        ...options
    }, {
        quoted,
        ...options
    })
    rell.sendImage = async (jid, path, caption = '', quoted = '', options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await rell.sendMessage(jid, {
            image: buffer,
            caption: caption,
            ...options
        }, {
            quoted
        })
    }
    rell.sendTextWithMentions = async (jid, text, quoted, options = {}) => rell.sendMessage(jid, {
        text: text,
        mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
        ...options
    }, {
        quoted
    })
    rell.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options)
        } else {
            buffer = await imageToWebp(buff)
        }
        await rell.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
            .then(response => {
                fs.unlinkSync(buffer)
                return response
            })
    }

    rell.sendAudio = async (jid, path, quoted = '', ptt = false, options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await rell.sendMessage(jid, { audio: buffer, ptt: ptt, ...options }, { quoted })
    }

    rell.sendVideo = async (jid, path, caption = '', quoted = '', gif = false, options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await rell.sendMessage(jid, { video: buffer, caption: caption, gifPlayback: gif, ...options }, { quoted })
    }

    rell.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options)
        } else {
            buffer = await videoToWebp(buff)
        }
        await rell.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        return buffer
    }
    rell.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        let quoted = message.msg ? message.msg : message
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(quoted, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        let type = await FileType.fromBuffer(buffer)
        trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
        // save to file
        await fs.writeFileSync(trueFileName, buffer)
        return trueFileName
    }

    rell.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
        let mime = '';
        let res = await axios.head(url)
        mime = res.headers['content-type']
        if (mime.split("/")[1] === "gif") {
            return rell.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options }, { quoted: quoted, ...options })
        }
        let type = mime.split("/")[0] + "Message"
        if (mime === "application/pdf") {
            return rell.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options }, { quoted: quoted, ...options })
        }
        if (mime.split("/")[0] === "image") {
            return rell.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options }, { quoted: quoted, ...options })
        }
        if (mime.split("/")[0] === "video") {
            return rell.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options }, { quoted: quoted, ...options })
        }
        if (mime.split("/")[0] === "audio") {
            return rell.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options }, { quoted: quoted, ...options })
        }
    }

    rell.getFile = async (PATH, save) => {
        let res
        let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
        //if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
        let type = await FileType.fromBuffer(data) || {
            mime: 'application/octet-stream',
            ext: '.bin'
        }
        filename = path.join(__filename, '../src/' + new Date * 1 + '.' + type.ext)
        if (data && save) fs.promises.writeFile(filename, data)
        return {
            res,
            filename,
            size: await getSizeMedia(data),
            ...type,
            data
        }

    }

    rell.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
        let type = await rell.getFile(path, true);
        let { res, data: file, filename: pathFile } = type;

        if (res && res.status !== 200 || file.length <= 65536) {
            try {
                throw {
                    json: JSON.parse(file.toString())
                };
            } catch (e) {
                if (e.json) throw e.json;
            }
        }

        let opt = {
            filename
        };

        if (quoted) opt.quoted = quoted;
        if (!type) options.asDocument = true;

        let mtype = '',
            mimetype = type.mime,
            convert;

        if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker';
        else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image';
        else if (/video/.test(type.mime)) mtype = 'video';
        else if (/audio/.test(type.mime)) {
            convert = await (ptt ? toPTT : toAudio)(file, type.ext);
            file = convert.data;
            pathFile = convert.filename;
            mtype = 'audio';
            mimetype = 'audio/ogg; codecs=opus';
        } else mtype = 'document';

        if (options.asDocument) mtype = 'document';

        delete options.asSticker;
        delete options.asLocation;
        delete options.asVideo;
        delete options.asDocument;
        delete options.asImage;

        let message = { ...options, caption, ptt, [mtype]: { url: pathFile }, mimetype };
        let m;

        try {
            m = await rell.sendMessage(jid, message, { ...opt, ...options });
        } catch (e) {
            //console.error(e)
            m = null;
        } finally {
            if (!m) m = await rell.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options });
            file = null;
            return m;
        }
    }

    rell.cMod = (jid, copy, text = '', sender = rell.user.id, options = {}) => {
        //let copy = message.toJSON()
        let mtype = Object.keys(copy.message)[0]
        let isEphemeral = mtype === 'ephemeralMessage'
        if (isEphemeral) {
            mtype = Object.keys(copy.message.ephemeralMessage.message)[0]
        }
        let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
        let content = msg[mtype]
        if (typeof content === 'string') msg[mtype] = text || content
        else if (content.caption) content.caption = text || content.caption
        else if (content.text) content.text = text || content.text
        if (typeof content !== 'string') msg[mtype] = {
            ...content,
            ...options
        }
        if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
        else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
        if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
        else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
        copy.key.remoteJid = jid
        copy.key.fromMe = sender === rell.user.id

        return proto.WebMessageInfo.fromObject(copy)
    }

    rell.sendMedia = async (jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
        let types = await rell.getFile(path, true)
        let { mime, ext, res, data, filename } = types
        if (res && res.status !== 200 || file.length <= 65536) {
            try { throw { json: JSON.parse(file.toString()) } }
            catch (e) { if (e.json) throw e.json }
        }
        let type = '', mimetype = mime, pathFile = filename
        if (options.asDocument) type = 'document'
        if (options.asSticker || /webp/.test(mime)) {
            let { writeExif } = require('./lib/exif')
            let media = { mimetype: mime, data }
            pathFile = await writeExif(media, { packname: options.packname ? options.packname : global.packname, author: options.author ? options.author : global.author, categories: options.categories ? options.categories : [] })
            await fs.promises.unlink(filename)
            type = 'sticker'
            mimetype = 'image/webp'
        }
        else if (/image/.test(mime)) type = 'image'
        else if (/video/.test(mime)) type = 'video'
        else if (/audio/.test(mime)) type = 'audio'
        else type = 'document'
        await rell.sendMessage(jid, { [type]: { url: pathFile }, caption, mimetype, fileName, ...options }, { quoted, ...options })
        return fs.promises.unlink(pathFile)
    }

    rell.copyNForward = async (jid, message, forceForward = false, options = {}) => {
        let vtype
        if (options.readViewOnce) {
            message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
            vtype = Object.keys(message.message.viewOnceMessage.message)[0]
            delete (message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
            delete message.message.viewOnceMessage.message[vtype].viewOnce
            message.message = {
                ...message.message.viewOnceMessage.message
            }
        }
        let mtype = Object.keys(message.message)[0]
        let content = await generateForwardMessageContent(message, forceForward)
        let ctype = Object.keys(content)[0]
        let context = {}
        if (mtype != "conversation") context = message.message[mtype].contextInfo
        content[ctype].contextInfo = {
            ...context,
            ...content[ctype].contextInfo
        }
        const waMessage = await generateWAMessageFromContent(jid, content, options ? {
            ...content[ctype],
            ...options,
            ...(options.contextInfo ? {
                contextInfo: {
                    ...content[ctype].contextInfo,
                    ...options.contextInfo
                }
            } : {})
        } : {})
        await rell.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id })
        return waMessage
    }

    rell.sendPoll = (jid, name = '', values = [], selectableCount = 1) => { return rell.sendMessage(jid, { poll: { name, values, selectableCount } }) }

    rell.parseMention = (text = '') => {
        return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
    }

    rell.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(message, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }

        return buffer
    }
    return rell
}

startrell()

process.on('uncaughtException', function (err) {
    let e = String(err)
    if (e.includes("conflict")) return
    if (e.includes("Cannot derive from empty media key")) return
    if (e.includes("Socket connection timeout")) return
    if (e.includes("not-authorized")) return
    if (e.includes("already-exists")) return
    if (e.includes("rate-overlimit")) return
    if (e.includes("Connection Closed")) return
    if (e.includes("Timed Out")) return
    if (e.includes("Value not found")) return
    console.log('Caught exception: ', err)
})