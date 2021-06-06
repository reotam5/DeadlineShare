import axios from "axios";
import {
  GET_INVITES,
  GROUP_LOADED,
  GROUP_LOADING,
  GROUP_LOAD_FAIL,
} from "./types";
import { returnErrors } from "./errorActions";

const get_group = () => (dispatch) => {
  dispatch({ type: GROUP_LOADING });
  axios
    .get("/api/group/find")
    .then((res) => {
      dispatch({
        type: GROUP_LOADED,
        payload: res.data.groups,
      });
    })
    .catch((error) => {
      dispatch(returnErrors(error.response.data, error.response.status));
      dispatch({ type: GROUP_LOAD_FAIL });
    });
};
export default get_group;

export const add_group = (name) => (dispatch) => {
  dispatch({ type: GROUP_LOADING });
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ name });

  axios
    .post("/api/group/add", body, config)
    .then((res) => {
      dispatch(get_group());
    })
    .catch((error) => {
      dispatch(returnErrors(error.response.data, error.response.status));
      dispatch({ type: GROUP_LOAD_FAIL });
    });
};

export const invite_group = (groupID, userID) => (dispatch) => {
  dispatch({ type: GROUP_LOADING });
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ groupID, userID });

  axios
    .post("/api/group/invite", body, config)
    .then((res) => {
      dispatch(get_group());
    })
    .catch((error) => {
      dispatch(returnErrors(error.response.data, error.response.status));
      dispatch({ type: GROUP_LOAD_FAIL });
    });
};

export const get_invites = () => (dispatch) => {
  axios
    .get("/api/group/findInvitation")
    .then((res) => {
      dispatch({
        type: GET_INVITES,
        payload: res.data.groups,
      });
    })
    .catch((error) => {
      dispatch(returnErrors(error.response.data, error.response.status));
    });
};

export const leave_group = (groupID) => (dispatch) => {
  dispatch({ type: GROUP_LOADING });
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ groupID });
  axios
    .post("/api/group/leave", body, config)
    .then((res) => {
      dispatch(get_group());
    })
    .catch((error) => {
      dispatch(returnErrors(error.response.data, error.response.status));
      dispatch({ type: GROUP_LOAD_FAIL });
    });
};

export const kick_group = (groupID, userID) => (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ groupID, userID });
  axios.post("/api/group/kick", body, config).catch((error) => {
    dispatch(returnErrors(error.response.data, error.response.status));
  });
};

export const accept_group = (groupID) => (dispatch) => {
  dispatch({ type: GROUP_LOADING });
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ groupID });
  axios
    .post("/api/group/acceptInvite", body, config)
    .then((res) => {
      dispatch(get_group());
    })
    .catch((error) => {
      dispatch(returnErrors(error.response.data, error.response.status));
      dispatch({ type: GROUP_LOAD_FAIL });
    });
};

export const delete_group = (groupID) => (dispatch) => {
  dispatch({ type: GROUP_LOADING });
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ groupID });
  axios
    .post("/api/group/delete", body, config)
    .then((res) => {
      dispatch(get_group());
    })
    .catch((error) => {
      dispatch(returnErrors(error.response.data, error.response.status));
      dispatch({ type: GROUP_LOAD_FAIL });
    });
};

export const BeEditor_group = (groupID, userID) => (dispatch) => {
  dispatch({ type: GROUP_LOADING });
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ groupID, userID });
  axios
    .post("/api/group/editor", body, config)
    .then((res) => {
      dispatch(get_group());
    })
    .catch((error) => {
      dispatch(returnErrors(error.response.data, error.response.status));
      dispatch({ type: GROUP_LOAD_FAIL });
    });
};

export const BeMember_group = (groupID, userID) => (dispatch) => {
  dispatch({ type: GROUP_LOADING });
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ groupID, userID });
  axios
    .post("/api/group/member", body, config)
    .then((res) => {
      dispatch(get_group());
    })
    .catch((error) => {
      dispatch(returnErrors(error.response.data, error.response.status));
      dispatch({ type: GROUP_LOAD_FAIL });
    });
};

export const BeOwner_group = (groupID, userID) => (dispatch) => {
  dispatch({ type: GROUP_LOADING });
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ groupID, userID });
  axios
    .post("/api/group/owner", body, config)
    .then((res) => {
      dispatch(get_group());
    })
    .catch((error) => {
      dispatch(returnErrors(error.response.data, error.response.status));
      dispatch({ type: GROUP_LOAD_FAIL });
    });
};
