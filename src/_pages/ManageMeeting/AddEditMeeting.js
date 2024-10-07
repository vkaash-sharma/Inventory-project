import React, { useState, useEffect } from "react";
import { Card, Col, Form, Row, Button, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import toastr from "toastr";
import "bootstrap/dist/css/bootstrap.min.css";
import { meetingFormLabel, meetingInitalForm } from "./DATA";
import { companyAdmins } from "../../services/UserService/UserService";
import {
  createMeetings,
  createProject,
  editProject,
  getUserSuggestById,
  projectById,
  upateMeetingById,
  viewMeetingById,
} from "../../services/projectService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { YYYYMMDDHHMMSSFormat } from "../../_helpers/helper";
import { ParticipantForm } from "./ParticipantForm";
import { Recordings } from "./Recordings";
import CustomBreadcrumb from "../../_pages/ManageCompany/CustomBreadcrumb";
import { ParticipantInvite } from "./ParticipantInvite";

const AddEditMeeting = () => {
  const { companyId, id, projectId, meetingId } = useParams();
  const [form, setForm] = useState({ ...meetingInitalForm });
  const [error, setError] = useState({});
  const [recordings, setRecordings] = useState([
    { document_url: null, instruction: "" },
  ]);
  const [participants, setParticipants] = useState([
    { userId: "", roleInMeeting: "", name: "", email: "" },
  ]);
  const navigate = useNavigate();

  const fetchData = async () => {
    if (id) {
      const resp = await projectById(id, `companyId=${companyId}`);
      setForm(resp.data);
    }
  };
  const fetchviewMeetingData = async () => {
    if (meetingId) {
      const response = await viewMeetingById(meetingId);
      if (response?.status) {
        const {
          companyId,
          projectId,
          meetingTitle,
          startTime,
          endTime,
          meetingParticipantsDetails,
        } = response.data;
        setForm({
          companyId: companyId,
          projectId: projectId,
          meetingTitle: meetingTitle,
          startTime: startTime,
          endTime: endTime,
        });
        setParticipants(meetingParticipantsDetails);
      } else {
        toastr.error(response?.message);
      }
    }
  };
  const fetchData1 = async () => {
    if (projectId) {
      const resp = await getUserSuggestById(projectId);
      const dataResponse = resp?.data.map((el) => {
        const { userId, roleInMeeting, email, name } = el;
        return {
          userId: userId,
          roleInMeeting: roleInMeeting,
          email: email,
          name: name,
        };
      });
      setParticipants(dataResponse);
    }
  };
  useEffect(() => {
    fetchData();
    fetchData1();
    fetchviewMeetingData(meetingId);
  }, [companyId, id, projectId]);

  const onChange = async (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    if (!form.meetingTitle) {
      isValid = false;
      errors.meetingTitle = "Meeting title is required.";
    }

    // if (form.startTime && form.endTime) {
    //   if (!form.startTime) {
    //     isValid = false;
    //     errors.startTime = "Start time is required.";
    //   } else if (isNaN(new Date(form.startTime))) {
    //     isValid = false;
    //     errors.startTime = "Start time is not a valid date.";
    //   }

    //   if (!form.endTime) {
    //     isValid = false;
    //     errors.endTime = "End time is required.";
    //   } else if (isNaN(new Date(form.endTime))) {
    //     isValid = false;
    //     errors.endTime = "End time is not a valid date.";
    //   } else if (new Date(form.startTime) >= new Date(form.endTime)) {
    //     isValid = false;
    //     errors.endTime = "End time should be after start time.";
    //   }
    // }

    if (
      participants.some(
        (participant) => !participant.userId || !participant.roleInMeeting
      )
    ) {
      isValid = false;
      errors.participants = "All participants must have a Name and a Role.";
    }
    if (participants?.length == 0) {
      errors.participants = "Participants  is required.";
    }
    if (participants?.length < 2) {
      errors.participants = "Meeting must have a minimum of 2 participants.";
    }
    // recordings
    if (!recordings || recordings?.length == 0) {
      isValid = false;
      errors.recordings = "All Recording must have a Document and Instruction";
    }
    if (
      recordings.some(
        (participant) => !participant.document_url || !participant.instruction
      )
    ) {
      isValid = false;
      errors.recordings = "All Recording must have a Document and Instruction";
    }

    if (recordings?.length == 0) {
      errors.recordings = "Recordings  is required.";
    }
    setError(errors);
    return isValid;
  };

  const handleSubmit2 = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    if (participants?.length == 0 || participants?.length < 0) {
      toastr.warning("Meeting must have a minimum of 2 participants.");
    }
    const meetingData = {
      companyId: companyId,
      projectId: projectId,
      description: form?.description,
      meetingTitle: form?.meetingTitle || "",
      startTime: form?.startTime ? YYYYMMDDHHMMSSFormat(form?.startTime) : null,
      endTime: form?.endTime ? YYYYMMDDHHMMSSFormat(form?.endTime) : null,
      meeting_participants: participants?.map((el) => ({
        roleInMeeting: el?.roleInMeeting,
        userId: el?.userId,
      })),
      meeting_documents: recordings?.map((el) => ({
        document_url: el?.document_url,
        instruction: el?.instruction,
        document_type: "recording",
      })),
    };
    const response = meetingId
      ? await upateMeetingById(meetingId, meetingData)
      : await createMeetings(meetingData);
    if (response?.status) {
      toastr.success(response?.message);
      navigate(-1);
    } else {
      toastr.error(response?.message);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleDateChange = (name, date) => {
    setForm((prevForm) => ({
      ...prevForm,
      [name]: date ? date.toISOString() : null,
    }));
  };
  return (
    <>
      <CustomBreadcrumb
        backLink={`/company/${companyId}/project/view/${projectId}`}
        items={[
          { label: "Companies List", link: "/companies" },
          { label: "Projects List", link: `/company/${companyId}/view` },
          {
            label: "Meetings",
            link: `/company/${companyId}/project/view/${projectId}`,
          },
          { label: "Add Meeting", active: true },
        ]}
      />
      <Container className="wrapperSec">
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="formMainDiv">
              <div className="cardTitle">
                <h6>{`${id ? "Edit" : "Add"} Meeting`}</h6>
              </div>
              <Form onSubmit={handleSubmit2}>
                <Row className="formInnerSec">
                  {/* Meeting Title */}
                  <Col xs={12}>
                    <Form.Group controlId="meetingTitle" className="mb-3">
                      <Form.Label>{meetingFormLabel.meetingTitle} </Form.Label>
                      <span className="redStar">*</span>
                      <Form.Control
                        type="text"
                        name="meetingTitle"
                        value={form?.meetingTitle}
                        onChange={onChange}
                        placeholder="Enter meeting title"
                        isInvalid={!!error?.meetingTitle}
                      />
                      <Form.Control.Feedback type="invalid">
                        {error?.meetingTitle}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  {/* Description*/}
                  <Col xs={12}>
                    <Form.Group controlId="description" className="mb-3">
                      <Form.Label>{meetingFormLabel.description} </Form.Label>
                      <Form.Control
                        as="textarea"
                        name="description"
                        value={form?.description}
                        onChange={onChange}
                        placeholder="Enter meeting description"
                        isInvalid={!!error?.description}
                        rows={5}
                      />

                      <Form.Control.Feedback type="invalid">
                        {error?.description}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  {/* Start Time */}
                  <Col xs={12}>
                    <Form.Label className="secHead">Meeting Time</Form.Label>
                    <span className="redStar">*</span>
                    <Row>
                      <Col xs={6}>
                        <Form.Group controlId="startTime" className="mb-3">
                          <Form.Label className="timeLabelCont">
                            {meetingFormLabel.startTime}{" "}
                          </Form.Label>
                          <DatePicker
                            selected={
                              form?.startTime ? new Date(form.startTime) : null
                            }
                            onChange={(date) =>
                              handleDateChange("startTime", date)
                            }
                            showTimeSelect
                            dateFormat="dd/MM/yyyy hh:mm aa"
                            placeholderText="Select start date and time"
                            className={`form-control datePickerIcon ${
                              error?.startTime ? "is-invalid" : ""
                            }`}
                            aria-label="Select start date and time"
                          />
                          <Form.Control.Feedback
                            type="invalid"
                            style={{
                              display: error.startTime ? "block" : "none",
                            }}
                          >
                            {error?.startTime}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      {/* End Time */}
                      <Col xs={6}>
                        <Form.Group controlId="endTime" className="mb-3">
                          <Form.Label className="timeLabelCont">
                            {meetingFormLabel.endTime}
                          </Form.Label>
                          <DatePicker
                            selected={
                              form?.endTime ? new Date(form.endTime) : null
                            }
                            onChange={(date) =>
                              handleDateChange("endTime", date)
                            }
                            showTimeSelect
                            dateFormat="dd/MM/yyyy hh:mm aa"
                            placeholderText="Select end date and time"
                            className={`form-control datePickerIcon ${
                              error?.endTime ? "is-invalid" : ""
                            }`}
                            aria-label="Select end date and time"
                          />
                          <Form.Control.Feedback
                            type="invalid"
                            style={{
                              display: error.endTime ? "block" : "none",
                            }}
                          >
                            {error?.endTime}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>

                  {/* Participant Form */}
                  <Col xs={12}>
                    <Form.Label className="secHead">
                      Participants Users
                    </Form.Label>
                    <span className="redStar">*</span>

                    <div className="participant-form">
                      <ParticipantForm
                        onSubmit={handleSubmit2}
                        participants={participants}
                        setParticipants={setParticipants}
                      />
                      {/* <ParticipantInvite
                        participants={participants}
                        setParticipants={setParticipants}
                      /> */}
                      {error?.participants && (
                        <div className="invalid-feedback d-block">
                          {error.participants}
                        </div>
                      )}
                    </div>
                  </Col>
                  {/* Recording Form */}
                  <Col xs={12}>
                    <Form.Label className="secHead">Recordings</Form.Label>
                    <span className="redStar">*</span>
                    <div className="participant-form">
                      <Recordings
                        onSubmit={handleSubmit2}
                        recordings={recordings}
                        setRecordings={setRecordings}
                      />
                    </div>
                    {error?.recordings && (
                      <div className="invalid-feedback d-block">
                        {error.recordings}
                      </div>
                    )}
                  </Col>
                </Row>

                {/* Action Buttons */}
                <div className="formBtmAction pt-2">
                  <Button variant="outline-secondary" onClick={handleBack}>
                    Back
                  </Button>
                  <Button variant="primary" type="submit">
                    {id ? "Update" : "Create"}
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AddEditMeeting;
