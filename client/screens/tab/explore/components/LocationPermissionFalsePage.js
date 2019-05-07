import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

// Components
import RefreshButton from './RefreshButton';

class LocationPermissionFalsePage extends React.Component{
	render(){
		return(
			<View style={styles.container} >
	          <View style={{ margin:20 }}>
	            <Icon 
	              type='material'
	              name='location-disabled' 
	              size={150} 
	              color='skyblue' 
	            />
	          </View>
	          <Text style={styles.header} > We need your location permission! </Text>
	          <Text style={styles.instructions}> Don't forget click to reload button! </Text>
	          <RefreshButton />
	        </View>
		);
	}
}

export default LocationPermissionFalsePage;

const styles = StyleSheet.create({
  container: {
  	flex: 1,
  	justifyContent: 'center',
  	alignItems: 'center'
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
	textAlign: 'center',
	color: '#333333',
	marginBottom: 5
  }
});