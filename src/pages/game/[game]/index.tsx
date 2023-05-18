import { Box, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import Hocky from "../../../container/Hocky";

interface Props {}

export default function Game({}: Props): ReactElement {
  const router = useRouter();
  const game = router.query.game;
  if (game == "hocky") {
    return <Hocky />;
  } else {
    return (
      <Box mt={8} mx="auto" maxW="400px" w="100%">
        <Text
          border="1px solid red"
          borderRadius="100px"
          textAlign="center"
          fontSize="4xl"
          textColor="red"
        >
          No game found : {game}
        </Text>
      </Box>
    );
  }
}
