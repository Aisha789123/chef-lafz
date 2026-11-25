// Spices & herbs. Ground spices = a coloured heap on a saucer (+ the whole spice next to it),
// seeds = a small bowl of seeds, herbs = a sprig with their own leaf shape.
import { C, svg, g, rect, circle, ell, path, stroke, line, poly, text, shadow, rot, scatter, steam } from './kit.js';

const saucer = (cx = 50, cy = 80, w = 72) => ell(cx, cy + 2, w / 2, 7, C.line) + ell(cx, cy, w / 2, 7, C.white, 0, `stroke="${C.line}" stroke-width="2"`);
const heap = (color, dots = 'rgba(0,0,0,.12)', cx = 46, cy = 78, w = 56, h = 20) =>
  path(`M${cx - w / 2} ${cy}q${w * 0.18} ${-h * 1.1} ${w / 2} ${-h * 1.15}q${w * 0.32} 0 ${w / 2} ${h * 1.15}z`, color) +
  scatter(14, cx - w / 3, cy - h * 0.8, w * 0.66, h * 0.7, (x, y) => circle(x, y, 0.9, dots), 3);
const ground = (color, extra = '', dots) => svg(shadow(50, 90, 38), saucer(), heap(color, dots), extra);
const bowlOf = (seed, n = 26, sd = 4) => svg(shadow(50, 90, 36),
  path('M16 56h68q-2 30 -34 30q-32 0 -34 -30z', C.white, `stroke="${C.line}" stroke-width="2.5"`),
  path('M18 56q32 -16 64 0z', 'rgba(0,0,0,.05)'), scatter(n, 22, 42, 56, 14, seed, sd), scatter(7, 12, 82, 76, 6, seed, sd + 9));
const stem = (d, color = '#5E8C3A', w = 3) => stroke(d, color, w);
const leafAt = (x, y, rx, ry, deg, color, vein = 'rgba(0,0,0,.15)') =>
  ell(x, y, rx, ry, color, deg) + rot(deg, x, y, line(x - rx * 0.7, y, x + rx * 0.7, y, vein, 1.2));
// A sprig: main stem from (50,90) up to (50,14); leaves in pairs along it.
const sprig = (leaf, pairs = 5, color) => {
  let o = stem('M50 92Q48 50 52 12', color);
  for (let i = 0; i < pairs; i++) {
    const y = 80 - i * (62 / pairs), s = 1 - i * 0.08;
    o += leaf(44, y, -1, s) + leaf(56, y - 4, 1, s);
  }
  return o + leaf(52, 12, 0, 0.8);
};
const dChilli = (x, y, deg = 0, s = 1) => rot(deg, x, y, g(`translate(${x} ${y}) scale(${s})`, path('M-16 -2q16 -8 34 0q2 3 0 5q-18 6 -34 -1z', '#B8241A'), path('M-22 -4q4 -2 6 2l-1 4q-5 -1 -5 -6z', '#6D7C3D')));
const pod = (x, y, deg, color = '#8DB35A') => rot(deg, x, y, ell(x, y, 9, 5, color), line(x - 7, y, x + 7, y, 'rgba(0,0,0,.18)', 1.2), circle(x + 9, y, 1.5, '#6E8C3A'));
const cinnStick = (x, y, deg, len = 60) => rot(deg, x, y, rect(x - len / 2, y - 6, len, 12, '#9C5B2E', 6), rect(x - len / 2, y - 6, len, 5, '#B8743E', 3), ell(x - len / 2 + 3, y, 3, 6, '#7A4220'));
const star = (x, y, r = 16, color = '#8A4A26') => {
  let pts = '';
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8 - Math.PI / 2, rr = i % 2 ? r * 0.38 : r;
    pts += `${(x + Math.cos(a) * rr).toFixed(1)},${(y + Math.sin(a) * rr).toFixed(1)} `;
  }
  let seeds = '';
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 - Math.PI / 2;
    seeds += ell(x + Math.cos(a) * r * 0.55, y + Math.sin(a) * r * 0.55, 2.4, 1.6, '#D9A35A', (a * 180) / Math.PI);
  }
  return poly(pts, color) + seeds + circle(x, y, 2.5, '#6A3418');
};

export default {
  'spice-black-pepper': () => svg(shadow(50, 90, 36), rect(58, 18, 22, 62, '#3B2A20', 8), rect(62, 10, 14, 10, '#5A4030', 5), circle(69, 8, 4, '#5A4030'), rect(60, 40, 18, 6, '#B8862E', 2), scatter(22, 14, 62, 40, 24, (x, y) => circle(x, y, 3.2, '#2B2523') + circle(x - 1, y - 1, 1, '#6A6260'), 8)),
  'spice-white-pepper': () => ground('#EFE5CF', scatter(10, 64, 66, 26, 14, (x, y) => circle(x, y, 3, '#E2D3B0', `stroke="#C9B48A" stroke-width="1"`), 5), 'rgba(120,100,60,.25)'),
  'spice-chilli-powder': () => ground('#C8321F', dChilli(66, 36, -25, 1.2)),
  'spice-chilli-flakes': () => bowlOf((x, y, r) => poly(`${x},${y} ${x + 3 + r * 2},${y + 1} ${x + 1},${y + 3}`, r > 0.6 ? '#F2C744' : '#C8321F'), 60, 11),
  'spice-cayenne': () => ground('#D9481E', rot(-20, 66, 34, path('M44 34q22 -6 44 -2q2 2 0 4q-22 4 -44 2z', '#D9481E'), path('M40 32q3 -2 5 1v4q-4 0 -5 -5z', '#6D7C3D'))),
  'spice-paprika': () => ground('#D2512A', g('translate(70 34) scale(.6)', path('M0 0c-12 -6 -32 -2 -32 22c0 22 10 34 20 34c6 0 8 -4 12 -4s6 4 12 4c10 0 20 -12 20 -34c0 -24 -20 -28 -32 -22z', C.red), path('M-4 0q0 -8 6 -12q4 -2 6 2q-4 2 -4 10z', C.greenD))),
  'spice-smoked-paprika': () => ground('#9E3A22', steam(66, 40, 3, 9, '#A8A3A0')),
  'spice-turmeric': () => ground('#F0B518', rot(20, 72, 40, path('M54 38q8 -8 20 -4q12 -2 16 6q-2 8 -14 6q-12 4 -22 -8z', '#C78A2A'), ell(64, 42, 6, 4, '#F0B518'))),
  'spice-cumin': () => bowlOf((x, y, r) => ell(x, y, 3.6, 1.4, '#8A6A3A', r * 180), 40, 21),
  'spice-ground-coriander': () => ground('#B99A62', scatter(9, 62, 30, 28, 18, (x, y) => circle(x, y, 3.6, '#C8A86A', `stroke="#9E7E48" stroke-width="1"`) + line(x - 2, y, x + 2, y, '#9E7E48', 0.8), 13)),
  'spice-coriander': () => svg(shadow(50, 92, 30), sprig((x, y, side, s) => {
    const cx = x + side * 8 * s, r = 6 * s;
    return circle(cx, y, r, '#4E9A45') + circle(cx + side * 4 * s, y - 4 * s, r * 0.8, '#5BAA50') + circle(cx - side * 2, y - 5 * s, r * 0.7, '#4E9A45');
  }, 4, '#7FB36A')),
  'spice-garam-masala': () => ground('#7A4A2A', cinnStick(72, 40, -20, 30) + star(30, 40, 9) + pod(56, 30, 30) + circle(84, 58, 3, '#2B2523') + circle(78, 62, 3, '#2B2523')),
  'spice-curry-powder': () => ground('#E39B1E', leafAt(70, 34, 11, 5, -30, '#2E7A3A', '#1E5A2A') + leafAt(82, 44, 10, 4.5, 20, '#2E7A3A', '#1E5A2A') + steam(30, 44, 2, 8, '#E3B76A')),
  'spice-cinnamon': () => svg(shadow(), cinnStick(50, 42, -15), cinnStick(50, 62, 10)),
  'spice-cardamom': () => svg(shadow(), pod(32, 40, -30), pod(56, 34, 20), pod(70, 56, -10), pod(42, 62, 40), pod(26, 70, 5), rot(15, 60, 74, ell(60, 74, 9, 5, '#8DB35A'), ell(60, 74, 6, 3, '#3B2A20'))),
  'spice-cloves': () => svg(shadow(), ...[[30, 40, -20], [54, 30, 15], [70, 52, -40], [40, 64, 30], [62, 76, 70], [24, 72, -60]].map(([x, y, d]) => rot(d, x, y, rect(x - 2, y - 2, 4, 22, '#6A3418', 2), circle(x, y - 3, 5, '#5A2C14'), circle(x - 3, y - 6, 2.4, '#7A4220'), circle(x + 3, y - 6, 2.4, '#7A4220'), circle(x, y - 8, 2.4, '#7A4220')))),
  'spice-nutmeg': () => svg(shadow(), ell(36, 52, 18, 22, '#8A5A36'), stroke('M26 40q10 8 20 0M24 52q12 8 24 0M26 64q10 8 20 0', '#6E4426', 2), ell(70, 58, 16, 20, '#C9965E'), path('M58 50q12 -8 24 4q-6 14 -24 6z', '#8A5A36'), stroke('M60 60q10 -6 20 2M62 68q8 -4 16 2', '#6E4426', 1.5)),
  'spice-mace': () => svg(shadow(), ell(50, 54, 20, 26, '#7A4A2A'), ...[-16, -8, 0, 8, 16].map((dx) => stroke(`M${50 + dx} 28q${dx * 0.6} 26 ${-dx * 0.3} 52`, '#D9481E', 4)), stroke('M30 46q20 -6 40 0M30 62q20 6 40 0', '#D9481E', 3)),
  'spice-star-anise': () => svg(shadow(), star(38, 44, 22), star(68, 64, 16, '#7A3E1E')),
  'spice-bay-leaf': () => svg(shadow(), leafAt(42, 50, 32, 11, -35, '#7E9A4E', '#5E7A36'), leafAt(58, 58, 30, 10, -15, '#94AE5E', '#6E8A42')),
  'spice-saffron': () => svg(shadow(), saucer(50, 78, 60), ...[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => stroke(`M${26 + i * 6} ${74 - (i % 3) * 3}q${i % 2 ? 6 : -6} -18 ${i % 2 ? 2 : -2} -34`, i % 3 ? '#C8321F' : '#E0582A', 2.4) + circle(26 + i * 6 + (i % 2 ? 2 : -2), 40 - (i % 3) * 3, 2, '#E0582A'))),
  'spice-ginger-powder': () => ground('#E3C98E', rot(10, 70, 40, path('M54 40q-2 -10 10 -10q4 -8 12 -4q10 -2 12 8q4 8 -6 10q-10 6 -22 2q-8 0 -6 -6z', C.tan)), 'rgba(130,100,50,.3)'),
  'spice-mustard-seeds': () => bowlOf((x, y, r) => circle(x, y, 2.2, r > 0.5 ? '#D9A821' : '#8A5A22'), 55, 31),
  'spice-fennel-seeds': () => bowlOf((x, y, r) => ell(x, y, 3.4, 1.4, '#8CA35A', r * 180) + line(x - 2, y, x + 2, y, '#6E8040', 0.6), 40, 41),
  'spice-fenugreek': () => svg(shadow(50, 90, 36), path('M16 64h68q-2 24 -34 24q-32 0 -34 -24z', C.white, `stroke="${C.line}" stroke-width="2.5"`), scatter(26, 24, 52, 52, 12, (x, y) => rect(x, y, 3.4, 2.6, '#D9A35A', 0.8), 51), stem('M64 50q0 -20 -6 -40', '#6E9A4A', 2.5), ...[[58, 14], [66, 22], [56, 26], [66, 36], [56, 40]].map(([x, y], i) => ell(x, y, 5, 3.2, '#4E9A45', i * 40))),
  'spice-nigella': () => bowlOf((x, y, r) => path(`M${x} ${y}l2.4 -1.2l1 2.6l-2.6 0.8z`, '#1E1B1A'), 60, 61),
  'spice-ajwain': () => bowlOf((x, y, r) => ell(x, y, 2.2, 1.4, '#9C8A6A', r * 180), 60, 71),
  'spice-sesame': () => bowlOf((x, y, r) => ell(x, y, 2.8, 1.5, '#F2E2BC', r * 180, `stroke="#C9B48A" stroke-width=".6"`), 55, 81),
  'spice-vanilla': () => svg(shadow(), rot(-30, 50, 50, rect(10, 46, 80, 7, '#3B2418', 3.5), rect(10, 56, 76, 6, '#4A2E1E', 3)), ...[0, 72, 144, 216, 288].map((d) => rot(d, 72, 28, ell(72, 19, 5, 9, '#FFF4C8', 0, `stroke="#E6D28A" stroke-width="1"`))), circle(72, 28, 4, '#F2C744')),
  'spice-allspice': () => svg(shadow(), ...[[30, 44], [50, 36], [70, 46], [40, 62], [60, 62], [78, 70], [24, 72], [50, 80]].map(([x, y]) => circle(x, y, 8, '#6E3E22') + circle(x - 2, y - 3, 2, '#9C6440') + circle(x, y - 7, 1.6, '#4A2814'))),
  'spice-five-spice': () => ground('#8A5A36', star(28, 38, 9) + cinnStick(72, 36, -30, 26) + circle(54, 30, 3, '#2B2523') + circle(60, 34, 3, '#2B2523') + ell(86, 52, 3.4, 1.4, '#8CA35A', 30) + ell(14, 62, 3.4, 1.4, '#8CA35A', -30) + text(50, 18, '5', 14, C.ink)),
  'spice-mint': () => svg(shadow(50, 92, 30), sprig((x, y, side, s) => leafAt(x + side * 9 * s, y, 11 * s, 6.5 * s, side * -25, '#3FAE5A', '#2E8A44'), 4, '#6E9A4A')),
  'spice-oregano': () => svg(shadow(50, 92, 30), stem('M50 92Q46 60 36 22M50 92Q54 56 66 24'), ...[[40, 70], [38, 56], [34, 42], [56, 70], [60, 54], [64, 40]].flatMap(([x, y]) => [ell(x - 5, y, 5, 3.4, '#7A9A4A'), ell(x + 5, y - 2, 5, 3.4, '#7A9A4A')]), circle(36, 20, 4, '#9AB86A'), circle(66, 22, 4, '#9AB86A')),
  'spice-thyme': () => svg(shadow(50, 92, 30), ...[[50, 92, 40, 14], [50, 92, 58, 12], [50, 92, 30, 24], [50, 92, 70, 26]].map(([x1, y1, x2, y2], j) => stem(`M${x1} ${y1}Q${(x1 + x2) / 2} ${(y1 + y2) / 2 + 10} ${x2} ${y2}`, '#8A6A4A', 1.8) +
    scatter(10, Math.min(x1, x2), y2, Math.abs(x2 - x1) || 4, (y1 - y2) * 0.8, (x, y) => ell(x, y, 2.4, 1.4, '#6E8A4A', 45), j + 3))),
  'spice-rosemary': () => svg(shadow(50, 92, 30), ...[[46, -10], [56, 12]].map(([x, d]) => rot(d, x, 60, stem(`M${x} 92V16`, '#6A5A3A', 2.5),
    ...Array.from({ length: 14 }, (_, i) => line(x, 82 - i * 5, x - 9, 76 - i * 5, '#3E6E4A', 2.6) + line(x, 82 - i * 5, x + 9, 76 - i * 5, '#4A7E56', 2.6))))),
  'spice-basil': () => svg(shadow(50, 92, 30), stem('M50 92V40', '#5E8C3A', 4), path('M50 44q-26 -2 -30 -22q20 -6 30 22z', '#3E9A40'), path('M50 44q26 -2 30 -22q-20 -6 -30 22z', '#4FAE4A'), path('M50 64q-22 2 -30 14q18 8 30 -14z', '#3E9A40'), path('M50 64q22 2 30 14q-18 8 -30 -14z', '#4FAE4A'), path('M50 40q-8 -16 0 -30q8 14 0 30z', '#5CBF54'), stroke('M50 44l-20 -20M50 44l20 -20M50 64l-24 12M50 64l24 12', 'rgba(0,0,0,.15)', 1.2)),
  'spice-parsley': () => svg(shadow(50, 92, 30), stem('M50 92Q46 60 36 34M50 92V30M50 92Q56 60 66 34', '#6E9A4A', 2.5), ...[[36, 30], [50, 24], [66, 30]].map(([x, y]) => circle(x - 5, y, 6, '#2E8A3A') + circle(x + 5, y, 6, '#3E9A45') + circle(x, y - 6, 6, '#2E8A3A') + circle(x, y + 3, 5, '#4FAE4A'))),
  'spice-dill': () => svg(shadow(50, 92, 30), stem('M50 92Q48 50 50 14', '#6E9A4A', 2.5), ...[70, 56, 42, 28].flatMap((y, i) => [-1, 1].map((sd) => stroke(`M50 ${y}q${sd * 14} -4 ${sd * 22} -14` + Array.from({ length: 4 }, (_, k) => `M${50 + sd * (5 + k * 4)} ${y - 1 - k * 3}l${sd * 3} -6`).join(''), '#6DB05A', 1.6)))),
  'spice-sage': () => svg(shadow(50, 92, 30), sprig((x, y, side, s) => leafAt(x + side * 10 * s, y, 13 * s, 6 * s, side * -30, '#9AAE8E', '#7A8E6E'), 3, '#8A9A7A')),
  'spice-chives': () => svg(shadow(50, 92, 30), ...[30, 38, 46, 54, 62, 70].map((x, i) => stroke(`M${x} 90Q${x + (i - 3) * 2} 50 ${x + (i - 3) * 5} ${18 + (i % 3) * 6}`, i % 2 ? '#3E8A3A' : '#4E9A45', 3.5)), circle(58, 16, 7, '#B072C9'), circle(55, 13, 2, '#D9A8EA'), rect(28, 70, 44, 6, '#B05A3A', 2)),
  'spice-tarragon': () => svg(shadow(50, 92, 30), sprig((x, y, side, s) => leafAt(x + side * 12 * s, y - 4, 15 * s, 3 * s, side * -40, '#5E9A4A'), 5, '#6E8A4A')),
  'spice-curry-leaves': () => svg(shadow(50, 92, 30), sprig((x, y, side, s) => leafAt(x + side * 10 * s, y, 11 * s, 5.5 * s, side * -20, '#2E7A3A', '#1E5A2A'), 5, '#5A6E3A')),
  'spice-lemongrass': () => svg(shadow(), ...[[36, -8], [50, 0], [64, 8]].map(([x, d]) => rot(d, x, 60, rect(x - 5, 46, 10, 44, '#E6E2B0', 4, `stroke="#CFCB90" stroke-width="1.5"`), path(`M${x - 5} 48l-2 -38h6l6 38z`, '#9CC46A'), line(x, 50, x, 86, '#CFCB90', 1.2)))),
  'spice-garlic-powder': () => ground('#F1E8D2', g('translate(70 30)', path('M0 -14c-4 6 -14 8 -14 18c0 8 7 12 14 12s14 -4 14 -12c0 -10 -10 -12 -14 -18z', '#F7F2E6', `stroke="#D9CFB8" stroke-width="1.5"`), stroke('M0 -8v20M-6 -2q-2 8 0 14M6 -2q2 8 0 14', '#D9CFB8', 1.2)), 'rgba(140,120,80,.3)'),
};
