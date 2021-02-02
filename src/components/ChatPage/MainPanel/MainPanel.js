import React, { Component } from 'react';
import Message from './Message';
import MessageForm from './MessageForm';
import MessageHeader from './MessageHeader';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { setUserPosts } from '../../../redux/actions/chatRoom_action';

export class MainPanel extends Component {
  state = {
    message: [],
    messagesRef: firebase.database().ref('messages'),
    typingRef: firebase.database().ref('typing'),
    isLoading: true,
    searchTerm: '',
    searchResults: [],
    searchLoading: false,
    typingUsers: [],
  };

  componentDidMount() {
    const { chatRoom } = this.props && this.props;
    if (chatRoom) {
      this.addMessagesListener(chatRoom.id);
      this.addTypingListener(chatRoom.id);
    }
  }

  handleSearchMessages = () => {
    const messagesList = [...this.state.message];
    const regex = new RegExp(this.state.searchTerm, 'gi');
    const searchResults = messagesList.reduce((acc, currentMessage) => {
      if (
        currentMessage.content?.match(regex) ||
        currentMessage.user.userDisplayName?.match(regex)
      ) {
        acc.push(currentMessage);
      }
      return acc; //
    }, []);
    this.setState({ searchResults });
  };

  handleSearchChange = event => {
    this.setState(
      {
        searchTerm: event.target.value,
        searchLoading: true,
      },
      () => this.handleSearchMessages(),
    );
  };

  addMessagesListener = chatRoomId => {
    // 방마다 리스너를 달아야됨
    let messagesArray = [];

    this.state.messagesRef
      .child(`${chatRoomId}/message`)
      .on('child_added', DataSnapshot => {
        messagesArray.push(DataSnapshot.val());
        this.setState({
          message: messagesArray,
          isLoading: false,
        });
        this.postCounter(messagesArray);
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

  postCounter = messagesArray => {
    let userPosts = messagesArray.reduce((acc, currentMessage) => {
      if (currentMessage.user.userDisplayName in acc) {
        acc[currentMessage.user.userDisplayName].count += 1;
      } else {
        acc[currentMessage.user.userDisplayName] = {
          image: currentMessage.user.userImage,
          count: 1,
        };
      }
      return acc;
    }, {});
    console.log('userPosts:', userPosts);
    this.props.dispatch(setUserPosts(userPosts));
  };

  addTypingListener = chatRoomId => {
    let typingUsers = [];
    this.state.typingRef.child(chatRoomId).on('child_added', snapshot => {
      if (snapshot?.key !== this.props.user?.uid) {
        // 입력 중인 유저 정보 가져오기
        typingUsers = typingUsers.concat({
          id: snapshot.key,
          name: snapshot.val(),
        });
      }
      this.setState({ typingUsers });
    });

    this.state.typingRef.child(chatRoomId).on('child_removed', snapshot => {
      // child_removed인 유저 정보 가져오기
      let index = typingUsers.findIndex(user => snapshot.key === user.id);
      if (index !== -1) {
        typingUsers.splice(index, 1);
        this.setState({ typingUsers });
      }
    });
  };

  render() {
    console.log('post count', this.state.postCounts);
    console.log('typing users', this.state.typingUsers);

    const { message, searchTerm, searchResults } = this.state;
    console.log('main panel rendered');
    return (
      <div style={{ padding: '2rem 2rem 0 2rem' }}>
        <MessageHeader handleSearchChange={this.handleSearchChange} />

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
          {searchTerm
            ? this.renderMessages(searchResults)
            : this.renderMessages(message)}
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
