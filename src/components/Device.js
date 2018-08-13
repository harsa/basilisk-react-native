import moment from "moment";
import React from "react";
import { ActivityIndicator, SegmentedControlIOS, Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";
import { Line, VictoryAxis, VictoryChart, VictoryLine, VictoryZoomContainer } from "victory-native";
import { STATE_INITIAL } from "../reducers/devices";
import createTheme from "../theme";

const theme = createTheme();
/**
 *
 * @param length of the domain in seconds
 * @param end unix timestamp of the end seconds
 */
function getTimeDomain(end, length = 0) {
  const start = length ? end - length : 0;
  return [start, end];
}
export default class DeviceScreen extends React.Component {
  static propTypes = {};
  static defaultProps = {};

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("device", { name: "" }).name,
      ...theme.headers
    };
  };

  constructor(props) {
    super(props);
    const currentTimestamp = Math.round(new Date().getTime() / 1000);
    this.state = {
      graphHeight: 0,
      currentTimestamp,
      currentZoomDomain: null,
      selectedIndex: 0
    };
  }
  render() {
    const styles = {
      axisOne: {
        axis: { stroke: "transparent" },
        axisLabel: { fontSize: 20, padding: 30 },
        grid: {
          stroke: t => "transparent"
        },
        ticks: { stroke: "#525252", size: 5 },
        tickLabels: { fontSize: 13, padding: 5, fill: "#ffffff" }
      },
      axisTwo: {
        axis: { stroke: "transparent" },
        axisLabel: { fontSize: 20, padding: 30 },
        grid: {
          stroke: t => "transparent"
        },
        ticks: { stroke: "#525252", size: 5 },
        tickLabels: { fontSize: 13, padding: 5, fill: "#ffffff" }
      }
    };

    const deviceId = this.props.navigation.getParam("device", { deviceId: "" })
      .deviceId;

    const deviceSettings = this.props.devices.devices[deviceId];

    const domainPresets = [
      {
        label: "8h",
        length: 60 * 60 * 8
      },
      {
        label: "1h",
        length: 60 * 60
      },
      {
        label: "30min",
        length: 60 * 30
      },
      {
        label: "10min",
        length: 60 * 10
      }
    ];

    if (!(deviceSettings && deviceSettings.current)) return null;

    const currentTimestamp = this.state.currentTimestamp;
    const currentTimeDomain = getTimeDomain(currentTimestamp, 60 * 60);

    const temp = Math.round(deviceSettings.current.temp * 1000) / 1000 || "";
    const humidity =
      Math.round(deviceSettings.current.humidity * 1000) / 1000 || "";
    const timestamp = deviceSettings.current.timestamp;

    let readings = [];

    if (this.props.devices.history[deviceId]) {
      readings = Object.keys(this.props.devices.history[deviceId]).map(
        key => this.props.devices.history[deviceId][key]
      );
    }


    const d = readings.map(r => ({ x: r.timestamp, y: r.temp }));

    let { currentZoomDomain: zoomDomain } = this.state;

    if (!zoomDomain) {
      const domainLength = domainPresets[this.state.selectedIndex].length;
      zoomDomain = {
        x: getTimeDomain(Math.round(new Date().getTime() / 1000), domainLength),
        y: [deviceSettings.temp.min, deviceSettings.temp.max]
      };
    }

    const domain = {
      y: [deviceSettings.temp.min, deviceSettings.temp.max],
      x: [currentTimestamp - 60 * 60 * 8, currentTimestamp]
    };

    return (
      <View
        style={{
          backgroundColor: theme.containerColor,
          alignItems: "center",
          flex: 1,
          paddingTop: 20
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text style={{ color: theme.textColor }}>Measured at </Text>
          <Text style={{ color: theme.textColor }}>
            {moment(timestamp * 1000).format("D.M.YYYY HH:mm:ss")}
          </Text>
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
            <Text style={iOSUIKit.largeTitleEmphasizedWhite}>{temp} °C</Text>
            <Text style={iOSUIKit.footnoteWhite}>Temperature</Text>
          </View>
          <View>
            <Text style={iOSUIKit.title3EmphasizedWhite}>{humidity} %</Text>
            <Text style={iOSUIKit.footnoteWhite}>Humidity</Text>
          </View>
        </View>
        <View style={{ width: "100%", padding: 20, paddingBottom: 0 }}>
          <SegmentedControlIOS
            tintColor={theme.activeColor}
            values={domainPresets.map(p => p.label)}
            selectedIndex={this.state.selectedIndex}
            onChange={event => {
              this.setState({
                selectedIndex: event.nativeEvent.selectedSegmentIndex,
                currentZoomDomain: null
              });
            }}
          />
        </View>
        <View
          style={{ flex: 1 }}
          onLayout={event => {
            const { x, y, width, height } = event.nativeEvent.layout;

            this.setState({ graphHeight: height });
          }}
        >
          {d && d.length > 10 ? (
            <VictoryChart
              padding={{ top: 0, left: 0, right: 0, bottom: 0 }}
              domain={domain}
              domainPadding={{ x: [0, 0], y: 0 }}
              containerComponent={
                <VictoryZoomContainer
                  zoomDimension="x"
                  allowZoom={true}
                  downsample={150}
                  minimumZoom={{ x: 60 * 60, y: 5 }}
                  onZoomDomainChange={(domain, props) => {
                    console.log(
                      "zooming to",
                      (domain.x[1] - domain.x[0]) / 60 / 60
                    );
                    this.setState({ currentZoomDomain: domain });
                  }}
                  zoomDomain={zoomDomain}
                />
              }
              height={this.state.graphHeight}
            >
              <VictoryAxis
                offsetX={375}
                orientation={"right"}
                tickCount={10}
                dependentAxis
                style={styles.axisTwo}
              />
              <VictoryAxis
                orientation={"top"}
                offsetY={this.state.graphHeight}
                style={styles.axisOne}
                fixLabelOverlap
                tickFormat={value => {
                  const m = moment(value * 1000);
                  return m.format("HH:mm:ss");
                }}
                standAlone={false}
                scale="time"
                gridComponent={<GridComponent />}
              />
              <VictoryLine
                data={d}
                style={{ data: { stroke: theme.activeColor, strokeWidth: 2 } }}
                interpolation="natural"
              />
            </VictoryChart>
          ) : (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1
              }}
            >
              <Text style={iOSUIKit.caption2White}>
                No history data has been recorded yet.
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}

export class GridComponent extends React.Component {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
  }
  render() {
    const { style, height, ...rest } = this.props;
    const s = Object.assign(style, { height: 100 });
    return <Line style={s} height={100} {...rest} />;
  }
}
