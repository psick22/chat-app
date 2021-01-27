import React, { useEffect } from 'react';

import { Switch, Route, useHistory } from 'react-router-dom';

import ChatPage from './components/ChatPage/ChatPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';

import firebase from './firebase';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser, setUser } from './redux/actions/user_action';

function App(props) {
  let history = useHistory();
  let dispatch = useDispatch();
  const isLoading = useSelector(state => state.user.isLoading);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      console.log('user', user);
      if (user) {
        // 로그인이 된 상태
        // @ts-ignore
        history.push('/');
        dispatch(setUser(user));
      } else {
        // 로그인이 되지 않은 상태
        // @ts-ignore
        history.push('/login');
        dispatch(clearUser());
      }
    });
  }, [history]);

  if (isLoading) {
    return <div>Loading...</div>;
  } else {
    return (
      <Switch>
        <Route exact path='/' component={ChatPage} />
        <Route exact path='/login' component={LoginPage} />
        <Route exact path='/register' component={RegisterPage} />
      </Switch>
    );
  }
}

export default App;
