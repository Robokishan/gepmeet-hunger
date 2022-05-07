import { AxiosError, AxiosResponse } from "axios";
import { API } from "./api";
import axiosClient from "./axiosClient";

export const createProducerTransport = async (roomId: string): Promise<any> => {
  return await axiosClient.post(
    API.CREATE_PRODUCER_TRANSPORT,
    {},
    { params: roomId }
  );
};

export const connectProducerTransport = async (
  roomId: string
): Promise<AxiosResponse | AxiosError> => {
  return await axiosClient.patch(
    API.CONNECT_PRODUCER_TRANSPORT,
    {},
    { params: roomId }
  );
};
