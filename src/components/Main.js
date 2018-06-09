import React from "react";
import PropTypes from "prop-types";
import { Text, View, StyleSheet } from "react-native";
import firebase from 'react-native-firebase';

export default class Main extends React.Component {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = { currentUser: null };
  }
	componentDidMount() {
		const { currentUser } = firebase.auth()
		this.setState({ currentUser })

		firebase.messaging().requestPermission()
			.then(() => {
				// User has authorised
			})
			.catch(error => {
				// User has rejected permissions
			});

		this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
			console.log("notification displayed")
			// Process your notification as required
			// ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
		});
		this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
			console.log("notification received")
			// Process your notification as required
		});
	}
	componentWillUnmount(){
		this.notificationDisplayedListener();
		this.notificationListener();

	}
  render() {
    const { currentUser } = this.state;
    return (
      <View style={styles.container}>
        <Text>Hi {currentUser && currentUser.uid}!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
