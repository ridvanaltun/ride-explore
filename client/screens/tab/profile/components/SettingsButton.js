import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Icon } from 'react-native-elements';
import NavigationService from '../../../../services/NavigationService';

class SettingsButton extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Icon
          type='ionicon'
          name={Platform.OS === 'ios' ? 'ios-settings' : 'md-settings'}
          onPress={() => NavigationService.navigate('Settings')}
          size={45}
          color='white'
        />
      </View>
    );
  }
}

export default SettingsButton;

const styles = StyleSheet.create({
  container: {
    marginRight: 15,
    marginTop: 5
  }
});