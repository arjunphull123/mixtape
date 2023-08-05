// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const token = 'BQBWDX7VzkACe-Dd_gblypSG7btjRQPSUeA__ydmIEbDyBisB7JK0FeFEhkHWpS3c2Csn-oxbrOLseBLNRDmNgxgdk8_qgOyR0_DY9-1Nopow1-NC0mHa9lK7zbJNlwy-ra5HcBztqI4-GP1XH8BWNuTZES7kZ5EcM0ADKZLz28dejF67c8iMCnPLhMGgIGajvkRWk15jt5wA6gWtxt_sleiLIZJrrMO0HMG8dRc9phi0zkUK81IJeQdL7Cw0rUY8Zqakw';
async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body:JSON.stringify(body)
  });
  return await res.json();
}

// Get top 5 tracks:
async function getTopTracks(){
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  return (await fetchWebApi(
    'v1/me/top/tracks?time_range=short_term&limit=5', 'GET'
  )).items;
}

const topTracks = await getTopTracks();
console.log(
  topTracks?.map(
    ({name, artists}) =>
      `${name} by ${artists.map(artist => artist.name).join(', ')}`
  )
);

// Recommend 5 tracks:
const topTracksIds = [
  '3sW3oSbzsfecv9XoUdGs7h','3MytWN8L7shNYzGl4tAKRp','0fX4oNGBWO3dSGUZcVdVV2','3GCdLUSnKSMJhs4Tj6CV3s','79uDOz0zuuWS7HWxzMmTa2'
];

async function getRecommendations(){
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-recommendations
  return (await fetchWebApi(
    `v1/recommendations?limit=5&seed_tracks=${topTracksIds.join(',')}`, 'GET'
  )).tracks;
}

const recommendedTracks = await getRecommendations();
console.log(
  recommendedTracks.map(
    ({name, artists}) =>
      `${name} by ${artists.map(artist => artist.name).join(', ')}`
  )
);

// save recs in playlist
// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization

const tracksUri = [
  'spotify:track:3sW3oSbzsfecv9XoUdGs7h','spotify:track:3xKsf9qdS1CyvXSMEid6g8','spotify:track:3MytWN8L7shNYzGl4tAKRp','spotify:track:0caJ2wkqp4UmXBwdR2JvB5','spotify:track:0fX4oNGBWO3dSGUZcVdVV2','spotify:track:6nmukSDAmw3XtbGKGD8056','spotify:track:3GCdLUSnKSMJhs4Tj6CV3s','spotify:track:5M5TD1Tlpcgq0Fj1l6Mz6Z','spotify:track:79uDOz0zuuWS7HWxzMmTa2','spotify:track:3KdJanvjyMJLfEM2m9r6xM'
];

async function createPlaylist(tracksUri){
  const { id: user_id } = await fetchWebApi('v1/me', 'GET')

  const playlist = await fetchWebApi(
    `v1/users/${user_id}/playlists`, 'POST', {
      "name": "My recommendation playlist",
      "description": "Playlist created by the tutorial on developer.spotify.com",
      "public": false
  })

  await fetchWebApi(
    `v1/playlists/${playlist.id}/tracks?uris=${tracksUri.join(',')}`,
    'POST'
  );

  return playlist;
}

const createdPlaylist = await createPlaylist(tracksUri);
console.log(createdPlaylist.name, createdPlaylist.id);
