import { useRouter } from "next/router";
import React, { ReactElement, useEffect } from "react";
import { socket, SocketContext } from "../../modules/SocketProvider";
import { CookieKeys } from "../../utils/constant";
import { getCookie } from "../../utils/cookieManager";

interface Props {
  children: React.ReactNode | JSX.Element;
}

function SocketContainer({ children }: Props): ReactElement {
  useEffect(() => {
    if (!socket.isConnected() && getCookie(CookieKeys.token)) socket.connect();
    return () => socket.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export default SocketContainer;
