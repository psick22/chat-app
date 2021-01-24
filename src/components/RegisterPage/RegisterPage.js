import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import './RegisterPage.css';

export default function RegisterPage() {
  const { register, handleSubmit, watch, errors } = useForm();
  const onSubmit = data => {
    console.log(data);
  }; // your form submit function which will invoke after successful validation

  console.log(watch('example')); // you can watch individual input by pass the name of the input

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
        <input name='email' type='email' />
        <label>Name</label>
        <input name='name' />
        {errors.exampleRequired && <p>This field is required</p>}
        <label>Password</label>
        <input name='password' type='password' />
        <label>Password confirm</label>
        <input name='password_confirm' type='password' />
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
