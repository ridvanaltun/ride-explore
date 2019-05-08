import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import firebase from 'firebase';

// Google Auth
import { Google } from 'expo';
import { googleAuthConfig } from '../../../../configs/google';

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

class GoogleButton extends React.Component{

	constructor(props){
		super(props);
		this.state={
			disabled: false,
			loading: false
		}
	}

	isGoogleUserEqual = (googleUser, firebaseUser) => {
	    if (firebaseUser) {
	      let providerData = firebaseUser.providerData;
	      for (let i = 0; i < providerData.length; i++) {
	        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
	          providerData[i].uid === googleUser.user.id) {
	          // We don't need to reauth the Firebase connection.
	          return true;
	        }
	      }
	    }
	    return false;
	}

	useGoogleAuth = (googleUser) => {
	    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
	    var unsubscribe =
	      firebase.auth().onAuthStateChanged( (firebaseUser) => {
	      unsubscribe();

	      if (!this.isGoogleUserEqual(googleUser, firebaseUser)) {

	        // Build Firebase credential with the Google ID token.
	        var credential = firebase.auth.GoogleAuthProvider
	           .credential( googleUser.idToken, googleUser.accessToken );

	        // Sign in with credential from the Google user.
	        firebase.auth().signInAndRetrieveDataWithCredential(credential)
	          .then( (result) => {
	            if(result.additionalUserInfo.isNewUser){

	              // Burada gelen resmi inceleyip gerekli işlemleri yaptıktan sonra 180px şeklinde kaydedebiliriz.
	              // Şimdilik atladım ancak ileride yapılması gerekiyor.

	              firebase.database().ref('/users/' + result.user.uid).set({
	                verified: false,
	                uid: result.user.uid,
	                email: result.user.email,
	                locale: result.additionalUserInfo.profile.locale,
	                image_original: result.additionalUserInfo.profile.picture,
	                image_minified: result.additionalUserInfo.profile.picture,
	                name: result.additionalUserInfo.profile.given_name || 'John',
	                surname: result.additionalUserInfo.profile.family_name || 'Doe',
	                provider: result.additionalUserInfo.providerId,
	                created_at: Date.now()
	              });

	              console.log('LOGIN: NEW USER CREATED USING GOOGLE AUTH');
	              this.props.navigation.navigate('Register', {uid: result.user.uid});
	            }
	            else{
	              console.log('LOGIN: USER SIGN-IN USING GOOGLE AUTH');
	              firebase.database().ref('/users/' + result.user.uid)
	                .update({ last_logged_in: Date.now() })
	                .catch(err =>  console.log('ERROR -> [FIREBASE] --> ', err));
	            }
	          })
	          .catch(err => {
	            const errorCode = err.code;
	            const errorMessage = err.message;
	            const email = err.email;
	            const credential = err.credential;
	            console.log(errorCode + errorMessage);
	          });
	      }else{
	        // firebase.auth().signOut() methodu kullanmadan çıkılmışsa
	        // yani firebase verisi telefonda hala duruyorsa ???

	        firebase.database().ref('/users/' + firebaseUser.uid).once('value').then(snapshot => { 
	          if(snapshot.val().verified === false && snapshot.val().online === undefined){
	            this.props.setPersonData(snapshot.val());
	            this.props.navigation.navigate('Register', {uid: snapshot.val().uid});
	          }else{
	            console.log('LOGIN: USER ALREADY SIGNED-IN');
	            Alert.alert('User already connected!', 'You are already in there!');
	          }

	        });

	      }
	    });
  	}

  	onGoogleSignInPress = async () => {
	    try{

  		  this.props.setIsLoading(true);
	      const user = await Google.logInAsync(googleAuthConfig);

	      if(user.type === 'success'){
	        this.useGoogleAuth(user);
	      }else{
	        console.log('Google Auth Process Cancaled From User');
	      }

	    }catch(err){

	      if(String(err).includes('Network error')){
	        Alert.alert('Expo Connection Error', 'Please check your internet connection.');
	      }else if(String(err).includes('Network request failed')){
	        Alert.alert('App Connection Error', 'Please check your internet connection.');
	      }else if(String(err).includes('some async operation is still in progress')){
	        Alert.alert('Async Progress Error', 'Some async operation is still in progress.');
	      }else{
	        console.log('ERROR -> [onGoogleSignInPress] --> ', err);
	        // Bilmediğimiz bir hata, burada kullanıcıya hata raporu gönder modal'ı çıkartılacak.
	      }

	    }finally{
	    	this.props.setIsLoading(false);
	    }
  	}

	render(){
		return(
			<Button
              title='Or with Google'
              icon={
                <Icon
                  type='font-awesome'
                  name='google'
                  size={30}
                  color='white'
                  iconStyle={styles.buttonIcon} 
                />
              }
              onPress={() => this.onGoogleSignInPress()}
              buttonStyle={[styles.button, styles.googleButton]}
              disabledStyle={styles.disabledButton}
              loading={this.state.loading}
        	  disabled={this.state.disabled}
            /> 
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(GoogleButton);

const styles = StyleSheet.create({
	button: {
		borderRadius: 10,
    	margin: 5
	},
	googleButton: {
		backgroundColor: Colors.google.red
	},
	disabledButton: {
		backgroundColor: Colors.deactive
	},
	buttonIcon: {
    	paddingRight: 5
  	}
});