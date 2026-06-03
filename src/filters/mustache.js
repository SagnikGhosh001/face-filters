function toPixel(lm, w, h) {
  return { x: lm.x * w, y: lm.y * h };
}

function dist(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function drawMustache({ landmarks, ctx, videoWidth, videoHeight }) {
  const upperLip   = toPixel(landmarks[0],   videoWidth, videoHeight); // top edge of upper lip
  const leftCorner = toPixel(landmarks[61],  videoWidth, videoHeight);
  const rightCorner= toPixel(landmarks[291], videoWidth, videoHeight);

  const mouthWidth = dist(leftCorner, rightCorner);
  const angle      = Math.atan2(rightCorner.y - leftCorner.y, rightCorner.x - leftCorner.x);

  // Mustache dimensions relative to mouth width
  const mW  = mouthWidth * 1.1;   // total mustache width
  const mH  = mouthWidth * 0.28;  // max mustache height

  // Anchor at the top edge of the upper lip — mustache sits just above it
  const cx = upperLip.x;
  const cy = upperLip.y - mH * 0.15;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);

  ctx.fillStyle = '#2a1a0a';
  ctx.strokeStyle = '#1a0d00';
  ctx.lineWidth = 1;

  // Left half — curls left and down
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(
    -mW * 0.15, -mH * 0.6,   // cp1
    -mW * 0.38, -mH * 0.9,   // cp2
    -mW * 0.42, -mH * 0.5    // end: outer top-left
  );
  ctx.bezierCurveTo(
    -mW * 0.5,  -mH * 0.1,   // cp1
    -mW * 0.48,  mH * 0.25,  // cp2
    -mW * 0.35,  mH * 0.3    // end: outer bottom-left
  );
  ctx.bezierCurveTo(
    -mW * 0.2,   mH * 0.35,  // cp1
    -mW * 0.05,  mH * 0.15,  // cp2
    0,           mH * 0.1    // end: center bottom
  );
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Right half — mirror of left
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(
     mW * 0.15, -mH * 0.6,
     mW * 0.38, -mH * 0.9,
     mW * 0.42, -mH * 0.5
  );
  ctx.bezierCurveTo(
     mW * 0.5,  -mH * 0.1,
     mW * 0.48,  mH * 0.25,
     mW * 0.35,  mH * 0.3
  );
  ctx.bezierCurveTo(
     mW * 0.2,   mH * 0.35,
     mW * 0.05,  mH * 0.15,
     0,          mH * 0.1
  );
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}
