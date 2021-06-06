import { combineReducers } from "redux";
import authReducer from "./authReducer.js";
import errorReducer from "./errorReducer.js";
import groupReducer from "./groupReducer.js";

export default combineReducers({
  auth: authReducer,
  error: errorReducer,
  group: groupReducer,
});
