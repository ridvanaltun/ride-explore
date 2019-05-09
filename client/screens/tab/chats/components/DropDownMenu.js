import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Icon } from 'react-native-elements';
import NavigationService from '../../../../services/NavigationService';

class DropDownMenu extends React.Component {

  constructor(props){
    super(props);
  }

  onThreeDotButtonPress = () => {
    console.log('three dots pressed..');
  }

  // 3 noktali buton implement edilene kadar oerson sayfasına götüren geçici bir çözüm
  onPersonButtonPress = () => {
    NavigationService.navigate('Person', {
      uid: this.props.user.uid,
      name: this.props.user.name,
      surname: this.props.user.surname,
      image_minified: this.props.user.image_minified
    });
  }

  /*
    
    Burada dropdown menu kullanamadım çünkü be expo ne react-native için bunun bir implementasyon yok.
    Bu nedenle ileride expokit'e geçince native olarak eklenmesi gerekiyor.

  */

  render() {
    return (
      <View style={styles.container}>
      <Icon 
          type='ionicon'
          name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'}
          onPress={() => this.onPersonButtonPress()}
          size={25}
          containerStyle={{ marginRight: 15 }}
      />
       <Icon 
          type='entypo'
          name={Platform.OS === 'ios' ? 'dots-three-horizontal' : 'dots-three-vertical'}
          size={25}
          onPress={() => this.onThreeDotButtonPress()}
        />
      </View>        
    );
  }
}

export default DropDownMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 15
  }
});
