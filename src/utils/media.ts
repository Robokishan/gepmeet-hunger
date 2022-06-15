const getUserMedia = async () => {
  // if (!device.canProduce("video")) {
  //   console.error("cannot produce video");
  //   return;
  // }

  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
  } catch (err) {
    console.error("getUserMedia() failed:", err.message);
    throw err;
  }
  return stream;
};

export { getUserMedia };
