import { createBrowserHistory } from "history";
import jwtAuthService from "../../services/JwtAuthService";

export const SET_USER_DATA = "USER_SET_DATA";
export const REMOVE_USER_DATA = "USER_REMOVE_DATA";
export const USER_LOGGED_OUT = "USER_LOGGED_OUT";
export const ADD_SITE_IDS = "ADD_SITE_IDS";
export const FILTER_STATUS_ADD = "FILTER_STATUS_ADD";

export function setUserData(user) {
  return (dispatch) => {
    dispatch({
      type: SET_USER_DATA,
      data: user,
    });
  };
}

export function logoutUser() {
  const history = createBrowserHistory();
  return (dispatch) => {
    jwtAuthService.logout();
    localStorage.clear();
    const url = "/auth/login";

    history.push({
      pathname: url,
    });

    dispatch({
      type: USER_LOGGED_OUT,
    });
  };
}
