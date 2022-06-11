import { Button, Flex, List, ListItem } from "@chakra-ui/react";
import Link from "next/link";
import React, { ReactElement } from "react";
import { Layout } from "../../components/Layout";
import { RoomCard } from "../../components/RoomCard";
import {
  useDeleteConversationMutation,
  useGetConversationsQuery,
} from "../../generated/graphql";

export default function RoomList(): ReactElement {
  const [{ data, error, fetching }, refetchRoomList] =
    useGetConversationsQuery();
  const [, mutatedeleteConv] = useDeleteConversationMutation();

  const deleteConversation = async (roomid: string) => {
    await mutatedeleteConv({
      deleteConversationId: roomid,
    });
    refetchRoomList();
  };

  if (fetching) return <div>Loading</div>;
  if (error) return <div>error: {JSON.stringify(error)}</div>;
  if (data?.GetConversations)
    return (
      <Layout>
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
