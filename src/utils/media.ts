import { LocalStorageKey } from "./constant";

const getUserMedia = async () => {
  // if (!device.canProduce("video")) {
  //   console.error("cannot produce video");
  //   return;
  // }

  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: localStorage.getItem(LocalStorageKey.vidId),
      },
      audio: {
        deviceId: localStorage.getItem(LocalStorageKey.micId),
      },
    });
  } catch (err) {
    console.error("getUserMedia() failed:", err.message);
    throw err;
  }
  return stream;
};

const getSavedDevices = async (): Promise<{ micId: string; vidId: string }> => {
  const micId = localStorage.getItem(LocalStorageKey.micId);
  const vidId = localStorage.getItem(LocalStorageKey.vidId);
  return { micId, vidId };
};

export { getUserMedia, getSavedDevices };
