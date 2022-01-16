import React, { useState } from "react";
import { v4 } from "uuid";
import OnlyDrag from "../draggables/onlyDrag/OnlyDrag";
import { MediaJitsi } from "../Video";

const SoundSource = () => {
  const [id] = useState(v4());
  const [x] = useState(Math.floor(Math.random() * 3200));
  const [y] = useState(Math.floor(Math.random() * 1800));
  const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const [letter] = useState(alpha[Math.floor(Math.random() * 26)]);
  const [color] = useState(Math.floor(Math.random() * 16777215).toString(16));
  const setAudio = (flag: boolean) => {
    if (flag) {
      const audio: any = document.getElementById(`${id}_audio`);
      if (audio) {
        audio.src = process.env.PUBLIC_URL + "/sound/bird-2.wav";
        audio.crossOrigin = "anonymous";
        audio.load();
        audio.loop = true;
        audio.play();
      }
      setInterval(() => {
        if (audio.paused) audio.play();
      }, 5000);
    }
    return true;
  };
  return (
    <OnlyDrag
      key={id}
      childrenKey={`${id}_audio`}
      x={x}
      y={y}
      children={
        <>
          <MediaJitsi
            videoStream={undefined}
            isMuted={false}
            trackID={id}
            id={`${id}_audio`}
            position={{ x, y }}
            isAudio={true}
            setContent={setAudio}
            isLocal={false}
            isScreen={false}
          />
          <div
            className="videoPlaceholder"
            style={{ backgroundColor: "#" + color }}
          >
            {letter}
          </div>
        </>
      }
    />
  );
};

const SoundSources = (props: { num: number }) => {
  let children: JSX.Element[] = [];
  for (let i = 0; i < props.num; i++) {
    children.push(<SoundSource key={i} />);
  }
  return <>{children}</>;
};

export default SoundSources;
