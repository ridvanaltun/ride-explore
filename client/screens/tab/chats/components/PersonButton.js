import React from 'react';
import { Platform } from 'react-native';
import { Icon } from 'react-native-elements';
import NavigationService from '../../../../services/NavigationService';

class PersonButton extends React.Component {

  constructor(props){
    super(props);
  }

  onPersonButtonPress = () => {
    NavigationService.navigate('Person', {
      uid: this.props.user.uid,
      name: this.props.user.name,
      surname: this.props.user.surname,
      image_minified: this.props.user.image_minified
    });
  }

  render() {
    return (
      <Icon 
          type='ionicon'
          name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'}
          onPress={() => this.onPersonButtonPress()}
          size={25}
          containerStyle={{ marginRight: 15 }}
      />      
    );
  }
}

export default PersonButton;
