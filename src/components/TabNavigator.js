import React from "react";
import { createBottomTabNavigator } from "react-navigation";

import AlertsScreen from "./Alerts";
import DevicesScreen from "./Devices";
import GraphsScreen from "./Graphs";
import SettingsScreen from "./Settings";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import createTheme from '../theme';
const theme = createTheme()
export default createBottomTabNavigator(
  {
    Devices: DevicesScreen,
   /* Graphs: GraphsScreen,*/
    Alerts: AlertsScreen,
    Settings: SettingsScreen
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === "Devices") {
          iconName = 'speedometer';
          //iconName = `ios-information-circle${focused ? '' : '-outline'}`;
        } else if (routeName === "Graphs") {
					iconName = 'graph';
        } else if (routeName === "Alerts") {
					iconName = 'bell';
				} else if (routeName === "Settings") {
					iconName = 'settings';
				}

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        if (iconName) {
          return <Icon name={iconName} size={20} color={tintColor} />;
        }
        return null;
      }
    }),
    tabBarOptions: {
      ...theme.tabBar,

    }
  }
);
