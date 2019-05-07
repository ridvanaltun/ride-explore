// Elements
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { Location, Permissions, IntentLauncherAndroid, MapView } from 'expo';
import firebase from 'firebase';
import Modal from 'react-native-modal';

import _ from 'lodash';

// Constants
import MapConst from '../../../constants/Map';

// Components
import RefreshButton from './components/RefreshButton';
import MyLocationButton from './components/MyLocationButton';
import LocationPermissionFalsePage from './components/LocationPermissionFalsePage';
import LocationServiceFalsePage from './components/LocationServiceFalsePage';
import ServerConnectionFalsePage from './components/ServerConnectionFalsePage';

// Redux
import { connect } from 'react-redux';
import { setServiceStatus, setPermissionStatus, setPersonData, setMapRegion, setLocation
} from '../../../redux/collection';

const mapStateToProps = (state) => {
  return{
    socketID: state.socketID,
    personData: state.personData,
    mapRegion: state.mapRegion,
    permissionStatus: state.permissionStatus,
    serviceStatus: state.serviceStatus,
    isServerConnectionOk: state.isServerConnectionOk,
    onlineUserList: state.onlineUserList,
    location: state.location,
    applyMapRegion: state.applyMapRegion
  };
}

const mapDispatchToProps = (dispatch) => {
  return{
    setPersonData: (object) => { dispatch(setPersonData(object)) } ,
    setMapRegion: (mapRegion) => { dispatch(setMapRegion(mapRegion)) },
    setPermissionStatus: (object) => { dispatch(setPermissionStatus(object)) } ,
    setServiceStatus: (object) => { dispatch(setServiceStatus(object)) } ,
    setLocation: (location) => { dispatch(setLocation(location)) }
  };
}

class  ExploreScreen extends React.Component {
  static navigationOptions = {
    title: 'Explore Other Riders',
    header: null,
  };

  constructor(props) {
    super(props);
    this.state={
      keyForForceUpdateMap: new Date(),
      keyForForceUpdatePins: new Date(),
      colorListenerObject: firebase.database().ref('/users/' + this.props.personData.uid + '/settings/color/'),
      mapThemeListenerObject: firebase.database().ref('/users/' + this.props.personData.uid + '/settings/theme'),
      isUserModalVisible: false,
      user: { }
    }
    this.userRef = [];
    this.mapRef;
    this.markerRef;
  }

  componentDidMount(){
    this.colorListener();
    this.mapThemeListener();
  }

  componentWillUnmount(){
    this.state.colorListenerObject.off('value');
    this.state.mapThemeListenerObject.off('value');
  }

  componentWillMount(){
    this.getLocationAsync();
  }

  colorListener = () => {
    this.state.colorListenerObject.on('value', snapshot => {
      // meaning -> pass the first call
      if(this.markerRef != undefined){
        // Marker elementlerini güncellemek için key özelliğini değiştiriyoruz.
        // Bu workarond dışında başka bir yöntem yok.
        this.setState({ keyForForceUpdatePins: new Date() });
      }
    });  
  }

  mapThemeListener = () => {
    this.state.mapThemeListenerObject.on('value', snapshot => {
      // meaning -> pass the first call
      if(this.mapRef != undefined){
        // Marker elementlerini güncellemek için key özelliğini değiştiriyoruz.
        // Bu workarond dışında başka bir yöntem yok.
        this.setState({ keyForForceUpdateMap: new Date() });
      }
    });
  }

  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted'){
      await this.props.setPermissionStatus({ ...this.props.permissionStatus, location: false });
      console.log('LOCATION PERMISSON STATUS => ', 'false');
    }
    else if(await Location.hasServicesEnabledAsync() == false){
      await this.props.setServiceStatus({ ...this.props.serviceStatus, location: false });
      console.log('LOCATION SERVICE STATUS => ', 'false');
    }
    else{
      await this.props.setPermissionStatus({ ...this.props.permissionStatus, location: true});
      await this.props.setServiceStatus({ ...this.props.serviceStatus, location: true });

      let location = await Location.getCurrentPositionAsync({});

      // delta --> how much zoom
      await this.props.setMapRegion({
        latitude:location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: MapConst.LATITUDE_DELTA,
        longitudeDelta: MapConst.LONGITUDE_DELTA
      });
    }
  }

  // Chat problemi çözüldükten sonra grup kurma sistemi eklenecek, haritadanın sol alt köşesinde
  // Grup üyeleri online durumlarıyla birlikte render edilecekler
  // ref --> https://www.scaledrone.com/blog/react-native-maps-tutorial-find-my-friends/

  /*

      member: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,1)',
      borderRadius: 20,
      height: 30,
      marginTop: 10,
    },
    memberName: {
      marginHorizontal: 10,
    },
    avatar: {
      height: 30,
      width: 30,
      borderRadius: 15,
    }
  */

/*
  createMembers = () => {
    const {members} = this.state;
    return members.map(member => {
      const {name, color} = member.authData;
      return (
        <View key={member.id} style={styles.member}>
          <View style={[styles.avatar, {backgroundColor: color}]}/>
          <Text style={styles.memberName}>{name}</Text>
        </View>
      );
    });
  }
*/

  renderUserModal = () => {
    return(
      <Modal 
        isVisible={this.state.isUserModalVisible}
        onBackButtonPress={() => this.setState({ isUserModalVisible: false })}
        onBackdropPress={() => this.setState({ isUserModalVisible: false })}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalContentTitle}>{this.state.user.name + ' ' + this.state.user.surname}</Text>
          <Image 
            style={styles.userImage}
            //defaultSource={defaultProfileImage}
            source={{ uri: this.state.user.image_minified }}
          />
          <Text style={{ padding: 10 }}>{this.state.user.about}</Text>
          <View style={styles.modalButtonContainer}>
            <Button
              onPress={() => {
                this.setState({ isUserModalVisible: false });
                this.props.navigation.navigate('Person', this.state.user);
              }}
              title='Profile'
              titleStyle={{ color: 'black' }} 
              type='clear' 
              buttonStyle={{ padding: 10 }}
            />
            <Button
              onPress={() => {
                this.setState({ isUserModalVisible: false });
                this.props.navigation.navigate('PersonalChat', this.state.user);
              }}
              title='Chat'
              titleStyle={{ color: 'black' }} 
              type='clear' 
              buttonStyle={{ padding: 10 }}
            />
            <Button
              onPress={() => this.setState({ isUserModalVisible: false })}
              title='Close'
              titleStyle={{ color: 'red' }} 
              type='clear' 
              buttonStyle={{ padding: 10 }}
            />
          </View>
        </View>
      </Modal>
    );
  }

  createMarkers = () => {
    // if we not logged-in don't show any other users data on map
    if(this.props.socketID){
      // we already locally crete our marker, no need another.
      let users = this.props.onlineUserList;
      delete users[this.props.socketID];

      const followList = this.props.personData.follows;
      
      const usersWithLocation = _.filter(this.props.onlineUserList, (user) => {
        // if users no location data or uid we not use them
        if(!!user.uid && (!!user.latitude || !!user.longitude)){
          // is user in our follow list?
          const isFollowed = followList.some(followed => followed == user.uid);
          user.isFollowed = isFollowed;
          return user;
        }
      });

      return usersWithLocation.map( (user, index) => {
        return (
          <MapView.Marker
            key={index}
            ref={ref => this.userRef[index] = ref}
            identifier={user.uid}
            title={user.name + " " + user.surname}
            timestamp={0}
            description={user.about.length > 25 ? user.about.substring(0, 24) + '...' : user.about}
            coordinate={{longitude: user.longitude, latitude: user.latitude}}
            pinColor={user.isFollowed === true ? this.props.personData.settings.color.followsPin : this.props.personData.settings.color.othersPin}
            //onPress={(data)=>{ console.log(data);}}
            onCalloutPress={() => {

              this.setState({ 
                isUserModalVisible: true,
                user: {
                  index: index,
                  uid: user.uid,
                  name: user.name, 
                  surname: user.surname,
                  about: user.about,
                  image_minified: user.image_minified
                }
              });

              // harita üstünde modal açıldığı zaman kullanıcı balonunu gizle
              if(this.userRef[this.state.user.index] != undefined){
                this.userRef[this.state.user.index].hideCallout();
              }

            }}
          />
        );
      });
    }
  }

  // this function can't handling.. causes error, endless loop etc.
  handleRegionChangeComplete = (region) => {
    if(region.longitude != MapConst.initialRegion.longitude){
      this.props.setMapRegion({
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: region.latitudeDelta,
        longitudeDelta: region.longitudeDelta
      }); 
    }
  }

  handleOnMapReady = () => {
    console.log('Map Ready.');
  }

  handleOnKmlReady = () => {
    console.log('Kml Ready.');
    /*
      Kml nedir? Bir dosya tipi.
      Haritaya 3D binalar eklemek vs mümkün.
      kmlSource özelliğine dosya verip 3d yapılar render etmek mümkün.
      Bu fonksiyon kmlSource tanımlanmadan hiç çağrılmayacak.
    */
  }

  render() {

    const { personData, mapRegion, location } = this.props;

    if(this.props.isServerConnectionOk == false) { return(<ServerConnectionFalsePage />); }
    else if(this.props.serviceStatus.location == false) { return(<LocationServiceFalsePage />); }
    else if(this.props.permissionStatus.location == false) { return(<LocationPermissionFalsePage />); }
    else
    {
      return (

        <View style={{ flex: 1 }}>
          {this.renderUserModal()}
          <MapView
            loadingEnabled
            ref={(ref) => this.mapRef = ref}
            key={this.state.keyForForceUpdateMap}
            //showsUserLocation
            //showsMyLocationButton
            onMapReady={() => this.handleOnMapReady()}
            onKmlReady={() => this.handleOnKmlReady()}
            style={styles.map}
            region={this.props.applyMapRegion === true ? mapRegion : null}
            customMapStyle={this.props.personData.settings.theme === 'retro' ? MapConst.THEMES.RETRO : null}
            initialRegion={MapConst.initialRegion}
            rotateEnabled={false} //sağa sola çevirebilme
            //scrollEnabled ={false} //sağa sola gidemiyor
            //minZoomLevel={} //0-20
            //maxZoomLevel={} //0-20
            //zoomEnabled={false}
            provider={MapView.PROVIDER_GOOGLE} // mapStyle for ios support
            onRegionChangeComplete={(region) => this.handleRegionChangeComplete(region)} // dragging the map
        >

        <View key={this.state.keyForForceUpdatePins}>
          <MapView.Marker
            // our map marker
            ref={ref => this.markerRef = ref}
            key={'itdoesntmatter'}
            identifier={personData.uid} //user uid adress
            title={personData.name + " " + personData.surname}
            coordinate={location}
            timestamp={0} // bu coords bilgisi ne zaman olsuturuldu bilgisi
            description={personData.about.length > 25 ? personData.about.substring(0,24) + '...' : personData.about}
            //onPress={data => {console.log(data);}} // onpress sadece marker'a tıklayınca çalışıyor
            onCalloutPress={ () => { this.props.navigation.navigate('Profile');}} // ballon'da çalışıyor
            // pin colors -> https://github.com/react-native-community/react-native-maps/issues/887#issuecomment-324530282
            pinColor={this.props.personData.settings.color.myPin}
          />
          {this.createMarkers()}
        </View>

        </MapView>
        <View style={styles.buttonContainer}>
          <View style={{ alignItems: 'center' }}>
            <RefreshButton />
            <MyLocationButton />
          </View>
        </View>
      </View>
      );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExploreScreen);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginLeft: 5,
    marginBottom: 5
  },
  modalContent: {
    //opacity: 0.2,
    //backgroundColor: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  modalButtonContainer: {
    flex:1,
    flexDirection:'row',
    marginTop:10,
    marginBottom:15
  },
  userImage: {
    borderColor: 'transparent',
    borderRadius: 85,
    borderWidth: 3,
    height: 150,
    marginBottom: 15,
    width: 150,
  }
});