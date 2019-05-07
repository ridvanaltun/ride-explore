import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import Colors from '../../../../constants/Colors';

class SearchButton extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      search: ''
    }
  }

  updateSearch = search => {
    this.setState({ search });
  };

  render() {
    return (
      <View style={styles.container}>
        <Icon
          reverse // reverses color scheme
          raised
          name='search'
          type='font-awesome'
          color={Colors.whatsApp.green}
          onPress={() => console.log('search..')}
          disabled={this.props.disabled}
        />
      </View>
    );
  }
}

export default SearchButton;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '80%',
    right: '5%'
  }
});
