import { Validation } from "../../_helpers/Validation/Validation";
import InputError from "../../components/Form/InputError/InputError";
import React, { useState, useCallback } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import { UserService } from "../../services/UserService/UserService";
import { logout } from "../../services/logOutService";
import toastr from "toastr";

const rules = [
  {
    field_name: "oldPassword",
    label: "Old Password",
    type: "string",
    // minLength: 8,
    // maxLength: 12,
    isRequired: true,
  },
  {
    field_name: "password",
    label: "New Password",
    type: "password",
    minLength: 8,
    isRequired: true,
  },
  {
    field_name: "confirmPassword",
    label: "Confirm New Password",
    type: "password",
    minLength: 8,
    isRequired: true,
  },
];
let initialState = {
  oldPassword: "",
  password: "",
  confirmPassword: "",
};
const ChangePassword = ({ reset }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { resetToken } = useParams();

  const onChange = ({ target: { name, type, checked, value } }) => {
    setForm((prev) => {
      const data = { ...prev, [name]: type === "checkbox" ? checked : value };

      return data;
    });
  };
  const checkValidation = useCallback(
    (form) => {
      /**call validation file for validation */

      let errorObj = Validation(form, rules);

      return errorObj;
    },
    [form]
  );

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitted(true);

      let errorObj = checkValidation(form);
      setError(errorObj);

      /**
       * final checking for any error exists or not
       */
      let flag = 0;
      Object.keys(errorObj).forEach((index) => {
        if (errorObj[index] !== "") {
          flag = 1;
        }
      });
      // check validation
      if (flag !== 0) return false;

      if (form.confirmPassword !== form.password)
        return toastr.warning("Password do not Match");

      setIsLoading(true);

      let response = await UserService.changePassword(form);
      if (response) {
        if (response.status) {
          toastr.info("Password Changed Successful!");
          logout();
          navigate("/auth/login");
        } else if (response.message) {
          toastr.warning(response.message);
        }
      }
      setIsLoading(false);
    },
    [
      checkValidation,
      form.confirmPassword,
      form.oldPassword,
      form.password,
      navigate,
    ]
  );

  const onReset = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    delete form.oldPassword;
    const errorObj = checkValidation(form);
    setError(errorObj);
    let flag = 0;
    if (errorObj)
      Object.keys(errorObj).forEach((index) => {
        if (errorObj[index] !== "") {
          flag = 1;
        }
      });

    if (flag !== 0) return false;

    if (form.confirmPassword !== form.password)
      return toastr.warning("Password do not Match");

    setIsLoading(true);

    let data = await UserService.resetPassword(resetToken, form);
    if (data) {
      if (data.status) {
        toastr.success("Success");
        navigate("/auth/login");
      } else if (data && data.message) {
        toastr.warning(data.message);
      }
    }

    setIsLoading(false);
  };
  return (
    <>
      <div className="loginScreen wrapper mt-0">
        <Container>
          <Card className="mt-4">
            <h2>{reset ? "Reset Password" : "Change Password"}</h2>
            {/* <p className="font-size-sm">
              Create your account with us to get started
            </p> */}

            <Form
              className="pt-3 whoopForm"
              onSubmit={reset ? onReset : onSubmit}
            >
              <div className="formInnerSec">
                <Row>
                  {!reset && (
                    <Col lg={12}>
                      <Form.Group className="mb-3">
                        <Form.Label required>Old Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="oldPassword"
                          value={form.oldPassword}
                          onChange={onChange}
                          placeholder="Old Password"
                        />

                        <InputError
                          submitted={submitted}
                          error={error}
                          name="oldPassword"
                        />
                      </Form.Group>
                    </Col>
                  )}
                  <Col lg={12}>
                    <Form.Group className="mb-3">
                      <Form.Label required>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={onChange}
                        placeholder="New Password"
                      />

                      <InputError
                        submitted={submitted}
                        error={error}
                        name="password"
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={12}>
                    <Form.Group className="mb-3">
                      <Form.Label required>Confirm New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={onChange}
                        placeholder="Confirm New Password"
                      />

                      <InputError
                        submitted={submitted}
                        error={error}
                        name="confirmPassword"
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={12}>
                    <Form.Group className="mb-2">
                      <p className="passwordInfo">
                        * Password should have minimum 8 character with one
                        alphabet , one number and one special character
                      </p>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="text-center pb-1 pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    className="customBtn w-100"
                    disabled={isLoading}
                  >
                    Update Password
                  </Button>
                </div>
              </div>
            </Form>
          </Card>
        </Container>
      </div>
    </>
  );
};
export default ChangePassword;
