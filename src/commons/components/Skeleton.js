import React from 'react';
import './Skeleton.css';

export default function Skeleton() {
  return (
    <div className='skeleton'>
      <div className='skeleton-avatar'></div>
      <div className='skeleton-author'></div>
      <div className='skeleton-description'></div>
    </div>
  );
}
