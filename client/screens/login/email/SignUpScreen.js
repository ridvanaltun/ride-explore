import React from 'react';
import { View, StyleSheet, Text, Image, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import firebase from 'firebase';

// Redux..
import { connect } from 'react-redux';
import { setPersonData } from '../../../redux/collection';

const mapStateToProps = (state) => {
  return{
    personData: state.personData
  };
}

const mapDispatchToProps = (dispatch) => {
  return{
    setPersonData: (object) => { dispatch(setPersonData(object)) }
  };
}

class SignUpScreen extends React.Component {
  static navigationOptions = {
    title: 'Email Registration',
    headerTransparent: true,
    headerStyle: { borderBottomWidth: 0 }
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      surname: '',
      email: '',
      password: '',
      passwordConfirm: ''
    };
  }

  onSignUpPress = async (name, surname, email, password, passwordConfirm) => {

    if (password !== passwordConfirm){

      Alert.alert('Confirm Password Doesnt Match', 'Passwords do not match.');

    }else if(password.length < 6){

      Alert.alert('Your Password Too Short', 'Please enter atleast 6 characters.');

    }else{

      try{
        firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {

            Alert.alert("Account created.");

            // burada uid bilgisini göndermemiz gerekiyor.
            this.props.navigation.navigate('CompleteRegister');

          })
          .catch((error) => {

            if(String(error).includes('A network error')){

              Alert.alert('Connection Error', 'Please check your internet connection.');

            }else if(String(error).includes('email address is badly formatted')){

              Alert.alert('Login Error', 'Please enter your mail address correctly.');

            }else{

              Alert.alert(error.message);

            }

          });

      }catch(err){
        console.log(err);
      }
    }
  }

  render(){
    const { name, surname, email, password, passwordConfirm } = this.state;
    return(
      <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' enabled>
      <View style={styles.container}>
        <TextInput
          placeholder="Name"
          style={[styles.textInput, { marginTop: 40 }]}
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={(text) =>  this.setState({ name: text })}
        />

        <TextInput
          placeholder="Surname"
          style={styles.textInput}
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={(text) =>  this.setState({ surname: text })}
        />

        <TextInput
          placeholder="Email"
          style={styles.textInput}
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={(text) =>  this.setState({ email: text })}
        />
        <TextInput
          placeholder="Password"
          style={styles.textInput}
          secureTextEntry={true}
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={(text) =>  this.setState({ password: text })}
        />

        <TextInput
          placeholder="Password (confirm)"
          style={[styles.textInput, { marginBottom: 20 }]}
          secureTextEntry={true}
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={(text) =>  this.setState({ passwordConfirm: text })}
        />

        <TouchableOpacity
          onPress={() => this.onSignUpPress(name, surname, email, password, passwordConfirm)}
          style={[styles.button]}
        >
          <Text style={{ color: "white", fontSize: 20, fontWeight: '600' }}>
            SIGN UP
          </Text>
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpScreen);

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
    paddingHorizontal: 19,
    marginTop: 10
  },
  button: {
    height: 60,
    borderRadius: 3,
    backgroundColor: "#11B8FF",
    justifyContent: 'center',
    alignItems: 'center'
  }
});