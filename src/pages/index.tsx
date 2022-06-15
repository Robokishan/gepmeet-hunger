import { Input, Text, Flex, Button } from "@chakra-ui/react";
import { Device } from "mediasoup-client";
import { Container } from "../components/Container";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import useAxiosClient from "../utils/useAxiosClient";
import { API } from "../utils/api";
import { RTPType } from "../utils/rtpTypes";
import { useContext, useEffect, useMemo, useState } from "react";
import { ArrowRightIcon } from "@chakra-ui/icons";
import {
  connectConsumerTransport,
  connectProducerTransport,
  consumeConsumer,
  createConsumerTransport,
  createProducerTransport,
  createRoom,
  produce,
  resume,
} from "../utils/voice";
import { getUserMedia } from "../utils/media";
import { Transport } from "mediasoup-client/lib/Transport";
import SocketManager from "../utils/socket";
import {
  SOCKET_NAMESPACE_ZOOMED_OUT_VIEW,
  SOCKET_CHANNEL_DEVICE_UPDATE,
} from "../utils/constant";
import { SocketContext } from "../modules/SocketProvider";
import Router from "next/router";

let device: Device;
let transport: Transport;

const Index = () => {
  Router.push("/room");
  return null;
  const [roomId, setroomId] = useState("");
  const [streamError, setStreamError] = useState("");
  const socket = useContext<SocketManager>(SocketContext);
  const body = useMemo(
    () => ({
      params: {
        roomId,
      },
    }),
    [roomId]
  );

  const { data, error, mutate } = useAxiosClient<RTPType>({
    url: API.GET_RTP_CAPABILITIES,
    method: "get",
    body,
  });

  // enable logger for mediasoup
  useEffect(() => {
    localStorage.setItem("debug", "mediasoup-client:*");
    // localStorage.setItem("debug", "");
  }, []);

  useEffect(() => {
    if (data?.router) {
      loadDevice(data.router);
    }
  }, [data, error]);

  async function loadDevice(routerRtpCapabilities) {
    try {
      device = new Device();
    } catch (error) {
      if (error.name === "UnsupportedError") {
        console.error("browser not supported");
      }
    }
    await device.load({ routerRtpCapabilities });
  }

  const connectRoom = async () => {
    try {
      if (!roomId) {
        return;
      }

      const { data } = await createProducerTransport(roomId);
      transport = device.createSendTransport(data);

      transport.on("connect", async ({ dtlsParameters }, callback, errback) => {
        try {
          const data = await connectProducerTransport(roomId, {
            dtlsParameters,
          });
        } catch (error) {
          console.error(error);
        }
        callback();
      });

      transport.on(
        "produce",
        async ({ kind, rtpParameters }, callback, errback) => {
          try {
            const { data } = await produce(
              roomId,
              transport,
              kind,
              rtpParameters
            );
            callback({ id: data.id });
          } catch (error) {
            console.error(error);
          }
        }
      );

      let stream;
      transport.on("connectionstatechange", (state) => {
        switch (state) {
          case "connecting":
            break;

          case "connected":
            document.querySelector("#local_video").srcObject = stream;
            break;

          case "failed":
            transport.close();
            break;

          default:
            break;
        }
      });

      try {
        stream = await getUserMedia(device);
        const track = stream.getVideoTracks()[0];
        const params = { track };
        await transport.produce(params);
      } catch (error) {
        console.error(error);
        setStreamError(error.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const create = async () => {
    if (roomId) {
      try {
        await createRoom(roomId);
        mutate();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const subscribe = async () => {
    try {
      const { data } = await createConsumerTransport(roomId);
      const transport = device.createRecvTransport(data);
      transport.on("connect", async ({ dtlsParameters }, callback, errback) => {
        try {
          const data = await connectConsumerTransport(roomId, {
            dtlsParameters,
          });
        } catch (error) {
          console.error(error);
        }
        callback();
      });

      transport.on("connectionstatechange", async (state) => {
        switch (state) {
          case "connecting":
            break;

          case "connected":
            document.querySelector("#remote_video").srcObject = await stream;
            resume(roomId);
            break;

          case "failed":
            transport.close();
            break;

          default:
            break;
        }
      });

      const stream = consume(transport);
    } catch (error) {
      console.error(error);
    }
  };

  async function consume(transport) {
    const { rtpCapabilities } = device;
    const { data } = await consumeConsumer(roomId, rtpCapabilities);
    const { producerId, id, kind, rtpParameters } = data;

    let codecOptions = {};
    const consumer = await transport.consume({
      id,
      producerId,
      kind,
      rtpParameters,
      codecOptions,
    });
    const stream = new MediaStream();
    stream.addTrack(consumer.track);
    return stream;
  }

  return (
    <Container height="100vh">
      <Flex margin="50px 0px 0px 0px" gap="10px">
        <Input
          variant="outline"
          placeholder="Enter Room ID"
          onChange={(e) => setroomId(e.target.value)}
        />

        <Button
          onClick={() => {
            connectRoom();
          }}
        >
          <ArrowRightIcon />
        </Button>
      </Flex>
      <Flex margin="50px 0px 0px 0px" direction="row" height="100%">
        <Flex alignItems="center" gap="50px" direction="column">
          {data?.worker && <Text>Worker ID: {data.worker}</Text>}
          {streamError && <Text color="red">{streamError}</Text>}
          <Flex>
            <Button colorScheme="messenger" rounded="button" onClick={create}>
              Create Room
            </Button>
          </Flex>
          {data?.worker && (
            <Flex
              borderRadius="20px"
              padding="10px"
              textColor="white"
              backgroundColor="black"
              maxWidth="80%"
              overflowY="scroll"
              maxHeight="400px"
            >
              <Text>{JSON.stringify(data, null, 2)}</Text>
            </Flex>
          )}
          <Flex gap="20px" alignItems="center" direction="column">
            <Text>My Video</Text>
            <video id="local_video" autoPlay controls></video>
          </Flex>

          <Flex
            direction="column"
            margin="10px 0px 100px 0px"
            gap="10px"
            alignItems="center"
          >
            <Text>Remote Video</Text>
            <Button
              onClick={() => {
                subscribe();
              }}
              variant="solid"
              colorScheme="green"
              rounded="button"
            >
              Watch
            </Button>
            <video id="remote_video" autoPlay playsInline controls></video>
          </Flex>
        </Flex>
      </Flex>
      {error && <Text color="red">Error</Text>}
      <DarkModeSwitch />
    </Container>
  );
};

export default Index;
