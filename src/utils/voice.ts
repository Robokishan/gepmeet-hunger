import { AxiosError, AxiosResponse } from "axios";
import { API } from "./api";
import axiosClient from "./axiosClient";

export const createProducerTransport = async (roomId: string): Promise<any> => {
  return await axiosClient.post(
    API.CREATE_PRODUCER,
    {},
    { params: { roomId } }
  );
};

export const createConsumerTransport = async (roomId: string): Promise<any> => {
  return await axiosClient.post(
    API.CREATE_CONSUMER,
    {},
    { params: { roomId } }
  );
};

export const connectProducerTransport = async (
  roomId: string,
  body
): Promise<AxiosResponse | AxiosError> => {
  return await axiosClient.patch(API.CONNECT_PRODUCER, body, {
    params: { roomId },
  });
};

export const connectConsumerTransport = async (
  roomId: string,
  body
): Promise<AxiosResponse | AxiosError> => {
  return await axiosClient.patch(API.CONNECT_CONSUMER, body, {
    params: { roomId },
  });
};

export const produce = async (roomId, transport, kind, rtpParameters) => {
  return await axiosClient.patch(
    API.PRODUCE,
    {
      transportId: transport.id,
      kind,
      rtpParameters,
    },
    { params: { roomId } }
  );
};

export const createRoom = async (roomId) => {
  await axiosClient.post(API.CREATE_ROOM, { roomId });
};

export const resume = async (roomId) => {
  return await axiosClient.get(API.RESUME, { params: { roomId } });
};

export const consumeConsumer = async (roomId, rtpCapabilities) => {
  return await axiosClient.post(
    API.CONSUME,
    { rtpCapabilities },
    { params: { roomId } }
  );
};
