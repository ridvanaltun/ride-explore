import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

class MessagesRoute extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <View style={styles.scene}>
        <Text>Hello</Text>
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