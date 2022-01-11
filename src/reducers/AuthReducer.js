import { LOGIN_USER, LOG_OUT, UPDATE_PROFILE } from "../actions/actions.auth";

const AuthReducer = (state, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isAuthenticating: false,
      };

    case UPDATE_PROFILE:
      return {
        ...state,
        user: {...state.user, ...action.payload},
      };

    case LOG_OUT:
      return {
        ...state,
        user: {},
        isAuthenticated: false,
        isAuthenticating: false,
      };

    default:
      return state;
  }
};

export default AuthReducer;
