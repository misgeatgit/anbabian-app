/* eslint-disable class-methods-use-this */
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
import download from '../data/AudioBook'

/*
Expo based Audio player.
*/
class AudioPlayer {
  constructor() {
    this.playbackInstance = null;
    this.speed = 1;
    this.cache = {};
    this.eventSubscribers = {
      playBackLoaded: [],
      playBackChanged: []
    };

    this.notifyPlaybackChanged = this.notifyPlaybackChanged.bind(this);
    this.notifyPlaybackLoaded = this.notifyPlaybackLoaded.bind(this);

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
    console.log('Inside notifier.');
    for (let i = 0; i < this.eventSubscribers.playBackLoaded.length; i++) {
      this.eventSubscribers.playBackChanged[i](isChanged);
    }
  }

  onPlaybackStatusUpdate(playbackStatus, params) {
    if (!playbackStatus.isLoaded) {
      // Update your UI for the unloaded state
      if (playbackStatus.error) {
        console.log(
          `Encountered a fatal error during playback: ${playbackStatus.error}`
        );
        // Send Expo team the error on Slack or the forums so we can help you debug!
      }
    } else {
      // Update your UI for the loaded state
      if (playbackStatus.isPlaying) {
        // Update your UI for the playing state
      } else {
        // Update your UI for the paused state
      }

      if (playbackStatus.isBuffering) {
        // Update your UI for the buffering state
      }

      if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
        // The player has just finished playing and will stop. Maybe you want to play something else?
      }
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

    if (!(source.uri in this.cache)) {
      try {
        const uri = await download(source.uri);
        this.cache[source.uri] = uri;
        console.log('Downloaded to ', uri);
      } catch (err) {
        console.log(err);
      }
    }
    // Set uri to local directory path
    source.uri = this.cache[source.uri];

    const { sound } = await Audio.Sound.createAsync(
      source,
      initialStatus,
      this.onPlaybackStatusUpdate
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
