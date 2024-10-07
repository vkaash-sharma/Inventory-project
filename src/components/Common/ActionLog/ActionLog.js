import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Table,
  Pagination,
  Modal,
  Row,
  Col,
} from "react-bootstrap";
import Scrollbars from "react-custom-scrollbars-2";
import { FaEye } from "react-icons/fa";
import { Details } from "./Details";
import { NoRecordsFound } from "../NoRecordFound/NoRecordsFound";
import { useParams } from "react-router-dom";
import {
  DDMMYYYYFormat,
  fetchAdminUsers,
  getAllActionByParams,
} from "../../../_helpers/helper";
export const ActionLog = React.memo(() => {
  const params = useParams();
  const [actionLogData, setActionLogData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 7;
  const [showModal, setShowModal] = useState(false);
  const [currentLog, setCurrentLog] = useState(null);
  const [show, setShow] = useState(false);

  const handleViewClick = (log) => {
    setCurrentLog(log);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setCurrentLog();
    setShowModal(false);
    setCurrentLog(null);
  };

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs =
    actionLogData && actionLogData?.slice(indexOfFirstLog, indexOfLastLog);

  const totalPages = Math.ceil(actionLogData?.length / logsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const toggleLogHistory = () => setShow((prev) => !prev);
  const fetchData = async () => {
    const userData = await fetchAdminUsers();
    const response = await getAllActionByParams(params);
    if (response?.status) {
      const actionLogData =
        response?.data?.length > 0 &&
        (await Promise.all(
          response?.data?.map(async (el) => {
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
            } = el;
            const createdByName = userData[+createdBy] || "Unknown";
            return {
              id,
              subModuleName,
              action,
              refrence_id,
              commit_id,
              ipAddress,
              createdBy: createdByName,
              updatedBy,
              deleted,
              createdAt,
              updatedAt,
            };
          })
        ));

      console.log("Formatted Data:", actionLogData);
      setActionLogData(actionLogData);
    }
  };

  useEffect(() => {
    fetchData(params);
  }, [params]);

  return (
    <>
      {" "}
      <Button
        className="ActionLogBtn"
        style={{
          marginTop: "-10px",
          marginButtom: "100px",
        }}
        onClick={toggleLogHistory}
      >
        Log history
      </Button>{" "}
      {show && (
        <div className="projectsList w-90 ">
          <Card className="formMainDiv ">
            {" "}
            {currentLogs?.length > 0 ? (
              <Card.Body>
                <Scrollbars
                  className="participantsUsersTbl "
                  autoHeight
                  autoHeightMin={230}
                  autoHeightMax={150}
                  autoHide
                >
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th> S.no</th>
                        <th>Action</th>
                        <th>Date</th>
                        <th>By User</th>
                        <th>Ip address</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <>
                        {currentLogs?.map((log, index) => (
                          <tr key={log.id}>
                            <td>{index + 1}</td>
                            <td>{log?.action || "N/A"}</td>
                            <td>
                              {log?.createdAt
                                ? DDMMYYYYFormat(log.createdAt)
                                : "N/A"}
                            </td>
                            <td>{log?.createdBy}</td>
                            <td>{log?.ipAddress || "N/A"}</td>
                            <td>
                              <FaEye
                                style={{ cursor: "pointer" }}
                                onClick={() => handleViewClick(log)}
                              />
                            </td>
                          </tr>
                        ))}
                      </>
                      {}
                    </tbody>
                  </Table>
                </Scrollbars>
                <Pagination>
                  <Pagination.First
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                  />
                  <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                  {Array.from({ length: totalPages }, (_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPage}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                  <Pagination.Last
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </Card.Body>
            ) : (
              <>
                <NoRecordsFound />
              </>
            )}
          </Card>

          {/* Modal to show action log details */}
          {currentLog?.id && (
            <Details
              showModal={showModal}
              handleModalClose={handleModalClose}
              currentLog={currentLog}
            />
          )}
        </div>
      )}
    </>
  );
});
