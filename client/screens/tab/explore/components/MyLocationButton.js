import React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { Location } from 'expo';

// Constants
import MapConst from '../../../../constants/Map';

// Redux
import { connect } from 'react-redux';
import { setMapRegion, setApplyMapRegion } from '../../../../redux/collection';

const mapStateToProps = (state) => {
  return{
    mapRegion: state.mapRegion,
    location: state.location,
    applyMapRegion: state.applyMapRegion
  };
}

const mapDispatchToProps = (dispatch) => {
  return{
    setMapRegion: (mapRegion) => { dispatch(setMapRegion(mapRegion))},
    setApplyMapRegion: (boolean) => { dispatch(setApplyMapRegion(boolean))}
  };
}

class MyLocationButton extends React.Component{
	constructor(props){
		super(props);
		this.state={
			disabled: false
		}
	}

	goMyLocation = async (isLongPress) => {
		await this.props.setApplyMapRegion(true);
		await this.setState({ disabled: true });
		await this.props.setMapRegion({
	      latitude: this.props.location.latitude,
	      longitude: this.props.location.longitude,
	      latitudeDelta: isLongPress ? this.props.mapRegion.latitudeDelta : MapConst.LATITUDE_DELTA,
	      longitudeDelta: isLongPress ? this.props.mapRegion.longitudeDelta : MapConst.LONGITUDE_DELTA
	    });
		await this.setState({ disabled: false });
	    await this.props.setApplyMapRegion(false);
	}

	render(){
		return(
			<View>
				<Icon 
					raised
					reverse
					disabled={this.state.disabled}
					type='entypo'
					name='location-pin'
					size={25}
					color={this.props.color}
					onLongPress={() => this.goMyLocation(true)}
					onPress={() => this.goMyLocation(false)}
				/>
			</View>

		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(MyLocationButton);