import { useState } from "react";
import { Table } from "react-bootstrap";
import TranscriptModal from "./TranscriptModal";
import VideoModel from "./VedioModal";
import TextArea from "../../../components/Common/TextArea";
import Mp3orMp4 from "./Mp3orMp4";
import SpeakerDetailListModal from "./speakerDetailListModal";
import { isLoginSuperAdmin } from "../../../services/JwtAuthService";

export const Documents = ({
  meetingData,
  edit,
  userData,
  fetchMeetingData,
}) => {
  const [show, setShow] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [showtrans, setShowtrans] = useState(false);
  const [transcriptData, setTranscritData] = useState("");
  const [documentFactsDetail, setDocumentFactsDetail] = useState({});
  const [factData, setFactData] = useState(null);
  const [trans, settrans] = useState("");
  const handleClose = () => setShow(false);
  const [showspeaker, setShowspeakers] = useState(false);
  const handleTransClose = () => setShowtrans(false);
  const handleSpeakerClose = () => {
    setShowspeakers((prev) => !prev);
  };
  const [speakers, setSpeakers] = useState({});

  const handleShow = (url) => {
    setVideoUrl(url);
    setShow(true);
  };
  const handleTransShow = (trans) => {
    setShowtrans(true);
    settrans(trans);
  };
  const handlSpeakerShow = (trans) => {
    setShowspeakers(true);
  };

  const handleTransShowWithoutModel = (trans) => {
    settrans(trans);
  };
  const handleFactData = (value) => {
    setFactData(value);
  };
  return (
    <div className="attendance-table">
      <div className="d-flex justify-content-start align-items-start"></div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Document Type</th>
            <th>Document</th>
            <th>Instruction</th>
            <th>Summary</th>
          </tr>
        </thead>
        <tbody>
          {meetingData?.meetingDocumentsDetails?.map((documents, index) => (
            <tr key={documents.id}>
              <td>{index + 1}</td>
              <td>{"Recording"}</td>
              <td style={{ alignItems: "center" }}>
                <Mp3orMp4
                  setDocumentFactsDetail={setDocumentFactsDetail}
                  documents={documents}
                  handleShow={handleShow}
                  handleTransShow={handleTransShow}
                  handlSpeakerShow={handlSpeakerShow}
                  setTranscritData={setTranscritData}
                  handleTransShowWithoutModel={handleTransShowWithoutModel}
                  handleFactData={handleFactData}
                />
              </td>
              <td>
                <TextArea value={documents?.instruction || ""} />
              </td>
              <td>
                <TextArea value={documents?.chatgpt_summary || ""} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <TranscriptModal
        showtrans={showtrans}
        handleClose={handleTransClose}
        trans={trans}
        transcriptData={transcriptData}
        factsData={factData}
      />
      <SpeakerDetailListModal
        meetingData={meetingData}
        documentFactsDetail={documentFactsDetail}
        showspeaker={showspeaker}
        handleClose={handleSpeakerClose}
        userData={userData}
        speakers={speakers}
        setSpeakers={setSpeakers}
        fetchMeetingData={fetchMeetingData}
      />
      <VideoModel
        show={show}
        handleClose={handleClose}
        videoUrl={videoUrl}
        trans={trans}
        factsData={factData}
      />
    </div>
  );
};
