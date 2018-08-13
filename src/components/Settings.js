import React from "react";
import PropTypes from "prop-types";
import { PickerIOS, Text, View } from "react-native";
import { createStackNavigator } from "react-navigation";
import { initFirebase } from "../actions";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import firebase from "react-native-firebase";
const PickerItemIOS = PickerIOS.Item;
import { connect } from "react-redux";
import mapStateToProps from "../reducers/stateToProps";
import createTheme from '../theme';
const theme = createTheme()

export class SettingsScreen extends React.Component {
  static propTypes = {};
  static defaultProps = {};
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      title: "Settings",
			...theme.headers
    };
  };

  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const username = this.props.user.user
      ? this.props.user.user.email
      : "Logged out";
    return (
			<View style={{backgroundColor: theme.containerColor, flex: 1}}>
        <TableView>
          <Section header={"Account"} sectionTintColor={"transparent"} {...theme.uiTable.section}>
            <Cell {...theme.uiTable.cell}
              cellStyle={"RightDetail"}
              title={username}
              detail={"Logout"}
									detailTextStyle={{color: theme.dangerColor}}
              onPress={() => {
                firebase.auth().signOut();
              }}
            />
          </Section>
        </TableView>
      </View>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  //fetchData: () => dispatch(fetchData()),
  //saveAlertField: ()=> dispatch()
});
const connectedSettingsScreen = connect(mapStateToProps)(SettingsScreen);
//export default connectedSettingsScreen

export default createStackNavigator({
    Settings: connectedSettingsScreen
}, {
	headerMode: "float"
});

/*
export default createStackNavigator(
	{
		//Devices: DevicesScreen,
		Settings: connectedSettingsScreen,
	},
	{
		headerMode: "float"
	}
);
*/