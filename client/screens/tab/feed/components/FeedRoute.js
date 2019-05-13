import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import firebase from 'firebase';

class FeedRoute extends React.Component{

  constructor(props){
    super(props);
  }

  render(){
    return(
      <View style={styles.container}>
        <Text>This is feed screen.</Text>
      </View>
    );
  }
}

export default FeedRoute;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});