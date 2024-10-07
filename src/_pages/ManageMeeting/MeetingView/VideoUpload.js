import React, { useEffect } from "react";
import { Form } from "react-bootstrap";
import { Spinner } from "react-bootstrap";
import toastr from "toastr";

const VideoUpload = ({
  form,
  error,
  onChange,
  handleRemoveFile,
  inputKey,
  s3UrlData,
  isError,
}) => {
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (s3UrlData) {
      setLoading(false);
    }
  }, [s3UrlData]);
  const { document_url } = form || {};
  const { video: videoError, description: descriptionError } = error || {};
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setLoading(false);
      return;
    }

    // Validate file type
    const validTypes = ["video/mp4", "audio/mp4", "audio/mpeg"];
    if (!validTypes.includes(file.type)) {
      toastr.warning("Please upload a valid mp3 or mp4 file");
      setLoading(false);
      return;
    }

    setLoading(true);
    onChange(e);
  };

  return (
    <div>
      <Form.Group controlId="videoUpload">
        {/* <Form.Label className="font-weight-bold">Document</Form.Label> */}
        <div className="custom-file-input-wrapper">
          <Form.Control
            key={inputKey}
            name="document"
            type="file"
            accept="video/mp4,audio/mp3"
            onChange={handleFileChange}
            isInvalid={!!videoError || isError}
            className="custom-file-input"
            disabled={loading}
          />
          {
            <>
              {loading ? (
                <div style={{ marginLeft: "-25px" }}>
                  <Spinner animation="border" size="sm" role="status" />
                </div>
              ) : (
                document_url && (
                  <></>
                  // <AiOutlineClose
                  //   size={20}
                  //   color="red"
                  //   onClick={handleRemoveFile}
                  //   className="file-remove-icon"
                  //   style={{ cursor: "pointer" }}
                  //   aria-label="Remove file"
                  // />
                )
              )}
            </>
          }
        </div>
      </Form.Group>
      <Form.Control.Feedback type="invalid">{videoError}</Form.Control.Feedback>
    </div>
  );
};

export default VideoUpload;
