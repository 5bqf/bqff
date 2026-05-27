/* ================================================================
   Gesture — 触摸路径追踪 + DTW 爱心形状匹配
   ================================================================ */

const GestureRecognizer = {
  MIN_POINTS: 20,
  MAX_POINTS: 200,
  SAMPLE_INTERVAL: 16,
  CONFIDENCE_THRESHOLD: 0.65,

  // 预计算爱心模板
  _templates: null,

  init() {
    if (this._templates) return;
    this._templates = {
      round:   this._makeTemplate(64),
      angular: null,
      simple:  this._makeTemplate(32),
    };
    this._templates.angular = this._distort(this._templates.round, 0.25);
  },

  _makeTemplate(numPoints) {
    const raw = generateHeartCurve(numPoints);
    // 归一化
    const maxDim = Math.max(...raw.map(p => Math.max(Math.abs(p.x), Math.abs(p.y))));
    return raw.map(p => ({ x: p.x / maxDim, y: p.y / maxDim }));
  },

  _distort(template, amount) {
    return template.map(p => ({
      x: p.x + (Math.random() - 0.5) * amount,
      y: p.y + (Math.random() - 0.5) * amount,
    }));
  },

  // 归一化输入路径
  normalizePath(points) {
    if (points.length < 2) return points;

    // 平移到原点
    const cx = (points.reduce((s, p) => s + p.x, 0) / points.length);
    const cy = (points.reduce((s, p) => s + p.y, 0) / points.length);
    let translated = points.map(p => ({ x: p.x - cx, y: p.y - cy }));

    // 缩放到单位框
    const maxDim = Math.max(
      ...translated.map(p => Math.max(Math.abs(p.x), Math.abs(p.y)))
    );
    if (maxDim > 0) {
      translated = translated.map(p => ({
        x: p.x / maxDim,
        y: p.y / maxDim,
      }));
    }

    // 重采样到固定点数
    return this._resample(translated, 64);
  },

  _resample(points, targetCount) {
    if (points.length <= 1) return points;

    // 计算路径总长度
    const segLengths = [];
    let totalLen = 0;
    for (let i = 1; i < points.length; i++) {
      const d = dist(points[i - 1].x, points[i - 1].y, points[i].x, points[i].y);
      segLengths.push(d);
      totalLen += d;
    }

    const interval = totalLen / (targetCount - 1);
    const result = [points[0]];
    let accumulated = 0;
    let segIdx = 0;

    for (let i = 1; i < targetCount - 1; i++) {
      const targetDist = i * interval;
      while (accumulated + segLengths[segIdx] < targetDist && segIdx < segLengths.length - 1) {
        accumulated += segLengths[segIdx];
        segIdx++;
      }
      if (segIdx >= segLengths.length) break;

      const t = (targetDist - accumulated) / Math.max(segLengths[segIdx], 0.001);
      const clampedT = clamp(t, 0, 1);
      result.push({
        x: lerp(points[segIdx].x, points[segIdx + 1].x, clampedT),
        y: lerp(points[segIdx].y, points[segIdx + 1].y, clampedT),
      });
    }
    result.push(points[points.length - 1]);
    return result;
  },

  // DTW 计算两条路径距离
  dtwDistance(pathA, pathB) {
    const n = pathA.length;
    const m = pathB.length;
    const dtw = new Array(n);
    for (let i = 0; i < n; i++) {
      dtw[i] = new Float64Array(m);
      dtw[i].fill(Infinity);
    }
    dtw[0][0] = 0;

    for (let i = 1; i < n; i++) {
      for (let j = 1; j < m; j++) {
        const cost = Math.hypot(
          pathA[i].x - pathB[j].x,
          pathA[i].y - pathB[j].y
        );
        dtw[i][j] = cost + Math.min(dtw[i - 1][j], dtw[i][j - 1], dtw[i - 1][j - 1]);
      }
    }
    return dtw[n - 1][m - 1] / (n + m);
  },

  // 评估输入路径是否为爱心
  evaluate(inputPath) {
    this.init();

    if (inputPath.length < this.MIN_POINTS) {
      return { confidence: 0, reason: 'too_short' };
    }

    const normalized = this.normalizePath(inputPath);
    const templates = [this._templates.round, this._templates.angular, this._templates.simple];
    const distances = templates.map(t => this.dtwDistance(normalized, t));
    const minDistance = Math.min(...distances);

    // 距离 → 信心值映射（经经验校准）
    const confidence = Math.max(0, Math.min(1, 1 - minDistance * 2.5));

    return { confidence, distance: minDistance };
  },

  // 收集触摸点
  createCollector() {
    const buffer = [];
    let lastTime = 0;

    return {
      addPoint(x, y) {
        const now = performance.now();
        if (buffer.length === 0 || (now - lastTime) >= GestureRecognizer.SAMPLE_INTERVAL) {
          if (buffer.length < GestureRecognizer.MAX_POINTS) {
            buffer.push({ x, y, t: now });
            lastTime = now;
          }
        }
      },
      clear() {
        buffer.length = 0;
      },
      evaluate() {
        return GestureRecognizer.evaluate(buffer);
      },
      getPoints() {
        return buffer;
      },
      get length() {
        return buffer.length;
      },
    };
  },
};
