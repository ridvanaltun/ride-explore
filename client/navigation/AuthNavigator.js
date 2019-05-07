import React from 'react';
import { createStackNavigator } from 'react-navigation';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import EmailScreen from '../screens/auth/EmailScreen';
import EmailRegisterScreen from '../screens/auth/EmailRegisterScreen';
import EmailForgotPasswordScreen from '../screens/auth/EmailForgotPasswordScreen';


//import SignUpScreen from '../screens/auth/ABANDONED-SignUpScreen';
//import ForgotPasswordScreen from '../screens/auth/ABANDONED-ForgotPasswordScreen';


export default createStackNavigator({
  Login: LoginScreen,
  Register: RegisterScreen,
  Email: EmailScreen,
  EmailRegister: EmailRegisterScreen,
  EmailForgotPassword: EmailForgotPasswordScreen
},
{
  initialRouteName: 'Login',
});
