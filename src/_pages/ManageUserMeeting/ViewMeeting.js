import CustomVideoPlayer from "../../components/Common/CustomVideo/CustomVideoPlayer";
import { Table } from "react-bootstrap";

export const ViewMeeting = ({ videoData }) => {

  const handleSpeakerNames = (array) => {
    const speakerFact = array?.meetingsDocumentFactsDetail.find(fact => 
      fact.fact_name && fact.fact_name==="speakerDetails"
    );
    if (speakerFact) {
      // Process the fact_value_ai for speakers if it exists
      return JSON.parse(speakerFact?.fact_value_manual || speakerFact?.fact_value_ai);
    }
  }
  return (
    <>
      <Table striped bordered hover className="mb-0">
        {/* <thead>
          <tr>
          </tr>
          <tr>
            <th style={{ alignItems: "center" }}></th>
          </tr>
        </thead> */}
        <tbody>
          {videoData?.map((data, index) => (
            <tr key={index}  id="videoComponent">
              <td colSpan="2">
                <CustomVideoPlayer type={"vedio"} videoUrl={data.document_url} trans={data?.video_translate ? JSON.parse(data?.video_translate): null} factsData={handleSpeakerNames(data)} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};
