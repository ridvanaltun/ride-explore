import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

class MessagesRoute extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <View style={styles.scene}>
        <Button 
          title='Get redux state'
          onPress={() => {console.log(this.props.followedUserList);}}
        />
      </View>
    );
  }
}

export default MessagesRoute;

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff4081'
  }
});