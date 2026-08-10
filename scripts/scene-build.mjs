/**
 * Encodes the hero artwork and previews where the club window lands on it.
 *
 * The window is live markup positioned in percentages of a hero stage that
 * never crops, so these numbers must stay in step with the insets in
 * `components/features/home/club-window.tsx`. The preview composites a rough
 * window onto the artwork so a misplaced pane is caught without a browser.
 *
 *   node scripts/scene-build.mjs
 */
import fs from "node:fs";
import sharp from "sharp";

const SOURCES = ".impeccable/assets/sources";
const OUT = "public/scene";
const PREVIEW = ".impeccable/assets/preview";

/** Window rect as fractions of the stage. Mirrors club-window.tsx. */
const PLACEMENT = {
  landscape: { name: 0.315, x: 0.5, y: 0.37, w: 0.41, h: 0.3 },
  portrait: { name: 0.3, x: 0.1, y: 0.33, w: 0.8, h: 0.32 },
};

const ROWS = [
  ["17.30", "JUNIOR OG BEGYNDERE"],
  ["17.45", "KVINDER OG PIGER"],
  ["19.00", "TURNERINGSRUNDER"],
];

function overlay(width, height, p) {
  const x = p.x * width;
  const y = p.y * height;
  const w = p.w * width;
  const h = p.h * height;
  const pad = w * 0.02;
  const rowH = (h - pad * 4) / 3;
  const size = rowH * 0.42;

  const rows = ROWS.map(([time, label], i) => {
    const ry = y + pad + i * (rowH + pad);
    return `
      <rect x="${x + pad}" y="${ry}" width="${w - pad * 2}" height="${rowH}" fill="#ffb000"/>
      <text x="${x + pad * 2}" y="${ry + rowH * 0.66}" font-family="Arial" font-weight="700" font-size="${size}" fill="#080f16">${time}</text>
      <text x="${x + pad * 2 + size * 3.2}" y="${ry + rowH * 0.66}" font-family="Arial" font-weight="700" font-size="${size * 0.72}" fill="#080f16">${label}</text>`;
  }).join("");

  const mullions = [0.25, 0.5, 0.75]
    .map(
      (f) =>
        `<rect x="${x + w * f}" y="${y}" width="${Math.max(1, w * 0.004)}" height="${h}" fill="#a7b3c7" opacity="0.55"/>`,
    )
    .join("");

  const name = p.name
    ? `<text x="${x}" y="${p.name * height}" font-family="Arial" font-weight="700" font-size="${h * 0.075}" letter-spacing="${h * 0.012}" fill="#ffb000">VALBY SKAKKLUB</text>`
    : "";

  return Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    ${name}
    <rect x="${x - w * 0.012}" y="${y - w * 0.012}" width="${w + w * 0.024}" height="${h + w * 0.024}" fill="#0d131b"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#101d31"/>
    ${rows}
    ${mullions}
  </svg>`);
}

const JOBS = [
  {
    key: "landscape",
    from: `${SOURCES}/street-landscape.png`,
    to: `${OUT}/street.webp`,
    width: 2048,
  },
  {
    key: "portrait",
    from: `${SOURCES}/street-portrait.png`,
    to: `${OUT}/street-portrait.webp`,
    width: 1280,
  },
];

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(PREVIEW, { recursive: true });

for (const job of JOBS) {
  await sharp(job.from)
    .resize({ width: job.width, kernel: "lanczos3" })
    .webp({ quality: 82, effort: 6 })
    .toFile(job.to);

  const meta = await sharp(job.to).metadata();
  const kb = Math.round(fs.statSync(job.to).size / 1024);
  console.log(`${job.to} ${meta.width}x${meta.height} ${kb}KB`);

  await sharp(job.to)
    .composite([
      { input: overlay(meta.width, meta.height, PLACEMENT[job.key]), top: 0, left: 0 },
    ])
    .png()
    .toFile(`${PREVIEW}/${job.key}.png`);
}

console.log(`placement previews written to ${PREVIEW}`);
