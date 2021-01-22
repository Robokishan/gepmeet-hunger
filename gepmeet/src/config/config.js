require('dotenv').config();

export const config = {
    hosts: {
        domain: `${process.env.REACT_APP_PUBLIC_JITSI_URL}`,
        muc: `conference.${process.env.REACT_APP_PUBLIC_JITSI_URL}`, // FIXME: use XEP-0030
        bridge: `jitsi-videobridge.${process.env.REACT_APP_PUBLIC_JITSI_URL}`,
        focus: `focus.${process.env.REACT_APP_PUBLIC_JITSI_URL}`
    },
    bosh: `//${process.env.REACT_APP_PUBLIC_JITSI_URL}/http-bind`, // FIXME: use xep-0156 for that
    websocket: `wss://${process.env.REACT_APP_PUBLIC_JITSI_URL}/xmpp-websocket`, // FIXME: use xep-0156 for that
    clientNode: `http://${process.env.REACT_APP_PUBLIC_JITSI_URL}/jitsimeet`, // The name of client node advertised in XEP-0115 'c' stanza  
}

export const confOptions = {
    openBridgeChannel: true
}