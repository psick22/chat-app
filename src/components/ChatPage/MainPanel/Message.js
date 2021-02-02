import React from 'react';
import { Media } from 'react-bootstrap';
import moment from 'moment';
import { useSelector } from 'react-redux';

function Message({ message }) {
  const timeFromNow = timestamp => moment(timestamp).fromNow();
  const isFile = message => {
    return message.hasOwnProperty('files');
  };

  const currentUser = useSelector(state => state.user.currentUser);
  const isMine = uid => {
    if (uid === currentUser?.uid) {
      return '#ECECEC';
    } else {
      return;
    }
  };
  return (
    <Media style={{ display: 'flex', width: '80%', padding: '0.5rem' }}>
      <img
        style={{ margin: 0 }}
        width={40}
        height={40}
        className='mr-3'
        src={message.user.userImage}
        alt={message.user.userDisplayName}
      />
      <Media.Body
        style={{
          backgroundColor: isMine(message.user.userUid),
          marginBottom: 0,
          width: '80%',
          overflowX: 'hidden',
        }}
      >
        <h5>
          {message.user.userDisplayName}{' '}
          <span style={{ fontSize: '10px', color: 'gray' }}>
            {timeFromNow(message.timestamp)}
          </span>
        </h5>
        {isFile(message) ? (
          <>
            <img
              style={{ width: '30%', minWidth: '300px', display: 'flex' }}
              src={message.files}
              alt='이미지'
            />
            <p style={{ width: '100%', overflowX: 'hidden' }}>
              {message.content}
            </p>
          </>
        ) : (
          <p style={{ width: '100%', overflowX: 'clip' }}>{message.content}</p>
        )}
      </Media.Body>
    </Media>
  );
}

export default Message;
