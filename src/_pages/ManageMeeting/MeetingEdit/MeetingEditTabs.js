import React, { useState, useEffect, useTransition } from "react";
import { Tabs, Tab, Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import toastr from "toastr";
import { upateMeetingById, viewMeetingById } from "../../../services/projectService";
import { Mom } from "../MeetingView/Mom";
import { Documents } from "../MeetingView/Documents";
import { Participants } from "../MeetingView/Participants";
import { Details } from "../MeetingView/Details";
import { ParticipantForm } from "../ParticipantForm";
import { Tasks } from "../MeetingView/tasks";
import { Recordings } from "../Recordings";
import { YYYYMMDDHHMMSSFormat } from "../../../_helpers/helper";
import CustomBreadcrumb from "../../../_pages/ManageCompany/CustomBreadcrumb";
import { ParticipantInvite } from "../ParticipantInvite";

export const MeetingEditTabs = () => {
  const { companyId, projectId, meetingId } = useParams();
  const [userData, setUserData] = useState([]);
  const [meetingDetails, setMeetingDetails] = useState({
    meetingTitle: "",
    startTime: "",
    endTime: "",
    description: "",
  });
  const [participants, setParticipants] = useState([
    { userId: "", roleInMeeting: "", name: "", email: "" },
  ]);
  const [recordings, setRecordings] = useState([
    {
      document_url: null,
      instruction: "",
      viewIcon: false,
      video_translate: "",
    },
  ]);
  const [meetingData, setMeetingData] = useState(null);
  const [isPending, startTransition] = useTransition();

  const navigate = useNavigate();

  const fetchMeetingData = async () => {
    const response = await viewMeetingById(meetingId);
    if (response?.status) {
      startTransition(() => {
        setMeetingData(response.data);
        setMeetingDetails(response.data);
        setParticipants(
          response?.data?.meetingParticipantsDetails?.map((el) => {
            return {
              ...el,
              email: el?.usersDetails?.email || "",
              name:
                `${el?.usersDetails?.firstName} ${el?.usersDetails?.lastName}` ||
                "",
            };
          })
        );
        setRecordings(
          response?.data?.meetingDocumentsDetails?.map((el) => ({
            document_url: el?.document_url,
            instruction: el?.instruction,
            video_translate: el?.video_translate,
            viewIcon: true,
            id: el?.id,
            deleted: el?.deleted,
          }))
        );
      });
    } else {
      toastr.error(response?.message);
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

  const handleSubmit2 = async (e, type = null) => {
    e.preventDefault();
    const {
      companyId,
      projectId,
      meetingParticipantsDetails,
      meetingDocumentsDetails,
    } = meetingData;

    const formatParticipants = (participantsList) => {
      return participantsList?.map((el) => ({
        roleInMeeting: el?.roleInMeeting,
        userId: el?.userId,
      }));
    };

    const formatDocuments = (documentsList) => {
      return documentsList?.map((el) => {
        let formattedDocument = {
          document_url: el?.document_url,
          instruction: el?.instruction,
          document_type: "recording",
          deleted: el?.deleted,
        };
        if (el?.id && typeof el?.id !== "string") {
          formattedDocument.id = el.id;
        }
        return formattedDocument;
      });
    };

    const basePayload = {
      companyId,
      projectId,
      description: meetingData?.description,
      meetingTitle: meetingData?.meetingTitle || "",
      startTime: meetingData?.startTime
        ? YYYYMMDDHHMMSSFormat(meetingData.startTime)
        : null,
      endTime: meetingData?.endTime
        ? YYYYMMDDHHMMSSFormat(meetingData.endTime)
        : null,
    };

    let payload;
    switch (type) {
      case "Details":
        payload = {
          companyId: meetingDetails?.companyId,
          projectId: meetingDetails?.projectId,
          description: meetingDetails?.description,
          meetingTitle: meetingDetails?.meetingTitle || "",
          startTime: meetingDetails?.startTime
            ? YYYYMMDDHHMMSSFormat(meetingDetails?.startTime)
            : null,
          endTime: meetingDetails?.endTime
            ? YYYYMMDDHHMMSSFormat(meetingDetails?.endTime)
            : null,
          meeting_participants: formatParticipants(meetingParticipantsDetails),
          meeting_documents: formatDocuments(meetingDocumentsDetails),
        };
        break;
      case "Participants":
        payload = {
          ...basePayload,
          meeting_participants: formatParticipants(participants),
          meeting_documents: formatDocuments(meetingDocumentsDetails),
        };
        break;
      case "Documents":
        payload = {
          ...basePayload,
          meeting_participants: formatParticipants(meetingParticipantsDetails),
          meeting_documents: formatDocuments(recordings),
        };
        break;
      default:
        payload = {
          ...basePayload,
          meeting_participants: formatParticipants(meetingParticipantsDetails),
          meeting_documents: formatDocuments(meetingDocumentsDetails),
        };
        break;
    }

    const res = await upateMeetingById(meetingId, payload);
    if (res?.status) {
      toastr.success(res?.message);
    } else {
      toastr.error(res?.message);
    }
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
          { label: "Edit Meeting", active: true },
        ]}
        rightActionLink={`/company/${companyId}/project/${projectId}/meeting/view/${meetingId}`}
        rightActionText="View Meeting"
      />

      <Container className="wrapperSec">
        <Row>
          <Col xs={12}>
            <div className="companyTopCard">
              <div>
                <label>Company Name:</label>
                <p>{meetingData?.companyDetails?.name}</p>
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
          >
            <Tab eventKey="attendance" title="Details">
              <Details
                meetingDetails={meetingDetails}
                setMeetingDetails={setMeetingDetails}
                onSubmit={handleSubmit2}
                edit={true}
              />
            </Tab>
            <Tab eventKey="participants" title="Participants">
              <div className="participant-form">
                <ParticipantForm
                  participants={participants}
                  setParticipants={setParticipants}
                  onSubmit={handleSubmit2}
                  edit={true}
                />
                {/* <ParticipantInvite
                  participants={participants}
                  setParticipants={setParticipants}
                  onSubmit={handleSubmit2}
                  edit={true}
                /> */}
              </div>
            </Tab>
            <Tab eventKey="document" title="Documents">
              <Recordings
                fetchMeetingData={fetchMeetingData}
                meetingData={meetingData}
                onSubmit={handleSubmit2}
                recordings={recordings}
                setRecordings={setRecordings}
                edit={true}
              />
            </Tab>
            <Tab eventKey="mom" title="MOM">
              <Mom meetingData={meetingData} edit={true} />
            </Tab>
            <Tab eventKey="tasks" title="Tasks">
              <Tasks
                meetingData={meetingData}
                userData={userData}
                setUserData={setUserData}
                userMeeting
              />
            </Tab>
          </Tabs>
        </div>
        {isPending && <div>Loading...</div>}
      </Container>
    </>
  );
};
