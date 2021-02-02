import React, { Component } from 'react';
import Message from './Message';
import MessageForm from './MessageForm';
import MessageHeader from './MessageHeader';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { setUserPosts } from '../../../redux/actions/chatRoom_action';

export class MainPanel extends Component {
  scrollRef = React.createRef();

  state = {
    message: [],
    messagesRef: firebase.database().ref('messages'),
    typingRef: firebase.database().ref('typing'),
    isLoading: true,
    searchTerm: '',
    searchResults: [],
    searchLoading: false,
    typingUsers: [],
    listenerLists: [],
  };

  componentDidMount() {
    const { chatRoom } = this.props && this.props;
    if (chatRoom) {
      this.addMessagesListener(chatRoom.id);
      this.addTypingListener(chatRoom.id);
    }
  }
  componentWillUnmount() {
    this.state.messagesRef.off();
    this.removeListeners(this.state.listenerLists); // 리스너의 이벤트 타입이 두가지 이므로 한번에 off 할 수 없다
  }

  componentDidUpdate() {
    if (this.scrollRef) {
      console.log(this.scrollRef.current);
      this.scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  removeListeners = listeners => {
    listeners.forEach(listener => {
      listener.ref.child(listener.id).off(listener.event);
    });
  };
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

    this.addToListenerLists(chatRoomId, this.state.typingRef, 'child_added');

    this.state.typingRef.child(chatRoomId).on('child_removed', snapshot => {
      // child_removed인 유저 정보 가져오기
      let index = typingUsers.findIndex(user => snapshot.key === user.id);
      if (index !== -1) {
        typingUsers.splice(index, 1);
        this.setState({ typingUsers });
      }
    });
    this.addToListenerLists(chatRoomId, this.state.typingRef, 'child_removed');
  };

  addToListenerLists = (id, ref, event) => {
    // 등록된 리스너 인지 확인
    const index = this.state.listerLists?.findIndex(item => {
      return item.id === id && item.ref === ref && item.event === event;
    });
    if (index === -1) {
      const newListener = {
        id: id,
        ref: ref,
        event: event,
      };

      this.setState({
        listerLists: this.state.listerLists.concat(newListener),
      });
    }
  };

  renderTypingUsers = typingUsers => {
    return (
      typingUsers.length > 0 &&
      typingUsers.map(user => {
        console.log('입력중');
        return <span key={user.name}>{user.name}님이 입력 중입니다.</span>;
      })
    );
  };

  render() {
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
          {this.renderTypingUsers(this.state.typingUsers)}
          <div ref={this.scrollRef} />
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
