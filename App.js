import React from 'react';
import { StatusBar } from 'react-native';
import { AppLoading } from 'expo';
import { func } from './src/constants';
import { Audio } from 'expo-av';
// main navigation stack
import Stack from './src/navigation/Stack';

const LOOPING_TYPE_ALL = 0;
const LOOPING_TYPE_ONE = 1;
const LOADING_STRING = "... loading ...";
const BUFFERING_STRING = "...buffering...";
const RATE_SCALE = 3.0;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.index = 0;
    this.isSeeking = false;
    this.shouldPlayAtEndOfSeek = false;
    this.playbackInstance = null;
    this.eventSubscribers = {
      'playBackLoaded':[],
      'playBackChanged':[]
    };
    this.changeSong = this.changeSong.bind(this);
    this.playSong = this.playSong.bind(this);
    this.playbackLoadedNotifier = this.playbackLoadedNotifier.bind(this);
    this.setToggleTabBar = this.setToggleTabBar.bind(this);
    this.state = {
      playbackInstanceName: LOADING_STRING,
      loopingType: LOOPING_TYPE_ALL,
      muted: false,
      playbackInstancePosition: null,
      playbackInstanceDuration: null,
      shouldPlay: false,
      isPlaying: false,
      isBuffering: false,
      playBackLoading:true,
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
        audio: ""
      },
      toggleTabBar: false
    };
  }

  componentDidMount() {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false
    });
    // Create PlayBackInstance object
    const { currentSongData: { title, audio } } = this.state
    console.log('COMPONENT IS MOUNTING...')
    if (audio !== "")
      this._loadNewPlaybackInstance(false);
    else
      console.log(`REJECTED CREATING AUDIO PLAYER FOR MUSIC BY THE TITLE ${title} WITH SOURCE ${audio}`)
  }


  async _loadNewPlaybackInstance(playing) {
    if (this.playbackInstance != null) {
      await this.playbackInstance.unloadAsync();
      // this.playbackInstance.setOnPlaybackStatusUpdate(null);
      this.playbackInstance = null;
    }
    // Notify file is read for play.
    for (var i = 0; i < this.eventSubscribers.playBackLoaded.length; i++){
       console.log(`Notifying subscribers.`)
       this.eventSubscribers.playBackLoaded[i](false);
    }
    const { currentSongData: { audio, title } } = this.state
    const source = { uri: audio };
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
    console.log(`CREATING AUDIO PLAYER FOR MUSIC BY THE TITLE ${title} WITH SOURCE ${source.uri}`)
    const { sound, status } = await Audio.Sound.createAsync(
      source,
      initialStatus,
      this._onPlaybackStatusUpdate
    );
    this.playbackInstance = sound;
    // Notify file is read for play.
    for (var i = 0; i < this.eventSubscribers.playBackLoaded.length; i++){
       console.log(`Notifying subscribers.`)
       this.eventSubscribers.playBackLoaded[i](true);
    }
    this._updateScreenForLoading(false);
  }

  _onPlaybackStatusUpdate = status => {
    if (status.isLoaded) {
      this.setState({
        playbackInstancePosition: status.positionMillis,
        playbackInstanceDuration: status.durationMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        isBuffering: status.isBuffering,
        rate: status.rate,
        muted: status.isMuted,
        volume: status.volume,
        loopingType: status.isLooping ? LOOPING_TYPE_ONE : LOOPING_TYPE_ALL,
        shouldCorrectPitch: status.shouldCorrectPitch
      });
      if (status.didJustFinish && !status.isLooping) {
        //TODO LOAD THE NEXT ITEM IN THE PLAY-LIST
      }
    } else {
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };
   _updateScreenForLoading(isLoading) {
    if (isLoading) {
      this.setState({
        isPlaying: false,
        playbackInstanceName: LOADING_STRING,
        playbackInstanceDuration: null,
        playbackInstancePosition: null,
        playBackLoading: true
      });
    } else {
      const { currentSongData: { title } } = this.state
      this.setState({
        playbackInstanceName: title,
        playBackLoading: false
      });
    }
  }
  // Play back load status
  playbackLoadedNotifier(subscriber) {
     console.log(`Registered a subscriber.`)
     this.playbackLoadedSubscribers.push(subscriber);
  }

  _onPlayPausePressed = () => {
    if (this.playbackInstance != null) {
      if (this.state.isPlaying) {
        this.playbackInstance.pauseAsync();
        console.log('PAUSING')
      } else {
        console.log('PLAYING')
        this.playbackInstance.playAsync();
      }
    }
  };

  setToggleTabBar() {
    this.setState(({ toggleTabBar }) => ({
      toggleTabBar: !toggleTabBar
    }));
  }

  changeSong(data) {
    console.log(`App.ChangeSong called. with TITLE:${data.title} and URL:${data.audio}`)
    if (data.audio !== "") {
      // Synchronize song update with playbackInstance object creation.
      let loadPlayer = () => { this._loadNewPlaybackInstance(false) }
      this.setState({
        currentSongData: data
      }, loadPlayer);
    } else {
      this.setState({
        currentSongData: data
      });
    }
  }

  playSong(play) {
    this.setState({ isPlaying: play }, () => {
      this._onPlayPausePressed();
    });
  }

  render() {
    const { currentSongData, isLoading, toggleTabBar } = this.state;
    const eventSubscribers = this.eventSubscribers;
    if (isLoading) {
      return (
        <AppLoading
          onFinish={() => this.setState({ isLoading: false })}
          startAsync={func.loadAssetsAsync}
        />
      );
    }

    return (
      <React.Fragment>
        <StatusBar barStyle="light-content" />

        <Stack
          screenProps={{
            currentSongData,
            eventSubscribers,
            changeSong: this.changeSong,
            playPauseCallBack: this.playSong,
            setToggleTabBar: this.setToggleTabBar,
            toggleTabBarState: toggleTabBar
          }}
        />
      </React.Fragment>
    );
  }
}
