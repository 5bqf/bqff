/* ================================================================
   照片褶 — 3D卡片堆叠 + 扇面铺开 + 滑动查看器 v3
   ================================================================ */

let photoInit = false;

function initPhotoFold() {
  if (photoInit) return;
  photoInit = true;

  const stack = document.getElementById('photo-stack');
  const fan = document.getElementById('photo-fan');
  const uploadBtn = document.getElementById('photo-upload-btn');
  const fileInp = document.getElementById('photo-file-input');
  const viewer = document.getElementById('photo-viewer');
  const viewerImg = document.getElementById('viewer-img');
  const viewerClose = document.getElementById('viewer-close');
  const viewerPrev = document.getElementById('viewer-prev');
  const viewerNext = document.getElementById('viewer-next');
  const viewerDel = document.getElementById('viewer-delete');

  let viewerIdx = -1;

  function render() {
    renderStack();
    renderFan();
  }

  function renderStack() {
    if (!stack) return;
    const photos = AppState.photos;
    if (!photos.length) {
      stack.innerHTML = '<div class="photo-stack-empty">📷<br>点击上传照片</div>';
      return;
    }
    stack.innerHTML = photos.slice(-5).reverse().map((p, i) =>
      `<img src="${p.thumb}" class="stack-card" data-pid="${p.id}" alt="photo">`
    ).join('');
    stack.querySelectorAll('.stack-card').forEach(img => {
      img.addEventListener('click', () => {
        viewerIdx = AppState.photos.findIndex(p => p.id === img.dataset.pid);
        openViewer(img.dataset.pid);
      });
    });
  }

  function renderFan() {
    if (!fan) return;
    const photos = AppState.photos;
    if (!photos.length) {
      fan.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text3);font-size:13px;">上传照片后在此扇面展开</div>';
      return;
    }
    const fw = fan.clientWidth || 340;
    const fh = fan.clientHeight || 440;
    const cx = fw / 2, cy = fh * 0.32;
    const rx = fw * 0.42, ry = fh * 0.36;
    const sa = -Math.PI * 0.55, ea = Math.PI * 0.55;

    fan.innerHTML = photos.map((p, i) => {
      const angle = photos.length === 1 ? 0 : sa + (i / (photos.length - 1)) * (ea - sa);
      const x = cx + Math.cos(angle) * rx;
      const y = cy + Math.sin(angle) * ry - 30;
      const rot = (angle * 180 / Math.PI) * 0.3;
      return `<div class="fan-item" style="left:${x}px;top:${y}px;--fan-rot:${rot}deg;animation-delay:${i * 0.05}s;" data-pid="${p.id}">
        <img src="${p.thumb}" alt="photo">
        ${p.note ? `<div class="fan-note">${escapeHtml(p.note)}</div>` : ''}
      </div>`;
    }).join('');

    fan.querySelectorAll('.fan-item').forEach(item => {
      item.addEventListener('click', () => {
        viewerIdx = AppState.photos.findIndex(p => p.id === item.dataset.pid);
        openViewer(item.dataset.pid);
      });
    });
  }

  function openViewer(pid) {
    const p = AppState.photos.find(p => p.id === pid);
    if (!p) return;
    viewerImg.src = p.dataUrl;
    viewer.classList.remove('hidden');
    const has = AppState.photos.length > 1;
    viewerPrev.style.display = has ? '' : 'none';
    viewerNext.style.display = has ? '' : 'none';
  }

  function navViewer(d) {
    const photos = AppState.photos;
    if (photos.length < 2) return;
    viewerIdx = (viewerIdx + d + photos.length) % photos.length;
    viewerImg.src = photos[viewerIdx].dataUrl;
  }

  viewerClose.addEventListener('click', () => viewer.classList.add('hidden'));
  viewer.addEventListener('click', e => { if (e.target === viewer) viewer.classList.add('hidden'); });
  viewerPrev.addEventListener('click', e => { e.stopPropagation(); navViewer(-1); });
  viewerNext.addEventListener('click', e => { e.stopPropagation(); navViewer(1); });

  viewerDel.addEventListener('click', () => {
    const photos = AppState.photos;
    if (viewerIdx >= 0 && viewerIdx < photos.length) {
      AppActions.removePhoto(photos[viewerIdx].id);
      viewer.classList.add('hidden');
      render();
      showToast('照片已删除');
    }
  });

  // 触摸滑动
  let tsx = 0;
  viewer.addEventListener('touchstart', e => { tsx = e.touches[0].clientX; }, { passive: true });
  viewer.addEventListener('touchend', e => {
    if (Math.abs(e.changedTouches[0].clientX - tsx) > 50) navViewer(e.changedTouches[0].clientX < tsx ? 1 : -1);
  });

  if (uploadBtn) uploadBtn.addEventListener('click', () => fileInp.click());
  if (fileInp) fileInp.addEventListener('change', async () => {
    const files = fileInp.files;
    if (!files || !files.length) return;
    showToast('处理中...');
    for (const f of files) {
      try {
        const du = await fileToDataUrl(f);
        const thumb = await compressImage(du, 400, 0.7);
        const note = prompt('添加备注（可选）：', '') || '';
        AppActions.addPhoto(du, thumb, note);
      } catch (e) { showToast('上传失败'); }
    }
    fileInp.value = '';
    render();
    showToast(`已添加 ${files.length} 张照片`);
  });

  EventBus.on('photos:changed', render);
  render();
}

window.initPhotoFold = initPhotoFold;
