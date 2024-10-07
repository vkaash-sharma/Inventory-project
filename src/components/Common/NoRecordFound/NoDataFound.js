import React from "react";

const NoDataFound = ({ title, subtitle }) => {
  return (
    <div className="no-record-container">
      <h1 className="no-record-title">{title || "No Records Found"}</h1>
      <p className="no-record-subtitle">
        {subtitle || "There were no records to display"}
      </p>
    </div>
  );
};

export default NoDataFound;
