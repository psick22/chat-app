import React, { Component } from 'react';
import { FaRegSmileWink, FaPlus } from 'react-icons/fa';
import { Modal, Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import firebase from '../../../firebase';

export class DirectMessages extends Component {
  //TODO 유저의 아이디와 로그인 상태 표시 필요 (일단은 회원가입된 모든 유저)
  state = {
    usersArray: [],
    usersRef: firebase.database().ref('users'),
  };

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
        <li key={user.uid} onClick>
          # {user.name}
        </li>
      );
    });
    return usersArray;
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
          <FaPlus
            onClick={this.handleShow}
            style={{ position: 'absolute', right: 0, cursor: 'pointer' }}
          />
        </div>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {this.renderDirectMessages(this.state.usersArray)}
        </ul>

        {/* Add Chat Room Modal */}

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>새 채팅방 생성하기</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId='formBasicEmail'>
                <Form.Label>채팅방 이름</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='채팅방 이름을 입력해주세요'
                  onChange={e => this.setState({ name: e.target.value })}
                />
              </Form.Group>

              <Form.Group controlId='formBasicPassword'>
                <Form.Label>채팅방 설명</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='채팅방 설명을 입력해주세요'
                  onChange={e => this.setState({ description: e.target.value })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={this.handleClose}>
              취소
            </Button>
            <Button variant='primary' onClick={this.handleSubmit}>
              채팅방 생성
            </Button>
          </Modal.Footer>
        </Modal>
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
