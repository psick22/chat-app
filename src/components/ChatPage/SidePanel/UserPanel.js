import { Dropdown } from 'react-bootstrap';
import React, { useRef } from 'react';
import { IoIosChatboxes } from 'react-icons/io';
import Image from 'react-bootstrap/Image';
import { useSelector, useDispatch } from 'react-redux';
import firebase from 'firebase';
import { setPhotoURL } from '../../../redux/actions/user_action';

function UserPanel() {
  // @ts-ignore
  const user = useSelector(state => state.user.currentUser);

  const dispatch = useDispatch();

  const inputImageRef = useRef(null);
  const storageRef = firebase.storage().ref();

  const handleLogout = () => {
    firebase.auth().signOut();
  };

  const handleProfileChange = () => {
    inputImageRef.current.click();
  };

  const handleUploadImage = async e => {
    const files = e.target.files[0];
    console.log(files?.type);
    const metadata = { contentType: files.type };

    try {
      let uploadTaskSnapshot = await storageRef
        .child(`user_images/${user.uid}`)
        .put(files, metadata);
      console.log('upload done', uploadTaskSnapshot);

      let path = await uploadTaskSnapshot.ref.getDownloadURL();
      // auth 유저 프로필 수정
      const currentUser = firebase.auth().currentUser;

      await currentUser.updateProfile({
        photoURL: path,
      });
      // 리덕스 수정
      dispatch(setPhotoURL(path));

      // 데이터 베이스 수정
      await firebase.database().ref('users').child(user.uid).update({
        image: path,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {/* logo */}
      <h3 style={{ color: 'white' }}>
        <IoIosChatboxes /> Psick Talk
      </h3>
      <div style={{ display: 'flex', marginBottom: '1rem' }}>
        <Image
          src={user?.photoURL}
          style={{ width: '30p', height: '30px', marginTop: '3px' }}
          roundedCircle
        />
        <Dropdown>
          <Dropdown.Toggle
            style={{ background: 'transparent', border: '0px' }}
            id='dropdown-basic'
          >
            {user?.displayName}
            {'  '}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={handleProfileChange}>
              프로필 사진 변경
            </Dropdown.Item>
            <input //
              ref={inputImageRef}
              style={{ display: 'none' }}
              type='file'
              accept='image/jpeg, image/png'
              onChange={handleUploadImage}
            />
            <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}

export default UserPanel;
