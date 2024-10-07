import React from "react";

export const TextParagraph = ({ text }) => {
  const textLines = text?.split("\n")?.map((line, index, array) => (
    <React.Fragment key={index}>
      {line}
      {index < array.length - 1 && <br />}
    </React.Fragment>
  ));

  return <p>{textLines}</p>;
};
