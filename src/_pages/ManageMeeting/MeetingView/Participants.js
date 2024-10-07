
import React from "react";
import { Table, Button } from "react-bootstrap";
import { isLoginSuperAdmin } from "../../../services/JwtAuthService";

export const Participants = ({
  meetingData: {
    meetingParticipantsDetails,
    companyDetails: { shortName },
    projectDetails: { projectName },
  },
  edit,
}) => {
  const meetingData = meetingParticipantsDetails?.map((el) => {
    const { id, roleInMeeting, status, usersDetails } = el;
    let firstName = usersDetails?.firstName;
    let lastName = usersDetails?.lastName;
    return {
      id,
      user: `${firstName} ${lastName}`,
      roleInMeeting,
      status,
    };
  });

  return (
    <div className="attendance-table">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>S.No</th>
            <th>User</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {meetingData?.map((participant, index) => (
            <tr key={participant.id}>
              <td>{index + 1}</td>
              <td>{participant?.user}</td>
              <td>{participant?.roleInMeeting}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-end align-items-end">
        {edit ? (
          <Button variant="primary" className="mb-2">
            Save Changes
          </Button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
