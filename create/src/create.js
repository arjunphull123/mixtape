import { getFirestore, doc, getDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { experimentalSetDeliveryMetricsExportedToBigQueryEnabled } from "firebase/messaging/sw";

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

// Write handling that will add tracks one by one to the mixtape
// Write API calls to search for a track

  

// Info screen handling
var infoButton = document.getElementById('info-button')
var closeInfoButton = document.getElementById('close-info')

infoButton.addEventListener("click", function() {
    const body = document.querySelector('body')
    body.classList.toggle('show-info')
})

closeInfoButton.addEventListener("click", function() {
    const body = document.querySelector('body')
    body.classList.remove('show-info')
})

// color button handling
if (!sessionStorage.getItem('cardBg')) {
    sessionStorage.setItem('cardBg', window.getComputedStyle(document.documentElement).getPropertyValue("--card-bg"))
}
if (!sessionStorage.getItem('bgColor')) {
    sessionStorage.setItem('bgColor', window.getComputedStyle(document.documentElement).getPropertyValue("--bg-color"))
}
if (!sessionStorage.getItem('activeColor')) {
    sessionStorage.setItem('activeColor', 'color-1')
}
document.documentElement.style.setProperty("--card-bg", sessionStorage.getItem('cardBg'))
document.documentElement.style.setProperty("--bg-color", sessionStorage.getItem('bgColor'))
document.querySelectorAll('.color-button').forEach(btn => {
    btn.classList.remove("active")
})
document.getElementById(sessionStorage.getItem('activeColor')).classList.add('active')

document.querySelectorAll('.color-button').forEach(btn => {
    btn.addEventListener("click", function() {
        if (!this.classList.contains("active")) {
            document.querySelectorAll('.color-button').forEach(btn => {
                btn.classList.remove("active")
            })
            this.classList.add("active")
            const color = window.getComputedStyle(document.documentElement).getPropertyValue("--" + this.id)
            const bgColor = window.getComputedStyle(document.documentElement).getPropertyValue("--bg-" + this.id)
            document.documentElement.style.setProperty("--card-bg", color)
            document.documentElement.style.setProperty("--bg-color", bgColor)
            sessionStorage.setItem('cardBg', color)
            sessionStorage.setItem('bgColor', bgColor)
            sessionStorage.setItem('activeColor', this.id)
        }
    })
})