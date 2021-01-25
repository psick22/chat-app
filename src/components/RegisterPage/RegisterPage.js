import firebase from '../../firebase';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import './RegisterPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
var md5 = require('md5');

export default function RegisterPage() {
  const { register, handleSubmit, watch, errors } = useForm();
  const [errorFromSubmit, setErrorFromSubmit] = useState('');
  const [loading, setLoading] = useState(false);
  const password = useRef();
  password.current = watch('password');

  const onSubmit = async data => {
    try {
      setLoading(true);
      // 유저 생성
      let createdUser = await firebase
        .auth()
        .createUserWithEmailAndPassword(data.email, data.password);

      // 상세 프로필 추가
      await createdUser.user.updateProfile({
        displayName: data.name,
        photoURL: `http://gravatar.com/avatar/${md5(data.email)}?d=identicon`, // md5로 랜덤 프로필 이미지 생성해서 부여
      });

      // 데이터베이스에 저장
      await firebase.database().ref('users').child(createdUser.user.uid).set({
        name: createdUser.user.displayName,
        image: createdUser.user.photoURL,
      });

      console.log(createdUser);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setErrorFromSubmit(`ERROR : ${error.message}`);
      setLoading(false);
      setTimeout(() => {
        setErrorFromSubmit('');
      }, 5000);
    }
  };

  console.log(watch('password')); // you can watch individual input by pass the name of the input

  return (
    <div className='auth-wrapper'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ textAlign: 'center' }}>
          <h6 style={{ fontWeight: 300, color: 'gray', fontSize: '15px' }}>
            Join Talk
          </h6>
          <h3 style={{ marginBottom: '35px' }}>Create your account</h3>
        </div>

        <label>Email address</label>
        <input //
          name='email'
          type='email'
          ref={register({ required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.email && <p>이메일은 필수 입력 항목입니다.</p>}

        <label>Name</label>
        <input //
          name='name'
          ref={register({ required: true, maxLength: 10 })}
        />
        {errors.name?.type === 'required' && (
          <p> 이름은 필수 입력 항목입니다. </p>
        )}
        {errors.name?.type === 'maxLength' && (
          <p> 이름은 10글자를 초과할 수 없습니다. </p>
        )}
        <label>Password</label>
        <input //
          name='password'
          type='password'
          ref={register({ required: true, minLength: 6 })}
        />
        {errors.password?.type === 'required' && (
          <p> 비밀번호는 필수 입력 항목입니다. </p>
        )}
        {errors.password?.type === 'minLength' && (
          <p> 비밀번호는 최소 6글자 이상이어야 합니다. </p>
        )}
        <label>Password confirm</label>
        <input //
          name='password_confirm'
          type='password'
          ref={register({
            required: true,
            validate: value => value === password.current,
          })}
        />
        {errors.password_confirm?.type === 'required' && (
          <p> 비밀번호 확인은 필수 입력 항목입니다. </p>
        )}
        {errors.password_confirm?.type === 'validate' && (
          <p> 비밀번호 확인은 비밀번호와 일치해야 합니다. </p>
        )}
        {errorFromSubmit && <p>{errorFromSubmit}</p>}

        {!loading ? (
          <input
            style={{ fontWeight: 'bold', textDecoration: 'none' }}
            type='submit'
            value='Create account'
          />
        ) : (
          <div>
            <input
              style={{ fontWeight: 'bold', textDecoration: 'none' }}
              type='submit'
              disabled
              value='Creating account...'
            />

            {/* <button className='btn btn-primary' type='button' disabled>
              <span
                className='spinner-border spinner-border-sm'
                role='status'
                aria-hidden='true'
              ></span>
              Loading...
            </button> */}
          </div>
        )}

        <Link style={{ color: 'gray', textDecoration: 'none' }} to='/login'>
          이미 아이디가 있으신가요?
        </Link>
      </form>
    </div>
  );
}
