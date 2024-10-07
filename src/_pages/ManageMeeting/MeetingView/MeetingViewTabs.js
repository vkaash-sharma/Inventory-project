import React, { useState, useEffect } from "react";
import { Tabs, Tab, Container, Row, Button, Col, Table } from "react-bootstrap";
import { Details } from "./Details";
import { Participants } from "./Participants";
import { Documents } from "./Documents";
import { Mom } from "./Mom";
import { Link, useNavigate, useParams } from "react-router-dom";
import toastr from "toastr";
import { viewMeetingById } from "../../../services/projectService";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { Tasks } from "./tasks";
import { auth_user } from "../../../_helpers/helper";
import CustomBreadcrumb from "../../../_pages/ManageCompany/CustomBreadcrumb";
import { isLoginSuperAdmin } from "../../../services/JwtAuthService";
import { ActionLog } from "../../../components/Common/ActionLog/ActionLog";

export const TabsComponent = () => {
  const { companyId, projectId, meetingId } = useParams();
  const [userData, setUserData] = useState([]);
  const [activeTab, setActiveTab] = useState("attendance");
  let [authUser, setAuthUser] = useState(auth_user()?.user);
  const [meetingDetails, setMeetingDetails] = useState({
    meetingTitle: "",
    startTime: "",
    endTime: "",
    description: "",
  });
  const [participants, setParticipants] = useState([
    { userId: "", roleInMeeting: "" },
  ]);
  const [meetingData, setMeetingData] = useState(null);
  const navigate = useNavigate();
  const fetchMeetingData = async () => {
    try {
      const response = await viewMeetingById(
        meetingId,
        `companyId=${companyId}`
      );
      if (response?.status) {
        setMeetingData(response.data);
        setMeetingDetails(response.data);
        setParticipants(response?.data?.meetingParticipantsDetails);
      } else {
        toastr.error(response?.message);
      }
    } catch (error) {
      toastr.error("Failed to fetch meeting details.");
    }
  };

  const isUserAdmin = () => {
    if (
      meetingDetails.isSuperAdmin === 1 ||
      meetingData?.meetingParticipantsDetails?.some(
        (participant) =>
          participant.userId === authUser.id &&
          participant.roleInMeeting === "admin"
      )
    ) {
      return true;
    }
    return false;
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
          { label: "Edit Meeting", active: true },
        ]}
        rightActionLink={`/company/${companyId}/project/${projectId}/meeting/edit/${meetingId}`}
        rightActionText="Edit Meeting"
      />

      <Container className="wrapperSec">
        <Row>
          <Col xs={12}>
            <div className="companyTopCard">
              <div>
                <label>Company Name:</label>
                <p>{meetingData?.companyDetails?.shortName}</p>
              </div>
              <div>
                <label>Project Name:</label>
                <p>{meetingData?.projectDetails?.projectName}</p>
              </div>
            </div>
          </Col>
        </Row>

        <div className="companyDetailTabs">
          <Tabs
            defaultActiveKey="attendance"
            id="uncontrolled-tab-example"
            className="customTabs"
            onSelect={(k) => setActiveTab(k)}
          >
            <Tab eventKey="attendance" title="Details">
              <Details
                meetingDetails={meetingDetails}
                setMeetingDetails={setMeetingDetails}
              />
            </Tab>
            <Tab eventKey="participants" title="Participants">
              <Participants meetingData={meetingData} />
            </Tab>
            <Tab eventKey="document" title="Documents">
              <Documents
                meetingData={meetingData}
                userData={userData}
                fetchMeetingData={fetchMeetingData}
              />
            </Tab>
            <Tab eventKey="mom" title="MOM">
              <Mom meetingData={meetingData} />
            </Tab>
            <Tab eventKey="tasks" title="Tasks">
              <Tasks
                meetingData={meetingData}
                viewMode={true}
                userData={userData}
                setUserData={setUserData}
              />
            </Tab>
          </Tabs>
        </div>
        {isLoginSuperAdmin() &&  activeTab !== "mom" && (
            <div style={{ marginTop: "21px" }}>
              <ActionLog />
            </div>
          )}
      </Container>
    </>
  );
};
