# Status Lingkungan Staging JOS

## Repositori
- Repositori staging terpisah: `BOKING-STAGING` (publik).
- Repositori produksi `BOKING` tidak diubah.
- Aplikasi pelanggan telah dipulihkan ke `index.html` dari file sumber `index (43).html`.
- Manifest dan service worker khusus staging tersedia; ikon PWA 192px dan 512px telah disalin.

## Kondisi saat ini
- Sumber aplikasi sudah masuk ke branch `main` staging.
- Blob SHA file `index.html` telah dicocokkan dengan blob yang dibuat ulang dari sumber yang sama.
- Deployment GitHub Pages belum dapat diverifikasi dan belum boleh dianggap aktif.
- URL staging belum dinyatakan siap untuk menerima pesanan atau pengujian operasional.

## Persetujuan penggunaan Supabase
Pemilik mengizinkan pengujian staging menggunakan proyek Supabase JOS yang saat ini aktif, dengan ketentuan:
- Semua data uji diberi penanda jelas (misalnya nama/email/nomor uji berawalan `STAGING-TEST`).
- Catat ID data uji yang dibuat agar dapat dibersihkan setelah pengujian.
- Hindari notifikasi sungguhan ke pelanggan/mitra dan jangan melakukan pembayaran sungguhan.
- Jangan menghapus data produksi. Hanya hapus record yang teridentifikasi sebagai data uji dan setelah dikonfirmasi.
- Penggunaan database produksi untuk staging berisiko memengaruhi dashboard, laporan, trigger, dan notifikasi. Lakukan pengujian terbatas dan hati-hati.

## Aturan rilis
- Staging dan produksi tetap terpisah.
- Uji perubahan sebelum rilis.
- Jangan menyalin perubahan ke `BOKING` tanpa persetujuan pemilik.
- Jangan mengubah fitur, data, atau alur yang sudah berjalan tanpa instruksi eksplisit.
