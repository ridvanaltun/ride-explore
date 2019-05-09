import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import firebase from 'firebase';

// Redux
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return{
    personData: state.personData,
    followedUserList: state.followedUserList
  };
}

// Components
import SearchButton from './SearchButton';

class FollowsRoute extends React.Component{

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
    if(this.props.followedUserList.length > 0){
      return(
        /*
          Eğer kullanıcı resim özelliğini kapadıysa render edilen avatar title dondurmeli.
          Zaten eğer undefined bir profile photo verince otomatik olarak ad soyad baş harfleri title olarak donduruyor.
        */
        <View style={{ flex: 1 }}>
          <FlatList
            data={this.props.followedUserList}
            //onRefresh={() => this.handleRefresh()}
            //refreshing={this.state.isFetching}
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
          {this.props.followedUserList.length === 0 ? (<SearchButton disabled={true} />) : (<SearchButton />)} 
        </View>
      );

    }else{
      return(
        <View>
          <Text>Loading..</Text>
        </View>
      );
    }
  }
}

export default connect(mapStateToProps)(FollowsRoute);