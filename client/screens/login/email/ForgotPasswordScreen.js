import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import firebase from 'firebase';

class ForgotPasswordScreen extends React.Component {
  static navigationOptions = {
    title: 'Reset Your Password',
    headerTransparent: true,
    headerStyle: { borderBottomWidth: 0 }
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
      <View style={styles.container}>
        <TextInput
          placeholder='Email'
          style={[styles.textInput, { marginTop: 40, marginBottom: 20 }]}
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={(text) =>  this.setState({ email: text })}
        />

          <TouchableOpacity
            onPress={() => this.onResetPasswordPress(this.state.password)}
            style={[styles.button]}
          >
            <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>
              RESET PASSWORD
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
          style={{
            alignSelf: 'flex-end',
            height: 40,
            justifyContent: 'center',
            marginBottom: 20
          }}
        >
          <Text style={{ color: "#BDC3C6", fontSize: 15 }}>
            Need Help?
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 26,
    paddingTop: 26,
    paddingBottom: 18
  },
  textInput: {
    height: 60,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#ECF0F3',
    paddingHorizontal: 19
  },
  button: {
    height: 60,
    borderRadius: 3,
    backgroundColor: '#11B8FF',
    justifyContent: 'center',
    alignItems: 'center'
  }
});