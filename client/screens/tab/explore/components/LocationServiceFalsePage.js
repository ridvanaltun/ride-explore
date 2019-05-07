import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

// Components
import RefreshButton from './RefreshButton';

class LocationServiceFalsePage extends React.Component{
	
	render(){
		return(
			<View style={styles.container} >
	          <View style={{ margin: 20 }}>
	            <Icon 
	              type='material'
	              name='location-off' 
	              size={150} 
	              color='skyblue' 
	            />
	          </View>
	          <Text style={styles.header}>Open your GPS!</Text>
	          <Text style={styles.instructions}> Don't forget click to reload button! </Text>
	          <RefreshButton />
	        </View>
		);
	}
}

export default LocationServiceFalsePage;

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