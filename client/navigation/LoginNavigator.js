import React from 'react';
import { createStackNavigator } from 'react-navigation';

// Auth
import AuthScreen from '../screens/login/auth/AuthScreen';

// Email
import SignInScreen from '../screens/login/email/SignInScreen';
import SignUpScreen from '../screens/login/email/SignUpScreen';
import ForgotPasswordScreen from '../screens/login/email/ForgotPasswordScreen';

// Ortak
import CompleteRegisterScreen from '../screens/login/CompleteRegisterScreen';

export default createStackNavigator({
  Auth: AuthScreen,
  CompleteRegister: CompleteRegisterScreen,
  SignIn: SignInScreen,
  SignUp: SignUpScreen,
  ForgotPassword: ForgotPasswordScreen
},
{
  initialRouteName: 'Auth',
});
