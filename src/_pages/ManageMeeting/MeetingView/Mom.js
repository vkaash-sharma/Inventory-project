import { NoRecordsFound } from "../../../components/Common/NoRecordFound/NoRecordsFound";
import React, { useState } from "react";
import { Tabs, Tab, Container, Table } from "react-bootstrap";
import { isLoginSuperAdmin } from "../../../services/JwtAuthService";

export const Mom = ({ meetingData }) => {
  const formatted = (meetingData?.meetingDocumentsDetails || [])
    .map((el) => {
      const content = el?.chatgpt_summary?.trim() || "";
      return content;
    })
    .filter((content) => content)
    .join("<br/><br/>");

  return (
    <div className="attendance-table no-border">
      <div className="mom-container no-border">
        {meetingData?.meetingDocumentsDetails
          ?.map((el) => el?.chatgpt_summary)
          ?.join("")
          ?.trim()?.length > 0 ? (
          <>
            <div
              dangerouslySetInnerHTML={{ __html: formatted }}
              style={{
                width: "100%",
                height: "400px",
                overflowY: "auto",
                fontFamily: "monospace",
              }}
            />
          </>
        ) : (
          <>
            <NoRecordsFound />
          </>
        )}
      </div>
    </div>
  );
};
