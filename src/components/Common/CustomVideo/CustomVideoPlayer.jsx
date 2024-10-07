import { useEffect, useRef, useState } from "react";
import CustomAvatar from "../CustomAvatar/CustomAvatar";
import { Button } from "react-bootstrap";
import VideoFile from "../VideoFile/VideoFile";
import { formatTimeInMin, PARSE_IMG_URL } from "../../../_helpers/helper";
import ReactPlayer from "react-player";
import { URL_CONFIG } from "../../../_contants/config/URL_CONFIG";
import { FaFileAlt } from "react-icons/fa";
import { companyAdmins } from "../../../services/UserService/UserService";
import { TextParagraph } from "../TextParagraph";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
    marginTop: "45px",
  },
  icon: {
    fontSize: "40px",
    color: "#aaa",
    marginBottom: "10px",
  },
  message: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
  },
  infoText: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#666",
  },
};

const CustomVideoPlayer = ({
  type,
  videoUrl,
  trans = [],
  showPlayer = true,
  factsData,
}) => {
  const [duration, setDuration] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const [expandedTimestamp, setExpandedTimestamp] = useState(null);
  const [speakerData, setSpeakerData] = useState([]);
  const playerRef = useRef(null);

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handlePlay = (timestampInSeconds) => {
    if (playerRef.current && playerReady) {
      const fraction = timestampInSeconds / duration;
      playerRef.current.seekTo(fraction, "fraction");
    }
  };

  useEffect(() => {
    let fetchData = async () => {
      let response = await companyAdmins();
      setSpeakerData(response.data);
    };
    fetchData();
  }, []);

  const handleReady = () => {
    setPlayerReady(true);
  };

  const handleToggleText = (index) => {
    setExpandedTimestamp(expandedTimestamp === index ? null : index);
  };

  const handleSeekTo = (time) => {
    if (playerRef.current) {
      playerRef.current.seekTo(time);
    }
  };

  const NoTranscriptMessage = () => (
    <div style={styles.container}>
      <FaFileAlt style={styles.icon} />
      <span style={styles.message}>No Transcript Present Yet</span>
      <p style={styles.infoText}>
        It looks like there are no transcripts available at the moment. Please
        check back later.
      </p>
    </div>
  );

  // Map speaker IDs to names
  const getSpeakerName = (id) => {
    const speaker = speakerData?.find((speaker) => {
      return speaker.id === +id;
    });
    return speaker
      ? `${speaker?.firstName} ${speaker?.lastName}`
      : "Unknown Speaker";
  };

  return (
    <>
      <div className={showPlayer ? `d-flex` : ""}>
        {/* Video Player */}
        {showPlayer && (
          <div className="video-container flex-grow-1">
            <>
              {type === "audio" ? (
                <VideoFile
                  src={`${PARSE_IMG_URL(URL_CONFIG.DEV_URL, videoUrl)}`}
                  title="s"
                  hideClass
                  className="full-screen-video"
                  type={type}
                  seekTo={handleSeekTo} // Pass seekTo function
                />
              ) : (
                <ReactPlayer
                  ref={playerRef}
                  url={`${PARSE_IMG_URL(URL_CONFIG.DEV_URL, videoUrl)}`}
                  controls
                  width={"100%"}
                  onDuration={handleDuration}
                  onReady={handleReady}
                  lazy
                  playsInline
                  playing={false}
                  config={{
                    file: {
                      attributes: {
                        crossOrigin: "anonymous",
                      },
                    },
                  }}
                />
              )}
            </>
          </div>
        )}
        {/* Timestamp Section */}
        <div
          className={
            showPlayer ? "timestamps-section d-flex flex-column p-3" : ""
          }
        >
          {trans?.data &&
            trans?.data?.map((item, index) => {
              const isExpanded = expandedTimestamp === index;
              const truncatedText =
                item.Text.length > 100
                  ? item.Text.slice(0, 100) + "..."
                  : item.Text;

              const speakerName = factsData
                ? getSpeakerName(factsData?.speakers[item.ID])
                : "Unknown Speaker";

              return (
                <ul key={index} className="timestamps-list mt-2">
                  <div className="d-flex align-items-center">
                    <CustomAvatar value="Speaker" />

                    <span className="speakerName">{speakerName}</span>
                    {/* START TIME Button */}
                    <div className="time-stamps-button">
                      <Button
                        variant="link"
                        className="timestamp-button"
                        onClick={() => handlePlay(item.Start)}
                      >
                        {formatTimeInMin(item.Start)}
                      </Button>
                      {/* END TIME BUTTON */}
                      <Button
                        variant="link"
                        className="timestamp-button"
                        onClick={() => handlePlay(item.End)}
                      >
                        {formatTimeInMin(item.End)}
                      </Button>
                    </div>
                  </div>
                  <div className="timestamp-text">
                    {isExpanded ? (
                      <TextParagraph text={item.Text} />
                    ) : (
                      <TextParagraph text={truncatedText} />
                    )}
                  </div>
                  <Button
                    className="see-more-button"
                    variant="link"
                    onClick={() => handleToggleText(index)}
                  >
                    {isExpanded ? "See less" : "See more"}
                  </Button>
                </ul>
              );
            })}
          {!trans?.data && (
            <>
              <NoTranscriptMessage />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomVideoPlayer;
