const FACE_OVAL = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288,
  397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136,
  172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109,
];

export function drawGlow({ landmarks, ctx, videoWidth, videoHeight }) {
  ctx.save();

  ctx.beginPath();
  FACE_OVAL.forEach((idx, i) => {
    const x = landmarks[idx].x * videoWidth;
    const y = landmarks[idx].y * videoHeight;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();

  // Outer glow pass
  ctx.shadowColor = '#00eeff';
  ctx.shadowBlur = 28;
  ctx.strokeStyle = 'rgba(0, 238, 255, 0.75)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Second pass for stronger core
  ctx.shadowBlur = 10;
  ctx.strokeStyle = 'rgba(150, 255, 255, 0.55)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.restore();
}
