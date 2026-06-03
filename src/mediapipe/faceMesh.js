const CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619';

export function initFaceMesh(onResults) {
  const faceMesh = new window.FaceMesh({
    locateFile: (file) => `${CDN}/${file}`,
  });

  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,       // 478 points incl. iris
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  faceMesh.onResults(onResults);

  return faceMesh;
}
