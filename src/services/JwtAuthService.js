import axios from "axios";
import localStorageService from "./localStorageService";
import { UserService } from "../services/UserService/UserService";
import toastr from "toastr";
import { RestMethod } from "../_helpers/ApiConfig/RestMethod";
import { auth_user } from "../_helpers/helper";

class JwtAuthService {
  user = {
    userId: "1",
    role: "ADMIN",
    displayName: "Watson Joyce",
    email: "watsonjoyce@gmail.com",
    photoURL: "/assets/images/face-7.jpg",
    age: 25,
    token: "faslkhfh423oiu4h4kj432rkj23h432u49ufjaklj423h4jkhkjh",
  };

  loginWithEmailAndPassword = async (email, password, isMobile) => {
    let obj = {
      email: email,
      password: password,
      isMobile: isMobile,
    };

    let response = await UserService.login(obj);
    if (response.status === 401) {
      console.log("Unauthorized");
      toastr.error(response.message.error || "unauthorized");
      return response?.message;
    }
    if (response && response.status && response.status !== 401) {
      let data = response.data;
      this.setSession(data.token);
      this.setUser(data);
      return data;
    } else if (response.message) {
      toastr.error(response?.message);
      throw new Error(
        JSON.stringify(response.message.error || response.message)
      ); // rejects the promise
    }
  };

  //delete this function
  loginWithToken = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.user);
      }, 100);
    }).then((data) => {
      this.setSession(data.token);
      this.setUser(data);
      return data;
    });
  };

  logout = () => {
    this.setSession(null);
    this.removeUser();
  };

  setSession = (token) => {
    if (token) {
      localStorage.setItem("jwt_token", token);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    } else {
      localStorage.removeItem("jwt_token");
      delete axios.defaults.headers.common["Authorization"];
    }
  };
  setUser = (user) => {
    localStorageService.setItem("auth_user", user);
  };
  removeUser = () => {
    localStorage.removeItem("auth_user");
  };

  refreshUserJwtToken = async()  =>{
    try{
      const response = await RestMethod.POST(
        "auth/refresh-user-token"
      );
      const refreshToken = response?.data?.refresh_token;
      if(response.data.status==1 && refreshToken!==undefined){
        this.setSession(refreshToken);
      }
      // return response.data;
    }catch(error){
      console.log("errro ",error)
      // return null;
    }
  }

}

export const isLogin = () => {
  if (localStorage.getItem("auth_user")) {
    return true;
  }

  return false;
};
export const isLoginSuperAdmin = () => {
  if (+auth_user()?.user?.userRole?.role?.level === 0) {
    return true;
  }
  return false;
};

export default new JwtAuthService();
