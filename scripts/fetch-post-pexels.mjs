/**
 * One-off: Pexels → WebP for positionen cards (max ~1400px, q78).
 * Usage: PEXELS_API_KEY=… node scripts/fetch-post-pexels.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const API_KEY = process.env.PEXELS_API_KEY;
if (!API_KEY) {
  console.error("Set PEXELS_API_KEY");
  process.exit(1);
}

const OUT_DIR = path.resolve("public/img/posts");
const MAX_W = 1400;
const WEBP_Q = 78;

/** slug → search query (landscape) */
const POSTS = {
  "weniger-buerokratie-mehr-unternehmertum": "modern office team business",
  "die-city-west-braucht-alles-gleichzeitig": "berlin city street shopping",
  "wie-technologie-teil-der-stadt-wird": "digital billboard city night",
  "berlin-sollte-selbstbewusster-auftreten": "berlin skyline architecture",
  "aus-einem-kaffee-ein-gespraech": "cafe coffee shop interior",
  "netzwerke-brauchen-raeume": "business networking event group",
  "zukunftsorte-verbinden-wissenschaft-und-wirtschaft": "science laboratory innovation",
  "innenstadt-braucht-mut-zur-veränderung": "urban downtown street retail",
};

async function searchPhoto(query) {
  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "1");
  url.searchParams.set("orientation", "landscape");
  const res = await fetch(url, {
    headers: { Authorization: API_KEY },
  });
  if (!res.ok) throw new Error(`Pexels ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const photo = data.photos?.[0];
  if (!photo) throw new Error(`No photo for: ${query}`);
  return photo.src.large2x || photo.src.large || photo.src.original;
}

await mkdir(OUT_DIR, { recursive: true });

for (const [slug, query] of Object.entries(POSTS)) {
  const srcUrl = await searchPhoto(query);
  const res = await fetch(srcUrl);
  if (!res.ok) throw new Error(`Download failed ${slug}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const out = path.join(OUT_DIR, `${slug}.webp`);
  const { width, height } = await sharp(buf)
    .resize({ width: MAX_W, withoutEnlargement: true })
    .webp({ quality: WEBP_Q, effort: 5 })
    .toFile(out);
  const stat = await import("node:fs/promises").then((fs) => fs.stat(out));
  console.log("✓", slug, `${width}x${height}`, `${Math.round(stat.size / 1024)}KB`);
}
