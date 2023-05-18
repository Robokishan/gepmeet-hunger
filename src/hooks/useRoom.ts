import { useContext, useState } from "react";
import { Consumer, ConsumerOptions } from "mediasoup-client/lib/Consumer";
import { SocketContext } from "../modules/SocketProvider";
import SocketManager from "../utils/socket";

interface Position {
  x: number;
  y: number;
}

export default function useRoom(roomId: string) {
  const socket = useContext<SocketManager>(SocketContext);
  const [consumersList, setConsumersList] = useState<
    Record<string, Array<Consumer>>
  >({});

  const [userpositions, setUserPositions] = useState<Record<string, Position>>(
    {}
  );

  const [myPosition, setMyPosition] = useState<Position>({ x: 0, y: 0 });

  const [isConnected, setIsConnected] = useState<
    "Disconnect" | "Connecting" | "Connected"
  >("Disconnect");

  const [localStream, setLocalStream] = useState<MediaStream>();
  const [userStream, setUserStream] = useState<Record<string, MediaStream>>({});

  return {
    isConnected,
    myPosition,
    userStream,
    localStream,
    userpositions,
  };
}
