import React from 'react';
import firebase from 'firebase';

// Redux
import { connect } from 'react-redux';
import { setPersonData } from '../../redux/collection';

const mapStateToProps = (state) => {
  return{
    personData: state.personData,
  };
}

const mapDispatchToProps = (dispatch) => {
  return{
    setPersonData: (text) => { dispatch(setPersonData(text)) } ,
  };
}

class EmailScreen extends React.Component {
  static navigationOptions = {
    title: 'Login With Email'
  };

  constructor(props) {
    super(props);
  }

  render(){
    return(true);
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(EmailScreen);
