import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import firebase from 'react-native-firebase';

export default class LoadingScreen extends React.Component {
	static propTypes = {

	}
	static defaultProps = {
	}
	constructor(props){
		super(props)
	}
	componentDidMount(){
		firebase.auth().onAuthStateChanged(user => {
			this.props.navigation.navigate(user ? 'Devices' : 'Login')
		})
	}
	render(){
		return <View><Text>Loading</Text></View>
	}
}