const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');
const fs = require('fs');

exports.handler = async function (event, context) {
    console.log("Starting function");

    // Use local Chrome when testing.
    let localChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    let executable = fs.existsSync(localChrome) ? localChrome : await chromium.executablePath;

    console.log("Launching browser");
    const browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: executable,
        headless: true,
        defaultViewport: { height: 630, width: 1200 },
    });
    console.log("Browser launched");

    let page = await browser.newPage();
    console.log("New page created");

    // Read the template HTML off of disk.
    let content = fs.readFileSync(__dirname + '/assets/image.html').toString();
    console.log("Template HTML read");

    content = populateTemplate(content, {
        title: event.queryStringParameters?.title
    });

    console.log("Setting content on the page");
    await page.setContent(content, {
        waitUntil: 'domcontentloaded',
    });
    console.log("Content set on the page");

    console.log("Taking screenshot");
    const screenshot = await page.screenshot();
    console.log("Screenshot taken");

    await browser.close();
    console.log("Browser closed");

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 's-maxage=86400',
        },
        body: screenshot.toString('base64'),
        isBase64Encoded: true,
    };
}

function populateTemplate(content, data) {
    for (const [key, value] of Object.entries(data)) {
        content = content.replace(new RegExp(`{{ ${key} }}`, 'g'), value);
    }
    return content;
}
