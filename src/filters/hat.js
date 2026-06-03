function toPixel(lm, w, h) {
  return { x: lm.x * w, y: lm.y * h };
}

function dist(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function drawHat({ landmarks, ctx, videoWidth, videoHeight }) {
  const forehead  = toPixel(landmarks[10],  videoWidth, videoHeight);
  const leftEdge  = toPixel(landmarks[234], videoWidth, videoHeight);
  const rightEdge = toPixel(landmarks[454], videoWidth, videoHeight);

  const faceWidth     = dist(leftEdge, rightEdge);
  const hatW          = faceWidth * 1.25;
  const brimH         = faceWidth * 0.13;
  const crownW        = hatW * 0.72;
  const crownH        = faceWidth * 0.62;
  const bandH         = faceWidth * 0.06;

  const angle = Math.atan2(rightEdge.y - leftEdge.y, rightEdge.x - leftEdge.x);

  ctx.save();
  ctx.translate(forehead.x, forehead.y);
  ctx.rotate(angle);

  // Brim (sits at the forehead line)
  ctx.fillStyle = '#1c1c1c';
  ctx.beginPath();
  ctx.rect(-hatW / 2, -brimH / 2, hatW, brimH);
  ctx.fill();

  // Crown (rises above brim)
  ctx.fillStyle = '#141414';
  ctx.beginPath();
  ctx.rect(-crownW / 2, -brimH / 2 - crownH, crownW, crownH);
  ctx.fill();

  // Hatband accent
  ctx.fillStyle = '#8b0000';
  ctx.beginPath();
  ctx.rect(-crownW / 2, -brimH / 2 - bandH, crownW, bandH);
  ctx.fill();

  // Subtle highlight on left face of crown
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.beginPath();
  ctx.rect(-crownW / 2, -brimH / 2 - crownH, crownW * 0.25, crownH);
  ctx.fill();

  // Thin outline for definition
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  ctx.strokeRect(-crownW / 2, -brimH / 2 - crownH, crownW, crownH);
  ctx.strokeRect(-hatW / 2, -brimH / 2, hatW, brimH);

  ctx.restore();
}
