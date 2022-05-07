import { Link as ChakraLink, Text, Flex, Button, Box } from "@chakra-ui/react";
import { Device } from "mediasoup-client";
import { Container } from "../components/Container";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import useAxiosClient from "../utils/useAxiosClient";
import { API } from "../utils/api";
import { RTPType } from "../utils/rtpTypes";
import { useEffect } from "react";

const Index = () => {
  let device;

  const { data, isLoading } = useAxiosClient<RTPType>({
    url: API.GET_RTP_CAPABILITIES,
    method: "get",
  });

  useEffect(() => localStorage.setItem("debug", "mediasoup-client:*"), []);

  useEffect(() => {
    if (data?.router) {
      loadDevice(data.router);
    }
  }, [data, isLoading]);

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

  return (
    <Container height="100vh">
      <Flex margin="50px 0px 0px 0px" direction="row" height="100%">
        {isLoading && <Text>Loading...</Text>}
        {!isLoading && data && (
          <Flex alignItems="center" gap="50px" direction="column">
            <Text>Worker ID: {data.worker}</Text>
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
            <Flex gap="20px" alignItems="center" direction="column">
              <Text>Remote Video</Text>
              <video id="remote_video" controls></video>
            </Flex>

            <Flex gap="10px" alignItems="center">
              <Button variant="solid" colorScheme="green" rounded="button">
                Connect
              </Button>
            </Flex>
          </Flex>
        )}
      </Flex>
      <DarkModeSwitch />
    </Container>
  );
};

export default Index;
