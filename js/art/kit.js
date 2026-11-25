// Drawing kit: tiny helpers that return SVG strings.
// Every picture uses a 100 × 100 canvas, flat shapes, and the palette below — so all pictures look like one family.

export const C = {
  ink: '#3B2A20', line: '#CDBDA8',
  white: '#FFFFFF', cream: '#FFF1D6', paper: '#FFF8EC',
  steel: '#B9C5CE', steelD: '#7E8D98', steelL: '#E2E8EC',
  wood: '#C98B50', woodD: '#94602F', woodL: '#E2B07A',
  red: '#DA4A3C', redD: '#A93427', pink: '#F4A6A6', pinkD: '#E07C82',
  orange: '#F28C28', orangeD: '#C96A12', yellow: '#F7C744', yellowD: '#D9A31C',
  green: '#5BA552', greenD: '#2F7A3B', greenL: '#A6D785', olive: '#8A9A3B',
  brown: '#7B4A2A', brownL: '#A9703F', tan: '#D9B27C', sand: '#EDD9B0',
  blue: '#3D7CC9', blueD: '#285A99', blueL: '#A9D3F5', water: '#7EC8F0',
  purple: '#8E5BA8', black: '#363636', grey: '#9AA0A6', greyL: '#D5D9DC',
  skin: '#E8B48A', skinD: '#C98D60',
  flame: '#FF7A1A', flameY: '#FFC93C',
};

const f = (n) => Math.round(n * 10) / 10;

export const svg = (...parts) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" focusable="false">${parts.join('')}</svg>`;

export const g = (transform, ...parts) => `<g transform="${transform}">${parts.join('')}</g>`;
export const rot = (deg, cx, cy, ...parts) => g(`rotate(${deg} ${cx} ${cy})`, ...parts);

export const rect = (x, y, w, h, fill, rx = 0, extra = '') =>
  `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="${fill}" ${extra}/>`;
export const circle = (cx, cy, r, fill, extra = '') =>
  `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${fill}" ${extra}/>`;
export const ell = (cx, cy, rx, ry, fill, deg = 0, extra = '') =>
  `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${deg ? ` transform="rotate(${deg} ${f(cx)} ${f(cy)})"` : ''} ${extra}/>`;
export const path = (d, fill, extra = '') => `<path d="${d}" fill="${fill}" ${extra}/>`;
export const stroke = (d, color, w = 3, extra = '') =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
export const line = (x1, y1, x2, y2, color, w = 3) => stroke(`M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}`, color, w);
export const poly = (pts, fill, extra = '') => `<polygon points="${pts}" fill="${fill}" ${extra}/>`;
export const text = (x, y, s, size = 20, fill = C.ink, weight = 800) =>
  `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="middle" dominant-baseline="central">${s}</text>`;
export const outlined = (shapes, color = C.line, w = 3) =>
  // Draw shapes twice: first with a thick outline, then clean on top → one outline around the union.
  `<g stroke="${color}" stroke-width="${w}" stroke-linejoin="round">${shapes}</g>${shapes}`;

export const shadow = (cx = 50, cy = 92, rx = 34) => ell(cx, cy, rx, 3.5, 'rgba(60,40,20,.10)');

// Seeded random numbers, so scattered dots look the same every time.
export function rng(seed = 1) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
export function scatter(n, x, y, w, h, draw, seed = 3) {
  const r = rng(seed);
  let out = '';
  for (let i = 0; i < n; i++) out += draw(x + r() * w, y + r() * h, r(), i);
  return out;
}

// ---------- Containers ----------
export const bowl = (cx = 50, cy = 66, w = 60, color = C.white, rim = C.steelD) =>
  path(`M${cx - w / 2} ${cy}h${w}q0 ${w * 0.42} ${-w / 2} ${w * 0.42}q${-w / 2} 0 ${-w / 2} ${-w * 0.42}z`, color, `stroke="${rim}" stroke-width="2.5"`) ;

export const plate = (cx = 50, cy = 70, rx = 40, ry = 12) =>
  ell(cx, cy + 2, rx, ry, C.line) + ell(cx, cy, rx, ry, C.white, 0, `stroke="${C.line}" stroke-width="2"`) + ell(cx, cy, rx * 0.65, ry * 0.6, C.paper);

export const jar = (fill, lid = C.red, label = C.cream, x = 30, y = 26, w = 40, h = 56) =>
  rect(x - 2, y - 10, w + 4, 12, lid, 4) + rect(x, y, w, h, '#EAF2F6', 8, `stroke="${C.steel}" stroke-width="2"`) +
  rect(x + 3, y + 14, w - 6, h - 17, fill, 6) + rect(x + 5, y + h * 0.42, w - 10, 14, label, 3);

export const pile = (cx, cy, w, h, fill) => path(`M${cx - w / 2} ${cy}q${w / 2} ${-h * 2} ${w} 0z`, fill);

export const pot = (cx = 50, cy = 60, w = 56, h = 32, color = C.steel) =>
  rect(cx - w / 2 - 9, cy + 2, 10, 5, C.black, 2.5) + rect(cx + w / 2 - 1, cy + 2, 10, 5, C.black, 2.5) +
  rect(cx - w / 2, cy, w, h, color, 6) + rect(cx - w / 2 - 3, cy - 3, w + 6, 6, C.steelD, 3) +
  rect(cx - w / 2 + 5, cy + 7, 5, h - 14, 'rgba(255,255,255,.45)', 2.5);

export const pan = (cx = 44, cy = 64, w = 56, color = C.black) =>
  rect(cx + w / 2 - 2, cy - 2, 34, 7, C.black, 3.5) + path(`M${cx - w / 2} ${cy - 4}h${w}l-4 12h${-w + 8}z`, color) +
  ell(cx, cy - 4, w / 2, 4, '#555');

export const flame = (cx, cy, s = 1) =>
  g(`translate(${cx} ${cy}) scale(${s})`,
    path('M0 -16C8 -8 10 -2 8 4C6 9 -6 9 -8 4C-10 -2 -4 -6 -3 -11C-1 -7 1 -6 0 -16z', C.flame),
    path('M0 -6C4 -2 5 1 3 4C1 6 -2 6 -3 4C-4 1 -2 -1 0 -6z', C.flameY));

export const flames = (cx, cy, n = 3, gap = 12, s = 0.8) => {
  let o = '';
  for (let i = 0; i < n; i++) o += flame(cx + (i - (n - 1) / 2) * gap, cy, s);
  return o;
};

export const steam = (x, y, n = 3, gap = 10, color = '#B7C3CB') => {
  let o = '';
  for (let i = 0; i < n; i++) {
    const sx = x + (i - (n - 1) / 2) * gap;
    o += stroke(`M${sx} ${y}c-5 -5 5 -9 0 -14c-5 -5 5 -9 0 -14`, color, 3);
  }
  return o;
};

export const bubbles = (cx, cy, w, color = '#FFFFFF', seed = 5) =>
  scatter(7, cx - w / 2, cy - 6, w, 10, (x, y, r) => circle(x, y, 1.6 + r * 2.4, color, `stroke="${C.steelD}" stroke-width="1"`), seed);

export const drops = (x, y, color = C.water, s = 1) =>
  g(`translate(${x} ${y}) scale(${s})`, path('M0 -7C4 -2 5 1 5 3A5 5 0 0 1 -5 3C-5 1 -4 -2 0 -7z', color));

export const board = (x = 12, y = 56, w = 76, h = 26) =>
  rect(x, y + 3, w, h, C.woodD, 6) + rect(x, y, w, h, C.wood, 6) + circle(x + w - 8, y + h / 2, 3, C.woodD) +
  line(x + 8, y + 7, x + w - 22, y + 7, C.woodL, 2);

export const knife = (x, y, deg = 0, s = 1, blade = C.steel) =>
  g(`translate(${x} ${y}) rotate(${deg}) scale(${s})`,
    path('M0 -5L40 -5Q46 -5 48 2L0 5z', blade), line(4, -2, 38, -2, C.steelL, 1.5),
    rect(-24, -4, 25, 8, C.black, 3), circle(-18, 0, 1.2, C.steelL), circle(-8, 0, 1.2, C.steelL));

export const spoon = (x, y, deg = 0, s = 1, color = C.steel) =>
  g(`translate(${x} ${y}) rotate(${deg}) scale(${s})`, ell(0, 0, 8, 11, color), ell(0, -1, 5, 7, C.steelL), rect(-2, 9, 4, 34, color, 2));

export const hand = (x, y, deg = 0, s = 1, skin = C.skin) =>
  g(`translate(${x} ${y}) rotate(${deg}) scale(${s})`,
    rect(-9, -4, 18, 18, skin, 6), rect(-9, -16, 4.2, 15, skin, 2.1), rect(-4.4, -19, 4.2, 18, skin, 2.1),
    rect(0.2, -18, 4.2, 17, skin, 2.1), rect(4.8, -14, 4.2, 13, skin, 2.1), rect(7, 0, 9, 4.6, skin, 2.3, `transform="rotate(-35 7 2)"`),
    rect(-7, 12, 14, 8, C.skinD, 3));

export const check = (cx, cy, s = 1, color = C.greenD) =>
  stroke(`M${cx - 10 * s} ${cy}l${7 * s} ${7 * s}l${13 * s} ${-15 * s}`, color, 6 * s);
export const cross = (cx, cy, s = 1, color = C.red) =>
  stroke(`M${cx - 8 * s} ${cy - 8 * s}l${16 * s} ${16 * s}M${cx + 8 * s} ${cy - 8 * s}l${-16 * s} ${16 * s}`, color, 6 * s);

export const arrow = (x1, y1, x2, y2, color = C.red, w = 5) => {
  const a = Math.atan2(y2 - y1, x2 - x1), hl = w * 2.2;
  const p1 = [x2 - hl * Math.cos(a - 0.5), y2 - hl * Math.sin(a - 0.5)];
  const p2 = [x2 - hl * Math.cos(a + 0.5), y2 - hl * Math.sin(a + 0.5)];
  return line(x1, y1, x2 - Math.cos(a) * w * 0.8, y2 - Math.sin(a) * w * 0.8, color, w) +
    poly(`${f(x2)},${f(y2)} ${f(p1[0])},${f(p1[1])} ${f(p2[0])},${f(p2[1])}`, color);
};
// Curved arrow going round (for stir / mix / repeat).
export const roundArrow = (cx, cy, r, color = C.red, w = 4.5) =>
  stroke(`M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx} ${cy - r}`, color, w) +
  poly(`${cx - 3},${cy - r - 6} ${cx + 6},${cy - r} ${cx - 3},${cy - r + 6}`, color);

export const motion = (x, y, n = 3, len = 12, color = C.steelD) => {
  let o = '';
  for (let i = 0; i < n; i++) o += line(x, y + i * 6, x + len - i * 3, y + i * 6, color, 2.5);
  return o;
};

export const clock = (cx, cy, r, h = -90, m = 0, face = C.white, rim = C.blue) =>
  circle(cx, cy, r, rim) + circle(cx, cy, r * 0.82, face) +
  line(cx, cy, cx + Math.cos((h * Math.PI) / 180) * r * 0.45, cy + Math.sin((h * Math.PI) / 180) * r * 0.45, C.ink, 3) +
  line(cx, cy, cx + Math.cos(((m - 90) * Math.PI) / 180) * r * 0.65, cy + Math.sin(((m - 90) * Math.PI) / 180) * r * 0.65, C.ink, 2.5) +
  circle(cx, cy, 2, C.ink);

export const thermo = (cx, cy, s = 1, level = 0.6, color = C.red) =>
  g(`translate(${cx} ${cy}) scale(${s})`, rect(-6, -34, 12, 44, C.white, 6, `stroke="${C.steelD}" stroke-width="2.5"`),
    circle(0, 14, 10, color), rect(-2.5, 10 - 40 * level, 5, 40 * level + 4, color, 2.5),
    line(6, -24, 10, -24, C.steelD, 2), line(6, -14, 10, -14, C.steelD, 2), line(6, -4, 10, -4, C.steelD, 2));

export const sparkle = (cx, cy, s = 1, color = C.yellow) =>
  path(`M${cx} ${cy - 8 * s}Q${cx + 1.5 * s} ${cy - 1.5 * s} ${cx + 8 * s} ${cy}Q${cx + 1.5 * s} ${cy + 1.5 * s} ${cx} ${cy + 8 * s}Q${cx - 1.5 * s} ${cy + 1.5 * s} ${cx - 8 * s} ${cy}Q${cx - 1.5 * s} ${cy - 1.5 * s} ${cx} ${cy - 8 * s}z`, color);

export const warnSign = (cx, cy, s = 1) =>
  g(`translate(${cx} ${cy}) scale(${s})`, path('M0 -20L22 18H-22z', C.yellow, `stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"`),
    rect(-2.5, -8, 5, 15, C.ink, 2), circle(0, 12, 3, C.ink));

export const label = (x, y, w, h, color = C.white, txt = '', size = 10) =>
  rect(x, y, w, h, color, 3, `stroke="${C.line}" stroke-width="2"`) + (txt ? text(x + w / 2, y + h / 2 + 0.5, txt, size) : '');

// ---------- People ----------
// A chef's head and shoulders. cx, cy = centre of face.
export function chef(cx, cy, s = 1, o = {}) {
  const { mouth = 'smile', skin = C.skin, hat = 'tall', jacket = C.white, hair = C.ink, eyes = 'dot', scarf = C.red, hatColor = C.white } = o;
  let hatSvg = '';
  if (hat === 'tall') hatSvg = outlined(circle(-9, -22, 9, hatColor) + circle(0, -27, 10, hatColor) + circle(9, -22, 9, hatColor) + rect(-13, -24, 26, 14, hatColor, 2) + rect(-14, -16, 28, 8, hatColor, 2));
  else if (hat === 'tallest') hatSvg = outlined(circle(-10, -32, 10, hatColor) + circle(0, -38, 11, hatColor) + circle(10, -32, 10, hatColor) + rect(-13, -34, 26, 26, hatColor, 2) + rect(-14, -16, 28, 8, hatColor, 2));
  else if (hat === 'cap') hatSvg = outlined(path('M-14 -9Q-14 -22 0 -22Q14 -22 14 -9z', hatColor) + rect(-14, -12, 28, 5, hatColor, 2));
  else if (hat === 'skull') hatSvg = path('M-14 -6Q-14 -20 0 -20Q14 -20 14 -6z', hatColor);
  else if (hat === 'net') hatSvg = path('M-15 -5Q-15 -22 0 -22Q15 -22 15 -5z', 'rgba(150,170,190,.6)', `stroke="${C.steelD}" stroke-width="1.5" stroke-dasharray="2 2"`);
  else if (hat === 'hair') hatSvg = path('M-14 -4Q-15 -18 0 -18Q15 -18 14 -4Q8 -12 0 -12Q-8 -12 -14 -4z', hair);
  const eyeSvg = eyes === 'happy'
    ? stroke('M-7 -1q2 -3 4 0M3 -1q2 -3 4 0', C.ink, 2)
    : eyes === 'wide' ? circle(-5, -2, 2.6, C.ink) + circle(5, -2, 2.6, C.ink) + circle(-4.3, -2.8, 0.8, '#fff') + circle(5.7, -2.8, 0.8, '#fff')
    : eyes === 'closed' ? stroke('M-7 -2h4M3 -2h4', C.ink, 2)
    : circle(-5, -2, 2, C.ink) + circle(5, -2, 2, C.ink);
  const mouths = {
    smile: stroke('M-5 5q5 5 10 0', C.ink, 2.2),
    big: path('M-6 4h12q0 7 -6 7q-6 0 -6 -7z', C.redD),
    open: ell(0, 7, 3.5, 4, C.redD),
    flat: line(-4, 6, 4, 6, C.ink, 2.2),
    sad: stroke('M-5 8q5 -5 10 0', C.ink, 2.2),
    wavy: stroke('M-6 7q1.5 -2 3 0t3 0t3 0t3 0', C.ink, 2),
    tongue: stroke('M-5 4q5 4 10 0', C.ink, 2.2) + ell(0, 8, 3, 3.2, C.pinkD),
    pucker: circle(0, 6, 2.4, C.redD),
  };
  return g(`translate(${cx} ${cy}) scale(${s})`,
    path('M-24 40Q-24 18 0 18Q24 18 24 40z', jacket, jacket === C.white ? `stroke="${C.line}" stroke-width="2.5"` : ''),
    jacket === C.white ? circle(-6, 27, 1.8, C.steelD) + circle(-6, 34, 1.8, C.steelD) + circle(6, 27, 1.8, C.steelD) + circle(6, 34, 1.8, C.steelD) : '',
    scarf ? path('M-8 18L0 25L8 18z', scarf) : '',
    rect(-5, 10, 10, 10, C.skinD, 3),
    circle(0, 0, 15, skin),
    circle(-15, 1, 3.5, skin), circle(15, 1, 3.5, skin),
    hatSvg, eyeSvg, mouths[mouth] || mouths.smile,
    circle(-9, 5, 2.5, 'rgba(230,110,90,.35)'), circle(9, 5, 2.5, 'rgba(230,110,90,.35)'));
}

// Speech bubble with a tail pointing down-left (towards a chef on the left). Content is drawn inside.
export const speech = (x = 46, y = 4, w = 50, h = 44, color = C.white) =>
  path(`M${x + 8} ${y}h${w - 16}q8 0 8 8v${h - 16}q0 8 -8 8h${-w + 30}l-14 10l3 -10h-3q-8 0 -8 -8v${-h + 16}q0 -8 8 -8z`, color, `stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"`);

// Standard phrase picture: chef bottom-left, bubble top-right, symbol inside bubble (centre ≈ 71, 26).
export const say = (symbol, chefOpts = {}) => svg(chef(28, 62, 0.95, chefOpts), speech(), symbol);

// A tiny person (full body), for "behind", "corner" etc.
export const person = (cx, cy, s = 1, shirt = C.blue) =>
  g(`translate(${cx} ${cy}) scale(${s})`, circle(0, -22, 7, C.skin), rect(-8, -14, 16, 20, shirt, 5),
    rect(-7, 5, 6, 16, C.black, 3), rect(1, 5, 6, 16, C.black, 3));
