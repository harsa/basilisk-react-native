import React from "react";
import PropTypes from "prop-types";
import { SwitchNavigator } from "react-navigation";
import Loading from "./components/Loading";
import Login from "./components/Login";
import NavigationService from './components/NavigationService';
import TabNavigator from "./components/TabNavigator";

const RootNavigator = SwitchNavigator(
  {
    Loading,
    Login,
    TabNavigator
  },
  {
    initialRouteName: "Loading"
  }
);

const n = () => (
  <RootNavigator

  />
);
export default RootNavigator;
