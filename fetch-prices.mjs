// Robot harga Saldoku: mengambil harga kripto (Rupiah) dan emas, lalu menyimpan prices.json.
// Kalau satu sumber gagal, harga lama tetap dipakai supaya aplikasi tidak kosong.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const COINS = ['BTC', 'ETH', 'USDT', 'SOL', 'BNB', 'XRP', 'DOGE', 'ADA', 'TRX', 'USDC'];
const old = existsSync('prices.json') ? JSON.parse(readFileSync('prices.json', 'utf8')) : { prices: {}, sources: {} };
const prices = { ...(old.prices || {}) };
const sources = { ...(old.sources || {}) };
const now = new Date().toISOString();

async function getJson(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'saldoku-harga-bot' }, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.json();
}

// Kripto: Indodax (harga terakhir dalam Rupiah)
try {
  const data = await getJson('https://indodax.com/api/ticker_all');
  for (const sym of COINS) {
    const t = data?.tickers?.[`${sym.toLowerCase()}_idr`];
    const v = Number(t?.last);
    if (v > 0) prices[sym] = v;
  }
  sources.crypto = { name: 'Indodax', at: now };
} catch (e) {
  console.error('Kripto gagal:', e.message);
}

// Emas: harga emas dunia per gram dalam Rupiah (acuan, bukan harga butik Antam)
try {
  const data = await getJson('https://xaus.com/api/v1/spot?currency=IDR&unit=gram');
  const v = Number(data?.xau?.price);
  if (v > 0) prices.XAU = Math.round(v);
  sources.gold = { name: 'Harga emas dunia (xaus.com), per gram', at: now };
} catch (e) {
  console.error('Emas gagal:', e.message);
}

const out = { updatedAt: now, prices, sources };
writeFileSync('prices.json', JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out));
