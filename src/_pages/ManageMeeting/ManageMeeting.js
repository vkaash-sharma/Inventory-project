import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import { getAllProjectMeetingByProjectId } from "../../services/projectService";
import { FaRegEdit } from "react-icons/fa";
import { YYYYMMDDHHMMSSFormat } from "../../_helpers/helper";
import { getCompanyById } from "../../services/companyService";
import { NoRecordsFound } from "../../components/Common/NoRecordFound/NoRecordsFound";
import { isLoginSuperAdmin } from "../../services/JwtAuthService";
import { ActionLog } from "../../components/Common/ActionLog/ActionLog";

export const ManageMeeting = ({ projectId, companyId }) => {
  const [projectList, setProjectList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    const filter = `companyId=${companyId}&projectId=${projectId}`;
    const response = await getAllProjectMeetingByProjectId(filter);
    const res = await getCompanyById(companyId);
    setCompanyList(res.data);
    if (!response?.status) return;
    console.log("asdadas", response?.data);
    setProjectList(response?.data);
  };

  useEffect(() => {
    fetchData();
  }, [companyId]);

  return (
    <div className="projectsList">
      <Card className="formMainDiv">
        <div className="cardTitle">
          <h6>Meetings</h6>
          {(companyList?.isSuperAdmin ||
            (companyList?.UsercompanyAccess?.length > 0 &&
              companyList?.UsercompanyAccess[0]?.userRole === "admin")) && (
            <Link
              className="btn addOutlineBtn"
              to={`/company/${companyId}/project/${projectId}/meeting/add`}
            >
              Add Meeting
            </Link>
          )}
        </div>
        <div className="recommendedSec">
          <Row>
            {Array.isArray(projectList) && projectList?.length ? (
              projectList?.map((item, i) => {
                return (
                  <Col lg="4" key={i} className="mb-4">
                    <div className="projectsCard meetingCards">
                      <Link
                        to={`/company/${companyId}/project/${projectId}/meeting/view/${item.id}`}
                      >
                        <div className="projectDataSec">
                          <h6 className="meetingTitle">{item?.meetingTitle}</h6>
                          <p className="dateTime">
                            <label>Start Time</label>
                            <strong>
                              {item?.startTime
                                ? YYYYMMDDHHMMSSFormat(item?.startTime)
                                : "N/A"}
                            </strong>
                          </p>
                          <p className="dateTime">
                            <label>End Time</label>
                            <strong>
                              {item?.endTime
                                ? YYYYMMDDHHMMSSFormat(item?.endTime)
                                : "N/A"}
                            </strong>
                          </p>
                        </div>
                      </Link>
                      <div className="editBtmButton">
                        {(item?.isSuperAdmin ||
                          item?.meetingParticipantsDetails[0]?.roleInMeeting ===
                            "admin") && (
                          <Link
                            className="btn btn-outline-secondary"
                            to={{
                              pathname: `/company/${companyId}/project/${projectId}/meeting/edit/${item.id}`,
                              state: { item: item },
                            }}
                          >
                            Edit Meeting
                          </Link>
                        )}
                      </div>
                    </div>
                  </Col>
                );
              })
            ) : (
              <>
                <NoRecordsFound />
              </>
            )}
          </Row>
        </div>
      </Card>
      <>{isLoginSuperAdmin() && <ActionLog />}</>
    </div>
  );
};
