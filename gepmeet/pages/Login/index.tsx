import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { config } from "../config/config";
import { ReactElement, useEffect, useState } from "react";
import { v4 } from "uuid";
import _, { repeat } from "lodash";
import Draggable from "../draggables/Draggable";

interface Props {}

interface State {
  participants: Array<any>;
  roomname: any; // process.env.NODE_ENV != "production" ? "oizomtest" : "",
  room: any;
  joined: boolean;
  connected: boolean;
  roomIDError: boolean;
  errorMessage: string;
}

// participants: [],
// roomname: process.env.NODE_ENV != "production" ? "oizomtest" : "",
// room: null,
// joined: false,
// connected: false,
// roomIDError: false,
// errorMessage: "RoomId must not be empty and must be > than 4",

export default function Login({}: Props): ReactElement {
  const [participants, setParticipants] = useState<Array<any>>([]);
  const [roomname, setroomname] = useState<string>(null);
  const [room, setroom] = useState(null);
  const [joined, setJoined] = useState(false);
  const [connected, setConnected] = useState(false);
  const [roomIDError, setRoomIDError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>(
    "RoomId must not be empty and must be > than 4"
  );
  const [globalConnection, setGlobalConnection] = useState(null);

  const JoinRoom = async (camOn, micOn, cameraID, micID) => {};

  const onMeetChange = (e) => {
    setroomname(e.target.value);
  };

  const Join = (camOn, micOn, cameraID, micID) => {
    JoinRoom(camOn, micOn, cameraID, micID).then((leave_) => {
      //   leave.current = leave_
      //   closeCamSettings()
      let vidKey = v4();
      let audKey = v4();
      let vidStream = null; //mediastream
      var participantsObj = {};
      //   for(let i in jitsiParticipants) {
      //     const participant = jitsiParticipants[i]
      //     let isMute = true
      //     let isVideoOff = true

      //     if(participant._tracks)
      //       for(let j = 0; j < participant._tracks.length; j++) {
      //         let track = participant._tracks[j]
      //         if(track.getType() === 'video') {
      //           isVideoOff = track.isMuted()
      //           if(!isVideoOff) {
      //             vidKey = track.getId()
      //             vidStream = track.stream
      //             const el = document.getElementById(`${participant._properties.userID}_video`)
      //             if(el && (el.srcObject !== track.stream || el.paused)) {
      //               el.srcObject = null
      //               el.srcObject = track.stream
      //               el.autoplay = true
      //               el.playsInline = true
      //               el.muted = true
      //             }
      //             setVideoContainer = (attach) => {
      //               const el = document.getElementById(`${participant._properties.userID}_video`)
      //               let element = el
      //               if(attach && element !== null)
      //                 track.attach(element)
      //               else
      //                 track.detach(element)
      //               return true
      //             }
      //           }
      //         }
      //         if(track.getType() === 'audio') {
      //           isMute = track.isMuted()
      //           if(!isMute) {
      //             const el = document.getElementById(`${participant._properties.userID}_audio`)
      //             if(el && !el.srcObject) {
      //               el.srcObject = track.stream
      //             }
      //             setAudioContainer = (attach) => {
      //               const el = document.getElementById(`${participant._properties.userID}_audio`)
      //               let element = el
      //               if(attach && element !== null)
      //                 track.attach(element)
      //               else
      //                 track.detach(element)
      //               return true
      //             }
      //             audKey = track.getId()
      //           }
      //         }
      //       }

      //     // const x = participantRef.current[participant._properties.userID]?.x
      //     // const y = participantRef.current[participant._properties.userID]?.y

      //     participantsObj[participant._properties.userID] = {
      //       x: x? x: 0,
      //       y: y? y: 0,
      //       participantID: participant._properties.userID,
      //       isMute,
      //       isVideoOff,
      //       isScreen: participant._properties.userID?.includes("_screen"),
      //       setVideoContainer,
      //       setAudioContainer,
      //       vidKey,
      //       audKey,
      //       vidStream,
      //       user: participant._properties,
      //       color: participantRef.current[participant._properties.userID]?.color || Math.floor(Math.random()*16777215).toString(16),
      //     }
      //   }
    });
  };
  const Jitsileave = (e) => {
    e.preventDefault();
    // console.log("room",this.state.room);
    if (room) {
      // console.log("room",room);
      room.leave();
      setConnected(false);
      setJoined(false);
      if (globalConnection) globalConnection.disconnect();
    }
  };

  const updateParticipantUi = (jitsiParticipants) => {
    let vidKey = v4();
    let audKey = v4();
    let vidStream = null; //mediastream
    // let participantsObj = _.cloneDeep(participants)
    for (let i in jitsiParticipants) {
      jitsiParticipants[i]._properties = {
        userID: i,
      };
      // console.log("for loop",jitsiParticipants[i]);
      const participant = jitsiParticipants[i];

      if (participant._tracks) {
        for (let j = 0; j < participant._tracks.length; j++) {
          let isMute = true;
          let isVideoOff = true;
          let track = participant._tracks[j];
          if (track.getType() === "video") {
            isVideoOff = track.isMuted();

            if (!isVideoOff) {
              vidKey = track.getId();
              vidStream = track.stream;
              const el: any = document.getElementById(
                `${participant._properties.userID}_video`
              );
              // const el = document.getElementById(`video_stream`)
              console.log("el", el);
              if (el && (el.srcObject !== track.stream || el.paused)) {
                el.srcObject = null;
                el.srcObject = track.stream;
                el.autoplay = true;
                el.playsInline = true;
                el.muted = true;
              }
              // setVideoContainer = (attach) => {
              // const el = document.getElementById(`${participant._properties.userID}_video`)
              // let element = el
              // if(attach && element !== null)
              //     track.attach(element)
              // else
              //     track.detach(element)
              // return true
              // }
            }
          }
          if (track.getType() === "audio") {
            isMute = track.isMuted();
            // console.log("isMute",isMute);

            // if(!isMute) {
            const el: any = document.getElementById(
              `${participant._properties.userID}_audio`
            );
            //   const el = document.getElementById(`audio_stream`)
            if (el && el.srcObject !== track.stream) {
              el.srcObject = track.stream;
            }
            //   setAudioContainer = (attach) => {
            //     const el = document.getElementById(`${participant._properties.userID}_audio`)
            //     let element = el
            //     if(attach && element !== null)
            //       track.attach(element)
            //     else
            //       track.detach(element)
            //     return true
            //   }
            audKey = track.getId();
            // }
          }
        }
      }
    }
  };

  const JitsiConnect = async (e) => {
    e.preventDefault();

    let _roomID = roomname;
    if (roomname.length > 4) {
      try {
        setJoined(true);
        setRoomIDError(false);
        var room = await JitsiInit(_roomID, (jitsiParticipants) => {
          // updateParticipantUi(jitsiParticipants); //removed due to some stability issues
        });

        // console.log("setting",room);
        setroom(room);
        setConnected(true);
      } catch (e) {
        setroom(room);
        setJoined(false);
      }
    } else {
      setRoomIDError(true);
    }
  };
  const JitsiInit = async (roomID, participants) => {
    return new Promise((resolve, reject) => {
      let room = null;
      var localParticipant: any = {};
      function onDeviceListChanged(devices) {
        // console.info('current devices', devices);
      }
      const participantCallback = (room) => {
        let participants_ = room.getParticipants();
        console.log("Participants", room.getParticipants());
        participants_.push(localParticipant);
        setParticipants(participants_);
        participants(participants_);
      };
      function onConnectionSuccess() {
        console.log("Connection Success!");
        const confOptions = {
          openBridgeChannel: true,
        };
        room = connection.initJitsiConference(`${roomID}`, confOptions);
        room.on(JitsiMeetJS.events.conference.TRACK_ADDED, (track) => {
          participantCallback(room);
        });
        room.on(JitsiMeetJS.events.conference.TRACK_REMOVED, (track) => {
          // console.log(`track removed!!!${track}`);
        });
        room.on(JitsiMeetJS.events.conference.USER_JOINED, (id, user) => {
          // onUserJoin(id, user)
          participantCallback(room);
        });
        room.on(JitsiMeetJS.events.conference.CONFERENCE_JOINED, () => {
          // console.log("onConferenceJoined", arguments);
          JitsiMeetJS.createLocalTracks({
            devices: ["video", "audio"],
          })
            .then((tracks) => {
              console.log("onLocalTracks", tracks);
              tracks.forEach((track) => {
                room.addTrack(track);
              });
              localParticipant._tracks = tracks;
              localParticipant.isLocal = true;
            })
            .catch((error) => {
              console.error(
                "There was an error creating the local tracks:",
                error
              );
            });
          resolve(room);
        });
        // room.on(JitsiMeetJS.events.conference.USER_LEFT, onUserLeft);
        room.on(JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED, (track) => {
          console.log(
            "TRACK_MUTE_CHANGED",
            `${track.getType()} - ${track.isMuted()}`
          );
        });
        room.on(JitsiMeetJS.events.conference.USER_LEFT, () =>
          participantCallback(room)
        );
        room.on(JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED, (track) => {
          // onTrackUpdate(track);
          participantCallback(room);
        });
        room.on(
          JitsiMeetJS.events.conference.DISPLAY_NAME_CHANGED,
          (userID, displayName) => console.log(`${userID} - ${displayName}`)
        );
        room.on(
          JitsiMeetJS.events.conference.TRACK_AUDIO_LEVEL_CHANGED,
          (userID, audioLevel) => {
            // room.setLocalParticipantProperty('name', "Kishan Joshi")
            // room.setLocalParticipantProperty('email', "princed829")
            // room.setLocalParticipantProperty('userID', 1234)
            // room.setLocalParticipantProperty('type', "participant")
          }
        );
        // room.on(
        //     JitsiMeetJS.events.conference.PHONE_NUMBER_CHANGED,
        //     () => console.log(`${room.getPhoneNumber()} - ${room.getPhonePin()}`));
        room.join();
      }
      function onConnectionFailed() {
        console.error("Connection Failed!");
      }
      function disconnect() {
        console.log("disconnect!!");

        connection.removeEventListener(
          JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
          onConnectionSuccess
        );
        connection.removeEventListener(
          JitsiMeetJS.events.connection.CONNECTION_FAILED,
          onConnectionFailed
        );
        connection.removeEventListener(
          JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
          disconnect
        );
      }

      const JitsiMeetJS = window.JitsiMeetJS;
      config.bosh += `?room=${roomID}`;
      // token ="abcd";
      const initOptions = {
        disableAudioLevels: true,
        desktopSharingChromeDisabled: false,
        desktopSharingChromeSources: ["screen", "window"],
        desktopSharingChromeMinExtVersion: "0.1",
        desktopSharingFirefoxDisabled: true,
      };
      JitsiMeetJS.init(initOptions);
      // console.log({ here: 'here', roomID })
      JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.WARN);
      const connection = new JitsiMeetJS.JitsiConnection(null, null, config);
      connection.addEventListener(
        JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
        onConnectionSuccess
      );
      connection.addEventListener(
        JitsiMeetJS.events.connection.CONNECTION_FAILED,
        onConnectionFailed
      );
      connection.addEventListener(
        JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
        disconnect
      );
      JitsiMeetJS.mediaDevices.addEventListener(
        JitsiMeetJS.events.mediaDevices.DEVICE_LIST_CHANGED,
        onDeviceListChanged
      );
      connection.connect();
      // this.connection = connection;
      setGlobalConnection(connection);
    });
  };

  useEffect(() => {
    updateParticipantUi(participants);
  }, [participants]);

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
            name="roomname"
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
        {joined === false ? (
          <Button variant="primary" type="submit" onClick={JitsiConnect}>
            Submit
          </Button>
        ) : (
          <Button variant="danger" type="submit" onClick={Jitsileave}>
            Leave
          </Button>
        )}
        {connected ? (
          <Form.Text style={{ fontSize: "20px", color: "green" }}>
            Connected!
          </Form.Text>
        ) : null}
      </Form>
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
          {participants.length > 0 &&
            participants.map((participant, index) => {
              console.log(
                participant,
                `${index}_video_track`,
                `${index}_audio_track`
              );
              return (
                <Draggable
                  key={index}
                  isLocal={participant.isLocal}
                  children={
                    <>
                      <div className="vidCont">
                        <video
                          id={`${index}_video`}
                          key={`${index}_video_track`}
                          className="circle-vid"
                          autoPlay={true}
                          playsInline={true}
                          style={{
                            position: "relative",
                            objectFit: "cover",
                            objectPosition: "center",
                            width: "128px",
                            height: "128px",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "auto",
                            transform: "rotateY(180deg)",
                          }}
                        />
                        <audio
                          id={`${index}_audio`}
                          key={`${index}_audio_track`}
                          muted={participant.isLocal}
                          autoPlay={true}
                          playsInline={true}
                          style={{
                            display: "none",
                          }}
                        />
                      </div>
                    </>
                  }
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
