import domtoimage from 'dom-to-image'
import { saveAs } from 'file-saver'

const clientId = "4b027ab3c8dd4b1f9ef6d083d0b51fb5"; // Replace with your client ID
const params = new URLSearchParams(window.location.search);
const code = params.get("code");



var timeRange = "short_term"
var titleSuffix = "'s Mix Vol. 1"
let accessToken, profile, tracksShort, tracksMedium, tracksLong

function removesessionStorage() {
    sessionStorage.clear()
}

document.getElementById('logout').addEventListener("click", removesessionStorage)

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



if (!code) {
    document.getElementById("log-in-button").addEventListener("click", function() {
        redirectToAuthCodeFlow(clientId)
    })
} else {
    const loadingScreen = document.getElementById("loading")
    loadingScreen.style.display = "flex"
    if (sessionStorage.getItem('accessToken')) {
        accessToken = JSON.parse(sessionStorage.getItem('accessToken'))
    } else {
        accessToken = await getAccessToken(clientId, code);
        sessionStorage.setItem('accessToken', JSON.stringify(accessToken))
    }
    if (sessionStorage.getItem('profile')) {
        profile = JSON.parse(sessionStorage.getItem('profile'))
    } else {
        profile = await fetchProfile(accessToken);
        sessionStorage.setItem('profile', JSON.stringify(profile))
    }
    if (sessionStorage.getItem('tracksShort')) {
        tracksShort = JSON.parse(sessionStorage.getItem('tracksShort'))
    } else {
        tracksShort = await fetchTracksShort(accessToken);
        sessionStorage.setItem('tracksShort', JSON.stringify(tracksShort))
    }
    if (sessionStorage.getItem('tracksMedium')) {
        tracksMedium = JSON.parse(sessionStorage.getItem('tracksMedium'))
    } else {
        tracksMedium = await fetchTracksMedium(accessToken);
        sessionStorage.setItem('tracksMedium', JSON.stringify(tracksMedium))
    }if (sessionStorage.getItem('tracksLong')) {
        tracksLong = JSON.parse(sessionStorage.getItem('tracksLong'))
    } else {
        tracksLong = await fetchTracksLong(accessToken);
        sessionStorage.setItem('tracksLong', JSON.stringify(tracksLong))
    }
    window.profile = JSON.parse(sessionStorage.getItem('profile'))
    window.tracksShort = JSON.parse(sessionStorage.getItem('tracksShort'))
    window.tracksMedium = JSON.parse(sessionStorage.getItem('tracksMedium'))
    window.tracksLong = JSON.parse(sessionStorage.getItem('tracksLong'))
    populateUI(window.profile, window.tracksShort);

    if (window.innerWidth < 500) {
        document.getElementById("mix-head").style.display = "block"
        document.getElementById("mix-tag").style.display = "block"
    }
    document.querySelector("body").classList.remove("lock-scroll")
    loadingScreen.style.display = "none"
}

async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    sessionStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "https://arjunphull123.github.io/mixtape");
    params.append("scope", "user-top-read");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

async function getAccessToken(clientId, code) {
    const verifier = sessionStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "https://arjunphull123.github.io/mixtape");
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    return access_token;
}

async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me/", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

async function fetchTracksShort(token) {
    const result = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=short_term", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

async function fetchTracksMedium(token) {
    const result = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=medium_term", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

async function fetchTracksLong(token) {
    const result = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=long_term", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

function getArtists(track) {
    var artists = track.artists
    var artistString = ""
    artists.forEach(artist => {
        artistString += artist.name + ", "
    })
    return artistString.slice(0, -2)
}

function populateUI(profile, tracks) {
    const today = new Date()
    var date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear()
    document.getElementById('date').innerHTML = date
    document.getElementById("cassette-title").innerText = profile.display_name + titleSuffix;
    document.getElementById("mixtape-name-input").value = profile.display_name + titleSuffix
    document.getElementById("start-container").style.display = "none"
    document.getElementById("customize-container").style.display = "flex"
    for (var i=0; i<20; i++) {
        var track = tracks.items[i]
        var trackName = track.name
        var trackArtist = getArtists(track)
        document.getElementById("track-" + (i+1)).innerHTML = trackName + " - " + trackArtist
    }
}

document.querySelectorAll('.time-range-option').forEach(btn => {
    btn.addEventListener("click", function() {
        if (!this.classList.contains("active")) {
            document.querySelectorAll('.time-range-option').forEach(btn => {
                btn.classList.remove("active")
            })
            this.classList.add("active")
            timeRange = this.id
            const tracksDict = {"short-term": window.tracksShort, "medium-term": window.tracksMedium, "long-term": window.tracksLong}
            const timeRangeDict = {"short-term": "Last month", "medium-term": "Last 6 months", "long-term": "All time"}
            populateUI(window.profile, tracksDict[timeRange])
            document.getElementById("time").innerHTML = timeRangeDict[timeRange]
        }
    })
})

document.getElementById("mixtape-name-input").addEventListener("input", updateTitle)
function updateTitle(e) {
    document.getElementById("cassette-title").innerHTML = e.target.value
}

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

function downloadImage() {
    var card = document.getElementById("mixtape-container")
    domtoimage.toBlob(card).then(function (blob) {
            window.saveAs(blob, 'mixtape.png');
        }
    );
}

document.getElementById('save-and-share').addEventListener("click", downloadImage)




/*
- for desktop, use dom-to-image. For mobile, create a screenshot-format-button that makes the card full-screen, and then tell the user to screenshot.
- error handling for api calls - if resource not found, pass and display an error message
- pre-populate the home screen with Billboard Top Hits (if there is an API?)
- DONE make some sort of loading screen
- Info screen

make new colors that are full alpha. 
make that the background for the content-container


Future functionality:
- Build your own mixtape by track
    Spotify search
    Start over completely
- Be able to send links to mixtapes
- TOp hits by year
*/

