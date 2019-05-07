import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';

// Constants
import Colors from '../../constants/Colors';

// https://unicodey.com/emoji-data/table.htm
import Emoji from 'react-native-emoji';

// Auth Functions
import FacebookAuth from '../../lib/auth/FacebookAuth';

// Components
import GoogleButton from './components/GoogleButton';
import FacebookButton from './components/FacebookButton';
import EmailButton from './components/EmailButton';

// Redux..
import { connect } from 'react-redux';
import { setPersonData } from '../../redux/collection';

const mapStateToProps = (state) => {
  return{
    personData: state.personData,
    isLoading: state.isLoading
  };
}

const mapDispatchToProps = (dispatch) => {
  return{
    setPersonData: (object) => { dispatch(setPersonData(object)) }
  };
}

class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Sign In',
    header: null
  };

  constructor(props) {
    super(props);
  }

	render() {

    const { navigate } = this.props.navigation;

    if(this.props.isLoading === false){
      return(
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.header}>
              Welcome Stranger {'\t'}
              <Emoji name='wave' style={{ fontSize: 30 }} />
            </Text>

            <View style={styles.avatar}>
              <Icon
                type='material-community' 
                name='bike' 
                size={150} 
                color='skyblue' 
              />
            </View>

            <Text style={styles.text}>
              Please log in to continue {'\n'}
              to the awesomness
            </Text>

          </View>
          <View style={styles.footer}>
            <View style={styles.buttonContainer}>
              <View style={styles.socialButtonContainer}>
                <FacebookButton />
                <GoogleButton />   
              </View>
              <View style={styles.emailButtonContainer} >
                <EmailButton />
              </View>
            </View>
          </View>
        </View>
      );

    }else{
      return(

        /* buraya loading efekti eklenecek.. */

        <View style={{ flex: 1, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' }}>
          <Text> Loading..</Text>
        </View>
      );
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    margin: 20,
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  text: {
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
  socialButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center'
  },
  emailButtonContainer:{
    justifyContent: 'center',
    marginTop: 10
  },
  footer: {
    justifyContent: 'flex-end'
  },
  buttonContainer: {
    flexDirection: 'column',
    margin: 10,
    marginBottom: 15
  }
});
