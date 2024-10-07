import React, { useState, useEffect } from "react";
import { Button, Table, Container, FormGroup, Form } from "react-bootstrap";
import Scrollbars from "react-custom-scrollbars-2";
import Select from "react-select";
import { companyAdmins } from "../../services/UserService/UserService";
import toastr from "toastr";

export const ParticipantForm = ({
  onSubmit,
  participants,
  setParticipants,
  edit,
}) => {
  const [adminUser, setAdminUsers] = useState([]);
  const [errors, setErrors] = useState([]);
  const [error, setError] = useState({});
  const [userRole, setUserRole] = useState([
    { label: "User", value: "user" },
    { label: "Admin", value: "admin" },
  ]);

  const handleAddParticipant = () => {
    setParticipants([...participants, { userId: null, roleInMeeting: "" }]);
    setErrors([...errors, { userId: "", roleInMeeting: "" }]);
  };

  const handleRemoveParticipant = (index) => {
    const newParticipants = participants.filter((_, i) => i !== index);
    const newErrors = errors.filter((_, i) => i !== index);
    setParticipants(newParticipants);
    setErrors(newErrors);
  };

  const handleChange = (index, field, value) => {
    const newParticipants = participants.map((participant, i) =>
      i === index ? { ...participant, [field]: value } : participant
    );
    setParticipants(newParticipants);
    const newErrors = errors.map((error, i) =>
      i === index ? { ...error, [field]: "" } : error
    );
    setErrors(newErrors);
  };

  useEffect(() => {
    const fetchAdminUsers = async () => {
      const res = await companyAdmins();
      if (res?.status) {
        const formattedData = res?.data?.map((el) => ({
          label: `${el?.firstName} ${el?.lastName}`,
          value: el?.id,
        }));
        setAdminUsers(formattedData);
      } else {
        toastr.error(res?.message);
      }
    };

    fetchAdminUsers();
  }, []);
  const availableAdmins = adminUser.filter(
    (admin) =>
      !participants?.some((participant) => participant?.userId === admin?.value)
  );
  const validateForm = () => {
    const newErrors = participants.map((participant) => ({
      userId: !participant.userId ? "Participant name is required." : "",
      roleInMeeting: !participant.roleInMeeting
        ? "Participant role is required."
        : "",
    }));
    if (participants?.length < 2) {
      errors.participants = "Meeting must have a minimum of 2 participants.";
      setError(errors);
      return;
    } else {
      setError({});
    }

    setErrors(newErrors);

    return newErrors.every((error) => !error.userId && !error.roleInMeeting);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(e, "Participants");
  };
  return (
    <Form onSubmit={handleSave}>
      <Scrollbars
        className="participantsUsersTbl"
        autoHeight
        autoHeightMin={100}
        autoHeightMax={250}
        autoHide
      >
        <Table bordered>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Participant Name</th>
              <th>Participant Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {participants?.map((participant, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <FormGroup>
                    <Select
                      name="userId"
                      value={
                        adminUser.find(
                          (user) => user.value === participant.userId
                        ) || null
                      }
                      onChange={(option) =>
                        handleChange(
                          index,
                          "userId",
                          option ? option.value : null
                        )
                      }
                      options={availableAdmins}
                      isClearable
                      className={errors[index]?.userId ? "is-invalid" : ""}
                    />
                    {errors[index]?.userId && (
                      <div className="invalid-feedback">
                        {errors[index]?.userId}
                      </div>
                    )}
                  </FormGroup>
                </td>
                <td>
                  <FormGroup>
                    <Select
                      name="roleInMeeting"
                      value={
                        userRole.find(
                          (roleInMeeting) =>
                            roleInMeeting.value === participant.roleInMeeting
                        ) || null
                      }
                      onChange={(option) =>
                        handleChange(
                          index,
                          "roleInMeeting",
                          option ? option.value : null
                        )
                      }
                      options={userRole}
                      isClearable
                      className={
                        errors[index]?.roleInMeeting ? "is-invalid" : ""
                      }
                    />
                    {errors[index]?.roleInMeeting && (
                      <div className="invalid-feedback">
                        {errors[index]?.roleInMeeting}
                      </div>
                    )}
                  </FormGroup>
                </td>
                <td>
                  <Button
                    onClick={() => handleRemoveParticipant(index)}
                    variant="danger"
                    className="closeIconBtn"
                  ></Button>
                </td>
              </tr>
            ))}
            {error?.participants && (
              <div className="invalid-feedback d-block">
                {error.participants}
              </div>
            )}
          </tbody>
        </Table>
      </Scrollbars>
      <div className="addMoreAction">
        <Button onClick={handleAddParticipant} variant="link" className="add-btn-link">Add More </Button>
      </div>
      <div className="companyDetailsBtmAction">
        {edit ? (
          <Button type="submit" variant="primary">
            Save Changes
          </Button>
        ) : (
          <> </>
        )}
      </div>
    </Form>
  );
};
