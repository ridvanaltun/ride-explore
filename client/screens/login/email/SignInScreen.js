import React from 'react';
import { View, Image, StyleSheet, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
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
    title: 'Login With Email',
    headerTransparent: true,
    headerStyle: { borderBottomWidth: 0 }
  };

  constructor(props) {
    super(props);
    this.state={
      email: '',
      password: ''
    }
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
      <View style={styles.container}>

        <TextInput
          placeholder="Email"
          style={[styles.textInput, { marginTop: 40 }]}
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={(text) =>  this.setState({ email: text })}
        />
        <TextInput
          placeholder="Password"
          style={[styles.textInput, { marginVertical: 20 }]}
          secureTextEntry={true}
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={(text) =>  this.setState({ password: text })}
        />

        <TouchableOpacity
          onPress={() => this.onSignInPress(this.state.email, this.state.password)}
          style={[styles.button]}
        >
          <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>
            SIGN IN
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
        <Text style={{ alignSelf: 'center', color: "#A6A8A9", fontSize: 15 }}>
          Don’t have an account yet ?
        </Text>
        <TouchableOpacity
          style={{ alignSelf: 'center', height: 34, justifyContent: 'center' }}
          onPress={() => this.props.navigation.navigate('SignUp')}
        >
          <Text style={{ color: '#0D92CA', fontSize: 15 }}>Create an account</Text>
        </TouchableOpacity>
        <Text style={{ alignSelf: 'center', color: '#A6A8A9', fontSize: 15, marginTop: 10 }}>
          Don't remember your password ?
        </Text>
        <TouchableOpacity
          style={{ alignSelf: 'center', height: 34, justifyContent: 'center' }}
          onPress={() => this.props.navigation.navigate('ForgotPassword')}
        >
          <Text style={{ color: "#0D92CA", fontSize: 15 }}>Reset password</Text>
        </TouchableOpacity>
      </View>
    );
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen);

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
    borderColor: "#ECF0F3",
    paddingHorizontal: 19
  },
  button: {
    height: 60,
    borderRadius: 3,
    backgroundColor: "#11B8FF",
    justifyContent: 'center',
    alignItems: 'center'
  }
});