export interface RTPType {
  worker: number;
  router: Router;
}

export interface Router {
  codecs: Codec[];
  headerExtensions: HeaderExtension[];
}

export interface Codec {
  kind: Kind;
  mimeType: string;
  clockRate: number;
  channels?: number;
  rtcpFeedback: RtcpFeedback[];
  parameters: Parameters;
  preferredPayloadType: number;
}

export enum Kind {
  Audio = "audio",
  Video = "video",
}

export interface Parameters {
  "x-google-start-bitrate"?: number;
  apt?: number;
  "profile-id"?: number;
  "level-asymmetry-allowed"?: number;
  "packetization-mode"?: number;
  "profile-level-id"?: string;
}

export interface RtcpFeedback {
  type: string;
  parameter: Parameter;
}

export enum Parameter {
  Empty = "",
  Fir = "fir",
  Pli = "pli",
}

export interface HeaderExtension {
  kind: Kind;
  uri: string;
  preferredId: number;
  preferredEncrypt: boolean;
  direction: any;
}
