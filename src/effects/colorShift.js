const FACE_OVAL = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288,
  397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136,
  172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109,
];

// Cycle through hues over time for a dynamic color-shift effect
let hue = 0;

export function drawColorShift({ landmarks, ctx, videoWidth, videoHeight }) {
  hue = (hue + 0.6) % 360;

  ctx.save();

  ctx.beginPath();
  FACE_OVAL.forEach((idx, i) => {
    const x = landmarks[idx].x * videoWidth;
    const y = landmarks[idx].y * videoHeight;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();

  // Semi-transparent hue fill
  ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.28)`;
  ctx.fill();

  // Soft matching border
  ctx.strokeStyle = `hsla(${hue}, 90%, 70%, 0.4)`;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.restore();
}
