import { combineReducers } from 'redux';
import snapshot from './fuelSavingsReducer';
import { connectRouter } from 'connected-react-router'

const rootReducer = history => combineReducers({
  router: connectRouter(history),
  snapshot,
});

export default rootReducer;
