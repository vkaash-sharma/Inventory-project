import { parseJson } from "_helpers/helper";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const AUTH_USER = parseJson(localStorage.getItem("auth_user"))
    ? parseJson(localStorage.getItem("auth_user")).user
    : null;

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("jwt_token")) {
      navigate("/auth/login");
    } else {
      navigate("/companies");
    }
  }, [AUTH_USER, navigate]);
  return <div>Home</div>;
}

export default Home;
