import { SettingsIcon } from "@chakra-ui/icons";
import {
  Flex,
  IconButton,
  List,
  ListItem,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import { ReactElement, useEffect } from "react";
import { Layout } from "../../components/Layout";
import { RoomCard } from "../../components/RoomCard";
import SettingsModal from "../../components/SettingsModal";
import {
  useDeleteConversationMutation,
  useGetConversationsQuery,
} from "../../generated/graphql";
import { getSavedDevices } from "../../utils/media";

export default function RoomList(): ReactElement {
  const {
    data,
    error,
    loading,
    refetch: refetchRoomList,
  } = useGetConversationsQuery();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [mutatedeleteConv] = useDeleteConversationMutation();

  const deleteConversation = async (roomid: string) => {
    await mutatedeleteConv({
      variables: {
        deleteConversationId: roomid,
      },
    });
    refetchRoomList();
  };

  const getsaved = async () => {
    const { vidId, micId } = await getSavedDevices();
    if (!vidId || !micId) {
      onOpen();
    }
  };

  useEffect(() => {
    getsaved();
  }, []);

  if (loading) return <div>Loading</div>;
  if (error) return <div>error: {JSON.stringify(error)}</div>;
  if (data?.GetConversations)
    return (
      <Layout>
        <IconButton
          margin="0px 0px 0px 25px"
          colorScheme="messenger"
          aria-label="Toggle settings menu"
          icon={<SettingsIcon />}
          onClick={onOpen}
        />

        {isOpen && <SettingsModal isOpen={isOpen} onClose={onClose} />}

        <List padding="20px">
          {data.GetConversations.map((room) => (
            <ListItem key={room.id} padding="20px 0px">
              <Flex>
                <Link
                  style={{ color: "inherit", textDecoration: "inherit" }}
                  href={`/room/${room.id}`}
                >
                  <a>
                    <RoomCard
                      id={room.id}
                      title={room.title}
                      description={room.description}
                      onDelete={() => deleteConversation(room.id)}
                    />
                  </a>
                </Link>
              </Flex>
            </ListItem>
          ))}
        </List>
      </Layout>
    );
}
