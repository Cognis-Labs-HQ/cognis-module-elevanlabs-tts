# Ucapan ElevenLabs

Atur modul melalui popup konfigurasi administrator, termasuk saat dinonaktifkan. Masukkan kunci API ElevenLabs, temukan dan pilih suara bawaan, atau masukkan ID secara manual bila pencarian tidak tersedia. Audio uji memakai pengaturan formulir yang belum disimpan. Kunci disembunyikan saat dibaca dan bertahan setelah mulai ulang atau penonaktifan; penghapusan konten modul menghapus kunci.

## Penggunaan

```js
const speech = ctx.getCapability("speech:synthesis");
const audio = await speech.synthesize(
    { text: phrase, language, voiceId },
    signal,
);
```

## Spesifikasi teknis

Modul aktif menerbitkan `speech:synthesis`. Panggil `synthesize({ text, language?, voiceId?, phonemes? }, signal?)` untuk memperoleh `{ mediaType, data }`. Tanpa `voiceId`, suara bawaan digunakan. `revision` berubah saat konfigurasi disimpan agar cache dapat diperbarui. Fonem IPA bahasa Inggris memakai SSML dengan `eleven_turbo_v2`. Permintaan bahasa eksplisit memakai `eleven_flash_v2_5` yang menghormati kode bahasa yang didukung; kode tidak didukung ditolak sebelum permintaan. Tanpa bahasa, `eleven_multilingual_v2` mendeteksinya otomatis. Masukan dibatasi 5000 karakter dan keluaran berupa MP3 terbatas. Permintaan memakai asal HTTPS tetap, menolak pengalihan, dan memiliki batas waktu; penghentian modul membatalkan permintaan. Log tidak memuat kunci, teks, atau audio.

Rute `/api/v1/modules/elevenlabs-tts/config` menyediakan GET, PUT, DELETE khusus administrator serta POST `/voices` (pencarian berhalaman) dan `/test` (pratinjau audio). Kedua tindakan menerima nilai formulir terkini dan mempertahankan kunci tersimpan bila tidak diberikan. Saat dinonaktifkan hanya rute konfigurasi berjalan. Penyimpanan memakai `db:executor` tanpa pengandar basis data bawaan.

Kapabilitas ucapan tidak berisi kebijakan Study. Pemanggil memeriksa otorisasi dan namespace sebelum meminta ucapan. Cognis Study hanya membuat ucapan untuk kartu global tersimpan; kartu pribadi dan kelas menerima rekaman atau merangkai audio kartu penyusun yang tersedia. Repositori ini tidak memuat paket bahasa.

`npm install` · `npm run lint` · `npm test` · `npm run manifest:hashes` · `npm run check:manifest`

Temukan suara melalui `cognisctl modules:elevenlabs-tts:voices`. Perintah memakai konfigurasi tersimpan dan rute `/config/voices` khusus administrator yang terautentikasi, termasuk paginasi penyedia. Kontrak bantuan CLI saat ini hanya menerima deskripsi literal; pesan ucapan dan konfigurasi tetap dilokalkan oleh host. Gambar modul memakai tanda ElevenLabs dari situs resminya dan banner gabungan Cognis/ElevenLabs.

Respons audio dibatasi 64 MiB untuk masukan 5000 karakter pada 128 kbps. Penyimpanan konfigurasi memerlukan kunci API dan suara bawaan tidak kosong setelah menggabungkan nilai tersamar yang tidak berubah. Frasa pratinjau bersifat sementara: tidak disimpan, pembacaan mengembalikan frasa kosong, dan pemuatan konfigurasi lama menghapus teks pratinjau tersimpan. Konfigurasi nonaktif hanya mendaftarkan alur administrasi, tanpa `elevenlabs-tts:synthesize`. Badan respons penyedia yang ditolak dibatalkan sebelum mengembalikan kesalahan stabil.

Kontrak nilai tersembunyi host menyamarkan kredensial pada pembacaan API; kontrak ini tidak menyediakan penyimpanan kredensial terenkripsi atau kapabilitas penyimpanan rahasia dengan referensi opak. Kunci API operasional tetap berada di basis data konfigurasi modul. Prasyarat penyimpanan oleh host dicatat di [TODO.md](../TODO.md).
