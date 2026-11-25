// Confetti for the end of a session. Lightweight canvas animation, stops by itself.

export function confetti(ms = 2600) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = document.createElement('canvas');
  c.id = 'confetti';
  document.body.appendChild(c);
  const ctx = c.getContext('2d');
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const W = innerWidth, H = innerHeight;
  c.width = W * dpr; c.height = H * dpr;
  ctx.scale(dpr, dpr);
  const colors = ['#C0392B', '#F2A22C', '#23784A', '#2F78B7', '#D63A6A', '#F7C744'];
  const parts = Array.from({ length: 90 }, () => ({
    x: Math.random() * W, y: -20 - Math.random() * H * 0.5,
    vx: (Math.random() - 0.5) * 2.4, vy: 2 + Math.random() * 3.5,
    r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
    w: 6 + Math.random() * 6, h: 8 + Math.random() * 8,
    color: colors[(Math.random() * colors.length) | 0],
  }));
  const start = performance.now();
  function frame(now) {
    ctx.clearRect(0, 0, W, H);
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy; p.r += p.vr; p.vy += 0.03;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.color; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (now - start < ms) requestAnimationFrame(frame);
    else c.remove();
  }
  requestAnimationFrame(frame);
}
