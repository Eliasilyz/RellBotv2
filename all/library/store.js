const { isLidUser } = require("baileys");

/**
 * Resolve a JID: if it ends with @lid, try to find its @s.whatsapp.net PN equivalent
 * from the global lidToPnMap. Falls back to the original JID if no mapping found.
 */
function resolveLid(jid) {
 if (!jid) return jid;
 if (!jid.endsWith("@lid")) return jid;
 const mapped = global.lidToPnMap?.[jid];
 if (mapped) return mapped;
 const base = jid.split(":")[0] + "@lid";
 return global.lidToPnMap?.[base] || jid;
}

const makeInMemoryStore = ({ logger } = {}) => {
 const chats = {};
 const messages = {};
 const contacts = {};
 const groupMetadata = {};
 const presence = {};

 return {
  chats,
  messages,
  contacts,
  groupMetadata,
  presence,
  bind: (ev) => {
   ev.on("messages.upsert", ({ messages: msgs }) => {
    for (const msg of msgs) {
     if (!msg.key || !msg.key.remoteJid) continue;
     const jid = msg.key.remoteJid;

     // Store LID <-> PN mapping from Alt fields
     if (global.lidToPnMap) {
      const altJid = msg.key.remoteJidAlt;
      const altParticipant = msg.key.participantAlt;

      if (altJid && jid.endsWith("@lid")) {
       global.lidToPnMap[jid] = altJid;
       global.lidToPnMap[jid.split(":")[0] + "@lid"] = altJid;
      }
      if (altParticipant && msg.key.participant?.endsWith("@lid")) {
       global.lidToPnMap[msg.key.participant] = altParticipant;
       global.lidToPnMap[msg.key.participant.split(":")[0] + "@lid"] = altParticipant;
      }
     }

     // Index message under raw jid
     if (!messages[jid]) messages[jid] = [];
     const existingIndex = messages[jid].findIndex((m) => m.key && m.key.id === msg.key.id);
     if (existingIndex >= 0) {
      messages[jid][existingIndex] = msg;
     } else {
      messages[jid].push(msg);
     }
     if (messages[jid].length > 100) messages[jid].shift();
    }
   });

   ev.on("contacts.upsert", (newContacts) => {
    for (const contact of newContacts) {
     if (!contact.id) continue;
     contacts[contact.id] = { ...(contacts[contact.id] || {}), ...contact };
     // Build LID->PN map from contacts if 'lid' field is present
     if (global.lidToPnMap && contact.lid && contact.id.endsWith("@s.whatsapp.net")) {
      global.lidToPnMap[contact.lid] = contact.id;
      global.lidToPnMap[contact.lid.split(":")[0] + "@lid"] = contact.id;
     }
    }
   });

   ev.on("contacts.update", (updates) => {
    for (const update of updates) {
     if (!update.id) continue;
     contacts[update.id] = { ...(contacts[update.id] || {}), ...update };
     if (global.lidToPnMap && update.lid && update.id.endsWith("@s.whatsapp.net")) {
      global.lidToPnMap[update.lid] = update.id;
     }
    }
   });

   ev.on("groups.update", (updates) => {
    for (const update of updates) {
     if (update.id) {
      groupMetadata[update.id] = { ...(groupMetadata[update.id] || {}), ...update };
     }
    }
   });
  },
  loadMessage: async (jid, id) => {
   const resolvedJid = resolveLid(jid);
   const list = messages[jid] || messages[resolvedJid] || [];
   return list.find((m) => m.key && m.key.id === id);
  },
  writeToFile: (path) => {},
  readFromFile: (path) => {},
 };
};

module.exports = { makeInMemoryStore, resolveLid };
