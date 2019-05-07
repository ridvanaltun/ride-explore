import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// This is our placeholder component for the tabs
// This will be rendered when a tab isn't loaded yet
// You could also customize it to render different content depending on the route

class LazyPlaceholder extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    const { route } = this.props;
    return(
      <View style={styles.scene}>
        <Text>Loading {route.title}…</Text>
      </View>
    );
  }
}

export default LazyPlaceholder;

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});