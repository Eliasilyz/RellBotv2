const chalk = require("chalk");
const fs = require("fs");
const axios = require("axios");

async function ssweb(url = "", full = false, type = "desktop") {
 type = type.toLowerCase();
 if (!["desktop", "tablet", "phone"].includes(type)) type = "desktop";
 let form = new URLSearchParams();
 form.append("url", url);
 form.append("device", type);
 if (!!full) form.append("full", "on");
 form.append("cacheLimit", 0);
 let res = await axios({
  url: "https://www.screenshotmachine.com/capture.php",
  method: "post",
  data: form,
 });
 let cookies = res.headers["set-cookie"];
 let buffer = await axios({
  url: "https://www.screenshotmachine.com/" + res.data.link,
  headers: {
   cookie: cookies.join(""),
  },
  responseType: "arraybuffer",
 });
 return Buffer.from(buffer.data);
}

async function tiktok2(query) {
 return new Promise(async (resolve, reject) => {
  try {
   const encodedParams = new URLSearchParams();
   encodedParams.set("url", query);
   encodedParams.set("hd", "1");
   const response = await axios({
    method: "POST",
    url: "https://tikwm.com/api/",
    headers: {
     "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
     Cookie: "current_language=en",
     "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
    },
    data: encodedParams,
   });
   const videos = response.data.data;
   const result = {
    title: videos.title,
    cover: videos.cover,
    origin_cover: videos.origin_cover,
    no_watermark: videos.play,
    watermark: videos.wmplay,
    music: videos.music,
   };
   resolve(result);
  } catch (error) {
   reject(error);
  }
 });
}

async function searchSpotifyTracks(query) {
 const clientId = "acc6302297e040aeb6e4ac1fbdfd62c3";
 const clientSecret = "0e8439a1280a43aba9a5bc0a16f3f009";
 const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
 const getToken = async () => {
  const response = await fetch("https://accounts.spotify.com/api/token", {
   method: "POST",
   timeout: 60000, // 60 seconds
   body: new URLSearchParams({ grant_type: "client_credentials" }),
   headers: { Authorization: `Basic ${auth}` },
  });
  return (await response.json()).access_token;
 };
 const accessToken = await getToken();
 const offset = 10;
 const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&offset=${offset}`;
 const response = await fetch(searchUrl, {
  headers: { Authorization: `Bearer ${accessToken}` },
 });
 const data = await response.json();
 return data.tracks.items;
}
async function uploadToCatbox(filePath) {
 const form = new FormData();
 form.append("fileToUpload", fs.createReadStream(filePath)); // file yang diupload
 form.append("reqtype", "fileupload"); // reqtype harus "fileupload"
 try {
  const response = await axios.post("https://catbox.moe/user/api.php", form, {
   headers: {
    ...form.getHeaders(),
   },
  });
  if (response.data) {
   const filename = response.data.trim();
   return `${filename}`;
  } else {
   throw new Error("Gagal mendapatkan URL dari Catbox.");
  }
 } catch (error) {
  console.error("Error uploading to Catbox:", error.message);
  throw error;
 }
}

async function lyrics(query) {
 try {
  const searchResponse = await axios.get("https://api.vreden.my.id/api/search/genius/find", {
   params: { lagu: query },
  });

  const results = searchResponse.data.result;

  if (!results || results.length === 0) {
   return { success: false, message: "Lagu tidak ditemukan." };
  }

  const firstResult = results[0];
  const lyricsResponse = await axios.get("https://api.vreden.my.id/api/search/genius/lyrics", {
   params: { url: firstResult.url },
  });

  const lyrics = lyricsResponse.data.result?.lyrics;

  if (!lyrics) {
   return { success: false, message: "Lirik tidak tersedia." };
  }

  return {
   success: true,
   title: firstResult.title,
   artist: firstResult.artist,
   image: firstResult.image,
   releaseDate: firstResult.release_date_display,
   lyrics: lyrics,
  };
 } catch (error) {
  return {
   success: false,
   message: "Terjadi kesalahan saat mengambil lirik.",
   error: error.message,
  };
 }
}

async function searchAnimeInfoFromAnilist(query) {
 const url = "https://graphql.anilist.co";

 const gqlQuery = `
    query ($search: String) {
      Media(search: $search, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
        }
        bannerImage
        description(asHtml: false)
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        episodes
        status
        averageScore
        genres
        studios(isMain: true) {
          nodes {
            name
          }
        }
        characters(sort: [ROLE, RELEVANCE], perPage: 5) {
          edges {
            node {
              name {
                full
              }
              image {
                large
              }
            }
            voiceActors(language: JAPANESE) {
              name {
                full
              }
            }
          }
        }
      }
    }
  `;

 const variables = { search: query };

 try {
  const res = await fetch(url, {
   method: "POST",
   headers: { "Content-Type": "application/json", Accept: "application/json" },
   body: JSON.stringify({ query: gqlQuery, variables }),
  });

  const json = await res.json();
  const data = json.data?.Media;
  if (!data) return { error: "Anime not found." };

  const characters = data.characters.edges.map((c) => ({
   name: c.node.name.full,
   image: c.node.image.large,
   va: c.voiceActors?.[0]?.name?.full || "Unknown",
  }));

  return {
   title: data.title.english || data.title.romaji || data.title.native,
   synopsis: data.description.replace(/<[^>]+>/g, ""), // remove HTML tags
   poster: data.coverImage.large,
   cover: data.bannerImage,
   startDate: `${data.startDate.year}-${String(data.startDate.month).padStart(2, "0")}-${String(data.startDate.day).padStart(2, "0")}`,
   endDate: data.endDate.year ? `${data.endDate.year}-${String(data.endDate.month).padStart(2, "0")}-${String(data.endDate.day).padStart(2, "0")}` : null,
   status: data.status.toLowerCase(),
   episodeCount: data.episodes,
   rating: data.averageScore,
   genres: data.genres,
   studios: data.studios.nodes.map((s) => s.name),
   characters,
  };
 } catch (err) {
  console.error("Error:", err);
  return { error: "Fetch failed." };
 }
}

async function searchMangaOrLightNovel(query) {
 try {
  const { data } = await axios.get(`https://api.jikan.moe/v4/manga`, {
   params: { q: query, limit: 5 },
  });

  if (!data?.data || data.data.length === 0) return [];

  return data.data.map((item) => {
   const publishedFrom = item.published?.from ? new Date(item.published.from).toLocaleDateString("ja-JP") : "不明";
   const publishedTo = item.published?.to ? new Date(item.published.to).toLocaleDateString("ja-JP") : "連載中";

   return {
    // Judul
    title_default: item.title || "No Title",
    title_english: item.title_english || "-",
    title_japanese: item.title_japanese || "-",

    // Detail utama
    image: item.images?.jpg?.large_image_url || "",
    synopsis: item.synopsis || "No synopsis available.",
    genres: item.genres?.map((g) => g.name) || [],
    type: item.type || "Unknown",
    status: item.status || "Unknown",

    // Statistik
    score: item.score || "N/A",
    rank: item.rank || "N/A",
    popularity: item.popularity || "N/A",
    favorites: item.favorites || 0,
    volumes: item.volumes || "N/A",
    chapters: item.chapters || "N/A",

    // Tanggal rilis
    releaseFrom: publishedFrom,
    releaseTo: publishedTo,

    // Author detail
    authors: item.authors?.map((a) => `${a.name} (${a.type})`) || [],

    // Link untuk referensi
    url: item.url,
    mal_id: item.mal_id,
   };
  });
 } catch (err) {
  console.error("❌ Jikan API error:", err.message);
  return [];
 }
}

async function getJapaneseHolidays(year = new Date().getFullYear()) {
 try {
  const url = `https://holidays-jp.github.io/api/v1/${year}/date.json`;
  const { data } = await axios.get(url);
  // data: { "YYYY-MM-DD": "Holiday Name", ... }
  return Object.entries(data).map(([date, name]) => ({
   date,
   name,
  }));
 } catch (err) {
  console.error("❌ Failed fetching JP holidays", err);
  return [];
 }
}

module.exports = {
 ssweb,
 tiktok2,
 searchSpotifyTracks,
 uploadToCatbox,
 lyrics,
 searchAnimeInfoFromAnilist,
 searchMangaOrLightNovel,
 getJapaneseHolidays,
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
 fs.unwatchFile(file);
 console.log(chalk.redBright(`Update ${__filename}`));
 delete require.cache[file];
 require(file);
});
