export async function initWebcam(videoEl) {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
    audio: false,
  });

  videoEl.srcObject = stream;

  await new Promise((resolve, reject) => {
    videoEl.onloadedmetadata = () => resolve();
    videoEl.onerror = reject;
  });

  await videoEl.play();

  return {
    stream,
    videoWidth: videoEl.videoWidth,
    videoHeight: videoEl.videoHeight,
  };
}

export function stopWebcam(stream) {
  stream.getTracks().forEach(t => t.stop());
}
