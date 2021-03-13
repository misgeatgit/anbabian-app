import store from '../Redux';
import {
  AUDIO_SELECTED,
  AUDIO_LOADED,
  BOOK_SELECTED,
  PLAY_PAUSE_STATUS,
  UPDATE_PLAY_TIME
} from '../ActionTypes';

const audioSelected = isSelected => {
  store.dispatch({
    type: AUDIO_SELECTED,
    audioSelected: isSelected
  });
};

const audioLoaded = isLoaded => {
  store.dispatch({
    type: AUDIO_LOADED,
    audioLoaded: isLoaded
  });
};
const bookSelected = (isSelected, book) => {
  store.dispatch({
    type: BOOK_SELECTED,
    message: {
      bookSelected: isSelected,
      book
    }
  });
};
const isPlaying = playing => {
  store.dispatch({
    type: PLAY_PAUSE_STATUS,
    isPlaying: playing
  });
};
const updatePlayTime = time => {
  store.dispatch({
    type: UPDATE_PLAY_TIME,
    currentTime: time
  });
};

export { audioSelected, audioLoaded, bookSelected, isPlaying, updatePlayTime };
