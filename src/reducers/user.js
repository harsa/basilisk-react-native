import update from "immutability-helper";
import { USER_RECEIVE } from '../actions/actionTypes';

const initialState = {
	user: null
}

export default (state = initialState, action)=>{

	switch (action.type){
		case USER_RECEIVE:
			return update(state, {user: {$set: action.payload}})
	}

	return state

}