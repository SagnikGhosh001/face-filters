# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the app

No build step. Serve as static files — ES modules require HTTP (not `file://`):

```bash
python3 -m http.server 8080
# Open http://localhost:8080 in Chrome
```

Chrome is required for `MediaRecorder` + `canvas.captureStream()` compatibility. Camera permission must be granted on load.

## Architecture

Vanilla JS, ES6 modules, no framework, no bundler. MediaPipe Face Mesh is loaded via CDN as classic `<script>` tags in `index.html` — they must appear before `<script type="module" src="src/app.js">` because they inject `window.FaceMesh` and `window.Camera` as globals.

### Render pipeline

```
window.Camera (RAF loop)
  └─► onFrame → faceMesh.send({ image: video })   [async, awaited]
        └─► MediaPipe processes frame
              └─► FilterEngine.onResults(results)
                    ├─ lerp-smooth all 478 landmarks (alpha = min across active filters)
                    ├─ draw effects (glow, colorShift) — behind
                    └─ draw filters (glasses, hat, …) — on top
```

`window.Camera` drives the loop — never call `requestAnimationFrame` + `faceMesh.send()` manually in parallel, as `send()` is async and must be awaited to prevent frame queue buildup.

### Canvas/video layout

`#video` and `#overlay` (canvas) are absolutely positioned siblings inside `#viewport`, both with CSS `transform: scaleX(-1)` for mirroring. The canvas pixel coordinate space is **un-mirrored** — only the CSS display is flipped. When compositing for recording or snapshot, both video and canvas must be drawn with `ctx.scale(-1, 1)` to produce a correctly mirrored output.

Canvas `.width`/`.height` attributes are set to raw camera pixel dimensions (e.g. 640×480). CSS scales the display. Landmark coordinates convert to pixels via `landmark.x * canvas.width` / `landmark.y * canvas.height`.

### Adding a filter

1. Create `src/filters/myFilter.js` exporting `drawMyFilter({ landmarks, ctx, videoWidth, videoHeight })`
2. Register in `src/engine/filterEngine.js` DRAWABLES: `myFilter: { fn: drawMyFilter, alpha: 0.35 }`
3. Add button in `index.html`: `<button class="filter-btn" data-filter="myFilter">…</button>` — **must have `data-filter`**, not just `filter-btn` class (controls.js queries `[data-filter]`)

Effects (full-face overlays like glow/colorShift) go in `src/effects/` and are drawn before filters. Distinguish them in `filterEngine.js` `onResults` by name.

### Smoothing

`FilterEngine` maintains one lerp-smoothed landmark buffer for all 478 points. Alpha is computed as `Math.min(...activeFilters.map(alpha))` — combining filters always uses the most aggressive smoothing among them. Per-filter alphas: glasses/sunglasses `0.30`, hat/bunnyEars/glow/colorShift `0.35`, mustache `0.40`, sticker `0.45`.

### Recording

`Recorder` (`src/recording/recorder.js`) owns a hidden composite canvas. Each `requestAnimationFrame` it draws the mirrored video + mirrored filter overlay into it, then `canvas.captureStream(30)` feeds `MediaRecorder`. Output is WebM/VP9. The `Recorder.stop()` returns a `Promise<Blob>` — `app.js` converts it to an object URL for preview and download, then calls `URL.revokeObjectURL` on close.

### Key MediaPipe landmark indices

| Area | Indices |
|---|---|
| Left/right eye outer | 33, 263 |
| Face width edges | 234, 454 |
| Forehead top (hat anchor) | 10, 151, 108, 337 (averaged) |
| Nose tip | 1 |
| Nose bridge | 168 |
| Upper lip top | 0 |
| Mouth corners | 61, 291 |
| Face oval (effects) | 10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109 |
