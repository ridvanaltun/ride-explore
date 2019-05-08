import React from 'react';
import { Text, View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { Button } from 'react-native-elements';

// Components
import DropDownMenu from './components/DropDownMenu';

export default class PersonalChatScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('name', 'John') + ' ' + navigation.getParam('surname', 'Doe'),
      headerRight: <DropDownMenu user={{ 
        uid: navigation.getParam('uid', false),
        name: navigation.getParam('name', 'John'), 
        surname: navigation.getParam('surname', 'Doe'),
        image_minified: navigation.getParam('image_minified', false)
      }} />
    };
  };

  constructor(props){
    super(props);
    this.state={
      user: {
        uid: this.props.navigation.getParam('uid', false),
        name: this.props.navigation.getParam('name', 'John'),
        surname: this.props.navigation.getParam('surname', 'Doe'),
        image_minified: this.props.navigation.getParam('image_minified', false)
      },
      chatType: 'personal', // || group
      messages: []
    }
  }

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: this.state.user.name,
            surname: this.state.user.surname,
            avatar: this.state.user.image_minified
          }
        }
      ]
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
  }

  onAvatarPress = () => {
    this.props.navigation.navigate('Person', { 
      uid: this.state.user.uid,
      name: this.state.user.name,
      surname: this.state.user.surname,
      image_minified: this.state.image_minified
    });
  }

  render() {
    return(
      <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={75} behavior='padding' enabled>
      <View style={{ flex: 1 }}>
      	<GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          onPressAvatar={() => this.onAvatarPress()}
          user={{
            uid: this.state.user.uid
          }}
        />
      </View>
      </KeyboardAvoidingView>
    );
  }
}
