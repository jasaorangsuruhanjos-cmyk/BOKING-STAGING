# Status Lingkungan Staging JOS

## Sudah disiapkan
- Repositori staging terpisah: `BOKING-STAGING` (private).
- Salinan aplikasi pelanggan terbaru dari arsip `index (43)(1).html` ditempatkan sebagai `index.html`.
- `manifest.json` disesuaikan untuk scope subfolder staging.
- `service-worker.js` dibuat khusus untuk scope staging dan tidak mengubah service worker produksi.
- Meta robots pada salinan staging diubah menjadi `noindex, nofollow, noarchive`.

## Belum aman untuk pengujian end-to-end
- Kode aplikasi pelanggan masih mengarah ke proyek Supabase JOS produksi (`aqhfkcdglfijdtsgyzmq`). Jangan gunakan formulir pemesanan, login, pembayaran, atau perubahan status dari salinan ini sebelum URL dan anon key diarahkan ke proyek staging terpisah.
- Ikon PWA `jos-icon-192.png` dan `jos-icon-512.png` belum disalin ke repositori staging.
- Belum ada deployment/preview staging yang diverifikasi.

## Aturan
Jangan hubungkan staging ke database produksi untuk pengujian yang menulis data. Jangan merge atau menyalin perubahan ke `BOKING` tanpa persetujuan pemilik.
