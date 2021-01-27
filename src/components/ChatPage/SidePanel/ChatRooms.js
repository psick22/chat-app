import React, { Component } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { FaRegSmileWink, FaPlus } from 'react-icons/fa';

export class ChatRooms extends Component {
  state = {
    show: false,
  };

  handleClose = () => this.setState({ show: false });
  handleShow = () => this.setState({ show: true });

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
          CHAT ROOMS{''} (1)
          <FaPlus
            onClick={this.handleShow}
            style={{ position: 'absolute', right: 0, cursor: 'pointer' }}
          />
        </div>
        {/* Add Chat Room Modal */}

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId='formBasicEmail'>
                <Form.Label>채팅방 이름</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='채팅방 이름을 입력해주세요'
                />
              </Form.Group>

              <Form.Group controlId='formBasicPassword'>
                <Form.Label>채팅방 설명</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='채팅방 설명을 입력해주세요'
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={this.handleClose}>
              Close
            </Button>
            <Button variant='primary' onClick={this.handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default ChatRooms;
