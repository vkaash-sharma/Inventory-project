import React, { useState, useEffect } from "react";
import { Card, Col, Row, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import toastr from "toastr";
import "bootstrap/dist/css/bootstrap.min.css";
import { viewMeetingById } from "../../services/projectService";

const ViewMeeting = () => {
  const { companyId, projectId, meetingId } = useParams();
  const [meetingData, setMeetingData] = useState(null);
  const navigate = useNavigate();

  const fetchMeetingData = async () => {
    try {
      const response = await viewMeetingById(meetingId);
      if (response?.status) {
        setMeetingData(response.data);
      } else {
        toastr.error(response?.message);
      }
    } catch (error) {
      toastr.error("Failed to fetch meeting details.");
    }
  };

  useEffect(() => {
    fetchMeetingData();
  }, [meetingId]);

  const handleBack = () => {
    navigate(-1);
  };

  if (!meetingData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <Row className="justify-content-center">
        <Col lg={9}>
          <Card>
            <Card.Title>View Meeting Details</Card.Title>
            <Card.Body>
              <Row>
                <Col xs={8}>
                  <p>
                    <strong>Meeting Title:</strong> {meetingData.meetingTitle}
                  </p>
                </Col>
                <Col xs={6}>
                  <p>
                    <strong>Start Time:</strong>{" "}
                    {new Date(meetingData.startTime).toLocaleString()}
                  </p>
                </Col>
                <Col xs={6}>
                  <p>
                    <strong>End Time:</strong>{" "}
                    {new Date(meetingData.endTime).toLocaleString()}
                  </p>
                </Col>
                <Col xs={12}>
                  <p>
                    <strong>Participants:</strong>
                  </p>
                  <ul>
                    {meetingData?.meetingParticipantsDetails?.map(
                      (participant, index) => (
                        <li key={index}>
                          {participant?.usersDetails?.firstName}{" "}
                          {participant?.usersDetails?.lastName} (
                          {participant.roleInMeeting})
                        </li>
                      )
                    )}
                  </ul>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col xs={6}>
                  <Button variant="secondary" onClick={handleBack}>
                    Back
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ViewMeeting;
