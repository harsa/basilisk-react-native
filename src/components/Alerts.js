import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  PickerIOS,
  ScrollView,
  SegmentedControlIOS,
  Switch,
  Text,
  TextInput,
  View
} from "react-native";
import TimeAgo from 'react-native-timeago';
import { createStackNavigator } from "react-navigation";
import { connect } from "react-redux";
import {
	alertDelete,
	alertEdit,
	alertFieldChange,
	alertNew,
	alertRuleFieldChange,
	alertRuleSave,
	alertSave,
} from "../actions";
import mapStateToProps from "../reducers/stateToProps";
import { iOSUIKit } from "react-native-typography";
import update from "immutability-helper";
import Picker from "react-native-picker";
import firebase from "react-native-firebase";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import configureStore from "../store/configureStore";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import createTheme from '../theme';
const theme = createTheme()
const labelStyle = Object.assign({ color: theme.textColorMuted}, { width: 100 });
const sensorMapping = [["temp", "Temperature"], ["humidity", "Humidity"]];
const sensorKeys = {
	temp: 'Temperature',
	humidity: 'Humidity'
}
export class AlertsScreen extends React.Component {
  static propTypes = {};
  static defaultProps = {};
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      title: "Alerts",
      headerRight: (
        <Button onPress={() => navigation.navigate("AlertEdit")} color={theme.activeColor} title="New" />
      ),
			...theme.headers
    };
  };
  constructor(props) {
    super(props);
  }
  componentDidMount(){
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

	}

  render() {
    const { alerts } = this.props.alerts;
    console.log("rendering with props3", alerts);
    return (
      <View style={{backgroundColor: theme.containerColor, flex: 1}}>

        <TableView>
          <Section {...theme.uiTable.section }>
            {Object.keys(alerts)
              .map(key => {
                const alert = alerts[key];
                alert.id = key;
                return alert;
              })
							.sort((a,b)=>a.name.localeCompare(b.name))
              .map(alert => {
                console.log("iterating alert", alert);

                const cellStyle = Object.assign({}, theme.uiTable.cell, {
                })

                if (alert.triggered){
                  //cellStyle.backgroundColor = theme.warningBackgroundColor
                  //cellStyle.titleTextColor = theme.warningColor;
                }

                return (
                  <Cell
                    key={alert.id}
										cellStyle="RightDetail"
										accessory="DisclosureIndicator"
                    detail={alert.triggered ? <Icon name={'exclamation'} size={20} color={theme.warningBackgroundColor} /> : null}
                    onPress={() => {
                      this.props.navigation.navigate("AlertEdit", {
                        alertId: alert.id
                      });
                    }}
                    title={alert.name}
                    {...cellStyle}
                  />
                );
              })}
          </Section>
        </TableView>
      </View>
    );
  }
}

export class EditAlertScreen extends React.Component {
  static navigationOptions = props => {
    const store = configureStore;


    console.log("navigationprops", props.navigation);
    const alertId = props.navigation.getParam("alertId", null);
    if (alertId) {
      return { title: "Edit Alert",
				headerRight: (
					<Button
						onPress={()=>{
							store.dispatch(alertDelete())
							props.navigation.navigate('AlertsAll')

						}}
            color={theme.dangerColor}
						title="Delete"
					/>
				),
				...theme.headers};
    } else {
      return {
        title: "New Alert",
				headerRight: (
					<Button
						onPress={()=>{
						  store.dispatch(alertSave())
              props.navigation.navigate('AlertsAll')
            }}
						color={theme.activeColor}
						title="Done"
					/>
				),...theme.headers
      };
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

  componentWillUnmount(){
		const alertId = this.props.navigation.getParam("alertId", null);
    if (this.props.alerts.currentAlert && alertId){
			this.props.alertSave();
    }
  }
  saveAlertField(fieldName, value) {
    this.props.alertFieldChange(fieldName, value);
    /*
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
    */
  }
  saveRuleField(ruleId, fieldName, value) {
    console.log("saveRuleField", ruleId, fieldName, value);
    this.props.ruleFieldChange(ruleId, fieldName, value);
    return;
    this.setState(
      update(this.state, {
        rules: {
          [ruleId]: {
            [fieldName]: { $set: "" }
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
            .ref(
              "alerts/" +
                uid +
                "/" +
                alertId +
                "/rules/" +
                ruleId +
                "/" +
                fieldName
            )
            .set(value);
        }

        console.log("saving to user alerts at", uid);
      }
    );
  }
  static showDevicePicker(devices, options = {}) {
    console.log("showing picker", devices);
    const deviceNames = devices.map(device => device[1]);

    const sensorNames = sensorMapping.map(sensor => sensor[1]);

    const data = [deviceNames, sensorNames];
    const selectedDeviceName =
      deviceNames[
        devices.map(device => device[1]).indexOf(options.selected[0])
      ];
    const selectedSensorName = sensorMapping
      .map(sensor => sensor[1])
      .indexOf(options.selected[1]);
    //const selection = [devices.map(device => device[0]).indexOf(options.selection[0])]

    console.log("init picker3", selectedSensorName, options.selected);
    Picker.init({
      pickerData: data,
      pickerTitleText: "Select device and sensor",
      //pickerTitleText: selectedDeviceName,
      selectedValue: [selectedDeviceName, "Temperature"],
      onPickerConfirm: data => {
        //device, sensor

        const deviceId = devices[deviceNames.indexOf(data[0])][0];
        const sensorId = sensorMapping[sensorNames.indexOf(data[1])][0];
        console.log("confirmed", deviceId, sensorId);

        if (options.onPickerConfirm) {
          options.onPickerConfirm(deviceId, sensorId);
        }
      },
      onPickerCancel: data => {
        console.log(data);
      },
      onPickerSelect: data => {
        console.log("selected", data);
      }
    });

    Picker.show();
  }
  componentWillMount(){

  }
  componentDidMount() {
    const alertId = this.props.navigation.getParam("alertId", null);
    if (alertId) {
      this.props.alertEdit(alertId);
    } else this.props.alertNew();

/*

    */
  }
  render() {
    console.log("rendering with props2", this.props);
    const alertId = this.props.navigation.getParam("alertId", { alertId: "" });

    const sensorSettings = this.props.devices.devices;
    let alert = this.props.alerts.currentAlert || { name: "" };

    //let { alert } = this.state;

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


    let devices = Object.keys(this.props.devices.devices)
      .map(key => this.props.devices.devices[key])
      .map(device => [device.deviceId, device.name]);

    return (
			<View style={{backgroundColor: theme.containerColor, flex: 1}}>
      <ScrollView>
          <TableView>
            {alert.triggered ? <Section {...theme.uiTable.section}>
              <Cell {...theme.uiTable.cell}  titleTextColor={'orange'} cellContentView={<View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}><Icon name={'exclamation'} size={20} color={theme.warningBackgroundColor} /><Text style={{marginLeft: 8,color: 'orange'}}>Alert triggered </Text><TimeAgo
								interval={1000}
								style={{color: 'orange'}}
								time={new Date(alert.triggered * 1000)}
							/></View>}/>
						</Section> : null}

            {rules.map((rule, ruleKey) => {
              console.log("got rule", rule);
              return (
                <View key={ruleKey + ""}>
                  <RuleComponent
                    rule={rule}
                    devices={devices}
                    alertId={alertId}
                    ruleSave={(alertId, ruleId) => {
                      this.props.alertRuleSave(alertId, ruleId);
                    }}
                    saveRuleField={(ruleId, fieldName, value) => {
                      console.log(
                        "rulefield changed",
                        fieldName,
                        ruleId,
                        value
                      );
                      this.saveRuleField(ruleId, fieldName, value);
                    }}
                  />
                  <Section {...theme.uiTable.section}
                    header={"Push message"}
                    sectionTintColor={"transparent"}
                  >
                    <Cell
											{...theme.uiTable.cell}
                      cellContentView={
                        <View
                          style={{
                            alignItems: "center",
                            flexDirection: "row"
                          }}
                        >
                          <Text style={labelStyle}>Title</Text>
                          <ScrollView scrollEnabled={false}>
                            <TextInput
															keyboardAppearance={'dark'}
															placeholderTextColor={theme.textColorMuted}
                              returnKeyType={"next"}
                              value={alert.name}
                              placeholder={"Type here"}
                              style={{ width: "100%", ...theme.textInput.default}}
                              onChangeText={text => {
                                console.log("text changed", text);
                                this.saveAlertField("name", text);
                              }}
                            />
                          </ScrollView>
                        </View>
                      }
                    />

                    <Cell
											{...theme.uiTable.cell}
                      cellContentView={
                        <View
                          style={{
                            alignItems: "center",
                            flexDirection: "row"
                          }}
                        >
                          <Text style={labelStyle}>Body</Text>
													<ScrollView scrollEnabled={false}>
                          <TextInput
														keyboardAppearance={'dark'}
                            returnKeyType={"next"}
                            multiline
                            placeholder={"Type here"}
                            value={alert.message}
														placeholderTextColor={theme.textColorMuted}
														style={{ width: "100%", ...theme.textInput.default}}
                            onChangeText={text => {
                              console.log("text changed", text);
                              this.saveAlertField("message", text);
                            }}
													/></ScrollView>
                        </View>
                      }
                    />
                    <Cell
											{...theme.uiTable.cell}
                      title="Notifications disabled"
                      cellContentView={

                        <Text style={Object.assign({ flex: 1 }, labelStyle)}>
                          Notifications{" "}
                          {alert.notificationsEnabled ? "enabled" : "disabled"}
                        </Text>
                      }

                      cellAccessoryView={
                        <Switch
													onTintColor={theme.activeColor}
                          onValueChange={value => {
                            this.saveAlertField("notificationsEnabled", value);

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



      </ScrollView></View>
    );
  }
}

export class RuleComponent extends React.Component {
  static propTypes = {
    rule: PropTypes.object,
    devices: PropTypes.object,
    alertId: PropTypes.string
  };
  static defaultProps = {
    rule: {},
    devices: {},
    alertId: ""
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
    //const ruleKey = this.props.key;
    const { devices, saveRuleField, rule } = this.props;
    //let { rule } = this.state;

    console.log("rendering rule", rule);
    const unit = "°C";
    const value = rule ? rule.value : null;
    const threshold = rule ? rule.threshold: null;
    const operation = rule ? rule.operation : null;
    const self = this;

		const operations = ["lt", "gt"];
		const operationIndex = operations.indexOf(operation)
    return (
      <Section header={"Alert when"} sectionTintColor={"transparent"} {...theme.uiTable.section}>
        <Cell {...theme.uiTable.cell}
          onPress={() => {
            EditAlertScreen.showDevicePicker(devices, {
              selected: [rule.deviceName, rule.kind],
              onPickerConfirm: (deviceId, sensorId) => {
                console.log(
                  "picker value changed",
                  rule.id,
                  deviceId,
                  sensorId
                );
                self.props.saveRuleField(rule.id, "deviceId", deviceId);
                self.props.saveRuleField(rule.id, "kind", sensorId);
              }
            });
          }}
          key={rule.id}
          title={
            rule.deviceName ? <View style={{ flexDirection: "row", color: theme.textColor, minWidth: 300 }}>
              <Text style={{ fontWeight: "bold", color: theme.textColor  }}>{rule.deviceName}</Text>
              <Text style={{ color: theme.textColor  }}> - </Text>
              <Text style={{ fontWeight: "bold", color: theme.textColor  }}>{sensorKeys[rule.kind]}</Text>
						</View> : <Text style={{color: theme.textColorMuted}}>Select device, sensor</Text>
          }
        />
        <Cell
					{...theme.uiTable.cell}
          cellContentView={
					<View style={{ marginTop: 20, marginBottom: 20, width: '100%' }}>
						<SegmentedControlIOS
							values={["Less than", "More than"]}
							selectedIndex={operationIndex}
							tintColor={theme.activeColor}
							onChange={event => {

								saveRuleField(
									rule.id,
									"operation",
									operations[event.nativeEvent.selectedSegmentIndex]
								);
								//this.setState({selectedIndex: event.nativeEvent.selectedSegmentIndex});
							}}
						/>
					</View>
				} />

        <Cell {...theme.uiTable.cell}
          cellContentView={
            <View style={{ flexDirection: "row" }}>
							<Text style={labelStyle}>Triggered at</Text>
							<ScrollView scrollEnabled={false}>
              <TextInput
								keyboardAppearance={'dark'}
								placeholderTextColor={theme.textColorMuted}
                style={theme.textInput.default}
                onChangeText={text => {
                  saveRuleField(rule.id, "value", text);
                }}
                placeholder={"Enter trigger value"}
                returnKeyType={"next"}
                value={value + ""}
                keyboardType={"decimal-pad"}
							/></ScrollView>
              <Text style={{color: 'white'}}>
                {unit}
              </Text>
            </View>
          }
        />
				<Cell {...theme.uiTable.cell}
							cellContentView={
								<View style={{ flexDirection: "row" }}>
									<Text style={labelStyle}>Reset at</Text>
									<ScrollView scrollEnabled={false}>
									<TextInput
										keyboardAppearance={'dark'}
										placeholderTextColor={theme.textColorMuted}
										style={theme.textInput.default}
										onChangeText={text => {
											saveRuleField(rule.id, "threshold", text);
										}}
										placeholder={"Enter value "}
										returnKeyType={"next"}
										value={threshold + ""}
										keyboardType={"decimal-pad"}
									/></ScrollView>
									<Text style={{color: 'white'}}>
										{unit}
									</Text>
								</View>
							}
				/>
      </Section>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  alertNew: () => dispatch(alertNew()),
  alertEdit: alertId => dispatch(alertEdit(alertId)),
  alertFieldChange: (fieldName, value) =>
    dispatch(alertFieldChange(fieldName, value)),
  ruleFieldChange: (ruleId, fieldName, value) =>
    dispatch(alertRuleFieldChange(ruleId, fieldName, value)),
  alertSave: (alertId, alert, store) =>
    dispatch(alertSave(alertId, alert, store)),
  alertRuleSave: (alertId, ruleId) => dispatch(alertRuleSave(alertId, ruleId))
  //fetchData: () => dispatch(fetchData()),
  //saveAlertField: ()=> dispatch()
});
const connectedAlertsScreen = connect(mapStateToProps, mapDispatchToProps)(
  AlertsScreen
);
const connectedEditAlertScreen = connect(mapStateToProps, mapDispatchToProps)(
  EditAlertScreen
);
export default createStackNavigator(
  {
    AlertsAll: connectedAlertsScreen,
    AlertEdit: connectedEditAlertScreen
  },
  {
    mode: "modal",
    headerMode: "float"
  }
);
