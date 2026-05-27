/* ================================================================
   EventBus — 简单 pub/sub 事件总线
   ================================================================ */
class EventBus {
  constructor() {
    this._handlers = {};
  }

  on(event, handler) {
    (this._handlers[event] = this._handlers[event] || []).push(handler);
    return () => this.off(event, handler);
  }

  off(event, handler) {
    const list = this._handlers[event];
    if (list) this._handlers[event] = list.filter(h => h !== handler);
  }

  emit(event, data) {
    (this._handlers[event] || []).forEach(h => h(data));
  }

  once(event, handler) {
    const wrapper = (data) => { this.off(event, wrapper); handler(data); };
    this.on(event, wrapper);
  }
}

// 全局单例
const EventBus = new EventBus();
window.EventBus = EventBus;
