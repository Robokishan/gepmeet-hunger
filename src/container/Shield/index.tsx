import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { ChakraProvider } from "@chakra-ui/react";
import Router, { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";
import theme from "../../theme";
import { CookieKeys } from "../../utils/constant";
import { deleteCookie, getCookie } from "../../utils/cookieManager";
import SocketContainer from "../SocketContainer";

const ignoreThemeUrl = ["/callback", "/admin-login", "/tsplogin", "/add_token"];

export interface ShieldProps {
  children?: JSX.Element | React.ReactNode;
}

const httpLink = createHttpLink({
  uri: `${process.env.NEXT_PUBLIC_MAIN_URL}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = getCookie(CookieKeys.token);
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ?? "",
    },
  };
});

// Log any GraphQL errors or network error that occurred
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    Router.push("/auth/login");
    deleteCookie(CookieKeys.token);
  }
  // graphQLErrors.forEach(({ message, locations, path }) =>
  //   console.log(
  //     `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
  //   )
  // );
  if (networkError) console.error(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  link: errorLink.concat(authLink).concat(httpLink),
  cache: new InMemoryCache(),
});

export default function Shield({ children }: ShieldProps): ReactElement {
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      setLoading(false);
    }
  }, [router.isReady]);

  return (
    <>
      {!isLoading && (
        <ChakraProvider resetCSS theme={theme}>
          <ApolloProvider client={client}>
            <SocketContainer>
              <React.Fragment>{children}</React.Fragment>
            </SocketContainer>
          </ApolloProvider>
        </ChakraProvider>
      )}
    </>
  );
}
