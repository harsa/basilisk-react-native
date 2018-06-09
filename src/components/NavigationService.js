import { NavigationActions } from 'react-navigation';
import React from 'react';

export default class NavigationService extends React.Component {
	constructor(props){
		super(props)
		NavigationService._navigator = null
	}
	static _navigator;

	static setTopLevelNavigator(navigatorRef) {
		NavigationService._navigator = navigatorRef;
	}

	static navigate(routeName, params) {
		console.log("navigator", NavigationService._navigator)
		NavigationService._navigator.dispatch(
			NavigationActions.navigate({
																	 routeName,
																 })
		);
	}

}
