import { combineReducers } from 'redux';
import auth from './auth';
import settings from './settings';
import users from './users';
import admin from './admin';
import tutor from './tutor';
import message from './message';
import students from './students';
import subscription from './subscription';
import appointment from './appointment';
import notification from './notification';

export default combineReducers({
  auth,
  settings,
  users,
  admin,
  students,
  tutor,
  message,
  subscription,
  appointment,
  notification,
});
