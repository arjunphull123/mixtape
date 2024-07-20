const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
const config = {};

// Conditionally set the cache directory if running in Netlify
if (process.env.NETLIFY) {
  config.cacheDirectory = join(__dirname, '.cache', 'puppeteer');
}

module.exports = config;
