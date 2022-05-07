import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import axiosClient from "./axiosClient";

export interface AxiosArg {
  url?: string;
  body?: any;
  method?: any;
  headers?: any;
  shouldFetch?: boolean;
}

export interface AxiosClientResponse<Data = any, Error = AxiosError> {
  data?: Data;
  error?: Error;
  isLoading?: boolean;
  mutate?: () => void;
}

const useAxiosClient = <T = any, E = AxiosError, R = T>({
  url,
  method = "get",
  body = null,
  headers = null,
  shouldFetch = true,
}: AxiosArg): AxiosClientResponse<R, E> => {
  const [data, setResponse] = useState<R>(null);
  const [error, setError] = useState<E>(null);
  const [isLoading, setloading] = useState(true);

  const fetchData = () => {
    if (shouldFetch) {
      setloading(true);
      setResponse(null);
      setError(null);
      axiosClient[method](url, body, headers)
        .then((res) => {
          setResponse(res.data);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setloading(false);
        });
    }
  };

  const mutate = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [method, url, body, headers]);

  return { data, error, isLoading, mutate };
};

export default useAxiosClient;
