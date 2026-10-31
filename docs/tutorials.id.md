# Tutorial terpandu

Menu akun menampilkan alur pengantar modul ini ketika penyedia antarmukanya aktif dan akun saat ini memiliki akses. Host harus menyediakan kontrak `ui:tutorials` versi satu.

## Contoh Penggunaan

Alur mengarahkan administrator ke kartu marketplace modul ini melalui kapabilitas target modul publik milik host. Kredensial tidak pernah dibaca atau diubah.

## Spesifikasi Teknis

Modul mendaftarkan alur dan teks terjemahannya melalui ctx. Host mengelola katalog, petunjuk, panah, sorotan, kendali papan ketik dan penunjuk, navigasi SPA dengan pemeriksaan akses, serta aksesibilitas. Menutup tutorial, berpindah halaman di luar alur, kehilangan akses atau menonaktifkan modul mengakhiri sesi. Kegagalan pemasangan penyedia membatalkan pendaftarannya.

Alur ini hanya memberi penjelasan. Alur tidak membuat akun, mengubah konfigurasi, mengirim pesan, menyetujui perjanjian atau memulai panggilan. Target harus cocok dengan satu elemen; konten yang tidak tersedia menyediakan pilihan mencoba lagi dan membatalkan.

Pengujian penyedia memeriksa kontrak publik, keempat terjemahan, aturan ketersediaan, pembersihan saat gagal, dan penolakan versi host yang tidak didukung.
