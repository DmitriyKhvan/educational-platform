import { combineReducers } from 'redux';
import tutor from './tutor';
import students from './students';
import subscription from './subscription';
import appointment from './appointment';

export default combineReducers({
  students,
  tutor,
  subscription,
  appointment,
});
