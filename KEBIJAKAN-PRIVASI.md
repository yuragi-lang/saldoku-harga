# Kebijakan Privasi Atsume

Berlaku sejak: 22 November 2026

Atsume adalah aplikasi pencatat keuangan pribadi. Kami merancangnya supaya data keuanganmu tetap milikmu dan tetap berada di HP-mu.

## Ringkasnya

- Atsume **tidak punya server** dan **tidak meminta akun**. Kami tidak menerima, melihat, atau menyimpan data keuanganmu.
- Tidak ada iklan, tidak ada pelacak, tidak ada analitik, dan data tidak dijual kepada siapa pun.
- Semua data disimpan di HP-mu dan **dienkripsi**.

## Data yang disimpan di HP

Atsume menyimpan apa yang kamu catat: dompet dan saldo, transaksi, tagihan, cicilan, pinjaman, arisan, amplop, tabungan, kategori, dan pengaturan aplikasi.

- Data dienkripsi dengan AES-256-GCM. Kunci enkripsinya dibuat acak di HP dan disimpan di Android Keystore, sehingga tidak bisa dibaca aplikasi lain.
- PIN tidak disimpan apa adanya, hanya dalam bentuk hash.
- Cadangan otomatis Android (Google backup) **dimatikan** untuk Atsume. Data hanya pindah ke HP lain lewat file cadangan yang kamu buat sendiri.

## Koneksi internet

Atsume hanya terhubung ke internet untuk:

1. **Harga kripto dan emas (fitur Premium).** Aplikasi mengunduh daftar harga dari `raw.githubusercontent.com` (GitHub). Yang diunduh hanya harga; tidak ada data milikmu yang dikirim. Seperti semua situs web, GitHub dapat mencatat alamat IP yang mengakses berkasnya.
2. **Daftar koin kripto.** Saat kamu mencari koin, aplikasi mengunduh daftar nama koin dari GitHub. Tidak ada data milikmu yang dikirim.
3. **Pengenal suara (jika kamu memakai fitur catat pakai suara)**. Lihat bagian Mikrofon di bawah.
4. **Pembayaran Premium** diproses oleh Google Play sesuai kebijakan privasi Google. Atsume tidak menerima data kartu atau rekeningmu.

## Mikrofon

Mikrofon hanya aktif saat kamu menekan tombol 🎙️. Suara diubah menjadi teks oleh layanan pengenal suara bawaan HP:

- Jika paket bahasa Indonesia offline tersedia di HP, suara **diproses di HP** dan tidak dikirim ke internet.
- Jika tidak, suara diproses oleh layanan pengenal suara Google sesuai kebijakan privasi Google. Kamu bisa menyalakan pilihan "Suara hanya diproses di HP" di Pengaturan untuk menolak cara ini.

Atsume tidak merekam atau menyimpan rekaman suara. Teks hasilnya hanya dipakai untuk mengisi transaksi di HP-mu.

## Notifikasi

Semua notifikasi (pengingat mencatat, jatuh tempo tagihan, ringkasan gajian) dijadwalkan langsung di HP dari datamu sendiri. Tidak ada notifikasi yang dikirim dari server.

## Izin lain

- **Notifikasi**: untuk pengingat yang dijadwalkan di HP.
- **Sidik jari/wajah**: diperiksa oleh sistem Android. Atsume tidak pernah menerima data biometrikmu.
- **Getar**: untuk umpan balik saat menyimpan.

## Cadangan dan ekspor

File cadangan dan laporan (Excel/PDF) hanya dibuat saat kamu memintanya, lalu dibagikan lewat menu Bagikan ke tempat yang kamu pilih. Cadangan bisa dikunci dengan password. File laporan tidak dikunci, jadi berhati-hatilah saat membagikannya.

## Menghapus data

Kamu bisa menghapus semua data lewat **Pengaturan → Mulai dari nol**, atau dengan menghapus aplikasi. Karena kami tidak menyimpan salinan, data yang sudah dihapus tidak bisa kami pulihkan.

## Anak-anak

Atsume tidak ditujukan untuk anak di bawah 13 tahun.

## Perubahan kebijakan

Jika kebijakan ini berubah, versi terbaru akan dimuat di halaman ini dengan tanggal berlaku yang baru.

## Kontak

Pertanyaan tentang privasi: **[isi email kontak]**

Atsume sebelumnya bernama Saldoku.
