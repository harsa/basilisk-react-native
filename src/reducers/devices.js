import update from "immutability-helper";
import { DEVICE_READINGS_CHANGED, DEVICE_SETTINGS_CHANGED } from '../actions/actionTypes';

const initialState = {
	hello: 'hello redux world!',
	devices: {},
	history: {}
}
const reducer = (state = initialState, action)=>{

	switch (action.type){
		case DEVICE_SETTINGS_CHANGED:
			console.log("DEVICE_SETTINGS_CHANGED", action.payload)
			return update(state, {
				devices: {[action.deviceId]: {$set: action.payload}}
			})

		case DEVICE_READINGS_CHANGED:
			console.log("DEVICE_READINGS_CHANGED", action.payload)
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