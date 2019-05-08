import React from 'react';
import { View, Text, Image, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import firebase from 'firebase';

// Redux
import { connect } from 'react-redux';
import { setPersonData } from '../../../redux/collection';

const mapStateToProps = (state) => {
  return{
    personData: state.personData,
  };
}

const mapDispatchToProps = (dispatch) => {
  return{
    setPersonData: (text) => {dispatch(setPersonData(text))} ,
  };
}

class SignInScreen extends React.Component {
  static navigationOptions = {
    title: 'Login With Email'
  };

  constructor(props) {
    super(props);
  }

  onSignInPress = async (email, password) => {

    try{
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => { 
          //logic..
        })
        .catch((error) => {

          if(String(error).includes('email address is badly formatted')){

            Alert.alert('Enter Error', 'Please enter your mail address correctly.');

          }else if(String(error).includes('password is invalid')){

            Alert.alert('Enter Error', 'Please enter your password.');

          }else if(String(error).includes('A network error')){

            Alert.alert('Connection Error', 'Please check your internet connection.');

          }else{

            Alert.alert('ERROR -> ', error.message);

          }

        });

    }catch(err){
      console.log(err);
    }

  }

  render(){
    return(
      <View>
        <Text>Hello</Text>
      </View>
    );
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen);
