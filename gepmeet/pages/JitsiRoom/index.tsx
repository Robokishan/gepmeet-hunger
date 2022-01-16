import mocker from "mocker-data-generator";
import { ReactElement, useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import styled from "styled-components";
import { v4 } from "uuid";
import CamSetting from "../../Components/Camsettings/camSettings";
import { MediaJitsi } from "../../Components/Video";
import { JitsiInit, User } from "../../utils/jitsi8x8";
import Draggable from "../draggables/Draggable";
import _ from "lodash";

const SubmitBtnWrapper = styled.div`
  margin: 10px 0px;
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

export const JitsiRoom = (): ReactElement => {
  const defaultUser = mocker().schema("UserSchema", UserSchema, 1).buildSync();
  const [isModalOpen, setModalOpen] = useState(false);
  const [participants, setParticipants] = useState<{
    [id: string]: {
      x: number;
      y: number;
      participantID: string;
      isMute: boolean;
      isVideoOff: boolean;
      color: string;
      isScreen: boolean;
      setVideoContainer: (attach: boolean) => boolean;
      setAudioContainer: (attach: boolean) => boolean;
      vidStream: MediaStream | undefined;
      vidKey: string;
      audKey: string;
      user: {
        name: string;
        email: string;
        userID: string;
      };
    };
  }>({});

  const [roomId, setroomname] = useState<string>(null);
  const [room, setroom] = useState(null);
  const [joined, setJoined] = useState(false);
  const [connected, setConnected] = useState(false);
  const [roomIDError, setRoomIDError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>(
    "RoomId must not be empty and must be > than 4"
  );
  const [user, setUser] = useState<User>(defaultUser.UserSchema[0]);
  const [globalConnection, setGlobalConnection] = useState(null);
  let leave = useRef<Function>(() => {});
  const participantRef = useRef(participants);
  useEffect(() => {
    participantRef.current = participants;
  }, [participants]);

  const Join = (
    camOn: boolean,
    micOn: boolean,
    cameraID: string | undefined,
    micID: string | undefined
  ) => {
    if (isValidRoom())
      JoinRoom(camOn, micOn, cameraID, micID).then((leave_) => {
        leave.current = leave_;
      });
  };

  const JoinRoom = async (camOn, micOn, cameraID, micID) => {
    let leave: Function;
    return new Promise(async (resolve) => {
      // getroomid
      leave = await JitsiInit(
        null,
        user,
        roomId,
        camOn,
        micOn,
        cameraID,
        micID,
        (jitsiParticipants) => {
          let participantsObj = _.cloneDeep(participants);
          let vidKey = v4();
          let audKey = v4();
          let vidStream: MediaStream | undefined = undefined;
          participantsObj = {};
          for (let i in jitsiParticipants) {
            const participant = jitsiParticipants[i];
            let isMute = true;
            let isVideoOff = true;
            let setVideoContainer = (_attach: boolean) => false;
            let setAudioContainer = (_attach: boolean) => false;
            if (participant._tracks)
              for (let j = 0; j < participant._tracks.length; j++) {
                let track = participant._tracks[j];
                if (track.getType() === "video") {
                  isVideoOff = track.isMuted();
                  if (!isVideoOff) {
                    vidKey = track.getId();
                    vidStream = track.stream;
                    const el: any = document.getElementById(
                      `${participant._properties.userID}_video`
                    );
                    if (el && (el.srcObject !== track.stream || el.paused)) {
                      el.srcObject = null;
                      el.srcObject = track.stream;
                      el.autoplay = true;
                      el.playsInline = true;
                      el.muted = true;
                    }
                    setVideoContainer = (attach: boolean) => {
                      const el: any = document.getElementById(
                        `${participant._properties.userID}_video`
                      );
                      let element: HTMLVideoElement = el;
                      if (attach && element !== null) track.attach(element);
                      else track.detach(element);
                      return true;
                    };
                  }
                }
                if (track.getType() === "audio") {
                  isMute = track.isMuted();
                  if (!isMute) {
                    const el: any = document.getElementById(
                      `${participant._properties.userID}_audio`
                    );
                    if (el && !el.srcObject) {
                      el.srcObject = track.stream;
                    }
                    setAudioContainer = (attach: boolean) => {
                      const el: any = document.getElementById(
                        `${participant._properties.userID}_audio`
                      );
                      let element: HTMLVideoElement = el;
                      if (attach && element !== null) track.attach(element);
                      else track.detach(element);
                      return true;
                    };
                    audKey = track.getId();
                  }
                }
              }

            const x = participantRef.current[participant._properties.userID]?.x;
            const y = participantRef.current[participant._properties.userID]?.y;
            // if(participant._properties.userID?.includes("_screen")) {
            //   console.log(participant._tracks)
            // }
            participantsObj[participant._properties.userID] = {
              x: x ? x : 0,
              y: y ? y : 0,
              participantID: participant._properties.userID,
              isMute,
              isVideoOff,
              isScreen: participant._properties.userID?.includes("_screen"),
              setVideoContainer,
              setAudioContainer,
              vidKey,
              audKey,
              vidStream,
              user: participant._properties,
              color:
                participantRef.current[participant._properties.userID]?.color ||
                Math.floor(Math.random() * 16777215).toString(16),
            };
          }
          setParticipants(participantsObj);
        }
      );
      resolve(leave);
      closeModal();
    });
  };

  const onMeetChange = (e) => {
    setroomname(e.target.value);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const leaveMeeting = () => {
    leave.current();
    setConnected(false);
    setJoined(false);
    if (globalConnection) globalConnection.disconnect();
  };

  const Jitsileave = (e) => {
    e.preventDefault();
    leaveMeeting();
  };

  useEffect(() => {
    return () => leaveMeeting();
  }, []);

  useEffect(() => {
    console.log(participants);
  }, [participants]);

  const isValidRoom = () => {
    if (roomId?.length > 4) {
      try {
        setJoined(true);
        setRoomIDError(false);
        setConnected(true);
        return true;
      } catch (e) {
        setroom(room);
        setJoined(false);
        return false;
      }
    } else {
      setRoomIDError(true);
      return false;
    }
  };

  const JitsiConnect = async (e) => {
    e.preventDefault();
    isValidRoom();
  };

  return (
    <div>
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Id</Form.Label>
          <Form.Control
            style={{
              width: "75%",
              textAlign: "center",
              margin: "auto",
            }}
            isInvalid={roomIDError}
            name="roomId"
            type="text"
            placeholder="Enter id"
            onChange={onMeetChange}
          />
          {roomIDError === false ? (
            <Form.Text className="text-muted">
              We'll always share your email with everyone else.
            </Form.Text>
          ) : (
            <Form.Text
              style={{
                color: "red",
                fontSize: "20px",
              }}
            >
              {errorMessage}
            </Form.Text>
          )}
        </Form.Group>
        <SubmitBtnWrapper>
          {joined === false ? (
            <Button variant="outline-dark" type="submit" onClick={JitsiConnect}>
              Submit
            </Button>
          ) : (
            <Button variant="danger" type="submit" onClick={Jitsileave}>
              Leave
            </Button>
          )}
        </SubmitBtnWrapper>
        {connected ? (
          <Form.Text style={{ fontSize: "20px", color: "green" }}>
            Connected!
          </Form.Text>
        ) : null}
      </Form>
      {joined === false && (
        <Button variant="dark" onClick={() => setModalOpen(true)}>
          Open
        </Button>
      )}
      {isModalOpen === true && (
        <CamSetting
          closeModal={closeModal}
          isOpen={isModalOpen}
          roomID={roomId}
          joinCall={Join}
        />
      )}
      <div className="canvasContainer" id="canvasContainer">
        <div
          className="canvas"
          id="canvas"
          style={{
            margin: "10px",
            textAlign: "center",
            marginRight: "10px",
            marginBottom: "10px",
            border: "cyan",
            borderStyle: "dotted",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundImage: `url(background_home.jpg)`,
            width: 2160,
            height: 2160,
            position: "absolute",
          }}
        >
          {Object.keys(participants).map((key, index) => {
            return (
              <Draggable
                key={index}
                isLocal={true}
                children={
                  <>
                    <MediaJitsi
                      trackID={participants[key].vidKey}
                      id={`${participants[key].participantID}_video`}
                      isAudio={false}
                    />
                    <MediaJitsi
                      isMuted={participants[key].isLocal}
                      trackID={participants[key].audKey}
                      id={`${participants[key].participantID}_audio`}
                      isAudio={true}
                    />
                  </>
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
