import axios from "axios";
import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
} from "./types";
import { returnErrors } from "./errorActions";

export const login = (email, password) => (dispatch) => {
  //loading user
  dispatch({ type: USER_LOADING });

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body =
    !email || !password
      ? { id: "60ade47097619a10e8ac63f2" }
      : JSON.stringify({ email, password });

  axios
    .post("/api/auth/login", body, config)
    .then((res) => {
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    })
    .catch((error) => {
      dispatch(returnErrors(error.response.data, error.response.status));
      dispatch({ type: LOGIN_FAIL });
    });
};

export const loadUser = () => (dispatch) => {
  //loading user
  dispatch({ type: USER_LOADING });

  axios
    .post("/api/auth/loadUser")
    .then((res) => {
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    })
    .catch((error) => {
      dispatch(returnErrors(error.response.data, error.response.status));
      dispatch({ type: AUTH_ERROR });
    });
};

export const register = (name, email, password) => (dispatch) => {
  //loading user
  dispatch({ type: USER_LOADING });

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ name, email, password });

  axios
    .post("/api/auth/register", body, config)
    .then((res) =>
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      })
    )
    .catch((error) => {
      dispatch(
        returnErrors(
          error.response.data,
          error.response.status,
          "REGISTER_FAIL"
        )
      );
      dispatch({ type: REGISTER_FAIL });
    });
};

export const logout = () => (dispatch) => {
  axios
    .post("/api/auth/logout")
    .then((res) => {
      dispatch({
        type: LOGOUT_SUCCESS,
      });
    })
    .catch((error) => {
      dispatch(returnErrors(error.response.data, error.response.status));
      dispatch({ type: AUTH_ERROR });
    });
};
