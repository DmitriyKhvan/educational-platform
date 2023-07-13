import { combineReducers } from 'redux';
import tutor from './tutor';
import subscription from './subscription';
import appointment from './appointment';

export default combineReducers({
  tutor,
  subscription,
  appointment,
});
