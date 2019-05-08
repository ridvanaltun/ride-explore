import React, { Component } from 'react';
import { ScrollView, Switch, StyleSheet, Text, View, Linking, Share, Platform, TouchableOpacity, Image } from 'react-native';
import { Avatar, ListItem, Button } from 'react-native-elements';
import Emoji from 'react-native-emoji';
import Moment from 'moment';
import firebase from 'firebase';

// Constants
import Information from '../../../constants/Information';
import Colors from '../../../constants/Colors';

// Modals
import Modal from 'react-native-modal';
import ModalSelector from 'react-native-modal-selector';
import DateTimePicker from 'react-native-modal-datetime-picker';
import DialogInput from 'react-native-dialog-input';

// Components
import BaseIcon from './components/Icon';
import Chevron from './components/Chevron';
import InfoText from './components/InfoText';

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

class SettingsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return{
      title: 'Settings',
      headerRight: (
        <Button 
          containerStyle={{ marginRight: 10 }}
          title='Log out'
          onPress={() => {
            firebase.auth().signOut();
            socket.disconnect();
            socket.connect();
            navigation.navigate('Login');
          }}
          type='clear'
        />
        )
    };
  }; 

  constructor(props){
    super(props);
    this.state={
      isAvatarModalVisible: false,
      isDateTimePickerVisible: false,
      isAboutUsPopUpVisible: false,
      isTermsAndPoliciesModalVisible: false,
      isThanksModalVisible: false,
      isDeleteAccountModalVisible: false,
      isDeleteAccountConfirmModalVisible: false,
      languageModal: {
        visible: false,
        list: [
         { key: 0, section: true, label: 'Change Your Language' },
         { key: 1, label: 'English' },
         { key: 2, label: 'German' },
         { key: 3, label: 'Turkish' },
         { key: 4, label: 'Dutch' }
        ]
      },
      profilePicturePrivacyModal: {
        visible: false,
        list: [
         { key: 0, section: true, label: 'Privacy Of Your Profile Picture' },
         { key: 1, label: 'Everyone' },
         { key: 2, label: 'Follows' },
         { key: 3, label: 'Just Me' }
        ]
      },
      birthDatePrivacyModal: {
        visible: false,
        list: [
         { key: 0, section: true, label: 'Privacy Of Your Birthdate' },
         { key: 1, label: 'Everyone' },
         { key: 2, label: 'Follows' },
         { key: 3, label: 'Just Me' }
        ]
      },
      onlineStatusPrivacyModal: {
        visible: false,
        list: [
         { key: 0, section: true, label: 'Privacy Of Your Online Status' },
         { key: 1, label: 'Everyone' },
         { key: 2, label: 'Follows' },
         { key: 3, label: 'Just Me' }
        ]
      },
      pinColorScheme: {
        myPinColorIndex: 0,
        followsPinColorIndex: 0,
        othersPinColorIndex: 0,
        colorList: ['red', 'gold', 'green', 'navy', 'aqua', 'violet', 'indigo']  
      }
    }
  }

  componentDidMount(){
    this.checkVeryFirstPinColorValues();
  }

  checkVeryFirstPinColorValues = () => {
    // sayfa acildiginda cekilen renk 'red' yani colorList listesinin ilk elemani ise..
    // Bu islem neden yapiliyor? ilk gelen renk kirmizi ise bir sonraki renk icin bir kereligine 2 kez tusa basmak gerekiyor..
    if(this.props.personData.settings.color.myPin == 'red'){
      this.setState({ pinColorScheme: {...this.state.pinColorScheme, myPinColorIndex: 1}});
    }

    if(this.props.personData.settings.color.followsPin == 'red'){
      this.setState({ pinColorScheme: {...this.state.pinColorScheme, followsPinColorIndex: 1}});
    }
  }

  onChangePushNotifications = (value) => {
    firebase.database().ref('/users/' + this.props.personData.uid + '/settings/')
      .update({ notification: value })
      .catch(err => console.log('onChangePushNotifications Firebase Error: ', err));
  }

  onChangeHideStatus = (value) => {
    firebase.database().ref('/users/' + this.props.personData.uid + '/settings/')
      .update({ hide: value })
      .catch(err => console.log('onChangeHideStatus Firebase Error: ', err));
  }

  handleDatePicked = date => {
    
    firebase.database().ref('/users/' + this.props.personData.uid)
      .update({ birthdate: Moment(date).format('D MMM YY') })
      .then(() => this.setState({ isDateTimePickerVisible: false }))
      .catch(err => console.log('handleDatePicked Firebase Error: ', err));
  };

  onEmailUsPress = () => {
    Linking.openURL(`mailto://${Information.email}?subject=subject&body=body`)
    .catch(err =>
      console.log('Error:', err)
    )
  }

  onSendFeedBackPress = () => {
    Linking.openURL(`mailto://${Information.email}?subject=subject&body=body`)
      .catch(err => console.log('Error:', err));
  }

  onHelpToTranstlatePress = () => {
    Linking.openURL(Information.transtlate_url);
  }

  onShareProfilePress = async () => {
    /*
      Burada kullanıcının uid adresini bir web API ile web sayfasına get istediği atildiğinda kullanıcı hakkında detay veren
      Bir yapı ve web sayfası tasarlanacak.
    */
    try {
      const result = await Share.share({
        message: 'React Native | A framework for building native apps using React',
        url: Information.share_url,
        title: 'Wow, did you see that?'
      },{
        dialogTitle: 'Share Your Profile Link', // Android only
        excludedActivityTypes: ['com.apple.UIKit.activity.PostToTwitter'] // IOS only
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
          this.setState({ isThanksModalVisible: true });
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  }

  onRateUsPress = () => {
    if(Platform.OS === 'android'){
      Linking.openURL("market://details?id="+Information.android_app_id);
    }else{
      const link = "itms://itunes.apple.com/us/app/apple-store/"+Information.ios_app_id+"?mt=8";
      Linking.canOpenURL(link)
       .then(supported => supported && Linking.openURL(link))
       .catch((err) => console.log(err));
    }
  }

  onMyPinColorPress = () => {

    if(this.state.pinColorScheme.myPinColorIndex <= 6){

      firebase.database().ref('/users/' + this.props.personData.uid + '/settings/color/')
        .update({ myPin: this.state.pinColorScheme.colorList[this.state.pinColorScheme.myPinColorIndex] })
        .catch(err => console.log('onMyPinColorPress Firebase Error: ', err));

      this.setState({ pinColorScheme: {...this.state.pinColorScheme, myPinColorIndex: this.state.pinColorScheme.myPinColorIndex + 1 } });

    }else{

      firebase.database().ref('/users/' + this.props.personData.uid + '/settings/color/')
        .update({ myPin: this.state.pinColorScheme.colorList[0] })
        .catch(err => console.log('onMyPinColorPress Firebase Error: ', err));

      this.setState({ pinColorScheme: {...this.state.pinColorScheme, myPinColorIndex: 1 } });
    }
  }

  onFollowsPinColorPress = () => {

    if(this.state.pinColorScheme.followsPinColorIndex <= 6){

      firebase.database().ref('/users/' + this.props.personData.uid + '/settings/color/')
        .update({ followsPin: this.state.pinColorScheme.colorList[this.state.pinColorScheme.followsPinColorIndex] })
        .catch(err => console.log('onFollowsPinColorPress Firebase Error: ', err));

      this.setState({ pinColorScheme: {...this.state.pinColorScheme, followsPinColorIndex: this.state.pinColorScheme.followsPinColorIndex + 1 } });

    }else{

      firebase.database().ref('/users/' + this.props.personData.uid + '/settings/color/')
        .update({ followsPin: this.state.pinColorScheme.colorList[0] })
        .catch(err => console.log('onFollowsPinColorPress Firebase Error: ', err));
        
        this.setState({ pinColorScheme: {...this.state.pinColorScheme, followsPinColorIndex: 1 } });
    } 
  }

  onOthersPinColorPress = () => {

    if(this.state.pinColorScheme.othersPinColorIndex <= 6){

      firebase.database().ref('/users/' + this.props.personData.uid + '/settings/color/')
        .update({ othersPin: this.state.pinColorScheme.colorList[this.state.pinColorScheme.othersPinColorIndex] })
        .catch(err => console.log('onFollowsPinColorPress Firebase Error: ', err));

      this.setState({ pinColorScheme: {...this.state.pinColorScheme, othersPinColorIndex: this.state.pinColorScheme.othersPinColorIndex + 1 } });

    }else{

      firebase.database().ref('/users/' + this.props.personData.uid + '/settings/color/')
        .update({ othersPin: this.state.pinColorScheme.colorList[0] })
        .catch(err => console.log('onFollowsPinColorPress Firebase Error: ', err));
        
        this.setState({ pinColorScheme: {...this.state.pinColorScheme, othersPinColorIndex: 1 } });
    } 
  }

  onMapThemePress = () => {
    if(this.props.personData.settings.theme === 'normal'){
      firebase.database().ref('/users/' + this.props.personData.uid + '/settings/')
        .update({ theme: 'retro' })
        .catch(err => console.log('onMapThemePress Firebase Error: ', err));
    }else{
      firebase.database().ref('/users/' + this.props.personData.uid + '/settings/')
        .update({ theme: 'normal' })
        .catch(err => console.log('onMapThemePress Firebase Error: ', err)); 
    }
  }

  _accountDeleteProcess = (inputText) => {
    if(inputText === (this.props.personData.uid).substring(0, 8)){
      this.setState({ isDeleteAccountConfirmModalVisible: false });
      console.log('accunt delete process starting..');
      //navigation.navigate('Auth');
      //socket.disconnect();
      //socket.connect();
      /*
        // firebase autontication bölümünden kullanıcıyı siliyoruz
        firebase.auth().currentUser.delete().then(function() {
          console.log('success');
          // basarılı olursa database üstünden silme islemine gecicez
        }).catch(function(error) {
          console.log('fail');
          // eger basarısız olursa tüm işlemin durması lazım
        });

      */
      //
      // firebase logic..
      //
      //firebase.auth().signOut();
    }else{
      console.log('inputText is wrong..');
      Alert.alert('Wrong Input', 'Your entry is wrong..');
    }
  }

  renderDeleteAccountConfirmModal = () => {
    return(
      /* Kod yazan kısmı kalın yazdırmak gerekiyor.. */
      <DialogInput 
        isDialogVisible={this.state.isDeleteAccountConfirmModalVisible}
        title={"Delete Your Account"}
        message={"Write this code: " + (this.props.personData.uid).substring(0, 8) + " to confirm this process."}
        hintInput ={":'("}
        submitInput={ (inputText) => this._accountDeleteProcess(inputText) }
        closeDialog={ () => this.setState({isDeleteAccountConfirmModalVisible: false})}>
      </DialogInput>
    );
  }

  renderDeleteAccountModal = () => {
    return(
      <Modal 
        isVisible={this.state.isDeleteAccountModalVisible}
        onBackButtonPress={() => this.setState({ isDeleteAccountModalVisible: false })}
        onBackdropPress={() => this.setState({ isDeleteAccountModalVisible: false })}
      >

        <View style={styles.content}>
          <Emoji name='scream' style={{ fontSize: 30 }} />
          <Text style={styles.contentTitle}>Are you sure?!</Text>
          <Text>Your all data will be gone.</Text>
            <Button 
              title='DELETE ACCOUNT'
              titleStyle={{ color: 'red' }}
              type='clear'
              onPress={() => this.setState({ isDeleteAccountModalVisible: false, isDeleteAccountConfirmModalVisible: true })}
            />
            <Button 
              title='BACK'
              titleStyle={{ color: 'green' }}
              type='clear'
              onPress={() => this.setState({ isDeleteAccountModalVisible: false })}
            />
        </View>   
      </Modal>
    );
  }

  renderAvatarModal = () => {
    return(
      <Modal 
        isVisible={this.state.isAvatarModalVisible}
        onBackButtonPress={() => this.setState({ isAvatarModalVisible: false })}
        onBackdropPress={() => this.setState({ isAvatarModalVisible: false })}
      >
        <View style={[styles.content, {backgroundColor: 'transparent', padding: 0, borderRadius: 0 }]}>
          <Image
            resizeMode='contain'
            style={{ height: '100%', width: '100%' }}
            source={{ uri: this.props.personData.image_original }}
          />
        </View>   
      </Modal>
    );
  }

  onConnectSpotifyPress = () => {
    console.log('connect spotify..');
  }

  onConnectInstagramPress = () => {
    console.log('connect instagram..');
  }

  onConnectFacebookPress = () => {
    console.log('connect facebook..');
  }

  languageSelectChanged = (label, key) => {
    firebase.database().ref('/users/' + this.props.personData.uid + '/settings/')
      .update({ language: label })
      .catch(err => console.log('languageChanged Firebase Error: ', err));
  }

  profilePicturePrivacyChange = (label, key) => {
    firebase.database().ref('/users/' + this.props.personData.uid + '/settings/privacy/')
      .update({ profilePicture: label })
      .catch(err => console.log('profilePicturePrivacyChange Firebase Error: ', err));
  }

  onlineStatusPrivacyChange = (label, key) => {
    firebase.database().ref('/users/' + this.props.personData.uid + '/settings/privacy/')
      .update({ onlineStatus: label })
      .catch(err => console.log('onlineStatusPrivacyChange Firebase Error: ', err));
  }

  birthDatePrivacyChange = (label, key) => {
    firebase.database().ref('/users/' + this.props.personData.uid + '/settings/privacy/')
      .update({ birthdate: label })
      .catch(err => console.log('birthDatePrivacyChange Firebase Error: ', err));
  }

  renderAboutUsModal = () => {
    return(
      <Modal 
        isVisible={this.state.isAboutUsPopUpVisible}
        style={styles.modal}
        onBackButtonPress={() => this.setState({ isAboutUsPopUpVisible: false })}
        onBackdropPress={() => this.setState({ isAboutUsPopUpVisible: false })}
      >
      <View style={{ flex: 1 }}>
        
        <ScrollView>
          <Text style={styles.aboutHeader}>About Us!</Text>
            <View> 
              <Text style={{ padding: 10 }}>
                {Information.about}
              </Text> 
              <View style={styles.modalButtonContainer}> 
                <Button 
                  title='Email Us!'
                  type='clear'
                  buttonStyle={{ padding: 10 }}
                  onPress={() => { this.onEmailUsPress(); }}
                />     
                <Button 
                  title='Close' 
                  titleStyle={{ color: 'black' }} 
                  type='clear' 
                  buttonStyle={{ padding: 10 }}
                  onPress={() => {this.setState({ isAboutUsPopUpVisible: false });}}
                />
              </View>
            </View>
        </ScrollView>
        </View>
      </Modal>
    );
  }

  renderTermsAndPoliciesModal = () => {
    return(
      <Modal 
        isVisible={this.state.isTermsAndPoliciesModalVisible}
        style={styles.modal}
        onBackButtonPress={() => this.setState({ isTermsAndPoliciesModalVisible: false })}
        onBackdropPress={() => this.setState({ isTermsAndPoliciesModalVisible: false })}
      >
      <View style={{ flex: 1 }}>
        
        <ScrollView>
          <Text style={styles.aboutHeader}>Terms And Policies</Text>
            <View> 
              <Text style={{ padding: 10 }}>
                {Information.terms}
              </Text> 
              <View style={ styles.modalButtonContainer }>  
                <Button 
                  title='Close' 
                  titleStyle={{ color: 'black'}} 
                  type='clear' 
                  buttonStyle={{ padding: 10 }}
                  onPress={() => {this.setState({ isTermsAndPoliciesModalVisible: false });}}
                />
              </View>
            </View>
        </ScrollView>
        </View>
      </Modal>
    );
  }

  // bu modal tam ekran açılmamalı ve ortalanmalı, still düzenlemesi gerekiyor..
  renderThanksModal = () => {
    return(
      <Modal 
        isVisible={this.state.isThanksModalVisible}
        onBackButtonPress={() => this.setState({ isThanksModalVisible: false })}
        onBackdropPress={() => this.setState({ isThanksModalVisible: false })}
        backdropColor="#B4B3DB"
        backdropOpacity={0.8}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
      >

        <View style={styles.content}>
          <Emoji name='heart' style={{ fontSize: 30 }} />
          <Text style={styles.contentTitle}>Hi 👋!</Text>
          <Button
            onPress={() => this.setState({ isThanksModalVisible: false })}
            title="Close"
          />
        </View>
      </Modal>
    );
  }

  renderLanguageChangeModal = () => {
    return(
      <ModalSelector
        data={this.state.languageModal.list}
        onChange={(option)=> this.languageSelectChanged(option.label, option.key)}
        onModalClose={() => this.setState({ languageModal: {...this.state.languageModal, visible: false} })}
        cancelText={'Cancel'}
        visible={this.state.languageModal.visible}
        customSelector={
          <ListItem
            title="Language"
            rightTitle={this.props.personData.settings.language}
            rightTitleStyle={{ fontSize: 15 }}
            onPress={() => this.setState({ languageModal: {...this.state.languageModal, visible: true} })}
            containerStyle={styles.listItemContainer}
            rightIcon={<Chevron />}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#64b5f6' }}
                icon={{ type: 'material', name: 'language' }}
              />
            }
          />
        }
      />
    );
  }

  renderProfilePicturePrivacyModal = () => {
    return(
      <ModalSelector
        data={this.state.profilePicturePrivacyModal.list}
        onChange={(option)=> this.profilePicturePrivacyChange(option.label, option.key)}
        onModalClose={() => this.setState({ profilePicturePrivacyModal: {...this.state.profilePicturePrivacyModal, visible: false} })}
        cancelText={'Cancel'}
        visible={this.state.profilePicturePrivacyModal.visible}
        customSelector={
          <ListItem
            title="Profile Picture"
            rightTitle={this.props.personData.settings.privacy.profilePicture}
            rightTitleStyle={{ fontSize: 15 }}
            onPress={() => this.setState({ profilePicturePrivacyModal: {...this.state.profilePicturePrivacyModal, visible: true} })}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#ce93d8' }}
                icon={{ type: 'material', name: 'account-circle' }}
              />
            }
            rightIcon={<Chevron />}
          />
        }
      />
    );
  }

  renderOnlineStatusPrivacyModal = () => {
    return(
      <ModalSelector
        data={this.state.onlineStatusPrivacyModal.list}
        onChange={(option)=> this.onlineStatusPrivacyChange(option.label, option.key)}
        onModalClose={() => this.setState({ onlineStatusPrivacyModal: {...this.state.onlineStatusPrivacyModal, visible: false} })}
        cancelText={'Cancel'}
        visible={this.state.onlineStatusPrivacyModal.visible}
        customSelector={
          <ListItem
            title="Online Status"
            rightTitle={this.props.personData.settings.privacy.onlineStatus}
            rightTitleStyle={{ fontSize: 15 }}
            onPress={() => this.setState({ onlineStatusPrivacyModal: {...this.state.onlineStatusPrivacyModal, visible: true} })}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: Colors.whatsApp.green }}
                icon={{ type: 'material', name: 'check-circle' }}
              />
            }
            rightIcon={<Chevron />}
          />
        }
      />
    );
  }

  renderBirthDatePrivacyModal = () => {
    return(
      <ModalSelector
        data={this.state.birthDatePrivacyModal.list}
        onChange={(option)=> this.birthDatePrivacyChange(option.label, option.key)}
        onModalClose={() => this.setState({ birthDatePrivacyModal: {...this.state.birthDatePrivacyModal, visible: false} })}
        cancelText={'Cancel'}
        visible={this.state.birthDatePrivacyModal.visible}
        customSelector={
          <ListItem
            title="My Birthdate"
            rightTitle={this.props.personData.settings.privacy.birthdate}
            rightTitleStyle={{ fontSize: 15 }}
            onPress={() => this.setState({ birthDatePrivacyModal: {...this.state.birthDatePrivacyModal, visible: true} })}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#b0bec5' }}
                icon={{ type: 'material', name: 'date-range' }}
              />
            }
            rightIcon={<Chevron />}
          />
        }
      />
    );
  }


  render() {
    const { image_minified, name, surname, email, birthdate, provider } = this.props.personData;
    return(
      <ScrollView style={styles.scroll}>
        <View>
          {this.renderAvatarModal()}
          {this.renderAboutUsModal()}
          {this.renderTermsAndPoliciesModal()}
          {this.renderThanksModal()}
          {this.renderDeleteAccountModal()}
          {this.renderDeleteAccountConfirmModal()}
        </View>
        <View style={styles.userRow}>
          <View style={styles.userImage}>
            <TouchableOpacity onPress={() => this.setState({ isAvatarModalVisible: true })}>
              <Avatar
                rounded
                size="large"
                source={{
                  uri: image_minified,
                }}
              />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={{ fontSize: 16 }}>{name + ' ' + surname}</Text>
            <Text style={{ color: 'gray', fontSize: 16 }}>
              {email}
            </Text>
          </View>
        </View>
        <InfoText text="Account" />
        <View>
          <ListItem
            hideChevron
            title="Push Notifications"
            containerStyle={styles.listItemContainer}
            rightElement={
              <Switch
                onValueChange={(value) => this.onChangePushNotifications(value)}
                value={this.props.personData.settings.notification}
              />
            }
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#FFADF2' }}
                icon={{ type: 'material', name: 'notifications' }}
              />
            }
          />
          <ListItem
            title="Birthdate"
            rightTitle={this.props.personData.birthdate}
            rightTitleStyle={{ fontSize: 15 }}
            onPress={() => this.setState({ isDateTimePickerVisible: true })}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#FAD291' }}
                icon={{ type: 'font-awesome', name: 'birthday-cake' }}
              />
            }
            rightIcon={<Chevron />}
          />
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={() => this.setState({ isDateTimePickerVisible: false })}
          />
          {this.renderLanguageChangeModal()}
          <ListItem
            title="Login Method"
            rightTitle={provider == 'google.com' ? 'google' : 'facebook'}
            rightTitleStyle={{ fontSize: 15 }}
            //onPress={}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: provider == 'google.com' ? Colors.google.red : Colors.facebook.blue }}
                icon={{ type: 'font-awesome', name:  provider == 'google.com' ? 'google' : 'facebook' }}
              />
            }
          />
        </View>
        <InfoText text='Security' />
        <View>
          <ListItem
            hideChevron
            title="Hide Me"
            containerStyle={styles.listItemContainer}
            rightElement={
              <Switch
                onValueChange={(value) => this.onChangeHideStatus(value)}
                value={this.props.personData.settings.hide}
              />
            }
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#83B799' }}
                icon={{ type: 'material', name: 'accessibility' }}
              />
            }
          />
          {this.renderProfilePicturePrivacyModal()}
          {this.renderOnlineStatusPrivacyModal()}
          {this.renderBirthDatePrivacyModal()}
        </View>
          <InfoText text='Details' />
        <View>
          <ListItem
            title="My Pin Color"
            rightTitle={this.props.personData.settings.color.myPin}
            rightTitleStyle={{ fontSize: 15 }}
            onPress={() => this.onMyPinColorPress()}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: this.props.personData.settings.color.myPin }}
                icon={{ type: 'material', name: 'place' }}
              />
            }
            rightIcon={<Chevron />}
          />
          <ListItem
            title="Follows Pin Color"
            rightTitle={this.props.personData.settings.color.followsPin}
            rightTitleStyle={{ fontSize: 15 }}
            onPress={() => this.onFollowsPinColorPress()}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: this.props.personData.settings.color.followsPin }}
                icon={{ type: 'material', name: 'person-pin-circle' }}
              />
            }
            rightIcon={<Chevron />}
          />
          <ListItem
            title="Others Pin Color"
            rightTitle={this.props.personData.settings.color.othersPin}
            rightTitleStyle={{ fontSize: 15 }}
            onPress={() => this.onOthersPinColorPress()}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: this.props.personData.settings.color.othersPin }}
                icon={{ type: 'material', name: 'edit-location' }}
              />
            }
            rightIcon={<Chevron />}
          />
          <ListItem
            title='Map Theme'
            rightTitle={this.props.personData.settings.theme}
            rightTitleStyle={{ fontSize: 15 }}
            onPress={() => this.onMapThemePress()}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: (this.props.personData.settings.theme == 'retro' ? '#E1B878' : '#617F7F') }}
                icon={{ type: 'material', name: 'map' }}
              />
            }
            rightIcon={<Chevron />}
          />
        </View>
        <InfoText text='Connect' />
        <View>
          <ListItem
            title="Facebook"
            rightTitle={this.props.personData.settings.connect.facebook.verified ? 'Enabled' : 'Disabled' }
            rightTitleStyle={{ fontSize: 15 }, this.props.personData.settings.connect.facebook.verified ? { color: 'green' } : { color: 'gray' }}
            onPress={() => this.onConnectFacebookPress()}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                size={30}
                color={Colors.facebook.blue}
                containerStyle={{ backgroundColor: 'transparent' }}
                icon={{ type: 'entypo', name: 'facebook-with-circle' }}
              />
            }
            rightIcon={<Chevron />}
          />
          <ListItem
            title="Instagram"
            rightTitle={this.props.personData.settings.connect.instagram.verified ? 'Enabled' : 'Disabled' }
            rightTitleStyle={{ fontSize: 15 }, this.props.personData.settings.connect.instagram.verified ? { color: 'green' } : { color: 'gray' }}
            onPress={() => this.onConnectInstagramPress()}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                size={30}
                color={Colors.instagram.purple}
                containerStyle={{ backgroundColor: 'transparent' }}
                icon={{ type: 'entypo', name: 'instagram-with-circle' }}
              />
            }
            rightIcon={<Chevron />}
          />
          <ListItem
            title="Spotify"
            rightTitle={this.props.personData.settings.connect.spotify.verified ? 'Enabled' : 'Disabled' }
            rightTitleStyle={{ fontSize: 15 }, this.props.personData.settings.connect.spotify.verified ? { color: 'green' } : { color: 'gray' }}
            onPress={() => this.onConnectSpotifyPress()}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                size={30}
                color={Colors.spotify.green}
                containerStyle={{ backgroundColor: 'transparent' }}
                icon={{ type: 'entypo', name: 'spotify-with-circle' }}
              />
            }
            rightIcon={<Chevron />}
          />
        </View>
        <InfoText text='More' />
        <View>
          <ListItem
            title="About US"
            onPress={() => this.setState({ isAboutUsPopUpVisible: true })}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#A4C8F0' }}
                icon={{ type: 'materialicon', name: 'info' }}
              />
            }
            rightIcon={<Chevron />}
          />
          <ListItem
            title='Terms and Policies'
            onPress={() => this.setState({ isTermsAndPoliciesModalVisible: true })}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#C6C7C6' }}
                icon={{ type: 'materialicon', name: 'lightbulb-outline' }}
              />
            }
            rightIcon={<Chevron />}
          />
          <ListItem
            title="Share Your Profile"
            onPress={() => this.onShareProfilePress()}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#C47EFF' }}
                icon={{ type: 'materialicon', name: 'share' }}
              />
            }
            rightIcon={<Chevron />}
          />
          <ListItem
            title="Rate Us"
            onPress={() => this.onRateUsPress()}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#FECE44' }}
                icon={{ type: 'materialicon', name: 'star' }}
              />
            }
            rightIcon={<Chevron />}
          />
          <ListItem
            title='Help to Transtlate'
            onPress={() => this.onHelpToTranstlatePress()}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: Colors.google.blue }}
                icon={{ type: 'materialicon', name: 'translate' }}
              />
            }
            rightIcon={<Chevron />}
          />
          <ListItem
            title="Send FeedBack"
            onPress={() => this.onSendFeedBackPress()}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#8bc34a' }}
                icon={{ type: 'materialicon', name: 'feedback' }}
              />
            }
            rightIcon={<Chevron />}
          />
          </View>
          <InfoText text='Be Careful' />
          <View>
          <ListItem
            title='Delete Account Permanently!'
            onPress={() => this.setState({ isDeleteAccountModalVisible: true })}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: Colors.google.red }}
                icon={{ type: 'materialicon', name: 'report-problem' }}
              />
            }
            rightIcon={<Chevron />}
          />
        </View>
      </ScrollView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: 'white',
  },
  userRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 8,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 6,
  },
  userImage: {
    marginRight: 12,
  },
  listItemContainer: {
    height: 55,
    borderWidth: 0.5,
    borderColor: '#ECECEC',
  },
  modal: {
    backgroundColor: 'white',
    padding: 22,
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalButtonContainer: {
    flex:1,
    flexDirection:'row',
    marginTop:10,
    marginBottom:15
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  }
});