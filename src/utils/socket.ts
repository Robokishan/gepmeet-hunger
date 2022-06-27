import { Manager, Socket } from "socket.io-client";
import { CookieKeys } from "./constant";
import { getCookie } from "./cookieManager";
import { isServer } from "./isServer";

class SocketManager {
  private manager: Manager = undefined;
  socket: Socket = undefined;

  constructor() {
    const socketURL = process.env.NEXT_PUBLIC_MAIN_URL;
    this.manager = new Manager(socketURL, {
      autoConnect: false,
      // query: { fleetId: "userId" },
      path: "/ws",
      extraHeaders: {
        authorization: getCookie(CookieKeys.token),
      },
    });
    this.socket = this.manager.socket("/");
  }

  setNameSpace(namespace: string, params?: unknown): void {
    /*
    Example:
    socket.setNameSpace("/", {
       deviceId: "deviceId",
       tripId: "tripId",
     });
     */

    this.socket = this.manager.socket(namespace, {
      auth: { ...(params as any) },
    });
  }

  listen(channel: string, callback: (data: unknown) => void): void {
    this.socket.on(channel, callback);
  }

  // not neccessary but can be used to normalize class with socket object parent class
  disconnect(): void {
    this.socket.disconnect();
  }
  connect(): void {
    this.manager.opts.extraHeaders = {
      ...this.manager.opts.extraHeaders,
      authorization: getCookie(CookieKeys.token),
    };
    this.socket.connect();
  }

  isConnected(): boolean {
    return this.socket ? this.socket.connected : false;
  }
  request(type, data = {}) {
    return new Promise((resolve) => {
      try {
        this.socket.emit(type, data, resolve);
      } catch (error) {
        console.error(error);
      }
    });
  }
}
export default SocketManager;
