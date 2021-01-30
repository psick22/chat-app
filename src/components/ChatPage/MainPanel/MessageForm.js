import firebase from 'firebase';
import React, { useRef, useState } from 'react';
import { Button, Col, Form, ProgressBar, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';

function MessageForm() {
  const [isValid, setIsValid] = useState(false);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [fileUrl, setFileUrl] = useState('');
  const textInput = useRef(null);
  const fileInputRef = useRef(null);

  const currentChatRoom = useSelector(state => state.chatRoom.currentChatRoom);
  const currentUser = useSelector(state => state.user.currentUser);
  const storageRef = firebase.storage().ref();
  const messagesRef = firebase.database().ref('messages');

  const createMessage = (fileUrl = null) => {
    let timestamp = new Date().getTime();
    const userInfo = {
      user: {
        uid: currentUser.uid,
        displayName: currentUser.displayName,
        image: currentUser.photoURL,
      },
    };
    const message = {
      userUid: currentUser.uid,
      userDisplayName: currentUser.displayName,
      timestamp: timestamp,
      content: text,
    };

    if (fileUrl !== null) {
      message['files'] = fileUrl;
    }

    return { userInfo, message };
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const { userInfo, message } = createMessage();
      const messagekey = await messagesRef
        .child(`${currentChatRoom.id}/message`)
        .push().key;

      await messagesRef
        .child(`${currentChatRoom.id}/users/${currentUser.uid}`)
        .set(userInfo);

      await messagesRef
        .child(`${currentChatRoom.id}/message/${messagekey}`)
        .update(message);

      setLoading(false);
      setText('');
      setIsValid(false);
      setErrors([]);
      textInput.current.focus();
    } catch (error) {
      setErrors(prevState => prevState.concat(error.message));
      console.log(error);
    }
  };

  const handleUploadClick = e => {
    console.log(e);
    fileInputRef.current.click();
  };

  const onInputChange = async e => {
    try {
      setFileLoading(true);
      console.log(e);
      // NOTE storage에 올리고 다운로드 url 받아오기
      // TODO 파일명에 확장자 달아줘서 다운로드 받으면 바로 열수 있게
      if (!e.target.files[0]) {
        console.log('undefine filed');
      } else {
        let timestamp = new Date().getTime();
        const files = e.target.files && e.target.files[0];
        console.log(files);
        const metadata = {
          contentType: files.type,
        };

        let uploadFileSnapshot = await storageRef
          .child(`files/${currentChatRoom.id}/${timestamp}`)
          .put(files, metadata);
        console.log('upload done', uploadFileSnapshot);

        let path = await storageRef
          .child(`files/${currentChatRoom.id}/${timestamp}`)
          .getDownloadURL();

        // TODO 받아온 url 채팅창에 파일이름으로 입력하고 (TODO)링크 (이게되나?)

        setFileUrl(path);
        console.log(path);
        const newText = text + files.name;
        console.log(newText);
        setText(newText);
        setIsValid(true);
      }
      setFileLoading(false);
    } catch (error) {
      setErrors(prevState => prevState.concat(error.message));
      console.log(error);
      setFileLoading(false);
    }
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
          {/* isUpload */}
          {fileLoading ? (
            <Button //
              disabled
              style={{ width: '100%' }}
            >
              UPLOADING...
            </Button>
          ) : (
            <Button //
              onClick={e => handleUploadClick(e)}
              style={{ width: '100%' }}
            >
              UPLOAD
              <input
                ref={fileInputRef}
                type='file'
                style={{ display: 'none' }}
                onChange={onInputChange}
              />
            </Button>
          )}
        </Col>
        <Col>
          {loading ? (
            <Button disabled style={{ width: '100%' }}>
              LOADING
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isValid ? false : true}
              style={{ width: '100%' }}
            >
              SEND
            </Button>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default MessageForm;
