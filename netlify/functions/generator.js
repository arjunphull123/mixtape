import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import fetch from 'node-fetch';  // You need to install node-fetch

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const handler = async (event, context) => {
  let id = event.queryStringParameters.id;

  if (!id) {
    id = 'default.jpg';
  }

  try {
    const imageUrl = `covers/${id}`;
    const imageRef = ref(storage, imageUrl);
    let imageDownloadUrl;

    try {
      imageDownloadUrl = await getDownloadURL(imageRef);
    } catch (error) {
      if (id !== 'default.jpg') {
        const defaultImageRef = ref(storage, 'covers/default.jpg');
        imageDownloadUrl = await getDownloadURL(defaultImageRef);
      } else {
        throw error;  // If default image is also not found, throw the error
      }
    }

    const response = await fetch(imageDownloadUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const imageBuffer = await response.buffer();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': response.headers.get('content-type'),
        'Content-Length': imageBuffer.length.toString(),
      },
      body: imageBuffer.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
