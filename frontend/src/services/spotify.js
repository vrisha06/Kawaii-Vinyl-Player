import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi =
  new SpotifyWebApi();

/* ALWAYS USE FRESH TOKEN */
export const setSpotifyToken =
  () => {

    const token =
      localStorage.getItem(
        'spotify_token'
      );

    if (token) {

      spotifyApi.setAccessToken(
        token
      );

      console.log(
        'Spotify token set'
      );
    }
  };

setSpotifyToken();

export default spotifyApi;