import React, { useState, useEffect } from "react";
import { Table, Button, Form, Container, Dropdown, Row } from "react-bootstrap";
import Select from "react-select";
import { CgRemove } from "react-icons/cg";
import { LuPlusCircle } from "react-icons/lu";
import moment from "moment";
import { companyAdmins } from "../../../services/UserService/UserService";
import { MdModeEdit, MdRemoveRedEye } from "react-icons/md";
import { Link } from "react-router-dom";
import { FiEdit3, FiMoreVertical } from "react-icons/fi";
import {
  getMeetingTaskById,
  upateMeetingTaskById,
} from "../../../services/projectService";
import toastr from "toastr";
import { useParams } from "react-router-dom";
import { NoRecordsFound } from "../../../components/Common/NoRecordFound/NoRecordsFound";
import { getRowClassName, getTdClassName } from "../../../_helpers/taskColorCode";
import { auth_user } from "../../../_helpers/helper";
export const Tasks = ({
  changeMode,
  meetingData,
  selectedMeetingId,
  viewMode: initialViewMode,
  userData,
  setUserData,
  userMeeting,
}) => {
  const [viewMode, setviewMode] = React.useState(initialViewMode);
  const [adminUser, setAdminUsers] = useState([]);
  useEffect(() => {
    if (!meetingData?.meetingParticipantsDetails) return;

    const formattedAdminUsers = meetingData.meetingParticipantsDetails.map(
      ({ usersDetails }) => ({
        label: `${usersDetails.firstName} ${usersDetails.lastName}`,
        value: usersDetails.id,
      })
    );
    setAdminUsers(formattedAdminUsers);
  }, [meetingData]);

  const { companyId, projectId, meetingId } = useParams();
  const [participants, setParticipants] = useState([]);
  const [taskList, settaskList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tasksData, setTasksData] = useState([]);
  const [errors, setErrors] = useState({});
  const [activeIndex, setActiveIndex] = useState(null);
  const maxcharLength = 500;
  useEffect(() => {
    const fetchAdminUsers = async () => {
      const res = await companyAdmins();
      if (res?.status) {
        const formattedData = res?.data?.map((el) => ({
          label: `${el?.firstName} ${el?.lastName}`,
          value: el?.id,
        }));
        const adminUsers = res?.data?.reduce((acc, user) => {
          const fullName = `${user.firstName || ""} ${user.lastName || ""}`;
          acc[user.id] = fullName;
          return acc;
        }, {});
        setUserData(adminUsers);
      } else {
        toastr.error(res?.message);
      }
    };

    fetchAdminUsers();
  }, []);

  const fetchData = async () => {
    const id = selectedMeetingId || meetingId;
    const res = await getMeetingTaskById(id);
    if (res?.status) {
      const payload = res?.data?.map((el, index) => {
        const {
          meeting_id,
          meeting_description,
          meetingDueDate,
          taskOwners,
          id = null,
          addedBy = "",
          editedBy = "",
        } = el;

        return {
          ...(id !== null && { id }),
          tableId: index + 1,
          meeting_id,
          meeting_description,
          meetingDueDate,
          user_count: taskOwners?.length,
          taskOwners,
          addedBy,
          editedBy,
        };
      });
      setTasksData(payload);
      settaskList(payload);
    }
  };

  useEffect(() => {
    fetchData();
  }, [meetingId, selectedMeetingId]);
  const handleChangeTaskOwner = (index, field, ownerIndex, value) => {
    if (viewMode) return;
    const newParticipants = participants.map((participant, i) =>
      i === ownerIndex ? { ...participant, [field]: `${value}` } : participant
    );
    setParticipants(newParticipants);
    const updatedTasks = [...tasksData];
    updatedTasks[index].taskOwners[ownerIndex] = {
      ...updatedTasks[index].taskOwners[ownerIndex],
      [field]: value,
      user: adminUser?.find((item) => +item?.value === +value)?.label || "",
    };
    setTasksData(updatedTasks);
  };

  const handleInputChange = (index, field, value) => {
    if (viewMode) return;
    setActiveIndex(index);
    const updatedTasks = [...tasksData];
    updatedTasks[index][field] = value;
    setTasksData(updatedTasks);
  };

  const handleStatusChange = (taskIndex, ownerIndex, value) => {
    if (viewMode) return;
    const updatedTasks = [...tasksData];
    updatedTasks[taskIndex].taskOwners[ownerIndex].status = value;
    if (value === "Closed") {
      updatedTasks[taskIndex].taskOwners[ownerIndex].completed_date =
        moment().format("YYYY-MM-DD");
    } else {
      updatedTasks[taskIndex].taskOwners[ownerIndex].completed_date = "";
    }
    setTasksData(updatedTasks);
  };

  const addTask = () => {
    if (viewMode) return;
    const newTask = {
      id: null,
      tableId: tasksData.length
        ? tasksData[tasksData.length - 1].tableId + 1
        : 1,
      meeting_id: meetingId || selectedMeetingId,
      meeting_description: "",
      meetingDueDate: moment().add(1, "days").format("YYYY-MM-DD"),
      taskOwners: [
        {
          user: "",
          status: "Open",
          completed_date: "",
          meeting_task_id: meetingId,
        },
      ],
      addedBy: "",
      editedBy: "",
    };
    setTasksData([...tasksData, newTask]);
  };

  const removeTask = (id) => {
    if (viewMode) return;
    setTasksData(tasksData?.filter((task) => task.tableId !== id));
  };

  const addOwnerStatusPair = (taskIndex) => {
    if (viewMode) return;
    const updatedTasks = [...tasksData];
    updatedTasks[taskIndex]?.taskOwners.push({
      user: "",
      status: "Open",
      completed_date: "",
      meeting_task_id: meetingId,
    });
    setTasksData(updatedTasks);
  };

  const removeOwnerStatusPair = (taskIndex, ownerIndex) => {
    if (viewMode) return;
    const updatedTasks = [...tasksData];
    updatedTasks[taskIndex]?.taskOwners.splice(ownerIndex, 1);
    setTasksData(updatedTasks);
  };

  const validateTasks = () => {
    let isValid = true;
    const newErrors = {};

    tasksData.forEach((task, index) => {
      if (!task.meeting_description) {
        isValid = false;
        newErrors[`meeting_description_${index}`] =
          "Description cannot be empty";
      }
      if (task.meeting_description?.length > maxcharLength) {
        isValid = false;
        newErrors[
          `meeting_description_${index}`
        ] = `Description length cannot exceed the limit of ${maxcharLength}`;
      }

      if (!task.taskOwners || task.taskOwners.length === 0) {
        isValid = false;
        newErrors[`taskOwners_${index}`] = "Task assignee cannot be empty";
        toastr.warning("Task assignee cannot be empty");
      } else {
        task?.taskOwners?.forEach((owner, ownerIndex) => {
          if (!owner.userId) {
            isValid = false;
            newErrors[`owner_${index}_${ownerIndex}`] =
              "Task assignee cannot be empty";
          }
        });
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSaveChanges = async () => {
    if (tasksData.length == 0) {
      toastr.warning("Please create at least one task");
    } else if (validateTasks()) {
      const payload = tasksData?.map((el) => {
        const {
          meeting_id,
          meeting_description,
          meetingDueDate,
          taskOwners,
          id = null,
          addedBy,
          editedBy,
        } = el;

        return {
          ...(id !== null && { id }),
          meeting_id,
          meeting_description,
          meetingDueDate,
          user_count: taskOwners.length,
          taskOwners,
          addedBy,
          editedBy,
        };
      });
      if (taskList?.length > 0) {
        const data1Ids = new Set(payload.map((item) => item.id));
        taskList?.forEach((item) => {
          if (!data1Ids?.has(item.id)) {
            const newItem = { ...item, deleted: 1 };
            payload.push(newItem);
          }
        });
      }
      const res = await upateMeetingTaskById(payload);
      if (res?.status) {
        toastr.success(res?.message || "Success");
        fetchData();
      } else {
        toastr.error(res?.message || "Error");
      }
    }
  };
  let availableAdmins = adminUser?.filter((admin) => {
    if (tasksData?.length > 0) {
      const currentTaskOwners =
        tasksData[currentIndex]?.taskOwners?.map((owner) => +owner.userId) ||
        [];
      return !currentTaskOwners.includes(admin.value);
    } else {
      return true;
    }
  });

  return (
    <>
      {" "}
      
        {changeMode &&
          tasksData?.length > 0 &&
          (auth_user()?.user?.userRole?.role?.level == 0 ||
            meetingData?.meetingParticipantsDetails
              ?.filter((el) => el?.roleInMeeting === "admin")
              ?.map((el) => el?.userId)
              ?.includes(auth_user()?.user?.id)) && (
            <>
              {" "}
              {viewMode ? (
                <>
                  <div className="taskRightAction">
                  <span
                    className="edit-btn-link"
                    onClick={() => setviewMode(!viewMode)}
                    style={{ cursor: "pointer" }}
                  >
                    Edit
                  </span>
                  </div>
                </>
              ) : (
                <>
                   <div className="taskRightAction">
                  <span
                    className="view-btn-link"
                    onClick={() => setviewMode(!viewMode)}
                    style={{ cursor: "pointer" }}
                  >
                    View
                  </span>
                  </div>
                </>
              )}
            </>
          )}{" "}
      <div
        className="attendance-table no-border"
        style={{
          position: "relative",
        }}
      >
        {tasksData ? (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Task Description</th>
                  <th>Task Due Date</th>
                  {viewMode ? null : <th className="text-center">Task Count</th>}
                  <th>
                    <div class="d-flex">
                      <div class="w-50">Assigned To</div>
                      <div class="w-50 text-left">Status</div>
                    </div>
                  </th>
                  {!viewMode ? null : <th>Added By</th>}
                  {!viewMode ? null : <th>Edited By</th>}
                  {viewMode ? null : <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {viewMode ? (
                  <>
                    {tasksData?.map((task, index) => (
                      <tr
                        key={task.tableId}
                        onMouseEnter={() => setCurrentIndex(index)}
                        // className={getRowClassName(task)}
                      >
                        <td>{task.tableId}</td>
                        <td>
                          <div
                            style={{
                              position: "relative",
                              display: "inline-block",
                              width: "100%",
                            }}
                          >
                            <span>{task.meeting_description}</span>
                          </div>
                        </td>
                        <td>
                          <span>
                            {task.meetingDueDate
                              ? moment(task.meetingDueDate).format("YYYY-MM-DD")
                              : ""}
                          </span>
                        </td>
                        <td
                          className={`table-cell-overflow ${getRowClassName(
                            task
                          )}`}
                        >
                          {task?.taskOwners?.map((ownerStatus, i) => {
                            return (
                              <div
                                key={i}
                                className={`assigntoStatus status-label ${getTdClassName(
                                      ownerStatus
                                    )}`}
                              >
                                <div
                                   class="w-70"
                                >
                                  <>
                                    <span
                                      className={`status-label ${getTdClassName(
                                        ownerStatus
                                      )}`}
                                    >
                                      {adminUser.find(
                                        (user) =>
                                          user.value === ownerStatus.userId
                                      )?.label || "Not Assigned"}
                                    </span>
                                  </>
                                </div>
                                <div style={{width : "30%"}}>
                                  <span
                                    className={`status-label ${getTdClassName(
                                      ownerStatus
                                    )}`}
                                  >
                                    {ownerStatus.status}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </td>
                        <td className="table-cell-overflow">
                          {task?.taskOwners?.map((ownerStatus, i) => (
                            <div className="assigntoStatus"
                              key={i}
                            >
                              {userData[+ownerStatus?.createdBy] || "N/A"}
                            </div>
                          ))}
                        </td>
                        <td className="table-cell-overflow">
                          {task?.taskOwners?.map((ownerStatus, i) => (
                            <div className="assigntoStatus"
                              key={i}
                            >
                              {userData[+ownerStatus?.updatedBy] || "N/A"}
                            </div>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <>
                    {tasksData?.map((task, index) => (
                      <tr
                        key={task.tableId}
                        onMouseEnter={() => setCurrentIndex(index)}
                      // className={getRowClassName(task)}
                      >
                        <td>{task.tableId}</td>
                        <td>
                          <div
                            style={{
                              position: "relative",
                              display: "inline-block",
                              width: "100%",
                            }}
                          >
                            <textarea
                              className={`form-control ${errors[`meeting_description_${index}`]
                                  ? "is-invalid"
                                  : ""
                                }`}
                              value={task.meeting_description}
                              style={{
                                width: "100%",
                                height: "90px",
                                resize: "vertical",
                                overflowY: "auto",
                                whiteSpace: "pre-wrap",
                                wordWrap: "break-word",
                                scrollbarWidth: "thin",
                                backgroundColor: "#ffffff",
                                paddingRight: "30px", 
                              }}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "meeting_description",
                                  e.target.value
                                )
                              }
                              disabled={viewMode}
                            />
                            <span
                              style={{
                                position: "absolute",
                                bottom: "0px",
                                right: "11px",
                                fontSize: "8px",
                                color: "grey",
                                //marginBottom: "-13px",
                                fontWeight: 600,
                              }}
                            >
                              {activeIndex == index ? (
                                <>
                                  {task.meeting_description.length} /{" "}
                                  {maxcharLength}{" "}
                                </>
                              ) : (
                                <></>
                              )}
                            </span>
                            <Form.Control.Feedback type="invalid">
                              {errors[`meeting_description_${index}`]}
                            </Form.Control.Feedback>
                          </div>
                        </td>
                        <td>
                          <Form.Control
                            type="date"
                            value={
                              task.meetingDueDate
                                ? moment(task.meetingDueDate).format(
                                  "YYYY-MM-DD"
                                )
                                : ""
                            }
                            style={{
                              backgroundColor: "#ffffff",
                            }}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "meetingDueDate",
                                e.target.value
                              )
                            }
                            //className="no-border"
                            disabled={viewMode}
                          />
                        </td>
                        {viewMode ? null : <td className="text-center">{task?.taskOwners?.length}</td>}
                        <td className="table-cell-overflow">
                          {task?.taskOwners?.map((ownerStatus, i) => (
                            <div
                              key={i}
                              className="d-flex align-items-center mb-2"
                            >
                              <div className="w-50">
                                <>
                                  <Select
                                    name="userId"
                                    value={
                                      adminUser.find(
                                        (user) =>
                                          user.value === ownerStatus.userId
                                      ) || null
                                    }
                                    onChange={(option) =>
                                      handleChangeTaskOwner(
                                        index,
                                        "userId",
                                        i,
                                        option ? option.value : null
                                      )
                                    }
                                    options={availableAdmins}
                                    isClearable
                                    className={`me-2 custom-select ${errors[`owner_${index}_${i}`]
                                        ? "is-invalid"
                                        : ""
                                      }`}
                                    styles={{
                                      menu: (provided) => ({
                                        ...provided,
                                        position: "absolute",
                                      }),
                                      backgroundColor: "#ffffff",
                                    }}
                                    menuPortalTarget={document.body}
                                    isDisabled={viewMode}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors[`owner_${index}_${i}`]}
                                  </Form.Control.Feedback>
                                </>
                              </div>
                              <div className="w-50 pe-2 ps-2">
                                <Form.Select
                                  as="select"
                                  value={ownerStatus.status}
                                  onChange={(e) =>
                                    handleStatusChange(index, i, e.target.value)
                                  }
                                  disabled={viewMode}
                                >
                                  <option>Open</option>
                                  <option>Closed</option>
                                </Form.Select>
                              </div>
                              <Button
                                onClick={() => removeOwnerStatusPair(index, i)}
                                variant="danger"
                                className="closeIconBtn"
                              ></Button>
                            </div>
                          ))}
                          <Button
                            onClick={() => addOwnerStatusPair(index)}
                            variant="primary"
                            className="addIconBtn"
                          ></Button>
                        </td>
                        <td className="text-center">
                          <Button
                            onClick={() => removeTask(task.tableId)}
                            variant="danger"
                            className="deleteIconBtn"
                          ></Button>

                        </td>
                      </tr>
                    ))}
                  </>
                )}
                {!viewMode && (
                  <tr>
                    <th colspan="6">
                      <div className="addMoreAction">
                        <Button
                          onClick={addTask}
                          variant="link"
                          className="add-btn-link"
                        >Add More</Button>
                      </div>
                    </th>
                  </tr>
                )}
              </tbody>
            </Table>
            {!viewMode && (
              <div className="companyDetailsBtmAction">
                <Button
                  variant="primary"
                  // style={{                 
                  //   margin: userMeeting ? "3px 0px 0px 75vw" : "3px 0px 0px 45vw",
                  // }}
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </>
        ) : (
          <NoRecordsFound />
        )}

      </div>
    </>
  );
};
