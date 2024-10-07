import { useLocation } from "react-router";
import { Navigate } from "react-router-dom";
import { isLogin, permissionCheck } from "../_helpers/helper";
import { loginUser } from "./AuthService";

/* Component to check Authentication for components */
export const RequireAuth = ({ children, redirectTo }) => {
  let currentUrl = useLocation();
  const authUser = loginUser();

  const isAuthenticated = isLogin();
  if (!isAuthenticated) {
    return <Navigate to={"/auth/login"} />;
  }

  // /* If Path not matched */
  // if (!matched) {
  //   return <Navigate to={"/error/404"} />;
  // }
  return children;
};
