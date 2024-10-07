import React, { useEffect, useRef } from "react";

const VideoFile = ({ src, title, hideClass, height, type , seekTo  }) => {
  const mediaRef = useRef(null);
 // Handler to seek the media to a specific time

  // Use useEffect to call seekTo when it's updated
  useEffect(() => {
    if (seekTo && mediaRef.current) {
      seekTo((time) => {
        if (mediaRef.current) {
          mediaRef.current.currentTime = time;
        }
      });
    }
  }, [seekTo]);
  return (
    <>
       <div className="video-responsive">
    {/* */}
    {!src && (
      <div className="spinner">
        <div className="spinner-border" role="status">
          {/* <span className="sr-only">Loading...</span> */}
        </div>
      </div>
    )}
    {type == "audio" ? (
      <>
        <audio
          style={{
            width: "-webkit-fill-available",
          }}
          width="100%"
          height={height}
          controls
          autoplay
          controlsList="nodownload"
          oncontextmenu="return false;"
          crossOrigin="anonymous"
          ref={mediaRef}
        >
          <source src={src} type="audio/mp3" />
        </audio>{" "}
      </>
    ) : (
      <>
        {" "}
        <video
          width="100%"
          className="zzzzzzzz"
          height={height}
          controls
          autoplay
          controlsList="nodownload"
          oncontextmenu="return false;"
          crossOrigin="anonymous"
          style={{
            width: "-webkit-fill-available",
            borderRadius: "10px",
            boxSizing: "border-box",
            padding: "-20px"
          }}
        >
          <source src={src} type="video/mp4" />
        </video>{" "}
      </>
    )}
  </div>
    </>
  )
};

export default VideoFile;
