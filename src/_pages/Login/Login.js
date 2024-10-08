import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { loginWithEmailAndPassword } from "../../redux/actions/LoginActions";
import {
  setSkills,
  setLocations,
  setInterests,
} from "../../redux/actions/FilterAction";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import toastr from "toastr";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { isLogin } from "../../_helpers/helper";
import "./login.scss";
import { FaFacebook, FaGoogle, FaLock } from "react-icons/fa";

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
  skills,
  locations,
  interests,
}) => {
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = (values, { setSubmitting }) => {
    loginWithEmailAndPassword({ ...values, isMobile });
    setSubmitted(1);
    setSubmitting(false);
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
        <h3>Login Here</h3> <label for="username">Username</label>
        <input
          type="text"
          placeholder="Email or Phone"
          id="username"
          value={email}
          onChange={handleChange}
        />
         <label for="password">Password</label>
        <input
          type="password"
          placeholder="Password"
          id="password"
          value={password}
          onChange={handleChange}
        />
        <div className="pt-2 forgotPassword"><FaLock /><Link to="/auth/forgot-password">Forgot Password?</Link></div>
        <button type="submit">Log In</button>
        <div className="social">
          <div className="go">
          <FaGoogle /> Google{" "}
          </div>
          <div className="fb">
           <FaFacebook /> Facebook {" "}
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
