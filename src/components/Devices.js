import React from "react";
import PropTypes from "prop-types";
import { FlatList, Text, View } from "react-native";
import firebase from "react-native-firebase";
import update from "immutability-helper";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import TimeAgo from "react-native-timeago";
import { createStackNavigator } from "react-navigation";
import DeviceScreen from "./Device";
import { DataContext } from "./DataProvider";
import { iOSUIKit } from "react-native-typography";
export class DevicesScreen extends React.Component {
  static propTypes = {};
  static defaultProps = {};
  static navigationOptions = {};
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
    //[{key: 'a'}, {key: 'b'}]

    return (
      <DataContext.Consumer>
        {context => {
          const { sensorSettings, sensorData } = context;
          console.log("context", context);

          let data;

          data = Object.keys(sensorSettings)
            .map(key => {
              const setting = Object.assign(
                { deviceId: key },
                sensorSettings[key]
              );
              return setting;
            })
            .map(setting => {
              const readings = sensorData[setting.deviceId];
              const r = update(setting, { current: { $set: readings } });
              //console.log("rrrr", setting.deviceId, readings);
              return r;
            });

          return (
            <View
              style={{
                paddingTop: 5,
                backgroundColor: "#EFEFF4",
                height: 500,
                alignItems: "stretch",
                justifyContent: "flex-start",
                flex: 1
              }}
            >
              <TableView>
                <Section>
                  {data.map(item => {
                    console.log("rendering item", item.current);
                    const temp =
                      item.current && item.current.temp
                        ? Math.round(item.current.temp * 100) / 100
                        : "";
                    const humidity =
                      item.current && item.current.humidity
                        ? Math.round(item.current.humidity * 100) / 100
                        : "";
                    const timestamp =
                      item.current && item.current.lastTimestamp
                        ? item.current.lastTimestamp
                        : "";
                    return (
                      <Cell
                        key={item.deviceId}
                        onPress={e => {
                          console.log(
                            "cell pressed",
                            item,
                            this.props.navigation
                          );
                          this.props.navigation.navigate("SingleDevice", {device: item});
                        }}
                        cellStyle={"Subtitle"}
                        title={item.name}
                        detail={<TimeAgo interval={1000} time={new Date(timestamp * 1000)} />}
                        cellAccessoryView={
                          <View>
														<Text style={iOSUIKit.subheadEmphasized}>{temp} °C</Text>
                            <Text style={iOSUIKit.caption2}>{humidity} %</Text>
                          </View>
                        }
                      />
                    );
                  })}
                </Section>
              </TableView>
            </View>
          );
        }}
      </DataContext.Consumer>
    );
  }
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

export default createStackNavigator(
  {
    Devices: DevicesScreen,
    SingleDevice: DeviceScreen
  },
  {
    headerMode: "float"
  }
);
