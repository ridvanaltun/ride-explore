import React from 'react';
import { StyleSheet, Text, Alert, View, Image, Animated , ScrollView, Platform, TextInput, TouchableOpacity } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import firebase from 'firebase';
import Modal from 'react-native-modal';
import Colors from '../../../constants/Colors';

// Images
import defaultProfilePicture from '../../../assets/images/default-profile-picture.png';

// Redux..
import { connect } from 'react-redux';
import { setPersonData } from '../../../redux/collection';

const mapStateToProps = (state) => {
  return{
    personData: state.personData
  };
}

const mapDispatchToProps = (dispatch) => {
  return{
    setPersonData: (object) => { dispatch(setPersonData(object)) }
  };
}

class  PersonScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('name', 'John') + ' ' + navigation.getParam('surname', 'Doe'),
      headerTransparent: true,
      headerStyle: { borderBottomWidth: 0 }
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      isOriginalImageModalVisible: false,
      isBlockPopUpVisible: false,
      isUserBlocked: false,
      isUserFollowed: false,
      userListerObject: firebase.database().ref('/users/' + this.props.navigation.getParam('uid', false)),
      user: { 
        uid: this.props.navigation.getParam('uid', false),
        about: this.props.navigation.getParam('about', 'Undefined'),
        image_minified: this.props.navigation.getParam('image_minified', false),
        settings: {
          connect: { 
            facebook:{
              verified:false
            },
            instagram:{
              verified:false
            },
            spotify:{
              verified:false
            }  
          }
        }
      }
    }
  }

  componentWillUnmount(){
    this.state.userListerObject.off('value');
  }

  componentWillMount(){
    this.userListener();
    this.checkIsUserBlocked();
    this.checkIsUserFollowed();
  }

  userListener = () => {
    this.state.userListerObject.on('value', snapshot => {
      this.setState({ user: snapshot.val() });
    });
  }

  checkIsUserBlocked = () => {
    if(this.props.personData.blocked != undefined){
      const arr = this.props.personData.blocked;
      arr.forEach( value => {
        if(value == this.state.user.uid){
          this.setState({ isUserBlocked: true });
        }
      });
    }
  }

  checkIsUserFollowed = () => { 
    if(this.props.personData.follows != undefined){
      const arr = this.props.personData.follows;
      arr.forEach( value => {
        if(value == this.state.user.uid){
          this.setState({ isUserFollowed: true });
        }
      });
    }
  }

  renderOriginalImageModal = () => {
    return(
      <Modal 
        isVisible={this.state.isOriginalImageModalVisible}
        onBackButtonPress={() => this.setState({ isOriginalImageModalVisible: false })}
        onBackdropPress={() => this.setState({ isOriginalImageModalVisible: false })}
      >
        <View style={[styles.modalContent, {backgroundColor: 'transparent', padding: 0, borderRadius: 0 }]}>
          <Image
            resizeMode='contain'
            style={{ height: '100%', width: '100%' }}
            source={{ uri: this.state.user.image_original }}
          />
        </View>   
      </Modal>
    );
  }

  renderContactHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.userRow}>
          <TouchableOpacity onPress={() => this.setState({ isOriginalImageModalVisible: true })}>
            <Image
              style={styles.userImage}
              defaultSource={defaultProfilePicture}
              source={{
                uri: this.state.user.image_minified
              }}
            />
          </TouchableOpacity>
          <View style={styles.userNameRow}>
            <Text style={styles.userNameText}>{this.state.user.name + ' ' + this.state.user.surname}</Text>
          </View>
          <View style={styles.userBioRow}>
            <Text style={styles.userBioText}>{this.state.user.about}</Text>
          </View>
        </View>
        <View style={styles.socialRow}>
          <View>

            <Icon
              size={30}
              type="entypo"
              color={(this.state.user.settings.connect.facebook.verified) ? Colors.facebook.blue : Colors.deactive}
              name="facebook-with-circle"
              onPress={() => {this.onFacebookPress();}}
            />
            
          </View>
          <View style={styles.socialIcon}>
            <Icon
              size={30}
              type="entypo"
              color={(this.state.user.settings.connect.instagram.verified) ? Colors.instagram.purple : Colors.deactive}
              name="instagram-with-circle"
              onPress={() => {this.onInstagramPress();}}
            />
          </View>
          <View>
            <Icon
              size={30}
              type="entypo"
              color={(this.state.user.settings.connect.spotify.verified) ? Colors.spotify.green : Colors.deactive}
              name="spotify-with-circle"
              onPress={() => {this.onSpotifyPress();}}
            />
          </View>
        </View>
      </View>
    )
  }

  onFacebookPress = () => {
    if(this.state.user.settings.connect.facebook.verified){
      console.log('facebook auth true');
    }else{
      console.log('facebook auth false');
    }
  }

  onInstagramPress = () => {
    if(this.state.user.settings.connect.instagram.verified){
      console.log('instagram auth true');
    }else{
      console.log('instagram auth false');
    }
  }

  onSpotifyPress = () => {
    if(this.state.user.settings.connect.spotify.verified){
      console.log('spotify auth true');
    }else{
      console.log('spotify auth false');
    }
  }

  renderButtons = () => {
    return(
      <View style={{alignItems: 'center', justifyContent: 'center'}}>

        {(this.state.isUserBlocked === false) ? (

          <Button
            onPress={() => {this.onLetsTalkPress();}}
            type="clear"
            buttonStyle={{padding:10, marginTop:10}}
            title="Let's Talk"
          />

        ) : (

          <Button
            type="clear"
            buttonStyle={{padding:10, marginTop:10}}
            title="Let's Talk"
            disabled
          />

        )}

        { (this.state.isUserFollowed === false) ? (

          <Button
            onPress={() => {this.onSaveToFollowListPress();}}
            type="clear"
            buttonStyle={{padding:10}}
            title="Save To Follow List"
          />

        ) : (

          <Button
            onPress={() => {this.onRemoveFromFollowListPress();}}
            type="clear"
            buttonStyle={{padding:10}}
            title="Remove From Follow List"
          />

        )}

        {(this.state.isUserBlocked === false) ? (

          <Button
            onPress={() => {this.setState({ isBlockPopUpVisible: true });}}
            type="clear"
            buttonStyle={{padding:10}}
            title="Block"
            titleStyle={{color:'red'}}
          />

          ) : (

          <Button
            onPress={() => {this.onRemoveBlockPress();}}
            type="clear"
            buttonStyle={{padding:10}}
            title="Remove Block"
            titleStyle={{color:'red'}}
          />

          )}

      </View>
    );
  }

  arrayRemove = (arr, value) => {
    return arr.filter((ele) => { return ele != value; });
  }

  onBlockPress = () => {

    if(this.props.personData.blocked != undefined){
      const blocked_user_list = this.props.personData.blocked;
    }else{
      const blocked_user_list = [];
    }

    blocked_user_list.push(this.state.user.uid);

    firebase.database().ref('/users/' + this.props.personData.uid)
      .update({ blocked: blocked_user_list })
      .then( () => { this.setState({ isBlockPopUpVisible: false, isUserBlocked: true }); })
      .catch((error) => { console.log('ERROR : [onBlockPress] -->  ', error);
    });
  }

  onRemoveBlockPress = () => {

    const blocked_user_list = this.arrayRemove(this.props.personData.blocked, this.state.uid);

    firebase.database().ref('/users/' + this.props.personData.uid)
      .update({ blocked: blocked_user_list })
      .then( () => { this.setState({ isBlockPopUpVisible: false, isUserBlocked: false }); })
      .catch((error) => { console.log('ERROR : [onRemoveBlockPress] -->  ', error);
    });
  }

  onSaveToFollowListPress = () => {

    if(this.props.personData.follows != undefined){
      const followed_user_list = this.props.personData.follows;
    }else{
      const followed_user_list = [];
    }

    followed_user_list.push(this.state.user.uid);

    firebase.database().ref('/users/' + this.props.personData.uid)
      .update({ follows: followed_user_list })
      .then( () => { this.setState({ isUserFollowed: true }); })
      .catch((error) => { console.log('ERROR : [onSaveToYourListPress] -->  ', error);
    }); 
  }

  onRemoveFromFollowListPress = () => {

    const followed_user_list = this.arrayRemove(this.props.personData.follows, this.state.user.uid);

    firebase.database().ref('/users/' + this.props.personData.uid)
      .update({ follows: followed_user_list })
      .then( () => { this.setState({ isUserFollowed: false }); })
      .catch((error) => { console.log('ERROR : [onRemoveFromYourListPress] -->  ', error);
    });
  }

  onLetsTalkPress = () => {
    this.props.navigation.navigate('PersonalChat', {
      uid: this.state.user.uid,
      name: this.state.user.name,
      surname: this.state.user.surname,
      image_minified: this.state.user.image_minified
    });
  }

  renderBlockModal = () => {
    return(
      <Modal isVisible={this.state.isBlockPopUpVisible}>
        <View style={styles.modalContent}>
          <Text>You can report this user!</Text>
            <TextInput
              style={styles.textInput}
              multiline={true}
              placeholder={'I am block this user because..'}
            />
            <View style={{marginTop:10, marginBottom:15, flex:1, flexDirection:'row'}}>
              <Button 
                title='Block' 
                titleStyle={{color:'red'}} 
                type="clear" 
                buttonStyle={{padding:10}}
                onPress={() => {this.onBlockPress();}}
              />           
              <Button 
                title='Cancel' 
                titleStyle={{color:'black'}} 
                type="clear" 
                buttonStyle={{padding:10}}
                onPress={() => {this.setState({ isBlockPopUpVisible: false });}}
              />
            </View>
        </View>
      </Modal>
    );
  }

  render(){
    return(
      <View style={{ flex: 1, marginTop: 50 }}>
        <View>
          {this.renderOriginalImageModal()}
          {this.renderBlockModal()}
        </View>
        <View style={styles.container}>
          <View style={styles.cardContainer}>
            {this.renderContactHeader()}
            {this.renderButtons()}
          </View>
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonScreen);

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginBottom: 10,
    marginTop: 45,
  },
  sceneContainer: {
    marginTop: 10,
  },
  socialIcon: {
    marginLeft: 14,
    marginRight: 14,
  },
  socialRow: {
    flexDirection: 'row',
  },
  userBioRow: {
    marginLeft: 40,
    marginRight: 40,
  },
  userBioText: {
    color: 'gray',
    fontSize: 13.5,
    textAlign: 'center',
  },
  userImage: {
    borderRadius: 60,
    height: 120,
    marginBottom: 10,
    width: 120,
  },
  userNameRow: {
    marginBottom: 10,
  },
  userNameText: {
    color: '#5B5A5A',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userRow: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'black',
    margin: 4,
    marginTop: 24,
    fontSize: 12,
  },
});