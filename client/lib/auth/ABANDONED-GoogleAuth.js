import React from 'react';
import firebase from 'firebase';
import { Alert } from 'react-native';
import { Google } from 'expo';
import { googleAuthConfig } from '../../configs/google';
import NavigationService from '../../services/NavigationService';

//
// Redux..
//

import { connect } from 'react-redux';
import { setFavoriteAnimal } from '../../redux/app-redux';

const mapStateToProps = (state) => {
  return{
    favoriteAnimal: state.favoriteAnimal,
  };
}

const mapDispatchToProps = (dispatch) => {
  return{
    setFavoriteAnimal: (text) => { dispatch(setFavoriteAnimal(text)); } ,
  };
}

class GoogleAuth extends React.Component{

  constructor(props) {
    super(props);
    this.state={
      favoriteAnimal: this.props.favoriteAnimal,
    };
  }

  static async signInWithGoogleAsync()
  {
    try
    {
      // result --> google user information
      const result = await Google.logInAsync(googleAuthConfig)

      if(result.type === 'success')
      {
        this.onSignIn(result);
        // NavigationService.navigate('Main');
      }
      else
      {
        console.log('Google Auth Process Cancaled From User');
      }

    }
    catch (e)
    {
      if(e == 'Error: ExpoAppAuth.Get Auth: Network error')
      {
        Alert.alert('Connection Error', 'Please check your internet connection.');
      }
      else
      {
        console.log('error', e);
        // Burada kullanıcıya hata raporu gönder pop-up çıkartılacak
      }
    }
  }

  onSignIn = (googleUser) => {
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe =
      firebase.auth().onAuthStateChanged( (firebaseUser) => {
      unsubscribe();

      /* Eğer tuttuğumuz firebase datası != googleuser ise
       * Credential oluştur -> Credential ile firebase'e giriş yap
       * Ardından database üstünde kayıt oluştur.
       * Eğer firebaseUser == googleUser ise son girilme tarihini değiştir.
      */
      if (!this.isUserEqual(googleUser, firebaseUser)) {

        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider
           .credential( googleUser.idToken, googleUser.accessToken );

        // Sign in with credential from the Google user.
        firebase.auth().signInAndRetrieveDataWithCredential(credential)
          .then( (result) =>
          {
            if(result.additionalUserInfo.isNewUser)
            {
              console.log('yeni data kaydı yapılıyor..');
              firebase.database().ref('/users/' + result.user.uid).set(
              {
                gmail: result.user.email,
                profile_picture: result.additionalUserInfo.profile.picture,
                locale: result.additionalUserInfo.profile.locale,
                first_name: result.additionalUserInfo.profile.given_name,
                last_name: result.additionalUserInfo.profile.family_name,
                created_at: Date.now()
              })
                .then((snapshot) => {
                  // console.log('Snapshot', snapshot);
                });
            }
            else
            {
              console.log('last_logged_in');
              firebase.database().ref('/users/' + result.user.uid).update(
              {
                last_logged_in: Date.now()
              })
              .then( () => {
                console.log('hadi bakalim..');
                this.props.setFavoriteAnimal(result.user.uid);
                console.log(result.user.uid);
              })
              .catch((error) => { console.log("Here is : " + error);
              });


            }
          })
          .catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
            console.log(errorCode + errorMessage);
          });
      }
      else
      {
        // firebase.auth().signOut() methodu kullanmadan çıkılmışsa
        console.log('User already signed-in Firebase.');
      }
    });
  }

  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.user.id) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  }

  render(){
    return(null);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GoogleAuth);
