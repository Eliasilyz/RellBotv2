const fs = require("fs");
const chalk = require("chalk")
const moment = require('moment-timezone')
const { getExpired, RellPrem, removeUser, ListPremium, PerpanjangPrem, cekExpired, cekPrem } = require("../MongoDB/function.js")
const {
    sleep,
} = require("./myfunc.js");

const path = './src/data/role/sewa.json';

// Inisialisasi _dir dari file sewa.json saat aplikasi dimulai
let _dir = [];
if (fs.existsSync(path)) {
    try {
        _dir = JSON.parse(fs.readFileSync(path, 'utf-8'));
    } catch (error) {
        console.error('Failed to read sewa.json:', error);
    }
}

// Fungsi untuk mengkonversi durasi ke milidetik
const toMs = (duration) => {
    // Contoh implementasi untuk 30 hari dalam milidetik
    const days = parseInt(duration);
    return days * 24 * 60 * 60 * 1000;
};

const addSewa = (groupid, exp) => {
    const cekUser = _dir.find((user) => user.id == groupid);
    if (cekUser) {
        cekUser.expired = Date.now() + toMs(exp);
    } else {
        const obj = { id: groupid, expired: Date.now() + toMs(exp) };
        _dir.push(obj);
    }
    fs.writeFileSync(path, JSON.stringify(_dir, null, 2));
};

const getSewaPosition = (groupid) => {
    let position = null;
    Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === groupid) {
            position = i;
        }
    });
    if (position !== null) {
        return position;
    }
};

const getSewaExpired = (groupid) => {
    let position = null;
    Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === groupid) {
            position = i;
        }
    });
    if (position !== null) {
        return _dir[position].expired;
    }
};

const checkSewa = (groupid) => {
    let status = false;
    Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === groupid) {
            status = true;
        }
    });
    return status;
};

const expiredSewaCheck = (rell, msg) => {
    setInterval(() => {
        let position = null;
        Object.keys(_dir).forEach((i) => {
            if (Date.now() >= new Date(_dir[i].expired).getTime()) {
                position = i;
            }
        });
        if (position !== null) {
            const idny = _dir[position].id;
            console.log(`Premium expired: ${idny}`);
            _dir.splice(position, 1);
            fs.writeFileSync("./src/data/role/sewa.json", JSON.stringify(_dir));
            if (idny) {
                async function out() {
                    rell.sendMessage(idny, {
                        text: "Your premium has run out, please buy again.",
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
                    await sleep(5000);
                    await rell.groupLeave(idny);
                }
                out()
            }
        }
    }, 1000);
}


const getAllSewa = () => {
    const array = [];
    Object.keys(_dir).forEach((i) => {
        array.push(_dir[i].id);
    });
    return array;
};

module.exports = {
    addSewa,
    getSewaExpired,
    getSewaPosition,
    expiredSewaCheck,
    checkSewa,
    getAllSewa,
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.yellow(`< ============================== >\n`));
    console.log(chalk.green(`FILE UPDATED`));
    console.log(chalk.green(`=> In ${__filename}\n`));
    console.log(chalk.yellow(`< ============================== >\n`));
    delete require.cache[file];
    require(file);
});
