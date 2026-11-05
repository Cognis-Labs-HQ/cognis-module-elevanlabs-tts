# Tutorial terpandu

**Feature Branch:** feature-guided-tutorials

## Spesifikasi Teknis

Alur mengarahkan administrator ke kartu marketplace modul ini melalui kapabilitas target modul publik milik host. Kredensial tidak pernah dibaca atau diubah.

Modul mendaftarkan alur dan teks terjemahannya melalui ctx. Host mengelola katalog, petunjuk, panah, sorotan, kendali papan ketik dan penunjuk, navigasi SPA dengan pemeriksaan akses, serta aksesibilitas. Menutup tutorial, berpindah halaman di luar alur, kehilangan akses atau menonaktifkan modul mengakhiri sesi. Kegagalan pemasangan penyedia membatalkan pendaftarannya.

Pengujian penyedia memeriksa kontrak publik, keempat terjemahan, aturan ketersediaan, pembersihan saat gagal, dan penolakan versi host yang tidak didukung.

## Kunjungan Awal Terikat Halaman

Host mengelola petunjuk, panah, sorotan, aksesibilitas, dan menu aksi mengambang bersama. Sesi pertama selalu menyediakan Berikutnya, tanpa Batal atau Lewati. Pemutaran ulang menyediakan Batal dengan `btn-cancel`. Penyelesaian disimpan di browser per akun. Navigasi, hilangnya akses, atau pelepasan penyedia mengakhiri sesi; pemasangan gagal membatalkan registrasi.

## Petunjuk Yang Berguna

Langkah tutorial berfokus pada kontrol dan tugas yang tersedia, tanpa pernyataan yang tidak relevan tentang izin atau tindakan yang tidak dilakukan panduan.

## Komit

- [8a833d3](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/8a833d311d6081e5f334759ebdeca75284117e80)
- [8e04486](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/8e044869c477a4bcd7c9326f5495ddb77c5b142f)
