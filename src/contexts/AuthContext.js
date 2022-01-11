import React, { createContext, useContext, useReducer } from "react";
import AuthReducer from "../reducers/AuthReducer";
import { checkAuthUser } from "../libs/auth";

const initialState = {
  isAuthenticated: false,
  isAuthenticating: true,
  user: {},
};

export const AuthContext = createContext();

const AuthProvider = (props) => {
  const [authState, authDispatch] = useReducer(
    AuthReducer,
    initialState,
    () => {
      const authUser = checkAuthUser();
      if (authUser === null) {
        return {
          ...initialState,
          isAuthenticated: false,
          isAuthenticating: false,
        };
      }
      return {
        ...initialState,
        isAuthenticated: true,
        isAuthenticating: false,
        user: authUser
      };
    }
  );
  return (
    <AuthContext.Provider value={{authState, authDispatch}}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuthContext = () =>  useContext(AuthContext);
