const Api_url = "http://164.52.209.160:3012/api/";
// const Api_url = "http://192.168.29.17:3012/api/";
export const URL_CONFIG = {
  DEV_URL: Api_url,
  IMG_URL: Api_url + "public/upload",
  AWS_COGNITO_LOGIN_URL: process.env.REACT_APP_AWS_COGNITO_LOGIN_URL,
};
