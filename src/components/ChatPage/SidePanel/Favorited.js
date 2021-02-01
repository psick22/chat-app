import { FaRegSmileWink } from 'react-icons/fa';
import firebase from '../../../firebase';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  setCurrentChatRoom,
  setPrivateChatRoom,
} from '../../../redux/actions/chatRoom_action';

// const chatRoom = useSelector(state => state.chatRoom);
//   const currentUser = useSelector(state => state.user.currentUser);
//   const usersRef = firebase.database().ref('users');

export class Favorited extends Component {
  state = {
    usersRef: firebase.database().ref('users'),
    favoriteChatRooms: [],
    activeChatRoomId: '',
  };

  componentDidMount() {
    if (this.props.currentUser) {
      this.addListeners(this.props.currentUser.uid);
    }
  }
  componentWillUnmount() {
    if (this.props.currentUser) {
      this.removeListeners(this.props.currentUser.uid);
    }
  }
  removeListeners = userId => {
    this.state.usersRef.child(`${userId}/favorite`).off();
  };

  addListeners = userId => {
    const { usersRef } = this.state;

    usersRef.child(`${userId}/favorite`).on('child_added', DataSnapshot => {
      const favoriteChatRoom = {
        id: DataSnapshot.key,
        ...DataSnapshot.val(),
      };
      this.setState({
        favoriteChatRooms: [...this.state.favoriteChatRooms, favoriteChatRoom],
      });
    });
    usersRef.child(`${userId}/favorite`).on('child_removed', DataSnapshot => {
      const chatRoomToRemove = { id: DataSnapshot.key, ...DataSnapshot.val() };
      const filteredChatRoom = this.state.favoriteChatRooms.filter(chatRoom => {
        return chatRoom.id !== chatRoomToRemove.id;
      });

      this.setState({
        favoriteChatRooms: filteredChatRoom,
      });
    });
  };

  renderFavoriteChatRooms = favoriteChatRoom => {
    return (
      favoriteChatRoom.length > 0 &&
      favoriteChatRoom.map(chatRoom => (
        <li
          key={chatRoom.id}
          onClick={() => this.changeChatRoom(chatRoom)}
          style={{
            backgroundColor:
              chatRoom.id === this.state.activeChatRoomId && '#ffffff45',
          }}
        >
          # {chatRoom.name}
        </li>
      ))
    );
  };

  changeChatRoom = room => {
    this.props.dispatch(setCurrentChatRoom(room));
    this.setState({ activeChatRoomId: room.id });
    this.props.dispatch(setPrivateChatRoom(false));
  };

  render() {
    const { favoriteChatRooms } = this.state;
    return (
      <div>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <FaRegSmileWink style={{ marginRight: '3px' }} />
          즐겨찾기
        </span>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {this.renderFavoriteChatRooms(favoriteChatRooms)}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.user.currentUser,
  };
};

export default connect(mapStateToProps)(Favorited);
