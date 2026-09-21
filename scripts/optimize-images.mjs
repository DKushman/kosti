/**
 * Generates responsive WebP variants for every JPEG in public/img and
 * writes lib/image-manifest.json (available widths + intrinsic size).
 * Output: public/img/w/<name>-<width>.webp
 * Run: node scripts/optimize-images.mjs
 */
import { readdir, mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("public/img");
const OUT = path.resolve("public/img/w");
const MANIFEST = path.resolve("lib/image-manifest.json");
const WIDTHS = [480, 960, 1440, 1920];
const QUALITY = 76;

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => /\.jpe?g$/i.test(f));
const manifest = {};

for (const file of files) {
  const name = file.replace(/\.jpe?g$/i, "");
  const source = path.join(SRC, file);
  const meta = await sharp(source).metadata();
  const native = meta.width ?? 0;
  const widths = [...new Set([...WIDTHS.filter((w) => w < native), native])].sort(
    (a, b) => a - b
  );

  for (const w of widths) {
    await sharp(source)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 5 })
      .toFile(path.join(OUT, `${name}-${w}.webp`));
  }

  const lqip = await sharp(source)
    .resize({ width: 20 })
    .webp({ quality: 35 })
    .toBuffer();

  manifest[name] = {
    width: native,
    height: meta.height ?? 0,
    widths,
    lqip: `data:image/webp;base64,${lqip.toString("base64")}`,
  };
  console.log("✓", name, `${native}x${meta.height}`, widths.join("/"));
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log("manifest →", MANIFEST);
