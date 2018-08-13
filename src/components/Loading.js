import React from 'react';
import { ProgressViewIOS, Text, View } from 'react-native';
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
		return <View style={{alignItems: 'center', height: '100%',justifyContent: 'center'}}>
			<Text>Loading...</Text>
		</View>
	}
}