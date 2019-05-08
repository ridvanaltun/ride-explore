// UI
import React from 'react';
import { Platform, StatusBar, StyleSheet, View, YellowBox, ActivityIndicator, Text } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';

// Navigation
import AppNavigator from './navigation/AppNavigator';
import NavigationService from './services/NavigationService';

// Firebase
import * as firebase from 'firebase';
import { firebaseConfig } from './configs/firebase';

// Socket
import * as socket from './services/SocketService';

// Redux
import { Provider } from 'react-redux';
import configureStore from './redux/redux';
const { store, persistor } = configureStore();

// Redux Persist
import { PersistGate } from 'redux-persist/integration/react';

// Ignore Warnings
import _ from 'lodash';

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  constructor(props) {
    super(props);

    // Ignore "setting a timer.." warnings..
    YellowBox.ignoreWarnings(['Setting a timer']);
    const _console = _.clone(console);
    console.warn = message => {
      if (message.indexOf('Setting a timer') <= -1) {
        _console.warn(message);
      }
    };

    // Initialize firebase...
    if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
  }

  renderPersistLoading = () => (
    <View style={styles.container}>
      <Text>Persist Loading..</Text>
      <ActivityIndicator size="large" />
    </View>
  );

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <Provider store={store}>
          <PersistGate persistor={persistor} loading={this.renderPersistLoading()}>
            <View style={styles.container}>

              {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
              {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}

              <AppNavigator ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef); }} />

            </View>
          </PersistGate>
        </Provider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/header-background.png'),
        require('./assets/images/default-profile-picture.png')
      ]),
      Font.loadAsync({
        ...Icon.Ionicons.font,
        'Lato-Hairline': require('./assets/fonts/Lato-Hairline.ttf'),
        'Lato-Light': require('./assets/fonts/Lato-Light.ttf'),
        'Lato-Regular': require('./assets/fonts/Lato-Regular.ttf'),
        'Lato-Bold': require('./assets/fonts/Lato-Bold.ttf')
      }),
    ]);
  };

  _handleLoadingError = error => {
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
