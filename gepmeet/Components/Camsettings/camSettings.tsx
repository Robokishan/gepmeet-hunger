import mocker from "mocker-data-generator";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import ReactModal from "react-modal";
import styled from "styled-components";
import CloseIcon from "../../public/svg/close-modal.svg";
import { ModalStyle } from "../modal/modal";
import Video from "../Video";

export const camSettingID = "cam-settings";
const CloseBtnWrapper = styled.div`
  cursor: pointer;
`;
const UserSchema = {
  id: {
    chance: "guid",
  },
  name: {
    faker: "name.findName",
  },
  email: {
    faker: "internet.email",
  },
};

interface Props {
  joinCall: (
    camOn: boolean,
    micOn: boolean,
    cameraID: string | undefined,
    micID: string | undefined
  ) => void;
  roomID: string;
  isOpen: boolean;
  closeModal: (event: React.MouseEvent | React.KeyboardEvent) => void;
}

const CamSetting = ({ joinCall, roomID, isOpen, closeModal }: Props) => {
  const User = useMemo(
    () =>
      mocker().schema("UserSchema", UserSchema, 1).buildSync().UserSchema[0],
    []
  );
  const [vidDevices, setVidDevices] = useState<MediaDeviceInfo[]>([]);
  const [audDevices, setAudDevices] = useState<MediaDeviceInfo[]>([]);
  const [vid, setVid] = useState<MediaStream>();
  const [vidID, setVidID] = useState<string | undefined>(undefined);
  const [micID, setMicID] = useState<string | undefined>(undefined);
  const [videoOn, setVideoOn] = useState(true);
  const [audioOn, setAudioOn] = useState(true);
  const [loader, setLoader] = useState(false);
  const [vol, setVol] = useState(0);
  const vidIDref = useRef(vidID);
  const micIDref = useRef(micID);
  const audioOnref = useRef(audioOn);
  const videoOnref = useRef(videoOn);
  const vidRef = useRef(vid);
  // const interval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    vidIDref.current = vidID;

    micIDref.current = micID;
    audioOnref.current = audioOn;
    videoOnref.current = videoOn;
    vidRef.current = vid;
  }, [micID, vidID, audioOn, videoOn]);

  const selectVidID = (vidID: string) => {
    localStorage.setItem("vidID", vidID);
    setVidID(vidID);
  };

  const selectMicID = (micID: string) => {
    localStorage.setItem("micID", micID);
    setMicID(micID);
  };

  useEffect(() => {
    setLoader(false);
    function getCam() {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        setVidDevices([]);
        setAudDevices([]);
        for (const i in devices) {
          console.log(devices[i].label, vidID);
          if (devices[i].kind === "videoinput") {
            setVidID((vidID) => {
              if (!vidID) vidID = devices[i].deviceId;
              return vidID;
            });
            setVidDevices((vidDevices) => [...vidDevices, devices[i]]);
          }
          if (devices[i].kind === "audioinput") {
            setMicID((micID) => {
              if (!micID) micID = devices[i].deviceId;
              return micID;
            });
            setAudDevices((audDevices) => [...audDevices, devices[i]]);
          }
        }
      });
    }
    let frameNum: number;
    navigator.mediaDevices
      .getUserMedia({
        audio: audioOnref.current ? { deviceId: micIDref.current } : false,
        video: videoOnref.current ? { deviceId: vidIDref.current } : false,
      })
      .then((stream) => {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();
        const mediaStreamSource = audioContext.createMediaStreamSource(stream);
        const meter = window.createAudioMeter(audioContext);
        getCam();
        mediaStreamSource.connect(meter);
        function drawLoop() {
          setVol(meter.volume);
          frameNum = window.requestAnimationFrame(drawLoop);
        }
        drawLoop();
        // stream.getAudioTracks()[0]?.stop()
        // stream.getVideoTracks()[0]?.stop()
        setVid(stream);
      })
      .catch((e) => {
        console.log(e);
        getCam();
      });
    return () => {
      const tracks = vidRef.current?.getTracks();
      try {
        window.webkitCancelAnimationFrame(frameNum);
      } catch (error) {
        console.log(error);
      }
      try {
        window.cancelAnimationFrame(frameNum);
      } catch (error) {
        console.log(error);
      }
      for (const i in tracks) {
        const i_ = parseInt(i);
        tracks[i_].stop();
        tracks[i_].enabled = false;
      }
    };
  }, [vidID, roomID, micID, audioOn, videoOn]);

  return (
    <ReactModal
      ariaHideApp={false}
      isOpen={isOpen}
      id={camSettingID}
      onRequestClose={closeModal}
      contentLabel={`${camSettingID} Modal`}
      style={ModalStyle}
    >
      <>
        <CloseBtnWrapper onClick={closeModal}>
          <CloseIcon />
        </CloseBtnWrapper>
        <div className="cam-setting">
          <div className={videoOn ? "preview" : "preview long"}>
            {vid && videoOn ? (
              <Video id="preview" srcObject={vid} muted={true}></Video>
            ) : (
              <div
                className="videoPlaceholder"
                style={{ backgroundColor: "#FFAE42" }}
              >
                {User.name}
              </div>
            )}
            <div className="toolKit">
              <div
                className={videoOn ? "tool" : "tool off"}
                onClick={() => {
                  setVideoOn(!videoOn);
                }}
              >
                <span className="material-icons">
                  {videoOn ? "videocam" : "videocam_off"}
                </span>
              </div>
              <div
                className={audioOn ? "tool" : "tool off"}
                onClick={() => {
                  setAudioOn(!audioOn);
                }}
              >
                <span className="material-icons">
                  {audioOn ? "mic" : "mic_off"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="select-cont">
          <span className="material-icons">videocam</span>
          <select
            className="select"
            value={vidID}
            onChange={(e) => selectVidID(e.target.value)}
          >
            {vidDevices.map((vidDevice) => {
              return (
                <option key={vidDevice.deviceId} value={vidDevice.deviceId}>
                  {vidDevice.label}
                </option>
              );
            })}
          </select>
        </div>
        <div className="select-cont">
          <span className="material-icons">mic</span>
          <select
            className="select"
            value={micID}
            onChange={(e) => selectMicID(e.target.value)}
          >
            {audDevices.map((audDevice) => {
              return (
                <option key={audDevice.deviceId} value={audDevice.deviceId}>
                  {audDevice.label}
                </option>
              );
            })}
          </select>
        </div>
        <div className="flexCenter volMeter">
          <span className="material-icons">mic</span>
          <progress className="volMeter" value={vol * 100} max="100"></progress>
        </div>
        <div className="flexCenter">
          {loader && <div className="loader"></div>}
          {!loader && (
            <Button
              onClick={() => {
                // setLoader(true);
                joinCall(videoOn, audioOn, vidID, micID);
              }}
            >
              Join Room
            </Button>
          )}
        </div>
      </>
    </ReactModal>
  );
};

export default CamSetting;
