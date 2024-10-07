import { Validation } from "../../_helpers/Validation/Validation";
import InputError from "../../components/Form/InputError/InputError";
import React, { useCallback, useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { UserService } from "../../services/UserService/UserService";
import toastr from "toastr";

const rules = [
  {
    field_name: "email",
    label: "Email",
    type: "email",
    isRequired: true,
  },
];

const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});
  const [linkSent, setLinkSent] = useState(false);
  const [form, setForm] = useState({ email: "" });

  useEffect(() => {
    // Add the class to body when the component mounts
    document.body.classList.add("loginPageWrapper");

    // Cleanup: remove the class when the component unmounts
    return () => {
      document.body.classList.remove("loginPageWrapper");
    };
  }, []);

  const onChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const checkValidation = () => {
    const errorObj = Validation(form, rules);
    return errorObj;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const errorObj = checkValidation();
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

    setIsLoading(true);
    const response = await UserService.forgotPasswordLink(form);

    if (!response?.status) {
      toastr.error(response?.message || "Something went wrong");
      setIsLoading(false);
      return;
    } else {
      toastr.success(response?.message || "Verification link sent successfully!");
      setLinkSent(true);
    }

    setIsLoading(false);
  };

  return (
    <div className="loginScreen wrapper">
      <Container>
        <Card className="loginFormSec">
          <h2>Forgot Password</h2>
          {linkSent ? (
            <>
              <p>Verification link sent successfully!</p>
            </>
          ) : (
            <>
              <p className="font-size-sm">
                Please enter the email address you'd like your password reset
                information sent to:
              </p>
              <Form className="pt-3 whoopForm">
                <div className="formInnerSec">
                  <Row>
                    <Col lg={12}>
                      <Form.Group className="mb-3">
                        <Form.Label required>Enter email address</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Enter email address"
                          value={form.email}
                          onChange={onChange}
                        />
                        <InputError
                          submitted={submitted}
                          error={error}
                          name="email"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="pt-2">
                    <Button
                      variant="primary"
                      className="btn btn-primary loginBtn w-100"
                      onClick={onSubmit}
                      disabled={isLoading}
                    >
                      Request reset link
                    </Button>
                  </div>
                </div>
              </Form>
            </>
          )}
        </Card>
        <p className="formBtmInfo">
          Back to <Link to="/auth/login">Login</Link>
        </p>
      </Container>
    </div>
  );
};

export default ForgotPassword;
