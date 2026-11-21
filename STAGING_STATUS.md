# Status Lingkungan Staging JOS

## Repositori
- Repositori staging terpisah: `BOKING-STAGING`.
- Repositori produksi `BOKING` tidak diubah.
- Manifest dan service worker khusus staging sudah tersedia.

## Kondisi saat ini
- `index.html` saat ini kosong (0 byte) dan belum dapat dipakai sebagai salinan aplikasi pelanggan. Jangan anggap staging sudah siap dibuka atau diuji.
- Ikon PWA `jos-icon-192.png` dan `jos-icon-512.png` belum tersedia.
- Belum ada deployment/preview staging yang diverifikasi.

## Persetujuan penggunaan Supabase
Pemilik mengizinkan pengujian staging menggunakan proyek Supabase JOS yang saat ini aktif, dengan ketentuan:
- Semua data uji diberi penanda yang jelas (misalnya nama/email/nomor uji berawalan `STAGING-TEST`).
- Catat ID data uji yang dibuat agar dapat dibersihkan setelah pengujian.
- Hindari mengirim notifikasi sungguhan ke pelanggan/mitra dan jangan melakukan pembayaran sungguhan.
- Jangan menghapus data produksi. Hanya hapus record yang teridentifikasi sebagai data uji dan setelah dikonfirmasi.
- Penggunaan database produksi untuk staging berisiko memengaruhi dashboard, laporan, trigger, dan notifikasi. Lakukan pengujian terbatas dan hati-hati.

## Aturan rilis
- Staging dan produksi tetap terpisah.
- Uji perubahan sebelum rilis.
- Jangan merge atau menyalin perubahan ke `BOKING` tanpa persetujuan pemilik.
- Jangan mengubah fitur, data, atau alur yang sudah berjalan tanpa instruksi eksplisit.
