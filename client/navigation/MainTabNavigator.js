import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

// Feed Screens
import FeedScreen from '../screens/tab/feed/FeedScreen';

// Explore Screens
import ExploreScreen from '../screens/tab/explore/ExploreScreen';

// Profile Screens
import ProfileScreen from '../screens/tab/profile/ProfileScreen';
import SettingsScreen from '../screens/tab/profile/SettingsScreen';

// Chat Screens
import ChatsScreen from '../screens/tab/chats/ChatsScreen';
import PersonalChatScreen from '../screens/tab/chats/PersonalChatScreen';
import PersonScreen from '../screens/tab/chats/PersonScreen';

// Constants
import Colors from '../constants/Colors';

// Components
import TabBarIcon from '../components/TabBarIcon';
import withBadge from '../components/withBadge';

const BadgedIcon = withBadge(1)(Icon);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  padLeft: {
    paddingLeft: 16
  },
  padRight: {
    paddingRight: 16
  }
});

const ChatStack = createStackNavigator({
  Chats: ChatsScreen,
  PersonalChat: PersonalChatScreen,
  Person: PersonScreen
},
{
  initialRouteName: 'Chats',
});

ChatStack.navigationOptions = {
  tabBarLabel: 'Chats',
  tabBarIcon: ({ focused }) => (
    <React.Fragment>
      <BadgedIcon
        name={Platform.OS === 'ios' ? 'ios-chatboxes' : 'md-chatboxes'}
        type="ionicon"
        focused={focused}
        color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
        containerStyle={styles.padRight}
      />
    </React.Fragment>
    /*<TabBarIcon
      focused={focused}
      type='ionicon'
      name={Platform.OS === 'ios' ? 'ios-chatboxes' : 'md-chatboxes'}
    />*/
  ),
};

const FeedStack = createStackNavigator({
  Feed: FeedScreen,
});

FeedStack.navigationOptions = {
  tabBarLabel: 'Feed',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      type='ionicon'
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'logo-rss'
      }
    />
  ),
};

const ExploreStack = createStackNavigator({
  Explore: ExploreScreen
},
{
  initialRouteName: 'Explore',
});

ExploreStack.navigationOptions = {
  tabBarLabel: 'Explore',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      type='ionicon'
      name={Platform.OS === 'ios' ? 'ios-navigate' : 'md-compass'}
    />
  ),
};


const ProfileStack = createStackNavigator({
  Profile: ProfileScreen,
  Settings: SettingsScreen
},
{
  initialRouteName: 'Profile',
});

ProfileStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      type='ionicon'
      name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'}
    />
  ),
};

const options = {
  initialRouteName: 'FeedStack',
  tabBarPosition: 'bottom',
  animationEnabled: true,
  swipeEnabled: false,
  navigationOptions: {
    tabBarVisible: true
  },
  tabBarOptions: {
    showLabel: true,
    activeTintColor: '#fff',
    inactiveTintColor: '#fff9',
    style: {
      backgroundColor: '#f16f69',
    },
    labelStyle: {
      fontSize: 13,
      fontWeight: 'bold',
      marginBottom: 3,
      marginTop:5,
    },
    indicatorStyle: {
      height: 0,
    },
    showIcon: true,
  }
}

export default createMaterialTopTabNavigator({
  FeedStack,
  ExploreStack,
  ChatStack,
  ProfileStack
}, options);
