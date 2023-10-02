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
    case "SET_ACCESS_TOKEN":
      localStorage.setItem("access_token", action.access_token);
      localStorage.setItem("_token", action._token);
      return {
        ...state,
        access_token: action.access_token,
        _token: action._token,
        item_id: action.item_id,
        institution_id: action.institution_id || state.institution_id,
        new_visitor: action.new_visitor,
        logged_in: action.logged_in,
        accountTransactions: action.accountTransactions,
      };
    case "SET_BASE_TOKEN":
      localStorage.setItem("token", action.token);
      return { ...state, token: action.token };
    case "SET_LOGIN":
      return { ...state, logged_in: action.logged_in };
    case "SET_JWT":
      return { ...state, _token: action._token };
    case "SET_TRENDS":
      return {
        ...state,
        trendTransactions: action.trendTransactions,
      };
    case "SET_ACCOUNT_TRANSACTIONS":
      return {
        ...state,
        accountTransactions: {
          ...state.accountTransactions,
          [action.account_id]: action.accountTransactions,
        },
      };
    case "SET_CURRENT_LOCATION":
      return { ...state, currentLocation: action.currentLocation };
    case "RESET_ACCOUNT_TRANSACTIONS":
      return {
        ...state,
        accountTransactions: {},
      };
    case "SET_CATEGORIES":
      return { ...state, categories: action.categories };
    case "GET_ACCOUNTS":
      return { ...state, accounts: action.accounts };
    case "HALF-RESET":
      return { token: state.token };
    case "FULL-RESET":
      return {};
    default:
      return state;
  }
}

export { INITIAL_STATE, rootReducer };
