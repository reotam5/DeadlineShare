import { combineReducers } from "redux";
import assignmentReducer from "./assignmentReducer.js";
import authReducer from "./authReducer.js";
import errorReducer from "./errorReducer.js";
import groupReducer from "./groupReducer.js";

export default combineReducers({
  auth: authReducer,
  error: errorReducer,
  group: groupReducer,
  assignment: assignmentReducer,
});
