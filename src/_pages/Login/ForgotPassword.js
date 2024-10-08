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
    <div className="background">
      <div className="shape"></div>
      <div className="shape lastShape"></div>
      <form >
        <h3>Forget Password</h3>
        <div>Please enter the email address you'd like your password reset information send to:</div> 
        
        <label for="username">Enter email address</label>
        <input
          type="text"
          placeholder="Enter Email address"
          id="username"
          // value={email}
          // onChange={handleChange}
        />
       
        <button type="submit">Request Reset Link</button>
        <div className="backLogin text-center pt-4">Back to<Link to="/auth/login">Login?</Link></div>
       
      </form>
    </div>
  );
};

export default ForgotPassword;
