import React from 'react';
import UserPanel from './UserPanel';
import Favorited from './Favorited';
import DirectMessages from './DirectMessages';
import ChatRooms from './ChatRooms';
import { useSelector } from 'react-redux';

function SidePanel() {
  const currentUser = useSelector(state => state.user.currentUser);

  return (
    <div
      style={{
        backgroundColor: '#7b83eb',
        padding: '2rem',
        minHeight: '100vh',
        color: 'white',
        minWidth: '275px',
      }}
    >
      <UserPanel />

      <Favorited key={currentUser?.uid} />

      <ChatRooms />

      <DirectMessages />
    </div>
  );
}

export default SidePanel;
