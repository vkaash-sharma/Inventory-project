import React from "react";
import { Card, Row, Col, ListGroup } from "react-bootstrap";

const Dashboard = () => {
  return (
    <div className="container wrapperSec mt-5">
      <h1 className="mb-4">Welcome to Your Dashboard</h1>

      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>Summary</Card.Header>
            <Card.Body>
              {/* <h4>Total Sales</h4>
              <p>$15,000</p>
              <h4>Total Users</h4>
              <p>1,200</p>
              <h4>New Messages</h4>
              <p>35</p> */}
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>Recent Activities</Card.Header>
            <ListGroup variant="flush"></ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
