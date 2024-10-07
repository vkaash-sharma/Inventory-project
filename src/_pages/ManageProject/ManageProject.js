import { useEffect, useState } from "react";
import { Card, Col, Row, Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAllProjectByCompanyId } from "../../services/projectService";
import { DDMMYYYYFormat } from "../../_helpers/helper";
import { NoRecordsFound } from "../../components/Common/NoRecordFound/NoRecordsFound";
import { MdModeEdit } from "react-icons/md";
import { ActionLog } from "../../components/Common/ActionLog/ActionLog";
import { isLoginSuperAdmin } from "../../services/JwtAuthService";

export const ManageProject = ({ companyList }) => {
  const [projectList, setProjectList] = useState([]);
  const { companyId } = useParams();
  const navigate = useNavigate();

  const fetchData = async () => {
    const response = await getAllProjectByCompanyId(companyId);
    if (response?.status) {
      setProjectList(response?.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, [companyId]);

  const isAdmin =
    companyList?.isSuperAdmin ||
    companyList?.UsercompanyAccess?.[0]?.userRole === "admin";

  return (
    <div className="projectsList">
      <Card className="formMainDiv">
        <div className="cardTitle">
          <h6>Projects List</h6>
          {isAdmin && (
            <Link
              className="btn addOutlineBtn"
              to={`/company/${companyId}/project/add`}
            >
              Add Project
            </Link>
          )}
        </div>
        <div className="recommendedSec">
          <Row>
            {projectList?.length ? (
              projectList.map((item, i) => (
                <Col lg="4" key={i}>
                  <div className="projectsCard">
                    <Link to={`/company/${companyId}/project/view/${item.id}`}>
                      <div className="projectDataSec">
                        <h6>{item.projectName}</h6>
                        <p>
                          Date:{" "}
                          <strong>{DDMMYYYYFormat(item.createdAt)}</strong>
                        </p>
                      </div>
                      {isAdmin && (
                        <div className="cardActionIconBtns">
                          <Link
                            className="btn btn-outline-primary"
                            to={`/company/${companyId}/project/edit/${item.id}`}
                          >
                            <MdModeEdit />
                          </Link>
                        </div>
                      )}
                    </Link>
                  </div>
                </Col>
              ))
            ) : (
              <NoRecordsFound />
            )}
          </Row>
        </div>
      </Card>
      {isLoginSuperAdmin() && <ActionLog  />}
    </div>
  );
};
