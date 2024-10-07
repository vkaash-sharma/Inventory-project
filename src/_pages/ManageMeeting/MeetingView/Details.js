import { useState } from "react";
import { Card, Col, Row, Button, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import moment from "moment";
export const Details = ({
  meetingDetails,
  setMeetingDetails,
  onSubmit,
  edit,
}) => {
  const { companyId, projectId, meetingId } = useParams();
  const [isEditing, setIsEditing] = useState(edit);
  const [errors, setErrors] = useState({});

  // useEffect(() => {
  //   (async () => {
  //     const res = await viewMeetingById(meetingId);
  //     if (res?.status) {
  //       setMeetingDetails(res.data);
  //     } else {
  //       toastr.error(res?.message || "Failed to fetch meeting details.");
  //     }
  //   })();
  // }, [meetingId, setMeetingDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMeetingDetails((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    if (!meetingDetails?.meetingTitle) {
      isValid = false;
      errors.meetingTitle = "Meeting title is required.";
    }

    if (!meetingDetails?.startTime) {
      isValid = false;
      errors.startTime = "Start time is required.";
    } else if (!moment(meetingDetails.startTime).isValid()) {
      isValid = false;
      errors.startTime = "Start time is not a valid date.";
    }

    if (!meetingDetails.endTime) {
      isValid = false;
      errors.endTime = "End time is required.";
    } else if (!moment(meetingDetails.endTime).isValid()) {
      isValid = false;
      errors.endTime = "End time is not a valid date.";
    } else if (
      moment(meetingDetails.startTime).isSameOrAfter(meetingDetails.endTime)
    ) {
      isValid = false;
      errors.endTime = "End time should be after start time.";
    }

    if (!meetingDetails?.description) {
      isValid = false;
      errors.description = "Description is required.";
    }

    setErrors(errors);
    return isValid;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm() || !meetingId) return;
    onSubmit(e, "Details");
  };

  const formatDateTimeLocal = (date) => {
    return date ? moment(date).format("YYYY-MM-DDTHH:mm") : "";
  };
  if (!meetingDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Row className="justify-content-center">
        <Col lg={12}>
              <Row>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Meeting Title</Form.Label>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        name="meetingTitle"
                        value={meetingDetails.meetingTitle}
                        onChange={handleInputChange}
                        isInvalid={!!errors.meetingTitle}
                      />
                    ) : (
                      <p>{meetingDetails.meetingTitle}</p>
                    )}
                    <Form.Control.Feedback type="invalid">
                      {errors.meetingTitle}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col xs={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Time</Form.Label>
                    {isEditing ? (
                      <Form.Control
                        type="datetime-local"
                        name="startTime"
                        value={formatDateTimeLocal(meetingDetails.startTime)}
                        onChange={handleInputChange}
                        isInvalid={!!errors.startTime}
                      />
                    ) : (
                      <p>{moment(meetingDetails.startTime).format("LLL")}</p>
                    )}
                    <Form.Control.Feedback type="invalid">
                      {errors.startTime}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col xs={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>End Time</Form.Label>
                    {isEditing ? (
                      <Form.Control
                        type="datetime-local"
                        name="endTime"
                        value={formatDateTimeLocal(meetingDetails.endTime)}
                        onChange={handleInputChange}
                        isInvalid={!!errors.endTime}
                      />
                    ) : (
                      <p>{moment(meetingDetails.endTime).format("LLL")}</p>
                    )}
                    <Form.Control.Feedback type="invalid">
                      {errors.endTime}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group className="mt-2">
                    <Form.Label>Description</Form.Label>
                    {isEditing ? (
                      <Form.Control
                        as="textarea"
                        name="description"
                        value={meetingDetails.description}
                        onChange={handleInputChange}
                        isInvalid={!!errors.description}
                        rows={5}
                      />
                    ) : (
                      <p>{meetingDetails?.description}</p>
                    )}
                    <Form.Control.Feedback type="invalid">
                      {errors.description}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
        </Col>
      </Row>

      <div className="d-flex justify-content-end align-items-end">
        {isEditing ? (
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};
