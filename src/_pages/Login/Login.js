import React, { Component } from "react";
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
import {
  Navigate,
  Link,
} from "react-router-dom";
import toastr from "toastr";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { isLogin } from "../../_helpers/helper";
import "./login.scss";

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

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      redirectPath: localStorage.getItem("redirectPath") || "/companies",
      submitted: 0,
      isMobile: window.location.href.split("/")[3] === "mobile",
    };
  }

  componentDidMount() {
    if (!document.body.classList.contains("loginPageWrapper")) {
      document.body.classList.add("loginPageWrapper");
    }
    localStorage.removeItem("redirectPath");

    this.timeout = setInterval(() => {
      this.setState((prevState) => ({ textIdx: prevState.textIdx + 1 }));
    }, 5000);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!document.body.classList.contains("loginPageWrapper")) {
      document.body.classList.add("loginPageWrapper");
    }
  }

  componentWillUnmount() {
    clearInterval(this.timeout);
    document.body.classList.remove("loginPageWrapper");
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (value, { setSubmitting }) => {
    this.props.loginWithEmailAndPassword({
      ...value,
      isMobile: this.props.isMobile,
    });
    this.setState({ submitted: 1 });
    setSubmitting(false);
  };

  render() {
    if (isLogin()) {
      return <Navigate to={"/companies"} />;
    }

    if (this.state.submitted) {
      if (
        this?.props?.login?.error?.password ||
        this?.props?.login?.error?.username
      ) {
        this.state.loading = 0;
        // toastr.error(
        //   this?.props?.login?.error?.password ||
        //     this?.props?.login?.error?.username
        // );
      } else this.state.loading = 1;
    }

    return (
      <React.Fragment>
        <div className="loginScreen wrapper">
          <Container>
            <Card className="loginFormSec">
              <h2>Sign In</h2>
              <p className="font-size-sm">
                Enter your email address and password to get started.
              </p>
              <Formik
                validationSchema={SigninSchema}
                onSubmit={this.handleSubmit}
                initialValues={this.state}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                }) => (
                  <form className="pt-3 whoopForm" onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                      <label className="form-label" htmlFor="email">
                        Email
                      </label>
                      <input
                        className="form-control-SigninNew form-control"
                        placeholder="Enter email"
                        type="email"
                        name="email"
                        onBlur={handleBlur}
                        value={values.email}
                        onChange={handleChange}
                      />
                      {isSubmitting && this.props.login?.error?.username ? (
                        <div className="errorMssg">
                          {this.props.login.error.username}
                        </div>
                      ) : (
                        errors.email && (
                          <div className="errorMssg">{errors.email}</div>
                        )
                      )}
                    </div>
                    <div className="form-group mb-2">
                      <label className="form-label" htmlFor="password">
                        Password
                      </label>
                      <input
                        className="form-control-SigninNew form-control"
                        name="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                        placeholder="Enter password"
                        type="password"
                      />
                      {errors.password ? (
                        <div className="errorMssg">{errors.password}</div>
                      ) : (
                        isSubmitting && this.props.login?.error?.password && (
                          <div className="errorMssg">
                            {this.props.login.error.password}
                          </div>
                        )
                      )}
                    </div>
                    <p className="forgotPassword">
                      <Link to="/auth/forgot-password">Forgot Password?</Link>
                    </p>
                    <Row>
                      <Col xs={12}>
                        <button
                          className="btn btn-primary loginBtn w-100"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          Login
                        </button>
                      </Col>
                    </Row>
                  </form>
                )}
              </Formik>
            </Card>
            <p className="formBtmInfo">
              New here? <Link to="/register">Create an account</Link>
            </p>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

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
