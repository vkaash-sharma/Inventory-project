export const logout = () => {
  localStorage.removeItem("auth_user");
  localStorage.removeItem("jwt_token");
  localStorage.removeItem("permissions");
  localStorage.removeItem("persist:whoop");

  return true;
};
