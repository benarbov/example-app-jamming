let accessToken ;
let redirectURI = 'confidential';
let clientId = 'confidential';



const Spotify = {
    getAccessToken() {
        let URL = window.location.href ;
        let accessTokenMatch = URL.match(/access_token=([^&]*)/) ;
        let expiresInMatch = URL.match(/expires_in=([^&]*)/);
        
        if(accessToken) {
            console.log(accessToken);
            return accessToken;
        } else if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]); 
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
        }
    },

    search(term) {
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
        {headers: {
            Authorization: 'Bearer ' + Spotify.getAccessToken()
        }})
        .then(response => {
            return response.json();
        })
        .then(jsonResponse => {
            if(jsonResponse.tracks) {
                return jsonResponse.tracks.items.map(track => ({
                    name: track.name,
                    id: track.id,
                    URI: track.uri,
                    artist: track.artists[0].name,
                    album: track.album.name
                }) );

            } else {
                return [];
            };
        });
    },

    savePlaylist(name, URIarray) {
        if (!(name && URIarray.length)) {
            return;
        } else {
            const accessToken = Spotify.getAccessToken();
            const headers = {
                Authorization: 'Bearer ' + accessToken
            };
            let userId ;

            return fetch(`https://api.spotify.com/v1/me`, {headers: headers} 
            ).then(response => {
                console.log('here');
                return response.json();
            }).then(jsonResponse => {
                userId = jsonResponse.id;
                console.log(userId);
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                    
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({name: name})
                    }
                ).then(response => response.json()
                ).then(jsonResponse => {
                    const playlistId = jsonResponse.id;
                    return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                        headers: headers,
                        method: 'POST',
                        body: JSON.stringify({uris: URIarray})
                        });
                    });
                })
        };
        
    }
};

export default Spotify;
