import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import firebase from 'firebase';

class ForgotPasswordScreen extends React.Component {
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

  onResetPasswordPress = (email) => {

    firebase.auth().sendPasswordResetEmail(email)
      .then(() => { 
        Alert.alert('Password reset email has been sent.'); 
      })
      .catch((error) => {

        if(String(error).includes('email address is badly formatted')){

          Alert.alert('Login Error', 'Please enter your mail address correctly.');

        }else if(String(error).includes('A network error')){

          Alert.alert('Connection Error', 'Please check your internet connection.');

        }else{

          Alert.alert(error.message);
        }
      });
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

export default ForgotPasswordScreen;