import axios from "axios";
// import toastr from 'toastr'
import { URL_CONFIG } from "../../_contants/config/URL_CONFIG";
// _contants/URL_CONFIG";
import toastr from "toastr";
import { createBrowserHistory } from "history";
import { IS_MOBILE } from "../helper";

const API_AUTH = axios.create({
  baseURL: URL_CONFIG.DEV_URL,
});

// Declare a Map to store the identification and cancellation functions for each request
const pending = new Map();
const history = createBrowserHistory();
/**
 * Add Request
 * @param {Object} config
 */
const addPending = (config) => {
  const url = [
    config.method,
    config.url,
    // JSON.stringify(config.params),
    // JSON.stringify(config.data)
  ].join("&");

  let flag = false;
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      if (!pending.has(url)) {
        // If the current request does not exist in pending, add it
        pending.set(url, cancel);
        flag = true;
      }
    });

  return flag;
};
/**
 * Remove Request
 * @param {Object} config
 */
const removePending = (config) => {
  const url = [
    config.method,
    config.url,
    // JSON.stringify(config.params),
    // JSON.stringify(config.data)
  ].join("&");

  if (pending.has(url)) {
    // If the current request identity exists in pending, you need to cancel the current request and remove it
    const cancel = pending.get(url);

    cancel(url);
    pending?.delete(url);
  }
};

API_AUTH.interceptors.request.use(
  function (request) {
    const path = window.location.pathname;
    // removePending(request) // Check previous requests to cancel before the request starts
    // let flag = addPending(request) // Add current request to pending

    const MaterLogin = path.split("/");
    const token = MaterLogin.includes("auth", "token")
      ? MaterLogin[3]
      : localStorage.getItem("jwt_token");
    request.headers.Authorization = token ? `Bearer ${token}` : "";
    if (token) {
      request.headers.currentPage = path;
    }

    return request;
    // }
  },
  (error) => {
    return Promise.reject(error);
  }
);

const ClearPending = () => {
  for (const [url, cancel] of pending) {
    cancel(url);
  }

  pending?.clear();
};

API_AUTH?.interceptors.response.use(
  (response) => {
    // removePending(response.config); // Remove this request at the end of the request
    if (response.data.status === 401) {
      const token = localStorage.getItem("jwt_token");
      if (token) {
        toastr.error(response.data.message || "unauthorized");
      }
      localStorage.removeItem("auth_user");
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("permissions");
      localStorage.removeItem("persist:whoop");
      history.push({
        pathname: "/auth/login",
      });
      window.location.reload();
    }
    return response;
  },
  (error) => {

    const status = error.response ? error.response.status : null;
    console.log("statusCode", status);
    switch (status) {
      case 404:
        console.log("Not Found", error);
        break;
      case 401:
        console.log("Unauthorized Request", error);
        break;
      default:
        break;
    }
    return Promise.resolve(error.response);
  }
);

export default API_AUTH;
