import * as mediasoup from "mediasoup-client";
import { Consumer, ConsumerOptions } from "mediasoup-client/lib/Consumer";
import { Producer } from "mediasoup-client/lib/Producer";
import { RtpCapabilities } from "mediasoup-client/lib/RtpParameters";
import { Transport, TransportOptions } from "mediasoup-client/lib/Transport";

export enum MediaSoupSocket {
  startNegotiation = "startNegotiation",
  roomAssigned = "roomAssigned",
  listenConsumers = "listenConsumers",
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
  produce = "produce",
  connecting = "connecting",
  connected = "connected",
  failed = "failed",
  connect = "connect",
}

interface LoadDeviceType {
  device: mediasoup.Device;
}

type onProduce = ({
  transportId,
  kind,
  rtpParameters,
}: {
  transportId: string;
  kind: any;
  rtpParameters: any;
}) => any;

type onConnect = (type: "send" | "recv") => void;
type onError = (err: unknown) => void;

type ConnectionCallback = ({
  dtlsParameters,
}: {
  dtlsParameters: unknown;
}) => any;
interface StartArgumentType {
  sendTransMeta: TransportOptions;
  recvTransMeta: TransportOptions;
  onSendConnectCallback: ConnectionCallback;
  onRecvConnectCallback: ConnectionCallback;
  onProduce: onProduce;
  onConnect: onConnect;
  onError: onError;
}

export async function loadDevice(
  routerRtpCapabilities
): Promise<LoadDeviceType> {
  try {
    const device = new mediasoup.Device();
    await device.load({ routerRtpCapabilities });
    return {
      device,
    };
  } catch (error) {
    if (error.name === "UnsupportedError") {
      console.error("browser not supported");
    }
    return {
      device: null,
    };
  }
}

class MediaSoupHandshake {
  _device: mediasoup.Device;
  _sendTransport: Transport;
  _recvTransport: Transport;

  consumers: Map<string, Consumer>;
  producers: Map<string, Producer>;

  constructor(device: mediasoup.Device) {
    this._device = device;
    this.producers = new Map<string, Producer>();
    this.consumers = new Map<string, Consumer>();
  }

  async start({
    sendTransMeta,
    recvTransMeta,
    onSendConnectCallback,
    onRecvConnectCallback,
    onProduce,
    onConnect,
    onError,
  }: StartArgumentType) {
    await this.createProducerTransport(sendTransMeta);
    await this.createConsumerTransport(recvTransMeta);
    await this.subSendTransportEv(
      onSendConnectCallback,
      onProduce,
      onConnect,
      onError
    );
    await this.subRecvTransportEv(onRecvConnectCallback, onConnect, onError);
  }

  createProducerTransport(transportMeta: TransportOptions): Transport {
    this._sendTransport = this._device.createSendTransport(transportMeta);
    return this._sendTransport;
  }

  createConsumerTransport(transportMeta: TransportOptions): Transport {
    this._recvTransport = this._device.createRecvTransport(transportMeta);
    return this._recvTransport;
  }

  setProducerTransport(sendTransport: Transport) {
    this._sendTransport = sendTransport;
  }

  setReceiverTransport(recvTransport: Transport) {
    this._recvTransport = recvTransport;
  }

  subSendTransportEv(
    onConnectRequest: ({ dtlsParameters }: { dtlsParameters: unknown }) => any,
    produce: onProduce,
    onConnect: onConnect,
    onError: onError
  ) {
    this._sendTransport.on(
      MediasoupTransport.connect,
      async ({ dtlsParameters }, callback, errback) => {
        try {
          await onConnectRequest({
            dtlsParameters,
          });
          callback();
        } catch (error) {
          console.error(error);
          onError(error);
        }
      }
    );

    this._sendTransport.on(
      MediasoupTransport.produce,
      async ({ kind, rtpParameters }, callback, errback) => {
        try {
          const producerResponse = await produce({
            transportId: this._sendTransport.id,
            kind,
            rtpParameters,
          });
          console.log({ producerResponse });
          callback({ id: producerResponse.id });
        } catch (error) {
          console.error(error);
          onError(error);
        }
      }
    );

    this._sendTransport.on(
      MediasoupTransport.connectionstatechange,
      (state) => {
        switch (state) {
          case MediasoupTransport.connecting:
            break;

          case MediasoupTransport.connected:
            onConnect("send");
            // document.querySelector("#local_video").srcObject = stream;
            break;

          case MediasoupTransport.failed:
            this._sendTransport.close();
            break;

          default:
            break;
        }
      }
    );
  }

  subRecvTransportEv(
    connCallback: ({ dtlsParameters }: { dtlsParameters: unknown }) => any,
    onConnect: onConnect,
    onError: onError
  ) {
    this._recvTransport.on(
      MediasoupTransport.connect,
      async ({ dtlsParameters }, callback, errback) => {
        try {
          const data = await connCallback({ dtlsParameters });
          console.log(data);
          callback();
        } catch (error) {
          console.error(error);
          onError(error);
        }
      }
    );

    this._recvTransport.on(
      MediasoupTransport.connectionstatechange,
      async (state) => {
        console.log("MediasoupState:", state);
        switch (state) {
          case MediasoupTransport.connecting:
            break;

          case MediasoupTransport.connected:
            onConnect("recv");
            // document.querySelector("#remote_video").srcObject = await stream;
            // resume(roomId);
            break;

          case MediasoupTransport.failed:
            this._recvTransport.close();
            break;

          default:
            break;
        }
      }
    );
  }

  async consume(consumerOptions: ConsumerOptions): Promise<Consumer> {
    const consumer = await this._recvTransport.consume(consumerOptions);
    this.consumers.set(consumer.id, consumer);
    return consumer;
  }

  getrtpCapabilities(): RtpCapabilities {
    return this._device.rtpCapabilities;
  }

  async produce(stream: MediaStream): Promise<Producer> {
    const track = stream.getVideoTracks()[0];
    const producer = await this._sendTransport.produce({ track });
    this.producers.set(producer.id, producer);
    return producer;
  }

  removeProducer(id: string) {
    this.producers.delete(id);
  }

  removeConsumer(id: string) {
    this.consumers.delete(id);
  }

  disconnect() {
    this.producers.forEach((producer) => producer.close());
    this.consumers.forEach((consumer) => consumer.close());
    this._recvTransport.close();
    this._sendTransport.close();
  }
}

export { MediaSoupHandshake };
