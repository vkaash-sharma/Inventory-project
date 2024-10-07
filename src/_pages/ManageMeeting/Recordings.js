import { useState } from "react";
import { Button, Table, Form, FormGroup } from "react-bootstrap";
import VideoUpload from "./MeetingView/VideoUpload";
import { uploadFileOnS3New } from "../../services/S3Service";
import Mp3orMp4 from "./MeetingView/Mp3orMp4";
import TranscriptModal from "./MeetingView/TranscriptModal";
import VideoModel from "./MeetingView/VedioModal";
import { isSupportedFileType } from "../../_helpers/helper";
import toastr from "toastr";
import Scrollbars from "react-custom-scrollbars-2";
import SpeakerDetailListModal from "./MeetingView/speakerDetailListModal";
import { uuidv } from "../../_helpers/generateUniqueID";
import { CgRemove } from "react-icons/cg";

export const Recordings = ({
  onSubmit,
  meetingData,
  fetchMeetingData,
  recordings,
  setRecordings,
  edit,
}) => {
  const [s3UrlData, sets3UrlData] = useState("");
  const [show, setShow] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [showtrans, setShowtrans] = useState(false);
  const [trans, settrans] = useState("");
  const [errors, setErrors] = useState([]);
  const [setTranscritData] = useState("");
  const [documentFactsDetail, setDocumentFactsDetail] = useState({});
  const [showspeaker, setShowspeakers] = useState(false);
  const [userData, setUserData] = useState([]);
  const [speakers, setSpeakers] = useState({});

  const handleAddRecording = () => {
    setRecordings([
      ...recordings,
      { id: uuidv(), document_url: null, instruction: "", deleted: 0 },
    ]);
  };

  const handleClose = () => setShow(false);
  const handleTransClose = () => setShowtrans(false);

  const handleRemoveRecording = (id) => {
    const newRecordings = recordings?.filter(
      (recording) => recording.id !== id
    );
    setRecordings(newRecordings);
    setErrors(errors.filter((error) => error.id !== id));
  };

  const handleFileChange = async (id, event) => {
    sets3UrlData("");
    const file = event.target.files[0];
    let checkFileType = isSupportedFileType(file.type);
    if (!checkFileType) {
      toastr.error("mp3/mp4 Files are Only Allowed.");
      return;
    }
    const s3UrlData = await uploadFileOnS3New(
      file,
      file.type,
      "companies",
      "document_url"
    );
    sets3UrlData(s3UrlData);
    const newRecordings = recordings.map((recording) =>
      recording.id === id
        ? { ...recording, document_url: s3UrlData?.s3Url }
        : recording
    );
    setRecordings(newRecordings);
    if (errors.find((error) => error.id === id)?.document_url) {
      const newErrors = errors.map((error) =>
        error.id === id ? { ...error, document_url: "" } : error
      );
      setErrors(newErrors);
    }
  };

  const handleInstructionChange = (id, event) => {
    const instruction = event.target.value;

    setRecordings((prevRecordings) =>
      prevRecordings.map((recording) =>
        recording.id === id ? { ...recording, instruction } : recording
      )
    );

    setErrors((prevErrors) =>
      prevErrors.map((error) =>
        error.id === id && error.instruction
          ? { ...error, instruction: "" }
          : error
      )
    );
  };

  const handleRemoveFile = (id) => {
    const newRecordings = recordings.map((recording) =>
      recording.id === id ? { ...recording, document_url: "" } : recording
    );
    setRecordings(newRecordings);
  };

  const handleTransShowWithoutModel = (trans) => {
    settrans(trans);
  };

  const onSubmitHandle = (event) => {
    event.preventDefault();
    const newErrors = recordings.map((recording) => ({
      id: recording.id,
      document_url:
        !recording.document_url && recording.deleted !== 1
          ? "Recording file is required"
          : "",
      instruction:
        !recording.instruction.trim() && recording.deleted !== 1
          ? "Instruction is required"
          : "",
    }));
    const hasErrors = newErrors.some(
      (error) => error.document_url || error.instruction
    );

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }
    if (recordings?.filter((el) => el.deleted == 0)?.length == 0) {
      toastr.warning("Please add at least one document");
      return;
    }
    setErrors([]);
    onSubmit(event, "Documents");
  };

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
  const handleSpeakerClose = () => {
    setShowspeakers((prev) => !prev);
  };
  return (
    <Form onSubmit={onSubmitHandle}>
      <Table bordered>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Recording File</th>
            <th>Recording Instruction</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {recordings
            ?.filter((recording) => +recording.deleted !== 1)
            ?.map((recording, index) => (
              <tr key={recording.id}>
                <td>{index + 1}</td>
                <td>
                  {recording?.viewIcon && recording?.document_url ? (
                    <>
                      <Mp3orMp4
                        setDocumentFactsDetail={setDocumentFactsDetail}
                        documents={recording}
                        handleShow={handleShow}
                        handleTransShow={handleTransShow}
                        setTranscritData={setTranscritData}
                        handleTransShowWithoutModel={
                          handleTransShowWithoutModel
                        }
                        handlSpeakerShow={handlSpeakerShow}
                      />
                    </>
                  ) : (
                    <>
                      <VideoUpload
                        form={{ document_url: recording.document_url }}
                        error={{ video: "" }}
                        onChange={(event) =>
                          handleFileChange(recording.id, event)
                        }
                        handleRemoveFile={() => handleRemoveFile(recording.id)}
                        inputKey={`file-${recording.id}`}
                        s3UrlData={s3UrlData}
                        isError={
                          !!errors.find((error) => error.id === recording.id)
                            ?.document_url
                        }
                      />
                      {errors.find((error) => error.id === recording.id)
                        ?.document_url && (
                        <Form.Control.Feedback
                          type="invalid"
                          className="d-block"
                        >
                          {
                            errors.find((error) => error.id === recording.id)
                              .document_url
                          }
                        </Form.Control.Feedback>
                      )}
                    </>
                  )}
                </td>

                <div className="addFileDescription">
                  <label className="form-label">Recording Instruction</label>
                  <FormGroup>
                    <Form.Control
                      as="textarea"
                      value={recording.instruction}
                      onChange={(event) =>
                        handleInstructionChange(recording.id, event)
                      }
                      placeholder="Enter recording instruction"
                      style={{ height: "150px" }}
                      isInvalid={
                        !!errors.find((error) => error.id === recording.id)
                          ?.instruction
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {
                        errors.find((error) => error.id === recording.id)
                          ?.instruction
                      }
                    </Form.Control.Feedback>
                  </FormGroup>
                </div>
                <td>
                  <Button
                    onClick={() => handleRemoveRecording(recording.id)}
                    variant="danger"
                    className="closeIconBtn"
                  >
                    {/* <CgRemove /> */}
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <TranscriptModal
        showtrans={showtrans}
        handleClose={handleTransClose}
        trans={trans}
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
      />
      <div className="addMoreAction">
        <Button
          onClick={handleAddRecording}
          variant="link"
          className="add-btn-link"
        >
          Add More{" "}
        </Button>
      </div>

      <div className="companyDetailsBtmAction">
        {edit ? (
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        ) : (
          <button type="submit" style={{ display: "none" }}>
            Submit
          </button>
        )}
      </div>
    </Form>
  );
};
