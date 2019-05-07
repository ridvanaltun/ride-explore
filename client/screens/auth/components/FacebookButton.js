import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Icon } from 'react-native-elements';

// Constants
import Colors from '../../../constants/Colors';

// Redux
import { connect } from 'react-redux';
import { setPersonData, setIsLoading } from '../../../redux/collection';

const mapStateToProps = (state) => {
  return{
    personData: state.personData
  };
}

const mapDispatchToProps = (dispatch) => {
  return{
    setPersonData: (object) => { dispatch(setPersonData(object)) },
    setIsLoading: (boolean) => { dispatch(setIsLoading(boolean)) }
  };
}

class FacebookButton extends React.Component{

	constructor(props){
		super(props);
    this.state={
      disabled: true,
      loading: false
    }
	}

	onFacebookSignInPress = () => {
    //this.setState({ disabled: true, loading: true });
    this.props.setIsLoading(true);
	  console.log('facebook sign in press..');
	}

	render(){
		return(
			<Button
        title='Login with Facebook'
        icon={
          <Icon
            type='font-awesome'
            name='facebook'
            size={30}
            color='white'
            iconStyle={styles.buttonIcon} 
          />
        }
        onPress={() => this.onFacebookSignInPress()}
        buttonStyle={[styles.button, styles.facebookButton]}
        disabledStyle={styles.disabledButton}
        loading={this.state.loading}
        disabled={this.state.disabled}
      />
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(FacebookButton);

const styles = StyleSheet.create({
	button: {
		borderRadius: 10,
    	margin: 5
	},
	facebookButton: {
		backgroundColor: Colors.facebook.blue
	},
	disabledButton: {
		backgroundColor: Colors.deactive
	},
	buttonIcon: {
    	paddingRight: 5
  	}
});