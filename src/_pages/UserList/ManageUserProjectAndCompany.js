import { Card, Row, Col } from "react-bootstrap";
import CompanyTable from "./CompanyTable";

export const ManageUserProjectAndCompany = ({ companyList }) => {
  return (
    <div className="projectsList">
      <Card className="formMainDiv">
        <div className="cardTitle">
          <h6>Companies</h6>
        </div>
        <div className="recommendedSec">
          <Row>
            <Col md={10}>
              <CompanyTable companyList={companyList} />
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
};
