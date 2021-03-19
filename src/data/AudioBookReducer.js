import {
  AUDIO_SELECTED,
  AUDIO_LOADED,
  BOOK_SELECTED,
  BOOKS_LOADED,
  PLAY_PAUSE_STATUS,
  UPDATE_PLAY_TIME
} from '../ActionTypes';

// States shared by playback screens
const INITIAL_STATE = {
  bookSelected: false,
  audioSelected: false,
  selectedBook: {
    author: '',
    title: '',
    synopsis: ''
  },
  selectedAudio: {
    isLoaded: false,
    isPlaying: false,
    currentTime: 0
  },
  books: []
};

const AudioBookReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUDIO_SELECTED:
      return { ...state, audioSelected: action.audioSelected };
    case AUDIO_LOADED:
      return {
        ...state,
        selectedAudio: {
          ...state.selectedAudio,
          isLoaded: action.audioLoaded
        }
      };
    case BOOK_SELECTED:
      return {
        ...state,
        bookSelected: action.message.bookSelected,
        selectedBook: { ...action.message.book }
      };
    case BOOKS_LOADED:
      return { ...state, books: action.books };
    case PLAY_PAUSE_STATUS:
      return {
        ...state,
        selectedAudio: {
          ...state.selectedAudio,
          isPlaying: action.isPlaying
        }
      };
    case UPDATE_PLAY_TIME:
      return {
        ...state,
        selectedAudio: {
          ...state.selectedAudio,
          currentTime: action.currentTime
        }
      };
    default:
      return state;
  }
};

export default AudioBookReducer;
