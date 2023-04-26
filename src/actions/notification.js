import ActionTypes from '../constants/actionTypes';

export const setNotification = (message) => ({
  type: ActionTypes.ADD_NOTIFICATION,
  payload: message,
});

export const readNotification = (id) => ({
  type: ActionTypes.READ_NOTIFICATION,
  payload: id,
});

export const deleteAllNotification = () => ({
  type: ActionTypes.DELETE_ALL_NOTIFICATION,
});
