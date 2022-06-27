import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import React, { ReactElement, useEffect, useRef, useState } from "react";

interface Props {
  id: string;
  size?: string;
  isLocal?: boolean;
  videoSrc: MediaStream;
}

export default function MediaTrack({
  videoSrc,
  size = "150px",
  id,
  isLocal = false,
}: Props): ReactElement {
  const refVideo = useRef<HTMLVideoElement>(null);

  const [loading, setLoading] = useState(false);

  const onBuffer = () => {
    setLoading(true);
    console.log("buffering");
  };
  const onBufferEnd = () => {
    setLoading(false);
    console.log("buffer ended");
  };

  useEffect(() => {
    if (!refVideo.current) return;
    refVideo.current.srcObject = videoSrc;

    refVideo.current.onloadstart = onBuffer;

    refVideo.current.onloadedmetadata = onBufferEnd;
  }, [videoSrc]);

  return (
    <Box position="relative">
      <video
        id={`${id}_video`}
        className="circle-vid"
        autoPlay={true}
        playsInline={true}
        muted={isLocal}
        ref={refVideo}
        style={{
          border: "2px solid #ff000080",
          borderRadius: "50%",
          position: "relative",
          objectFit: "cover",
          objectPosition: "center",
          width: size,
          height: size,
          backgroundRepeat: "no-repeat",
          backgroundSize: "auto",
          transform: "rotateY(180deg)",
        }}
      />
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner />
        </div>
      )}
      {/* <audio
        id={`${id}_audio`}
        muted={isLocal}
        autoPlay={true}
        playsInline={true}
        style={{
          display: "none",
        }}
      /> */}
    </Box>
  );
}
