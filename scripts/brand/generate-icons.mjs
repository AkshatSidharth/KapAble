#!/usr/bin/env node
/**
 * Regenerates assets/icon/{logo.png,logo.ico,logo.icns} from assets/logo.svg.
 *
 * Electron Forge resolves `./assets/icon/logo` per platform — .icns on macOS,
 * .ico on Windows, .png on Linux — so all three have to be rebuilt whenever
 * the mark changes, or packaged builds keep shipping the old one.
 *
 * Swapping the brand mark is therefore: replace assets/logo.svg, run
 *
 *     node scripts/brand/generate-icons.mjs
 *
 * Rendering uses the Chromium that Playwright already installs as a
 * devDependency, and the ICO/ICNS containers are written directly, so this
 * needs no image toolchain (no ImageMagick, rsvg, or Pillow).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const SVG = path.join(ROOT, "assets/logo.svg");
const ICON_DIR = path.join(ROOT, "assets/icon");

/** Sizes each container needs. */
const PNG_MASTER = 1024;
const ICO_SIZES = [16, 24, 32, 48, 64, 128, 256];
// OSType -> pixel size. Only the PNG-based types, which modern macOS prefers.
const ICNS_TYPES = {
  ic11: 32,
  ic12: 64,
  ic07: 128,
  ic13: 256,
  ic08: 256,
  ic14: 512,
  ic09: 512,
  ic10: 1024,
};

async function renderAll(sizes) {
  const svg = fs.readFileSync(SVG, "utf8");
  const executablePath = process.env.CHROMIUM_PATH;
  const browser = await chromium.launch({
    ...(executablePath ? { executablePath } : {}),
    args: ["--no-sandbox"],
  });
  const out = new Map();
  try {
    for (const size of sizes) {
      const page = await browser.newPage({
        viewport: { width: size, height: size },
        deviceScaleFactor: 1,
      });
      // Force the intrinsic size so the SVG fills the viewport exactly.
      const sized = svg
        .replace(/\bwidth="\d+"/, `width="${size}"`)
        .replace(/\bheight="\d+"/, `height="${size}"`);
      await page.setContent(
        `<html><body style="margin:0">` +
          `<div style="width:${size}px;height:${size}px">${sized}</div>` +
          `</body></html>`,
      );
      out.set(size, await page.screenshot({ omitBackground: true }));
      await page.close();
    }
  } finally {
    await browser.close();
  }
  return out;
}

/** ICO: 6-byte header, 16-byte directory entry per image, then PNG payloads. */
function buildIco(pngs) {
  const entries = ICO_SIZES.map((size) => ({ size, data: pngs.get(size) }));
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(entries.length, 4);

  const dir = Buffer.alloc(16 * entries.length);
  let offset = header.length + dir.length;
  entries.forEach((entry, i) => {
    const at = i * 16;
    // 256 is encoded as 0 in a single byte.
    dir.writeUInt8(entry.size >= 256 ? 0 : entry.size, at);
    dir.writeUInt8(entry.size >= 256 ? 0 : entry.size, at + 1);
    dir.writeUInt8(0, at + 2); // palette size
    dir.writeUInt8(0, at + 3); // reserved
    dir.writeUInt16LE(1, at + 4); // colour planes
    dir.writeUInt16LE(32, at + 6); // bits per pixel
    dir.writeUInt32LE(entry.data.length, at + 8);
    dir.writeUInt32LE(offset, at + 12);
    offset += entry.data.length;
  });

  return Buffer.concat([header, dir, ...entries.map((e) => e.data)]);
}

/** ICNS: "icns" + total length, then [OSType][length incl. header][PNG]. */
function buildIcns(pngs) {
  const chunks = Object.entries(ICNS_TYPES).map(([osType, size]) => {
    const data = pngs.get(size);
    const head = Buffer.alloc(8);
    head.write(osType, 0, 4, "ascii");
    head.writeUInt32BE(data.length + 8, 4);
    return Buffer.concat([head, data]);
  });
  const body = Buffer.concat(chunks);
  const head = Buffer.alloc(8);
  head.write("icns", 0, 4, "ascii");
  head.writeUInt32BE(body.length + 8, 4);
  return Buffer.concat([head, body]);
}

const sizes = [
  ...new Set([PNG_MASTER, ...ICO_SIZES, ...Object.values(ICNS_TYPES)]),
].sort((a, b) => a - b);

const pngs = await renderAll(sizes);
fs.mkdirSync(ICON_DIR, { recursive: true });

const written = {
  "logo.png": pngs.get(PNG_MASTER),
  "logo.ico": buildIco(pngs),
  "logo.icns": buildIcns(pngs),
};
for (const [name, data] of Object.entries(written)) {
  fs.writeFileSync(path.join(ICON_DIR, name), data);
  console.log(
    `${name.padEnd(10)} ${data.length.toLocaleString().padStart(10)} bytes`,
  );
}
console.log(`\nregenerated from ${path.relative(ROOT, SVG)}`);
