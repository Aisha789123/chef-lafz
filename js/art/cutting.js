// Cutting techniques: the cut pieces lying on a board, with the size written underneath.
import { C, svg, g, rect, circle, ell, path, stroke, line, poly, text, rot, scatter, board, knife } from './kit.js';

const base = (...p) => svg(board(6, 50, 88, 40), ...p);
const size = (s) => rect(28, 76, 44, 12, 'rgba(255,255,255,.85)', 6) + text(50, 82.5, s, 8.5, C.ink);
const cube = (x, y, s, col = C.orange, top = '#F7B06A', side = '#D9731A') =>
  rect(x, y, s, s, col, s > 6 ? 1.5 : 0.6) + path(`M${x} ${y}l${s * 0.3} ${-s * 0.3}h${s}l${-s * 0.3} ${s * 0.3}z`, top) + path(`M${x + s} ${y}l${s * 0.3} ${-s * 0.3}v${s}l${-s * 0.3} ${s * 0.3}z`, side);
const grid = (n, s, gap, x0, y0, cols, col) => Array.from({ length: n }, (_, i) => cube(x0 + (i % cols) * (s + gap), y0 + Math.floor(i / cols) * (s + gap), s, col)).join('');
const sticks = (n, w, h, x0, y0, gap, col = C.orange, hi = '#F7B06A') => Array.from({ length: n }, (_, i) => rect(x0 + i * (w + gap), y0, w, h, col, w / 3) + rect(x0 + i * (w + gap), y0, w, 1.5, hi)).join('');

export default {
  'cut-julienne': () => base(...Array.from({ length: 10 }, (_, i) => rot(-4 + i, 50, 60, rect(14, 52 + i * 2.2, 66, 1.8, i % 2 ? C.orange : '#F2A24A', 0.9))), size('2 mm × 5 cm')),
  'cut-brunoise': () => base(scatter(40, 18, 52, 64, 18, (x, y) => cube(x, y, 3), 7), size('2–3 mm')),
  'cut-chiffonade': () => base(rot(-10, 30, 44, rect(10, 36, 34, 14, '#3E9A40', 7), stroke('M14 43h26', '#2E7A3A', 1.2)), ...Array.from({ length: 7 }, (_, i) => stroke(`M${48 + i * 5} 54q4 8 -2 16`, i % 2 ? '#3E9A40' : '#4FAE4A', 2.6)), size('1–2 mm')),
  'cut-batons': () => base(sticks(6, 6, 30, 22, 46, 4), size('1 cm × 5 cm')),
  'cut-jardiniere': () => base(sticks(8, 4.5, 18, 20, 52, 3.5), size('4 mm × 2 cm')),
  'cut-macedoine': () => base(grid(15, 6, 3, 22, 52, 5, C.orange), size('5 mm')),
  'cut-paysanne': () => base(...Array.from({ length: 8 }, (_, i) => rot(i * 14, 22 + (i % 4) * 16, 56 + Math.floor(i / 4) * 12, rect(16 + (i % 4) * 16, 50 + Math.floor(i / 4) * 12, 12, 12, i % 2 ? C.orange : '#F2A24A', 1))), size('1 cm, thin')),
  'cut-small-dice': () => base(grid(18, 5, 3, 20, 54, 6), size('5 mm')),
  'cut-medium-dice': () => base(grid(8, 9, 4, 24, 50, 4), size('1 cm')),
  'cut-large-dice': () => base(grid(4, 15, 5, 18, 50, 4), size('2 cm')),
  'cut-rounds': () => base(...[20, 34, 48, 62, 76].map((x) => ell(x, 62, 6, 9, '#F2A24A', 0, `stroke="${C.orange}" stroke-width="2"`) + circle(x, 62, 2, '#F7C27A')), size('3–5 mm')),
  'cut-bias': () => base(...[20, 34, 48, 62, 76].map((x) => ell(x, 62, 5, 11, '#F2A24A', 30, `stroke="${C.orange}" stroke-width="2"`)), knife(52, 36, -60, 0.45), size('45°')),
  'cut-wedges': () => base(...[0, 1, 2, 3].map((i) => path(`M${18 + i * 17} 70l8 -20q8 10 6 20z`, '#E8C068', `stroke="#B98A3E" stroke-width="2"`)), size('6–8 ×')),
  'cut-concasse': () => base(g('translate(24 40)', circle(0, 0, 12, C.red), path('M-6 -2l6 6l6 -6', 'none', `stroke="${C.white}" stroke-width="2"`)), stroke('M40 40h10', C.ink, 2), poly('52,40 46,36 46,44', C.ink), grid(9, 6, 3, 58, 30, 3, C.red), size('peeled + seeded')),
  'cut-tourne': () => base(...[30, 50, 70].map((x) => path(`M${x - 6} 52q-4 8 0 16h12q4 -8 0 -16z`, '#F3E2A8', `stroke="#C9A85A" stroke-width="1.8"`) + line(x, 52, x, 68, '#C9A85A', 1.2)), size('7 sides')),
  'cut-segments': () => base(...[0, 1, 2, 3, 4].map((i) => rot(-30 + i * 15, 50, 90, path('M46 58q4 -14 8 0q-4 6 -8 0z', '#F28C28'))), g('translate(22 42)', circle(0, 0, 11, '#F28C28'), circle(0, 0, 8, '#F7B06A')), size('no skin, no pith')),
  'cut-fine-chop': () => base(scatter(80, 20, 54, 60, 14, (x, y, r) => rect(x, y, 2, 1.6, r > 0.5 ? '#2E8A3A' : '#4FAE4A'), 13), knife(46, 40, -8, 0.6), size('very small')),
  'cut-rough-chop': () => base(...[[18, 54, 12, 9], [34, 58, 9, 11], [48, 52, 14, 8], [64, 56, 10, 12], [76, 52, 8, 9], [40, 64, 11, 7]].map(([x, y, w, h], i) => rot(i * 17, x, y, rect(x, y, w, h, i % 2 ? '#F3EFD8' : '#E6DFC0', 2))), size('not equal')),
  'cut-fillet': () => base(path('M10 46q20 -18 46 -16l16 -8v24l-16 -6q-26 2 -46 6z', '#9AA4AC'), path('M14 66q22 -10 52 -4q-30 10 -52 4z', '#F7F2EA', `stroke="#E6DCCB" stroke-width="2"`), knife(46, 50, 10, 0.5), size('no bones')),
  'cut-butterfly': () => base(path('M50 50q-36 -4 -36 12q0 12 36 6z', '#F3C9B4'), path('M50 50q36 -4 36 12q0 12 -36 6z', '#F3C9B4'), line(50, 50, 50, 68, '#E8B39A', 2), stroke('M24 40l-6 -6M76 40l6 -6', C.ink, 2), size('open flat')),
};
