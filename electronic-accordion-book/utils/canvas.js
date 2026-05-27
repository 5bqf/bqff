/* ================================================================
   Canvas Utils — DPR 缩放、绘制辅助
   ================================================================ */

// 初始化高 DPI Canvas
function initHiDPICanvas(canvas, displayWidth, displayHeight) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = displayWidth * dpr;
  canvas.height = displayHeight * dpr;
  canvas.style.width = displayWidth + 'px';
  canvas.style.height = displayHeight + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return { ctx, width: displayWidth, height: displayHeight, dpr };
}

// 清空画布
function clearCanvas(ctx, w, h) {
  ctx.clearRect(0, 0, w, h);
}

// 绘制圆角矩形
function drawRoundRect(ctx, x, y, w, h, r) {
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

// 在 Canvas 中绘制适配图像
function drawImageFit(ctx, img, x, y, w, h) {
  const imgRatio = img.width / img.height;
  const boxRatio = w / h;
  let sx = 0, sy = 0, sw = img.width, sh = img.height;

  if (imgRatio > boxRatio) {
    sw = img.height * boxRatio;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / boxRatio;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

// 加载图片
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// 从 Canvas 获取 ImageData 的 alpha 通道采样
function sampleAlphaChannel(ctx, canvasWidth, canvasHeight, sampleRate = 4) {
  const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  let transparent = 0;
  let total = 0;

  for (let y = 0; y < imageData.height; y += sampleRate) {
    for (let x = 0; x < imageData.width; x += sampleRate) {
      const alpha = imageData.data[(y * canvasWidth + x) * 4 + 3];
      if (alpha === 0) transparent++;
      total++;
    }
  }
  return transparent / Math.max(total, 1);
}
