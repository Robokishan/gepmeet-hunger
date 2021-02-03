import { Form, Button} from 'react-bootstrap'
import { config } from '../config/config.js'
import React from "react";
import { v4 } from 'uuid'
import _ from 'lodash'
class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            "participants":[],
            "roomname": "oizomtest"
        }
        this.JitsiInit = this.JitsiInit.bind(this);
        this.JitsiConnect = this.JitsiConnect.bind(this);
        this.onMeetChange = this.onMeetChange.bind(this);
    }


    async JoinRoom (camOn , micOn , cameraID , micID) {
        
    }

    onMeetChange(e){
        console.log(e.target.name,e.target.value);
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    Join (camOn , micOn , cameraID , micID) {
        this.JoinRoom(camOn, micOn, cameraID, micID).then(leave_ => {
        //   leave.current = leave_
        //   closeCamSettings()
            let vidKey = v4()
            let audKey = v4()
            let vidStream = null; //mediastream
            var participantsObj = {}
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
        })
    }

    JitsiConnect(e) {
        e.preventDefault();
        var _roomID = this.state.roomname ;
        this.JitsiInit(_roomID, (jitsiParticipants)=> {
            
            let vidKey = v4()
            let audKey = v4()
            let vidStream = null; //mediastream
            // let participantsObj = _.cloneDeep(participants)
            for (let i in jitsiParticipants) {
                jitsiParticipants[i]._properties = {
                    "userID":i
                };
                
                const participant = jitsiParticipants[i];
                
                if(participant._tracks){
                    for(let j = 0; j < participant._tracks.length; j++) {
                        let isMute = true
                        let isVideoOff = true
                        let track = participant._tracks[j]
                        if(track.getType() === 'video') {
                            isVideoOff = track.isMuted()
                            
                            if(!isVideoOff) {
                                vidKey = track.getId()
                                vidStream = track.stream
                                const el = document.getElementById(`${participant._properties.userID}_video`)
                                // const el = document.getElementById(`video_stream`)
                                console.log("el",el);
                                if(el && (el.srcObject !== track.stream || el.paused)) {
                                    el.srcObject = null
                                    el.srcObject = track.stream
                                    el.autoplay = true
                                    el.playsInline = true
                                    el.muted = true
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
                        if(track.getType() === 'audio') {
                            isMute = track.isMuted()
                            if(!isMute) {
                              const el = document.getElementById(`${participant._properties.userID}_audio`)
                            //   const el = document.getElementById(`audio_stream`)
                              if(el && !el.srcObject) {
                                el.srcObject = track.stream
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
                              audKey = track.getId()
                            }
                          }
                    }
                }
            }
        });
    }
    JitsiInit(roomID, participants) {
        let room = null;
        function onDeviceListChanged(devices) {
            console.info('current devices', devices);
        }
        const participantCallback = (room) => {
            let participants_ = room.getParticipants();
            // console.log("Participants", room.getParticipants());
            // participants_.unshift(localParticipant)
            this.setState({"participants": participants_});
            participants(participants_);
        }
        function onConnectionSuccess() {
            console.log("Connection Success!");
            const confOptions = {
                openBridgeChannel: true
            };
            room = connection.initJitsiConference('conference', confOptions);
            room.on(JitsiMeetJS.events.conference.TRACK_ADDED, (track) => {
                participantCallback(room)
            });
            room.on(JitsiMeetJS.events.conference.TRACK_REMOVED, track => {
                console.log(`track removed!!!${track}`);
            });
            room.on(JitsiMeetJS.events.conference.USER_JOINED, (id , user) => {
                // onUserJoin(id, user)
                participantCallback(room)
            })
            // room.on(
            //     JitsiMeetJS.events.conference.CONFERENCE_JOINED,
            //     onConferenceJoined);
            room.on(JitsiMeetJS.events.conference.USER_JOINED, id => {
                console.log('user join');
                // remoteTracks[id] = [];
            });
            room.on(JitsiMeetJS.events.conference.CONFERENCE_JOINED, () => {
                console.log("onConferenceJoined", arguments);
                JitsiMeetJS.createLocalTracks({
                  devices: ['video', 'audio']
                }).then((tracks) => {
                  console.log("onLocalTracks", tracks);
                  tracks.forEach(track => {
                    room.addTrack(track);
                  })
                }).catch(error => {
                      console.error("There was an error creating the local tracks:", error);
                    }
                );
              });
            // room.on(JitsiMeetJS.events.conference.USER_LEFT, onUserLeft);
            room.on(JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED, track => {
                console.log(`${track.getType()} - ${track.isMuted()}`);
            });
            room.on(
                JitsiMeetJS.events.conference.DISPLAY_NAME_CHANGED,
                (userID, displayName) => console.log(`${userID} - ${displayName}`));
            room.on(
                JitsiMeetJS.events.conference.TRACK_AUDIO_LEVEL_CHANGED,
                (userID, audioLevel) => console.log(`${userID} - ${audioLevel}`));
            // room.on(
            //     JitsiMeetJS.events.conference.PHONE_NUMBER_CHANGED,
            //     () => console.log(`${room.getPhoneNumber()} - ${room.getPhonePin()}`));
            room.join();
        }
        function onConnectionFailed() {
            console.error('Connection Failed!');
        }
        function disconnect() {
            console.log('disconnect!!');
            connection.removeEventListener(
                JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
                onConnectionSuccess);
            connection.removeEventListener(
                JitsiMeetJS.events.connection.CONNECTION_FAILED,
                onConnectionFailed);
            connection.removeEventListener(
                JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
                disconnect);
        }


        const JitsiMeetJS = window.JitsiMeetJS;
        config.bosh += `?room=${roomID}`;
        // token ="abcd";
        const initOptions = {
            disableAudioLevels: true,
            desktopSharingChromeDisabled: false,
            desktopSharingChromeSources: ['screen', 'window'],
            desktopSharingChromeMinExtVersion: '0.1',
            desktopSharingFirefoxDisabled: true,
        }
        JitsiMeetJS.init(initOptions)
        console.log({ here: 'here', roomID })
        JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.WARN);
        const connection = new JitsiMeetJS.JitsiConnection(null, null, config);
        connection.addEventListener(
            JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
            onConnectionSuccess);
        connection.addEventListener(
            JitsiMeetJS.events.connection.CONNECTION_FAILED,
            onConnectionFailed);
        connection.addEventListener(
            JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
            disconnect);
        JitsiMeetJS.mediaDevices.addEventListener(
            JitsiMeetJS.events.mediaDevices.DEVICE_LIST_CHANGED,
            onDeviceListChanged);
        connection.connect();
    }

   

    render() {

        var participants = this.state.participants.forEach((participant, index)=>{
            console.log("participants",participant._properties.userID);
        });

        return (
            <div>
                <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Id</Form.Label>
                    <Form.Control name="roomname" type="text" placeholder="Enter id" onChange={this.onMeetChange} />
                    <Form.Text className="text-muted">
                    We'll always share your email with everyone else.
                    </Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit" onClick={this.JitsiConnect} > 
                    Submit
                </Button>
                </Form>
                {this.state.participants.map((participant, index)=>{
                    console.log(`${index}_video_track`, `${index}_audio_track`);
                    return ( 
                        <div>
                            <video id={`${index}_video`} key={`${index}_video_track`} autoPlay={true} playsInline={true} style={{
                                position: 'relative',
                                objectFit:  'fill',
                                objectPosition: '50% 50%',
                                width: '100%',
                                height:  '100%',
                            }} />
                            <audio id={`${index}_audio`} key={`${index}_audio_track`} autoPlay={true} playsInline={true} style={{
                                display: 'none'
                        }}/>
                </div>
                     )
                })}
                
            </div>
        );
    }
}




export default Login;
