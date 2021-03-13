/* eslint-disable react/destructuring-assignment */
/* eslint-disable prettier/prettier */
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import { FontAwesome } from '@expo/vector-icons';
import { colors, device, gStyle } from '../constants';

class BarMusicPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      favorited: false,
      paused: true,
      isLoaded: false // for sound
    };
    this.toggleFavorite = this.toggleFavorite.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    this.toggleLoading=this.toggleLoading.bind(this);
    //this.props.eventSubscribers.playBackLoaded.push(this.toggleLoading);
  }

  toggleFavorite() {
    this.setState(prev => ({
      favorited: !prev.favorited
    }));
  }

  toggleLoading(loaded){
    this.setState(() => ({isLoaded:loaded}));
    // Reset play
    this.setState(()=>({paused: true}));
  }

  togglePlay() {
    this.setState(prev => ({
      paused: !prev.paused
    }),
      () => {
        const { paused } = this.state;
        const { playPauseCallBack } = this.props;
        // This is a bit misleading it should have been !paused FIXME
        playPauseCallBack(paused);
      });
  }

  render() {
    const { navigation, song, eventSubscribers, isLoaded } = this.props;
    const { paused} = this.state;

    const iconPlay = paused ? 'play-circle' : 'pause-circle';

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => navigation.navigate('ModalMusicPlayer',{eventSubscribers, paused})}
        style={styles.container}
      >
        <TouchableOpacity
          activeOpacity={gStyle.activeOpacity}
          hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
          onPress={this.toggleFavorite}
          style={styles.containerIcon}
        />
        {song && (
        <View style={styles.containerSong}>
          <Text style={styles.title}>{`${song.title} · `}</Text>
          <Text style={styles.artist}>{song.album}</Text>
        </View>
        )}
        {isLoaded &&
        // eslint-disable-next-line react/jsx-wrap-multilines
        <TouchableOpacity
          activeOpacity={gStyle.activeOpacity}
          hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
          onPress={this.togglePlay}
          style={styles.containerIcon}
        >
          <FontAwesome color={colors.white} name={iconPlay} size={28} />
        </TouchableOpacity>
        }
        {!isLoaded &&
          <ActivityIndicator size="small" color="white" style={styles.activityIndicator} />
        }
      </TouchableOpacity>
    );
  }
}

BarMusicPlayer.defaultProps = {
  song: null
};

BarMusicPlayer.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,

  // optional
  song: PropTypes.shape({
    artist: PropTypes.string,
    title: PropTypes.string
  })
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    backgroundColor: colors.grey,
    borderBottomColor: colors.blackBg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    width: '100%'
  },
  containerIcon: {
    ...gStyle.flexCenter,
    width: 50
  },
  containerSong: {
    ...gStyle.flexRowCenter,
    overflow: 'hidden',
    width: device.width - 100
  },
  title: {
    ...gStyle.textSpotify12,
    color: colors.white
  },
  artist: {
    ...gStyle.textSpotify12,
    color: colors.greyLight
  },
  device: {
    ...gStyle.textSpotify10,
    color: colors.brandPrimary,
    marginLeft: 4,
    textTransform: 'uppercase'
  },
  activityIndicator: {
    marginRight: 5
  }
});

const mapStateProps = (state) => {
  const {audioBook: {selectedAudio: {isLoaded}} } = state;
  console.log(`isLoaded: ${isLoaded}`)
  return {isLoaded};
}

export default withNavigation(connect(mapStateProps)(BarMusicPlayer));
