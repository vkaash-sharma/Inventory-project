import React from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import NoRecordImg from "../../../Assets/Images/no-records-img.png"

export const NoRecordsFound = ({ message , innerMessage}) => {
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "calc(70vh - 100px)",
        backgroundColor: "#f5ffff3d",
        borderRadius: "5px",
      }}
    > 
      <Row className="w-100">
        <Col md={8} className="mx-auto">
          <div className="norecordsFoundSec">
            <img src={NoRecordImg} alt="norecords-img" className="norecordsImg" />
            <h5>{message || "No Records Found"}</h5>
            <p>
              {innerMessage ? innerMessage : "There were no records to display"}
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
