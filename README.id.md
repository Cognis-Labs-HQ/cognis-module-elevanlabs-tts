# Templat modul eksternal Cognis

[English](README.en.md) · [Deutsch](README.de.md) · **Bahasa Indonesia** · [日本語](README.ja.md)

Buat setiap modul Cognis eksternal baru dari repositori ini. Contoh yang dapat dipasang menunjukkan UI, API, basis data, CLI, kapabilitas, alur, pelokalan, uji siklus hidup dan integritas paket. Ganti identitas serta konten contoh sambil mempertahankan standar dan pemeriksaannya.

## Mulai di sini

```sh
npm install
npm test
npm run check:manifest
```

Pasang repositori sebagai sumber modul Cognis, tinjau izinnya, aktifkan, lalu buka `/showcase` atau jalankan `cognisctl modules:module-template:list`.

## Peta arsitektur

| Jalur           | Tanggung jawab                                                                              | Pelajaran utama                                                  |
| --------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `manifest.json` | Identitas, kompatibilitas, kapabilitas, entrypoint, metadata penyimpanan, hash berkas tetap | UUID adalah dependensi; ID mudah dibaca manusia                  |
| `bootstrap.js`  | Satu-satunya titik integrasi host                                                           | Daftarkan melalui `ctx`; jangan mengimpor internal Cognis        |
| `routes.json`   | Deklarasi akses halaman di muka                                                             | Host memvalidasi rute terlindungi sebelum aktivasi               |
| `api/index.js`  | Batas HTTP terautentikasi dan orkestrasi                                                    | Validasi masukan dan delegasikan persistensi                     |
| `api/store.js`  | Perintah eksekutor basis data portabel dan skema                                            | Jangan mengikat modul ke driver basis data                       |
| `api/ui.js`     | Aset statis, rute SPA, navigasi                                                             | Registrasi host membatasi pembersihan saat dinonaktifkan/dihapus |
| `ui/`           | Entrypoint browser, gaya, empat bundel bahasa                                               | Tetapkan `ui.stringsBaseUrl`; gunakan rute/toast host            |
| `cli/index.js`  | Ekstensi `cognisctl`                                                                        | CLI memanggil API publik, bukan melewatinya                      |
| `docs/`         | Uraian mendalam bagi kontributor                                                            | Menjelaskan kontrak dan pola ekstensi yang aman                  |
| `scripts/`      | Pemeriksaan integritas paket                                                                | Setiap berkas yang dikirim memiliki hash SHA-256                 |

## Siklus hidup dan batas

1. Cognis memvalidasi `manifest.json`, dependensi komponen, kebutuhan kapabilitas, rute, dan hash berkas.
2. Aktivasi memanggil `bootstrapModule(ctx)`. Modul mendaftarkan kontribusi UI/API, menerbitkan kapabilitas, dan memperluas flow.
3. Handler API mengautentikasi dan memvalidasi. Store memiliki skema dan persistensi melalui `db:executor`.
4. UI dan CLI memakai API HTTP yang sama. Komponen lain dapat memakai `module-template:listItems` melalui `ctx`.
5. Registrasi bercakupan dihapus ketika dinonaktifkan. Tambahkan dan kembalikan disposer eksplisit jika Anda membuat timer, listener, socket, atau sumber daya lain di luar registrasi bercakupan.
6. Penghapusan memanggil `uninstallModule(ctx, { deleteContent })`; templat hanya menghapus baris basis datanya ketika administrator meminta penghapusan konten.

Perilaku lintas komponen ditempatkan dalam **kapabilitas** (kontrak yang dapat dipanggil) atau **flow** (tahap ekstensi berurutan). Jangan mengakses Cognis, gateway, atau pohon sumber modul lain secara langsung. Tautan komponen wajib dalam `requires` berupa UUID; kontrak runtime ditempatkan dalam `requiresCapabilities`.

## Membuat fork templat ini

1. Pilih ID stabil yang mudah dibaca dan buat UUID baru satu kali. Jangan pernah memakai ulang UUID templat ini dalam fork yang diterbitkan.
2. Ubah nama paket, perintah, jalur API/statis, prefiks tabel DB, namespace pelokalan, ID ekstensi flow, dan kunci kapabilitas.
3. Ganti metadata penerbit/repositori/dukungan dan karya visual.
4. Samakan versi manifest/paket/lockfile dan tetapkan `ui.stringsBaseUrl` dalam manifest ke URL dasar bundel bahasa milik modul.
5. Tambahkan hanya kapabilitas yang benar-benar diperlukan dan pertahankan akses rute seminimal mungkin.
6. Jalankan `npm run manifest:hashes` terakhir, lalu `npm run check` dan `git diff --check`.

Baca [`docs/index.id.md`](docs/index.id.md) sebelum menerapkan modul produksi; referensi setara dalam bahasa Jerman, Inggris, dan Jepang tersedia di sebelahnya.

## Pemeriksaan kualitas kontributor

Templat ini menyertakan pagar pengaman otomatis yang sama dengan modul Jitsi Meet: pemformatan Prettier, batas keterbacaan, pemeriksaan struktur modul eksternal, kesetaraan templat dokumentasi, dan pemeriksaan nama ambigu.

```sh
npm install
npm run lint
npm test
npm run check:manifest
git diff --check
```

Dokumentasi kontrak baru dapat dimulai dari templat terlokalisasi di `.github/DOCUMENTATION_TEMPLATE.<language>.md`. Jaga agar struktur keempat variannya selalu sinkron.
