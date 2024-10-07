import { YYYYMMDDHHMMSSFormat, auth_user } from "../../_helpers/helper";
import { Tasks } from "../../_pages/ManageMeeting/MeetingView/tasks";
import TextArea from "../../components/Common/TextArea";
import React from "react";
import { Row, Col, Card, Table, Button, Container } from "react-bootstrap";

export const MeetingHeader = ({
  companyName,
  projectName,
  meetingId,
  agenda,
  date,
  participants,
  minutes,
  actionItems,
  meetingData,
}) => {
  const [userData, setUserData] = React.useState([]);
  const getCommaSeparatedSummaries = (documents) => {
    return documents
      .map((doc) => doc.chatgpt_summary)
      .filter(Boolean)
      .join(", ");
  };

  return (
    <div className="meetingDetailsInfo">
      <h6 className="secBlueTitle">Basic Information</h6>
      <ul className="commonDataList row">
        <li className="col-md-4 col-sm-6">
          <label className="labelTitle">Company Name</label>
          <p className="dataName">{companyName}</p>
        </li>
        <li className="col-md-4 col-sm-6">
          <label className="labelTitle">Project Name</label>
          <p className="dataName">{projectName}</p>
        </li>
        <li className="col-md-4 col-sm-6">
          <label className="labelTitle">Meeting Agenda</label>
          <p className="dataName">{agenda}</p>
        </li>
        <li className="col-md-4 col-sm-6">
          <label className="labelTitle">Date</label>
          <p className="dataName">{YYYYMMDDHHMMSSFormat(date)}</p>
        </li>
        <li className="col-md-4 col-sm-6">
          <label className="labelTitle">Participants</label>
          <CommaSeparatedNames participants={participants} />
        </li>
      </ul>
      <Row className="mb-2">
        <Col className="pt-4">
        <h6 className="secBlueTitle pb-1">Minutes of Meeting</h6>        
          <TextArea          
            value={
              getCommaSeparatedSummaries(minutes) || "No summaries available"
            }
          />
        </Col>
      </Row>
      <Row>
        <Col className="pt-4">
          <div className="actionTblTitle">
            <h6 className="secBlueTitle m-0">Action Items</h6>
          </div>         
        
          <Tasks
            changeMode
            viewMode
            selectedMeetingId={meetingId}
            userData={userData}
            setUserData={setUserData}
            meetingData={meetingData}
          />
        </Col>
      </Row>
    </div>
  );
};
const getFullName = (userDetails) => {
  return `${userDetails?.firstName || ""} ${userDetails?.lastName || ""
    }`.trim();
};
const CommaSeparatedNames = ({ participants }) => {
  const names = participants
    .map((participant) => getFullName(participant.usersDetails))
    .filter(Boolean);
  return <p>{names.join(", ")}</p>;
};
