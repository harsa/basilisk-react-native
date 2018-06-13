import React from 'react';
import PropTypes from 'prop-types';
import RootNavigator from './RootNavigator';

export default class RootContainer extends React.Component {
	static propTypes = {

	}
	static defaultProps = {
	}
	constructor(props){
		super(props)
	}
	render(){
		//console.log("currentProps", this.props)
		//persistenceKey={"NavigationState"}
		return <RootNavigator

			{...this.props}
			ref={navigatorRef => {
				//this.setState({navigator, navigatorRef})
			}}
		/>
	}
}