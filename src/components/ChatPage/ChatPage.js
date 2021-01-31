import React from 'react';
import { useSelector } from 'react-redux';
import MainPanel from './MainPanel/MainPanel';
import SidePanel from './SidePanel/SidePanel';

function ChatPage() {
  const currentChatRoom = useSelector(state => state.chatRoom.currentChatRoom);
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '300px' }}>
        <SidePanel />
      </div>
      <div style={{ width: '100%' }}>
        <MainPanel key={currentChatRoom?.id} />
      </div>
    </div>
  );
}

export default ChatPage;
