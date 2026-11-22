// Robot harga Atsume: mengambil harga kripto (Rupiah) dan emas, lalu menyimpan prices.json + coins.json.
// - Kripto: SEMUA koin yang diperdagangkan dalam Rupiah di Indodax, ditambah 500 koin teratas CoinGecko
//   (dipakai untuk koin yang tidak ada di Indodax).
// - Emas: harga emas dunia per gram dalam Rupiah.
// Kalau satu sumber gagal, harga lama tetap dipakai supaya aplikasi tidak kosong.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const old = existsSync('prices.json') ? JSON.parse(readFileSync('prices.json', 'utf8')) : { prices: {}, sources: {} };
const oldCoins = existsSync('coins.json') ? JSON.parse(readFileSync('coins.json', 'utf8')) : { coins: [] };
const prices = { ...(old.prices || {}) };
const sources = { ...(old.sources || {}) };
const now = new Date().toISOString();
/** sym -> { n: nama, r: peringkat } */
const meta = new Map();
for (const c of oldCoins.coins || []) meta.set(c.s, { n: c.n, r: c.r ?? 9999 });

async function getJson(url, browserLike = false) {
  const headers = browserLike
    ? { 'user-agent': 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Mobile Safari/537.36', accept: 'application/json' }
    : { 'user-agent': 'atsume-harga-bot', accept: 'application/json' };
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(25000) });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.json();
}
const clean = (s) => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

// 1) Indodax: semua pasangan *_idr (harga Rupiah lokal, jadi prioritas)
const fromIndodax = new Set();
try {
  const data = await getJson('https://indodax.com/api/ticker_all', true);
  for (const [pair, t] of Object.entries(data?.tickers || {})) {
    if (!pair.endsWith('_idr')) continue;
    const sym = clean(pair.slice(0, -4));
    const v = Number(t?.last);
    if (sym && v > 0) {
      prices[sym] = v;
      fromIndodax.add(sym);
      if (!meta.has(sym)) meta.set(sym, { n: sym, r: 9999 });
    }
  }
  if (fromIndodax.size) sources.crypto = { name: 'Indodax', at: now, count: fromIndodax.size };
} catch (e) {
  console.error('Indodax gagal:', e.message);
}

// 2) CoinGecko: 500 teratas (2 halaman x 250). Nama koin untuk pencarian + harga koin yang tidak ada di Indodax.
let geckoCount = 0;
for (const page of [1, 2]) {
  try {
    const list = await getJson(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=idr&order=market_cap_desc&per_page=250&page=${page}&sparkline=false`);
    for (const c of list) {
      const sym = clean(c.symbol);
      if (!sym) continue;
      const rank = Number(c.market_cap_rank) || 9999;
      const cur = meta.get(sym);
      // Simbol kembar: pakai koin dengan kapitalisasi terbesar (urutan pertama).
      if (!cur || cur.r === 9999 || rank < cur.r) meta.set(sym, { n: c.name || sym, r: rank });
      const v = Number(c.current_price);
      if (!fromIndodax.has(sym) && v > 0 && (!cur || cur.r >= rank)) {
        prices[sym] = v;
        geckoCount++;
      }
    }
  } catch (e) {
    console.error(`CoinGecko halaman ${page} gagal:`, e.message);
  }
  await new Promise((r) => setTimeout(r, 2500));
}
if (geckoCount) sources.cryptoExtra = { name: 'CoinGecko', at: now, count: geckoCount };

// 3) Emas: harga emas dunia per gram dalam Rupiah (acuan, bukan harga butik Antam)
try {
  const data = await getJson('https://xaus.com/api/v1/spot?currency=IDR&unit=gram');
  const v = Number(data?.xau?.price);
  if (v > 0) prices.XAU = Math.round(v);
  sources.gold = { name: 'Harga emas dunia (xaus.com), per gram', at: now };
} catch (e) {
  console.error('Emas gagal:', e.message);
}

// Harga dibulatkan wajar supaya file tetap kecil.
const round = (v) => (v >= 1000 ? Math.round(v) : v >= 1 ? Math.round(v * 100) / 100 : Number(v.toPrecision(4)));
const outPrices = Object.fromEntries(Object.entries(prices).filter(([, v]) => v > 0).map(([k, v]) => [k, round(v)]));
writeFileSync('prices.json', JSON.stringify({ updatedAt: now, prices: outPrices, sources }) + '\n');

const coins = [...meta.entries()]
  .filter(([s]) => outPrices[s] && s !== 'XAU')
  .map(([s, m]) => ({ s, n: m.n, r: m.r }))
  .sort((a, b) => a.r - b.r || a.s.localeCompare(b.s));
writeFileSync('coins.json', JSON.stringify({ updatedAt: now, coins }) + '\n');
console.log(`Harga: ${Object.keys(outPrices).length} (Indodax ${fromIndodax.size}, CoinGecko ${geckoCount}), daftar koin: ${coins.length}`);
