import React, { useEffect } from "react";
import { MdOutlineOndemandVideo, MdMusicNote } from "react-icons/md";
import { FcVoicePresentation } from "react-icons/fc";

const Mp3orMp4 = ({
  documents,
  handleShow,
  handleTransShow,
  setTranscritData,
  handleTransShowWithoutModel,
  handleFactData,
  handlSpeakerShow,
  setDocumentFactsDetail,
}) => {

  let handleFn = () => {
    handleShow(documents?.document_url);
    const videoTranslateData = documents?.video_translate
      ? JSON.parse(documents.video_translate)
      : null;
    handleTransShowWithoutModel(videoTranslateData);

    if (videoTranslateData) {
      setTranscritData(videoTranslateData);
    }

    const speakerFact = documents?.meetingsDocumentFactsDetail?.find(
      (fact) => fact?.fact_name && fact?.fact_name === "speakerDetails"
    );
    if (handleFactData) {
      if (speakerFact) {
        handleFactData(JSON.parse(speakerFact?.fact_value_manual || speakerFact?.fact_value_ai));
      } else {
        handleFactData(null);
      }
    }
  };

  const handleTranscriptModal = () => {
    handleTransShow(
      documents?.video_translate ? JSON.parse(documents.video_translate) : null
    );
    const speakerFact = documents?.meetingsDocumentFactsDetail?.find(
      (fact) => fact.fact_name && fact.fact_name === "speakerDetails"
    );
    if (handleFactData) {
      if (speakerFact) {
        handleFactData(JSON.parse(speakerFact?.fact_value_manual || speakerFact?.fact_value_ai));
      } else {
        handleFactData(null);
      }
    }
  };

  const handlefacts = (e) => {
    if (handlSpeakerShow) {
      handlSpeakerShow(e);
    }
    if (setDocumentFactsDetail) {
      setDocumentFactsDetail(documents?.meetingsDocumentFactsDetail);
    }
  };
  const getFileTypeIcon = (url) => {
    if (url && url.endsWith(".mp3")) {
      return (
        <MdMusicNote
          size={24}
          style={{ color: "#007bff", cursor: "pointer", marginRight: "8px" }}
          onClick={() => handleFn()}
        />
      );
    } else if (url && url.endsWith(".mp4")) {
      return (
        <MdOutlineOndemandVideo
          size={24}
          style={{ color: "#007bff", cursor: "pointer", marginRight: "8px" }}
          onClick={() => handleFn()}
        />
      );
    }
    return null;
  };

  return (
    <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {getFileTypeIcon(documents?.document_url)}
      <small
        style={{
          textDecoration: "underline",
          color: "rgb(172, 90, 164)",
          cursor: "pointer",
        }}
        onClick={handleTranscriptModal}
      >
        Transcript
      </small>{" "}
      <FcVoicePresentation
        style={{
          textDecoration: "underline",
          fontSize: "28px",
          cursor: "pointer",
        }}
        onClick={handlefacts}
      >
        Speaker
      </FcVoicePresentation>
    </td>
  );
};

export default Mp3orMp4;
