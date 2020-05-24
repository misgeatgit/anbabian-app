import React from 'react';
import PropTypes from 'prop-types';
import { BottomTabBar } from 'react-navigation';

// components
import BarMusicPlayer from './BarMusicPlayer';

const CustomTabBar = props => {
  const {
    screenProps: { currentSongData, toggleTabBarState, playPauseCallBack }
  } = props;

  return toggleTabBarState ? null : (
    <React.Fragment>
      <BarMusicPlayer song={currentSongData} playPauseCallBack={playPauseCallBack} />
      <BottomTabBar {...props} />
    </React.Fragment>
  );
};

CustomTabBar.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object.isRequired
};

export default CustomTabBar;
