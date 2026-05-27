/* ================================================================
   Ambient Music — Web Audio API 环境音乐生成器
   生成柔和的粉紫色系氛围音乐，无需外部音频文件
   ================================================================ */

class AmbientMusic {
  constructor() {
    this.ctx = null;
    this.playing = false;
    this._oscillators = [];
    this._gainNodes = [];
    this._lfoNodes = [];
    this._masterGain = null;
    this._filterNode = null;
  }

  _ensureContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // 生成柔和的环境音景
  start() {
    if (this.playing) return;
    this._ensureContext();

    const now = this.ctx.currentTime;

    // 主音量（轻柔）
    this._masterGain = this.ctx.createGain();
    this._masterGain.gain.setValueAtTime(0, now);
    this._masterGain.gain.linearRampToValueAtTime(0.08, now + 1.5);
    this._masterGain.connect(this.ctx.destination);

    // 低通滤波器
    this._filterNode = this.ctx.createBiquadFilter();
    this._filterNode.type = 'lowpass';
    this._filterNode.frequency.setValueAtTime(600, now);
    this._filterNode.Q.setValueAtTime(0.7, now);
    this._filterNode.connect(this._masterGain);

    // 和弦音阶（C大调柔和版: C4=262, E4=330, G4=392, A4=440, C5=523）
    const chord = [261.6, 329.6, 392.0, 440.0, 523.2];

    chord.forEach((freq, i) => {
      // 主振荡器 — 正弦波
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // LFO 轻微频率调制
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(freq * 0.003, now); // 微颤

      const lfo = this.ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.1 + Math.random() * 0.3, now); // 慢速LFO
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(now + i * 0.5);
      this._lfoNodes.push(lfo, lfoGain);

      // 每个音的音量渐变
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      // 错开淡入
      const fadeInTime = now + 1 + i * 0.8;
      gain.gain.linearRampToValueAtTime(0.03 + Math.random() * 0.02, fadeInTime);

      osc.connect(gain);
      gain.connect(this._filterNode);
      osc.start(now + i * 0.3);

      this._oscillators.push(osc);
      this._gainNodes.push(gain);
    });

    // 添加微妙的噪声层（模拟风声/氛围）
    this._addNoiseLayer(now);

    this.playing = true;
  }

  _addNoiseLayer(now) {
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.02;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // 带通滤波噪声
    const bpFilter = this.ctx.createBiquadFilter();
    bpFilter.type = 'bandpass';
    bpFilter.frequency.setValueAtTime(300, now);
    bpFilter.Q.setValueAtTime(0.3, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.015, now + 2);

    noise.connect(bpFilter);
    bpFilter.connect(noiseGain);
    noiseGain.connect(this._masterGain);
    noise.start(now);

    this._oscillators.push(noise);
    this._gainNodes.push(noiseGain, bpFilter);
  }

  stop() {
    if (!this.playing) return;
    const now = this.ctx ? this.ctx.currentTime : 0;

    // 淡出
    if (this._masterGain) {
      this._masterGain.gain.linearRampToValueAtTime(0, now + 1.5);
    }

    setTimeout(() => {
      this._oscillators.forEach(o => { try { o.stop(); } catch (e) { /* already stopped */ } });
      this._lfoNodes.forEach(l => { try { l.stop(); } catch (e) { } });
      this._oscillators = [];
      this._gainNodes = [];
      this._lfoNodes = [];
      this._masterGain = null;
      this._filterNode = null;
      this.playing = false;
    }, 1600);
  }

  toggle() {
    if (this.playing) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  destroy() {
    this.stop();
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

window.AmbientMusic = AmbientMusic;
