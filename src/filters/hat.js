function toPixel(lm, w, h) {
  return { x: lm.x * w, y: lm.y * h };
}

function dist(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function drawHat({ landmarks, ctx, videoWidth, videoHeight }) {
  // Stable anchor: average of top forehead landmarks for smoother tracking
  const topAvgX = (landmarks[10].x + landmarks[151].x + landmarks[108].x + landmarks[337].x) / 4;
  const topAvgY = (landmarks[10].y + landmarks[151].y + landmarks[108].y + landmarks[337].y) / 4;
  const forehead = { x: topAvgX * videoWidth, y: topAvgY * videoHeight };

  const leftEdge  = toPixel(landmarks[234], videoWidth, videoHeight);
  const rightEdge = toPixel(landmarks[454], videoWidth, videoHeight);
  const noseTip   = toPixel(landmarks[1],   videoWidth, videoHeight);

  const faceWidth = dist(leftEdge, rightEdge);
  const angle     = Math.atan2(rightEdge.y - leftEdge.y, rightEdge.x - leftEdge.x);

  // Pitch correction: compare forehead z vs nose z.
  // When looking up, forehead z < nose z → nose is relatively farther → shift hat up.
  // When looking down, forehead z > nose z → nose is relatively closer → shift hat down.
  const zForehead  = landmarks[10].z;
  const zNose      = landmarks[1].z;
  const pitchDelta = zForehead - zNose;
  // Scale pitch into a pixel offset (clamped to avoid extreme shifts)
  const pitchShift = Math.max(-faceWidth * 0.4, Math.min(faceWidth * 0.4, pitchDelta * videoHeight * 2.5));

  // Depth scale: z of forehead is negative when face is close, positive when far.
  // Closer face → slightly larger hat to feel physically grounded.
  const depthScale = Math.max(0.85, Math.min(1.2, 1 - zForehead * 2));

  const hatW   = faceWidth * 1.25 * depthScale;
  const brimH  = faceWidth * 0.13 * depthScale;
  const crownW = hatW * 0.72;
  const crownH = faceWidth * 0.62 * depthScale;
  const bandH  = faceWidth * 0.06 * depthScale;

  ctx.save();
  ctx.translate(forehead.x, forehead.y + pitchShift);
  ctx.rotate(angle);

  // Brim
  ctx.fillStyle = '#1c1c1c';
  ctx.beginPath();
  ctx.rect(-hatW / 2, -brimH / 2, hatW, brimH);
  ctx.fill();

  // Crown
  ctx.fillStyle = '#141414';
  ctx.beginPath();
  ctx.rect(-crownW / 2, -brimH / 2 - crownH, crownW, crownH);
  ctx.fill();

  // Hatband accent
  ctx.fillStyle = '#8b0000';
  ctx.beginPath();
  ctx.rect(-crownW / 2, -brimH / 2 - bandH, crownW, bandH);
  ctx.fill();

  // Subtle highlight
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.beginPath();
  ctx.rect(-crownW / 2, -brimH / 2 - crownH, crownW * 0.25, crownH);
  ctx.fill();

  // Definition outline
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  ctx.strokeRect(-crownW / 2, -brimH / 2 - crownH, crownW, crownH);
  ctx.strokeRect(-hatW / 2, -brimH / 2, hatW, brimH);

  ctx.restore();
}
