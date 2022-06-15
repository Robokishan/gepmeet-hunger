import { Box, Text } from "@chakra-ui/react";
import React, { ReactElement, useEffect, useRef } from "react";

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
  useEffect(() => {
    if (!refVideo.current) return;
    refVideo.current.srcObject = videoSrc;
  }, [videoSrc]);

  return (
    <Box>
      <video
        id={`${id}_video`}
        className="circle-vid"
        autoPlay={true}
        playsInline={true}
        muted={isLocal}
        ref={refVideo}
        style={{
          border: "2px solid red",
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
