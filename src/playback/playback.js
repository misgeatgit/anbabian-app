/*
Responsible for downloading, encrypting/saving and and decrypting/loading audio.
*/

/*
   Idea 1. For Downloading and Writing
    1. Use some react library for downloading the file.
    2.[optional] encrypt
    3.Persist
    4.Persist persisted audio data metadata into sqlite

    For Reading
    1. Read path from sqlite
    2. Use expo audio for playing
    3. Storing loaded audio into cache (Use LRU strategy)
*/

import { Audio } from 'expo-av';

class AuidoPlayer {
  constructor(cacheSize) {
    this.cacheSize = cacheSize;
    this.speed = 1;
    this.cache = {};
    this.state = {
      muted: false,
      playbackInstancePosition: null,
      playbackInstanceDuration: null,
      shouldPlay: false,
      isPlaying: false,
      isBuffering: false,
      playBackLoading: true,
      isLoading: true,
      fontLoaded: false,
      shouldCorrectPitch: true,
      volume: 1.0,
      rate: 1.0,
      poster: false,
      useNativeControls: false,
      fullscreen: false,
      throughEarpiece: false,
      currentSongData: {
        album: 'Swimming',
        artist: 'Mac Miller',
        image: 'swimming',
        length: 312,
        title: 'So It Goes',
        audio: ''
      },
      toggleTabBar: false
    };
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false
    });
     //this._loadNewPlaybackInstance(false);

  }

  async _loadNewPlaybackInstance(playing) {
    if (this.playbackInstance != null) {
      await this.playbackInstance.unloadAsync();
      // this.playbackInstance.setOnPlaybackStatusUpdate(null);
      this.playbackInstance = null;
    }
    // Notify file is read for play.
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.eventSubscribers.playBackLoaded.length; i++) {
      this.eventSubscribers.playBackLoaded[i](false);
    }
    const initialStatus = {
      shouldPlay: playing,
      rate: this.state.rate,
      shouldCorrectPitch: this.state.shouldCorrectPitch,
      volume: this.state.volume,
      isMuted: this.state.muted,
      isLooping: this.state.loopingType === LOOPING_TYPE_ONE
      // // UNCOMMENT THIS TO TEST THE OLD androidImplementation:
      // androidImplementation: 'MediaPlayer',
    };

    const { sound, status } = await Audio.Sound.createAsync(
      source,
      initialStatus,
      this._onPlaybackStatusUpdate
    );
    this.playbackInstance = sound;
    // Notify file is read for play.
    for (var i = 0; i < this.eventSubscribers.playBackLoaded.length; i++) {
      this.eventSubscribers.playBackLoaded[i](true);
    }
    this._updateScreenForLoading(false);
  }

  load(id) {
    if (id in cache) {
      cache[id].hitCount++;
      const { soundObject } = cache[id];
    } else {
      cache[id].hitCount++;
      // load sound and add it to cache
    }
    // Saves it to cache.
    // If cache is full, unloades the Least recently used one.
  }

  set speed(speed) {}

  get speed() {}

  play() {}

  pause() {}
}
