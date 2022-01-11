import {
  LOGIN_USER,
  UPDATE_PROFILE,
} from "../../actions/actions.auth";
import Axios from "../../config";
import { getErrorMessage } from "../../utils";

export const loginUser = async (body, dispatch) => {
  try {
    const { data } = await Axios.post("/users/login", body);
    dispatch({ type: LOGIN_USER, payload: data });
    return { error: false, data, msg: "Login Successful" };
  } catch (error) {
    return { error: true, data: {}, msg: getErrorMessage(error) };
  }
};

export const registerUser = async (body, dispatch) => {
  try {
    const { data } = await Axios.post("/users/register", body);
    // dispatch({type:LOGIN_USER, payload:data})
    return { error: false, data, msg: "Registration Successful" };
  } catch (error) {
    return { error: true, data: {}, msg: getErrorMessage(error) };
  }
};

export const logout = async () => {
  try {
    if (localStorage.getItem("_f_user")) {
      const user = localStorage.getItem("_f_user");

      if (!user) return null;
      const _user = JSON.parse(user);
      await Axios.patch("/users/logout", { refreshToken: _user.refreshToken });
    }
    localStorage.removeItem("_f_user");
    window.location.href = "/login";
  } catch (error) {}
};

export const checkAuthUser = () => {
  if (localStorage.getItem("_f_user")) {
    const user = localStorage.getItem("_f_user");
    if (!user) return null;
    return JSON.parse(user);
  }
  return null;
};

export const changePassword = async (body) => {
  try {
    const { data } = await Axios.patch("/users/update_password", body);
    return { error: false, data, msg: data.message };
  } catch (error) {
    return { error: true, data: {}, msg: getErrorMessage(error) };
  }
};

export const updateDetails = async (dispatch, body) => {
  try {
    const { data } = await Axios.patch("/users/update_details", body);
    dispatch({ type: UPDATE_PROFILE, payload: body });
    return { error: false, data, msg: data.message };
  } catch (error) {
    return { error: true, data: {}, msg: getErrorMessage(error) };
  }
};

export const editUser = async (body) => {
  try {
    const { data } = await Axios.patch("/users/edit_user", body);
    return { error: false, data, msg: data.message };
  } catch (error) {
    return { error: true, data: {}, msg: getErrorMessage(error) };
  }
};

export const updateUser = async (body) => {
  try {
    const { data } = await Axios.patch("/users/update_password", body);
    return { error: false, data, msg: data.message };
  } catch (error) {
    return { error: true, data: {}, msg: getErrorMessage(error) };
  }
};

export const testLink1234 = async () => {
  try {
    await Axios.get("/users/test_link_1234");
  } catch (error) {}
};

export const testLink4321 = async () => {
  try {
    await Axios.get("/users/test_link_4321");
  } catch (error) {}
};
