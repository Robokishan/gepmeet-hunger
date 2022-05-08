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
