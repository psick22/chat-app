import React, { useState, useEffect } from 'react';
import { FaRegSmileWink } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import firebase from '../../../firebase';

function Favorited() {
  const [favoriteChatRooms, setFavoriteChatRooms] = useState([]);
  const chatRoom = useSelector(state => state.chatRoom);
  const currentUser = useSelector(state => state.user.currentUser);
  const usersRef = firebase.database().ref('users');
  const renderChatRooms = () => {};

  const stateHandler = newState => {
    console.log('setstate');
    setFavoriteChatRooms(newState);
    console.log('변경된 상태', favoriteChatRooms);
  };

  const addListeners = () => {
    usersRef
      .child(`${currentUser.uid}/favorite`)
      .on('child_added', snapshot => {
        console.log('리스너 등록');
        console.log(snapshot.key); // 리스너에 감지된 child의 key와 value
        const favoriteChatRoom = {
          id: snapshot.key,
          ...snapshot.val(),
        };
        const newFavoriteList = [...favoriteChatRooms];
        console.log('추가전 리스트', newFavoriteList);
        newFavoriteList.push(favoriteChatRoom);

        stateHandler(newFavoriteList);
        console.log('추가후 리스트', newFavoriteList);
      });

    usersRef
      .child(`${currentUser.uid}/favorite`)
      .on('child_removed', snapshot => {
        const toRemoveFavorite = {
          id: snapshot.key,
          ...snapshot.val(),
        };
        console.log('삭제 전 리스트', favoriteChatRooms);

        const newFavoriteList = favoriteChatRooms.filter(item => {
          return item.id !== toRemoveFavorite.id;
        });
        console.log('삭제 후 리스트', newFavoriteList);

        stateHandler(newFavoriteList);
      });
  };

  useEffect(() => {
    console.log('이벤트리스너등록 useEffect');
    currentUser && addListeners();
  }, []);

  useEffect(() => {
    console.log(favoriteChatRooms);
  }, [favoriteChatRooms]);

  return (
    <div>
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <FaRegSmileWink style={{ marginRight: '3px' }} />
        즐겨찾기
      </span>
      <ul style={{ listStyleType: 'none', padding: 0 }}>{renderChatRooms()}</ul>
    </div>
  );
}

export default Favorited;
