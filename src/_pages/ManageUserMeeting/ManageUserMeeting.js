import { useState, useEffect } from "react";
import { Tabs, Tab, Container, Row, Col, Card } from "react-bootstrap";
import { MeetingHeader } from "./MeetingHeader";
import { QueryMeeting } from "./QueryMeeting";
import { ViewMeeting } from "./ViewMeeting";
import { getAllUserMeeting, viewMeetingById } from "../../services/projectService";
import { useParams, useLocation, Link } from "react-router-dom";
import { PARSE_IMG_URL, YYYYMMDDHHMMSSFormat } from "../../_helpers/helper";
import { IoMdArrowRoundBack } from "react-icons/io";
import { NoRecordsFound } from "../../components/Common/NoRecordFound/NoRecordsFound";
import { URL_CONFIG } from "../../_contants/config/URL_CONFIG";
import CustomBreadcrumb from "../../_pages/ManageCompany/CustomBreadcrumb";
import Scrollbars from "react-custom-scrollbars-2";

export const ManageUserMeeting = () => {
  const [meetingDetails, setMeetingDetails] = useState(null);
  const [meetingList, setMeetingList] = useState([]);
  const [activeUserId, setActiveUserId] = useState(null);
  const { companyId } = useParams();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await getAllUserMeeting(companyId);
        if (response?.status) {
          const responseData = response?.data?.map((el) => ({
            id: el.id,
            name: `${el?.meetingTitle}`,
            role: ``,
            companyName: el?.companyDetails?.name,
            projectName: el?.projectDetails?.projectName,
            createdAt: el?.createdAt,
            shortName: el?.companyDetails?.shortName,
          }));

          setMeetingList(responseData);
          if (responseData.length > 0) {
            setActiveUserId(responseData[0].id);
            fetchUserData(responseData[0]);
          }
        } else {
          console.error("No data received or error occurred");
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };

    fetchData();
  }, [companyId]);

  const fetchUserData = async (user) => {
    try {
      const response = await viewMeetingById(user?.id);
      if (response.status) {
        const {
          id,
          meetingTitle = "",
          description = "",
          startTime = "",
          endTime = "",
          projectDetails = {},
          companyDetails = {},
          meetingParticipantsDetails = [],
          meetingDocumentsDetails = [],
          usersDetails = {},
          assistant_id,
          thread_id,
        } = response.data;

        const meetings = {
          id,
          meetingTitle,
          description,
          startTime,
          endTime,
          projectDetails,
          companyDetails,
          meetingParticipantsDetails,
          meetingDocumentsDetails,
          usersDetails,
          assistant_id,
          thread_id,
        };

        setMeetingDetails(meetings);
      } else {
        console.error("No data received");
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  const handleUserClick = (user) => {
    fetchUserData(user);
    setActiveUserId(user.id);
  };

  return (
    <>
      <CustomBreadcrumb
        backLink={`/companies`}
        items={[
          { label: 'Companies List', link: '/companies' },
          { label: 'My Meeting', active: true }
        ]}
      />

      <Container className="wrapperSec pt-2">
        {/* <div className="pageTitle">
        <h6>My Meetings</h6>
      </div> */}
        {meetingList?.length > 0 ? (
          <Row>
            <Col md={3} className="meetingLeftCardsSec">
              <Scrollbars autoHide className="tabsLeftCardsScroll">
                <div className="companyNameSec">
                  <Card.Img
                    crossOrigin="anonymous"
                    src={PARSE_IMG_URL(
                      URL_CONFIG.DEV_URL,
                      meetingDetails?.companyDetails?.logo
                    )}
                  />
                  <p>{meetingDetails?.companyDetails?.shortName}</p>
                </div>

                {meetingList?.length > 0 ? (
                  meetingList.map((user) => (
                    <Card
                      key={user.id}
                      className={`meetingLeftCards ${activeUserId === user.id ? "active-card" : ""
                        }`}
                      onClick={() => handleUserClick(user)}
                    // style={{
                    //   border:
                    //     activeUserId === user.id ? "1px solid #121e69" : "none",
                    // }}
                    >
                      <h6 className="meetingTitleCont">{user.name}</h6>
                      <div className="joinDate"></div>

                      <div className="comNameSortName">
                        <ul className="commonDataList">
                          <li>
                            <label>Project Name</label>
                            <p>
                              {user?.projectName ||
                                "Company Name Not Available"}
                            </p>
                          </li>
                          <li>
                            <label>Date & Time</label>
                            <p>
                              {user.createdAt
                                ? YYYYMMDDHHMMSSFormat(user.createdAt)
                                : "N/A"}
                            </p>
                          </li>
                        </ul>
                        {/* <p>
                        {user?.shortName || "Project Name Not Available"}
                      </p> */}
                      </div>
                    </Card>
                  ))
                ) : (
                  <></>
                )}
              </Scrollbars>
            </Col>
            <Col md={9}>
              <div className="companyDetailTabs">
                <Tabs defaultActiveKey="mom" id="meeting-tabs" className="customTabs">
                  <Tab eventKey="mom" title="MOM">
                  {/* <Scrollbars autoHide className="tabsDataScroll"> */}
                    {meetingDetails ? (
                      <MeetingHeader
                        companyName={meetingDetails?.companyDetails?.name}
                        projectName={meetingDetails?.projectDetails?.projectName}
                        meetingId={meetingDetails?.id}
                        agenda={meetingDetails.meetingTitle}
                        date={meetingDetails.startTime}
                        participants={meetingDetails.meetingParticipantsDetails}
                        minutes={meetingDetails.meetingDocumentsDetails}
                        actionItems={meetingDetails.actionItems}
                        meetingData={meetingDetails}
                      />
                    ) : (
                      <NoRecordsFound />
                    )}
                    {/* </Scrollbars> */}
                  </Tab>
                  <Tab eventKey="queryMeeting" title="Query Meeting">
                    <QueryMeeting
                      queryMeeting=""
                      meetingId={meetingDetails?.id}
                      meetingDetails={meetingDetails}
                    />
                  </Tab>
                  <Tab
                    eventKey="videoMeeting"
                    title="Video Meeting"
                    className="tabMeetingUser mt-0"
                  >
                    <ViewMeeting
                      videoData={meetingDetails?.meetingDocumentsDetails}
                    />
                  </Tab>
                </Tabs>
              </div>
            </Col>
          </Row>
        ) : (
          <>
            <NoRecordsFound />
          </>
        )}
      </Container>
    </>
  );
};
