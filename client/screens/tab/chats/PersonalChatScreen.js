import React from 'react';
import { Text, View, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import firebase from 'firebase';

// Components
import DropDownMenu from './components/DropDownMenu';
import PersonButton from './components/PersonButton';
import OnlineStatus from './components/OnlineStatus';
import ChatLoading from './components/ChatLoading';

// Redux
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return{
    personData: state.personData
  }
}

class PersonalChatScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('name', 'John') + ' ' + navigation.getParam('surname', 'Doe'),
      headerRight: 
        (<View style={styles.container}> 
          <OnlineStatus user={{ uid: navigation.getParam('uid', false) }} />
          <PersonButton user={{ 
            uid: navigation.getParam('uid', false),
            name: navigation.getParam('name', 'John'), 
            surname: navigation.getParam('surname', 'Doe'),
            image_minified: navigation.getParam('image_minified', false)
          }} 
          />
          <DropDownMenu />
      </View>)
    };
  };

  constructor(props){
    super(props);
    this.state={
      userMessagesListenerObject: firebase.database().ref('/users/' + this.props.personData.uid + '/messages/delivered/' + this.props.navigation.getParam('uid', 'FailBot')),
      user: {
        uid: this.props.navigation.getParam('uid', 'FailBot'),
        name: this.props.navigation.getParam('name', 'John'),
        surname: this.props.navigation.getParam('surname', 'Doe'),
        image_minified: this.props.navigation.getParam('image_minified', false)
      },
      messages: [],
      isMessagesInit: false
    }
  }

  /*

    Array'in en başına eklenen obje en son eklenen mesaj olacak.
    Group chat olmadığı için user._id değeri her zaman 2 olacak.
    İleride grup chat eklendiği zaman user._id her kullanıcıya farklı verilmek zorunda olur.
    Objenin kendi _id degeri uniq olmak zorunda.

  */

  componentDidMount(){
    this.listenerMessages();
    //this.test();
  }

  componentWillUnmount(){
    this.state.userMessagesListenerObject.off('child_added');
  }

  test = () => {

    let counter = 0;

    this.state.userMessagesListenerObject.once('value').then((snapshot) => {
      
      const snap = snapshot.val();
      const value_count = snap.length();

      this.state.userMessagesListenerObject.on('child_added', (snapshot) => {

        console.log('child added --> ', snapshot.val());

        counter++;

        if(counter === value_count){
          this.setState({ isMessagesInit: true });
        }
      });
    });

    
  }

  listenerMessages = () => {

    this.state.userMessagesListenerObject.on('child_added', (snapshot) => {

      const list = this.state.messages;

      if(snapshot.val().sended === true){


        // isMessagesInit kısmı şimdilik yarım kaldı, aşaüıdaki if ifadesi hep çalışacak

        // Eğer mesajlar daha yüklenmediyse 
        if(this.state.isMessagesInit === false){

          const object = {
            _id: this.state.messages.length + 1,
            text: snapshot.val().text,
            createdAt: snapshot.val().date,
            user: {
              _id: this.props.personData.uid,
            }
          }

          // listenin başına ekliyor unshift methodu
          list.unshift(object);
          this.setState({ messages: list });   
        }

        /*

          Eğer mesajlar yüklendiyse bundan sonra bizim yazdığımkız mesajları gösterme
          Bunun sebebi önceden attığımız mesajlar sunucudan çekilip yazdırıldıktan sonra
          Kendi mesajlarımızı anında göstermek, performans ve kullanıcı deneyimi için için sadece local kullanıcaz.

        */

      }else{
        const object = {
          _id: this.state.messages.length + 1,
          text: snapshot.val().text,
          createdAt: snapshot.val().date,
          user: {
            _id: this.state.user.uid,
            avatar: this.state.user.image_minified
          }
        } 

        // listenin başına ekliyor unshift methodu
        list.unshift(object);
        this.setState({ messages: list }); 
      }

    });
  }

  onSend(messages = []) {

    /*
  
      Aşağıdaki setState ifadesi ileride kullanılacak, Kodun amacı local oalrak direkt oalrak yazdığımız mesajı göstermek,
      Şimdilik sadece online olduğumuz zaman sunucuya gönderdiğimiz veriyi alıp yazdırıyoruz.
  
    */
    
    /*
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
    */


    /*

      Firebase date veri tipini kaydetmiyor,
      toString() methodu ile çevirince'de farklı şekilde çeviri yapıyor
      Olduğu gibi çevirmek için toISOString() adlı bir method kullanıyoruz.

    */

    const messageForSender={
      date: messages[0].createdAt.toISOString(),
      text: messages[0].text,
      sended: true
    }

    const messageForReceiver={
      date: messages[0].createdAt.toISOString(),
      text: messages[0].text,
      uid: this.props.personData.uid
    }


    // Firebase uniq bir id atıyor .push methodu kullandığımızda, bu yüzden array objeye dönüyor.
    // Bize array lazım olduğu için .push yerien .set methodu kullanıp atılan mesaj sayısını ile id üretiyoruz. 
    firebase.database().ref('/users/'+this.props.personData.uid+'/messages/delivered/' + this.state.user.uid)
      .once('value').then((snapshot) => {

        const snap = snapshot.val();
        const message_count = snap.length;
        
        // kendimize gönderiyoruz
        firebase.database().ref('/users/'+ this.props.personData.uid + '/messages/delivered/' + this.state.user.uid)
          .child(message_count).set(messageForSender);

      });

    firebase.database().ref('/users/'+ this.state.user.uid + '/messages/undelivered/')
      .once('value').then((snapshot) => {

        if(snapshot.val() === null){

          //Karşıdaki kullanıcıya kopyasını gönderiyoruz
          firebase.database().ref('/users/'+ this.state.user.uid + '/messages/undelivered/')
            .child('0').set(messageForReceiver);

        }else{

          const snap = snapshot.val();
          const message_count = snap.length;

          //Karşıdaki kullanıcıya kopyasını gönderiyoruz
          firebase.database().ref('/users/'+ this.state.user.uid + '/messages/undelivered/')
            .child(message_count).set(messageForReceiver);   
        }

      });
    
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
      <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={80} behavior='padding' enabled>
        <View style={{ flex: 1 }}>
          <GiftedChat
            isLoadingEarlier
            isAnimated
            renderLoading={() =>  <ChatLoading />}
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            onPressAvatar={() => this.onAvatarPress()}
            user={{ _id: this.props.personData.uid }}
          />
        </View>
      </KeyboardAvoidingView>
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
