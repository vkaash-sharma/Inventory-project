import axios from "axios";
import { parseJson } from "../_helpers/helper";
import localStorageService from "../services/localStorageService";
const TOKEN_KEY = "auth_user";

export const login = (data) => {
    setSession(data?.token);
    setUser(data);
};

export const logout = () => {
    setSession(null);
    removeUser();
};

export const isLogin = () => {
    return !!localStorageService.getItem(TOKEN_KEY)
};

export const loginUser = () => {
    const AUTH_USER = parseJson(localStorage.getItem("auth_user")) ? parseJson(localStorage.getItem("auth_user")).user : null;
    return { AUTH_USER };
};

export const setSession = (token) => {
    if (token) {
        localStorage.setItem("authToken", token);
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    } else {
        localStorage.removeItem("authToken");
        localStorage.removeItem("lang");
        localStorage.removeItem("lang2");
        delete axios.defaults.headers.common["Authorization"];
    }
};

export const setUser = (user) => {
    localStorageService.setItem(TOKEN_KEY, user);
};

export const removeUser = () => {
    localStorage.removeItem(TOKEN_KEY);
};
