import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import firebase from 'firebase';

// Facebook Auth
import { Facebook } from 'expo';
import { facebookAuthConfig } from '../../../../configs/facebook';

// Constants
import Colors from '../../../../constants/Colors';

// Redux
import { connect } from 'react-redux';
import { setPersonData, setIsLoading } from '../../../../redux/collection';

const mapStateToProps = (state) => {
  return{
    personData: state.personData
  };
}

const mapDispatchToProps = (dispatch) => {
  return{
    setPersonData: (object) => { dispatch(setPersonData(object)) },
    setIsLoading: (boolean) => { dispatch(setIsLoading(boolean)) }
  };
}

class FacebookButton extends React.Component{

	constructor(props){
		super(props);
    this.state={
      disabled: true,
      loading: false
    }
	}

  onFacebookSignInPress = async () => {

    try{

      this.props.setIsLoading(true);

      const { type, token, expires, permissions, declinedPermissions } = await Facebook
        .logInWithReadPermissionsAsync(
          facebookAuthConfig.appId, { permissions: ['public_profile', 'email']}
      );

      if (type === 'success') {

        const credential = firebase.auth.FacebookAuthProvider.credential(token);

        // Sign in with credential from the Facebook user.
        firebase.auth().signInAndRetrieveDataWithCredential(credential)
          .catch((error) => console.log(error));

      }else{
        // type === 'cancel'
      }

    }catch({ message }){

      if(message == 'net::ERR_SSL_PROTOCOL_ERROR'){

        Alert.alert('Connection Problem', 'Please check your internet connection.');

      }else{

        Alert.alert('Facebook Login Error', message);
      }
      
    }finally{
      this.props.setIsLoading(false);
    }
  }

	render(){
		return(
			<Button
        title='Login with Facebook'
        icon={
          <Icon
            type='font-awesome'
            name='facebook'
            size={30}
            color='white'
            iconStyle={styles.buttonIcon} 
          />
        }
        onPress={() => this.onFacebookSignInPress()}
        buttonStyle={[styles.button, styles.facebookButton]}
        disabledStyle={styles.disabledButton}
        loading={this.state.loading}
        disabled={this.state.disabled}
      />
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(FacebookButton);

const styles = StyleSheet.create({
	button: {
		borderRadius: 10,
    	margin: 5
	},
	facebookButton: {
		backgroundColor: Colors.facebook.blue
	},
	disabledButton: {
		backgroundColor: Colors.deactive
	},
	buttonIcon: {
    	paddingRight: 5
  	}
});