import React, { useEffect, useRef, useState, VideoHTMLAttributes } from "react";

type PropsType = VideoHTMLAttributes<HTMLVideoElement> & {
  srcObject: MediaStream;
  id: string;
};

export function MediaJitsi(props: {
  id: string;
  trackID: string;
  setContent?: (attach: boolean) => boolean;
  isAudio?: boolean;
  isMuted?: boolean;
  isLocal?: boolean;
  isScreen?: boolean;
}) {
  const [isLoading, setLoading] = useState(false);
  const video = (
    <video
      id={props.id}
      key={props.trackID}
      autoPlay={true}
      playsInline={true}
      className={props.isScreen ? "" : "circle-vid"}
      style={{
        position: "relative",
        objectFit: props.isScreen ? "fill" : "cover",
        objectPosition: props.isScreen ? "50% 50%" : "center",
        width: "100%",
        height: props.isScreen ? "auto" : "100%",
      }}
      data-isloading={isLoading}
    />
  );
  const audio = (
    <audio
      id={props.id}
      key={props.trackID}
      muted={props.isLocal}
      autoPlay={true}
      playsInline={true}
      style={{
        display: "none",
      }}
    />
  );
  if (!props.isAudio) return video;
  else return audio;
}

export default function Video({ srcObject, ...props }: PropsType) {
  const refVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!refVideo.current) return;
    refVideo.current.srcObject = srcObject;
    refVideo.current.autoplay = true;
  }, [srcObject]);
  return (
    <video
      ref={refVideo}
      playsInline={true}
      className="circle-vid"
      style={{
        position: "relative",
        objectFit: "cover",
        objectPosition: "center",
        width: "100%",
        height: "100%",
      }}
      {...props}
    />
  );
}
