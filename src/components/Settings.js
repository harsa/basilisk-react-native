import React from "react";
import PropTypes from "prop-types";
import { PickerIOS, Text, View } from "react-native";
import { initFirebase } from '../actions';
import { DataContext } from "./DataProvider";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import firebase from "react-native-firebase";
const PickerItemIOS = PickerIOS.Item;
import { connect } from 'react-redux';
import mapStateToProps from '../reducers/stateToProps'

export class SettingsScreen extends React.Component {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      language: "js"
    };
  }
  render() {

    const username =
      this.props.user.user ?
        this.props.user.user.email
        : "Logged out";
    return (
      <View>
        <TableView>
          <Section header={"Account"} sectionTintColor={'transparent'}>
            <Cell
              cellStyle={"RightDetail"}
              title={username}
              detail={"Logout"}
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
const mapDispatchToProps = (dispatch) => ({
	//fetchData: () => dispatch(fetchData()),
	//saveAlertField: ()=> dispatch()
});

export default connect(mapStateToProps, mapDispatchToProps())(SettingsScreen)