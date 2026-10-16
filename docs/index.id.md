# Ucapan ElevenLabs

Atur modul melalui popup konfigurasi administrator, termasuk saat dinonaktifkan. Masukkan kunci API ElevenLabs, temukan dan pilih suara bawaan, atau masukkan ID secara manual bila pencarian tidak tersedia. Audio uji memakai pengaturan formulir yang belum disimpan. Kunci disembunyikan saat dibaca dan bertahan setelah mulai ulang atau penonaktifan; penghapusan konten modul menghapus kunci.

## Penggunaan

## Spesifikasi teknis

Modul aktif menerbitkan `speech:synthesis`. Panggil `synthesize({ text, language?, voiceId?, phonemes? }, signal?)` untuk memperoleh `{ mediaType, data }`. Tanpa `voiceId`, suara bawaan digunakan. `revision` berubah saat konfigurasi disimpan agar cache dapat diperbarui. Fonem IPA bahasa Inggris memakai SSML, selain itu memakai model multibahasa. Masukan dibatasi 5000 karakter dan keluaran berupa MP3 terbatas. Permintaan memakai asal HTTPS tetap, menolak pengalihan, dan memiliki batas waktu; penghentian modul membatalkan permintaan. Log tidak memuat kunci, teks, atau audio.

Rute `/api/v1/modules/elevenlabs-tts/config` menyediakan GET, PUT, DELETE khusus administrator serta POST `/voices` (pencarian berhalaman) dan `/test` (pratinjau audio). Kedua tindakan menerima nilai formulir terkini dan mempertahankan kunci tersimpan bila tidak diberikan. Saat dinonaktifkan hanya rute konfigurasi berjalan. Penyimpanan memakai `db:executor` tanpa pengandar basis data bawaan.

Kapabilitas ucapan tidak berisi kebijakan Study. Pemanggil memeriksa otorisasi dan namespace sebelum meminta ucapan. Cognis Study hanya membuat ucapan untuk kartu global tersimpan; kartu pribadi dan kelas menerima rekaman atau merangkai audio kartu penyusun yang tersedia. Repositori ini tidak memuat paket bahasa.

`npm install` · `npm run lint` · `npm test` · `npm run manifest:hashes` · `npm run check:manifest`
