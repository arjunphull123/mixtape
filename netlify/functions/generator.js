import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import fetch from 'node-fetch';  // You need to install node-fetch


const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const handler = async (event, context) => {
  const query = event.queryStringParameters || {};
  let id = query.id;

  // Temporary debug logging for crawler behavior (Apple Messages, etc.)
  console.log(
    JSON.stringify({
      tag: "generator-request",
      requestId: context?.awsRequestId,
      rawUrl: event.rawUrl,
      path: event.path,
      rawQuery: event.rawQuery,
      queryStringParameters: query,
      headers: {
        "user-agent": event.headers?.["user-agent"],
        "x-forwarded-for": event.headers?.["x-forwarded-for"],
        "x-forwarded-host": event.headers?.["x-forwarded-host"],
        "x-forwarded-proto": event.headers?.["x-forwarded-proto"],
        referer: event.headers?.referer,
      },
    })
  );

  if (!id) {
    console.log('No id found in query; falling back to default.jpg');
    id = 'default.jpg';
  }

  try {
    const imageUrl = `covers/${id}`;
    const imageRef = ref(storage, imageUrl);
    let imageDownloadUrl;

    try {
      imageDownloadUrl = await getDownloadURL(imageRef);
      console.log(`Found cover in storage for id=${id}`);
    } catch (error) {
      console.log(`Primary cover missing for id=${id}; attempting default fallback`);
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
    console.error('generator-error', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
