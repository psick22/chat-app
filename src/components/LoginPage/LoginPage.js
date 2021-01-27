import firebase from '../../firebase';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function LoginPage(props) {
  const history = useHistory();
  const { register, handleSubmit, watch, errors } = useForm();
  const [errorFromSubmit, setErrorFromSubmit] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async data => {
    try {
      setLoading(true);

      await firebase
        .auth()
        .signInWithEmailAndPassword(data.email, data.password);

      setLoading(false);
    } catch (error) {
      setErrorFromSubmit(`ERROR : ${error.message}`);
      setLoading(false);
      setTimeout(() => {
        setErrorFromSubmit('');
      }, 5000);
    }
  };

  return (
    <div className='auth-wrapper'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ textAlign: 'center' }}>
          <h6 style={{ fontWeight: 300, color: 'gray', fontSize: '15px' }}>
            PSICK
          </h6>
          <h3 style={{ marginBottom: '35px' }}>Sign in to Psick Talk</h3>
        </div>

        <label>Email address</label>
        <input //
          name='email'
          type='email'
          ref={register({ required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.email && <p>이메일은 필수 입력 항목입니다.</p>}

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

        {errorFromSubmit && <p>{errorFromSubmit}</p>}

        {!loading ? (
          <input
            style={{ fontWeight: 'bold', textDecoration: 'none' }}
            type='submit'
            value='Sign in'
          />
        ) : (
          <div>
            <input
              style={{ fontWeight: 'bold', textDecoration: 'none' }}
              type='submit'
              disabled
              value='Signing in...'
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

        <Link style={{ color: 'gray', textDecoration: 'none' }} to='/register'>
          회원가입 하러 가기
        </Link>
      </form>
    </div>
  );
}
