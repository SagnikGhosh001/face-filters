import { drawGlasses } from '../filters/glasses.js';
import { drawHat } from '../filters/hat.js';
import { drawSticker } from '../filters/sticker.js';
import { drawGlow } from '../effects/glow.js';
import { drawColorShift } from '../effects/colorShift.js';

const DRAWABLES = {
  glasses:     { fn: drawGlasses,    alpha: 0.30 },
  hat:         { fn: drawHat,        alpha: 0.35 },
  sticker:     { fn: drawSticker,    alpha: 0.45 },
  glow:        { fn: drawGlow,       alpha: 0.35 },
  colorShift:  { fn: drawColorShift, alpha: 0.35 },
};

const DEFAULT_ALPHA = 0.35;

export class FilterEngine {
  constructor({ canvas, videoElement }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.videoElement = videoElement;
    this.activeFilters = new Set();
    this.smoothed = null;
  }

  toggleFilter(name) {
    if (!name || name === 'none') {
      this.activeFilters.clear();
      return;
    }
    if (!DRAWABLES[name]) return;
    if (this.activeFilters.has(name)) {
      this.activeFilters.delete(name);
    } else {
      this.activeFilters.add(name);
    }
  }

  onResults(results) {
    const { canvas, ctx, videoElement } = this;

    if (canvas.width !== videoElement.videoWidth) {
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!results.multiFaceLandmarks?.length || this.activeFilters.size === 0) return;

    const raw = results.multiFaceLandmarks[0];

    // Use the lowest (smoothest) alpha across all active drawables
    const alpha = this.activeFilters.size > 0
      ? Math.min(...[...this.activeFilters].map(n => DRAWABLES[n]?.alpha ?? DEFAULT_ALPHA))
      : DEFAULT_ALPHA;

    if (!this.smoothed || this.smoothed.length !== raw.length) {
      this.smoothed = raw.map(lm => ({ x: lm.x, y: lm.y, z: lm.z }));
    } else {
      const s = this.smoothed;
      const inv = 1 - alpha;
      for (let i = 0; i < raw.length; i++) {
        s[i].x = s[i].x * inv + raw[i].x * alpha;
        s[i].y = s[i].y * inv + raw[i].y * alpha;
        s[i].z = s[i].z * inv + raw[i].z * alpha;
      }
    }

    const args = {
      landmarks: this.smoothed,
      ctx,
      videoWidth: canvas.width,
      videoHeight: canvas.height,
    };

    // Draw effects first (behind filters)
    for (const name of this.activeFilters) {
      if (!DRAWABLES[name]) continue;
      if (name === 'glow' || name === 'colorShift') {
        DRAWABLES[name].fn(args);
      }
    }
    // Draw filters on top
    for (const name of this.activeFilters) {
      if (!DRAWABLES[name]) continue;
      if (name !== 'glow' && name !== 'colorShift') {
        DRAWABLES[name].fn(args);
      }
    }
  }
}
