/* eslint-disable import/no-anonymous-default-export */
import { SET_CURRENT_CHAT_ROOM } from '../actions/types';

const initialChatRoomState = {
  currentChatRoom: null,
};

export default function (state = initialChatRoomState, action) {
  switch (action.type) {
    case SET_CURRENT_CHAT_ROOM:
      return {
        ...state,
        currentChatRoom: action.payload,
      };

    default:
      return state;
  }
}
