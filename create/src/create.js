import { getFirestore, doc, getDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import * as htmlToImage from "html-to-image";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadString } from "firebase/storage";

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
const storage = getStorage(app);

// Write handling that will add tracks one by one to the mixtape
// Write API calls to search for a track

async function getClientSecret() {
  const docRef = doc(db, "client", "clientsecret");
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data().value);
      return docSnap.data().value; // returns the document data
    } else {
      console.log("No such document!");
      return null; // handle the case where the document does not exist
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    return null; // handle the error appropriately
  }
}

/// ADMIN OVERRIDE - for testing
/*
let jKeyPressCount = 0; // Initialize a counter for the 'J' key presses
document.addEventListener('keydown', function(event) {
    if (event.key === 'j' || event.key === 'J') { // Check if the pressed key is 'J' or 'j'
        jKeyPressCount++; // Increment the counter
        if (jKeyPressCount === 3) { // Check if 'J' has been pressed three times
            console.log("OVERRIDE"); // Log "OVERRIDE" to the console
            dummyData()
            mixtapeFull()
            jKeyPressCount = 0; // Reset the counter
        }
    } else {
        jKeyPressCount = 0; // Reset the counter if any other key is pressed
    }
});
*/

if (window.innerWidth < 500) {
  //document.getElementById("mix-head").style.display = "block"
  document.getElementById("mix-tag").style.display = "block";
  //document.getElementById("mixtape-container").style.aspectRatio = "9/16"
}

async function getAccessToken() {
  const clientId = "4b027ab3c8dd4b1f9ef6d083d0b51fb5";
  const clientSecret = await getClientSecret();

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to retrieve client credentials access token:", error);
  }
}

async function searchForTrack(term) {
  const accessToken = await getAccessToken();
  const result = await fetch(
    `https://api.spotify.com/v1/search?q=${term}&type=track&limit=5`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return await result.json();
}

const searchButton = document.getElementById("searchButton");
const searchField = document.getElementById("search-for-tracks");

// Marvins room easter egg
searchButton.addEventListener("click", function () {
  if (searchField.value == "marvinsroom") {
    dummyData();
    mixtapeFull();
  }
});

// Wipe all tracks on reload
var tracksBurned = 0;

const today = new Date();
var date =
  today.getMonth() + 1 + "/" + today.getDate() + "/" + today.getFullYear();
document.getElementById("date").innerHTML = date;
document.getElementById("time").innerHTML = "Custom mix";

for (let i = 1; i < 21; i++) {
  const trackLink = document.getElementById(`track-link-${i}`);
  const trackLabel = document.getElementById(`track-${i}`);
  trackLink.href = "";
  trackLabel.innerText = "";
}

document.querySelector("body").classList.add("creating");

searchField.addEventListener("keyup", ({ key }) => {
  if (key === "Enter" && searchField.value) {
    runSearch();
  }
});

let timeoutID;

searchField.addEventListener("input", () => {
  if (searchField.value) {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(function () {
      runSearch();
    }, 500);
  }
});

async function runSearch() {
  const results = await searchForTrack(searchField.value);
  var output = [];

  results.tracks.items.forEach((track) => {
    const name = track.name;
    const url = track.external_urls.spotify;
    const art = track.album.images[0].url;
    var explicit = "";
    if (track.explicit) {
      var explicit = "🅴";
    }
    const artistsList = [];
    track.artists.forEach((artist) => {
      artistsList.push(artist.name);
    });
    const artists = artistsList.join(", ");
    output.push({
      string: `${explicit} ${name} - ${artists}`,
      label: `${name} - ${artists}`,
      url: url,
      art: art,
    });
  });

  updateResultsSection(output);
}

searchButton.addEventListener("click", async function () {
  if (searchField.value) {
    runSearch();
  }
});

function updateResultsSection(results) {
  if (results == "error") {
    var newHTML = `<p class="subtitle" id="tracks-left">No results found. Try searching for a song title!</p>`;
    document.getElementById("search-results").innerHTML = newHTML;
  } else {
    var newHTML = ``;
    var i = 0;
    results.forEach((result) => {
      newHTML += `<div class="search-result" url="${result.url}" label="${result.label}" id="${i}"> <img src="${result.art}" class="cover-art" alt="cover-art"> <span id="result-string">${result.string}</span>   </div>`;
      i += 1;
    });
    document.getElementById("search-results").innerHTML = newHTML;

    document.querySelectorAll(".search-result").forEach((result) =>
      result.addEventListener("click", () => {
        burnTrack(result);
      })
    );
  }
}

function burnTrack(result) {
  const trackLink = document.getElementById(`track-link-${tracksBurned + 1}`);
  const trackLabel = document.getElementById(`track-${tracksBurned + 1}`);
  trackLink.href = result.getAttribute("url");
  trackLabel.innerText = result.getAttribute("label")

  tracksBurned += 1;
  document.getElementById("tracks-left").innerHTML = `${
    20 - tracksBurned
  } tracks left`;
  document.getElementById("search-results").innerHTML = "";
  document.getElementById("search-for-tracks").value = "";

  if (tracksBurned == 20) {
    mixtapeFull();
  }
}

function mixtapeFull() {
  console.log("Mixtape full!");
  document.getElementById(
    "tracks-left"
  ).innerHTML = `Nice! Pick a color and title below`;

  document.querySelector("body").classList.remove("creating");

  document
    .querySelectorAll(".search, .search-results, .search-desc")
    .forEach((e) => {
      e.style.display = "none";
    });
}

function dummyData() {
  for (let i = 1; i < 21; i++) {
    const trackLink = document.getElementById(`track-link-${i}`);
    const trackLabel = document.getElementById(`track-${i}`);
    trackLink.href =
      "https://open.spotify.com/track/047fCsbO4NdmwCBn8pcUXl?si=bbea6b2a0a2f496d";
    trackLabel.innerText = `Marvins Room - Drake`;
  }
}

// auto update mixtape title
document
  .getElementById("mixtape-name-input")
  .addEventListener("input", updateTitle);
function updateTitle(e) {
  document.getElementById("cassette-title").innerHTML = e.target.value;
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

// Firebase handling

const burnAndShare = [
  document.getElementById("burn-and-share"),
  document.getElementById("burn-and-share-mobile"),
];

function generateHash(mixtapeData) {
  // Construct a string from the critical parts of the mixtape data
  const tracksString = mixtapeData.tracks
    .slice(0, 5)
    .map((track) => track.href)
    .join("");
  const dataString = `${mixtapeData.date}${mixtapeData.time}${mixtapeData.mixtapeTitle}${mixtapeData.activeColor}${tracksString}`;

  // Convert the data string to a base64 string using btoa and handle UTF-8 properly
  const base64String = btoa(
    encodeURIComponent(dataString).replace(
      /%([0-9A-F]{2})/g,
      function (match, p1) {
        return String.fromCharCode("0x" + p1);
      }
    )
  );

  // Return the base64 encoded string, potentially truncated to manage size
  return base64String.substring(0, 64); // you might adjust the length as needed
}

burnAndShare.forEach((btn) => {
  btn.addEventListener("click", async function () {
    btn.innerHTML = "Burning...";
    const mixtapeData = collectMixtapeData();
    const mixtapeHash = await generateHash(mixtapeData); // Assuming generateHash() returns a hash string
    const isDuplicate = await checkForDuplicate(mixtapeHash, db);
    const cover = await getPreview();
    // console.log(cover)
    let docId;

    if (!isDuplicate) {
      const docRef = await addDoc(collection(db, "mixtapes"), {
        ...mixtapeData,
        hash: mixtapeHash,
      });
      docId = docRef.id;
      console.log("Document written with ID: ", docId);
    } else {
      docId = await getExistingDocumentId(mixtapeHash, db);
      console.log("Existing document ID: ", docId);
    }

    const coverRef = ref(storage, `covers/${docId}`);

    uploadString(coverRef, cover, "data_url").then((snapshot) => {
      console.log("Uploaded cover with filename", docId);
    });

    btn.innerHTML = "Burn and share";
    showPopup(docId); // Call to show the popup
  });
});

// non-mobile: save image handling
async function downloadImage() {
  var card = document.getElementById("mixtape-container");

  return htmlToImage.toPng(card, {
    ignoreElements: function (element) {
      if ("mix-head" == element.id) {
        return true;
      }
    },
  });
}

async function getPreview() {
  document.getElementById("tracklist").classList.toggle("hide");

  if (window.innerWidth < 500) {
    //document.getElementById("mix-head").style.display = "none"
    document.getElementById("mix-tag").style.display = "none";
  }

  await downloadImage();
  await downloadImage();
  await downloadImage();

  const dataUrl = await downloadImage();
  console.log(dataUrl);

  /*
    var link = document.createElement('a');
    link.download = 'preview.jpeg';
    link.href = dataUrl;
    link.click();
    */

  if (window.innerWidth < 500) {
    //document.getElementById("mix-head").style.display = "block"
    document.getElementById("mix-tag").style.display = "block";
  }

  document.getElementById("tracklist").classList.toggle("hide");

  return dataUrl;
}

async function checkForDuplicate(mixtapeHash, db) {
  const mixtapesCollection = collection(db, "mixtapes");
  const q = query(mixtapesCollection, where("hash", "==", mixtapeHash));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty; // Returns true if any document exists with this hash
}

async function getExistingDocumentId(mixtapeHash, db) {
  const mixtapesCollection = collection(db, "mixtapes");
  const q = query(mixtapesCollection, where("hash", "==", mixtapeHash));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs[0].id; // Return the ID of the first document matching the hash
}

function collectMixtapeData() {
  const cardBg = sessionStorage.getItem("cardBg");
  const bgColor = sessionStorage.getItem("bgColor");
  const activeColor = sessionStorage.getItem("activeColor");

  console.log(cardBg);
  console.log(bgColor);
  console.log(activeColor);

  const mixtapeData = {
    date: document.getElementById("date").textContent,
    time: document.getElementById("time").textContent,
    tracks: [],
    mixtapeTitle: document.getElementById("cassette-title").textContent,
    cardBg: cardBg,
    bgColor: bgColor,
    activeColor: activeColor,
  };

  for (let i = 1; i <= 20; i++) {
    const trackLink = document.getElementById(`track-link-${i}`);
    const track = document.getElementById(`track-${i}`);

    if (track && trackLink) {
      mixtapeData.tracks.push({
        href: trackLink.href,
        trackName: track.textContent,
      });
    }
  }
  return mixtapeData;
}

function showPopup(docId) {
  const popup = document.createElement("div");
  const link = "https://mixedify.netlify.app/mix/?id=" + docId;
  popup.className = "share-popup";

  const content = `
        <div class="popup-content">
                <p class="info-head">Nice mix!</p>
                <p class="info-text">Copy the link below and share with a friend:</p>
                <input type="text" id="mixtape-link" value="https://mixedify.netlify.app/mix/?id=${docId}" readonly>
                <div class='download-options'>
                    <div class='download' id="copy">Copy Link</div>
                    <div class='download' id="close-popup">Close</div>
                </div>

                <div class='mobile-download-options'>
                    <div class="mobile-create-playlist" id="mobile-copy">Copy Link</div>
                    <div class="mobile-create-playlist" id="mobile-close-popup">Close</div>
                </div>
        </div>
    `;
  popup.innerHTML = content;
  document.body.appendChild(popup);

  // Close popup functionality
  const closeButtons = popup.querySelectorAll(
    "#close-popup, #mobile-close-popup"
  );
  closeButtons.forEach((button) =>
    button.addEventListener("click", () => {
      document.body.classList.remove("show-popup");
      document.body.removeChild(popup);
    })
  );

  // Copy link  functionality
  const copyButtons = popup.querySelectorAll("#copy, #mobile-copy");
  copyButtons.forEach((button) =>
    button.addEventListener("click", () => {
      navigator.clipboard.writeText(link);
      button.innerHTML = "Copied!";
      setTimeout(() => {
        button.innerHTML = "Copy Link";
      }, 1500);
    })
  );

  // Show the popup
  document.body.classList.add("show-popup");
}

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

// Story preview handling
const preview = document.getElementById("story-preview");
const mixPreview = document.getElementById("mixtape-preview");

document.getElementById("story-mobile").addEventListener("click", function () {
  console.log("Sharing to story");
  preview.style.display = "flex";
  mixPreview.innerHTML = document.getElementById("mixtape-container").innerHTML;
});

document.getElementById("close-preview").addEventListener("click", function () {
  preview.style.display = "none";
  mixPreview.innerHTML = "";
});
