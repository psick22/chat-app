import React, { useEffect, useState } from 'react';
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
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import firebase from '../../../firebase';

function MessageHeader({ handleSearchChange }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const chatRoom = useSelector(state => state.chatRoom);
  const currentUser = useSelector(state => state.user.currentUser);
  const usersRef = firebase.database().ref('users');
  const handleFavorite = () => {
    if (isFavorite) {
      usersRef
        .child(`${currentUser.uid}/favorite/${chatRoom.currentChatRoom.id}`)
        .remove(err => {
          if (err !== null) {
            console.log(err);
          }
        });
      setIsFavorite(false);
    } else {
      usersRef
        .child(`${currentUser.uid}/favorite/${chatRoom.currentChatRoom.id}`)
        .update({
          name: chatRoom.currentChatRoom.name,
          description: chatRoom.currentChatRoom.description,
          createdBy: {
            name: chatRoom.currentChatRoom.createdBy.name,
            image: chatRoom.currentChatRoom.createdBy.image,
          },
          updated_time: Date.now(),
        });
      setIsFavorite(true);
    }
  };

  const addFavoriteListener = () => {
    usersRef
      .child(`${currentUser.uid}/favorite/`)
      .once('value')
      .then(data => {
        if (data.val() !== null) {
          const keys = Object.keys(data.val()); // 즐겨찾기 방 아이디의 배열
          const isAlreadyFavorite = keys.includes(chatRoom.currentChatRoom?.id);
          isAlreadyFavorite ? setIsFavorite(true) : setIsFavorite(false);
        }
      });
  };

  useEffect(() => {
    if (chatRoom && currentUser) {
      addFavoriteListener();
    }
  }, []);

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

              {!chatRoom.isPrivate && (
                <span style={{ cursor: 'pointer' }} onClick={handleFavorite}>
                  {isFavorite ? (
                    <MdFavorite style={{ marginBottom: '8px' }} />
                  ) : (
                    <MdFavoriteBorder style={{ marginBottom: '8px' }} />
                  )}
                </span>
              )}
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
