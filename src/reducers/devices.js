import update from "immutability-helper";
import { DEVICE_HISTORY_RECEIVED, DEVICE_READINGS_CHANGED, DEVICE_SETTINGS_CHANGED } from '../actions/actionTypes';

export const STATE_INITIAL = 'STATE_INITIAL';
export const STATE_LOADED = 'STATE_LOADED';

const initialState = {
	devices: {},
	history: {},
	historyState: STATE_INITIAL
}
const reducer = (state = initialState, action)=>{

	switch (action.type){
		case DEVICE_SETTINGS_CHANGED:
			console.log("DEVICE_SETTINGS_CHANGED", action.payload)
			return update(state, {
				devices: {[action.deviceId]: {$set: action.payload}}
			})

		case DEVICE_HISTORY_RECEIVED:
			console.log("updating history with", action)
			return update(state, {
				history: {$set: action.payload},
				historyState: {$set: STATE_LOADED}
			})

		case DEVICE_READINGS_CHANGED:
			console.log("DEVICE_READINGS_CHANGED", action.payload)

			const measurements = state.history[action.deviceId];
			if ( measurements) {
				for (let i = 0; i < measurements.length; i++) {
					const measurement = measurements[i]
					if (i < 1) break;
					const prevMeasurement = measurements[i - 1];

					if (measurement.timestamp < prevMeasurement.timeStamp) {
						console.error('device reading added out of order', measurement, measurement.timestamp, prevMeasurement.timeStamp)
					}

				}
			}
			if (state.devices[action.deviceId]){
				const s = update(state, {
					devices: {[action.deviceId]: {current: {$set: action.payload}}}
				})

				if (s.history[action.deviceId]){
					return update(s, {
						history: {[action.deviceId]: {$push: [action.payload]}}
					})
				} else {
					return update(s, {
						history: {[action.deviceId]: {$set: [action.payload]}}
					})
				}

			} else {
				/*
				return update(state, {
					devices: {[action.deviceId]: {$set: action.payload}}
				})
				*/
				console.error("reading arrived before settings for device", action.deviceId)
			}

	}

	return state;
}
export default reducer