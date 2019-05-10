import React from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import Colors from '../../../../constants/Colors';

class ChatLoading extends React.Component{
	
	render(){
		return(
			<View style={styles.renderLoading}>
				<Text>Messages Loading..</Text>
				<ActivityIndicator size='large' color={Colors.whatsApp.green} />
			</View>
		);
	}
}

export default ChatLoading;

const styles = StyleSheet.create({
	renderLoading: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});