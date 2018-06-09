import React from "react";
import PropTypes from "prop-types";
import { PickerIOS,Text, View } from "react-native";
import { DataContext } from "./DataProvider";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import firebase from 'react-native-firebase';
const PickerItemIOS = PickerIOS.Item;
export default class SettingsScreen extends React.Component {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
    	language: 'js'
		}
  }
  render() {
    return (
      <DataContext.Consumer>
        {context => {

				console.log('got contextt', context)
        	const username = context && context.currentUser && context.currentUser.email ? context.currentUser.email : 'Logged out'
          return (
            <View>
              <Text>Settings!</Text>
              <TableView>
                <Section header={'Account'}>
                  <Cell
                    cellStyle={"RightDetail"}
                    title={username}
                    detail={'Logout'}
										onPress={()=>{
											firebase.auth().signOut()
										}}
                  />
                </Section>
              </TableView>
							{/*
							<PickerIOS
								selectedValue={this.state.language}
								onValueChange={(itemValue, itemIndex) => this.setState({language: itemValue})}>
								<PickerItemIOS
									key={'language'}
									value={'js'}
									label={'Javascript'}
								/>
								<PickerItemIOS
									key={'language'}
									value={'java'}
									label={'Java'}
								/>
							</PickerIOS> */}
            </View>
          );
        }}
      </DataContext.Consumer>
    );
  }
}
