import { AppProps } from "next/app";
import Shield from "../container/Shield";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Shield>
      <Component {...pageProps} />
    </Shield>
  );
}

export default MyApp;
