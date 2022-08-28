import types from "../types";

const initialState = {
  token: "",
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOG_IN:
      return {
        token: action.content.token,
      };
    case types.LOG_OUT:
      return initialState;
    default:
      return state;
  }
};

export default authReducer;