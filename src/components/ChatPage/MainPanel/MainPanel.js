import React, { Component } from 'react';
import Message from './Message';
import MessageForm from './MessageForm';
import MessageHeader from './MessageHeader';

export class MainPanel extends Component {
  render() {
    return (
      <div style={{ padding: '2rem 2rem 0 2rem' }}>
        <Message />
        <div
          style={{
            width: '100%',
            height: '450px',
            border: '.2rem solid #ececec',
            borderRadius: '4px',
            marginBottom: '1rem',
            overflowY: 'auto',
          }}
        ></div>
        <MessageHeader />
        <MessageForm />
      </div>
    );
  }
}

export default MainPanel;
