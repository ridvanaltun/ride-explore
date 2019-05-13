import React from 'react';
import { StyleSheet, Text, Dimensions, StatusBar } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';

// Constants
import Colors from '../../../constants/Colors';

// Components
import LazyPlaceholder from './components/LazyPlaceholder';
import FeedRoute from './components/FeedRoute';
import EventRoute from './components/EventRoute';

export default class FeedScreen extends React.Component {
  static navigationOptions = {
    title: 'Global Feed',
    header: null
  };

   constructor(props){
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: 'feed', title: 'Feed' },
        { key: 'events', title: 'Events' }
      ]
    }
  }

  _renderLazyPlaceholder = ({ route }) => <LazyPlaceholder route={route} />;

  _renderTabBar = props => 
    <TabBar
      {...props}
      indicatorStyle={styles.indicator}
      style={styles.tabbar}
    />;

  render() {
    return(
      <TabView
        lazy
        navigationState={this.state}
        renderScene= {({ route }) => {
          switch (route.key) {
            case 'feed':
               return <FeedRoute {...this.props} />;
            case 'events':
              return <EventRoute {...this.props} />;
            default:
              return null;
            }
          }
        }
        onIndexChange={index => this.setState({ index })}
        initialLayout={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
        renderLazyPlaceholder={this._renderLazyPlaceholder}
        renderTabBar={this._renderTabBar}
        style={styles.container}
      />  
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight
  },
  tabbar: {
    backgroundColor: Colors.apple.silver
  },
  indicator: {
    backgroundColor: "#ffeb3b"
  }
});