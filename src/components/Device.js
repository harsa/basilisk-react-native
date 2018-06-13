import React from "react";
import PropTypes from "prop-types";
import { Text, View } from "react-native";
import { DataContext } from "./DataProvider";
import { iOSUIKit } from "react-native-typography";
import TimeAgo from "react-native-timeago";
import PureChart from 'react-native-pure-chart';
import moment from "moment";
export default class DeviceScreen extends React.Component {
  static propTypes = {};
  static defaultProps = {};
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("device", { name: "" }).name
    };
  };
  constructor(props) {
    super(props);
  }
  render() {
    const deviceId = this.props.navigation.getParam("device", { deviceId: "" })
      .deviceId;

    const deviceSettings = this.props.devices.devices[deviceId];

    if (!(deviceSettings && deviceSettings.current ) ) return null;

    console.log("rendering settings", deviceSettings);

    const temp = Math.round(deviceSettings.current.temp * 1000) / 1000 || "";
    const humidity =
      Math.round(deviceSettings.current.humidity * 1000) / 1000 || "";
    const timestamp = deviceSettings.current.lastTimestamp;

		let sampleData = [30, 200, 170, 250, 10]


    return (
      <View style={{ alignItems: "center", flex: 1, paddingTop: 20 }}>
        <View style={{ flexDirection: "row" }}>
          <Text>Latest measurement at </Text>
          <Text>{moment(timestamp * 1000).format("D.M.YYYY HH:mm:ss")}</Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "flex-end",
            width: "100%",
            marginTop: 20
          }}
        >
          <View>
            <Text style={iOSUIKit.largeTitleEmphasized}>{temp} °C</Text>
            <Text>Temperature</Text>
          </View>
          <View>
            <Text style={iOSUIKit.title3Emphasized}>{humidity} %</Text>
            <Text>Humidity</Text>
          </View>
        </View>
        <View>
          {Object.keys(this.props.devices.history[deviceId]).map(key => this.props.devices.history[deviceId][key]).map((reading, key )=> {
            console.log("renderReading", reading)
            return <View key={key}><Text> {reading.temp}</Text></View>
          })}
        </View>
      </View>
    );
  }
}
