# Penggunaan

Hasilkan audio ucapan dengan akun ElevenLabs yang dikonfigurasi untuk fitur Cognis yang diizinkan.

## Prasyarat

Administrator memerlukan kunci API ElevenLabs, suara yang tersedia, dan akses jaringan ke penyedia. Pratinjau pengaturan tidak menyimpannya.

## Contoh

Buka Settings modul sebagai administrator, masukkan kunci dan pilih suara. Buat serta putar audio uji, lalu simpan konfigurasi secara tegas dan aktifkan modul untuk konsumen.

### Penggunaan

```js
const speech = ctx.getCapability("elevenlabs-tts:synthesis");
const audio = await speech.synthesize(
    { text: phrase, language, voiceId },
    signal,
);
```

Panduan administrator dimulai pada halaman detail ElevenLabs. Mengklik Pengaturan membuka cabang kunci API, suara bawaan, penemuan suara, frasa uji, pembuatan audio, dan pemutaran opsional. Berikutnya tanpa membuka Pengaturan melewati cabang. Kontrol diperoleh dari kontrak target modul publik host tanpa memeriksa markup popup milik komponen lain. Registrasi tidak mengubah penyelesaian tutorial atau kredensial.

## Hasil yang Diharapkan

Pratinjau yang valid menghasilkan audio yang dapat diputar. Sintesis umum siap hanya setelah kunci dan suara bawaan disimpan; penyedia yang tidak ada atau dinonaktifkan tidak menggantikan rekaman unggahan.

## Pemecahan Masalah

Jika penemuan suara gagal, periksa akses penyedia serta kredensial atau masukkan ID suara yang diketahui secara manual. Bahasa tak didukung, teks terlalu panjang, dan kesalahan penyedia menolak pembuatan alih-alih menghasilkan audio rekaan.
