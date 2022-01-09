import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { config } from "../config/config";
import React from "react";
import { v4 } from "uuid";
import _, { repeat } from "lodash";
import Draggable from "../draggables/Draggable";
import backgroundImage from "/public/background_home.jpg";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      participants: [],
      roomname: process.env.NODE_ENV != "production" ? "oizomtest" : "",
      room: null,
      joined: false,
      connected: false,
      roomIDError: false,
      errorMessage: "RoomId must not be empty and must be > than 4",
    };
    this.JitsiInit = this.JitsiInit.bind(this);
    this.JitsiConnect = this.JitsiConnect.bind(this);
    this.Jitsileave = this.Jitsileave.bind(this);
    this.onMeetChange = this.onMeetChange.bind(this);
    this.updateParticipantUi = this.updateParticipantUi.bind(this);
    this.connection = null;
  }

  async JoinRoom(camOn, micOn, cameraID, micID) {}

  onMeetChange(e) {
    // console.log(e.target.name,e.target.value);
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  Join(camOn, micOn, cameraID, micID) {
    this.JoinRoom(camOn, micOn, cameraID, micID).then((leave_) => {
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
  }
  Jitsileave(e) {
    e.preventDefault();
    // console.log("room",this.state.room);
    if (this.state.room) {
      // console.log("room",this.state.room);
      this.state.room.leave();
      this.setState({
        joined: false,
        connected: false,
      });
      this.connection.disconnect();
    }
  }

  updateParticipantUi(jitsiParticipants) {
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
              const el = document.getElementById(
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
            const el = document.getElementById(
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
  }

  async JitsiConnect(e) {
    e.preventDefault();

    var _roomID = this.state.roomname;
    if (this.state.roomname.length > 4) {
      try {
        this.setState({
          joined: true,
          roomIDError: false,
        });
        var room = await this.JitsiInit(_roomID, (jitsiParticipants) => {
          // updateParticipantUi(jitsiParticipants); //removed due to some stability issues
        });

        // console.log("setting",room);
        this.setState({ room: room, connected: true });
      } catch (e) {
        this.setState({ room: room, joined: false });
      }
    } else {
      this.setState({
        roomIDError: true,
      });
    }
  }
  JitsiInit(roomID, participants) {
    return new Promise((resolve, reject) => {
      let room = null;
      var localParticipant = {};
      function onDeviceListChanged(devices) {
        // console.info('current devices', devices);
      }
      const participantCallback = (room) => {
        let participants_ = room.getParticipants();
        // console.log("Participants", room.getParticipants());
        participants_.push(localParticipant);
        this.setState({ participants: participants_ });
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
      this.connection = connection;
    });
  }

  render() {
    this.updateParticipantUi(this.state.participants);
    var participants = this.state.participants.forEach((participant, index) => {
      console.log("participants", index, participant);
    });

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
              isInvalid={this.state.roomIDError}
              name="roomname"
              type="text"
              placeholder="Enter id"
              onChange={this.onMeetChange}
            />
            {this.state.roomIDError === false ? (
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
                {this.state.errorMessage}
              </Form.Text>
            )}
          </Form.Group>
          {this.state.joined === false ? (
            <Button variant="primary" type="submit" onClick={this.JitsiConnect}>
              Submit
            </Button>
          ) : (
            <Button variant="danger" type="submit" onClick={this.Jitsileave}>
              Leave
            </Button>
          )}
          {this.state.connected ? (
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
            {this.state.participants.map((participant, index) => {
              // console.log(`${index}_video_track`, `${index}_audio_track`);
              return (
                <Draggable
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
}

export default Login;
