import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

class ServerConnectionFalsePage extends React.Component{
	render(){
		return(
			<View style={styles.container} >
	            <View style={{ margin:20}}>
	              <Icon 
	                type='antdesign'
	                name='disconnect'
	                size={150} 
	                color='skyblue'
	              />
	            </View>
	          <Text style={styles.header}> We can't connect to our server! </Text>
	          <Text style={styles.instructions}> Please check your internet, {'\n'} page load automaticly! </Text>
        	</View>
		);
	}
}

export default ServerConnectionFalsePage;

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