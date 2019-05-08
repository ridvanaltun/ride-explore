import React from 'react';
import { createStackNavigator } from 'react-navigation';

// Auth
import AuthScreen from '../screens/login/auth/AuthScreen';
import RegisterScreen from '../screens/login/auth/RegisterScreen';

// Email
import SignInScreen from '../screens/login/email/SignInScreen';
import SignUpScreen from '../screens/login/email/SignUpScreen';
import ForgotPasswordScreen from '../screens/login/email/ForgotPasswordScreen';

export default createStackNavigator({
  Auth: AuthScreen,
  Register: RegisterScreen,
  SignIn: SignInScreen,
  SignUp: SignUpScreen,
  ForgotPassword: ForgotPasswordScreen
},
{
  initialRouteName: 'Auth',
});
