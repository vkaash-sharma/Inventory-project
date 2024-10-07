import { useEffect, useState } from "react";
import { Row, Col, Card, Table, Modal, Spinner } from "react-bootstrap";
import Scrollbars from "react-custom-scrollbars-2";
import { getAllActionLog } from "../../../services/actionLog";
import { NoRecordsFound } from "../NoRecordFound/NoRecordsFound";
import {
  fetchAdminUsers,
  capitalizeName,
  DDMMYYYYFormat,
} from "../../../_helpers/helper";

export const Details = ({ showModal, handleModalClose, currentLog }) => {
  const [data, setData] = useState({});
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    const userData = await fetchAdminUsers();
    const response = await getAllActionLog(currentLog?.id);

    if (response?.status) {
      const {
        id,
        subModuleName,
        action,
        refrence_id,
        commit_id,
        ipAddress,
        createdBy,
        updatedBy,
        deleted,
        createdAt,
        updatedAt,
      } = response?.data;
      const createdByName = userData[+createdBy] || "Unknown";

      setData({
        id,
        subModuleName,
        action,
        refrence_id,
        commit_id,
        ipAddress,
        createdBy,
        createdByName,
        updatedBy,
        deleted,
        createdAt,
        updatedAt,
      });

      const actionLogData = await Promise.all(
        response?.data?.actionChangeLogsDetails?.map(async (el) => {
          const {
            id,
            action_log_id,
            tableName,
            refrenceId,
            fieldName,
            prevValue,
            changeValue,
            updatedBy,
            deleted,
            updatedAt,
          } = el;

          return {
            id,
            action_log_id,
            tableName,
            refrenceId,
            fieldName,
            prevValue,
            changeValue,
            updatedBy,
            deleted,
            updatedAt,
          };
        })
      );
      setLoading(false);
      setLog(actionLogData);
    } else {
      setError("Failed to fetch data.");
    }
  };

  useEffect(() => {
    if (currentLog?.id) {
      fetchData(currentLog);
    }
  }, [currentLog]);

  return (
    <Modal
      show={showModal}
      onHide={handleModalClose}
      dialogClassName="custom-modal-width"
    >
      <Modal.Header closeButton className="fixed-modal-header">
        <Modal.Title>Action Log Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="customBody">
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : currentLog?.id ? (
          <div>
            <Row>
              <Col>
                <p>
                  <strong>Sub Module Name:</strong>{" "}
                  {capitalizeName(data?.subModuleName) || "N/A"}
                </p>
                <p>
                  <strong>Action:</strong>{" "}
                  {capitalizeName(data?.action) || "N/A"}
                </p>
              </Col>
              <Col>
                <p>
                  <strong>Refrence_id:</strong> {data?.refrence_id || "N/A"}
                </p>
                <p>
                  <strong>Ip Address:</strong> {data?.ipAddress}
                </p>
              </Col>
              <Col>
                <p>
                  <strong>Created By:</strong> {data?.createdByName}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {data?.createdAt ? DDMMYYYYFormat(data?.createdAt) : "N/A"}
                </p>
              </Col>
            </Row>
            {log?.length > 0 ? (
              <Row>
                <Card className="formMainDiv noPad">
                  <Card.Body>
                    <Scrollbars
                      className="participantsUsersTbl"
                      autoHeight
                      autoHeightMax={210}
                      autoHide
                    >
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>S.no</th>
                            <th>Table Name</th>
                            <th>Refrence Id</th>
                            <th>Field Name</th>
                            <th>Previous Value</th>
                            <th>Change Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {log?.map((log, index) => (
                            <tr key={log.id}>
                              <td>{index + 1}</td>
                              <td>{log?.tableName}</td>
                              <td>{log.refrenceId}</td>
                              <td>{log.fieldName}</td>
                              <td>{log.prevValue}</td>
                              <td>{log.changeValue}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Scrollbars>
                  </Card.Body>
                </Card>
              </Row>
            ) : (
              <NoRecordsFound innerMessage="There were no records for Change log to display" />
            )}
          </div>
        ) : (
          <NoRecordsFound />
        )}
      </Modal.Body>
    </Modal>
  );
};
