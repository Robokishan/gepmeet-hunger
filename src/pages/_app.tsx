import { AppProps } from "next/app";
import { useEffect } from "react";
import Shield from "../container/Shield";

function MyApp({ Component, pageProps }: AppProps) {
  // enable logger for mediasoup
  useEffect(() => {
    // localStorage.setItem("debug", "mediasoup-client:*");
    localStorage.setItem("debug", "");
  }, []);
  return (
    <Shield>
      <Component {...pageProps} />
    </Shield>
  );
}

export default MyApp;
