import React from 'react';
import { View, StyleSheet, Text, Image, TextInput } from 'react-native';
import firebase from 'firebase';

// Components
import Button from './components/Button';
import Input from './components/Input';

// Constanta
import Fonts from '../../../constants/Fonts';

// For term of use
import Modal from 'react-native-modal';

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
    header: null
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

  onSignUpPress = async (email, password, passwordConfirm) => {

    if (password !== passwordConfirm){

      Alert.alert('Confirm Password Doesnt Match', 'Passwords do not match.');

    }else if(password.length < 6){

      Alert.alert('Your Password Too Short', 'Please enter atleast 6 characters.');

    }else{

      try{
        firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {

            Alert.alert("Account created.");
            NavigationService.navigate('Main');

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
    const { email, password, passwordConfirm } = this.state;
    return(
      <View style={{ paddingTop: 60, alignItems: 'center' }}>

        <TextInput
          style={{ width: 200, height: 40, borderWidth: 1 }}
          value={email}
          onChangeText={(text) =>  this.setState({ email: text })}
          placeholder='Email'
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
        />

        <View style={{ paddingTop: 10 }} />

        <TextInput
          style={{ width: 200, height: 40, borderWidth: 1 }}
          value={password}
          onChangeText={(text) => this.setState({ password: text })}
          placeholder='Password'
          secureTextEntry={true}
          autoCapitalize='none'
          autoCorrect={false}
        />

        <View style={{ paddingTop:10 }} />

        <TextInput
          style={{ width: 200, height: 40, borderWidth: 1 }}
          value={passwordConfirm}
          onChangeText={(text) => this.setState({ passwordConfirm: text })}
          placeholder='Password (confirm)'
          secureTextEntry={true}
          autoCapitalize='none'
          autoCorrect={false}
        />

        <View style={{paddingTop:10}} />

        <Button title='Signup' onPress={() => this.onSignUpPress(email, password, passwordConfirm)} />
        <Button title='Back to Login' onPress={()=>this.props.navigation.goBack()} />
      </View>
/*
       <View style={styles.container}>
        <View style={styles.heading}>
        </View>
        <Text style={styles.greeting}>
          Welcome,
        </Text>
        <Text style={styles.greeting2}>
          sign up to continue
        </Text>
        <View style={styles.inputContainer}>
          <Input
            value={this.state.name}
            placeholder='Name'
            type='username'
            onChangeText={(name) => this.setState({ name: name })}
          />
          <Input
            value={this.state.surname}
            placeholder='Surname'
            type='username'
            onChangeText={(surname) => this.setState({ surname: surname })}
          />
          <Input
            value={this.state.email}
            placeholder='Email'
            type='email'
            onChangeText={(email) => this.setState({ email: email })}
          />
          <Input
            value={this.state.password}
            placeholder='Password'
            secureTextEntry
            type='password'
            onChangeText={(password) => this.setState({ password: password })}
          />
        </View>
        <Button
          title='Sign Up'
          onPress={() => this.onRegisterPress()}
          isLoading={false}
        />
  
        </View>
*/
    );
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpScreen);

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  heading: {
    flexDirection: 'row'
  },
  headingImage: {
    width: 38,
    height: 38
  },
  errorMessage: {
    fontSize: 12,
    marginTop: 10,
    color: 'transparent',
    fontFamily: Fonts.lato.base
  },
  inputContainer: {
    marginTop: 20
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40
  },
  greeting: {
    marginTop: 20,
    fontSize: 24,
    fontFamily: Fonts.lato.light
  },
  greeting2: {
    color: '#666',
    fontSize: 24,
    marginTop: 5,
    fontFamily: Fonts.lato.light
  }
});