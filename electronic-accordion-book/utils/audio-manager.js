/* ================================================================
   Audio Manager — Web Audio API 封装
   ================================================================ */

class AudioManager {
  constructor() {
    this.audioContext = null;
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.analyser = null;
    this.source = null;
    this.audioBuffer = null;
    this.startTime = 0;
    this.pauseOffset = 0;
    this.duration = 0;
    this.onUpdate = null;  // (currentTime, duration) => {}
    this.onWaveform = null; // (dataArray) => {}

    this._rafId = null;
    this.state = 'idle'; // idle | recording | playing | paused
  }

  _ensureContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  // --- 录音 ---
  async startRecording() {
    this._ensureContext();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream, { mimeType: this._getMimeType() });
    this.recordedChunks = [];

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.recordedChunks.push(e.data);
    };

    this.mediaRecorder.start(100); // 每100ms收集一次
    this.state = 'recording';
    return stream;
  }

  stopRecording() {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) return resolve(null);

      this.mediaRecorder.onstop = async () => {
        // 停止所有音轨
        const tracks = this.mediaRecorder.stream.getTracks();
        tracks.forEach(t => t.stop());

        const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
        const dataUrl = await this._blobToDataUrl(blob);
        const audioBuffer = await this._decodeBlob(blob);
        const waveform = audioBuffer ? this._extractWaveform(audioBuffer) : [];

        this.audioBuffer = audioBuffer;
        this.duration = audioBuffer ? audioBuffer.duration : 0;
        this.state = 'idle';
        resolve({ dataUrl, blob, waveform, duration: this.duration });
      };

      this.mediaRecorder.stop();
    });
  }

  // --- 播放 ---
  async playFromBuffer(audioBuffer) {
    if (!audioBuffer) return;
    this._ensureContext();
    this.stop();

    this.audioBuffer = audioBuffer;
    this.duration = audioBuffer.duration;

    this.source = this.audioContext.createBufferSource();
    this.source.buffer = audioBuffer;

    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    this.source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);

    this.source.start(0, this.pauseOffset);
    this.startTime = this.audioContext.currentTime - this.pauseOffset;
    this.state = 'playing';
    this._startUpdateLoop();
  }

  async playFromDataUrl(dataUrl) {
    const buffer = await this._dataUrlToBuffer(dataUrl);
    return this.playFromBuffer(buffer);
  }

  pause() {
    if (this.state !== 'playing') return;
    this.pauseOffset += this.audioContext.currentTime - this.startTime;
    if (this.source) { this.source.stop(); this.source = null; }
    this.state = 'paused';
    this._stopUpdateLoop();
  }

  resume() {
    if (this.state !== 'paused' || !this.audioBuffer) return;
    this.playFromBuffer(this.audioBuffer);
  }

  stop() {
    if (this.source) {
      try { this.source.stop(); } catch (e) { /* 可能已经停止 */ }
      this.source = null;
    }
    this.state = 'idle';
    this.pauseOffset = 0;
    this._stopUpdateLoop();
  }

  seek(time) {
    const wasPlaying = this.state === 'playing';
    this.pauseOffset = clamp(time, 0, this.duration);
    if (this.source) { try { this.source.stop(); } catch (e) { } }
    if (wasPlaying && this.audioBuffer) {
      this.playFromBuffer(this.audioBuffer);
    }
  }

  getCurrentTime() {
    if (this.state === 'playing') {
      return this.audioContext.currentTime - this.startTime;
    }
    return this.pauseOffset;
  }

  // --- 内部 ---
  _startUpdateLoop() {
    this._stopUpdateLoop();
    const loop = () => {
      if (this.state !== 'playing') { this._stopUpdateLoop(); return; }
      const current = this.getCurrentTime();

      if (this.onUpdate) this.onUpdate(current, this.duration);

      if (this.analyser && this.onWaveform) {
        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(dataArray);
        this.onWaveform(dataArray);
      }

      if (current >= this.duration) {
        this.stop();
        if (this.onUpdate) this.onUpdate(this.duration, this.duration);
      } else {
        this._rafId = requestAnimationFrame(loop);
      }
    };
    this._rafId = requestAnimationFrame(loop);
  }

  _stopUpdateLoop() {
    if (this._rafId) { cancelAnimationFrame(this._rafId); this._rafId = null; }
  }

  _getMimeType() {
    const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
    for (const t of types) {
      if (MediaRecorder.isTypeSupported(t)) return t;
    }
    return 'audio/webm';
  }

  _blobToDataUrl(blob) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  async _decodeBlob(blob) {
    try {
      const ctx = this._ensureContext();
      const arrayBuffer = await blob.arrayBuffer();
      return await ctx.decodeAudioData(arrayBuffer);
    } catch (e) {
      console.warn('Audio decode failed:', e.message);
      return null;
    }
  }

  async _dataUrlToBuffer(dataUrl) {
    const resp = await fetch(dataUrl);
    const arrayBuffer = await resp.arrayBuffer();
    const ctx = this._ensureContext();
    return ctx.decodeAudioData(arrayBuffer);
  }

  _extractWaveform(audioBuffer, bins = 80) {
    const channel = audioBuffer.getChannelData(0);
    const step = Math.floor(channel.length / bins);
    const waveform = [];
    for (let i = 0; i < bins; i++) {
      let max = 0;
      for (let j = 0; j < step; j++) {
        const val = Math.abs(channel[i * step + j] || 0);
        if (val > max) max = val;
      }
      waveform.push(max);
    }
    // 归一化
    const maxAmp = Math.max(...waveform, 0.01);
    return waveform.map(v => v / maxAmp);
  }

  destroy() {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
