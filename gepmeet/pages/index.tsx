import Head from "next/head";
import { App } from "./App";

export default function index() {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
        <link rel="apple-touch-icon" href="/logo192.png" />

        <link rel="manifest" href="/manifest.json" />
        <title>GepMeet</title>
      </Head>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
      <script
        type="text/javascript"
        src="https://8x8.vc/libs/lib-jitsi-meet.min.js"
      ></script>
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />
      <script type="text/javascript" src="/volMeter.js"></script>
      <App />
    </>
  );
}
