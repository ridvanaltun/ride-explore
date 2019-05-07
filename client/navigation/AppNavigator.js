import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import LoadingScreen from '../screens/LoadingScreen';

export default createAppContainer(createSwitchNavigator({
  Loading: LoadingScreen,
  Auth: AuthNavigator,
  Main: MainTabNavigator,
},
{
  initialRouteName: 'Loading',
}
));
