import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput, Switch } from 'react-native';
import { Button, Icon, ListItem, Card } from 'react-native-elements';
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
import { setPersonData } from '../../redux/collection';

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
      terms: true,
      notification: true
    }
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
  }

  onChangeAboutPress = () => {
    if(this.state.about != ''){

      firebase.database().ref('/users/' + this.props.personData.uid)
        .update({ about: this.state.about })
        .catch(err => console.log('ERROR -> [FIREBASE] -> [onChangeAboutPress] ---> ', err));

      this.setState({ isAboutModalVisible: false });

    }else{
      Alert.alert('About Text', 'About text can not be empty.');
    }
  }

  renderDataTimePicker = () => {
    return(
      <DateTimePicker
        isVisible={this.state.isDateTimePickerVisible}
        onConfirm={(date) => this.handleDatePicked(date)}
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
        <View style={{ backgroundColor: "white", padding: 22, borderRadius: 4, borderColor: "rgba(0, 0, 0, 0.1)", }}>
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
              onPress={() => this.onChangeAboutPress()}
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
                name={this.props.personData.birthdate === undefined ? 'checkcircleo' : 'checkcircle'}
                size={25}
                color={this.props.personData.birthdate === undefined ? "#B2DFD8" : "#41AD49"}
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
                name={this.props.personData.about === undefined ? 'checkcircleo' : 'checkcircle'}
                size={25}
                color={this.props.personData.about === undefined ? "#B2DFD8" : "#41AD49"}
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