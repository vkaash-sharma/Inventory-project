import moment from "moment";

export const getRowClassName = (data) => {
  const now = moment();

  const hasOpenTask = data.taskOwners.some((task) => task.status == "Open");
  const meetingDueDate = moment(data?.meetingDueDate);

  if (hasOpenTask) {
    if (meetingDueDate?.isBefore(now)) {
      return "tr-red";
    } else if (meetingDueDate.isAfter(now)) {
      return "tr-orange";
    }
  } else {
    return "tr-green";
  }
  return "tr-white";
};
export const getTdClassName = (data) => {
  if (data.status === "Open") {
    return "orange";
  } else if (data.status === "Closed") {
    return "green";
  } else {
    return "";
  }
};
