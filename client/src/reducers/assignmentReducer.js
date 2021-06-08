import {
  ASSIGNMENT_LOADING,
  ASSIGNMENT_LOADED,
  ASSIGNMENT_FAILED,
} from "../actions/types";

const initialState = {
  isLoading: false,
  assignments: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ASSIGNMENT_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case ASSIGNMENT_LOADED:
      return {
        ...state,
        isLoading: false,
        assignments: action.payload,
      };
    case ASSIGNMENT_FAILED:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
}
