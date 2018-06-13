import firebase from "react-native-firebase";
// Redux Store Configuration
import { createStore, applyMiddleware } from 'redux';

import thunk from 'redux-thunk';
import rootReducer from '../reducers/root';
import loggingMiddleware from './middleware/logging';

const configureStore = () => {
	//const middleware = applyMiddleware(thunk, loggingMiddleware, firMiddleware(firebase));
	const middleware = applyMiddleware(thunk, loggingMiddleware);
	return createStore(rootReducer, middleware);
};
const store = configureStore()

export default store;