import React from 'react';
import { Icon } from 'react-native-elements';
import firebase from 'firebase';

class OnlineStatus extends React.Component {

  constructor(props){
    super(props);
    this.state={
      onlineStatusListenerObject: firebase.database().ref('/users/' + this.props.user.uid + '/online'),
      isOnline: false
    }
  }

  componentDidMount(){
    this.listenerOnlineStatus();
  }

  componentWillUnmount(){
    this.state.onlineStatusListenerObject.off('value');
  }

  listenerOnlineStatus = () => {
    this.state.onlineStatusListenerObject.on('value', (snapshot) => {
      if(snapshot.val() !== null){
        this.setState({ isOnline: snapshot.val() });
      }
    });
  }

  render() {
    return (
      <Icon 
          type='entypo'
          name='controller-record'
          size={25}
          color={this.state.isOnline === true ? "#88D969" : "#CC1228"}
          containerStyle={{ marginRight: 15 }}
      />      
    );
  }
}

export default OnlineStatus;
