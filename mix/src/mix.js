import { getFirestore, doc, getDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

let mixtapeData;

if (id) {
  populateUI(id);
}

async function getMixtapeData(mixtapeId) {
  const mixtapeRef = doc(db, "mixtapes", mixtapeId); // Adjust "mixtapes" to your specific collection name
  try {
    const mixtapeSnap = await getDoc(mixtapeRef);
    if (mixtapeSnap.exists()) {
      mixtapeData = mixtapeSnap.data();
      return mixtapeData;
    } else {
      console.log("No such document!");
      return;
    }
  } catch (error) {
    console.error("Error getting document:", error);
  }
}

async function populateUI(mixtapeId) {
  document.getElementById("loading").style.display = "flex";
  await getMixtapeData(mixtapeId);

  // colors to sessionStorage
  sessionStorage.setItem("activeColor", mixtapeData.activeColor);
  sessionStorage.setItem("cardBg", mixtapeData.cardBg);
  sessionStorage.setItem("bgColor", mixtapeData.bgColor);

  // set colors
  document.documentElement.style.setProperty(
    "--card-bg",
    sessionStorage.getItem("cardBg")
  );
  document.documentElement.style.setProperty(
    "--bg-color",
    sessionStorage.getItem("bgColor")
  );
  document.querySelectorAll(".color-button").forEach((btn) => {
    btn.classList.remove("active");
  });
  document
    .getElementById(sessionStorage.getItem("activeColor"))
    .classList.add("active");

  document.getElementById("date").innerText = mixtapeData.date;
  document.getElementById("time").innerText = mixtapeData.time;
  document.getElementById("cassette-title").innerText =
    mixtapeData.mixtapeTitle;

  document.title = mixtapeData.mixtapeTitle + " - mixedify";

  for (var i = 0; i < 20; i++) {
    const track = mixtapeData.tracks[i];
    document.getElementById("track-" + (i + 1)).innerHTML = track.trackName;
    document.getElementById("track-link-" + (i + 1)).href = track.href;
  }

  document.getElementById("loading").style.display = "none";
}

// Info screen handling
var infoButton = document.getElementById("info-button");
var closeInfoButton = document.getElementById("close-info");

infoButton.addEventListener("click", function () {
  const body = document.querySelector("body");
  body.classList.toggle("show-info");
});

closeInfoButton.addEventListener("click", function () {
  const body = document.querySelector("body");
  body.classList.remove("show-info");
});

// Logout handling
// This function clears session storage, essentially wiping user data from browser
function removesessionStorage() {
  sessionStorage.clear();
}
document
  .getElementById("logout")
  .addEventListener("click", removesessionStorage);
document
  .getElementById("go-back")
  .addEventListener("click", removesessionStorage);

// color button handling
if (!sessionStorage.getItem("cardBg")) {
  sessionStorage.setItem(
    "cardBg",
    window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--card-bg")
  );
}
if (!sessionStorage.getItem("bgColor")) {
  sessionStorage.setItem(
    "bgColor",
    window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--bg-color")
  );
}
if (!sessionStorage.getItem("activeColor")) {
  sessionStorage.setItem("activeColor", "color-1");
}
document.documentElement.style.setProperty(
  "--card-bg",
  sessionStorage.getItem("cardBg")
);
document.documentElement.style.setProperty(
  "--bg-color",
  sessionStorage.getItem("bgColor")
);
document.querySelectorAll(".color-button").forEach((btn) => {
  btn.classList.remove("active");
});
document
  .getElementById(sessionStorage.getItem("activeColor"))
  .classList.add("active");

document.querySelectorAll(".color-button").forEach((btn) => {
  btn.addEventListener("click", function () {
    if (!this.classList.contains("active")) {
      document.querySelectorAll(".color-button").forEach((btn) => {
        btn.classList.remove("active");
      });
      this.classList.add("active");
      const color = window
        .getComputedStyle(document.documentElement)
        .getPropertyValue("--" + this.id);
      const bgColor = window
        .getComputedStyle(document.documentElement)
        .getPropertyValue("--bg-" + this.id);
      document.documentElement.style.setProperty("--card-bg", color);
      document.documentElement.style.setProperty("--bg-color", bgColor);
      sessionStorage.setItem("cardBg", color);
      sessionStorage.setItem("bgColor", bgColor);
      sessionStorage.setItem("activeColor", this.id);
    }
  });
});
