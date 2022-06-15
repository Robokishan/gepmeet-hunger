import { Box, Button, Flex, Text } from "@chakra-ui/react";
import jwt_decode from "jwt-decode";
import { Device } from "mediasoup-client";
import { Consumer, ConsumerOptions } from "mediasoup-client/lib/Consumer";
import { TransportOptions } from "mediasoup-client/lib/Transport";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useContext, useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import MediaTrack from "../../components/MediaTrack";
import { RoomCard } from "../../components/RoomCard";
import { useGetConversationQuery } from "../../generated/graphql";
import { SocketContext } from "../../modules/SocketProvider";
import { CookieKeys } from "../../utils/constant";
import { getCookie } from "../../utils/cookieManager";
import { getUserMedia } from "../../utils/media";
import {
  loadDevice,
  MediaSoupHandshake,
  MediaSoupSocket,
} from "../../utils/mediasoup";
import SocketManager from "../../utils/socket";

let device: Device;

type onProduceArg = {
  transportId: string;
  kind: any;
  rtpParameters: any;
};

interface RoomData {
  consumerParameters: ConsumerOptions[];
}

let mediasoupHandshake: MediaSoupHandshake = null;

export default function Room(): ReactElement {
  const router = useRouter();
  const socket = useContext<SocketManager>(SocketContext);
  const [consumers, setConsumers] = useState<Array<Consumer>>();

  const [isConnected, setIsConnected] = useState<
    "Disconnect" | "Connecting" | "Connected"
  >("Disconnect");

  const [stream, setStream] = useState<MediaStream>();

  useEffect(() => {
    console.log("Consumers", consumers);
  }, [consumers]);

  useEffect(() => {
    socket.listen(MediaSoupSocket.roomAssigned, async () => {
      setIsConnected("Connecting");
      await getRouterRtpCapabilities();
      await connectTransportToConversation();
    });

    // socket.listen(MediaSoupSocket.listenConsumers, async (data: RoomData) => {
    //   console.log(data);
    //   data.consumerParameters.forEach(async (consumerParameter) => {
    //     await mediasoupHandshake.consume(consumerParameter);
    //   });
    //   setConsumers(mediasoupHandshake.consumers);
    // });
  }, []);

  useEffect(() => init(), []);

  const [{ data, fetching, error }] = useGetConversationQuery({
    pause: !router.query.roomid,
    variables: {
      conversationid: router.query.roomid as string,
    },
  });

  const joinConversation = async () => {
    const data = await socket.request(MediaSoupSocket.startNegotiation, {
      roomId: router.query.roomid as string,
      userId: (jwt_decode(getCookie(CookieKeys.token)) as any).userId,
    });
  };

  const getRouterRtpCapabilities = async () => {
    const response: any = await socket.request(
      MediaSoupSocket.getRouterRtpCapabilities
    );
    if (response?.rtpCapabilities) {
      const { device: d } = await loadDevice((response as any).rtpCapabilities);
      device = d;
      mediasoupHandshake = new MediaSoupHandshake(device);
    }
  };

  const onTransportConnect = (type: "send" | "recv") => {
    // console.log("onTransportConnect", type);
  };

  const onTransportError = (error: any): void => {
    // console.log("onTransportError", error);
  };

  const onProduce = async ({
    kind,
    rtpParameters,
    transportId,
  }: onProduceArg) => {
    const response = await socket.request(MediaSoupSocket.produce, {
      kind,
      rtpParameters,
      transportId,
    });
    return response;
  };

  const onRecvConnectCallback = async ({
    dtlsParameters,
  }: {
    dtlsParameters: unknown;
  }) => {
    const data = await socket.request(
      MediaSoupSocket.connectConsumerTransport,
      { dtlsParameters }
    );
  };

  const onSendConnectCallback = async ({
    dtlsParameters,
  }: {
    dtlsParameters: unknown;
  }) => {
    const data = await socket.request(
      MediaSoupSocket.connectProducerTransport,
      { dtlsParameters }
    );
  };

  const connectTransportToConversation = async () => {
    const createProducerTransportResponse = await socket.request(
      MediaSoupSocket.createProducerTransport
    );
    const createConsumerTransportResponse = await socket.request(
      MediaSoupSocket.createConsumerTransport
    );
    const sendTransMeta = createProducerTransportResponse as TransportOptions;
    const recvTransMeta = createConsumerTransportResponse as TransportOptions;
    await mediasoupHandshake.start({
      sendTransMeta,
      recvTransMeta,
      onConnect: onTransportConnect,
      onError: onTransportError,
      onProduce,
      onRecvConnectCallback,
      onSendConnectCallback,
    });
  };

  const trackproduce = async () => {
    const stream = await getUserMedia();
    await mediasoupHandshake.produce(stream);
    setStream(stream);
    setIsConnected("Connected");
  };

  const trackSubcribe = async () => {
    const consumerResponse: any = await socket.request(
      MediaSoupSocket.consume,
      { rtpCapabilities: mediasoupHandshake.getrtpCapabilities() }
    );
    const consumers: Consumer[] = [];
    for (const consumerParam of consumerResponse.consumerParameters) {
      const _consumer = await mediasoupHandshake.consume(consumerParam);
      consumers.push(_consumer);
    }
    setConsumers(consumers);
    // setConsumers(mediasoupHandshake.consumers);
  };

  const init = () => {
    joinConversation();
  };

  if (fetching) return <div>Loading</div>;
  if (data)
    return (
      <Layout>
        <Text
          textAlign="center"
          fontSize="3xl"
          color={
            isConnected == "Disconnect"
              ? "red"
              : isConnected == "Connecting"
              ? "orange"
              : isConnected == "Connected"
              ? "green"
              : "black"
          }
        >
          {isConnected}
        </Text>
        <Box padding="20px">
          <Flex gap="20px">
            <Button
              disabled={isConnected !== "Connecting"}
              onClick={trackproduce}
              colorScheme="green"
            >
              Join Call
            </Button>

            <Button
              disabled={isConnected !== "Connecting"}
              onClick={trackSubcribe}
              colorScheme="green"
            >
              Subscribe
            </Button>

            <Link style={{ textDecoration: "none" }} href="/room">
              <Button colorScheme="orange">Rooms List</Button>
            </Link>
          </Flex>
          <Flex padding="20px">
            <RoomCard
              id={data.GetConversation.id}
              title={data.GetConversation.title}
              description={data.GetConversation.description}
              members={data.GetConversation.members}
            />
          </Flex>
          <Flex gap="20px" flexWrap="wrap">
            {stream && (
              <MediaTrack
                isLocal={true}
                videoSrc={stream}
                id={(jwt_decode(getCookie(CookieKeys.token)) as any).userId}
              />
            )}
            {consumers?.map((consumer) => {
              const stream = new MediaStream();
              stream.addTrack(consumer.track);
              return (
                <MediaTrack
                  id={consumer.id}
                  videoSrc={stream}
                  isLocal={false}
                  key={consumer.id}
                />
              );
            })}
          </Flex>
        </Box>
      </Layout>
    );
  if (error) return <div>error: {JSON.stringify(error)}</div>;
  return <>Loading</>;
}
