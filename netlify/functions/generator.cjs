const fs = require('fs');
const path = require('path');
const nodeHtmlToImage = require('node-html-to-image');
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

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function getMixtapeData(mixtapeId) {
    const mixtapeRef = doc(db, "mixtapes", mixtapeId); // Adjust "mixtapes" to your specific collection name
    try {
        const mixtapeSnap = await getDoc(mixtapeRef);
        if (mixtapeSnap.exists()) {
            mixtapeData = mixtapeSnap.data();
            return mixtapeData
        } else {
            console.log("No such document!");
            return
        }
    } catch (error) {
        console.error("Error getting document:", error);
    }
}

exports.handler = async function (event, context) {
    console.log("Starting function");

    // Get the ID from the query string
    const id = event.queryStringParameters?.id;
    console.log("got id", id);

    console.log("Retrieving mixtape data")
    const mixtapeData = await getMixtapeData(id)

    if (mixtapeData) {
        console.log("Got mixtape data")
    }

    // Construct the correct path to the HTML template
    const templatePath = path.join(__dirname, 'assets', 'image.html');

    // Read the template HTML off of disk.
    let content = fs.readFileSync(templatePath).toString();
    console.log("Template HTML read");

    content = populateTemplate(content, {
        // Get the title out of the document data
        bgColor: mixtapeData.bgColor,
        activeColor: mixtapeData.activeColor,
        cardBg: mixtapeData.cardBg,
        mixtapeTitle: mixtapeData.mixtapeTitle,
    });

    console.log("Generating image from HTML content");
    const image = await nodeHtmlToImage({
        html: content,
        puppeteerArgs: {
            args: ['--no-sandbox']
        }
    });

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

}

function populateTemplate(content, data) {
    for (const [key, value] of Object.entries(data)) {
        content = content.replace(new RegExp(`{{ ${key} }}`, 'g'), value);
    }
    return content;
}
