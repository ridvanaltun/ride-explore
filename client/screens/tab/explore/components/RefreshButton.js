import React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { Location, Permissions } from 'expo';

// Redux
import { connect } from 'react-redux';
import { setServiceStatus, setPermissionStatus } from '../../../../redux/collection';

const mapStateToProps = (state) => {
  return{
    permissionStatus: state.permissionStatus,
    serviceStatus: state.serviceStatus
  };
}

const mapDispatchToProps = (dispatch) => {
  return{
    setPermissionStatus: (object) => { dispatch(setPermissionStatus(object)) } ,
    setServiceStatus: (object) => { dispatch(setServiceStatus(object)) }
  };
}

class RefreshButton extends React.Component {

  constructor(props) {
    super(props);
  }

  onReloadPress = async () => {

    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted')
    {
      await this.props.setPermissionStatus({ ...this.props.permissionStatus, location: false });
      console.log('LOCATION PERMISSON STATUS => ', 'false');
    }
    else if(await Location.hasServicesEnabledAsync() == false)
    {
      await this.props.setServiceStatus({ ...this.props.serviceStatus, location: false });
      console.log('LOCATION SERVICE STATUS => ', 'false');
    }
    else
    {
      await this.props.setPermissionStatus({ ...this.props.permissionStatus, location: true});
      await this.props.setServiceStatus({ ...this.props.serviceStatus, location: true });
    }

    console.log('CHECKED!');
  }

  render() {
    return (
      <View>
        <Icon 
          raised
          reverse
          type='material' 
          name='refresh' 
          size={20} 
          color='#ADB7C1'
          onPress={() => this.onReloadPress()}
        />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RefreshButton);