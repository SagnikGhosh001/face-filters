function toPixel(lm, w, h) {
  return { x: lm.x * w, y: lm.y * h };
}

function dist(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function drawEar(ctx, cx, cy, outerW, outerH, innerW, innerH) {
  // Outer ear (white)
  ctx.beginPath();
  ctx.ellipse(cx, cy, outerW, outerH, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#f5f0f0';
  ctx.fill();
  ctx.strokeStyle = 'rgba(180,160,160,0.6)';
  ctx.lineWidth = Math.max(1, outerW * 0.06);
  ctx.stroke();

  // Inner ear (pink)
  ctx.beginPath();
  ctx.ellipse(cx, cy + outerH * 0.1, innerW, innerH, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 150, 180, 0.85)';
  ctx.fill();
}

export function drawBunnyEars({ landmarks, ctx, videoWidth, videoHeight }) {
  const topCenter = toPixel(landmarks[10],  videoWidth, videoHeight);
  const leftEdge  = toPixel(landmarks[234], videoWidth, videoHeight);
  const rightEdge = toPixel(landmarks[454], videoWidth, videoHeight);

  const faceWidth = dist(leftEdge, rightEdge);
  const angle     = Math.atan2(rightEdge.y - leftEdge.y, rightEdge.x - leftEdge.x);

  const earW  = faceWidth * 0.14;  // half-width of ear
  const earH  = faceWidth * 0.52;  // half-height of ear (tall)
  const innerW = earW * 0.45;
  const innerH = earH * 0.72;

  // Ear horizontal offset from head center
  const spread = faceWidth * 0.3;
  // Ear vertical position: above the head top
  const riseY  = earH * 1.05;

  ctx.save();
  ctx.translate(topCenter.x, topCenter.y);
  ctx.rotate(angle);

  // Left ear (slightly tilted outward)
  ctx.save();
  ctx.translate(-spread, -riseY);
  ctx.rotate(-0.18);
  drawEar(ctx, 0, 0, earW, earH, innerW, innerH);
  ctx.restore();

  // Right ear (slightly tilted outward)
  ctx.save();
  ctx.translate(spread, -riseY);
  ctx.rotate(0.18);
  drawEar(ctx, 0, 0, earW, earH, innerW, innerH);
  ctx.restore();

  ctx.restore();
}
