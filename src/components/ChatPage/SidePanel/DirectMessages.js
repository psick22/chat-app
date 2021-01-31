import React, { Component } from 'react';
import { FaRegSmileWink, FaPlus } from 'react-icons/fa';
import { Modal, Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import firebase from '../../../firebase';
import {
  setCurrentChatRoom,
  setPrivateChatRoom,
} from '../../../redux/actions/chatRoom_action';

export class DirectMessages extends Component {
  state = {
    usersArray: [],
    usersRef: firebase.database().ref('users'),
    chatRoomsRef: firebase.database().ref('chatRooms'),
    activeChatRoom: '',
  };

  //TODO 유저의 아이디와 로그인 상태 표시 필요 (일단은 회원가입된 모든 유저)

  componentDidMount() {
    const { user } = this.props;
    console.log('DM mount');
    if (user) {
      console.log('이벤트 리스너 등록');
      this.addUsersListener(user.uid);
    }
  }

  renderDirectMessages = usersArray => {
    console.log('renderDirectMessages', usersArray);
    usersArray = usersArray?.map(user => {
      console.log(user);
      return (
        <li
          key={user.uid}
          style={{
            backgroundColor:
              user.uid === this.state.activeChatRoom && '#ffffff45',
          }}
          onClick={e => this.changeChatRoom(user)}
        >
          @ {user.name}
        </li>
      );
    });
    return usersArray;
  };

  // NOTE 두 유저 간의 고유한 대화방 생성 로직
  changeChatRoom = targetUser => {
    const { user } = this.props;

    const chatRoomId = this.getChatRoomId(user.uid, targetUser.uid);
    const chatRoomData = {
      id: chatRoomId,
      name: targetUser.name,
    };
    this.props.dispatch(setCurrentChatRoom(chatRoomData));
    this.props.dispatch(setPrivateChatRoom(true));
    this.setState({ activeChatRoom: targetUser.uid });
  };

  getChatRoomId = (uid1, uid2) => {
    console.log(uid1, uid2);
    return uid1 > uid2 ? `${uid1}-${uid2}` : `${uid2}-${uid1}`;
  };

  addUsersListener = currentUserUid => {
    let users = [];
    const { usersRef } = this.state;
    usersRef.on('child_added', snapshot => {
      // console.log('currentUserUid', currentUserUid);
      // console.log('snapshot', snapshot);
      if (snapshot.key !== currentUserUid) {
        // console.log(snapshot.val());
        let user = snapshot.val();
        user['uid'] = snapshot.key;
        user['status'] = 'offline';
        users.push(user);
        console.log('users', users);
        this.setState({ usersArray: users });
      }
    });
  };

  // TODO 로그인 했을 때 DM 방이 바로 안뜨고 새로고침해야 뜨는데 이거 고쳐야됨

  render() {
    return (
      <div>
        <div
          style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <FaRegSmileWink style={{ marginRight: 3 }} />
          DIRECT MESSAGES{''} (1)
        </div>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {this.renderDirectMessages(this.state.usersArray)}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.currentUser,
  };
};

export default connect(mapStateToProps)(DirectMessages);
