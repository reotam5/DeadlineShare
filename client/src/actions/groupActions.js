import axios from "axios";
import {
  GET_INVITES,
  GROUP_LOADED,
  GROUP_LOADING,
  GROUP_LOAD_FAIL,
} from "./types";
import { returnErrors } from "./errorActions";

function getGroupMemberInfo(memberID) {
  return new Promise((resolve, reject) => {
    axios.get("/api/user/find/" + memberID).then((res) => {
      resolve({ userID: memberID, name: res.data.user.name });
    });
  });
}

const get_group = () => (dispatch) => {
  dispatch({ type: GROUP_LOADING });
  axios
    .get("/api/group/find")
    .then((res) => {
      let groups = res.data.groups;
      let memberDetails = [];
      groups.map((group, index) => {
        group.members.forEach((member) => {
          memberDetails.push(member);
        });
      });
      memberDetails = memberDetails.filter(
        (item, index) => memberDetails.indexOf(item) === index
      );
      const getMemberInfo = async () => {
        return Promise.all(
          memberDetails.map((member) => {
            return getGroupMemberInfo(member);
          })
        );
      };
      getMemberInfo().then((data) => {
        groups.forEach((group) => {
          let owners = data.filter((element) =>
            group.owners.includes(element.userID)
          );
          let editors = data.filter(
            (element) =>
              !group.owners.includes(element.userID) &&
              group.editors.includes(element.userID)
          );
          let members = data.filter(
            (element) =>
              !group.owners.includes(element.userID) &&
              !group.editors.includes(element.userID) &&
              group.members.includes(element.userID)
          );
          group.memberInfo = [
            { title: "Owners", users: owners },
            { title: "Editors", users: editors },
            { title: "Members", users: members },
          ];
        });
        dispatch({
          type: GROUP_LOADED,
          payload: groups,
        });
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
  dispatch({ type: GROUP_LOADING });
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ groupID, userID });
  axios
    .post("/api/group/kick", body, config)
    .then((res) => {
      dispatch(get_group());
    })
    .catch((error) => {
      dispatch(returnErrors(error.response.data, error.response.status));
      dispatch({ type: GROUP_LOAD_FAIL });
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
      console.log(error);
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
