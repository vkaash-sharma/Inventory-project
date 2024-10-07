import React, { useState } from "react";
import { Row, Col, Card, Form, Modal, Button } from "react-bootstrap";
import { FaEdit } from "react-icons/fa"; // Import the pencil icon from React Icons
import { UserProfileEdit } from "./UserProfileEdit";
import { updateUserById } from "../../services/UserService/UserService";

const UserProfile = ({ form, id, setForm, companyList }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleShow = () => setIsEditing(true);
  const handleClose = () => setIsEditing(false);

  const handleSaveClick = async () => {
    let response = await updateUserById(id, form);
    if (response?.status) {
      setForm(response?.data?.user);
      setIsEditing(false);
      handleClose();
    }
    setIsEditing(false);
  };

  return (
    <>
      <Col md={3}>
        <Card className="companySortInfo">
          <div className="companySortInfoInner">
            <div className="recommendedSec">
              <Row>
                <Col lg={12}>
                  <FaEdit
                    onClick={handleShow}
                    style={{ marginLeft: "93%" }}
                    size={20}
                  />
                  <Form.Group className="mb-4">
                    <Form.Label required>First Name</Form.Label>
                    <p>{form?.firstName}</p>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label required>Last Name</Form.Label>
                    <p>{form?.lastName}</p>
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label required>Email</Form.Label>
                    <p>{form?.email}</p>
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label required>Phone No.</Form.Label>
                    <p>{form?.mobile}</p>
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </div>
        </Card>
      </Col>

      <Modal show={isEditing} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserProfileEdit
            form={form}
            setForm={setForm}
            onSave={handleSaveClick}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UserProfile;
