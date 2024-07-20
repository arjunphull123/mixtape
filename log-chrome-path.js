import puppeteer from "puppeteer";
(async () => {
    const executablePath = await puppeteer.executablePath();
    console.log(`Chrome executable path: ${executablePath}`);
})();
