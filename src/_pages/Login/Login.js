import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { loginWithEmailAndPassword } from "../../redux/actions/LoginActions";
import { setSkills, setLocations, setInterests } from "../../redux/actions/FilterAction";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import toastr from "toastr";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { isLogin } from "../../_helpers/helper";
import "./login.scss";
import { FaFacebook, FaGoogle, FaLock } from "react-icons/fa";
import { useGoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import axios from "axios";

const SigninSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid Email id")
    .required("Please enter the Email"),
  password: yup
    .string()
    .min(6, "Password must be 6 characters long")
    .required("Please enter the Password"),
});

const Login = ({
  loginWithEmailAndPassword,
  isMobile,
  login,
}) => {
  const [userGoogle , setUserGoogle] = useState();
  console.log("here is the google user" , userGoogle)
  const [profile , setProfile] = useState();
  console.log("here is the profile" , profile)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirectPath, setRedirectPath] = useState(
    localStorage.getItem("redirectPath") || "/companies"
  );
  const [submitted, setSubmitted] = useState(0);

  useEffect(() => {
    if (!document.body.classList.contains("loginPageWrapper")) {
      document.body.classList.add("loginPageWrapper");
    }
    localStorage.removeItem("redirectPath");

    const timeout = setInterval(() => {
      // Add logic here if needed
    }, 5000);

    return () => {
      clearInterval(timeout);
      document.body.classList.remove("loginPageWrapper");
    };
  }, []);


  useEffect(
    () => {
        if (userGoogle) {
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${userGoogle.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${userGoogle.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => {
                    setProfile(res.data);
                })
                .catch((err) => console.log(err));
        }
    },
    [ userGoogle ]
);


  const loginFn = useGoogleLogin({
    onSuccess: tokenResponse => setUserGoogle(tokenResponse),
    onError: (error) => console.log('Login Failed:', error)
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginWithEmailAndPassword({ email, password, isMobile });
    setSubmitted(1);
  };

  if (isLogin()) {
    return <Navigate to="/companies" />;
  }

  if (submitted) {
    if (login.error.password || login.error.username) {
      // toastr.error(login.error.password || login.error.username);
    } else {
      // Add logic here if needed
    }
  }

  return (
    <div className="background">
      <div className="shape"></div>
      <div className="shape lastShape"></div>
      <form onSubmit={handleSubmit}>
        <h3>Login Here</h3>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          placeholder="Email or Phone"
          id="email"
          name="email"
          value={email}
          onChange={handleChange}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Password"
          id="password"
          name="password"
          value={password}
          onChange={handleChange}
        />
        <div className="pt-2 forgotPassword">
          <FaLock />
          <Link to="/auth/forgot-password">Forgot Password?</Link>
        </div>
        <button type="submit">Log In</button>
        <div className="social">
          <div className="go" onClick={() => loginFn()}>
            <FaGoogle /> Google{" "}
          </div>
          <div className="fb">
            <FaFacebook /> Facebook{" "}
          </div>
        </div>
      </form>
    </div>
  );
};

Login.propTypes = {
  loginWithEmailAndPassword: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
  login: PropTypes.shape({
    error: PropTypes.shape({
      username: PropTypes.string,
      password: PropTypes.string,
    }),
  }),
};

const mapStateToProps = (state) => ({
  user: state.user,
  login: state.login,
  skills: state.filter.skills,
  locations: state.filter.locations,
  interests: state.filter.interests,
});

export default connect(mapStateToProps, {
  loginWithEmailAndPassword,
  setSkills,
  setLocations,
  setInterests,
})(Login);
