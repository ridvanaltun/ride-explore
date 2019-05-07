import React from "react";
import { ActivityIndicator, Text, View, StyleSheet, AppState } from "react-native";
import { Location } from 'expo';
import firebase from 'firebase';

// Animation
import { DangerZone } from 'expo';
let { Lottie } = DangerZone;

// Redux
import { connect } from 'react-redux';
import { 
  setSocketID,
  setIsAppOnForeground, 
  setPersonData, 
  setIsServerConnectionOk, 
  setOnlineUserList, 
  setLocation,
  setPermissionStatus,
  setServiceStatus
} from '../redux/collection';

const mapStateToProps = (state) => {
  return{
    socketID: state.socketID,
    personData: state.personData,
    isServerConnectionOk: state.isServerConnectionOk,
    isAppOnForeground: state.isAppOnForeground,
    onlineUserList: state.onlineUserList,
    location: state.location,
    serviceStatus: state.serviceStatus,
    permissionStatus: state.permissionStatus
  };
}

const mapDispatchToProps = (dispatch) => {
  return{
    setSocketID: (string) => { dispatch(setSocketID(string)) } ,
    setPersonData: (object) => { dispatch(setPersonData(object)) } ,
    setIsServerConnectionOk: (boolean) => { dispatch(setIsServerConnectionOk(boolean)) } ,
    setIsAppOnForeground: (boolean) => { dispatch(setIsAppOnForeground(boolean)) } ,
    setOnlineUserList: (list) => { dispatch(setOnlineUserList(list)) },
    setLocation: (coords) => { dispatch(setLocation(coords)) },
    setServiceStatus: (status) => { dispatch(setServiceStatus(status)) },
    setPermissionStatus: (status) => { dispatch(setPermissionStatus(status)) }
  };
}

class LoadingScreen extends React.Component {

 constructor(props){
		super(props);
	}

  componentDidMount() {
    this.listenerPermissions();
    this.listenerServices();
    this.listenerAppState();
    this.listenerLocation();
    this.listenerSocket();
    this.listenerLoginStatus();
  }

  // Need expokit..
  listenerPermissions = () => {
    console.log('listener of permissions later..');
  }

  // Need expokit..
  listenerServices = () => {
    console.log('listener of services later..');
  }

  listenerPersonData = (uid) => {
    firebase
      .database()
      .ref("/users/" + uid )
      .on("value", (snapshot) => {

        this.props.setPersonData(snapshot.val());
        socket.emit('update-person-data', { 
          name: snapshot.val().name,
          surname: snapshot.val().surname,
          about: snapshot.val().about,
          image_original: snapshot.val().image_original,
          image_minified: snapshot.val().image_minified
        });
        console.log('SOCKET: OUR PERSONAL DATA SENDED!');
      }); 
  }

  listenerSocket = () => {

    // it is an initial process, it is just works one time..
    if(socket.connected === true){
      console.log('SOCKET: CONNECTED');
      this.props.setIsServerConnectionOk(true);
    }else{
      console.log('SOCKET: DISCONNECTED');
      this.props.setIsServerConnectionOk(false);
    }

    socket.on('connect', () => { 
      console.log('SOCKET: CONNECTED');
      this.props.setIsServerConnectionOk(true);

      // we need to send necessary data to server again
      socket.emit('login', { uid: this.props.personData.uid });
      socket.emit('update-location', { 
       latitude: this.props.location.latitude,
       longitude: this.props.location.longitude
      });

      console.log('SOCKET: OUR PERSONAL AND LOCATION DATA SENDED AGAIN!');

    });

    socket.on('disconnect', (reason) => { 

      console.log('SOCKET: DISCONNECTED'); 
      this.props.setIsServerConnectionOk(false);

      // ‘io server disconnect’, ‘io client disconnect’, or ‘ping timeout’
      if (reason === 'io server disconnect') {
        // the disconnection was initiated by the server, you need to reconnect manually
        socket.connect();
      }
    });

    // baglanti vardi ama sonradan koptuysa..
    socket.on('error', (error) => {
      console.log('ERROR -> [SOCKET] --> ', error);
    });

    socket.on('online-users', (users) => {
      this.props.setOnlineUserList(users);
    });

    socket.on('socket-id', id => {
      this.props.setSocketID(id);
    });
  }

  listenerLocation = () => {
    Location.watchPositionAsync({
      enableHighAccuracy: true,
      distanceInterval: 10, // sadece 10 metre üzeri lokasyon değişince lokasyonu güncelle
    }, (newLocation) => {

      this.props.setLocation({
        latitude: newLocation.coords.latitude, 
        longitude: newLocation.coords.longitude
      });

      console.log('SOCKET: OUR LOCATION SENDED!');

      socket.emit('update-location', { 
        latitude: newLocation.coords.latitude,
        longitude: newLocation.coords.longitude
      });

    }).catch((err)=> { 
      if(String(err).includes('Location services are disabled')){
        this.props.setServiceStatus({ ...this.props.serviceStatus, location: false });
        console.log('SERVICE STATUS: ', 'LOCATION => FALSE');
      }else if(String(err).includes('Not authorized to use location services')){
        this.props.setPermissionStatus({ ...this.props.permissionStatus, location: false });
        console.log('PERMISSON STATUS: ', 'LOCATION => FALSE');
      }else{
        console.log(err);
      }
    });
  }

  listenerAppState = () => {

    // When app started..
    if(AppState.currentState == "active"){
      this.props.setIsAppOnForeground(true);
      console.log('STATE: APP FOREGROUND!');
    }else{
      this.props.setIsAppOnForeground(false);
      console.log('STATE: APP BACKGROUND!');
    }
    
    // Set an event..
    AppState.addEventListener('change', nextAppState => {

      if(nextAppState == "active"){
        this.props.setIsAppOnForeground(true);
        console.log('STATE: APP FOREGROUND');
      }else{
        this.props.setIsAppOnForeground(false);
        console.log('STATE: APP BACKGROUND');
      }
    });
  }

	listenerLoginStatus = () => {

  	firebase
      .auth()
      .onAuthStateChanged( (user) => {

        console.log('CHANGED: LOGIN STATUS');

    		if(user){

          if(!this.props.isServerConnectionOk){
            console.log('LOGIN MODE: OFFLINE');

            if(this.props.personData.verified){
              console.log('LOGIN STATUS: COMPLETE');
              this.props.navigation.navigate('Main');
            }else{
              console.log('LOGIN STATUS: REGISTER');
              this.props.navigation.navigate('Register', { uid: this.props.personData.uid });
            }

          }else{
            console.log('LOGIN MODE: ONLINE');

            firebase.database().ref('/users/' + user.uid)
              .once('value')
              .then( (snapshot) => {

                if(snapshot.val().verified === false){
                  console.log('LOGIN STATUS: REGISTER');
                  this.props.navigation.navigate('Register', { uid: user.uid });
                }else{
                  console.log('LOGIN STATUS: COMPLETE');
                  this.props.navigation.navigate('Main');
                }

              firebase.database().ref('/users/' + user.uid)
                .update({ last_logged_in: Date.now() })
                .then( () => {
                  this.props.setPersonData(snapshot.val());
                  this.listenerPersonData(user.uid);
                })
                .catch((error) => { console.log('ERROR -> [FIREBASE] --> [last_logged_in] --->  ', error);
              });
              
            });

          }

          // burada socket bağlantısı offline olarak girsek bile otomatik-hatasız olarak kuruluyor.
          // ileride online olduğumuz zaman socket aktif oluyor.
          socket.emit('login', { uid: user.uid });

      	}else{
          console.log('LOGIN MODE: AUTH');
      		this.props.navigation.navigate('Auth');
      	}
  		});
	}

	render() {
		return(
			<View style={styles.container}>
	     <Text>Loading..</Text>
				<ActivityIndicator size='large' />
			</View>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
