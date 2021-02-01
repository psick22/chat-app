import React from 'react';
import {
  Accordion,
  Button,
  Card,
  Col,
  Container,
  FormControl,
  Image,
  InputGroup,
  Row,
} from 'react-bootstrap';
import { FaLock, FaUnlock } from 'react-icons/fa';
import { MdFavorite } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';
import { useSelector } from 'react-redux';

function MessageHeader({ handleSearchChange }) {
  const chatRoom = useSelector(state => state.chatRoom);
  return (
    <div
      style={{
        width: '100%',
        height: '170px',
        border: '.2rem solid #ececec',
        borderRadius: '4px',
        padding: '1rem',
        marginBottom: '1rem',
      }}
    >
      <Container>
        <Row>
          <Col>
            <h2>
              {chatRoom && chatRoom.isPrivate ? <FaLock /> : <FaUnlock />}
              {'  '}
              {chatRoom.currentChatRoom?.name}
              {'  '}
              <MdFavorite />
            </h2>
          </Col>
          <Col>
            <InputGroup className='mb-3'>
              <InputGroup.Prepend>
                <InputGroup.Text id='basic-addon1'>
                  <AiOutlineSearch />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                onChange={handleSearchChange}
                placeholder='검색'
                aria-label='Search'
                aria-describedby='basic-addon1'
              />
            </InputGroup>
          </Col>
        </Row>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Image src='' /> user name
        </div>
        <Row>
          <Col>
            <Accordion defaultActiveKey='1'>
              <Card>
                <Card.Header style={{ padding: '0 1rem' }}>
                  <Accordion.Toggle as={Button} variant='link' eventKey='0'>
                    Description
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey='0'>
                  <Card.Body>Description</Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>

          <Col>
            <Accordion defaultActiveKey='1'>
              <Card>
                <Card.Header style={{ padding: '0 1rem' }}>
                  <Accordion.Toggle as={Button} variant='link' eventKey='0'>
                    Post Count{' '}
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey='0'>
                  <Card.Body>Post Count</Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default MessageHeader;
