import React from "react";

const Error = ({ error, className }) => {
  return (
    <span className={className ? className : "small text-danger"}>{error}</span>
  );
};

export default Error;
