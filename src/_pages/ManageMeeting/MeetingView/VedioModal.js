import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import CustomVideoPlayer from "../../../components/Common/CustomVideo/CustomVideoPlayer";

const VideoModel = ({ show, handleClose, videoUrl , trans , factsData}) => {
  const [type, setType] = useState("");

  useEffect(() => {
    if (videoUrl) {
      if (videoUrl.endsWith(".mp3"  )) {
        setType("audio");
      } else if (videoUrl.endsWith(".mp4")) {
        setType("video");
      } else {
        setType("video");
      }
    }
  }, [videoUrl]);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      className="video-modal"
      id="videoComponent"
    >
      <Modal.Header closeButton>
        <Modal.Title>{type === "audio" ? "Audio Recording" : "Video Recording"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
         <CustomVideoPlayer videoUrl={videoUrl} type={type} trans={trans} factsData={factsData} />
      </Modal.Body>
    </Modal>
  );
};

export default VideoModel;
