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

## Tentukan isyarat Berikutnya per langkah

Setiap langkah tutorial kini menetapkan `highlightNext` secara eksplisit: penjelasan yang memerlukan Berikutnya atau Selesai mengaktifkannya, sedangkan latihan berbasis interaksi atau penantian menonaktifkannya. Pengurangan gerakan mempertahankan garis tepi statis.

Setiap komponen antarmuka wajib dicakup tutorial. Panduan kontribusi mengharuskan alur tugas yang berfokus pada pengguna dan peninjauan tutorial setiap kali fitur atau perilaku antarmuka berubah.

## Wilayah tutorial yang terlihat

Wilayah tutorial dan isyarat Berikutnya ditetapkan secara eksplisit.

## Antrean menu mengambang bersama

Menu mengikuti antrean host bersama dan masa hidup komponen.

## Kontrol pemulihan yang didokumentasikan

Tampilan target hilang menyediakan Berikutnya dan Mulai Ulang Tutorial; pemutaran ulang juga menyediakan Batal.

## Panduan tutorial terarah

Tutorial menjelaskan kontrol terlihat yang berbeda sesuai urutan UI. Petunjuk bersama mencakup penemuan tampilan aktif, contoh stabil, keadaan kosong, cabang bersyarat, dan pembersihan siklus hidup. Kontrol pemutaran ulang serta dokumentasi pengurangan gerakan sesuai host bersama.

## Komit

- [8a833d3](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/8a833d311d6081e5f334759ebdeca75284117e80)
- [8e04486](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/8e044869c477a4bcd7c9326f5495ddb77c5b142f)
- [29faa2b](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/29faa2b205e9438ba21114715dc348bc921e2db6)
- [12f91d1](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/12f91d1edc8ef2b566ae7587a1a3b5b9fed0011b)
- [ff982d9](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/ff982d9087add1a1a1d2db0225c2974e57f9bd66)
- [e74c00138](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/e74c00138be73caf8dce73afd6d5690878033594)
- [a1451bd2c](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/a1451bd2c93bc2bdfedf01318185caadbaaee51a)
