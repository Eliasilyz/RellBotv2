DEFAULT_PP = "https://telegra.ph/file/6880771a42bad09dd6087.jpg";

async function getProfilePicture(sock, jid) {
  try {
    return await sock.profilePictureUrl(jid, "image");
  } catch {
    return DEFAULT_PP;
  }
}

function getGroupDescription(metadata) {
  return metadata.desc || "";
}

function replacePlaceholders(text, data) {
  return text.replace(/@(\w+)/g, (_, key) => data[key] || `@${key}`);
}

function buildContextInfo({ mentionedJid, title, body, thumbnailUrl }) {
  return {
    mentionedJid,
    externalAdReply: {
      title,
      body,
      thumbnailUrl,
      mediaType: 1,
      renderLargerThumbnail: false,
    },
  };
}

module.exports = {
  getProfilePicture,
  getGroupDescription,
  replacePlaceholders,
  buildContextInfo,
};