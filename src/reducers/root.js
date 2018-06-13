/*

devices
alerts,
user,



*/

import { combineReducers } from "redux";
import devicesReducer from "./devices";
import alertsReducer from "./alerts";
import userReducer from './user'

// Root Reducer
const rootReducer = combineReducers({
  devices: devicesReducer,
  alerts: alertsReducer,
  user: userReducer
});

export default rootReducer;
