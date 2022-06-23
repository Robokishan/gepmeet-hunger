import React from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useGetmeQuery } from "../generated/graphql";
import { Flex, Button, Box, Heading, Link } from "@chakra-ui/react";
import { deleteCookie } from "../utils/cookieManager";
import { CookieKeys } from "../utils/constant";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const [{ data, fetching, error }] = useGetmeQuery();

  let body = null;

  // data is loading
  if (fetching) {
    // user not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>register</Link>
        </NextLink>
      </>
    );
    // user is logged in
  } else {
    body = (
      <Flex align="center">
        <NextLink href="/create-room">
          <Button as={Link} mr={4}>
            Create Room
          </Button>
        </NextLink>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          color="white"
          onClick={() => {
            deleteCookie(CookieKeys.token);
            router.push("/auth/login");
          }}
          variant="link"
        >
          logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex zIndex={1} position="sticky" top={0} bg="grey" p={4}>
      <Flex flex={1} m="auto" align="center" maxW={800}>
        <NextLink href="/room">
          <Link>
            <Heading>Gepmeet</Heading>
          </Link>
        </NextLink>
        <Box ml={"auto"}>{body}</Box>
      </Flex>
    </Flex>
  );
};
