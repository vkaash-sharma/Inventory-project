import React from "react";
import TimeAgo from "react-timeago";

function CustomTimeAgo({ date }) {
  const currentTime = new Date();
  const timeDifference = currentTime - new Date(date);
  const oneMonthInMillis = 30 * 24 * 60 * 60 * 1000; // Assuming one month is approximately 30 days

  const formatDate = (date) => {
    const options = {
      year: "2-digit",
      month: "short",
      day: "numeric",
    };

    const formattedDate =
      date instanceof Date ? date.toLocaleDateString(undefined, options) : "";
    const day = date.getDate();
    const daySuffix = getDaySuffix(day);

    return formattedDate.replace(String(day), `${day}${daySuffix}`);
  };

  const getDaySuffix = (day) => {
    if (day >= 11 && day <= 13) {
      return "th";
    }
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return (
    <span className="font11">
      {timeDifference < oneMonthInMillis ? (
        <TimeAgo date={new Date(date)} />
      ) : (
        formatDate(new Date(date))
      )}
    </span>
  );
}

export default CustomTimeAgo;
