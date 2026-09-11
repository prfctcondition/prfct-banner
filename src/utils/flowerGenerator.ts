export interface PetalDef {
  angle: number; // in radians
  length: number;
  width: number;
  tipCurveX: number;
  tipCurveY: number;
  highlight: number; // 0..1
  tilt: number;
}

/**
 * Renders the botanical lily artwork onto an offscreen canvas.
 * Accurately models the blooming lily from the avatar with petals, ribs, stamen,
 * fine stippling, and stem.
 */
export function drawProceduralFlower(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number
): void {
  ctx.save();
  ctx.translate(cx, cy);

  // Background deep black
  // Draw Stem and Leaves first
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(size * 0.05, size * 0.35);
  ctx.bezierCurveTo(size * 0.08, size * 0.65, size * 0.12, size * 0.9, size * 0.15, size * 1.15);
  ctx.lineWidth = size * 0.045;
  ctx.strokeStyle = 'rgba(180, 180, 180, 0.7)';
  ctx.stroke();

  // Small leaf bud on stem
  ctx.beginPath();
  ctx.moveTo(size * 0.09, size * 0.65);
  ctx.bezierCurveTo(size * 0.18, size * 0.62, size * 0.22, size * 0.75, size * 0.12, size * 0.85);
  ctx.bezierCurveTo(size * 0.08, size * 0.8, size * 0.08, size * 0.7, size * 0.09, size * 0.65);
  const leafGrad = ctx.createLinearGradient(size * 0.09, size * 0.65, size * 0.22, size * 0.75);
  leafGrad.addColorStop(0, 'rgba(230, 230, 230, 0.9)');
  leafGrad.addColorStop(0.5, 'rgba(120, 120, 120, 0.6)');
  leafGrad.addColorStop(1, 'rgba(20, 20, 20, 0.8)');
  ctx.fillStyle = leafGrad;
  ctx.fill();
  ctx.restore();

  // Petals configurations: angle, length, width, curve, rib angle
  // 6 principal petals matching the lily morphology
  const petals: PetalDef[] = [
    // Top upright petal (slight curve to right)
    { angle: -Math.PI / 2 + 0.08, length: size * 0.92, width: size * 0.36, tipCurveX: 0.12, tipCurveY: -0.05, highlight: 0.95, tilt: 0.05 },
    // Upper-left petal (broad, reaching wide)
    { angle: -Math.PI * 0.82, length: size * 0.85, width: size * 0.38, tipCurveX: -0.15, tipCurveY: 0.08, highlight: 0.9, tilt: -0.1 },
    // Upper-right petal
    { angle: -Math.PI * 0.18, length: size * 0.88, width: size * 0.42, tipCurveX: 0.18, tipCurveY: 0.05, highlight: 0.98, tilt: 0.08 },
    // Lower-left petal (spreading low)
    { angle: Math.PI * 0.78, length: size * 0.82, width: size * 0.35, tipCurveX: -0.1, tipCurveY: 0.12, highlight: 0.85, tilt: -0.08 },
    // Lower-right petal (overlapping)
    { angle: Math.PI * 0.25, length: size * 0.86, width: size * 0.4, tipCurveX: 0.14, tipCurveY: 0.1, highlight: 0.92, tilt: 0.06 },
    // Bottom center-left petal
    { angle: Math.PI * 0.52, length: size * 0.8, width: size * 0.34, tipCurveX: -0.05, tipCurveY: 0.15, highlight: 0.8, tilt: -0.04 }
  ];

  // Draw background shadow layer
  petals.forEach((p) => {
    drawSinglePetal(ctx, p, size, true);
  });

  // Draw main petals with shading, highlights, and stippling ribs
  petals.forEach((p) => {
    drawSinglePetal(ctx, p, size, false);
  });

  // Center throat / pistil and stamens
  drawLilyCenter(ctx, size);

  ctx.restore();
}

function drawSinglePetal(
  ctx: CanvasRenderingContext2D,
  petal: PetalDef,
  size: number,
  isShadow: boolean
) {
  ctx.save();
  ctx.rotate(petal.angle);

  const len = petal.length;
  const w = petal.width;
  const tipX = petal.tipCurveX * size;
  const tipY = len + petal.tipCurveY * size;

  ctx.beginPath();
  ctx.moveTo(0, 0); // Center throat

  // Left curve of petal
  ctx.bezierCurveTo(
    -w * 0.7, len * 0.25,
    -w * 0.8, len * 0.7,
    tipX, tipY
  );

  // Right curve of petal
  ctx.bezierCurveTo(
    w * 0.8, len * 0.7,
    w * 0.7, len * 0.25,
    0, 0
  );
  ctx.closePath();

  if (isShadow) {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.95)';
    ctx.fill();
    ctx.restore();
    return;
  }

  // Gradient fill across petal
  const grad = ctx.createLinearGradient(0, 0, tipX, tipY);
  const baseAlpha = petal.highlight;
  grad.addColorStop(0, 'rgba(40, 40, 40, 0.95)');
  grad.addColorStop(0.2, `rgba(160, 160, 160, ${baseAlpha * 0.7})`);
  grad.addColorStop(0.55, `rgba(245, 245, 245, ${baseAlpha})`);
  grad.addColorStop(0.85, `rgba(255, 255, 255, ${baseAlpha})`);
  grad.addColorStop(1, `rgba(220, 220, 220, ${baseAlpha * 0.85})`);

  ctx.fillStyle = grad;
  ctx.fill();

  // Draw central petal midrib line
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-w * 0.05, len * 0.35, tipX * 0.5, len * 0.7, tipX, tipY);
  ctx.lineWidth = size * 0.015;
  ctx.strokeStyle = 'rgba(25, 25, 25, 0.75)';
  ctx.stroke();

  // Draw stippled speckled dots / papillae along the midrib (typical in lilies / avatars)
  const speckleCount = 18;
  for (let i = 0; i < speckleCount; i++) {
    const t = 0.2 + (i / speckleCount) * 0.45;
    const ribX = -w * 0.05 * (1 - t) + tipX * 0.5 * t;
    const ribY = len * t;
    const jitterX = (Math.sin(i * 3.7) * w * 0.15);
    const jitterY = (Math.cos(i * 2.3) * len * 0.04);

    ctx.beginPath();
    ctx.arc(ribX + jitterX, ribY + jitterY, size * 0.008 + (Math.sin(i) * 0.004 * size), 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(20, 20, 20, 0.85)';
    ctx.fill();
  }

  // Petal edge definition
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.stroke();

  ctx.restore();
}

function drawLilyCenter(ctx: CanvasRenderingContext2D, size: number) {
  // Deep throat darkness
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.08, 0, Math.PI * 2);
  ctx.fillStyle = '#000000';
  ctx.fill();

  // Long arching stamens (filaments) and anthers
  const stamens = [
    { angle: -1.2, len: size * 0.35, antherAngle: 0.3 },
    { angle: -0.6, len: size * 0.42, antherAngle: -0.2 },
    { angle: 0.1,  len: size * 0.44, antherAngle: 0.4 },
    { angle: 0.7,  len: size * 0.38, antherAngle: -0.3 },
    { angle: 1.4,  len: size * 0.32, antherAngle: 0.1 },
  ];

  stamens.forEach(st => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    const endX = Math.cos(st.angle) * st.len;
    const endY = Math.sin(st.angle) * st.len;
    const cpX = Math.cos(st.angle + 0.2) * (st.len * 0.55);
    const cpY = Math.sin(st.angle + 0.2) * (st.len * 0.55);

    ctx.quadraticCurveTo(cpX, cpY, endX, endY);
    ctx.lineWidth = size * 0.012;
    ctx.strokeStyle = '#f0f0f0';
    ctx.stroke();

    // Dark elongated anther at the filament tip
    ctx.save();
    ctx.translate(endX, endY);
    ctx.rotate(st.angle + st.antherAngle + Math.PI / 2);
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.02, size * 0.045, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#111111';
    ctx.fill();
    ctx.lineWidth = size * 0.006;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  });
}
