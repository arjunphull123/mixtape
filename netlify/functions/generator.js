import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

// Define the path to the assets directory
const assetsPath = path.join(__dirname, 'assets');


export async function handler(event, context) {
  try {
    // Extract title and color from the query parameters
    const { title = "awesome mix vol. 1", color = "color-1" } = event.queryStringParameters;

    // Create the SVG content
    const titleSVG = `
      <svg width="1075" height="150" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <style type="text/css">
              @import url('https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&amp;display=swap');
            </style>
          </defs>

          <style>
              .title {
                  fill: black;
                  font-size: 75px;
                  font-family: "Gloria Hallelujah", cursive;
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
