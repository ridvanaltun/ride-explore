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
    messages: state.messages
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
  }

  openPersonChat = (item) => {
    this.props.navigation.navigate('PersonalChat', {
      uid: item.uid,
      name: item.name,
      surname: item.surname,
      image_minified: item.image_minified
    });
  }

  render(){
    return(
      <View style={{ flex: 1 }}>
      {/*
        <FlatList
          data={this.props.followedUserList}
          extraData={this.props.personData.follows}
          keyExtractor={(item) => item.uid}
          renderItem={ ({item, index}) => (
            <ListItem
              key={index}
              leftAvatar={
                <Avatar
                  rounded
                  source={{ uri: item.image_minified }}
                  size='small'
                  //title="CR"
                  //icon={{name: 'user', type: 'font-awesome'}}
                  //activeOpacity={0.7}
                  //onPress={() => console.log(item.name)}
                  //showEditButton={true}
                />
              }
              title={item.name + ' ' + item.surname}
              subtitle={item.about.length > 55 ? item.about.substring(0,54) + '...' : item.about}
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
      */}
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagesRoute);