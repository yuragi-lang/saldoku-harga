// Robot harga Saldoku: mengambil harga kripto (Rupiah) dan emas, lalu menyimpan prices.json.
// Kalau satu sumber gagal, harga lama tetap dipakai supaya aplikasi tidak kosong.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const COINS = ['BTC', 'ETH', 'USDT', 'SOL', 'BNB', 'XRP', 'DOGE', 'ADA', 'TRX', 'USDC'];
const old = existsSync('prices.json') ? JSON.parse(readFileSync('prices.json', 'utf8')) : { prices: {}, sources: {} };
const prices = { ...(old.prices || {}) };
const sources = { ...(old.sources || {}) };
const now = new Date().toISOString();

async function getJson(url, browserLike = false) {
  const headers = browserLike
    ? { 'user-agent': 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Mobile Safari/537.36', accept: 'application/json' }
    : { 'user-agent': 'saldoku-harga-bot', accept: 'application/json' };
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.json();
}

// Kripto: Indodax dulu (harga Rupiah lokal), CoinGecko sebagai cadangan
const GECKO_IDS = { BTC: 'bitcoin', ETH: 'ethereum', USDT: 'tether', SOL: 'solana', BNB: 'binancecoin', XRP: 'ripple', DOGE: 'dogecoin', ADA: 'cardano', TRX: 'tron', USDC: 'usd-coin' };
let cryptoOk = false;
try {
  const data = await getJson('https://indodax.com/api/ticker_all', true);
  for (const sym of COINS) {
    const v = Number(data?.tickers?.[`${sym.toLowerCase()}_idr`]?.last);
    if (v > 0) { prices[sym] = v; cryptoOk = true; }
  }
  if (cryptoOk) sources.crypto = { name: 'Indodax', at: now };
} catch (e) {
  console.error('Indodax gagal:', e.message);
}
if (!cryptoOk) {
  try {
    const ids = Object.values(GECKO_IDS).join(',');
    const data = await getJson(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=idr`);
    for (const [sym, id] of Object.entries(GECKO_IDS)) {
      const v = Number(data?.[id]?.idr);
      if (v > 0) { prices[sym] = v; cryptoOk = true; }
    }
    if (cryptoOk) sources.crypto = { name: 'CoinGecko', at: now };
  } catch (e) {
    console.error('CoinGecko gagal:', e.message);
  }
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
