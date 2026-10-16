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

## Komit

- [fc07131](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/fc071312db5bc106977928dc96b7a082c9db1cb8)
- [49e24af](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/49e24af7ea4dec01c4d173fcdc4d9ddc18fffe8f)
