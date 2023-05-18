import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import React, { ReactElement, useEffect, useRef, useState } from "react";

interface Props {
  id: string;
  size?: string;
  isLocal?: boolean;
  videoSrc: MediaStream;
  volume?: number;
  ref?: React.RefObject<HTMLDivElement>;
}

const color = {
  local: "#00ffaecd",
  remote: "#ff000080",
};

function MediaTrack({
  videoSrc,
  size = "150px",
  id,
  isLocal = false,
  volume = 1,
  ref,
}: Props): ReactElement {
  const refVideo = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(false);
  const onBuffer = () => setLoading(true);
  const onBufferEnd = () => setLoading(false);

  useEffect(() => {
    if (!refVideo.current) return;
    refVideo.current.srcObject = videoSrc;
    refVideo.current.onloadstart = onBuffer;
    refVideo.current.onloadedmetadata = onBufferEnd;
  }, [videoSrc]);

  // useEffect(() => {
  //   if (!refVideo.current) return;
  //   refVideo.current.volume = volume;
  // }, [volume]);

  return (
    <Box
      // just for debug
      // border={`1px solid ${isLocal ? color["local"] : color["remote"]}`}
      ref={ref}
      width={size}
      height={size}
      zIndex={10000}
      position="relative"
    >
      <video
        id={`${id}_video`}
        className="circle-vid"
        autoPlay={true}
        playsInline={true}
        muted={isLocal}
        ref={refVideo}
        style={{
          cursor: `${!isLocal && "not-allowed"}`,
          border: `2px solid ${isLocal ? color["local"] : color["remote"]}`,
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
export default React.memo(MediaTrack);
