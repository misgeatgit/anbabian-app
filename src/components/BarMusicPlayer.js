/* eslint-disable react/destructuring-assignment */
/* eslint-disable prettier/prettier */
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import { FontAwesome } from '@expo/vector-icons';
import { colors, device, gStyle } from '../constants';

class BarMusicPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      favorited: false,
      paused: true,
      isLoaded: false //for sound
    };
    this.toggleFavorite = this.toggleFavorite.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    this.toggleLoading=this.toggleLoading.bind(this);
    // eslint-disable-next-line react/destructuring-assignment
    // eslint-disable-next-line react/prop-types
    this.props.eventSubscribers.playBackLoaded.push(this.toggleLoading);
  }

  toggleFavorite() {
    this.setState(prev => ({
      favorited: !prev.favorited
    }));
  }

  // eslint-disable-next-line class-methods-use-this
  toggleLoading(loaded){
    console.log(`Going to toggle loading.`);
    this.setState(() => ({isLoaded:loaded}));
  }

  togglePlay() {
    this.setState(prev => ({
        paused: !prev.paused
      }),
      () => {
      const { paused } = this.state;
      // eslint-disable-next-line no-console
      console.log(`Paused=${paused}`);
      // eslint-disable-next-line react/prop-types
      const { playPauseCallBack } = this.props;
      console.log(`DEBUG[INFO]: Play=${!paused}!`);
      // This is a bit misleading it should have been !paused FIXME
      playPauseCallBack(paused);
    });
  }

  render() {
    const { navigation, song } = this.props;
    const { favorited, paused, isLoaded} = this.state;

    const favoriteColor = favorited ? colors.brandPrimary : colors.white;
    const favoriteIcon = favorited ? 'heart' : 'heart-o';
    const iconPlay = paused ? 'play-circle' : 'pause-circle';

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => navigation.navigate('ModalMusicPlayer')}
        style={styles.container}
      >
        <TouchableOpacity
          activeOpacity={gStyle.activeOpacity}
          hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
          onPress={this.toggleFavorite}
          style={styles.containerIcon}
        >
          <FontAwesome color={favoriteColor} name={favoriteIcon} size={20} />
        </TouchableOpacity>
        {song && (
          <View>
            <View style={styles.containerSong}>
              <Text style={styles.title}>{`${song.title} · `}</Text>
              <Text style={styles.artist}>{song.artist}</Text>
            </View>
            <View style={[gStyle.flexRowCenter, gStyle.mTHalf]}>
              <FontAwesome
                color={colors.brandPrimary}
                name="bluetooth-b"
                size={14}
              />
              <Text style={styles.device}>Caleb&apos;s Beatsx</Text>
            </View>
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
          <Text style={styles.title}>LOADING</Text>
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
  }
});

export default withNavigation(BarMusicPlayer);
