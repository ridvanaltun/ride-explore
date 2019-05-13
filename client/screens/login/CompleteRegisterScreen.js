import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import { Button, Icon, ListItem, Card } from 'react-native-elements';
import { Location } from 'expo';
import firebase from 'firebase';
import Moment from 'moment';

import PickImage from '../../lib/PickImage';

// Modals
import Modal from 'react-native-modal';
import DateTimePicker from 'react-native-modal-datetime-picker';

// Constants
import Fonts from '../../constants/Fonts';

// Redux
import { connect } from 'react-redux';
import { setPersonData, setServiceStatus, setPermissionStatus, setLocation } from '../../redux/collection';

const mapStateToProps = (state) => {
  return{
    personData: state.personData,
    permissionStatus: state.permissionStatus,
    serviceStatus: state.serviceStatus
  };
}

const mapDispatchToProps = (dispatch) => {
  return{
    setPersonData: (text) => { dispatch(setPersonData(text)) },
    setServiceStatus: (object) => { dispatch(setServiceStatus(object)) },
    setLocation: (object) => { dispatch(setLocation(object)) },
    setPermissionStatus: (object) => { dispatch(setPermissionStatus(object)) }
  };
}

class CompleteRegisterScreen extends React.Component {
  static navigationOptions = {
    title: 'Registration',
    headerTransparent: true,
    headerStyle: { borderBottomWidth: 0 }
  };

  constructor(props) {
    super(props);
    this.state = {
      uid: this.props.navigation.getParam('uid', false),
      isDateTimePickerVisible: false,
      isAboutModalVisible: false,
      about: '',
      birthdate: '',
      terms: true,
      notification: true
    }
  }

  onRegisterPress = () => {

    if(this.state.about !== '' && this.state.birthdate !== '' && this.state.terms === true){
      firebase.database().ref('/users/' + this.state.uid)
        .update({
          verified: true,
          birthdate: this.state.birthdate,
          about: this.state.about,
          online: true,
          place: 'Izmir, Turkey',
          settings: {
            color: {
              followsPin: 'red',
              myPin: 'green',
              othersPin: 'gold'
            },
            connect: {
              facebook: {
                verified: false
              },
              instagram: {
                verified: false
              },
              spotify: {
                verified: false
              }
            },
            hide: false,
            language: 'Turkish',
            theme: 'normal',
            privacy: {
              birthdate: 'Everyone',
              onlineStatus: 'Everyone',
              profilePicture: 'Everyone'
            }
          }

        })
        .then(() => {
          this.listenerPersonData();
          this.listenerLocation();
          this.props.navigation.navigate('Main');
        })
        .catch((error) => console.log('ERROR -> [FIREBASE] --> [onRegisterPress] ---> ', error));

      }else if(this.state.terms === false){
        Alert.alert('Terms is not selected!', 'You need to accept our terms.');
      }else if(this.state.birthdate === ''){
        Alert.alert('Birthdate is not selected!', 'You need to select your birthdate.');
      }else if(this.state.about === ''){
        Alert.alert('About is null', 'You need to write an about text.');
      }

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

  listenerPersonData = () => {

    firebase.database().ref('/users/').child(this.state.uid).on('value', snapshot => {

        this.props.setPersonData(snapshot.val());

        socket.emit('update-person-data', { 
          name: snapshot.val().name,
          surname: snapshot.val().surname,
          about: snapshot.val().about || 'Undefiend',
          image_original: snapshot.val().image_original,
          image_minified: snapshot.val().image_minified
        });

        console.log('SOCKET: OUR PERSONAL DATA SENDED!');
      });
  }

  renderDataTimePicker = () => {
    return(
      <DateTimePicker
        isVisible={this.state.isDateTimePickerVisible}
        onConfirm={(date) => this.setState({ birthdate: Moment(date).format('D MMM YY'), isDateTimePickerVisible: false })}
        onCancel={() => this.setState({ isDateTimePickerVisible: false })}
      />
    );
  }

  renderAboutModal = () => {
    return(
      <Modal
        isVisible={this.state.isAboutModalVisible}
        onBackButtonPress={() => this.setState({ isAboutModalVisible: false })}
        onBackdropPress={() => this.setState({ isAboutModalVisible: false })}
      >
        <View style={{ backgroundColor: "white", padding: 22, borderRadius: 4, borderColor: "rgba(0, 0, 0, 0.1)" }}>
          <Text style={{ fontSize: 20, marginBottom: 12 }}>Change Your About</Text>
          <View style={{ fontSize: 15, padding: 15 }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>About</Text>
            <TextInput 
              placeholder={this.props.personData.about}
              placeholderTextColor='gray'
              editable={true}
              maxLength={140}
              onChangeText={(text) => this.setState({ about: text })}
              multiline={true}
              numberOfLines={5}
              style={{ height: 120, textAlignVertical: 'top', padding: 10, margin: 15, borderColor: "#7a42f4", borderWidth: 1 }}
            />
          </View>
          <View style={{ flexDirection: 'row', margin: 12 }}>
            <Button
              onPress={() => this.setState({ isAboutModalVisible: false})}
              type='clear'
              title="Apply"
            />
            <Button
              onPress={() => this.setState({ isAboutModalVisible: false })}
              type='clear'
              title="Close"
            />
          </View>
        </View>
      </Modal>
    );
  }

  render(){
    return(
       <View style={styles.container}>
        {this.renderDataTimePicker()}
        {this.renderAboutModal()}
        <TouchableOpacity style={styles.userImageContainer} onPress={() => PickImage(this.props.personData.uid)}>
          <Image
            style={styles.userImage}
            //defaultSource={defaultProfileImage}
            source={{ uri: this.props.personData.image_minified }}
          />
        </TouchableOpacity>
        <View style={{ alignItems: 'flex-end' }}>
        <Card>
          <ListItem
            onPress={() => this.setState({ isDateTimePickerVisible: true })}
            title="Pick Your Birthdate"
            containerStyle={styles.listItemContainer}
            rightElement={
              <Icon
                type='antdesign'
                name={this.state.birthdate === '' ? 'checkcircleo' : 'checkcircle'}
                size={25}
                color={this.state.birthdate === '' ? "#B2DFD8" : "#41AD49"}
                iconStyle={{ paddingRight: 10 }} 
              />
            }
          />

          <ListItem
            onPress={() => this.setState({ isAboutModalVisible: true })}
            title="Write About Yourself"
            containerStyle={styles.listItemContainer}
            rightElement={
              <Icon
                type='antdesign'
                name={this.state.about === '' ? 'checkcircleo' : 'checkcircle'}
                size={25}
                color={this.state.about === '' ? "#B2DFD8" : "#41AD49"}
                iconStyle={{ paddingRight: 10 }} 
              />
            }
          />

          <ListItem
            hideChevron
            title="Notifications"
            containerStyle={styles.listItemContainer}
            rightElement={
              <Switch
                onValueChange={(value) => this.setState({ notification: value })}
                value={this.state.notification}
              />
            }
          />

          <ListItem
            hideChevron
            title="Terms"
            containerStyle={styles.listItemContainer}
            rightElement={
              <Switch
                onValueChange={(value) => this.setState({ terms: value })}
                value={this.state.terms}
              />
            }
          />

          <Button 
            type='clear'
            title='Complete Registration'
            onPress={() => this.onRegisterPress()}
            style={{ marginTop: 10 }}
          />

          </Card>

        </View>
      </View>
    );
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(CompleteRegisterScreen);

const styles = StyleSheet.create({
  errorMessage: {
    fontSize: 12,
    marginTop: 10,
    color: "transparent",
    fontFamily: Fonts.lato.base
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 60,
  },
  userImageContainer: {
    borderColor: "#01C89E",
    borderRadius: 85,
    height: 150,
    marginBottom: 15,
    width: 150,
  },
  userImage: {
    borderColor: "transparent",
    borderRadius: 85,
    borderWidth: 3,
    height: 150,
    marginBottom: 15,
    width: 150,
  },
  listItemContainer: {
    height: 40,
    width: 280
  }
});