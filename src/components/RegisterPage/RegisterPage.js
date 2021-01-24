import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import './RegisterPage.css';

export default function RegisterPage() {
  const { register, handleSubmit, watch, errors } = useForm();
  const password = useRef();
  password.current = watch('password');

  const onSubmit = data => console.log(data);

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

        <input
          style={{ fontWeight: 'bold', textDecoration: 'none' }}
          type='submit'
          value='Create account'
        />
        <Link style={{ color: 'gray', textDecoration: 'none' }} to='/login'>
          이미 아이디가 있으신가요?
        </Link>
      </form>
    </div>
  );
}
