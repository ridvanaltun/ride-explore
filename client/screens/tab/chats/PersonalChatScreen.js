import React from 'react';
import { Text, View, Platform, KeyboardAvoidingView, StyleSheet, StatusBar } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Subtitle } from 'native-base';
import firebase from 'firebase';

// Components
import ChatLoading from './components/ChatLoading';

// Redux
import { connect } from 'react-redux';

let messageListener;

const mapStateToProps = (state) => {
  return{
    personData: state.personData
  }
}

class PersonalChatScreen extends React.Component {
  static navigationOptions = () => {
    return {
      header: null,
    }
  };

  constructor(props){
    super(props);
    this.state={
      user: {
        uid: this.props.navigation.getParam('uid', 'FailBot'),
        name: this.props.navigation.getParam('name', 'John'),
        surname: this.props.navigation.getParam('surname', 'Doe'),
        image_minified: this.props.navigation.getParam('image_minified', false)
      },
      id: '',
      messages: []
    }
  }

  componentDidMount(){
    this.initChat();
  }

  componentWillUnmount(){
    if(messageListener !== null){
      messageListener.off('child_added');
    }
  }

  initChat = () => {
    const txRef = firebase.database().ref('/users/' + this.props.personData.uid);
    const rxRef = firebase.database().ref('/users/' + this.state.user.uid);
    const messagesRef = firebase.database().ref('/messages/');

    txRef.child('messages').child('id').child(this.state.user.uid).once('value').then(snapshot => {
      if(snapshot.val() === null){
        const ref = messagesRef.push();
        txRef.child('messages').child('id').child(this.state.user.uid).set(ref.key);
        rxRef.child('messages').child('id').child(this.props.personData.uid).set(ref.key);
        this.setMessagesOnce(ref.key);
        this.setState({ id: ref.key });
      }else{
        this.setMessagesOnce(snapshot.val());
        this.setState({ id: snapshot.val() });
      }
    });
  }

  setMessagesOnce = (id) => {

    messageListener = firebase.database().ref('/messages/').child(id).child('archive');
    // Bir kereliğine verileri çekip message değişkenini düzenliyoruz
    messageListener.once('value').then(snapshot => {

      if(snapshot.val() !== null){

        const messagesObject = snapshot.val();
        const message_count = Object.keys(messagesObject).length;
        let messages = [];
        let count = 0;

        for (let message in messagesObject) {

          messageListener.child(message).once('value').then(snapshot => {

            const object = {
              _id: count,
              text: snapshot.val().text,
              createdAt: snapshot.val().date,
              user: {
                _id: snapshot.val().uid
              }
            }

            count++;
            messages.unshift(object);

            if(count === message_count){
              this.setState({ messages }, () => this.setMessageListener());
            }

          });
        }  
      }
    }); 
  }

  setMessageListener = () => {
    // Önceden işlenmiş 1 adet veri fazladan geliyor, soruna workaround bir çözüm.
    let isFirstValuePassed = false;

    messageListener.limitToLast(1).on('child_added', snapshot => {

      if(snapshot.val().uid !== this.props.personData.uid && isFirstValuePassed === true){

        let messages = this.state.messages;

        const message = {
          _id: this.state.messages.length + 1,
          text: snapshot.val().text,
          createdAt: snapshot.val().date,
          user: {
            _id: snapshot.val().uid,
          }
        }

        // listenin başına ekliyor unshift methodu
        messages.unshift(message);
        this.setState({ messages }); 

      }

      isFirstValuePassed = true;
    });
  }

  onSendPress(messages = []) {
    // attigimiz mesaji localde append et
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));

    firebase.database().ref('/messages/').child(this.state.id).child('archive').push({
      text: messages[0].text,
      date: messages[0].createdAt.toISOString(),
      uid: this.props.personData.uid
    });

    this.setLastMessage(messages[0]);
  }

  setLastMessage = (message) => {

    const object = {
      text: message.text,
      date: message.createdAt.toISOString(),
      uid: this.props.personData.uid,
    }

    // Bu method ile gidemiyoruz çünkü MessagesRoute sayfasında oluşan değişimleri toplu olarak görmemiz lazım
    //firebase.database().ref('/messages/').child(this.state.id).child('last_message').set(object);

    firebase.database().ref('/users/').child(this.props.personData.uid).child('messages').child('last_messages')
    .child(this.state.user.uid).set(object);

    firebase.database().ref('/users/').child(this.state.user.uid).child('messages').child('last_messages')
    .child(this.props.personData.uid).set(object);
  }

  onPersonButtonPress = () => {
    this.props.navigation.navigate('Person', {
      name: this.state.user.name,
      surname: this.state.user.surname,
      uid: this.state.user.uid,
      image_minified: this.state.user.image_minified
    });
  }

  render() {
    return(
      <Container>
        <Header style={{ marginTop: (Platform.OS === 'android') ? StatusBar.currentHeight : 0 }}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>{this.state.user.name + ' ' + this.state.user.surname}</Title>
            <Subtitle>Online</Subtitle>
          </Body>
          <Right>
            <Button transparent onPress={() => this.onPersonButtonPress()}>
              <Icon name='person' />
            </Button>
            <Button transparent disabled={false} onPress={()=> console.log('deneme..')}>
              <Icon name='more' />
            </Button>
          </Right>
        </Header>
        <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={0} behavior='padding' enabled>
          <View style={{ flex: 1 }}>
            <GiftedChat
              isLoadingEarlier
              isAnimated
              renderLoading={() =>  <ChatLoading />}
              messages={this.state.messages}
              onSend={messages => this.onSendPress(messages)}
              user={{ _id: this.props.personData.uid }}
            />
          </View>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(PersonalChatScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 15
  }
});
