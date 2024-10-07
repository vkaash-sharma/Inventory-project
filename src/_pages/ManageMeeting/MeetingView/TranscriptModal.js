import CustomVideoPlayer from "../../../components/Common/CustomVideo/CustomVideoPlayer";
import { Modal, Button } from "react-bootstrap";
import toastr from "toastr";

const TranscriptModal = ({ showtrans, handleClose, trans , transcriptData , factsData}) => {


  const getAllText = () => {
    if (trans?.data) {
      return trans.data.map(item => item.Text).join(' '); // Join texts with a space or other delimiter
    }
    return '';
  };
   

  const handleCopy = () => {
    const allText = getAllText();
    if (allText) {
      navigator.clipboard.writeText(allText).then(() => {
        toastr.success("Text copied to clipboard!");
      }).catch(err => {
        toastr.error("Failed to copy text to clipboard.");
        console.error('Clipboard write failed:', err);
      });
    } else {
      toastr.info("No text available to copy.");
    }
  };

  return (
    <Modal show={showtrans} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Transcript</Modal.Title>
      </Modal.Header>
      <Modal.Body className="transcript-model">
       
         <div id="videoComponent">
         <CustomVideoPlayer showPlayer={false} trans={trans} factsData={factsData}/>
         </div>

      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="primary"
          onClick={handleCopy}
        >
          Copy to Clipboard
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TranscriptModal;
