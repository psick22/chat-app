import { SET_USER } from './types';

export function setUser(user) {
  return {
    type: SET_USER,
    payload: user,
  };
}
