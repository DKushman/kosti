/**
 * Generates responsive WebP variants for every JPEG/WebP photo in public/img
 * and writes lib/image-manifest.json (available widths + intrinsic size).
 * Output: public/img/w/<name>-<width>.webp
 * Sources wider than MAX_WIDTH are capped (huge originals are never served).
 * If both <name>.jpg and <name>.webp exist, the JPEG is used as the source.
 * Run: node scripts/optimize-images.mjs
 */
import { readdir, mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("public/img");
const OUT = path.resolve("public/img/w");
const MANIFEST = path.resolve("lib/image-manifest.json");
const WIDTHS = [480, 960, 1440, 1920, 2400];
const MAX_WIDTH = 2400;
const QUALITY = 76;
/** Large tiers only show on retina desktops: a touch more compression keeps bytes in check. */
const QUALITY_BY_WIDTH = (w) => (w >= 2400 ? 68 : w >= 1920 ? 72 : QUALITY);

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const sources = new Map();
for (const file of await readdir(SRC)) {
  const m = file.match(/^(.+)\.(jpe?g|webp)$/i);
  if (!m) continue;
  const name = m[1];
  const ext = m[2].toLowerCase();
  const prev = sources.get(name);
  if (!prev || (prev.ext === "webp" && ext !== "webp")) sources.set(name, { file, ext });
}

const manifest = {};

for (const [name, { file, ext }] of [...sources].sort(([a], [b]) => a.localeCompare(b))) {
  const source = path.join(SRC, file);
  const meta = await sharp(source).metadata();
  const native = meta.width ?? 0;
  const nativeH = meta.height ?? 0;
  const cap = Math.min(native, MAX_WIDTH);
  const widths = [...new Set([...WIDTHS.filter((w) => w < cap), cap])].sort(
    (a, b) => a - b
  );

  for (const w of widths) {
    await sharp(source)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: QUALITY_BY_WIDTH(w), effort: 5 })
      .toFile(path.join(OUT, `${name}-${w}.webp`));
  }

  const lqip = await sharp(source)
    .resize({ width: 20 })
    .webp({ quality: 35 })
    .toBuffer();

  const isJpeg = ext !== "webp";
  manifest[name] = {
    src: isJpeg ? `/img/${file}` : `/img/w/${name}-${widths[widths.length - 1]}.webp`,
    width: cap,
    height: Math.round((nativeH * cap) / native),
    widths,
    lqip: `data:image/webp;base64,${lqip.toString("base64")}`,
  };
  console.log("✓", name, `${native}x${nativeH} → ${cap}`, widths.join("/"));
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log("manifest →", MANIFEST);
