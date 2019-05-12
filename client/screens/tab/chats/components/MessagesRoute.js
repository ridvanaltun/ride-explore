import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import Moment from 'moment';
import firebase from 'firebase';

let changeListener;

// Redux
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return{
    personData: state.personData
  };
}

class MessagesRoute extends React.Component{

  constructor(props){
    super(props);
    this.state={
      users: [],
      usersRef: {},
      renderComplete: false
    }
  }

  componentDidMount(){
    this.setChangeListener();
  }

  componentWillUnmount(){
    if(changeListener !== null){
      changeListener.off('child_added');
    }
  }

  setChangeListener = () => {

    changeListener = firebase.database().ref('/users/').child(this.props.personData.uid).child('messages');

    // Tüm konuşma id'leri burada akıyor
    changeListener.child('id').on('child_added', snapshot => {

      if(snapshot.val() !== null){

        const uid = snapshot.key;

        firebase.database().ref('/users/').child(uid).once('value').then(snapshot => {
          
          const user = {
            uid: snapshot.val().uid,
            name: snapshot.val().name,
            surname: snapshot.val().surname,
            image_minified: snapshot.val().image_minified
          }


          changeListener.child('last_messages').child(uid).once('value').then(snapshot => {

            if(snapshot.val() !== null){

              user.last_message = snapshot.val().text;
              user.last_message_date = snapshot.val().date;
              user.last_message_owner = snapshot.val().uid;

              let users = this.state.users;
              let usersRef = this.state.usersRef;

              usersRef[user.uid] = user;

              users.push(user);
              this.setState({ users, usersRef });
            }

          });

        });

      }

    });

    // Yeni birisiyle konuşmaya başlayınca bunu users değişkenine aktar
    let isFirstValuePassed = false;
    changeListener.child('last_messages').limitToLast(1).on('child_added', snapshot => {

      if(isFirstValuePassed === true){
        const user = {
          last_message: snapshot.val().text,
          last_message_date: snapshot.val().date,
          last_message_owner: snapshot.val().uid
        }

        firebase.database().ref('/users/').child(snapshot.key).once('value').then(snapshot => {
          user.uid = snapshot.val().uid;
          user.name = snapshot.val().name;
          user.surname = snapshot.val().surname;
          user.image_minified = snapshot.val().image_minified;

          let usersRef = this.state.usersRef;
          let users = this.state.users;
          
          usersRef[user.uid] = user;
          users.push(user);
          
          this.setState({ users, usersRef });
        
        });
      }
      isFirstValuePassed = true;
    });

    // last_messages kanalı altında değişiklik oldukça ekrandaki değişmesi gereken veriyi manipüle et
    changeListener.child('last_messages').on('child_changed', snapshot => {

      let usersRef = this.state.usersRef;
      usersRef[snapshot.key].last_message = snapshot.val().text;
      usersRef[snapshot.key].last_message_date = snapshot.val().date;
      usersRef[snapshot.key].last_message_owner = snapshot.val().uid;
      this.setState({ usersRef });   
      
    });
  }

  openPersonChat = (item) => {
    this.props.navigation.navigate('PersonalChat', {
      uid: item.uid,
      name: item.name,
      surname: item.surname,
      image_minified: item.image_minified
    });
  }

  renderMessages = () => {
    return(
      <FlatList
        data={this.state.users}
        extraData={this.state}
        keyExtractor={(item) => item.uid}
        renderItem={ ({item, index}) => (
          <ListItem
            key={index}
            leftAvatar={
              <Avatar
                rounded
                source={{ uri: item.image_minified }}
                size='small'
              />
            }
            title={item.name + ' ' + item.surname}
            subtitle={item.last_message.length > 55 ? item.last_message.substring(0,54) + '...' : item.last_message}
            rightTitle={
              Moment(item.last_message_date).format('M/D/YY') === Moment().format('M/D/YY') ?
              Moment(item.last_message_date).format('HH:mm') : 
              Moment(item.last_message_date).format('M/D/YY')
            }
            rightTitleStyle={{ fontSize: 13 }}
            onPress={()=> this.openPersonChat(item)}
          />)
        }
        ListEmptyComponent={
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ textAlign: 'center'}}>No data found.</Text>
          </View>
        }  
      />
    );
  }

  render(){
      return(
        <View style={{ flex: 1 }}>
          {this.renderMessages()}
        </View>
      );
  }
}

export default connect(mapStateToProps)(MessagesRoute);