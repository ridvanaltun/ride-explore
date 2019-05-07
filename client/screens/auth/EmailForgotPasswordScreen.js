import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import firebase from 'firebase';

export default class EmailForgotPasswordScreen extends React.Component {
  static navigationOptions = {
    title: 'Reset Your Password',
    //header: null,
  };

  constructor(props) {
    super(props);
    this.state={
      email: ''
    }
  }

  onResetPasswordPress = () => {
    console.log('password reset..');
  }

  render(){
    return(
      <View style={{ paddingTop: 50, alignItems: 'center' }}>

        <Text>Forgot Password</Text>

        <TextInput
          style={{ width: 200, height: 40, borderWidth: 1 }}
          value={this.state.email}
          onChangeText={(text) => this.setState({ email: text })}
          placeholder='Email'
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
        />

        <View style={{ paddingTop: 10 }} />

        <Button 
          title='Reset Password' 
          onPress={() => MailAuth.onResetPasswordPress(this.state.email)} 
        />

        <View style={{ paddingTop: 10 }} />

        <Button 
          title='Back to Login' 
          onPress={() => this.props.navigation.goBack()} 
        />
      </View>
    );
  }
}
