import firebase from 'firebase';
import React, { useRef, useState } from 'react';
import { Button, Col, Form, ProgressBar, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';

function MessageForm() {
  const [isValid, setIsValid] = useState(false);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const textInput = useRef();
  const currentChatRoom = useSelector(state => state.chatRoom.currentChatRoom);
  const currentUser = useSelector(state => state.user.currentUser);

  const messagesRef = firebase.database().ref('messages');

  const handleSubmit = e => {
    // e.preventDefault();
    let timestamp = Math.floor(new Date().getTime() / 1000);
    messagesRef.child(`${currentChatRoom.id}/users/${currentUser.uid}`).update({
      user: {
        displayName: currentUser.displayName,
        image: currentUser.photoURL,
      },
    });
    const messagekey = messagesRef.child(`${currentChatRoom.id}/message`).push()
      .key;
    messagesRef.child(`${currentChatRoom.id}/message/${messagekey}`).update({
      userUid: currentUser.uid,
      userDisplayName: currentUser.displayName,
      timestamp: timestamp,
      content: text,
    });

    setText('');
    textInput.current.focus();
    setIsValid(false);
  };
  const handleChange = e => {
    if (e.target.value) {
      setIsValid(true);
      // console.log(isValid);
    } else {
      setIsValid(false);
      // console.log(isValid);
    }
    setText(e.target.value);
  };
  const handleEnter = e => {
    if (!isValid && e.keyCode === 13) {
      e.preventDefault();
    } else {
      if (e.keyCode === 13) {
        if (e.shiftKey) {
          setText(e.target.value);
        } else {
          e.preventDefault();
          setText('');
          handleSubmit(e);
        }
      }
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId='exampleForm.ControlTextarea1'>
          <Form.Control
            ref={textInput}
            as='textarea'
            rows={3}
            value={text}
            onChange={handleChange}
            onKeyDown={handleEnter}
          />
        </Form.Group>
      </Form>

      <ProgressBar style={{ marginBottom: '1rem' }} now={45} />
      <Row style={{ marginBottom: '1rem' }}>
        <Col>
          <Button
            onClick={handleSubmit}
            disabled={isValid ? false : true}
            style={{ width: '100%' }}
          >
            SEND
          </Button>
        </Col>
        <Col>
          <Button style={{ width: '100%' }}>UPLOAD</Button>
        </Col>
      </Row>
    </div>
  );
}

export default MessageForm;
