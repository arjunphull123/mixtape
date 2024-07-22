import * as htmlToImage from 'html-to-image';
import dotenv from 'dotenv';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

dotenv.config()

console.log(process.env)

// Firebase init:

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadString } from "firebase/storage";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBhHdbyP7hy2V4xlG9S_i9G62emf9mvIfI",
    authDomain: "mixedify-40e2e.firebaseapp.com",
    projectId: "mixedify-40e2e",
    storageBucket: "mixedify-40e2e.appspot.com",
    messagingSenderId: "1076825373232",
    appId: "1:1076825373232:web:4c34f4277dd6f4bdc7cbf5"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const storage = getStorage(app)


// Regular functionality:

// Setting up API key and params for Spotify API
const clientId = "4b027ab3c8dd4b1f9ef6d083d0b51fb5"; // Replace with your client ID
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

// Instagram check:
var ua = navigator.userAgent || navigator.vendor || window.opera
var isInstagram = (ua.indexOf('Instagram') > -1) ? true : false
var isSnapchat = (ua.indexOf('Snapchat') > -1) ? true : false

if (isInstagram) {
    document.body.classList.add('show-insta')
}

if (isSnapchat) {
    document.body.classList.add('show-snap')
}

// Initialize the default time range for data shown
var timeRange = "short_term"
window.timeRange = "short-term"
var titleSuffix = "'s past month".toLowerCase()
let accessToken, profile, tracksShort, tracksMedium, tracksLong, recommended

// Make mixtape scale
document.getElementById('mixtape-container').style.aspectRatio = "auto"

// Logout handling
// This function clears session storage, essentially wiping user data from browser
function removesessionStorage() {
    sessionStorage.clear()
}
document.getElementById('logout').addEventListener("click", removesessionStorage)
document.getElementById('go-back').addEventListener("click", removesessionStorage)

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

document.getElementById('create-mix').addEventListener("click", function() {
    window.location.href = "https://mixedify.netlify.app/create"
})

// Auth flow and API calls
if (!code) { // on first login - if there is no code object
    document.getElementById("log-in-button").addEventListener("click", function() {
        redirectToAuthCodeFlow(clientId) // this starts login flow
    })
} else { // after user auth
    document.title = "Customize your mixtape - mixedify"
    const loadingScreen = document.getElementById("loading")
    loadingScreen.style.display = "flex" // display the loading screen
    // pull data from sessionStorage if there, otherwise add data to sessionStorage
    // this serves as local, in browser, short term user data storage
    if (sessionStorage.getItem('accessToken')) {
        accessToken = JSON.parse(sessionStorage.getItem('accessToken'))
    } else {
        accessToken = await getAccessToken(clientId, code);
        sessionStorage.setItem('accessToken', JSON.stringify(accessToken))
    }

    // then, for each, pull the data from sessionStorage and store to the window
    // this allows for the page to be refreshed without losing data

    if (sessionStorage.getItem('profile')) {
        profile = JSON.parse(sessionStorage.getItem('profile'))
    } else {
        profile = await fetchProfile(accessToken);
        sessionStorage.setItem('profile', JSON.stringify(profile))
    }
    window.profile = JSON.parse(sessionStorage.getItem('profile'))

    if (sessionStorage.getItem('tracksShort')) {
        tracksShort = JSON.parse(sessionStorage.getItem('tracksShort'))
    } else {
        tracksShort = await fetchTracksShort(accessToken);
        sessionStorage.setItem('tracksShort', JSON.stringify(tracksShort))
    }
    window.tracksShort = JSON.parse(sessionStorage.getItem('tracksShort'))

    if (sessionStorage.getItem('tracksMedium')) {
        tracksMedium = JSON.parse(sessionStorage.getItem('tracksMedium'))
    } else {
        tracksMedium = await fetchTracksMedium(accessToken);
        sessionStorage.setItem('tracksMedium', JSON.stringify(tracksMedium))
    }
    window.tracksMedium = JSON.parse(sessionStorage.getItem('tracksMedium'))

    if (sessionStorage.getItem('tracksLong')) {
        tracksLong = JSON.parse(sessionStorage.getItem('tracksLong'))
    } else {
        tracksLong = await fetchTracksLong(accessToken);
        sessionStorage.setItem('tracksLong', JSON.stringify(tracksLong))
    }
    window.tracksLong = JSON.parse(sessionStorage.getItem('tracksLong'))

    if (sessionStorage.getItem('recommended')) {
        recommended = JSON.parse(sessionStorage.getItem('tracksLong'))
    } else {
        recommended = await fetchRecommended(accessToken, JSON.parse(sessionStorage.getItem('tracksShort')));
        sessionStorage.setItem('recommended', JSON.stringify(recommended))
    }
    window.recommended = JSON.parse(sessionStorage.getItem('recommended'))
    
    // populate UI
    populateUI(window.profile, window.tracksShort);

    // control mobile tag text (mobile breakpoints)
    
    if (window.innerWidth < 500) {
        //document.getElementById("mix-head").style.display = "block"
        document.getElementById("mix-tag").style.display = "block"
        //document.getElementById("mixtape-container").style.aspectRatio = "9/16"
    }

    // make the body scrollable
    document.querySelector("body").classList.remove("lock-scroll")

    // hide the loading screen now that the content is loaded
    loadingScreen.style.display = "none"
}

async function redirectToAuthCodeFlow(clientId) {
    // This function starts authentication flow

    // create a code verifier and store it to sessionStorage
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    sessionStorage.setItem("verifier", verifier);

    // authorize API calls -- redirects to Spotify auth screen
    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "https://mixedify.netlify.app");
    params.append("scope", "user-top-read playlist-modify-private");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// From Spotify:
function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

// From Spotify:
async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

// From Spotify:
async function getAccessToken(clientId, code) {
    const verifier = sessionStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "https://mixedify.netlify.app");
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    console.log(access_token)
    return access_token;
}

async function fetchProfile(token) {
    // Calls API and requests profile name
    const result = await fetch("https://api.spotify.com/v1/me/", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

async function fetchTracksShort(token) {
    // Calls API and requests short-term tracks
    const result = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=short_term", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

async function fetchTracksMedium(token) {
    // Calls API and requests medium-term tracks
    const result = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=medium_term", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

async function fetchTracksLong(token) {
    // Calls API and requests long-term tracks
    const result = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=long_term", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

async function fetchRecommended(token, tracks) {
    // concatenate IDs of the first five tracks with commas
    // maybe this could be a random five? or your first track, plus a random from 2-5, 6-10, 11-15, and 16-20?
    var seeds = ""

    // randInt function, returns a random integer between min and max inclusive
    function randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    var recIndices = []
    recIndices.push(0, randInt(1,4), randInt(5,9), randInt(10,14), randInt(15,19))

    var recTracks = []
    recIndices.forEach(i => (
        recTracks.push(tracks.items[i])
    ))

    recTracks.forEach(track => {
        seeds += track.id + ','
    })
    seeds = seeds.slice(0,-1)

    // Call recommendations endpoint with first five tracks as recommendations
    const result = await fetch(`https://api.spotify.com/v1/recommendations?seed_tracks=${seeds}`, {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

async function toPlaylist(tracksUri, name, desc){
    // Creates a playlist with the tracks inputted
    const playlist = await fetchWebApi(
      `v1/users/${window.profile.id}/playlists`, 'POST', {
        "name": name,
        "description": desc,
        "public": false
    })
  
    await fetchWebApi(
      `v1/playlists/${playlist.id}/tracks?uris=${tracksUri}`,
      'POST'
    );
  
    return playlist;
  }

  async function fetchWebApi(endpoint, method, body) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method,
      body:JSON.stringify(body)
    });
    return await res.json();
  }

function getArtists(track) {
    // gets the artists for a track, comma-separated
    var artists = track.artists
    var artistString = ""
    artists.forEach(artist => {
        artistString += artist.name + ", "
    })
    return artistString.slice(0, -2)
}

function populateUI(profile, tracks) {
    // get today's date in MM/DD/YYYY
    const today = new Date()
    var date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear()
    document.getElementById('date').innerHTML = date

    // get the user's display name and set the mixtape's title
    const displayName = profile.display_name.replaceAll(/\p{Emoji}/ug, '')
    document.getElementById("cassette-title").innerText = displayName.toLowerCase() + titleSuffix;
    document.getElementById("mixtape-name-input").value = displayName.toLowerCase() + titleSuffix

    // hide the start page and show customize options
    document.getElementById("start-container").style.display = "none"
    document.getElementById("customize-container").style.display = "flex"
    //document.getElementById("mixtape-container").style.aspectRatio = "9/16"

    // parse each track within tracks to get the Spotify URL, track name, and artists
    for (var i=0; i<20; i++) {
        try {
            var track = tracks.items[i]
        } catch (error) {
            var track = tracks.tracks[i]
        }
        var trackURL = track.external_urls['spotify']
        var trackName = track.name
        var trackArtist = getArtists(track)
        document.getElementById("track-" + (i+1)).innerHTML = trackName + " - " + trackArtist
        document.getElementById("track-link-" + (i+1)).href = trackURL
    }
}

// create playlist handling
document.getElementById('create-playlist').addEventListener("click", createPlaylist)
document.getElementById('create-playlist-mobile').addEventListener("click", createPlaylist)
function createPlaylist() {
    document.getElementById('create-playlist').innerHTML = "Creating..."
    document.getElementById('create-playlist-mobile').innerHTML = "Creating..."
    console.log("Creating playlist with time range:" + window.timeRange)
    const tracksDict = {"short-term": window.tracksShort.items, "medium-term": window.tracksMedium.items, "long-term": window.tracksLong.items, "recommend": window.recommended.tracks}
    const tracks = tracksDict[window.timeRange]
    var trackList = ""
        tracks.forEach(track => {
            trackList += track.uri + ','
        })
    trackList = trackList.slice(0, -1)

    const timeTags = {
        "short-term": 'My top tracks from the last month.',
        "medium-term": 'My top tracks from the last six months.', 
        "long-term": 'My top tracks from the last year.',
        "recommend": "mixedify's recommendations for me."
    }

    const playlist = toPlaylist(trackList, document.getElementById('mixtape-name-input').value, `${timeTags[window.timeRange]} Generated on ${document.getElementById('date').innerHTML} by mixedify. Get yours at www.mixedify.netlify.app!`)
    playlist.then(pl => {
        console.log(pl)
        setTimeout(() => {window.open(pl.external_urls.spotify, "_blank")})
        document.getElementById('create-playlist').innerHTML = "Create playlist"
        document.getElementById('create-playlist-mobile').innerHTML = "Create playlist"
    })
}

// function for updating recommendations

async function updateRecs() {
    console.log('fetching new recommendations')
    const newRecommended = await fetchRecommended(accessToken, JSON.parse(sessionStorage.getItem('tracksShort')));
    sessionStorage.setItem('recommended', JSON.stringify(newRecommended))
    window.recommended = JSON.parse(sessionStorage.getItem('recommended'))
    return window.recommended
}

document.getElementById('refresh-rec').addEventListener('click', function() {
    const refresh = document.getElementById('refresh-rec')
    if (timeRange == 'recommend') {
        console.log('refreshing...')
        refresh.innerHTML = "Refreshing..."
        refresh.classList.add('active')

        const populateRecs = async () => {
            await updateRecs()
            console.log('Now populating UI')
            populateUI(window.profile, window.recommended)
            refresh.innerHTML = "Refresh recs"
            const displayName = window.profile.display_name.replaceAll(/\p{Emoji}/ug, '')
            document.getElementById("cassette-title").innerText = "recs for " + displayName.toLowerCase()
            document.getElementById("mixtape-name-input").value = "recs for " + displayName.toLowerCase()
            refresh.classList.remove('active')
        }
    
        populateRecs()
    }
})

// time range handling
document.querySelectorAll('.time-range-option').forEach(btn => {
    const displayName = profile.display_name.replaceAll(/\p{Emoji}/ug, '')
    btn.addEventListener("click", function() {
        if (!this.classList.contains("active")) {
            document.querySelectorAll('.time-range-option').forEach(btn => {
                btn.classList.remove("active")
            })
            this.classList.add("active")
            timeRange = this.id
            window.timeRange = timeRange
            const tracksDict = {"short-term": window.tracksShort, "medium-term": window.tracksMedium, "long-term": window.tracksLong, "recommend": window.recommended}
            const timeRangeDict = {"short-term": "Last month", "medium-term": "Last 6 months", "long-term": "Last 12 months", "recommend": "Recommended for " + displayName.toLowerCase()}
            populateUI(window.profile, tracksDict[timeRange])
            document.getElementById("time").innerHTML = timeRangeDict[timeRange]
        }
    })
})

document.getElementById("recommend").addEventListener("click", function() {
    const displayName = profile.display_name.replaceAll(/\p{Emoji}/ug, '')
    document.getElementById("cassette-title").innerText = "recs for " + displayName.toLowerCase();
    document.getElementById("mixtape-name-input").value = "recs for " + displayName.toLowerCase();
})

document.getElementById("short-term").addEventListener("click", function() {
    const displayName = profile.display_name.replaceAll(/\p{Emoji}/ug, '')
    document.getElementById("cassette-title").innerText = displayName.toLowerCase() + "'s past month";
    document.getElementById("mixtape-name-input").value = displayName.toLowerCase() + "'s past month"
})

document.getElementById("medium-term").addEventListener("click", function() {
    const displayName = profile.display_name.replaceAll(/\p{Emoji}/ug, '')
    document.getElementById("cassette-title").innerText = displayName.toLowerCase() + "'s mix vol. 1";
    document.getElementById("mixtape-name-input").value = displayName.toLowerCase() + "'s mix vol. 1"
})

document.getElementById("long-term").addEventListener("click", function() {
    const displayName = profile.display_name.replaceAll(/\p{Emoji}/ug, '')
    document.getElementById("cassette-title").innerText = displayName.toLowerCase() + "'s past year";
    document.getElementById("mixtape-name-input").value = displayName.toLowerCase() + "'s past year"
})

// auto update mixtape title
document.getElementById("mixtape-name-input").addEventListener("input", updateTitle)
function updateTitle(e) {
    document.getElementById("cassette-title").innerHTML = e.target.value
}

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

// non-mobile: save image handling
async function downloadImage() {
    var card = document.getElementById("mixtape-container")

    return htmlToImage.toPng(card, {
        ignoreElements: function( element ) {
            if( 'mix-head' == element.id ) {
                return true;
            }
        }
        }
    )
}

async function getPreview() {
    document.getElementById('tracklist').classList.toggle('hide')
    
    if (window.innerWidth < 500) {
        //document.getElementById("mix-head").style.display = "none"
        document.getElementById("mix-tag").style.display = "none"
    }
    
    await downloadImage()
    await downloadImage()
    await downloadImage()

    const dataUrl = await downloadImage()
    console.log(dataUrl);

    /*
    var link = document.createElement('a');
    link.download = 'preview.jpeg';
    link.href = dataUrl;
    link.click();
    */
    
    if (window.innerWidth < 500) {
        //document.getElementById("mix-head").style.display = "block"
        document.getElementById("mix-tag").style.display = "block"
    }

    document.getElementById('tracklist').classList.toggle('hide')

    return dataUrl
}

document.getElementById('download').addEventListener("click", console.log("Downloading"))


// Firebase handling

const burnAndShare = [document.getElementById('burn-and-share'), document.getElementById('burn-and-share-mobile')]

function generateHash(mixtapeData) {
    // Construct a string from the critical parts of the mixtape data
    const tracksString = mixtapeData.tracks.slice(0, 5).map(track => track.href).join("");
    const dataString = `${mixtapeData.date}${mixtapeData.time}${mixtapeData.mixtapeTitle}${mixtapeData.activeColor}${tracksString}`;

    // Convert the data string to a base64 string using btoa and handle UTF-8 properly
    const base64String = btoa(encodeURIComponent(dataString).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));

    // Return the base64 encoded string, potentially truncated to manage size
    return base64String.substring(0, 64); // you might adjust the length as needed
}

burnAndShare.forEach(btn => {
    btn.addEventListener('click', async function () {
        btn.innerHTML = "Burning..."
        const mixtapeData = collectMixtapeData();
        const mixtapeHash = await generateHash(mixtapeData);  // Assuming generateHash() returns a hash string
        const isDuplicate = await checkForDuplicate(mixtapeHash, db);
        const cover = await getPreview()
        // console.log(cover)
        let docId;

        if (!isDuplicate) {
            const docRef = await addDoc(collection(db, "mixtapes"), { ...mixtapeData, hash: mixtapeHash });
            docId = docRef.id;
            console.log("Document written with ID: ", docId);
        } else {
            docId = await getExistingDocumentId(mixtapeHash, db);
            console.log("Existing document ID: ", docId);
        }

        const coverRef = ref(storage, `covers/${docId}`)

        uploadString(coverRef, cover, 'data_url').then((snapshot) => {
            console.log('Uploaded cover with filename', docId);
          });

        btn.innerHTML = "Burn and share"
        showPopup(docId);  // Call to show the popup
    })
});

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
    return querySnapshot.docs[0].id;  // Return the ID of the first document matching the hash
}


function collectMixtapeData() {
    const cardBg = sessionStorage.getItem('cardBg')
    const bgColor = sessionStorage.getItem('bgColor')
    const activeColor = sessionStorage.getItem('activeColor')

    console.log(cardBg)
    console.log(bgColor)
    console.log(activeColor)

    const mixtapeData = {
        date: document.getElementById('date').textContent,
        time: document.getElementById('time').textContent,
        tracks: [],
        mixtapeTitle: document.getElementById('cassette-title').textContent,
        cardBg: cardBg,
        bgColor: bgColor,
        activeColor: activeColor
    }

    for (let i = 1; i <= 20; i++) {
        const trackLink = document.getElementById(`track-link-${i}`);
        const track = document.getElementById(`track-${i}`);

        if (track && trackLink) {
            mixtapeData.tracks.push({
                href: trackLink.href,
                trackName: track.textContent
            });
        }
    }
    return mixtapeData
}

function showPopup(docId) {
    const popup = document.createElement('div');
    const link = "https://mixedify.netlify.app/mix/?id=" + docId
    popup.className = 'share-popup';

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
    const closeButtons = popup.querySelectorAll('#close-popup, #mobile-close-popup');
    closeButtons.forEach(button => button.addEventListener('click', () => {
        document.body.classList.remove('show-popup');
        document.body.removeChild(popup);
    }));

     // Copy link  functionality
     const copyButtons = popup.querySelectorAll('#copy, #mobile-copy');
     copyButtons.forEach(button => button.addEventListener('click', () => {
         navigator.clipboard.writeText(link)
         button.innerHTML = "Copied!"
         setTimeout(() => {button.innerHTML = "Copy Link"}, 1500)
     }));

    // Show the popup
    document.body.classList.add('show-popup');
}