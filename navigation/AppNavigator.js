import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import DangNhapScreen from '../screens/DangNhapScreen';
import MainTabNavigator from './MainTabNavigator';

const Login = createStackNavigator({
  DangNhap: { 
    screen: DangNhapScreen,
    navigationOptions: {
      header: null,
    }
  }
})

export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    FirstIn: Login,
    Main: MainTabNavigator,
    initialRouteName: 'FirstIn'
  })
);
