# saldoku-harga

Daftar harga kripto (Rupiah) dan emas untuk fitur **harga otomatis** di aplikasi Saldoku (Premium).

- File yang dibaca aplikasi: [`prices.json`](prices.json)
- Diperbarui otomatis setiap 30 menit oleh GitHub Actions (`.github/workflows/update-prices.yml`).
- Sumber kripto: Indodax (harga terakhir pasangan IDR), dengan cadangan CoinGecko.
- Sumber emas: harga emas dunia per gram dalam Rupiah (acuan, bukan harga butik Antam).

Repository ini tidak berisi data pengguna.
