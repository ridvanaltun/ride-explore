import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput, Switch } from 'react-native';
import { Button, Icon, ListItem, Card } from 'react-native-elements';
import firebase from 'firebase';
import Moment from 'moment';

// Modals
import Modal from 'react-native-modal';
import DateTimePicker from 'react-native-modal-datetime-picker';

// Constants
import Fonts from '../../../constants/Fonts';

// Redux
import { connect } from 'react-redux';
import { setPersonData } from '../../../redux/collection';

const mapStateToProps = (state) => {
  return{
    personData: state.personData
  };
}

const mapDispatchToProps = (dispatch) => {
  return{
    setPersonData: (text) => { dispatch(setPersonData(text)) }
  };
}

class RegisterScreen extends React.Component {
  static navigationOptions = {
    title: 'Registration',
    headerTransparent: true,
    headerStyle: { borderBottomWidth: 0 }
    //header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      uid: this.props.navigation.getParam('uid', false),
      isDateTimePickerVisible: false,
      isAboutModalVisible: false,
      about: '',
      terms: true,
      notification: true
    }
  }

  pickImage = () => {
    console.log('pick image..');
  }

  onRegisterPress = () => {

    firebase.database().ref('/users/' + this.state.uid)
      .update({
        verified: true
      })
      .then(() => this.props.navigation.navigate('Main'))
      .catch((error) => console.log('ERROR -> [FIREBASE] --> [onRegisterPress] ---> ', error));
  }

  handleDatePicked = date => {
    
    firebase.database().ref('/users/' + this.props.personData.uid)
      .update({ birthdate: Moment(date).format('D MMM YY') })
      .then(() => this.setState({ isDateTimePickerVisible: false }))
      .catch(err => console.log('[ERROR] -> [FIRBASE] --> [handleDatePicked] ---> ', err));
  };

  renderDataTimePicker = () => {
    return(
      <DateTimePicker
        isVisible={this.state.isDateTimePickerVisible}
        onConfirm={(date) => this.handleDatePicked(date)}
        onCancel={() => this.setState({ isDateTimePickerVisible: false })}
      />
    );
  }

  render(){
    return(
       <View style={styles.container}>
        {this.renderDataTimePicker()}
          <TouchableOpacity style={styles.userImageContainer} onPress={() => this.pickImage()}>
            <Image
              style={styles.userImage}
              //defaultSource={defaultProfileImage}
              source={{ uri: this.props.personData.image_minified }}
            />
          </TouchableOpacity>
        <View style={{ alignItems: 'flex-end' }}>
        <Card>
          <ListItem
            title="Pick Your Birthdate"
            containerStyle={styles.listItemContainer}
            rightElement={
              <Icon
                type='antdesign'
                name="checkcircle"
                size={25}
                color="blue"
                iconStyle={{ paddingRight: 10 }} 
              />
            }
          />

          <ListItem
            onPress={() => console.log('asd')}
            title="Write About Yourself"
            containerStyle={styles.listItemContainer}
            rightElement={
              <Icon
                type='antdesign'
                name="checkcircle"
                size={25}
                color="blue"
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
      {/*
        Buradaki hata mesajını projeye eklemek gerekiyor
        <Text style={[styles.errorMessage, signUpError && { color: 'black' }]}>Error logging in. Please try again.</Text>
        <Text style={[styles.errorMessage, signUpError && { color: 'black' }]}>{signUpErrorMessage}</Text>   
      */}
        </View>
    );
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);

const styles = StyleSheet.create({
  errorMessage: {
    fontSize: 12,
    marginTop: 10,
    color: 'transparent',
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
    //borderWidth: 0.5,
    //borderColor: '#ECECEC',
  }
});