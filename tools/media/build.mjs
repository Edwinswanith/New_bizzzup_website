// Builds every served image from the masters in /assets-src (never served directly).
// Output: /public/media/work/<name>-<width>.{avif,webp,jpg} (real product screenshots only)
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const src = (p) => path.join(root, "assets-src", p);
const out = (p) => path.join(root, "public/media", p);

const SCREENS = ["doctor-ai.jpg", "caption-cc.png", "lawyer-ai.png", "saloon.jpg", "meridian.jpg", "designt.png", "health-dashboard.jpg"];

async function emit(pipeline, base, widths) {
  for (const w of widths) {
    const img = pipeline.clone().resize({ width: w, withoutEnlargement: true });
    await Promise.all([
      img.clone().avif({ quality: 52, effort: 5 }).toFile(`${base}-${w}.avif`),
      img.clone().webp({ quality: 74 }).toFile(`${base}-${w}.webp`),
      img.clone().jpeg({ quality: 78, mozjpeg: true }).toFile(`${base}-${w}.jpg`),
    ]);
  }
}

mkdirSync(out("work"), { recursive: true });

for (const s of SCREENS) {
  const name = s.replace(/\.(png|jpg)$/, "");
  const img = sharp(src(`screens/${s}`));
  const meta = await img.metadata();
  const widths = [640, 1200].filter((w) => w <= meta.width).concat(meta.width < 640 ? [meta.width] : []);
  await emit(img, out(`work/${name}`), widths);
  console.log(`screen ${name} ${meta.width}x${meta.height}`);
}
