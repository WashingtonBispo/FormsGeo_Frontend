import types from "../types";

const authAction = {
  logIn: (content) => ({
    type: types.LOG_IN,
    content: content,
  }),
  logOut: (content) => ({
    type: types.LOG_OUT,
    content: content,
  }),
};

export default authAction;