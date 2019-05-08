import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import NavigationService from '../../../../services/NavigationService';

// Constants
import Colors from '../../../../constants/Colors';

// Redux
import { connect } from 'react-redux';
import { setPersonData, setIsLoading } from '../../../../redux/collection';

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

class EmailButton extends React.Component{

	constructor(props){
		super(props);
    this.state={
      disabled: false,
      loading: false
    }
	}

	onEmailSignInPress = () => {
      this.props.setIsLoading(true);
    	NavigationService.navigate('SignIn');
      this.props.setIsLoading(false);
  	}

	render(){
		return(
			<Button 
        title='Login with Email' 
        icon={
          <Icon 
            type='material-community'
            name='email-outline'
            size={30} 
            color='white'
            iconStyle={styles.buttonIcon} 
          />
        } 
        onPress={() => this.onEmailSignInPress()}
        disabledStyle={styles.disabledButton}
        loading={this.state.loading}
        disabled={this.state.disabled}
      />
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(EmailButton);

const styles = StyleSheet.create({
	disabledButton: {
		backgroundColor: Colors.deactive
	},
	buttonIcon: {
    	paddingRight: 5
  }
});