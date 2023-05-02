import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';
import ActionTypes from '../constants/actionTypes';
import { createLogger } from 'redux-logger';

const jwtChecker = (store) => (next) => (action) => {
  let result = next(action);
  if (
    action.type &&
    typeof action.type === 'string' &&
    action.type.includes('FAILURE') &&
    action.payload?.response &&
    action.payload?.response.status === 401
  ) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    result = next({ type: ActionTypes.AUTH_LOGOUT.SUCCESS });
  }
  return result;
};

const configureStore = (initialState) => {
  const middlewares = [thunk];
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  middlewares.push(createLogger({ collapsed: true }));

  const store = createStore(
    reducers,
    initialState,
    composeEnhancers(applyMiddleware(jwtChecker, ...middlewares)),
  );

  return store;
};

export default configureStore;
