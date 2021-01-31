/* eslint-disable import/no-anonymous-default-export */
import { SET_CURRENT_CHAT_ROOM, SET_PRIVATE_CHAT_ROOM } from '../actions/types';

const initialChatRoomState = {
  currentChatRoom: null,
  isPrivate: false,
};

export default function (state = initialChatRoomState, action) {
  switch (action.type) {
    case SET_CURRENT_CHAT_ROOM:
      return {
        ...state,
        currentChatRoom: action.payload,
      };
    case SET_PRIVATE_CHAT_ROOM:
      return {
        ...state,
        isPrivate: action.payload,
      };
    default:
      return state;
  }
}
