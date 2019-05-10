/**
* REDUX Ref -> https://www.youtube.com/watch?v=_z9DS9gpujY
* REDUX Persist Ref -> https://www.youtube.com/watch?v=gKC4Hfp0zzU
*/

// REDUX
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import * as firebase from 'firebase';

// REDUX PERSIST

import { persistStore, persistReducer } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import reducer from './collection';

//
// Initial State...
//

const initialState = {
    socketID: '',
    isServerConnectionOk: false,
    location: { /* current location data */
      latitude: 37.78825,
      longitude: -122.4324
    },
    mapRegion: { /* map componenet position */
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    },
    personData: { },
    permissionStatus: {
      location: false
    },
    serviceStatus: {
      location: false
    },
    isAppOnForeground: true,
    onlineUserList: { },
    followedUserList: [ ],
    blockedUserList: [ ],
    applyMapRegion: false,
    isLoading: false,
    messages: { },
    isMessagesLoaded: false
};

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['personData']
}

const enhancers = [];
const middleware = [thunkMiddleware];

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
);

const persistedReducer = persistReducer(persistConfig, reducer);

export default () => {
  //let store = createStore(persistedReducer, compose(applyMiddleware(thunkMiddleware)))
  let store = createStore(persistedReducer, initialState, composedEnhancers);
  let persistor = persistStore(store)
  return { store, persistor };
}