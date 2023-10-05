const INITIAL_STATE = {
  google_access_token: "",
  worksnap_token: "",
};

function rootReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "SET_GOOGLE_ACCESS_TOKEN":
      return { ...state, google_access_token: action.google_access_token };
    case "SET_WORKSNAP_TOKEN":
      localStorage.setItem("worksnap_token", action.worksnap_token);
      return {
        ...state,
        worksnap_token: action.worksnap_token,
      };
    case "SET_USER":
      return {
        ...state,
        user: action.user,
      };
    case "SET_DATE":
      return { ...state, date: action.date };
    case "HALF_RESET":
      return { token: state.token };
    case "FULL_RESET":
      return {};
    default:
      return state;
  }
}

export { INITIAL_STATE, rootReducer };
