import React, { useState, useMemo, useEffect, useRef } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import toastr from "toastr";
import PropTypes from "prop-types";
import { UpdateSpeakerInMeeting } from "../../../services/projectService";

const SpeakerDetailListModal = ({
  showspeaker,
  handleClose,
  userData,
  documentFactsDetail,
  speakers,
  setSpeakers,
  fetchMeetingData,
}) => {
  const prevSpeakerDetailsRef = useRef(null);

  const speakerDetails = useMemo(
    () =>
      Array.isArray(documentFactsDetail) &&
      documentFactsDetail.find((item) => item?.fact_name === "speakerDetails"),
    [documentFactsDetail]
  );

  useEffect(() => {
    if (speakerDetails !== prevSpeakerDetailsRef.current) {
      prevSpeakerDetailsRef.current = speakerDetails;
      const data = JSON.parse(
        speakerDetails?.fact_value_manual ||
          speakerDetails?.fact_value_ai ||
          "{}"
      );
      setSpeakers(data?.speakers || {});
    }
  }, [setSpeakers, speakerDetails]);

  const userOptions = useMemo(
    () =>
      Object.entries(userData).map(([key, value]) => ({
        label: value,
        value: key,
      })),
    [userData]
  );

  const handleOptionSelect = (id, value) => {
    setSpeakers((prevSpeakers) => ({
      ...prevSpeakers,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      data: { speakers: speakers },
    };

    const res = await UpdateSpeakerInMeeting(speakerDetails?.id, payload);

    if (res?.status) {
      fetchMeetingData();
      toastr.success(res.message || "Speaker details updated successfully");
    } else {
      toastr.warning(res?.message || "Failed to update speaker details");
    }
    handleClose();
  };

  const handleModalClose = () => {
    handleClose();
    if (speakerDetails !== prevSpeakerDetailsRef.current) {
      setSpeakers({});
    }
  };

  return (
    <Modal show={showspeaker} onHide={handleModalClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Speaker Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="transcript-model speaker-model">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Speaker Name</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(speakers)?.length > 0 ? (
              Object.entries(speakers)?.map(([id, name], index) => (
                <tr key={id}>
                  <td>{index + 1}</td>
                  <td>
                    <Form.Group>
                      <Form.Select
                        value={name}
                        onChange={(e) => handleOptionSelect(id, e.target.value)}
                      >
                        <option value="">Select a speaker</option>
                        {userOptions?.map((option) => (
                          <option key={option.value} value={+option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="text-center">
                  <h2>No Speaker Found</h2>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        {Object.entries(speakers)?.length > 0 && (
          <>
            <Button variant="secondary" onClick={handleModalClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

SpeakerDetailListModal.propTypes = {
  showspeaker: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  userData: PropTypes.object.isRequired,
  documentFactsDetail: PropTypes.array,
  speakers: PropTypes.object.isRequired,
  setSpeakers: PropTypes.func.isRequired,
};

export default SpeakerDetailListModal;
