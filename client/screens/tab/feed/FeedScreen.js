import React from 'react';
import { ScrollView, StyleSheet, Text, Button, Alert } from 'react-native';

export default class FeedScreen extends React.Component {
  static navigationOptions = {
    title: 'Global Feed',
  };

   constructor(props){
    super(props);
  }

  render() {
    return (
      <ScrollView style={styles.container}>
      <Text>Hi!</Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
