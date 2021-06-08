import axios from "axios";
import {
  ASSIGNMENT_LOADING,
  ASSIGNMENT_LOADED,
  ASSIGNMENT_FAILED,
} from "./types";
import { returnErrors } from "./errorActions";

export const get_assignment = () => (dispatch) => {
  dispatch({ type: ASSIGNMENT_LOADING });

  axios
    .get("/api/assignment/findAll")
    .then((res) => {
      dispatch({
        type: ASSIGNMENT_LOADED,
        payload: res.data.assignments,
      });
    })
    .catch((error) => {
      dispatch(returnErrors(error.response.data, error.response.status));
      dispatch({ type: ASSIGNMENT_FAILED });
    });
};

export const create_assignment =
  ({ title, description, dueOn, groupID }) =>
  (dispatch) => {
    dispatch({ type: ASSIGNMENT_LOADING });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({
      title: title,
      description: description,
      dueOn: dueOn,
      groupID: groupID,
    });

    axios
      .post("/api/assignment/add", body, config)
      .then((res) => {
        axios
          .get("/api/assignment/findAll")
          .then((res) => {
            dispatch({
              type: ASSIGNMENT_LOADED,
              payload: res.data.assignments,
            });
          })
          .catch((error) => {
            dispatch(returnErrors(error.response.data, error.response.status));
            dispatch({ type: ASSIGNMENT_FAILED });
          });
      })
      .catch((error) => {
        dispatch(returnErrors(error.response.data, error.response.status));
        dispatch({ type: ASSIGNMENT_FAILED });
      });
  };

export const mark_as_done =
  ({ assignmentID }) =>
  (dispatch) => {
    dispatch({ type: ASSIGNMENT_LOADING });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({
      assignmentID: assignmentID,
    });

    axios
      .post("/api/assignment/done", body, config)
      .then((res) => {
        axios
          .get("/api/assignment/findAll")
          .then((res) => {
            dispatch({
              type: ASSIGNMENT_LOADED,
              payload: res.data.assignments,
            });
          })
          .catch((error) => {
            dispatch(returnErrors(error.response.data, error.response.status));
            dispatch({ type: ASSIGNMENT_FAILED });
          });
      })
      .catch((error) => {
        dispatch(returnErrors(error.response.data, error.response.status));
        dispatch({ type: ASSIGNMENT_FAILED });
      });
  };

export const mark_as_undone =
  ({ assignmentID }) =>
  (dispatch) => {
    dispatch({ type: ASSIGNMENT_LOADING });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({
      assignmentID: assignmentID,
    });

    axios
      .post("/api/assignment/undone", body, config)
      .then((res) => {
        axios
          .get("/api/assignment/findAll")
          .then((res) => {
            dispatch({
              type: ASSIGNMENT_LOADED,
              payload: res.data.assignments,
            });
          })
          .catch((error) => {
            dispatch(returnErrors(error.response.data, error.response.status));
            dispatch({ type: ASSIGNMENT_FAILED });
          });
      })
      .catch((error) => {
        dispatch(returnErrors(error.response.data, error.response.status));
        dispatch({ type: ASSIGNMENT_FAILED });
      });
  };
