function toPixel(lm, w, h) {
  return { x: lm.x * w, y: lm.y * h };
}

function dist(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

export function drawGlasses({ landmarks, ctx, videoWidth, videoHeight }) {
  const leftOuter  = toPixel(landmarks[33],  videoWidth, videoHeight);
  const rightOuter = toPixel(landmarks[263], videoWidth, videoHeight);

  const eyeSpan   = dist(leftOuter, rightOuter);
  const lensW     = eyeSpan * 0.52;
  const lensH     = lensW * 0.65;
  const radius    = lensW * 0.18;
  const lineW     = Math.max(2, eyeSpan * 0.038);

  const midX  = (leftOuter.x + rightOuter.x) / 2;
  const midY  = (leftOuter.y + rightOuter.y) / 2;
  const angle = Math.atan2(rightOuter.y - leftOuter.y, rightOuter.x - leftOuter.x);

  ctx.save();
  ctx.translate(midX, midY);
  ctx.rotate(angle);

  const halfSpan = eyeSpan / 2;
  // left lens center: -halfSpan, right lens center: +halfSpan

  // Tinted lens fill
  ctx.fillStyle = 'rgba(80, 160, 255, 0.22)';
  roundRect(ctx, -halfSpan - lensW / 2, -lensH / 2, lensW, lensH, radius);
  ctx.fill();
  roundRect(ctx,  halfSpan - lensW / 2, -lensH / 2, lensW, lensH, radius);
  ctx.fill();

  // Frame stroke
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = lineW;
  roundRect(ctx, -halfSpan - lensW / 2, -lensH / 2, lensW, lensH, radius);
  ctx.stroke();
  roundRect(ctx,  halfSpan - lensW / 2, -lensH / 2, lensW, lensH, radius);
  ctx.stroke();

  // Bridge between inner edges
  const bridgeGap = eyeSpan * 0.04;
  ctx.beginPath();
  ctx.moveTo(-halfSpan + lensW / 2 + bridgeGap, 0);
  ctx.lineTo( halfSpan - lensW / 2 - bridgeGap, 0);
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = lineW * 0.7;
  ctx.stroke();

  // Arms (temples)
  const armLen = lensW * 0.85;
  ctx.lineWidth = lineW;
  // Left arm
  ctx.beginPath();
  ctx.moveTo(-halfSpan - lensW / 2, 0);
  ctx.lineTo(-halfSpan - lensW / 2 - armLen, lensH * 0.25);
  ctx.stroke();
  // Right arm
  ctx.beginPath();
  ctx.moveTo(halfSpan + lensW / 2, 0);
  ctx.lineTo(halfSpan + lensW / 2 + armLen, lensH * 0.25);
  ctx.stroke();

  ctx.restore();
}
