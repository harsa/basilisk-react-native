import React from "react";
import {
  StyleSheet,
  Platform,
  Image,
  Text,
  View,
  ScrollView
} from "react-native";

import firebase from "react-native-firebase";
import { Provider } from 'react-redux';
import { initFirebase } from './actions';
import DataProvider from "./components/DataProvider";
import LoginDialog from "./components/Login";
import NavigationService from "./components/NavigationService";
import RootContainer from './RootContainer';
import RootNavigator from "./RootNavigator";
import configureStore from './store/configureStore';
import { connect } from 'react-redux';

import mapStateToProps from './reducers/stateToProps'
const mapDispatchToProps = (dispatch) => ({
	initFirebase: ()=> dispatch(initFirebase())
	//fetchData: () => dispatch(fetchData()),
	//saveAlertField: ()=> dispatch()
});


 export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sensorData: {},
      sensorSettings: {},
      navigator: null
    };
		this.store = configureStore;
  }
  componentDidMount() {
    //this.props.initFirebase();
    this.store.dispatch(initFirebase(this.store))

    const { currentUser } = firebase.auth();
    if (!currentUser) {
      return;
    }

    const db = firebase.database();
    db.ref("deviceSettings/" + currentUser.uid).on("child_added", snap => {
      const settings = snap.val();
      const deviceId = snap.key;
      console.log("got settings", settings);
      this.setState(state =>
        update(state, { sensorSettings: { [deviceId]: { $set: settings } } })
      );

      db.ref("devices/" + deviceId).once("value", snap => {
        let deviceValues = snap.val();
        /*
				deviceValues = Object.assign(deviceValues, {
					timestamp
				})
				*/
        console.log("got device readings", deviceId, deviceValues);
        this.setState(state =>
          update(state, { sensorData: { [deviceId]: { $set: deviceValues } } })
        );
      });
    });
  }

  render() {
    return (
			<Provider store={this.store}>
        <ConnectedRoot/>
      </Provider>
    );
  }
}
const ConnectedRoot =  connect(
	mapStateToProps,
	mapDispatchToProps,
)(RootContainer);