import { Box, Button, Flex, Text, toast, useToast } from "@chakra-ui/react";
import jwt_decode from "jwt-decode";
import { Device } from "mediasoup-client";
import { Consumer, ConsumerOptions } from "mediasoup-client/lib/Consumer";
import { Transport, TransportOptions } from "mediasoup-client/lib/Transport";
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

interface CreateConsumerArg {
  consumerParameters: Record<string, Array<ConsumerOptions>>;
}

let mediasoupHandshake: MediaSoupHandshake = null;

export default function Room(): ReactElement {
  const toast = useToast();
  const router = useRouter();
  const socket = useContext<SocketManager>(SocketContext);
  const [consumersList, setConsumersList] = useState<
    Record<string, Array<Consumer>>
  >({});

  const [isConnected, setIsConnected] = useState<
    "Disconnect" | "Connecting" | "Connected"
  >("Disconnect");

  const [stream, setStream] = useState<MediaStream>();

  const onStopStream = () => {
    if (stream) {
      for (const track of stream?.getTracks()) {
        track?.stop();
      }
      setStream(null);
    }
  };

  useEffect(() => {
    socket.listen(MediaSoupSocket.roomAssigned, async () => {
      setIsConnected("Connecting");
      await getRouterRtpCapabilities();
      await connectTransportToConversation();
    });

    socket.listen(
      MediaSoupSocket.listenConsumers,
      async (consumerResponse: CreateConsumerArg) => {
        addConsumers(consumerResponse);
      }
    );
    socket.listen("newuserjoin", async (data: any) => {
      const { producerId, userId } = data;
      const response: CreateConsumerArg = (await socket.request(
        MediaSoupSocket.consumeUser,
        {
          userId,
          producerIds: [producerId],
          rtpCapabilities: mediasoupHandshake.getrtpCapabilities(),
        }
      )) as any;

      addConsumers(response);
    });
    socket.listen("notifyuserentered", async (data: any) => {
      toast({
        position: "top-right",
        title: `New User Joined`,
        description: data?.name,
        status: "success",
        isClosable: true,
        duration: 3000,
      });
    });
  }, []);

  useEffect(() => {
    socket.listen("userleft", (data: any) => {
      toast({
        position: "top-right",
        title: "User Left",
        description: data?.name,
        status: "warning",
        isClosable: true,
        duration: 3000,
      });
      removeConsumers(data.userId);
    });
    return () => {
      socket.socket.off("userleft");
    };
  }, [consumersList]);

  useEffect(() => {
    joinRoom();
  }, []);

  const {
    data,
    loading: fetching,
    error,
  } = useGetConversationQuery({
    skip: !router.query.roomid,
    variables: {
      conversationid: router.query.roomid as string,
    },
  });

  const joinRoom = async () => {
    const data = await socket.request(MediaSoupSocket.startNegotiation, {
      roomId: router.query.roomid as string,
      userId: (jwt_decode(getCookie(CookieKeys.token)) as any).userId,
    });
    // tood: check if room allocated if not then start again
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
    try {
      await mediasoupHandshake.start({
        sendTransMeta,
        recvTransMeta,
        onConnect: onTransportConnect,
        onError: onTransportError,
        onProduce,
        onRecvConnectCallback,
        onSendConnectCallback,
        Connect: trackproduce,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const trackproduce = async () => {
    const stream = await getUserMedia();
    await mediasoupHandshake.produce(stream);
    setStream(stream);
    setIsConnected("Connected");
    trackSubcribe();
  };

  const trackSubcribe = async () => {
    const consumerResponse: CreateConsumerArg = (await socket.request(
      MediaSoupSocket.consume,
      {
        rtpCapabilities: mediasoupHandshake.getrtpCapabilities(),
      }
    )) as any;
    addConsumers(consumerResponse);
  };

  const addConsumers = async (consumerResponse: CreateConsumerArg) => {
    const _consumers: Record<string, Array<Consumer>> = {};
    for (const key in consumerResponse.consumerParameters) {
      const consumerRequest = [];
      for (const consumer of consumerResponse.consumerParameters[key]) {
        consumerRequest.push(mediasoupHandshake.consume(consumer));
      }
      _consumers[key] = await Promise.all(consumerRequest);
      setConsumersList((prevuid) => {
        let _prevConsumers = prevuid[key] ?? [];
        let newConsumerlist = {
          ...prevuid,
          [key]: [..._prevConsumers, ..._consumers[key]],
        };
        return newConsumerlist;
      });
    }
  };

  const leaveRoom = () => {
    socket.request("leaveroom");
    socket.socket.removeAllListeners();
    mediasoupHandshake.disconnect();
    setConsumersList({});
    onStopStream();
    router.push("/room");
  };

  const removeConsumers = async (userId: string) => {
    if (userId && consumersList[userId]) {
      consumersList[userId].forEach((consumer) => consumer.close());
      setConsumersList((prevConsumer) => {
        const _temp_copy = { ...prevConsumer };
        delete _temp_copy[userId];
        return _temp_copy;
      });
    }
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
              disabled={isConnected != "Connected"}
              onClick={leaveRoom}
              colorScheme="red"
            >
              Leave
            </Button>

            {/* <Link style={{ textDecoration: "none" }} href="/room">
              <Button colorScheme="orange">Rooms List</Button>
            </Link> */}
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
            {Object.keys(consumersList)?.map((uid) => {
              const consumer = consumersList[uid];
              const stream = new MediaStream();
              consumer.forEach((_con) => stream.addTrack(_con.track));
              return (
                <MediaTrack
                  id={uid}
                  videoSrc={stream}
                  isLocal={false}
                  key={uid}
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
