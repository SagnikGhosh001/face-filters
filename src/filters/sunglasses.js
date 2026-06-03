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

export function drawSunglasses({ landmarks, ctx, videoWidth, videoHeight }) {
  const leftOuter  = toPixel(landmarks[33],  videoWidth, videoHeight);
  const rightOuter = toPixel(landmarks[263], videoWidth, videoHeight);

  const eyeSpan = dist(leftOuter, rightOuter);
  const lensW   = eyeSpan * 0.58;
  const lensH   = lensW * 0.55;
  const radius  = lensW * 0.1;
  const lineW   = Math.max(2.5, eyeSpan * 0.048);

  const midX  = (leftOuter.x + rightOuter.x) / 2;
  const midY  = (leftOuter.y + rightOuter.y) / 2;
  const angle = Math.atan2(rightOuter.y - leftOuter.y, rightOuter.x - leftOuter.x);

  ctx.save();
  ctx.translate(midX, midY);
  ctx.rotate(angle);

  const halfSpan = eyeSpan / 2;

  // Dark gradient lens fill — aviator style
  const makeGrad = (cx) => {
    const g = ctx.createLinearGradient(cx - lensW / 2, -lensH / 2, cx + lensW / 2, lensH / 2);
    g.addColorStop(0,   'rgba(20, 20, 40, 0.92)');
    g.addColorStop(0.5, 'rgba(10, 10, 25, 0.88)');
    g.addColorStop(1,   'rgba(30, 30, 60, 0.85)');
    return g;
  };

  // Left lens fill
  roundRect(ctx, -halfSpan - lensW / 2, -lensH / 2, lensW, lensH, radius);
  ctx.fillStyle = makeGrad(-halfSpan);
  ctx.fill();

  // Right lens fill
  roundRect(ctx, halfSpan - lensW / 2, -lensH / 2, lensW, lensH, radius);
  ctx.fillStyle = makeGrad(halfSpan);
  ctx.fill();

  // Lens shine highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
  const shineH = lensH * 0.28;
  roundRect(ctx, -halfSpan - lensW / 2 + lineW, -lensH / 2 + lineW, lensW - lineW * 2, shineH, radius * 0.5);
  ctx.fill();
  roundRect(ctx,  halfSpan - lensW / 2 + lineW, -lensH / 2 + lineW, lensW - lineW * 2, shineH, radius * 0.5);
  ctx.fill();

  // Frame stroke — thick gold/black
  ctx.strokeStyle = '#c8a83a';
  ctx.lineWidth = lineW;
  roundRect(ctx, -halfSpan - lensW / 2, -lensH / 2, lensW, lensH, radius);
  ctx.stroke();
  roundRect(ctx,  halfSpan - lensW / 2, -lensH / 2, lensW, lensH, radius);
  ctx.stroke();

  // Bridge
  const bridgeGap = eyeSpan * 0.03;
  ctx.beginPath();
  ctx.moveTo(-halfSpan + lensW / 2 + bridgeGap, 0);
  ctx.lineTo( halfSpan - lensW / 2 - bridgeGap, 0);
  ctx.strokeStyle = '#c8a83a';
  ctx.lineWidth = lineW * 0.8;
  ctx.stroke();

  // Arms
  const armLen = lensW * 0.9;
  ctx.lineWidth = lineW;
  ctx.strokeStyle = '#c8a83a';
  ctx.beginPath();
  ctx.moveTo(-halfSpan - lensW / 2, 0);
  ctx.lineTo(-halfSpan - lensW / 2 - armLen, lensH * 0.2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(halfSpan + lensW / 2, 0);
  ctx.lineTo(halfSpan + lensW / 2 + armLen, lensH * 0.2);
  ctx.stroke();

  ctx.restore();
}
