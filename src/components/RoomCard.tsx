import { Box, Button, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { MouseEventHandler, ReactElement } from "react";

export interface RoomCardProps {
  id: string;
  title: string;
  description: string;
  members?: Array<any>;
  onDelete?: (e) => void;
}

export const RoomCard = ({
  id,
  title,
  description,
  members,
  onDelete,
}: RoomCardProps): ReactElement => (
  <Box cursor="pointer"  _hover={{
    background: "gray.200",
  }} background="gray.100" borderRadius="20px" padding="20px">
    {/* <Text>id: {id}</Text> */}
    <Text>Title: {title}</Text>
    <Text>Description: {description}</Text>
    {members && (
      <>
        <Text>Members:</Text>
        <Box margin="0px 0px 0px 10px">
          <UnorderedList>
            {members.map((member, index) => (
              <ListItem key={index}>{member.user.name}</ListItem>
            ))}
          </UnorderedList>
        </Box>
      </>
    )}
    {onDelete && (
      <Button onClick={onDelete} mt="15px" colorScheme="red">
        Delete
      </Button>
    )}
  </Box>
);
