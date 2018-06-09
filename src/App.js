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
import DataProvider from "./components/DataProvider";
import LoginDialog from "./components/Login";
import NavigationService from "./components/NavigationService";
import RootNavigator from "./RootNavigator";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sensorData: {},
      sensorSettings: {},
      navigator: null
    };
  }
  componentDidMount() {
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
      <DataProvider navigator={this.state.navigator}>
        <RootNavigator
					persistenceKey={"NavigationState"}
          ref={navigatorRef => {
            //this.setState({navigator, navigatorRef})
          }}
        />
      </DataProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  logo: {
    height: 80,
    marginBottom: 16,
    marginTop: 32,
    width: 80
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  },
  modules: {
    margin: 20
  },
  modulesHeader: {
    fontSize: 16,
    marginBottom: 8
  },
  module: {
    fontSize: 14,
    marginTop: 4,
    textAlign: "center"
  }
});
