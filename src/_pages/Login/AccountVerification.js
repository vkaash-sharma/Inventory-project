import React, { useEffect, useState } from "react";
import { Card, Container, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { UserService } from "../../services/UserService/UserService";
import toastr from "toastr";

const AccountVerification = () => {
  const { verifyToken } = useParams();
  const [verifStatus, setVerifStatus] = useState(1);
  const [verifMsg, setVerifMsg] = useState("Verifying your account");
  const navigate = useNavigate();
  const HandleVerification = async () => {
    try {
      const response = await UserService.verifyAccount(verifyToken);
      toastr.clear();
      if (+response?.status === 1) {
        navigate("/auth/login");
        setVerifStatus(response?.status);
        setVerifStatus(response?.message);
        toastr.success(response?.message);
      } else {
        setVerifStatus(response?.status);
        setVerifMsg(response?.message);
        toastr.warning(response?.message);
      }
    } catch (error) {
      console.error("Error while Verifying");
      toastr.error("Error while Verifying account");
    }
  };
  useEffect(() => {
    HandleVerification();
  }, [verifyToken]);
  return (
    <div className="loginScreen wrapper mt-0">
      <Container>
        <Card className="mt-4">
          <Card.Body>
            <Card.Title>Account Verification</Card.Title>
            <Card.Text
              style={{ color: `${verifStatus ? "black" : "red"}` }}
              className="d-flex align-items-center"
            >
              {verifStatus ? (
                <span className="me-3">
                  <Spinner />
                </span>
              ) : (
                ""
              )}
              {verifMsg}
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default AccountVerification;
