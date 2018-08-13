import React from "react";
import PropTypes from "prop-types";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  Text,
  View
} from "react-native";
import firebase from "react-native-firebase";
import update from "immutability-helper";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import TimeAgo from "react-native-timeago";
import { createStackNavigator } from "react-navigation";
import { connect } from "react-redux";
import mapStateToProps from "../reducers/stateToProps";
import { initFirebase } from "../actions";
import RootContainer from "../RootContainer";
import DeviceScreen from "./Device";
import { iOSUIKit } from "react-native-typography";
import createTheme from "../theme";
const theme = createTheme();

export class DevicesScreen extends React.Component {
  static propTypes = {};
  static defaultProps = {};
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      title: "Devices",
      ...theme.headers
    };
  };
  constructor(props) {
    super(props);
    this.state = {};
  }
  /*
  componentDidMount() {
    const { currentUser } = firebase.auth();

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
        console.log("got device readings", deviceId, deviceValues);
        this.setState(state =>
          update(state, { sensorData: { [deviceId]: { $set: deviceValues } } })
        );
      });
    });
  }
  */

  render() {
    //const { sensorSettings, sensorData } = this.props;
    console.log("currentProps", this.props);
    let sensorSettings = {};
    let sensorData = {};

    let data = Object.keys(this.props.devices.devices).map(key => {
      const device = this.props.devices.devices[key];
      device.deviceId = key;
      return device;
    }).sort((a,b)=>a.name.localeCompare(b.name));

    if (!data || data.length < 1) {
      return (
        <View
          style={{
            paddingTop: 5,
            //backgroundColor: "#EFEFF4",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            backgroundColor: theme.containerColor
          }}
        >
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View
        style={{
          paddingTop: 5,
          //backgroundColor: "#EFEFF4",
          height: 500,
          alignItems: "stretch",
          justifyContent: "flex-start",
          flex: 1,
          backgroundColor: theme.containerColor
        }}
      >
        <StatusBar barStyle="light-content" backgroundColor="#6a51ae" />
        <TableView>
          <Section {...theme.uiTable.section}>
            {data.map(item => {
              //console.log("rendering item", item.current);
              const temp =
                item.current && item.current.temp
                  ? Math.round(item.current.temp * 100) / 100
                  : "";
              const humidity =
                item.current && item.current.humidity
                  ? Math.round(item.current.humidity * 100) / 100
                  : "";
              const timestamp =
                item.current && item.current.timestamp
                  ? item.current.timestamp
                  : "";
              return (
                <Cell
                  {...theme.uiTable.cell}
                  key={item.deviceId}
                  onPress={e => {
                    console.log("cell pressed", item, this.props.navigation);
                    this.props.navigation.navigate("SingleDevice", {
                      device: item
                    });
                  }}
                  cellStyle={"Subtitle"}
                  title={item.name}
                  detail={
                    <TimeAgo
                      interval={1000}
                      time={new Date(timestamp * 1000)}
                    />
                  }
                  cellAccessoryView={
                    <View>
                      <Text style={iOSUIKit.subheadEmphasizedWhite}>
                        {temp} °C
                      </Text>
                      <Text style={iOSUIKit.caption2White}>{humidity} %</Text>
                    </View>
                  }
                />
              );
            })}
          </Section>
        </TableView>
      </View>
    );
  } //end render()
}
/*
* cellContentView={
									<View>
										<Text style={iOSUIKit.body}>{item.name}</Text>
										<Text style={iOSUIKit.subhead}>{temp}</Text>
										<Text style={iOSUIKit.subhead}>{humidity}</Text>
									</View>
								}
								*/

const mapDispatchToProps = dispatch => ({
  //fetchData: () => dispatch(fetchData()),
  //saveAlertField: ()=> dispatch()
});

const connectedDevicesScreen = connect(mapStateToProps, mapDispatchToProps)(
  DevicesScreen
);
const connectedDeviceScreen = connect(mapStateToProps, mapDispatchToProps)(
  DeviceScreen
);
export default createStackNavigator(
  {
    //Devices: DevicesScreen,
    Devices: connectedDevicesScreen,
    SingleDevice: connectedDeviceScreen
  },
  {
    headerMode: "float"
  }
);
