import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import firebase from 'firebase';

// Redux
import { connect } from 'react-redux';
import { setFollowedUserList, appendFollowedUserList } from '../../../../redux/collection';

const mapStateToProps = (state) => {
  return{
    personData: state.personData,
    followedUserList: state.followedUserList
  };
}

const mapDispatchToProps = (dispatch) => {
  return{
    setFollowedUserList: (object) => {dispatch(setFollowedUserList(object))},
    appendFollowedUserList: (list) => {dispatch(appendFollowedUserList(list))}
  };
}

// Components
import SearchButton from './SearchButton';

class FollowsRoute extends React.Component{
  constructor(props){
    super(props);
    this.state={
      isFetching: false,
      followsListenerObject: firebase.database().ref('/users/' + this.props.personData.uid + '/follows/')
    }
  }

  componentDidMount(){
    this.followsListener();
  }

  componentWillUnmount(){
    this.state.followsListenerObject.off('value');
  }

  /*
    
    Burada tüm bilgi toplama işlemini bir array'e toplayıp sonra render işlemi tek seferde yapılmalı hız için.
    Şimdilik her seferinde her element için baştan baştan render ediyor ki bu doğru bir yaklaışm değil.

  */

  followsListener = () => {

      this.state.followsListenerObject.on('value', (snapshot) => {

        this.setState({ isFetching: true}, () => {
          this.props.setFollowedUserList([]);
        });
        
        let user = { };
        let userProcessed = 0;
        const followed_uid_list = snapshot.val();

        followed_uid_list.forEach(uid => {

          firebase.database().ref('/users/' + uid).once('value')
            .then(snapshot => {

              userProcessed++;

              user = {
                uid: snapshot.val().uid,
                name: snapshot.val().name,
                surname: snapshot.val().surname,
                image_minified: snapshot.val().image_minified,
                about: snapshot.val().about
              }

              this.props.appendFollowedUserList(user);
          
           })
            .then(() => {
              if(userProcessed === followed_uid_list.length) {
                //this.props.setFollowedUserList(users);
                //console.log(users);
                this.setState({ isFetching: false });
              }
            })
            .catch(err => console.log('setListenerForFollowsChanges Firebase Error: ', err));
        });

      });
  }

  handleRefresh = () => {
    this.setState({ isFetching: true});
    //
    // logic..
    //
    this.setState({ isFetching: false});
  }

  openPersonChat = (item) => {
    this.props.navigation.navigate('PersonalChat', {
      uid: item.uid,
      name: item.name,
      surname: item.surname,
      image_minified: item.image_minified
    })
  }

  render(){
    return(
      /*
        Eğer kullanıcı resim özelliğini kapadıysa render edilen avatar title dondurmeli.
        Zaten eğer undefined bir profile photo verince otomatik olarak ad soyad baş harfleri title olarak donduruyor.
      */
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.props.followedUserList/*testList*/}
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
          //updateCellsBatchingPeriod={4000}
          ListEmptyComponent={
            <View>
              <Text style={{ textAlign: 'center'}}>No data found.</Text>
            </View>
          }  
        />
        {this.props.followedUserList.length === 0 ? (<SearchButton disabled={true} />) : (<SearchButton />)} 
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowsRoute);