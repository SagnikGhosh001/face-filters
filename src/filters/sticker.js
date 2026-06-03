function toPixel(lm, w, h) {
  return { x: lm.x * w, y: lm.y * h };
}

function dist(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function starPath(ctx, cx, cy, outerR, innerR, points) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
}

export function drawSticker({ landmarks, ctx, videoWidth, videoHeight }) {
  const noseTip    = toPixel(landmarks[1],   videoWidth, videoHeight);
  const noseBridge = toPixel(landmarks[168], videoWidth, videoHeight);

  const noseLen  = dist(noseTip, noseBridge);
  const outerR   = Math.max(12, noseLen * 0.95);
  const innerR   = outerR * 0.42;

  // Radial gradient fill
  const grad = ctx.createRadialGradient(noseTip.x, noseTip.y, 0, noseTip.x, noseTip.y, outerR);
  grad.addColorStop(0,   'rgba(255, 120, 170, 1)');
  grad.addColorStop(0.6, 'rgba(255, 60, 130, 0.95)');
  grad.addColorStop(1,   'rgba(200, 0, 100, 0.85)');

  starPath(ctx, noseTip.x, noseTip.y, outerR, innerR, 5);
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.strokeStyle = 'rgba(160, 0, 80, 0.9)';
  ctx.lineWidth = Math.max(1.5, outerR * 0.06);
  ctx.stroke();

  // Small center dot
  ctx.beginPath();
  ctx.arc(noseTip.x, noseTip.y, outerR * 0.12, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 220, 235, 0.9)';
  ctx.fill();
}
