import React from "react";
import PropTypes from "prop-types";
import {
	Button,
	PickerIOS, ScrollView,
	SegmentedControlIOS,
	Switch,
	Text,
	TextInput,
	View,
} from "react-native";
import { createStackNavigator } from "react-navigation";
import { DataContext } from "./DataProvider";
import { iOSUIKit } from "react-native-typography";
import update from "immutability-helper";
import Picker from "react-native-picker";
import firebase from "react-native-firebase";
import { Cell, Section, TableView } from "react-native-tableview-simple";
export class AlertsScreen extends React.Component {
  static propTypes = {};
  static defaultProps = {};
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      title: "Alerts",
      headerRight: (
        <Button onPress={() => navigation.navigate("AlertEdit")} title="New" />
      )
    };
  };
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <DataContext.Consumer>
        {context => {
          const { alerts } = context;
          return (
            <View>
              <TableView>
                <Section>
                  {Object.keys(alerts)
                    .map(key => {
                      const alert = alerts[key];
                      alert.id = key;
                      return alert;
                    })
                    .map(alert => {
                      console.log("interating alert", alert);
                      return (
                        <Cell
                          accessory="DisclosureIndicator"
                          key={alert.id}
                          onPress={() => {
                            this.props.navigation.navigate("AlertEdit", {
                              alertId: alert.id
                            });
                          }}
                          title={alert.name}
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
export class EditAlertScreen extends React.Component {
  static navigationOptions = props => {
    console.log("navigationprops", props.navigation);
    const alertId = props.navigation.getParam("alertId", null);
    if (alertId) {
      return { title: "Edit Alert" };
    } else {
      return { title: "New Alert" };
    }
  };
  constructor(props) {
    super(props);

    this.state = {
      alert: {
        name: "",
        message: "",
        alertId: null,
        triggered: null,
        notificationsEnabled: true
      },
      rules: {}
    };
  }
  saveAlertField(fieldName, value) {
    this.setState(
      update(this.state, {
        alert: { [fieldName]: { $set: value } }
      }),
      () => {
        //get uid
        const uid = firebase.auth().currentUser.uid;
        const alertId = this.props.navigation.getParam("alertId", null);
        if (alertId) {
          firebase
            .database()
            .ref("alerts/" + uid + "/" + alertId + "/" + fieldName)
            .set(value);
        }

        console.log("saving to user alerts at", uid);
      }
    );
  }
  saveRuleField(fieldName, ruleId, value) {
    console.log("saveRuleField", fieldName, ruleId, value)
		this.setState(
			update(this.state, {
				  rules: {
            [ruleId]: {
              [fieldName]: { $set: '' }
            }
				  }
			}),
			() => {
				//get uid
				const uid = firebase.auth().currentUser.uid;
				const alertId = this.props.navigation.getParam("alertId", null);
				if (alertId) {
					firebase
						.database()
						.ref("alerts/" + uid + "/" + alertId + "/rules/" + ruleId + '/' + fieldName)
						.set(value);
				}

				console.log("saving to user alerts at", uid);
			}
		);
  }
  saveNewAlert() {}
  static showDevicePicker(devices) {
    const data = [devices, ["Temperature", "Humidity"]];
    Picker.init({
      pickerData: data,
      pickerTitleText: "Select device and sensor",
      selectedValue: ["foo", "Temperature"],
      onPickerConfirm: data => {
        console.log(data);
      },
      onPickerCancel: data => {
        console.log(data);
      },
      onPickerSelect: data => {
        console.log(data);
      }
    });

    Picker.show();
  }
  componentDidMount() {}
  render() {
    const alertId = this.props.navigation.getParam("alertId", { alertId: "" });

    return (
      <DataContext.Consumer>
        {context => {
          const { alerts, sensorSettings } = context;
          let { alert } = this.state;

          if (alerts[alertId]) {
            alert = alerts[alertId];
          }

          let rules = [
            {
              id: "new",
              deviceName: "",
              kind: "",
              name: "New rule"
            }
          ];
          if (alert && alert.rules) {
            rules = Object.keys(alert.rules).map(key => {
              console.log("getting rule for key", key);
              const rule = alert.rules[key];
              rule.id = key;
              rule.deviceName = "";
              try {
                rule.deviceName = sensorSettings[rule.deviceId].name;
              } catch (e) {}

              return rule;
            });
          }
          console.log("created rules", rules);

          const labelStyle = Object.assign({}, { width: 70 });
          const devices = Object.keys(sensorSettings)
            .map(key => sensorSettings[key])
            .map(device => device.name);
          return (
            <ScrollView>
            <View>
              <TableView>
                {rules.map((rule, ruleKey) => {
                  console.log("got rule", rule);
                  return (
                    <View key={ruleKey}>
                      <RuleComponent
                        rule={rule}
                        devices={devices}
                        saveRuleField={(fieldName, ruleId, value) => {
                          //console.log("rulefield changed", fieldName, ruleId, value)
                          this.saveRuleField(fieldName, ruleId, value);
                        }}
                      />
                      <Section header={"Push message"}>
                        <Cell
                          cellContentView={
                            <View
                              style={{
                                backgroundColor: "white",
                                alignItems: "center",
                                flexDirection: "row"
                              }}
                            >
                              <Text style={labelStyle}>Title</Text>
															<ScrollView
																scrollEnabled={false}>
                              <TextInput
																returnKeyType={'next'}
                                value={alert.name}
                                style={{ width: "100%" }}
                                onChangeText={text => {
                                  console.log("text changed", text);
                                  this.saveAlertField("name", text);
                                }}
                              /></ScrollView>
                            </View>
                          }
                        />

                        <Cell
                          cellContentView={
                            <View
                              style={{
                                backgroundColor: "white",
                                alignItems: "center",
                                flexDirection: "row"
                              }}
                            >
                              <Text style={labelStyle}>Body</Text>
                              <TextInput
																returnKeyType={'next'}
                                multiline
                                value={alert.message}
                                onChangeText={text => {
                                  console.log("text changed", text);
                                  this.saveAlertField("message", text);
                                }}
                                style={{ width: "100%" }}
                              />
                            </View>
                          }
                        />
                        <Cell
                          title="Notifications disabled"
                          cellContentView={
                            <Text
                              style={Object.assign({ flex: 1 }, labelStyle)}
                            >
                              Notifications disabled
                            </Text>
                          }
                          cellAccessoryView={
                            <Switch
                              onValueChange={value => {
                                this.saveAlertField(
                                  "notificationsEnabled",
                                  value
                                );
                              }}
                              value={alert.notificationsEnabled}
                            />
                          }
                        />
                      </Section>
                    </View>
                  );
                })}
              </TableView>
            </View></ScrollView>
          );
        }}
      </DataContext.Consumer>
    );
  }
}

export class RuleComponent extends React.Component {
  static propTypes = {
    key: PropTypes.string,
    rule: PropTypes.object,
    devices: PropTypes.object
  };
  static defaultProps = {
    key: 0,
    rule: {},
    devices: {}
  };
  constructor(props) {
    super(props);
    this.state = {
      rule: {
        deviceName: "",
        kind: "",
        threshold: "",
        value: "",
        operation: ""
      }
    };
  }
  componentWillReceiveProps(props) {
    if (props.rule) {
      console.log("setting rule", props.rule);
      this.setState({ rule: props.rule });
    }
  }
  componentDidMount() {}
  render() {

    const ruleKey = this.props.key;
    const { devices, saveRuleField } = this.props;
    let { rule } = this.state;

    console.log("rendering rule", rule);
    const unit = "°C";
    const value = rule ? rule.value : null

    return (
      <Section header={"Rule #" + (ruleKey + 1)}>
        <Cell
          onPress={() => {
            EditAlertScreen.showDevicePicker(devices);
          }}
          key={rule.id}
          title={
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontWeight: "bold" }}>{rule.deviceName}</Text>
              <Text> - </Text>
              <Text style={{ fontWeight: "bold" }}>{rule.kind}</Text>
            </View>
          }
        />
        <View style={{ margin: 20 }}>
          <SegmentedControlIOS
            values={["Less than", "More than", "Between"]}
            selectedIndex={0}
            onChange={event => {
              const operations = ['lt', 'gt', 'bt']
              saveRuleField('operation', rule.id, operations[event.nativeEvent.selectedSegmentIndex])
              //this.setState({selectedIndex: event.nativeEvent.selectedSegmentIndex});
            }}
          />
        </View>
        <Cell
          cellContentView={
            <View style={{ flexDirection: "row" }}>
              <TextInput onChangeText={(text)=>{
								saveRuleField('value',rule.id, text)
              }} returnKeyType={'next'} value={value + ""} keyboardType={'decimal-pad'} />
              <Text>{unit}</Text>
            </View>
          }
        />
      </Section>
    );
  }
}
export default createStackNavigator(
  {
    AlertsAll: AlertsScreen,
    AlertEdit: EditAlertScreen
  },
  {
    mode: "modal",
    headerMode: "float"
  }
);
