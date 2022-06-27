import { LocalStorageKey } from "./constant";

const getUserMedia = async () => {
  // if (!device.canProduce("video")) {
  //   console.error("cannot produce video");
  //   return;
  // }

  let stream;
  try {
    let options: MediaStreamConstraints = {
      video: true,
      audio: true,
    };
    const { vidId, micId } = await getSavedDevices();
    if (vidId && micId) {
      options = {
        video: {
          deviceId: localStorage.getItem(LocalStorageKey.vidId),
        },
        audio: {
          deviceId: localStorage.getItem(LocalStorageKey.micId),
        },
      };
    }

    stream = await navigator.mediaDevices.getUserMedia(options);
  } catch (err) {
    console.error("getUserMedia() failed:", err.message);
    throw err;
  }
  return stream;
};

const getSavedDevices = async (): Promise<{ micId: string; vidId: string }> => {
  let micId = localStorage.getItem(LocalStorageKey.micId);
  let vidId = localStorage.getItem(LocalStorageKey.vidId);
  if (micId == "null" || micId == "undefined") {
    micId = null;
  }
  if (vidId == "null" || vidId == "undefined") {
    vidId = null;
  }
  return { micId, vidId };
};

export { getUserMedia, getSavedDevices };
