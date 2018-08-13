import React from "react";
import PropTypes from "prop-types";
export const DataContext = React.createContext("data");
import firebase from 'react-native-firebase';
import update from "immutability-helper";
export default class DataProvider extends React.Component {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);

		this.state = {
			sensorData: {},
			sensorSettings: {},
			alerts: {},
			currentUser: null,
		};
  }
  loadInitialData(){
		const db = firebase.database();
		const { currentUser } = firebase.auth();
		db.ref("deviceSettings/" + currentUser.uid).on("child_added", snap => {
			const settings = snap.val();
			const deviceId = snap.key;
			console.log("got settings", settings);
			this.setState(state =>
											update(state, { sensorSettings: { [deviceId]: { $set: settings } } })
			);

			db.ref("devices/" + deviceId).on("value", snap => {
				let deviceValues = snap.val();
				console.log("got device readings", deviceId, deviceValues);
				this.setState(state =>
												update(state, { sensorData: { [deviceId]: { $set: deviceValues } } })
				);
			});
		});

		db.ref("alerts/" + currentUser.uid).on("value", snap => {
			let alertValues = snap.val();
			//console.log("got device readings", deviceId, deviceValues);
			this.setState(state =>
											update(state, { alerts:  { $set: alertValues }})
			);
		});

	}
	componentDidMount() {
		firebase.messaging().hasPermission()
			.then(enabled => {
				if (enabled) {
					// user has permissions
					console.log("notification permission already given")
				} else {
					// user doesn't have permission
					console.log("no notification permission detected")
				}
			});

		firebase.messaging().requestPermission()
			.then(() => {
				// User has authorised
				console.log("notification permission granted")
			})
			.catch(error => {
				// User has rejected permissions
				console.error("notification permission denied", error)
			});


  	console.log("componentDidMount")
		const { currentUser } = firebase.auth();
		if (!currentUser){
			firebase.auth().onAuthStateChanged((user)=>{
				console.log("authStateChanged", user)
				if (user){
					this.setState({currentUser: user}, ()=>{
						console.log("set currentuser to", user.email)
						this.loadInitialData();
					})
				} else {
					this.props.navigation.navigate('Login')
				}
			})
			return
		}
		this.setState(currentUser)

		this.loadInitialData();


	}

  render() {
  	const {sensorData, sensorSettings, currentUser, alerts} = this.state
  	const value = {
			db: firebase.database(),
			sensorData,
			sensorSettings,
			currentUser,
			alerts
		}

    return <DataContext.Provider  value={value}>{this.props.children}</DataContext.Provider>;
  }
}

