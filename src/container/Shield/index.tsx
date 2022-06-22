import { ChakraProvider } from "@chakra-ui/react";
import { authExchange } from "@urql/exchange-auth";
import Router, { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";
import {
  createClient,
  Exchange,
  fetchExchange,
  makeOperation,
  Provider,
} from "urql";
import { pipe, tap } from "wonka";
import { socket, SocketContext } from "../../modules/SocketProvider";
import theme from "../../theme";

const ignoreThemeUrl = ["/callback", "/admin-login", "/tsplogin", "/add_token"];

export interface ShieldProps {
  children?: JSX.Element | React.ReactNode;
}

const didAuthError = ({ error }) => {
  console.log(error);
  return error.graphQLErrors.some((e) => e.response.status === 401);
};

// const errorExchange: Exchange =
//   ({ forward }) =>
//   (ops$) => {
//     return pipe(
//       forward(ops$),
//       tap(({ error }) => {
//         console.log(error);
//         if (error?.message.includes("not authenticated")) {
//           Router.replace("/login");
//         }
//       })
//     );
//   };

const client = createClient({
  url: `${process.env.NEXT_PUBLIC_MAIN_URL}/graphql`,

  fetchOptions: {
    credentials: "include",
  },
  exchanges: [
    authExchange({
      addAuthToOperation: ({ authState, operation }) => {
        if (!authState || !(authState as any).token) {
          return operation;
        }
        // if authState has the error
        // return an empty operation
        if (authState && (authState as any).authError) {
          return makeOperation("teardown", operation);
        }
      },
      getAuth: async ({ authState, mutate }) => {
        return null;
      },
      didAuthError,
    }),
    fetchExchange,
  ],
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
          <Provider value={client}>
            <SocketContext.Provider value={socket}>
              <React.Fragment>{children}</React.Fragment>
            </SocketContext.Provider>
          </Provider>
        </ChakraProvider>
      )}
    </>
  );
}
