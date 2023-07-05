import { combineReducers } from 'redux';
import settings from './settings';
import tutor from './tutor';
import students from './students';
import subscription from './subscription';
import appointment from './appointment';

export default combineReducers({
  settings,
  students,
  tutor,
  subscription,
  appointment,
});
