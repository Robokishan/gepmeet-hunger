import React from "react";
import SocketManager from "../../utils/socket";

const socket = new SocketManager();
socket.connect();

const SocketContext = React.createContext(null);

export { socket, SocketContext };
