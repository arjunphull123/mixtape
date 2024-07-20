const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

// Initialize Firebase client SDK
const firebaseConfig = {
    apiKey: "AIzaSyBhHdbyP7hy2V4xlG9S_i9G62emf9mvIfI",
    authDomain: "mixedify-40e2e.firebaseapp.com",
    projectId: "mixedify-40e2e",
    storageBucket: "mixedify-40e2e.appspot.com",
    messagingSenderId: "1076825373232",
    appId: "1:1076825373232:web:4c34f4277dd6f4bdc7cbf5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getMixtapeData(mixtapeId) {
    const mixtapeRef = doc(db, "mixtapes", mixtapeId);
    try {
        const mixtapeSnap = await getDoc(mixtapeRef);
        if (mixtapeSnap.exists()) {
            const mixtapeData = mixtapeSnap.data();
            return mixtapeData;
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting document:", error);
    }
}

exports.handler = async function (event, context) {
    console.log("Starting function");

    const id = event.queryStringParameters?.id;
    console.log("got id", id);

    console.log("Retrieving mixtape data");
    const mixtapeData = await getMixtapeData(id);

    if (!mixtapeData) {
        return {
            statusCode: 404,
            body: "Mixtape not found"
        };
    }

    console.log("Got mixtape data");

    const templatePath = path.join(__dirname, 'assets', 'image.html');
    let content = fs.readFileSync(templatePath).toString();
    console.log("Template HTML read");

    content = populateTemplate(content, {
        bgColor: mixtapeData.bgColor,
        activeColor: mixtapeData.activeColor,
        cardBg: mixtapeData.cardBg,
        mixtapeTitle: mixtapeData.mixtapeTitle,
    });

    console.log("Generating image from HTML content");

    console.log("Executable path:", await puppeteer.executablePath())

    let browser;
    try {
        browser = await puppeteer.launch({
            executablePath: await puppeteer.executablePath(), // Specify the path dynamically
            args: ['--no-sandbox'],
            headless: true,
            defaultViewport: { height: 630, width: 1200 },
        });

        const page = await browser.newPage();
        await page.setContent(content, { waitUntil: 'networkidle0' });

        const image = await page.screenshot({ type: 'png' });
        console.log("Image generated");

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 's-maxage=86400',
            },
            body: image.toString('base64'),
            isBase64Encoded: true,
        };
    } catch (error) {
        console.error("Error generating image:", error);
        return {
            statusCode: 500,
            body: "Internal Server Error"
        };
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

function populateTemplate(content, data) {
    for (const [key, value] of Object.entries(data)) {
        content = content.replace(new RegExp(`{{ ${key} }}`, 'g'), value);
    }
    return content;
}
