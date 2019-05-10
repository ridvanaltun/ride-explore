// Elements
import React from 'react';
import { Dimensions, StyleSheet, StatusBar } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { Ionicons } from '@expo/vector-icons';

// Constants
import Colors from '../../../constants/Colors';

// Components
import LazyPlaceholder from './components/LazyPlaceholder';
import MessagesRoute from './components/MessagesRoute';
import FollowsRoute from './components/FollowsRoute';

class ChatsScreen extends React.Component {
  static navigationOptions = {
    title: 'My Following List',
    header: null
  };

  constructor(props){
    super(props);
    this.state = {
      isFetching: false,
      index: 0,
      routes: [
        { key: 'chats', icon: 'md-chatbubbles' /*title: 'Messages'*/ },
        { key: 'follows', icon: 'md-contact' /* title: 'Follows' */ }
      ]
    };
  }

  _renderLazyPlaceholder = ({ route }) => <LazyPlaceholder route={route} />;

  _renderIcon = ({ route, color }) => <Ionicons name={route.icon} size={24} color={color} />;

  _renderTabBar = props => 
    <TabBar
      {...props}
      indicatorStyle={styles.indicator}
      renderIcon={this._renderIcon}
      style={styles.tabbar}
    />;

  render() {
    return(
      <TabView
        lazy
        navigationState={this.state}
        renderScene= {({ route }) => {
          switch (route.key) {
            case 'chats':
               return <MessagesRoute {...this.props} />;
            case 'follows':
              return <FollowsRoute {...this.props} />;
            default:
              return null;
            }
          }
        }
        onIndexChange={index => this.setState({ index })}
        initialLayout={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
        renderTabBar={this._renderTabBar}
        renderLazyPlaceholder={this._renderLazyPlaceholder}
        style={styles.container}
      />  
    );
  }
}

export default ChatsScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
  },
  tabbar: {
    backgroundColor: Colors.whatsApp.green
  },
  indicator: {
    backgroundColor: '#ffeb3b',
  }
});