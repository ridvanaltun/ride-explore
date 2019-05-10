import React from 'react';
import { View, Platform } from 'react-native';
import { Icon } from 'react-native-elements';

class DropDownMenu extends React.Component {

  constructor(props){
    super(props);
  }

  onThreeDotButtonPress = () => {
    console.log('three dots pressed..');
  }

  render() {
    return (
      <Icon 
        type='entypo'
        name={Platform.OS === 'ios' ? 'dots-three-horizontal' : 'dots-three-vertical'}
        size={25}
        onPress={() => this.onThreeDotButtonPress()}
      />
    );
  }
}

export default DropDownMenu;

