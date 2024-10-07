import React, { useState, useEffect } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { userInitialState, userRules } from "./DATA";
import { Validation } from "../../_helpers/Validation/Validation";
import InputError from "../../components/Form/InputError/InputError";
import toastr from "toastr";
import { UserService } from "../../services/UserService/UserService";
import EditUserProfile from "../../_pages/User/EditUserProfile";

function Register() {
  const [form, setForm] = useState(userInitialState);
  const [error, setError] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState(1);
  const [newUserId, setNewUserId] = useState("");
  const [textIdx, setTextIdx] = useState(0);

  const navigate = useNavigate();

  const onChange = ({ target: { name, type, checked, value } }) => {
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const checkValidation = () => {
    let errorObj = Validation(form, userRules);
    return errorObj;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    let errorObj = checkValidation();
    setError(errorObj);

    let flag = 0;
    if (errorObj) {
      Object.keys(errorObj).forEach((index) => {
        if (errorObj[index] !== "") {
          flag = 1;
        }
      });
    }

    if (flag !== 0) return false;

    let data = await UserService.createUser(form);

    if (data?.status) {
      setNewUserId(data?.data?.user?.id);
      toastr.success(data?.message || "Success");
      navigate("/auth/login");
    } else if (data?.message) {
      toastr.warning(data.message);
    }
    setIsLoading(false);
  };

  // Using useEffect to mimic componentDidMount and componentWillUnmount behavior
  useEffect(() => {
    document.body.classList.add("loginPageWrapper");
    localStorage.removeItem("redirectPath");

    const interval = setInterval(() => {
      setTextIdx((prevIdx) => prevIdx + 1);
    }, 5000);

    return () => {
      clearInterval(interval);
      document.body.classList.remove("loginPageWrapper");
    };
  }, []);

  return (
    <>
      <div className="signupScreen wrapper">
        {tab === 1 && (
          <Container>
            <Card>
              <h2>Create Account</h2>
              <p className="font-size-sm">
                Create your account with us to get started
              </p>
              <Form className="pt-3 whoopForm">
                <Row>
                  <Col md="6">
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        placeholder="First name"
                        name="firstName"
                        onChange={onChange}
                        value={form.firstName}
                      />
                      <InputError
                        submitted={submitted}
                        error={error}
                        name="firstName"
                      />
                    </Form.Group>
                  </Col>
                  <Col md="6">
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        placeholder="Last name"
                        name="lastName"
                        onChange={onChange}
                        value={form.lastName}
                      />
                      <InputError
                        submitted={submitted}
                        error={error}
                        name="lastName"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    placeholder="Email"
                    name="email"
                    onChange={onChange}
                    value={form.email}
                  />
                  <InputError
                    submitted={submitted}
                    error={error}
                    name="email"
                  />
                </Form.Group>
                <Row>
                  <Col md="6">
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="At least 8 characters long"
                        name="password"
                        onChange={onChange}
                        value={form.password}
                      />
                      <InputError
                        submitted={submitted}
                        error={error}
                        name="password"
                      />
                    </Form.Group>
                  </Col>
                  <Col md="6">
                    <Form.Group className="mb-3">
                      <Form.Label>Mobile Number</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="Enter your mobile number"
                        name="mobile"
                        onChange={onChange}
                        value={form.mobile}
                      />
                      <InputError
                        submitted={submitted}
                        error={error}
                        name="mobile"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col className="text-center">
                    <Button
                      onClick={onSubmit}
                      className="loginBtn w-100"
                      disabled={isLoading}
                    >
                      Register
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card>
            <p className="formBtmInfo">
              Already have an account? <Link to="/auth/login">Sign In</Link>
            </p>
          </Container>
        )}
      </div>
      {tab === 2 && (
        <EditUserProfile register setTab={setTab} newUserId={newUserId} />
      )}
    </>
  );
}

export default Register;
