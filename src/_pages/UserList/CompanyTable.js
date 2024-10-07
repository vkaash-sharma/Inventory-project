import React from "react";
import { Table } from "react-bootstrap";

const CompanyTable = ({ companyList }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>S.No</th>
          <th>Company</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        {companyList.length > 0 ? (
          companyList.map((company, index) => (
            <tr key={company.id}>
              <td>{index + 1}</td>
              <td>{company?.name}</td>
              <td>{+company?.isSuperAdmin === 0 ? "Admin" : "User"}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="3">No companies found</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default CompanyTable;
