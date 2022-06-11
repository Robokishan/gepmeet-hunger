import * as mediasoup from "mediasoup-client";

export enum MediaSoupSocket {
  startNegotiation = "startNegotiation",
  getRouterRtpCapabilities = "getRouterRtpCapabilities",
  createProducerTransport = "createProducerTransport",
  connectProducerTransport = "connectProducerTransport",
  produce = "produce",
  consume = "consume",
  createConsumerTransport = "createConsumerTransport",
  connectConsumerTransport = "connectConsumerTransport",
}

export enum MediasoupTransport {
  connectionstatechange = "connectionstatechange",
  connecting = "connecting",
  connected = "connected",
  failed = "failed",
  connect = "connect",
}

export async function loadDevice(routerRtpCapabilities) {
  try {
    var device = new mediasoup.Device();
  } catch (error) {
    if (error.name === "UnsupportedError") {
      console.error("browser not supported");
    }
  }
  await device.load({ routerRtpCapabilities });
}
