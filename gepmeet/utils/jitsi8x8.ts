import { config } from "../config";

export type JitsiTrack = {
  isLocal: () => boolean;
  getType: () => "video" | "audio";
  attach: (container: HTMLElement) => void;
  detach: (container: HTMLElement) => void;
  getParticipantId: () => string;
  mute: () => Promise<void>;
  unmute: () => Promise<void>;
  isMuted: () => boolean;
  getId: () => string;
  stream: MediaStream;
};

export type User = {
  id: string;
  name: string;
  email: string;
};

export type JitsiParticipant = {
  _properties: {
    name: string;
    email: string;
    userID: string;
  };
  isLocal: boolean | undefined;
  _tracks: undefined | JitsiTrack[];
};

export let setMute = async (flag: boolean) => {};
export let isMute = false;
export let isCamOff = false;
export let setVideoMute = async (flag: boolean) => {};
export let screenShare = async (flag: boolean) => {};
export let stopScreenShare: Function | undefined = undefined;
export function JitsiInit(
  token: string,
  user: User,
  roomID: string,
  camOn: boolean,
  micOn: boolean,
  camID: string | undefined,
  micID: string | undefined,
  participants: (participants: JitsiParticipant[]) => void,
  isScreen = false
): Promise<Function> {
  roomID = roomID.toLocaleLowerCase();
  screenShare = async (flag: boolean) => {
    if (flag && !stopScreenShare) {
      stopScreenShare = await JitsiInit(
        token,
        user,
        roomID,
        false,
        false,
        "",
        "",
        () => {},
        true
      );
    } else if (!flag && stopScreenShare) {
      stopScreenShare();
      stopScreenShare = undefined;
    }
  };
  if (!isScreen) {
    isMute = !micOn;
    isCamOff = !camOn;
  }
  config.bosh += `?room=${roomID}`;
  const JitsiMeetJS = window.JitsiMeetJS;
  JitsiMeetJS.init({ disableAudioLevels: false });
  console.log({ here: "here", roomID });
  JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.WARN);
  let localParticipant: JitsiParticipant = {
    _properties: {
      email: user.email,
      name: user.name,
      userID: user.id,
    },
    isLocal: true,
    _tracks: undefined,
  };
  // config.websocket = `${config.websocket}?room=${roomID}&token=${token}`
  const connection = new JitsiMeetJS.JitsiConnection(null, token, config);
  const confOptions = {
    openBridgeChannel: false,
  };
  let room: any;
  const participantCallback = (room: any) => {
    const participants_: JitsiParticipant[] = room.getParticipants();
    participants_.unshift(localParticipant);
    participants(participants_);
  };
  connection.addEventListener(
    JitsiMeetJS.events.connection.CONNECTION_FAILED,
    () => console.log("Failed to connect.")
  );
  return new Promise((resolve, reject) => {
    connection.addEventListener(
      JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
      () => {
        room = connection.initJitsiConference(`${roomID}`, confOptions);
        room.on(
          JitsiMeetJS.events.conference.USER_JOINED,
          (id: string, user: any) => {
            // onUserJoin(id, user)
            participantCallback(room);
          }
        );
        room.on(
          JitsiMeetJS.events.conference.TRACK_ADDED,
          (track: JitsiTrack) => {
            // const participants: JitsiParticipant[] = room.getParticipants()
            // console.log(participants[0]?._properties?.email)
            // onTrackUpdate(track)
            participantCallback(room);
          }
        );
        room.on(
          JitsiMeetJS.events.conference.TRACK_REMOVED,
          (track: JitsiTrack) => {
            console.log(`track removed!!!${track}`);
          }
        );
        room.on(JitsiMeetJS.events.conference.CONFERENCE_JOINED, () => {
          const pinger = setInterval(() => {
            participantCallback(room);
          }, 1500);
          if (!isScreen) {
            JitsiMeetJS.createLocalTracks({
              devices: ["audio", "video"],
              cameraDeviceId: camID,
              micDeviceId: micID,
            }).then(async (tracks: JitsiTrack[]) => {
              for (let i in tracks) {
                const muteFunc = async (flag: boolean) => {
                  if (flag) await tracks[i].mute();
                  else await tracks[i].unmute();
                };
                if (tracks[i].getType() === "audio") {
                  if (!micOn) tracks[i].mute();
                  setMute = muteFunc;
                } else if (tracks[i].getType() === "video") {
                  if (!camOn) tracks[i].mute();
                  setVideoMute = muteFunc;
                }
                room.addTrack(tracks[i]);
              }
              localParticipant._tracks = tracks;
              participantCallback(room);
            });
            resolve(() => {
              clearInterval(pinger);
              room.leave();
            });
          } else {
            let screen: JitsiTrack;
            JitsiMeetJS.createLocalTracks({
              devices: ["desktop"],
              desktopSharingFrameRate: { min: 20, max: 30 },
              constraints: {
                height: {
                  ideal: 720,
                  max: 720,
                  min: 180,
                },
              },
            })
              .then((tracks: JitsiTrack[]) => {
                for (let i in tracks) {
                  room.addTrack(tracks[i]);
                  screen = tracks[i];
                }
                resolve(() => {
                  clearInterval(pinger);
                  screen.stream?.getVideoTracks()[0]?.stop();
                  room.leave();
                });
              })
              .catch((e: any) => {
                console.log(e);
                clearInterval(pinger);
                room.leave();
                reject(e);
              });
          }
        });
        room.on(JitsiMeetJS.events.conference.USER_LEFT, () =>
          participantCallback(room)
        );
        room.on(
          JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED,
          (track: JitsiTrack) => {
            // onTrackUpdate(track);
            participantCallback(room);
          }
        );
        room.on(JitsiMeetJS.events.track.CONSTRAINT_FAILED, (e: any) =>
          console.log(e)
        );
        room.on(
          JitsiMeetJS.events.conference.DISPLAY_NAME_CHANGED,
          (id: string, name: string) => {
            console.log(`Name changed for ${id} : ${name}`);
          }
        );
        room.on(
          JitsiMeetJS.events.conference.TRACK_AUDIO_LEVEL_CHANGED,
          (userID: string, audioLevel: number) => {}
        );
        if (!isScreen) {
          room.setLocalParticipantProperty("name", user.name);
          room.setLocalParticipantProperty("email", user.email);
          room.setLocalParticipantProperty("userID", user.id);
          room.setLocalParticipantProperty("type", "participant");
        } else {
          room.setLocalParticipantProperty("name", user.name + "_screen");
          room.setLocalParticipantProperty("email", user.email);
          room.setLocalParticipantProperty("userID", user.id + "_screen");
          room.setLocalParticipantProperty("type", "screen");
        }
        room.join();
      }
    );
    connection.connect();
  });
}
