import jwtAuthService from "../../services/JwtAuthService";
import { setUserData } from "./UserActions";
import toastr from "toastr";

export const LOGIN_ERROR = "LOGIN_ERROR";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_LOADING = "LOGIN_LOADING";
export const RESET_PASSWORD = "RESET_PASSWORD";

export function loginWithEmailAndPassword({ email, password, isMobile }) {
  return (dispatch) => {
    jwtAuthService
      .loginWithEmailAndPassword(email, password, isMobile)
      .then((user) => {
        dispatch(setUserData(user));
        dispatch({
          type: LOGIN_LOADING,
        });
        return dispatch({
          type: LOGIN_SUCCESS,
          payload: user,
        });
      })
      .catch((error) => {
        return dispatch({
          type: LOGIN_ERROR,
          payload: error,
        });
      });
  };
}

export function resetPassword({ email }) {
  return (dispatch) => {
    dispatch({
      payload: email,
      type: RESET_PASSWORD,
    });
  };
}
