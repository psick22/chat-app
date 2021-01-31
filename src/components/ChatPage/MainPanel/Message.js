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
    <Media>
      <img
        width={40}
        height={40}
        className='mr-3'
        src={message.user.userImage}
        alt={message.user.userDisplayName}
      />
      <Media.Body
        style={{
          backgroundColor: isMine(message.user.userUid),
          marginBottom: '0.8rem',
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
              style={{ maxWidth: '300px' }}
              src={message.files}
              alt='이미지'
            />
            <p>{message.content}</p>
          </>
        ) : (
          <p>{message.content}</p>
        )}
      </Media.Body>
    </Media>
  );
}

export default Message;
