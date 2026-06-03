import { initWebcam } from './camera/webcam.js';
import { initFaceMesh } from './mediapipe/faceMesh.js';
import { FilterEngine } from './engine/filterEngine.js';
import { initControls } from './ui/controls.js';
import { Recorder } from './recording/recorder.js';

async function main() {
  const video          = document.getElementById('video');
  const canvas         = document.getElementById('overlay');
  const loading        = document.getElementById('loading');
  const recordBtn      = document.getElementById('record-btn');
  const snapBtn        = document.getElementById('snap-btn');
  const recIndicator   = document.getElementById('rec-indicator');
  const recTimer       = document.getElementById('rec-timer');
  const previewSection = document.getElementById('preview-section');
  const previewVideo   = document.getElementById('preview-video');
  const downloadBtn    = document.getElementById('download-btn');
  const closePreview   = document.getElementById('close-preview');

  try {
    // 1. Start webcam
    const { videoWidth, videoHeight } = await initWebcam(video);

    // 2. Size canvas to match video pixel dimensions exactly
    canvas.width  = videoWidth;
    canvas.height = videoHeight;

    // 3. Create filter engine
    const engine = new FilterEngine({ canvas, videoElement: video });

    // 4. Initialize MediaPipe Face Mesh
    const faceMesh = initFaceMesh((results) => engine.onResults(results));

    // 5. Start Camera utility
    const mpCamera = new window.Camera(video, {
      onFrame: async () => {
        await faceMesh.send({ image: video });
      },
      width: videoWidth,
      height: videoHeight,
    });

    await mpCamera.start();
    loading.classList.add('hidden');

    // 6. Wire UI controls
    initControls((name) => engine.toggleFilter(name));

    // 7. Recording
    const recorder = new Recorder({ videoElement: video, overlayCanvas: canvas });
    let timerInterval = null;
    let startTime = 0;
    let currentBlobUrl = null;

    function formatTime(ms) {
      const s = Math.floor(ms / 1000);
      return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    }

    recordBtn.addEventListener('click', async () => {
      if (!recorder.isRecording) {
        // Start recording
        recorder.start(videoWidth, videoHeight);
        recordBtn.classList.add('recording');
        recordBtn.querySelector('.icon').textContent = '⏹';
        recordBtn.querySelector('.label').textContent = 'Stop';
        recIndicator.classList.remove('hidden');
        startTime = Date.now();
        timerInterval = setInterval(() => {
          recTimer.textContent = formatTime(Date.now() - startTime);
        }, 500);

        // Hide any previous preview
        previewSection.classList.add('hidden');
        if (currentBlobUrl) {
          URL.revokeObjectURL(currentBlobUrl);
          currentBlobUrl = null;
        }
      } else {
        // Stop recording
        clearInterval(timerInterval);
        recIndicator.classList.add('hidden');
        recordBtn.classList.remove('recording');
        recordBtn.querySelector('.icon').textContent = '⏺';
        recordBtn.querySelector('.label').textContent = 'Record';

        const blob = await recorder.stop();
        currentBlobUrl = URL.createObjectURL(blob);

        // Show preview
        previewVideo.src = currentBlobUrl;
        downloadBtn.href = currentBlobUrl;
        downloadBtn.download = `face-filter-${Date.now()}.webm`;
        previewSection.classList.remove('hidden');
        previewSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    snapBtn.addEventListener('click', () => {
      const snap = document.createElement('canvas');
      snap.width  = videoWidth;
      snap.height = videoHeight;
      const sctx = snap.getContext('2d');

      // Draw mirrored video frame
      sctx.save();
      sctx.translate(snap.width, 0);
      sctx.scale(-1, 1);
      sctx.drawImage(video, 0, 0, snap.width, snap.height);
      sctx.restore();

      // Draw filter overlay (mirrored to match video)
      sctx.save();
      sctx.translate(snap.width, 0);
      sctx.scale(-1, 1);
      sctx.drawImage(canvas, 0, 0, snap.width, snap.height);
      sctx.restore();

      const link = document.createElement('a');
      link.download = `face-filter-${Date.now()}.png`;
      link.href = snap.toDataURL('image/png');
      link.click();

      // Flash feedback
      snapBtn.classList.add('active');
      setTimeout(() => snapBtn.classList.remove('active'), 300);
    });

    closePreview.addEventListener('click', () => {
      previewSection.classList.add('hidden');
      previewVideo.pause();
      previewVideo.src = '';
      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl);
        currentBlobUrl = null;
      }
    });

  } catch (err) {
    loading.innerHTML = `<p style="color:#ff6b6b;padding:20px;text-align:center">
      ${err.name === 'NotAllowedError'
        ? 'Camera permission denied. Please allow camera access and refresh.'
        : `Error: ${err.message}`}
    </p>`;
    console.error(err);
  }
}

main();
