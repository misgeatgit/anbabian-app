import { combineReducers, createStore } from 'redux';
import AudioBookReducer from './data/AudioBookReducer';

const reducer = combineReducers({
  // Add reducers here.
  audioBook: AudioBookReducer
});

const store = createStore(reducer);

export default store;
