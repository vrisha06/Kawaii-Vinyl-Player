import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';

import {
  redirectToSpotifyAuth,
  getAccessToken,
} from '../utils/spotifyAuth';

import usePlayerStore from '../store/usePlayerStore';

const AudioPlayerContext = createContext();

export const useAudioPlayer = () => {
  const context = useContext(
    AudioPlayerContext
  );

  if (!context) {
    throw new Error(
      'useAudioPlayer must be used within an AudioPlayerProvider'
    );
  }

  return context;
};

export const AudioPlayerProvider = ({
  children,
}) => {

  /* =========================================
     STATES
  ========================================= */

  const [currentTrack, setCurrentTrack] =
    useState(null);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [volume, setVolume] =
    useState(0.7);

  const [spotifyToken, setSpotifyToken] =
    useState(
      localStorage.getItem(
        'spotify_token'
      )
    );

  const [spotifyTracks, setSpotifyTracks] =
    useState([]);

  const [status, setStatus] =
    useState('IDLE');

  const [deviceId, setDeviceId] =
    useState(null);

  const [sdkPlayer, setSdkPlayer] =
    useState(null);

  /* =========================================
     ZUSTAND
  ========================================= */

  const zustandTrack = usePlayerStore(
    (state) => state.currentTrack
  );

  /* =========================================
     CONFIG
  ========================================= */

  const CLIENT_ID =
    import.meta.env
      .VITE_SPOTIFY_CLIENT_ID ||
    'YOUR_CLIENT_ID';

  const audioRef = useRef(
    new Audio()
  );

  const exchangeInProgress =
    useRef(false);

  /* =========================================
     SPOTIFY AUTH
  ========================================= */

  useEffect(() => {

    const urlParams =
      new URLSearchParams(
        window.location.search
      );

    const code =
      urlParams.get('code');

    if (
      code &&
      !spotifyToken &&
      !exchangeInProgress.current
    ) {

      exchangeInProgress.current =
        true;

      setStatus(
        'EXCHANGING_TOKEN'
      );

      window.history.replaceState(
        {},
        document.title,
        '/'
      );

      getAccessToken(
        CLIENT_ID,
        code
      )
        .then((token) => {

          setStatus(
            'TOKEN_RECEIVED'
          );

          setSpotifyToken(token);

          localStorage.setItem(
            'spotify_token',
            token
          );
        })

        .catch((err) => {

          console.error(err);

          setStatus(
            'ERROR_TOKEN'
          );

          exchangeInProgress.current =
            false;
        });
    }

  }, []);

  /* =========================================
     FETCH TRACKS + SDK
  ========================================= */

  useEffect(() => {

    if (spotifyToken) {

      fetchSpotifyTracks();

      initializeSpotifySDK();

    } else {

      loginWithSpotify();

    }

    return () => {

      if (sdkPlayer) {
        sdkPlayer.disconnect();
      }
    };

  }, [spotifyToken]);

  /* =========================================
     ZUSTAND TRACK SYNC
  ========================================= */

  useEffect(() => {

    if (!zustandTrack) return;

    const normalizedTrack = {
      id:
        zustandTrack.id ||
        zustandTrack.title,

      title:
        zustandTrack.title ||
        zustandTrack.name,

      artist:
        zustandTrack.artist,

      cover:
        zustandTrack.cover ||
        zustandTrack.image,

      uri:
        zustandTrack.uri,

      audio:
        zustandTrack.audio,
    };

    playTrack(normalizedTrack);

  }, [zustandTrack]);

  /* =========================================
     SPOTIFY SDK
  ========================================= */

  const initializeSpotifySDK =
    () => {

      if (sdkPlayer) {

        sdkPlayer.disconnect();

        setSdkPlayer(null);
      }

      if (window.Spotify) {

        createPlayer();

        return;
      }

      window.onSpotifyWebPlaybackSDKReady =
        () => {
          createPlayer();
        };
    };

  const createPlayer = () => {

    const player =
      new window.Spotify.Player({
        name:
          'Kawaii Vinyl Player',

        getOAuthToken: (
          cb
        ) => {
          cb(spotifyToken);
        },

        volume,
      });

    setSdkPlayer(player);

    /* READY */
    player.addListener(
      'ready',
      ({ device_id }) => {

        setDeviceId(device_id);

        setStatus(
          'PREMIUM_READY'
        );

        setTimeout(() => {

          transferPlayback(
            device_id
          );

        }, 1000);
      }
    );

    /* OFFLINE */
    player.addListener(
      'not_ready',
      () => {

        setDeviceId(null);

        setStatus(
          'PREMIUM_OFFLINE'
        );
      }
    );

    /* PLAYER STATE */
    player.addListener(
      'player_state_changed',
      (state) => {

        if (!state) return;

        setIsPlaying(
          !state.paused
        );

        setProgress(
          (state.position /
            state.duration) *
            100
        );

        setDuration(
          state.duration / 1000
        );

        const track =
          state.track_window
            .current_track;

        if (track) {

          setCurrentTrack({
            id: track.id,

            title:
              track.name,

            artist:
              track.artists[0]
                .name,

            cover:
              track.album
                .images[0]?.url,

            uri:
              track.uri,
          });
        }
      }
    );

    player.connect();
  };

  /* =========================================
     TRANSFER PLAYBACK
  ========================================= */

  const transferPlayback =
    async (
      devId
    ) => {

      try {

        await fetch(
          'https://api.spotify.com/v1/me/player',
          {
            method: 'PUT',

            body: JSON.stringify(
              {
                device_ids: [
                  devId,
                ],

                play: false,
              }
            ),

            headers: {
              'Content-Type':
                'application/json',

              Authorization:
                `Bearer ${spotifyToken}`,
            },
          }
        );

      } catch (err) {

        console.error(err);
      }
    };

  /* =========================================
     FETCH TRACKS
  ========================================= */

  const fetchSpotifyTracks =
    async () => {

      try {

        const response =
          await fetch(
            'https://api.spotify.com/v1/me/tracks?limit=20',
            {
              headers: {
                Authorization:
                  `Bearer ${spotifyToken}`,
              },
            }
          );

        const data =
          await response.json();

        /* TOKEN EXPIRED */
        if (!data.items) {

          console.warn(
            'Spotify token expired'
          );

          localStorage.removeItem(
            'spotify_token'
          );

          setSpotifyToken(null);

          setStatus(
            'TOKEN_EXPIRED'
          );

          return;
        }

        const tracks =
          data.items.map(
            (item) => ({
              id:
                item.track.id,

              title:
                item.track.name,

              artist:
                item.track
                  .artists[0]
                  .name,

              cover:
                item.track
                  .album
                  .images[0]?.url,

              audio:
                item.track
                  .preview_url,

              uri:
                item.track.uri,
            })
          );

        setSpotifyTracks(
          tracks
        );

        setStatus(
          'TRACKS_LOADED'
        );

      } catch (err) {

        console.error(err);

        setStatus(
          'ERROR_FETCH'
        );
      }
    };

  /* =========================================
     LOGIN
  ========================================= */

  const loginWithSpotify =
    () => {

      localStorage.removeItem(
        'spotify_token'
      );

      setSpotifyToken(null);

      redirectToSpotifyAuth(
        CLIENT_ID
      );
    };

  /* =========================================
     AUDIO EVENTS
  ========================================= */

  useEffect(() => {

    const audio =
      audioRef.current;

    const updateProgress =
      () => {

        setProgress(
          (audio.currentTime /
            audio.duration) *
            100 || 0
        );
      };

    const handleLoadedMetadata =
      () => {

        setDuration(
          audio.duration
        );
      };

    const handleEnded =
      () => {

        setIsPlaying(false);

        setProgress(0);
      };

    audio.addEventListener(
      'timeupdate',
      updateProgress
    );

    audio.addEventListener(
      'loadedmetadata',
      handleLoadedMetadata
    );

    audio.addEventListener(
      'ended',
      handleEnded
    );

    return () => {

      audio.removeEventListener(
        'timeupdate',
        updateProgress
      );

      audio.removeEventListener(
        'loadedmetadata',
        handleLoadedMetadata
      );

      audio.removeEventListener(
        'ended',
        handleEnded
      );
    };

  }, []);

  /* =========================================
     VOLUME
  ========================================= */

  useEffect(() => {

    audioRef.current.volume =
      volume;

    if (sdkPlayer) {

      sdkPlayer.setVolume(
        volume
      );
    }

  }, [volume, sdkPlayer]);

  /* =========================================
     PLAY TRACK
  ========================================= */

  const playTrack =
    async (track) => {

      if (
        currentTrack?.id ===
        track.id
      ) {

        togglePlay();

        return;
      }

      setCurrentTrack(track);

      if (deviceId) {

        try {

          await fetch(
            `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
            {
              method: 'PUT',

              body: JSON.stringify(
                {
                  uris: [
                    track.uri,
                  ],
                }
              ),

              headers: {
                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${spotifyToken}`,
              },
            }
          );

          setIsPlaying(true);

          setStatus(
            'PLAYING_PREMIUM'
          );

        } catch (err) {

          console.error(err);
        }

      } else if (
        track.audio
      ) {

        audioRef.current.src =
          track.audio;

        audioRef.current.play();

        setIsPlaying(true);

        setStatus(
          'PLAYING_PREVIEW'
        );
      }
    };

  /* =========================================
     TOGGLE PLAY
  ========================================= */

  const togglePlay =
    async () => {

      if (sdkPlayer) {

        try {

          await sdkPlayer.activateElement();

          await sdkPlayer.togglePlay();

        } catch (err) {

          console.error(err);
        }

      } else {

        if (isPlaying) {

          audioRef.current.pause();

        } else {

          audioRef.current.play();
        }

        setIsPlaying(
          !isPlaying
        );
      }
    };

  /* =========================================
     SEEK
  ========================================= */

  const seek = (
    percent
  ) => {

    if (sdkPlayer) {

      const position_ms =
        (percent / 100) *
        duration *
        1000;

      sdkPlayer.seek(
        position_ms
      );

    } else {

      const time =
        (percent / 100) *
        audioRef.current
          .duration;

      audioRef.current.currentTime =
        time;
    }

    setProgress(percent);
  };

  /* =========================================
     FIX SOUND
  ========================================= */

  const fixSound =
    async () => {

      if (
        sdkPlayer &&
        deviceId
      ) {

        try {

          await sdkPlayer.activateElement();

          await transferPlayback(
            deviceId
          );

          await sdkPlayer.setVolume(
            volume
          );

        } catch (err) {

          console.error(err);
        }

      } else {

        initializeSpotifySDK();
      }
    };

  /* =========================================
     CONTEXT VALUE
  ========================================= */

  const value = {
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,

    setVolume,

    playTrack,
    togglePlay,
    seek,

    spotifyToken,
    spotifyTracks,

    loginWithSpotify,

    status,
    fixSound,
  };

  return (
    <AudioPlayerContext.Provider
      value={value}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};