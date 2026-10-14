# Templat Modul Eksternal

Buat setiap modul Cognis eksternal baru dari repositori ini. Contoh yang dapat dipasang menunjukkan UI, API, basis data, CLI, kapabilitas, alur, pelokalan, uji siklus hidup dan integritas paket. Ganti identitas serta konten contoh sambil mempertahankan standar dan pemeriksaannya.

## Contoh Penggunaan

- Buka `/showcase` setelah modul diaktifkan untuk memakai UI page composer yang dilokalkan.
- Jalankan `cognisctl modules:module-template:list` untuk memakai API terautentikasi yang sama melalui CLI.
- Gunakan `module-template:listItems` melalui `ctx`, bukan dengan mengimpor internal modul.
- Perluas alur `module-template:listItems` melalui tahap bernama yang dapat dilepas.
- Nonaktifkan lalu aktifkan kembali modul untuk memverifikasi registrasi tercakup dapat diulang.

## Spesifikasi Teknis

Aturan berikut merangkum kontrak runtime inti dan pola yang telah terbukti pada modul Cognis yang berdekatan.

### Kontrak Repositori dan Manifes

- Satu repositori mengirim tepat satu modul. Pertahankan `manifest.json`, `package.json`, `routes.json`, dan `bootstrap.js` di root.
- Pertahankan UUID selamanya dan gunakan UUID untuk komponen wajib. Selaraskan versi manifes, paket, dan lockfile.
- Deklarasikan entrypoint dan aset relatif repositori dengan tepat. `routes.json` tetap berupa array dan `package.json` berupa paket ES module.
- Tetapkan `ui.stringsBaseUrl`, gunakan kunci locale huruf kecil yang dipisahkan titik, dan jaga kesetaraan kunci Jerman, Inggris, Indonesia, dan Jepang.
- Deklarasikan hanya rute, kapabilitas, dependensi, dan izin yang diperlukan. Buat ulang `manifest.files` terakhir. Kecualikan manifes, `docs/changelog/`, alias kompatibilitas root `README.md` yang opsional, serta setiap tautan simbolis atau entri nonreguler lainnya. Berkas README yang dilokalkan tetap menjadi berkas paket reguler.

### Isolasi dan Siklus Hidup

- `bootstrap.js` mengorkestrasi seluruh integrasi host melalui `ctx` tercakup; implementasi fitur dan impor internal Cognis tidak berada di sana.
- Kapabilitas adalah kontrak netral. Modul tanpa privilege mengawali ID kapabilitas dan alur yang dikontribusikan dengan ID manifesnya; segmen yang dipisahkan titik dua memakai camelCase. Temukan komponen opsional melalui kapabilitas.
- Orkestrasi bermakna memakai alur bernama dan tahap stabil yang dapat dilepas. Handler rute memvalidasi dan mengoordinasikan; kapabilitas mengerjakan pekerjaan khusus penyedia.
- Disposer atau `teardownModule` menghapus timer, listener, soket, dan skrip yang tidak tercakup. `uninstallModule(ctx, { deleteContent })` mempertahankan konten eksternal kecuali penghapusan diminta secara eksplisit.
- Uji pemasangan, aktif–nonaktif–aktif, dan pencopotan. Tidak boleh ada rute, registrasi aset, kontribusi UI, kapabilitas, atau hook alur yang bocor antarsiklus.

### UI dan Kepemilikan Host

- Susun halaman dengan page composer host dan navigasikan lewat router host. Gunakan tautan untuk navigasi dan tombol untuk tindakan.
- Modul hanya menata turunan miliknya di mount root. Jangan mengubah shell, `document.body`, `document.head`, atau kelas milik host.
- Ambil primitif UI dan gaya bersama dari `ui:reuse`; muat skrip runtime melalui `ui:resourceLoader` dan lepaskan handle-nya.
- Gunakan kontrak host untuk toast, popup galat/keputusan, stempel waktu, tema, font, avatar, dan fokus. Jangan gunakan dialog browser, navigasi muat ulang, simpul status sembarang, komentar CSS, atau salinan CSS host.
- Lokalkan teks terlihat dan aksesibilitas dalam keempat bundel XML. Pilih SVG yang dapat mengikuti tema daripada emoji dan glif platform.

### API, Data, dan Konfigurasi

- Validasi, normalisasi, autentikasi, dan otorisasi di batas sebelum logika bisnis. Kembalikan galat stabil tanpa detail internal.
- Simpan data di balik executor dari `ctx` dan store milik modul; parameterkan kueri dan beri namespace pada objek skema. Jangan mengimpor driver konkret.
- Jangan membuat batas hasil saat pemanggil tidak memberikannya. Validasi batas eksplisit tanpa membatasinya diam-diam.
- Gunakan `ui.preferences` manifes dan API konfigurasi modul untuk pengaturan administrator, bukan layar pengaturan kedua. Pertahankan konfigurasi saat nonaktif/mulai ulang dan jangan pernah mengembalikan kata sandi tersimpan.
- Simpan rahasia pengguna di keyring host. Buat ID dan rahasia dengan Web Crypto atau Node Crypto, bukan `Math.random()`.
- Catat perubahan keadaan pada `info`, kegagalan tertangkap pada `error` dengan konteks terstruktur yang aman, dan kegagalan tak tertangkap sebagai fatal. Fallback yang disengaja selalu dicatat.

### Struktur dan Kualitas

- Tempatkan server, browser, CLI, dokumentasi, data, tooling, dan karya seni masing-masing di `api/`, `ui/`, `cli/`, `docs/`, `data/`, `scripts/` atau `tooling/`, dan `assets/`.
- Kode lintas fitur yang benar-benar dapat digunakan ulang dalam satu lapisan masuk ke `reuse/`; kode fitur tetap dekat pemiliknya. Hindari direktori `shared`, `utils`, `helpers`, dan `common`.
- Jaga berkas kohesif dan maksimal 1000 baris. Utamakan nama deskriptif, alur kontrol yang mudah dibaca, komentar batasan yang berguna, dan tanpa shim kompatibilitas usang.
- Pengujian berjalan mandiri dengan fake `ctx` lokal serta mencakup API publik, kapabilitas, alur, otorisasi, lokalisasi, siklus hidup, dan integritas manifes.

### Daftar Periksa Rilis

1. Tinjau UUID dependensi, kapabilitas wajib, akses rute, metadata, terjemahan, karya seni, dan penanganan rahasia.
2. Selaraskan versi manifes, paket, dan lockfile untuk perubahan kontrak, kode, skema, atau API.
3. Jalankan `npm install`, `npm run lint`, dan `npm test`.
4. Jalankan `npm run manifest:hashes` setelah perubahan berkas distribusi terakhir, lalu `npm run check:manifest` dan `git diff --check`.
5. Untuk modul selain templat, tambahkan empat berkas lokal `docs/changelog/<branch>.<lang>.md` dan selesaikan asal commit tanpa mencerna changelog.

Setiap modul eksternal baru dimulai dari templat ini. Buat UUID produk baru sekali, ganti metadata dan namespace contoh, dan pertahankan AGENTS.md serta alat validasi. Rute domain ada di `api/routes/<domain>/`, style di `ui/styles/`, markup di `ui/templates/`, dan catatan rilis di `docs/changelog/`. Baca dan tulis API menjalankan tahap terdaftar; halaman browser memakai page composer dan navigasi terbatas.

Titik masuk dan target gambar harus berupa file reguler di dalam checkout, termasuk setelah resolusi jalur. Target ini divalidasi sebelum hash inventaris. Dokumen pengembang menjelaskan kontrak publik dan merujuk manifes untuk metadata rilis. ID tahap alur yang sudah diterbitkan dipertahankan. `mountWhenDirect(mount)` menyediakan AbortSignal navigasi host; periksa setelah inisialisasi asinkron sebelum membuat sumber daya UI.
