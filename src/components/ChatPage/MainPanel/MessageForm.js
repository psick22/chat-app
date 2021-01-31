import firebase from 'firebase';
import React, { useRef, useState, useEffect } from 'react';
import { Button, Col, Form, ProgressBar, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import mime from 'mime-types';

function MessageForm() {
  const [isValid, setIsValid] = useState(false);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [fileUrl, setFileUrl] = useState('');
  const [progress, setProgress] = useState(0);

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
      user: {
        userUid: currentUser.uid,
        userDisplayName: currentUser.displayName,
        userImage: currentUser.photoURL,
      },
      timestamp: timestamp,
      content: text,
    };

    if (fileUrl !== null) {
      message['files'] = fileUrl;
      message['content'] = `${fileUrl}\n` + text;
    }

    return { userInfo, message };
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const { userInfo, message } = createMessage();

      const messagekey = messagesRef
        .child(`${currentChatRoom.id}/message`)
        .push().key;

      console.log(messagekey);
      let updates = {};
      updates[`${currentChatRoom.id}/message/${messagekey}`] = message;

      await messagesRef
        .child(`${currentChatRoom.id}/users/${currentUser.uid}`)
        .set(userInfo);

      await messagesRef.update(updates);

      setLoading(false);
      setText('');
      setIsValid(false);
      setErrors([]);
      textInput.current.focus();
    } catch (error) {
      setErrors(prevState => prevState.concat(error.message));
      console.log(error);
      setLoading(false);
    }
  };

  const handleSubmitFiles = async fileUrl => {
    setLoading(true);

    try {
      const { userInfo, message } = createMessage(fileUrl);

      const messagekey = messagesRef
        .child(`${currentChatRoom.id}/message`)
        .push().key;

      console.log(messagekey);
      let updates = {};
      updates[`${currentChatRoom.id}/message/${messagekey}`] = message;

      await messagesRef
        .child(`${currentChatRoom.id}/users/${currentUser.uid}`)
        .set(userInfo);

      await messagesRef.update(updates);

      setLoading(false);
      setText('');
      setIsValid(false);
      setErrors([]);
      setProgress(0);
      textInput.current.focus();
    } catch (error) {
      setErrors(prevState => prevState.concat(error.message));
      console.log(error);
      setLoading(false);
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
      // TODO 파일명에 확장자 달아줘서 다운로드 받으면 바로 열수 있게
      if (!e.target.files[0]) {
        console.log('undefine filed');
      } else {
        // NOTE storage에 올리고 다운로드 url 받아오기
        let timestamp = new Date().getTime();
        const files = e.target.files && e.target.files[0];
        const metadata = {
          contentType: mime.lookup(files.name),
        };

        let uploadTask = await storageRef
          .child(`files/${currentChatRoom.id}/${timestamp}-${files.name}`)
          .put(files, metadata)
          .on(
            'state_changed',
            TaskSnapshot => {
              let progress = Math.round(
                (TaskSnapshot.bytesTransferred / TaskSnapshot.totalBytes) * 100,
              );
              console.log(progress);
              setProgress(progress);
            },
            error => {
              console.log(error);
            },
            complete => {
              storageRef
                .child(`files/${currentChatRoom.id}/${timestamp}-${files.name}`)
                .getDownloadURL()
                .then(res => {
                  console.log('url', res);
                  handleSubmitFiles(res);
                })
                .catch(error => console.log(error));
            },
          );

        console.log('upload done', uploadTask);

        // TODO 받아온 url 채팅창에 파일이름으로 입력하고 (TODO)링크 (이게되나?)
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

  useEffect(() => {
    textInput.current.focus();
  }, []);

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
      {progress > 0 && (
        <ProgressBar style={{ marginBottom: '1rem' }} now={progress} />
      )}
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
