import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import firebase from 'firebase';

// Redux
import { connect } from 'react-redux';
import { setMessages } from '../../../../redux/collection';

const mapStateToProps = (state) => {
  return{
    personData: state.personData,
    messages: state.messages,
    isMessagesLoaded: state.isMessagesLoaded
  };
}

const mapDispatchToProps = (dispatch) => {
  return{
    setMessages: (object) => {dispatch(setMessages(object))}
  };
}

class MessagesRoute extends React.Component{

  constructor(props){
    super(props);
    this.state={
      list: []
    }
  }

  openPersonChat = (item) => {
    this.props.navigation.navigate('PersonalChat', {
      uid: item.uid,
      name: item.name,
      surname: item.surname,
      image_minified: item.image_minified
    });
  }

  createMessages = () => {
    const users = this.props.messages;
    let list = [];
    let count = 0;

    /*

      Burada messages sayfasında render oluşturmak üzere bir obje listesi hazırlıyoruz.
      uid, name, surname, image_minified ve last_message bilgisi barındıracak listedeki her obje

    */

    if(users.Bot !== null || users.Bot !== undefined){
      // delete bot user
      delete users.Bot;
    }

    const user_count = Object.keys(users).length;

    for (let user in users) {

      firebase.database().ref('/users/' + user).once('value').then((snapshot) => {

        count++;

        const message_count = users[user].length;
        const last_message = users[user][message_count - 1].text;
        const last_message_date = users[user][message_count - 1].date;

        list.push({ 
          uid: snapshot.val().uid,
          name: snapshot.val().name,
          surname: snapshot.val().surname,
          image_minified: snapshot.val().image_minified,
          last_message: last_message,
          last_message_date: last_message_date
        });

        if(count === user_count){
          this.setState({ list: list });
        }

      });    
    }

    return(null);
  }

  renderFlatList = () => {
    return(
      <FlatList
        data={this.state.list}
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
            chevron // sağ taraftaki ok işareti
            onPress={()=> this.openPersonChat(item)}
          />)
        }
        ListEmptyComponent={
          <View>
            <Text style={{ textAlign: 'center'}}>No data found.</Text>
          </View>
        }  
      />
    );
  }

  render(){
      if(this.props.isMessagesLoaded === true){
        return(
          <View style={{ flex: 1 }}>
            {this.createMessages()}
            {this.renderFlatList()}
          </View>
        );
      }else{
        return(<View style={{ flex: 1 }}><Text>messages not loaded</Text></View>);
      }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagesRoute);