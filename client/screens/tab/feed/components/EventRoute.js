import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import firebase from 'firebase';

class EventRoute extends React.Component{

  constructor(props){
    super(props);
  }

  render(){
    return(
      <View style={styles.container}>
        <Text>This is event screen.</Text>
      </View>
    );
  }
}

export default EventRoute;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});