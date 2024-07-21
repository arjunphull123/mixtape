import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

// Define the path to the assets directory
const assetsPath = path.join(__dirname, 'assets');

// Ensure the cache directory exists
const cacheDir = '/tmp/cache';
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
  console.log(`Cache directory created at ${cacheDir}`);
} else {
  console.log(`Cache directory already exists at ${cacheDir}`);
}

// Set environment variables for Fontconfig
process.env.FONTCONFIG_PATH = __dirname;
process.env.FONTCONFIG_FILE = path.join(__dirname, 'assets/fonts.conf');
process.env.XDG_CACHE_HOME = '/tmp/cache';

console.log(`FONTCONFIG_PATH set to ${process.env.FONTCONFIG_PATH}`);
console.log(`FONTCONFIG_FILE set to ${process.env.FONTCONFIG_FILE}`);
console.log(`XDG_CACHE_HOME set to ${process.env.XDG_CACHE_HOME}`);

// Verify the presence of fonts.conf and log its contents
const fontsConfigPath = path.join(__dirname, 'assets/fonts.conf');
if (fs.existsSync(fontsConfigPath)) {
  console.log(`fonts.conf found at ${fontsConfigPath}`);
  const fontsConfigContent = fs.readFileSync(fontsConfigPath, 'utf-8');
  console.log(`fonts.conf contents: ${fontsConfigContent}`);
} else {
  console.log(`fonts.conf not found at ${fontsConfigPath}`);
}

// Helper function to get the base64 data URL of a font file
const getFontDataURL = (fontPath) => {
  const fontBuffer = fs.readFileSync(fontPath);
  const mimeType = mime.lookup(fontPath);
  const base64 = fontBuffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
};

// Get the base64 data URLs for the font files
const fontPathWoff2 = path.join(assetsPath, 'Ugly-Dave-Regular.woff2');
const fontPathWoff = path.join(assetsPath, 'Ugly-Dave-Regular.woff');
const fontDataURLWoff2 = getFontDataURL(fontPathWoff2);
const fontDataURLWoff = getFontDataURL(fontPathWoff);

console.log(`fontPathWoff2: ${fontPathWoff2}`);
console.log(`fontPathWoff: ${fontPathWoff}`);
console.log(`fontDataURLWoff2: ${fontDataURLWoff2.substring(0, 50)}...`);
console.log(`fontDataURLWoff: ${fontDataURLWoff.substring(0, 50)}...`);

export async function handler(event, context) {
  try {
    // Extract title and color from the query parameters
    const { title = "awesome mix vol. 1", color = "color-1" } = event.queryStringParameters;

    // Create the SVG content
    const titleSVG = `
      <svg width="1075" height="150" xmlns="http://www.w3.org/2000/svg">
          <style>
              @font-face {
                  font-family: 'Ugly Dave';
                  src: url('${fontDataURLWoff2}') format('woff2'),
                       url('${fontDataURLWoff}') format('woff');
                  font-weight: normal;
                  font-style: normal;
                  font-display: swap;
              }
              .title {
                  fill: black;
                  font-size: 75px;
                  font-family: 'Ugly Dave';
                  font-weight: 600;
                  opacity: 77.5%;
                  letter-spacing: -.35%;
              }
          </style>
          <text x="0" y="100" text-anchor="left" transform="rotate(-0.75)" class="title">${title}</text>
      </svg>
    `;

    const titleBuffer = Buffer.from(titleSVG);

    console.log(`Generated SVG: ${titleSVG}`);

    // Define the path to the base image
    const baseImagePath = path.join(assetsPath, `${color}-base.png`);
    console.log(`Base image path set to ${baseImagePath}`);

    // Check if the base image exists
    if (!fs.existsSync(baseImagePath)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Base image for color '${color}' not found.` }),
      };
    }

    // Composite the titleBuffer onto the base image
    const outputBuffer = await sharp(baseImagePath)
      .composite([{
        input: titleBuffer,
        top: 185,
        left: 375,
      }])
      .png()
      .toBuffer();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/png',
      },
      body: outputBuffer.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
