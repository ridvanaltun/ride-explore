import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import LoadingScreen from '../screens/LoadingScreen';
import LoginNavigator from './LoginNavigator';
import MainTabNavigator from './MainTabNavigator';

export default createAppContainer(createSwitchNavigator({
  Loading: LoadingScreen,
  Login: LoginNavigator,
  Main: MainTabNavigator,
},
{
  initialRouteName: 'Loading',
}
));
