const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
const mime = require('mime-types');
const moment = require('moment');

/**
 * Melakukan backup project dan kirim ke target JID WhatsApp
 * hanya jika belum backup hari ini (berbasis `global.db`)
 * @param {import('@whiskeysocket/baileys').WASocket} sock - koneksi Baileys
 * @param {string} targetJid - JID penerima (contoh: 628xxx@s.whatsapp.net)
 */
async function autoBackup(sock, targetJid) {
  try {
    const today = moment().format('YYYY-MM-DD');

    // Siapkan struktur default jika belum ada
    if (!global.db?.data?.settings) global.db.data.settings = {};
    if (!global.db.data.settings.backup) global.db.data.settings.backup = {};

    // Skip jika sudah backup hari ini
    if (global.db.data.settings.backup.last === today) {
      console.log('[AUTO BACKUP] Hari ini sudah dibackup, skip.');
      return;
    }

    const now = moment().format('YYYY-MM-DD_HH-mm');
    const backupDir = path.join(__dirname, 'media');
    const zipPath = path.join(backupDir, `project-backup-${now}.zip`);

    await fs.ensureDir(backupDir);

    // Buat file ZIP
    await new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', resolve);
      archive.on('error', reject);

      archive.pipe(output);
      archive.glob('**/*', {
        cwd: path.resolve(__dirname),
        ignore: ['node_modules/**', 'session/**', 'backup/**', '*.zip'],
      });

      archive.finalize();
    });

    // Kirim ke WhatsApp
    const buffer = fs.readFileSync(zipPath);
    const fileName = path.basename(zipPath);
    const mimetype = mime.lookup(zipPath) || 'application/zip';

    await sock.sendMessage(targetJid, {
      document: buffer,
      mimetype,
      fileName,
      caption: `📦 Backup otomatis (${now})`,
    });

    console.log(`[AUTO BACKUP] Berhasil dikirim ke ${targetJid}`);

    // Tandai backup hari ini selesai
    global.db.data.settings.backup.last = today;
    await global.db.write();

    // Hapus zip setelah dikirim
    await fs.unlink(zipPath);
    console.log(`[AUTO BACKUP] File ${fileName} dihapus setelah dikirim.`);
  } catch (err) {
    console.error('[AUTO BACKUP] Gagal:', err);
  }
}

module.exports = autoBackup;
