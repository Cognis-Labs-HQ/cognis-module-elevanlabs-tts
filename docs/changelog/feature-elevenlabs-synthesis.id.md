# Integrasi Ucapan Bersama

**Cabang Fitur:** feature-elevenlabs-synthesis

## Penggunaan

Pindahkan sintesis ElevenLabs ke modul terpisah yang dapat dikonfigurasi. Study memakai suara opsional per bahasa untuk kartu global tersimpan, sedangkan kartu pribadi dan kelas menerima unggahan terbatas dan rekaman mikrofon. Pertahankan komposisi kalimat berkelanjutan sebagai cadangan dari rekaman penyusun yang tersedia. Administrator dapat membuat ulang audio global saat mengedit.

## Perbaiki aktivasi Study

Naikkan versi paket konten Inggris dan Jepang saat menghapus rekaman bawaan. Selesaikan rekonsiliasi modul lain sebelum melaporkan aktivasi gagal agar rute persetujuan tetap memiliki alur terdaftar.

## Gambar penyedia dan CLI

Gunakan logo resmi ElevenLabs sebagai ikon SVG tajam dan banner gabungan Cognis/ElevenLabs. Nama berkas rilis mengikuti cabang fitur yang dinyatakan. Perintah terpasang `cognisctl modules:elevenlabs-tts:voices` menemukan suara melalui API konfigurasi publik terautentikasi.

## Pemeriksaan batas konfigurasi

Catat permintaan konfigurasi cacat tanpa isinya, tolak badan terlalu besar dengan HTTP 413, dan bedakan pengaturan tidak valid dari kegagalan penyedia. Hapus frasa uji bawaan yang ditulis langsung. Pertahankan semua judul dokumentasi pengembang yang ada.

## Hormati bahasa eksplisit

Gunakan Flash v2.5 untuk bahasa eksplisit yang didukung, pertahankan sintesis IPA Inggris, dan tolak kode bahasa tidak didukung sebelum permintaan penyedia.

## Jaga pratinjau sementara

Kecualikan frasa uji dari pengaturan tersimpan, hapus teks pratinjau lama saat memuat, dan tolak konfigurasi tidak lengkap tanpa mengubah nilai tersimpan.

## Nonaktifkan alur ucapan operasional

Muat layanan khusus konfigurasi saat dinonaktifkan. Pencarian suara dan pratinjau uji administrator tetap tersedia; alur sintesis umum tidak didaftarkan.

## Batasi dan lepaskan respons penyedia

Izinkan audio MP3 hingga 64 MiB untuk teks panjang yang diterima. Batalkan badan respons kesalahan dan media tidak valid sebelum mengembalikan kesalahan stabil.

## Prasyarat penyimpanan kredensial

Kontrak host saat ini menyamarkan respons konfigurasi tetapi tidak menyediakan penyimpanan kredensial dengan referensi opak. Penyimpanan aman oleh host masih terbuka di TODO.md; kunci API tetap di basis data konfigurasi.

## Komit

- [fc07131](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/fc071312db5bc106977928dc96b7a082c9db1cb8)
- [49e24af](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/49e24af7ea4dec01c4d173fcdc4d9ddc18fffe8f)
- [fa92c9b](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/fa92c9b607e5a21abc2db3b63c231fa32888b378)
