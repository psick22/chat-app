import React, { Component } from 'react';
import Message from './Message';
import MessageForm from './MessageForm';
import MessageHeader from './MessageHeader';
import { connect } from 'react-redux';
import firebase from 'firebase';

export class MainPanel extends Component {
  state = {
    message: [],
    messagesRef: firebase.database().ref('messages'),
    isLoading: true,
  };

  componentDidMount() {
    const { chatRoom } = this.props && this.props;
    console.log('mount', chatRoom);
    if (chatRoom) {
      this.addMessagesListener(chatRoom.id);
    }
  }

  addMessagesListener = chatRoomId => {
    // 방마다 리스너를 달아야됨
    let messagesArray = [];
    console.log(messagesArray);

    this.state.messagesRef
      .child(`${chatRoomId}/message`)
      .on('child_added', DataSnapshot => {
        messagesArray.push(DataSnapshot.val());
        this.setState({
          message: messagesArray,
          isLoading: false,
        });
      });
  };

  renderMessages = message => {
    const newMessage =
      message.length > 0 &&
      message.map(item => {
        return <Message key={item.timestamp} message={item}></Message>;
      });
    return newMessage;
  };

  render() {
    const { message } = this.state;
    console.log('main panel rendered');
    return (
      <div style={{ padding: '2rem 2rem 0 2rem' }}>
        <MessageHeader />

        <div
          id='message'
          style={{
            width: '100%',
            height: '450px',
            border: '.2rem solid #ececec',
            borderRadius: '4px',
            marginBottom: '1rem',
            overflowY: 'auto',
          }}
        >
          {this.renderMessages(message)}
        </div>

        <MessageForm />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.currentUser,
    chatRoom: state.chatRoom.currentChatRoom,
  };
};

export default connect(mapStateToProps)(MainPanel);
