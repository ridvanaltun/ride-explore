import React from 'react';
import { Card, Icon, Button } from 'react-native-elements';
import Modal from 'react-native-modal';

import {
  Image,
  ImageBackground,
  TouchableOpacity,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Alert,
  TextInput
} from 'react-native';

import Emoji from 'react-native-emoji';

import firebase from 'firebase';

// Lib
import PickImage from '../../../lib/PickImage';

// Components
import SettingsButton from './components/SettingsButton';

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

class ProfileScreen extends React.Component {
  static navigationOptions = () => {
    return{
      //title: 'Your Profile',
      //headerTitle: (<Text> asd</Text>),
      //headerTitle: <Text style={{color: 'white', fontSize: 18}}>Test</Text>,
      headerRight: <SettingsButton />,
      headerTransparent: true,
      headerStyle: { borderBottomWidth: 0 }
    };
  };

  constructor(props){
    super(props);
    this.state = {
      isChangeNameModalVisible: false,
      isChangeAboutModalVisible: false,
      name: '',
      surname: '',
      about: ''
    }
  }

  onPressPlace = () => {
    console.log('place')
  }

  onChangeNamePress = () => {
    if(this.state.name != ''){
      firebase.database().ref('/users/' + this.props.personData.uid)
        .update({ name: this.state.name })
        .catch(err => console.log('onChangeNamePress Firebase Error: ', err));
      this.setState({ isChangeNameModalVisible: false });
    }

    if(this.state.surname != ''){
      firebase.database().ref('/users/' + this.props.personData.uid)
        .update({ surname: this.state.surname })
        .catch(err => console.log('onChangeNamePress Firebase Error: ', err));
      this.setState({ isChangeNameModalVisible: false });
    }

    if(this.state.name === '' && this.state.surname === ''){
      Alert.alert('Wrong Entry', 'You need set at least a name or surname.');
    }
    
  }

  onChangeAboutPress = (about) => {
    if(this.state.about != ''){
      firebase.database().ref('/users/' + this.props.personData.uid)
        .update({ about: this.state.about })
        .catch(err => console.log('onChangeAboutPress Firebase Error: ', err));
      this.setState({ isChangeAboutModalVisible: false });
    }else{
      Alert.alert('Wrong Entry', 'You need an about text.');
    }
  }

  renderHeader = () => {

    const name = (this.props.personData.name + ' ' + this.props.personData.surname).toUpperCase();

    return (
      <View style={styles.headerContainer}>
        <ImageBackground
          style={styles.headerBackgroundImage}
          blurRadius={10}
          source={require('../../../assets/images/header-background.png')}
        >
          <View style={styles.headerColumn}>
            <TouchableOpacity style={styles.userImageContainer} onPress={() => PickImage(this.props.personData.uid)}>
              <Image
                style={styles.userImage}
                defaultSource={require('../../../assets/images/default-profile-picture.png')}
                source={{ uri: this.props.personData.image_minified }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({ isChangeNameModalVisible: true })}>
              <Text style={styles.userNameText}>{name}</Text>
            </TouchableOpacity>
            <View style={styles.userAddressRow}>
              <View>
                <Icon
                  name='place'
                  underlayColor='transparent'
                  iconStyle={styles.placeIcon}
                  onPress={this.onPressPlace}
                />
              </View>
              <View style={styles.userCityRow}>
                <Text style={styles.userCityText}>
                  {this.props.personData.place}  
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    )
  }

  renderFooter = () => {
    return(
      <TouchableOpacity onPress={() => this.setState({ isChangeAboutModalVisible: true })}>
        <Text style={styles.about}>{this.props.personData.about}</Text>
      </TouchableOpacity>
    );
  }

  renderChangeNameModal = () => {
    return(
      <Modal
        isVisible={this.state.isChangeNameModalVisible}
        onBackButtonPress={() => this.setState({ isChangeNameModalVisible: false })}
        onBackdropPress={() => this.setState({ isChangeNameModalVisible: false })}
      >
        <View style={styles.content}>
          <View style={styles.modalHeader}> 
            <Text style={styles.contentTitle}>Change Your Name </Text>
            <Emoji name='volcano' style={{ fontSize: 20 }} />
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.inputHeader}>Name</Text>
            <TextInput 
              placeholder={this.props.personData.name}
              placeholderTextColor='gray'
              editable={true}
              maxLength={10}
              onChangeText={(text) => this.setState({ name: text })}
              style={styles.input}
            />
            <Text style={styles.inputHeader}>Surname</Text>
            <TextInput 
              placeholder={this.props.personData.surname}
              placeholderTextColor='gray'
              editable={true}
              maxLength={10}
              onChangeText={(text) => this.setState({ surname: text })}
              style={styles.input}
            />
          </View>
          <View style={styles.modalButtonContainer}>
            <Button
              onPress={() => this.onChangeNamePress()}
              type='clear'
              title='Apply'
            />
            <Button
              onPress={() => this.setState({ isChangeNameModalVisible: false })}
              type='clear'
              title='Close'
          />
          </View>
        </View>
      </Modal>
    );
  }

  renderChangeAboutModal = () => {
    return(
      <Modal
        isVisible={this.state.isChangeAboutModalVisible}
        onBackButtonPress={() => this.setState({ isChangeAboutModalVisible: false })}
        onBackdropPress={() => this.setState({ isChangeAboutModalVisible: false })}
      >
        <View style={styles.content}>
          <View style={styles.modalHeader}> 
            <Text style={styles.contentTitle}>Change Your About </Text>
            <Emoji name='dog' style={{ fontSize: 20 }} />
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.inputHeader}>About</Text>
            <TextInput 
              placeholder={this.props.personData.about}
              placeholderTextColor='gray'
              editable={true}
              maxLength={140}
              onChangeText={(text) => this.setState({ about: text })}
              multiline={true}
              numberOfLines={5}
              style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
            />
          </View>
          <View style={styles.modalButtonContainer}>
            <Button
              onPress={() => this.onChangeAboutPress()}
              type='clear'
              title='Apply'
            />
            <Button
              onPress={() => this.setState({ isChangeAboutModalVisible: false })}
              type='clear'
              title='Close'
            />
          </View>
        </View>
      </Modal>
    );
  }

  render() {
    return (
      <ScrollView style={styles.scroll}>
        <View style={styles.container}>
          <Card containerStyle={styles.cardContainer}>
            {this.renderChangeNameModal()}
            {this.renderChangeAboutModal()}
            {this.renderHeader()}
            {this.renderFooter()}
          </Card>
        </View>
      </ScrollView>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    borderWidth: 0,
    margin: 0,
    padding: 0,
  },
  container: {
    flex: 1,
  },
  headerBackgroundImage: {
    paddingBottom: 20,
    paddingTop: 35,
  },
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
  },
  headerColumn: {
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        alignItems: 'center',
        elevation: 1,
        marginTop: -1,
      },
      android: {
        alignItems: 'center',
      },
    }),
  },
  placeIcon: {
    color: 'white',
    fontSize: 26,
  },
  scroll: {
    backgroundColor: '#FFF',
  },
  userAddressRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  userCityRow: {
    backgroundColor: 'transparent',
  },
  userCityText: {
    color: '#A5A5A5',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  userImage: {
    borderColor: '#01C89E',
    borderRadius: 85,
    borderWidth: 3,
    height: 150,
    marginBottom: 15,
    width: 150,
  },
  userImageContainer: {
    borderColor: 'transparent',
    borderRadius: 85,
    height: 150,
    marginBottom: 15,
    width: 150,
  },
  userNameText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    paddingBottom: 8,
    textAlign: 'center',
  },
  about: {
    fontSize:16,
    color: '#696969',
    marginTop:10,
    textAlign: 'center'
  },
  content: {
    backgroundColor: 'white',
    padding: 22,
    //justifyContent: 'center',
    //alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalHeader: {
    flexDirection: 'row'
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12
  },
  modalButtonContainer : {
    flexDirection: 'row',
    margin: 12
  },
  modalContent: {
    fontSize: 15,
    padding: 15
  },
  inputHeader: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  input: {
    padding: 10,
    margin: 15,
    height: 40,
    borderColor: '#7a42f4',
    borderWidth: 1
   }
})