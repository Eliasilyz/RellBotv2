<div align="center">

<img src="https://files.catbox.moe/rva3ue.png" width="140" alt="Kaede Bot Logo"/>

# 楓「Kaede」— RellBot v2

**A feature-rich WhatsApp Multi-Device bot built with Baileys**

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Baileys](https://img.shields.io/badge/Baileys-Multi--Device-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://www.npmjs.com/package/baileys)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Version](https://img.shields.io/badge/Version-2.0.0-FF6B6B?style=for-the-badge)](package.json)

*Crafted with love by [Irvan Farael Hanafi (Farel Hanafi)](https://github.com/Eliasilyz)*

</div>

---

## Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Bot](#-running-the-bot)
- [Command List](#-command-list)
- [Database](#-database)
- [Support](#-support)
- [License](#-license)

---

## Features

| Category | Features |
|----------|---------|
| AI | Groq-powered AI chat and per-user Auto-AI toggle |
| Downloader | YouTube (MP3/MP4), TikTok, Instagram, Facebook, Google Drive, Videy |
| Search | Pinterest, Anime, Manga, Spotify, Light Novel, Waifu search |
| Maker | Sticker maker, Brat text, Quote card, Meme generator, AI image generation |
| Tools | GitHub/Instagram/TikTok stalker, Remini enhance, media converter |
| Group Management | Welcome/Leave messages, Anti-link, Anti-sticker, Promote/Demote, Hidetag |
| Games | Guess Sentence, Word Puzzle, Guess Word, Chemistry quiz, Trivia, Math, Who's Me |
| Gacha / Harem | Waifu gacha system, profile cards, trading, reroll, marry |
| Premium System | User limit system, premium tiers, redeem codes |
| Leveling | XP and level tracking per user via MongoDB |
| Auto Features | Auto-read messages, Auto-bio rotation, Auto-read status, Anti-call |
| Saweria Donation | Real-time donation notifications forwarded to WhatsApp and channel |
| Auto Backup | Scheduled database backup sent to owner |
| Menfess | Anonymous message relay system |
| Hot-Reload | Settings reload without restarting the bot |

---

## Project Structure

```
RellBotv2/
├── main.js              # Entry point — bot initialization & event handlers
├── system.js            # Core command handler (all bot commands)
├── settings.js          # Global settings & constants (hot-reloadable)
├── backup.js            # Auto-backup scheduler
├── .env                 # Environment variables (DO NOT commit)
├── package.json
│
├── all/
│   ├── global.js        # Global utilities & prototype extensions
│   ├── place.js         # Baileys socket wrapper & message utilities
│   ├── color.js         # Terminal color helper
│   ├── exif.js          # Sticker EXIF metadata writer
│   ├── internet.py      # Python scraping helper
│   │
│   ├── Mongo/           # MongoDB models & data access layers
│   │   ├── mongoose.js  # DB connection setup
│   │   ├── users_id.js  # User registry
│   │   ├── user_data.js # User profile data
│   │   ├── user_status.js  # Premium / ban status
│   │   ├── leveling.js  # XP & leveling system
│   │   ├── reedem.js    # Redeem code system
│   │   └── waifu.js     # Gacha waifu system
│   │
│   ├── library/
│   │   ├── myfunc.js    # Shared utility functions
│   │   ├── menu.js      # Command menu definitions
│   │   ├── store.js     # In-memory message store
│   │   ├── lowdb/       # Local JSON database wrapper
│   │   └── suport/
│   │       └── welcome.js  # Welcome/leave message builder
│   │
│   ├── scrape/
│   │   ├── screaper.js  # Main scraper (media, search, APIs)
│   │   ├── ytdl.js      # YouTube downloader
│   │   ├── uploader.js  # File uploader (catbox, etc.)
│   │   ├── quote.js     # Quote card generator
│   │   └── Scrape.js    # Scraping utilities
│   │
│   └── json/
│       └── database.json  # Local JSON database file
│
├── session/             # Baileys auth session (auto-generated, gitignored)
└── media/               # Temporary media files
```

---

## Prerequisites

Before you begin, make sure you have the following installed:

- **[Node.js](https://nodejs.org)** v18 or higher
- **[npm](https://npmjs.com)** v9 or higher
- **[FFmpeg](https://ffmpeg.org/download.html)** (required for media conversion — must be in `PATH`)
- A **MongoDB** URI (Atlas free tier works great)
- A **Groq API Key** from [console.groq.com](https://console.groq.com)
- A **WhatsApp** account to use as the bot number

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Eliasilyz/RellBotv2.git
cd RellBotv2
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then fill in the required values (see [Configuration](#-configuration) below).

---

## Configuration

Edit the `.env` file with your credentials:

```env
# MongoDB Connection URI
MONGO_URL=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/botwa

# Groq AI API Key
GROQ_API=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

You can also customize global bot settings in `settings.js`:

| Variable | Description | Default |
|----------|-------------|---------|
| `global.owner` | Owner phone number (with country code, no `+`) | `6282334226291` |
| `global.ownerName` | Owner display name | `Farel Hanafi` |
| `global.namabot` | Bot display name | `楓「Kaede」` |
| `global.autoread` | Auto-read incoming messages | `true` |
| `global.anticall` | Auto-reject incoming calls | `true` |
| `global.autoreadsw` | Auto-read WhatsApp Status | `true` |
| `global.saweria` | Saweria donation link | `https://saweria.co/rein122` |

---

## Running the Bot

```bash
npm start
```

On first launch, you will be prompted to enter your **WhatsApp phone number** (with country code, e.g. `628123456789`) to generate a **pairing code**. Enter this code in WhatsApp under:

> **Linked Devices → Link a Device → Link with Phone Number**

Your session will be saved in the `./session/` folder for subsequent runs.

---

## Command List

All commands use the `.` prefix (e.g. `.menu`, `.ai Hello!`).

### Owner Commands

| Command | Description |
|---------|-------------|
| `.ban` / `.unban @user` | Ban or unban a user from the bot |
| `.banchat` / `.unbanchat` | Ban or unban a group chat |
| `.broadcast <text>` | Broadcast a message to all users |
| `.restart` / `.shutdown` | Restart or shut down the bot |
| `.autoread <on/off>` | Toggle auto-read messages |
| `.mode` | Toggle public or private mode |
| `.getsession` | Retrieve current session files |
| `.setppbot <image>` | Update the bot profile picture |

### AI

| Command | Description |
|---------|-------------|
| `.ai <prompt>` | Chat with Groq AI |
| `.autoai <on/off>` | Toggle automatic AI replies |

### Downloader

| Command | Description |
|---------|-------------|
| `.ytmp3 <url>` | Download YouTube audio as MP3 |
| `.ytmp4 <url>` | Download YouTube video as MP4 |
| `.tiktok <url>` | Download TikTok video without watermark |
| `.instadl <url>` | Download Instagram post or reel |
| `.fbdl <url>` | Download Facebook video |
| `.googledrive <url>` | Download from Google Drive |
| `.videy <url>` | Download from Videy |

### Search

| Command | Description |
|---------|-------------|
| `.anime <title>` | Search for anime information |
| `.manga <title>` | Search for manga information |
| `.spotify <query>` | Search Spotify tracks |
| `.pinterest <query>` | Search Pinterest images |
| `.lightnovel <title>` | Search light novels |
| `.play <song>` | Search and play audio |
| `.swaifu <name>` | Search for a waifu character |

### Maker

| Command | Description |
|---------|-------------|
| `.sticker <reply>` | Convert image or video to sticker |
| `.deepimg <prompt\|style>` | Generate an AI image |
| `.brat <text>` | Generate a Brat-style image |
| `.qc <text>` | Generate a quote card |
| `.smeme <top\|bottom>` | Create a sticker meme |
| `.swm <pack\|author>` | Set sticker watermark metadata |

### Tools

| Command | Description |
|---------|-------------|
| `.ghstalk <username>` | Look up a GitHub profile |
| `.igstalk <username>` | Look up an Instagram profile |
| `.ttstalk <username>` | Look up a TikTok profile |
| `.remini <reply>` | Enhance image quality with Remini |
| `.tourl <reply>` | Upload a file and get a public URL |
| `.toimg <reply>` | Convert sticker to image |
| `.tomp3 <reply>` | Convert video to MP3 audio |
| `.tovn <reply>` | Convert audio to voice note format |
| `.tovideo <reply>` | Convert to video format |
| `.toaudio <reply>` | Convert to audio format |
| `.translate` | Translate text |

### Group Management

| Command | Description |
|---------|-------------|
| `.welcome <on/off>` | Toggle welcome and leave messages |
| `.setwelcome <text>` | Set a custom welcome message |
| `.setleft <text>` | Set a custom leave message |
| `.antilink <on/off>` | Toggle anti-link protection |
| `.antilinkgc <on/off>` | Block links to other groups |
| `.antisticker <on/off>` | Block sticker spam |
| `.promote @user` | Promote a member to admin |
| `.demote @user` | Demote an admin to member |
| `.kick @user` | Kick a member from the group |
| `.hidetag <text>` | Tag all members silently |
| `.here <text>` | Tag all members visibly |
| `.open` / `.close` | Open or lock the group |
| `.delete <reply>` | Delete a replied message |

### Games

| Command | Description |
|---------|-------------|
| `.trivia` | Answer trivia questions |
| `.math` | Solve math problems |
| `.guessword` | Guess the hidden word |
| `.guessentence` | Guess the complete sentence |
| `.wordpuzzle` | Play a word puzzle game |
| `.chemistry` | Chemical element quiz |
| `.whosme` | "Who am I?" character quiz |

### Gacha / Harem

| Command | Description |
|---------|-------------|
| `.waifu` | Roll for a random waifu character |
| `.profile` | View your profile card |
| `.mymarry` | View your waifu collection |
| `.reroll` | Re-roll your current waifu |
| `.trade @user` | Trade waifu with another user |

---

## Database

RellBot v2 uses a **dual-database architecture**:

| Storage | Purpose |
|---------|---------|
| **MongoDB** (via Mongoose) | User profiles, premium status, leveling, gacha/waifu, redeem codes |
| **LowDB** (local JSON) | Bot settings, chat configs, menfess data, user limits |

The local database auto-saves every **30 seconds** to `./all/json/database.json`.

---

## Support

If you find this project useful, feel free to support the developer:

| Platform | Link |
|----------|------|
| Saweria | [saweria.co/rein122](https://saweria.co/rein122) |
| Trakteer | [trakteer.id/Eliasilyz](https://trakteer.id/Eliasilyz) |
| Ko-fi | [ko-fi.com/eliasilyz](https://ko-fi.com/eliasilyz) |

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with love by **Irvan Farael Hanafi**

*「楓」— May your bot run forever without bugs.*

</div>
