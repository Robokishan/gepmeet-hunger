import { Form, Button} from 'react-bootstrap'
import { config } from '../config/config.js'

function Login() {
    let room = null;

    function onDeviceListChanged(devices) {
        console.info('current devices', devices);
    }
    const participantCallback = (room) => {
        console.log("Participants", room.getParticipants());
        // participants_.unshift(localParticipant)
        // participants(participants_)
      }
    function onConnectionSuccess() {
        const confOptions = {
            openBridgeChannel: true
        };
        room = connection.initJitsiConference('conference', confOptions);
        // room.on(JitsiMeetJS.events.conference.TRACK_ADDED, onRemoteTrack);
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
        // room.on(JitsiMeetJS.events.conference.USER_JOINED, id => {
        //     console.log('user join');
        //     remoteTracks[id] = [];
        // });
        // room.on(JitsiMeetJS.events.conference.USER_LEFT, onUserLeft);
        // room.on(JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED, track => {
        //     console.log(`${track.getType()} - ${track.isMuted()}`);
        // });
        // room.on(
        //     JitsiMeetJS.events.conference.DISPLAY_NAME_CHANGED,
        //     (userID, displayName) => console.log(`${userID} - ${displayName}`));
        // room.on(
        //     JitsiMeetJS.events.conference.TRACK_AUDIO_LEVEL_CHANGED,
        //     (userID, audioLevel) => console.log(`${userID} - ${audioLevel}`));
        // room.on(
        //     JitsiMeetJS.events.conference.PHONE_NUMBER_CHANGED,
        //     () => console.log(`${room.getPhoneNumber()} - ${room.getPhonePin()}`));
        room.join();
    }
    function onConnectionFailed() {
        console.error('Connection Failed!');
        console.log('Connection Failed!');
    }
    function disconnect() {
        console.log('disconnect!');
        // connection.removeEventListener(
        //     JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
        //     onConnectionSuccess);
        // connection.removeEventListener(
        //     JitsiMeetJS.events.connection.CONNECTION_FAILED,
        //     onConnectionFailed);
        // connection.removeEventListener(
        //     JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
        //     disconnect);
    }


    const JitsiMeetJS = window.JitsiMeetJS;
    const roomID = "oizom";
    config.bosh += `?room=${roomID}`;
    var token ="abcd";
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
    const connection = new JitsiMeetJS.JitsiConnection(null, token, config);
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
  return (
    <div>
        <Form>
        <Form.Group controlId="formBasicEmail">
            <Form.Label>Id</Form.Label>
            <Form.Control type="text" placeholder="Enter id" />
            <Form.Text className="text-muted">
            We'll always share your email with everyone else.
            </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit">
            Submit
        </Button>
        </Form>
    </div>
  );
}




export default Login;
