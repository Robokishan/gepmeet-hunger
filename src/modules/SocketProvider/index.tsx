import React from "react";
import SocketManager from "../../utils/socket";

const socket = new SocketManager();

const SocketContext = React.createContext<SocketManager>(null);

export { socket, SocketContext };
