import React from 'react';
import UserPanel from './UserPanel';
import Favorited from './Favorited';
import DirectMessages from './DirectMessages';
import ChatRooms from './ChatRooms';

function SidePanel() {
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

      <Favorited />

      <DirectMessages />

      <ChatRooms />
    </div>
  );
}

export default SidePanel;
