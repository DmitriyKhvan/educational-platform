import { combineReducers } from 'redux';
import tutor from './tutor';
import appointment from './appointment';

export default combineReducers({
  tutor,
  appointment,
});
