const fs = require('fs')
const chalk = require('chalk')

//owner vcard
global.ytname = "YT: Rein"
global.socialm = "GH: FarelHanafi"
global.location = "indonesia"

//global settings
global.botname = 'Rell-MD'
global.ownernumber = ''
global.ownername = 'Rell'
global.websitex = "https://特別な人"
global.wagc = "https://chat.whatsapp.com/JKzk65yY1b54uQujtmSQFg"
global.themeemoji = '🪀'
global.wm = "Rell-MD."
global.packname = "Sticker By"
global.author = "Rell-MD\n+62 823-3422-6291"
global.creator = "62881026950162@s.whatsapp.net"
global.xprefix = '.'
global.premium = ["62881026950162"]
global.hituet = 0

global.lann = ''
global.lolkey = ""

global.APIKeys = {
  'https://api.betabotz.eu.org': '',
  'https://api.lolhuman.xyz': ''
}
//database
global.MONGODB = "mongodb://tess:koclok890@ac-whbyauf-shard-00-00.cblvjgh.mongodb.net:27017,ac-whbyauf-shard-00-01.cblvjgh.mongodb.net:27017,ac-whbyauf-shard-00-02.cblvjgh.mongodb.net:27017/?ssl=true&replicaSet=atlas-p4jmck-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0"
//bot sett
global.autoblocknumber = ''
global.antiforeignnumber = ''
global.welcome = true
global.antiswview = true
global.anticall = true
global.autoswview = true
global.adminevent = false
global.groupevent = false
global.thumb = fs.readFileSync('./media/theme/cheemspic.jpg')

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.green(`FILE UPDATED => ${__filename}`));
  delete require.cache[file];
  require(file);
});
