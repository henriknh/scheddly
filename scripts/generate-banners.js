const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

async function createHeroBackground(width, height) {
  const heroSvgPath = path.resolve(__dirname, "..", "public", "hero-bg.svg");
  if (!fs.existsSync(heroSvgPath)) {
    throw new Error("hero-bg.svg not found in public/");
  }
  const heroSvgBuffer = fs.readFileSync(heroSvgPath);
  return await sharp(heroSvgBuffer, { density: 300 })
    .resize({ width, height, fit: "cover" })
    .png()
    .toBuffer();
}

function createTextOverlay(width, height, title, subtitle) {
  const titleFontSize = Math.round(height * 0.08);
  const subtitleFontSize = Math.round(height * 0.04);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <style>
    .title { fill: #ffffff; font-weight: 700; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; font-size: ${titleFontSize}px; }
    .subtitle { fill: #e5e7eb; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; font-size: ${subtitleFontSize}px; }
  </style>
  <text x="50%" y="${Math.round(
    height * 0.62
  )}" text-anchor="middle" class="title">Scheddly</text>
  <text x="50%" y="${Math.round(
    height * 0.72
  )}" text-anchor="middle" class="subtitle">${subtitle}</text>
</svg>`;
  return Buffer.from(svg);
}

async function createBanner({
  width,
  height,
  outputPath,
  subtitle,
  logoWidthFraction = 0.18,
}) {
  const bgPng = await createHeroBackground(width, height);

  const logoPath = path.resolve(__dirname, "..", "public", "logo.svg");
  const fallbackPng = path.resolve(__dirname, "..", "public", "logo.png");
  const hasSvg = fs.existsSync(logoPath);
  const logoInputPath = hasSvg ? logoPath : fallbackPng;
  if (!fs.existsSync(logoInputPath)) {
    throw new Error(
      "Logo file not found in public/logo.svg or public/logo.png"
    );
  }

  const logoTargetWidth = Math.round(width * logoWidthFraction);
  const logoBuffer = await sharp(logoInputPath)
    .resize({ width: logoTargetWidth })
    .toBuffer();

  const composed = await sharp(bgPng)
    .composite([
      // Logo roughly centered a bit above the middle
      {
        input: logoBuffer,
        left: Math.round((width - logoTargetWidth) / 2),
        top: Math.round(height * 0.22),
      },
      // Text overlay
      {
        input: createTextOverlay(width, height, "Scheddly", subtitle),
        top: 0,
        left: 0,
      },
    ])
    .png()
    .toBuffer();

  await sharp(composed).toFile(outputPath);
}

async function main() {
  const projectRoot = path.resolve(__dirname, "..");
  const publicDir = path.join(projectRoot, "public");

  const ogOut = path.join(publicDir, "og-banner.png");
  const twOut = path.join(publicDir, "twitter-banner.png");

  await createBanner({
    width: 1200,
    height: 630,
    outputPath: ogOut,
    subtitle: "Social Media Scheduling Platform",
    logoWidthFraction: 0.2,
  });

  await createBanner({
    width: 1500,
    height: 500,
    outputPath: twOut,
    subtitle: "Schedule Posts Across All Platforms",
    logoWidthFraction: 0.16,
  });

  // eslint-disable-next-line no-console
  console.log("Generated:", ogOut, "and", twOut);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
