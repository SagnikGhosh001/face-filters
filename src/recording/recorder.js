export class Recorder {
  constructor({ videoElement, overlayCanvas }) {
    this.video = videoElement;
    this.overlay = overlayCanvas;

    // Hidden composite canvas: video frame + filter overlay merged
    this.composite = document.createElement('canvas');
    this.cctx = this.composite.getContext('2d');

    this.chunks = [];
    this.mediaRecorder = null;
    this.rafId = null;
    this.isRecording = false;
  }

  _drawFrame() {
    const { composite, cctx, video, overlay } = this;

    // Draw mirrored video frame
    cctx.save();
    cctx.translate(composite.width, 0);
    cctx.scale(-1, 1);
    cctx.drawImage(video, 0, 0, composite.width, composite.height);
    cctx.restore();

    // Draw filter overlay on top (overlay canvas is already mirrored via CSS,
    // but its pixel data is in un-mirrored coordinates — draw it mirrored too)
    cctx.save();
    cctx.translate(composite.width, 0);
    cctx.scale(-1, 1);
    cctx.drawImage(overlay, 0, 0, composite.width, composite.height);
    cctx.restore();

    if (this.isRecording) {
      this.rafId = requestAnimationFrame(() => this._drawFrame());
    }
  }

  start(width, height) {
    this.composite.width = width;
    this.composite.height = height;
    this.chunks = [];
    this.isRecording = true;

    const stream = this.composite.captureStream(30);

    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : '';

    this.mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.chunks.push(e.data);
    };

    this.mediaRecorder.start(100); // collect chunks every 100ms
    this._drawFrame();
  }

  stop() {
    return new Promise((resolve) => {
      this.isRecording = false;
      cancelAnimationFrame(this.rafId);

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: this.mediaRecorder.mimeType });
        resolve(blob);
      };

      this.mediaRecorder.stop();
    });
  }
}
