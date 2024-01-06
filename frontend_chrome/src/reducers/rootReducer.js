const INITIAL_STATE = {
  google_access_token: "",
  workdiary_token: "",
  interpreting: false,
  initial_load: true,
  logging_in: false,
  search_results: [],
  query: "",
  show_all_posts: true,
};

function rootReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "SET_GOOGLE_ACCESS_TOKEN":
      return { ...state, google_access_token: action.google_access_token };
    case "SET_WORKDIARY_TOKEN":
      localStorage.setItem("workdiary_token", action.workdiary_token);
      chrome.storage.local.set({ workdiary_token: action.workdiary_token });
      return {
        ...state,
        workdiary_token: action.workdiary_token,
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
    case "SET_POSTS_LIST":
      return {
        ...state,
        posts_list: action.posts_list,
        pagination: action.pagination,
      };
    case "SET_SEARCH_RESULTS":
      return {
        ...state,
        search_results: action.results,
        query: action.query,
        pagination: action.pagination,
      };
    case "CLEAR_SEARCH_RESULTS":
      return {
        ...state,
        search_results: null,
        query: "",
        posts_list: null,
        pagination: null,
      };
    case "CLEAR_SCROLL_TO":
      return {
        ...state,
        clicked_search_result: null,
      };
    case "SET_SCROLL_TO":
      return { ...state, clicked_search_result: action.clicked_search_result };
    case "SET_SHOW_ALL_POSTS":
      return { ...state, show_all_posts: action.show_all_posts };
    case "TOGGLE_INTERPRETING":
      return { ...state, interpreting: !state.interpreting };
    case "INITIAL_LOAD":
      return { ...state, initial_load: !state.initial_load };
    case "LOGGING_IN":
      return { ...state, logging_in: !state.logging_in };
    case "HALF_RESET":
      return {
        workdiary_token: state.workdiary_token,
        date: state.date,
        show_all_posts: true,
      };
    case "FULL_RESET":
      localStorage.removeItem("workdiary_token");
      chrome.storage.local.clear();
      return {};
    default:
      return state;
  }
}

export { INITIAL_STATE, rootReducer };
