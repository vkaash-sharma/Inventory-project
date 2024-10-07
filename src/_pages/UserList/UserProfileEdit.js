import React from "react";
import { Form, Button } from "react-bootstrap";

export const UserProfileEdit = ({ form, setForm, onSave }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  return (
    <div className="user-profile-edit">
      <Form.Group className="mb-4">
        <Form.Label required>First Name</Form.Label>
        <Form.Control
          type="text"
          name="firstName"
          value={form?.firstName}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label required>Last Name</Form.Label>
        <Form.Control
          type="text"
          name="lastName"
          value={form?.lastName}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label required>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={form?.email}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label required>Phone No.</Form.Label>
        <Form.Control
          type="text"
          name="mobile"
          value={form?.mobile}
          onChange={handleChange}
        />
      </Form.Group>

      <Button variant="outline-success" onClick={onSave}>
        Save
      </Button>
    </div>
  );
};
