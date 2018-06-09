import { createBottomTabNavigator } from 'react-navigation';
import AlertsScreen from './Alerts';
import DevicesScreen from './Devices';
import GraphsScreen from './Graphs';
import SettingsScreen from './Settings';

export default createBottomTabNavigator({
																					Devices: DevicesScreen,
																					Graphs: GraphsScreen,
																					Alerts: AlertsScreen,
																					Settings: SettingsScreen
																				});