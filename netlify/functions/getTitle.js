const { initializeApp } = require("firebase/app");
const { getFirestore, doc, getDoc } = require("firebase/firestore");

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

exports.handler = async function(event, context) {
    const mixtapeId = event.queryStringParameters.id;
    const mixtapeRef = doc(db, "mixtapes", mixtapeId);
    try {
        const mixtapeSnap = await getDoc(mixtapeRef);
        if (mixtapeSnap.exists()) {
            return {
                statusCode: 200,
                body: JSON.stringify({ title: mixtapeSnap.data().title }),
            };
        } else {
            return {
                statusCode: 404,
                body: "Not Found",
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: "Server Error",
        };
    }
};
