const INITIAL_STATE = {
  google_access_token: "",
  worksnap_token: "",
  interpreting: false,
  initial_load: true,
  logging_in: false,
  search_results: [],
  query: "",
};

function rootReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "SET_GOOGLE_ACCESS_TOKEN":
      return { ...state, google_access_token: action.google_access_token };
    case "SET_WORKSNAP_TOKEN":
      localStorage.setItem("worksnap_token", action.worksnap_token);
      chrome.storage.local.set({ worksnap_token: action.worksnap_token });
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
    case "SET_ALL_POST_DATES":
      return { ...state, all_post_dates: action.all_post_dates };
    case "SET_POST":
      return { ...state, post: action.post };
    case "SET_SEARCH_RESULTS":
      return { ...state, search_results: action.results, query: action.query };
    case "CLEAR_SEARCH_RESULTS":
      return { ...state, search_results: [], query: "" };
    case "TOGGLE_INTERPRETING":
      return { ...state, interpreting: !state.interpreting };
    case "INITIAL_LOAD":
      return { ...state, initial_load: !state.initial_load };
    case "LOGGING_IN":
      return { ...state, logging_in: !state.logging_in };
    case "HALF_RESET":
      return {
        worksnap_token: state.worksnap_token,
        date: state.date,
        all_post_dates: action.all_post_dates,
      };
    case "FULL_RESET":
      localStorage.removeItem("worksnap_token");
      chrome.storage.local.clear();
      return {};
    default:
      return state;
  }
}

export { INITIAL_STATE, rootReducer };
