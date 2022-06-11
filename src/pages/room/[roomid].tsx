import { Box, Button, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement, useContext } from "react";
import { Layout } from "../../components/Layout";
import { RoomCard } from "../../components/RoomCard";
import { useGetConversationQuery } from "../../generated/graphql";
import { SocketContext } from "../../modules/SocketProvider";
import { loadDevice, MediaSoupSocket } from "../../utils/mediasoup";
import SocketManager from "../../utils/socket";

interface Props {}

export default function Room({}: Props): ReactElement {
  const router = useRouter();
  const socket = useContext<SocketManager>(SocketContext);

  const [{ data, fetching, error }] = useGetConversationQuery({
    pause: !router.query.roomid,
    variables: {
      conversationid: router.query.roomid as string,
    },
  });

  const joinConversation = async () => {
    const data = await socket.request(MediaSoupSocket.startNegotiation);
    console.log(data);
  };

  const getRouterRtpCapabilities = async () => {
    const response = await socket.request(
      MediaSoupSocket.getRouterRtpCapabilities
    );
    console.log(response);
  };

  if (fetching) return <div>Loading</div>;
  if (data)
    return (
      <Layout>
        <Box padding="20px">
          <Flex gap="20px">
            <Button onClick={joinConversation} colorScheme="green">
              Join Call
            </Button>
            <Button onClick={getRouterRtpCapabilities} colorScheme="green">
              GetRTPCapabilities
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
        </Box>
      </Layout>
    );
  if (error) return <div>error: {JSON.stringify(error)}</div>;
  return <>Loading</>;
}
