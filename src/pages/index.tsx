import { Input, Text, Flex, Button } from "@chakra-ui/react";
import { Device } from "mediasoup-client";
import { Container } from "../components/Container";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import useAxiosClient from "../utils/useAxiosClient";
import { API } from "../utils/api";
import { RTPType } from "../utils/rtpTypes";
import { useEffect, useMemo, useState } from "react";
import { ArrowRightIcon } from "@chakra-ui/icons";
import axiosClient from "../utils/axiosClient";
import { createProducerTransport } from "../utils/voice";

const Index = () => {
  const [roomId, setroomId] = useState("");

  let device;

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
  useEffect(() => localStorage.setItem("debug", "mediasoup-client:*"), []);

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
      console.log(data);
    } catch (error) {}
  };

  const createRoom = async () => {
    if (!roomId) {
      console.log("Room not found");
    } else {
      try {
        const { data } = await axiosClient.post(API.CREATE_ROOM, { roomId });
        console.log(data);
        mutate();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Container height="100vh">
      <Flex margin="50px 0px 0px 0px" gap="10px">
        <Input
          variant="outline"
          placeholder="Enter Room ID"
          onChange={(e) => setroomId(e.target.value)}
        />

        <Button onClick={connectRoom}>
          <ArrowRightIcon />
        </Button>
      </Flex>
      <Flex margin="50px 0px 0px 0px" direction="row" height="100%">
        <Flex alignItems="center" gap="50px" direction="column">
          {data?.worker && <Text>Worker ID: {data.worker}</Text>}

          <Flex>
            <Button
              colorScheme="messenger"
              rounded="button"
              onClick={createRoom}
            >
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
            <Text>Remote Video</Text>
            <video id="remote_video" controls></video>
          </Flex>

          <Flex margin="10px 0px 100px 0px" gap="10px" alignItems="center">
            <Button variant="solid" colorScheme="green" rounded="button">
              Watch
            </Button>
          </Flex>
        </Flex>
      </Flex>
      {error && <Text color="red">Error</Text>}
      <DarkModeSwitch />
    </Container>
  );
};

export default Index;
