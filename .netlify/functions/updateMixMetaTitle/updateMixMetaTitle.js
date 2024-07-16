const { readFile } = require('fs').promises;
const path = require('path');

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc, getDoc } from "firebase/firestore"

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

exports.handler = async function(event, context) {
    const { id } = event.queryStringParameters;
    if (!id) {
        return {
            statusCode: 400,
            body: 'Mixtape ID is required'
        };
    }

    // Fetch mixtape data from your database
    const mixtapeData = await getMixtapeData(id); // Implement this function based on your database logic

    if (!mixtapeData) {
        return {
            statusCode: 404,
            body: 'Mixtape not found'
        };
    }

    try {
        const filePath = path.join(__dirname, '..', '/mix/index.html');
        let htmlContent = await readFile(filePath, 'utf8');

        // Replace placeholders with actual data
        htmlContent = htmlContent.replace('PLACEHOLDER_TITLE', mixtapeData.title);

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'text/html' },
            body: htmlContent
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: 'Internal Server Error: ' + error.toString()
        };
    }
};