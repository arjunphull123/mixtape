import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import fetch from 'node-fetch';  // You need to install node-fetch

const firebaseConfig = {
  apiKey: "AIzaSyBhHdbyP7hy2V4xlG9S_i9G62emf9mvIfI",
  authDomain: "mixedify-40e2e.firebaseapp.com",
  projectId: "mixedify-40e2e",
  storageBucket: "mixedify-40e2e.appspot.com",
  messagingSenderId: "1076825373232",
  appId: "1:1076825373232:web:4c34f4277dd6f4bdc7cbf5"
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
