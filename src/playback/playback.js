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

/*
Expo based Audio player.
*/
class AudioPlayer {
  constructor(cacheSize) {
    this.cacheSize = cacheSize;
    this.playbackInstance = null;
    this.speed = 1;
    this.cache = {};
    this.eventSubscribers = {
      playBackLoaded: [],
      playBackChanged: []
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
  }

  notifyPlaybackLoaded(isLoaded) {
    for (let i = 0; i < this.eventSubscribers.playBackLoaded.length; i++) {
      this.eventSubscribers.playBackLoaded[i](isLoaded);
    }
  }
 
  notifyPlaybackChanged(isChanged) {
    for (let i = 0; i < this.eventSubscribers.playBackLoaded.length; i++) {
      this.eventSubscribers.playBackChanged[i](isChanged);
    }
  }

  async load(audio) {
    const source = { uri: audio };
    const initialStatus = {
      shouldPlay: false,
      rate: 1.0,
      shouldCorrectPitch: true
    };

    if (this.playbackInstance != null) {
      await this.playbackInstance.unloadAsync();
      this.playbackInstance = null;
      this.notifyPlaybackLoaded(false);
    }
    const { sound } = await Audio.Sound.createAsync(
      source,
      initialStatus
      //,this._onPlaybackStatusUpdate  (We may use this for registering to events)
    );
    this.playbackInstance = sound;
    this.notifyPlaybackLoaded(true);
  }

  async play() {
    if (this.playbackInstance != null)
      await this.playbackInstance.setStatusAsync({ shouldPlay: true });
  }

  async pause() {
    if (this.playbackInstance != null)
      await this.playbackInstance.setStatusAsync({ shouldPlay: false });
  }
}

const ExpoAudioPlayer = new AudioPlayer();
export default ExpoAudioPlayer;
