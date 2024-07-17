import { getFirestore, doc, getDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";

export default async (request, context) => {
    const url = new URL(request.url)
    
    // Get the page content.
    const response = await context.next()
    const page = await response.text()

    console.log("Hello, world")

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
    
    return new Response(page, response);
}

export const config = { path: "/mix/" };