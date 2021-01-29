import React from 'react';
import { Button, Col, Form, ProgressBar, Row } from 'react-bootstrap';

function MessageForm() {
  return (
    <div>
      <Form>
        <Form.Group controlId='exampleForm.ControlTextarea1'>
          <Form.Label>Example textarea</Form.Label>
          <Form.Control as='textarea' rows={3} />
        </Form.Group>
      </Form>
      <ProgressBar style={{ marginBottom: '1rem' }} now={45} />
      <Row style={{ marginBottom: '1rem' }}>
        <Col>
          <Button>SEND</Button>
        </Col>
        <Col>
          <Button>UPLOAD</Button>
        </Col>
      </Row>
    </div>
  );
}

export default MessageForm;
