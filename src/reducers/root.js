/*

devices
alerts,
user,



*/

import { combineReducers } from 'redux';
import devicesReducer from './devices';

// Root Reducer
const rootReducer = combineReducers({
																			devices: devicesReducer,
																		});

export default rootReducer;