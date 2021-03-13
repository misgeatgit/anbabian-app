import React from 'react';
import { StatusBar } from 'react-native';
import AppLoading from 'expo-app-loading';
import { Provider } from 'react-redux';
import { func } from './src/constants';
// main navigation stack
import Stack from './src/navigation/Stack';
import ExpoAdioPlayer from './src/playback/playback';
import {setUpDB} from './src/Settings';
import store from './src/Redux';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.changeSong = this.changeSong.bind(this);
    this.playSong = this.playSong.bind(this);
    this.setToggleTabBar = this.setToggleTabBar.bind(this);
    this.state = {
      currentSongData: {
        album: 'Swimming',
        artist: 'Mac Miller',
        image: 'swimming',
        length: 312,
        title: 'So It Goes',
        audio: ""
      },
      isLoading: true,
      toggleTabBar: false
    };
    // Create DB
    setUpDB();
  }

  componentDidMount() {
    const { currentSongData: { title, audio } } = this.state
  }



  _onPlayPausePressed = () => {
      if (this.state.isPlaying) {
        ExpoAdioPlayer.pause();
      } else {
        ExpoAdioPlayer.play();
      }
  };

  setToggleTabBar() {
    this.setState(({ toggleTabBar }) => ({
      toggleTabBar: !toggleTabBar
    }));
  }

  changeSong(data) {
    if (data.audio !== "") {
      // Synchronize song update with playbackInstance object creation.
      let loadPlayer = () => {
        const { currentSongData: { title, audio } } = this.state
        ExpoAdioPlayer.load(audio)
      }
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
    const eventSubscribers = ExpoAdioPlayer.eventSubscribers;
    if (isLoading) {
      return (
      <Provider store={store}>
        <AppLoading
          onFinish={() => this.setState({ isLoading: false })}
          startAsync={func.loadAssetsAsync}
          onError={console.warn}
        />
        </Provider>
      );
    }

    return (
      <Provider store={store}>
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
      </Provider>
    );
  }
}
