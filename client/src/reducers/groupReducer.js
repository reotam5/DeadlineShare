import {
  GET_INVITES,
  GROUP_LOADED,
  GROUP_LOADING,
  GROUP_LOAD_FAIL,
} from "../actions/types";

const initialState = {
  isLoading: false,
  groups: [],
  invites: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GROUP_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case GROUP_LOADED:
      return {
        ...state,
        isLoading: false,
        groups: action.payload,
      };
    case GROUP_LOAD_FAIL:
      return {
        ...state,
        groups: [],
        isLoading: false,
      };
    case GET_INVITES:
      return {
        ...state,
        invites: action.payload,
      };
    default:
      return state;
  }
}
