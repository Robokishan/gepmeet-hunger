require('dotenv').config();



export const config = {
    hosts: {
        domain: `${process.env.REACT_APP_DOMAIN_NAME}`,
        muc:`muc.${process.env.REACT_APP_DOMAIN_NAME}`,
        bridge: `jitsi-videobridge.${process.env.REACT_APP_DOMAIN_NAME}`,
        focus: `focus.${process.env.REACT_APP_DOMAIN_NAME}`
    },
    externalConnectUrl: `https://${process.env.REACT_APP_PUBLIC_JITSI_URL}/http-pre-bind`,
    useStunTurn: true, // use XEP-0215 to fetch TURN servers for the JVB connection
    useTurnUdp: true,
    bosh: `https://${process.env.REACT_APP_PUBLIC_JITSI_URL}/http-bind`, // FIXME: use xep-0156 for that
    websocket: `wss://${process.env.REACT_APP_PUBLIC_JITSI_URL}/xmpp-websocket`, // FIXME: use xep-0156 for that
    clientNode: `http://jitsi.org/jitsimeet`, // The name of client node advertised in XEP-0115 'c' stanza  
}

export const confOptions = {
    openBridgeChannel: true
}