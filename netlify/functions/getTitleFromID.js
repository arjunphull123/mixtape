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

const params = new URLSearchParams(url.search);
const id = params.get("id");
console.log(id)

exports.handler = async function (event, context) {
    const id = event.queryStringParameters?.id
    return id
}