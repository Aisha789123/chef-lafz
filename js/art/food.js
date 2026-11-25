// Food: fruits, meat & fish, dairy & eggs, grains / bread / store cupboard (only items without a safe emoji).
import { C, svg, g, rect, circle, ell, path, stroke, line, poly, text, shadow, rot, scatter, check, plate, steam } from './kit.js';

// ---------- shared shapes ----------
const bottle = (body, label, cap = C.black, txt = '', neck = 10) => svg(shadow(50, 92, 22),
  path(`M38 40q0 -10 ${12 - neck / 2} -14v-14h${neck}v14q${12 - neck / 2} 4 ${12 - neck / 2} 14v46q0 4 -4 4h-16q-4 0 -4 -4z`, body),
  rect(50 - neck / 2 - 1, 8, neck + 2, 8, cap, 2), rect(38, 52, 24, 22, label, 3), txt ? text(50, 63, txt, 9, C.ink) : '');
const bag = (color, label, txt = '', dots = '') => svg(shadow(50, 92, 30),
  path('M24 24h52l4 64h-60z', color), path('M24 24l6 -8h40l6 8z', '#E6E0D2'), rect(30, 42, 40, 30, label, 4), txt ? text(50, 57, txt, 10, C.ink) : '', dots);
const tub = (body, lid, inside = '') => svg(shadow(50, 90, 30), path('M22 40h56l-5 46h-46z', body), rect(18, 32, 64, 10, lid, 4), inside);
const jarOf = (fill, lid = C.red, extra = '') => svg(shadow(50, 92, 26), rect(28, 18, 44, 12, lid, 4), rect(30, 28, 40, 60, 'rgba(225,238,245,.9)', 8, `stroke="${C.steel}" stroke-width="2"`), rect(33, 40, 34, 45, fill, 6), rect(34, 54, 32, 16, C.cream, 3), extra);
const heapIn = (color, dotColor, seed = 3, size = 2) => svg(shadow(50, 90, 36), path('M14 56h72q-2 30 -36 30q-34 0 -36 -30z', C.white, `stroke="${C.line}" stroke-width="2.5"`),
  path('M18 58q32 -26 64 0z', color), scatter(30, 22, 42, 56, 14, (x, y) => circle(x, y, size, dotColor), seed));
const berryCluster = (color, hi, cx = 50, cy = 56, r = 6) => [[0, -14], [-10, -6], [10, -6], [-12, 6], [0, 2], [12, 6], [-6, 16], [6, 16], [0, 26]]
  .map(([dx, dy]) => circle(cx + dx, cy + dy, r, color) + circle(cx + dx - 2, cy + dy - 2, r * 0.3, hi)).join('');
const fillet = (color, stripes) => svg(shadow(), plate(50, 70, 42, 12), path('M14 60q4 -18 36 -20q30 -2 36 14q-6 14 -36 14q-30 2 -36 -8z', color), stripes);
const leg = (meat, bone = '#F6EEDC') => rect(64, 30, 26, 8, bone, 4) + circle(88, 30, 5, bone) + circle(88, 38, 5, bone) + path('M20 56q-6 -22 18 -30q22 -4 30 8q4 18 -18 28q-22 8 -30 -6z', meat);
const fruit = (color, hi = 'rgba(255,255,255,.4)', r = 26, cx = 50, cy = 56) => circle(cx, cy, r, color) + ell(cx - r * 0.4, cy - r * 0.4, r * 0.25, r * 0.15, hi, -40);
const leaf = (x, y, deg = -30, color = C.green) => ell(x, y, 9, 4.5, color, deg);
const can = (body, label, txt = '') => svg(shadow(50, 90, 26), rect(28, 24, 44, 62, body, 4), ell(50, 24, 22, 5, C.steelL, 0, `stroke="${C.steelD}" stroke-width="1.5"`), rect(28, 40, 44, 30, label), txt ? text(50, 55, txt, 9, C.ink) : '', ell(50, 86, 22, 4, C.steelD));
const glassOf = (fill) => svg(shadow(50, 92, 22), path('M30 20h40l-5 68h-30z', 'rgba(220,235,245,.7)', `stroke="${C.steel}" stroke-width="2"`), path('M32 34h36l-4 52h-28z', fill));

export default {
  // ---------- Fruits ----------
  'fruit-lime': () => svg(shadow(), fruit('#6DB33F'), ell(76, 52, 3, 5, '#4E8A2A'), g('translate(30 74)', circle(0, 0, 14, '#6DB33F'), circle(0, 0, 11, '#C9E68A'), stroke('M0 -10v20M-10 0h20M-7 -7l14 14M7 -7l-14 14', '#A6D26A', 1.5))),
  'fruit-raspberry': () => svg(shadow(), berryCluster('#E0335A', '#F58AA0', 50, 46, 7), leaf(50, 18, 0, C.greenD)),
  'fruit-blueberry': () => svg(shadow(), ...[[34, 44], [56, 38], [70, 58], [44, 64], [28, 66], [60, 72]].map(([x, y]) => circle(x, y, 11, '#3E4E9A') + circle(x - 3, y - 3, 3, '#7E8ED0') + path(`M${x - 3} ${y - 9}l3 3l3 -3`, 'none', `stroke="#2A3470" stroke-width="1.5"`))),
  'fruit-blackberry': () => svg(shadow(), berryCluster('#2B2238', '#6A5A80', 50, 46, 7), leaf(50, 18, 0, C.greenD)),
  'fruit-plum': () => svg(shadow(), fruit('#7A2A6A'), stroke('M50 30q-4 20 0 50', '#5A1A4E', 2), stroke('M52 30q2 -10 8 -14', C.brown, 3), leaf(64, 20, -20)),
  'fruit-apricot': () => svg(shadow(), fruit('#F5A13C'), stroke('M50 30q-6 20 0 50', '#E07E1E', 2), circle(36, 58, 8, 'rgba(230,90,60,.3)'), stroke('M50 30v-8', C.brown, 3)),
  'fruit-pomegranate': () => svg(shadow(), circle(50, 56, 30, '#C8243A'), poly('42,28 46,20 50,26 54,20 58,28', '#A81A2E'), path('M50 56l26 -10a30 30 0 0 1 0 28z', '#F4D3C8'), scatter(10, 60, 50, 16, 16, (x, y) => circle(x, y, 2.6, '#E0334A'), 4)),
  'fruit-fig': () => svg(shadow(), path('M50 18q6 0 6 8q22 12 20 36q-2 24 -26 24q-24 0 -26 -24q-2 -24 20 -36q0 -8 6 -8z', '#6A3A6E'), path('M60 54a14 18 0 0 1 0 30q-14 -4 -14 -15q0 -11 14 -15z', '#E86A6A'), scatter(8, 52, 60, 12, 18, (x, y) => circle(x, y, 1.2, '#F6D6A0'), 3)),
  'fruit-dates': () => svg(shadow(), ...[[30, 50, -30], [52, 44, 10], [70, 58, 40], [42, 68, -10]].map(([x, y, d]) => ell(x, y, 14, 8, '#6E3418', d) + ell(x - 3, y - 2, 6, 2, 'rgba(255,255,255,.25)', d))),
  'fruit-passion-fruit': () => svg(shadow(), circle(38, 52, 24, '#5A2A4E'), scatter(6, 22, 36, 30, 30, (x, y) => circle(x, y, 1.5, '#8A5A7E'), 2), circle(66, 66, 20, '#5A2A4E'), circle(66, 66, 16, '#F2C744'), scatter(12, 56, 56, 20, 20, (x, y) => circle(x, y, 2, '#2B2523'), 5)),
  'fruit-papaya': () => svg(shadow(), ell(50, 56, 24, 34, '#F28C28', 20), ell(50, 56, 18, 28, '#F49B6A', 20), ell(50, 56, 7, 18, '#F8C0A0', 20), scatter(10, 44, 44, 10, 26, (x, y) => circle(x, y, 2.4, '#2B2523'), 7)),
  'fruit-guava': () => svg(shadow(), circle(40, 52, 24, '#9CCB5A'), circle(32, 44, 4, 'rgba(255,255,255,.4)'), g('translate(68 68)', circle(0, 0, 18, '#9CCB5A'), circle(0, 0, 15, '#F4A6A6'), scatter(10, -8, -8, 16, 16, (x, y) => circle(x, y, 1.2, '#F7E2B0'), 3)), stroke('M40 28v-6', C.brown, 3)),
  'fruit-rhubarb': () => svg(shadow(), ...[[38, -8], [52, 0], [64, 8]].map(([x, d]) => rot(d, x, 60, rect(x - 5, 40, 10, 50, '#D7354E', 5), line(x - 1, 44, x - 1, 86, '#F08098', 1.5))), path('M30 42q-14 -24 6 -36q18 4 20 30z', '#4E9A45'), path('M60 40q4 -26 26 -28q4 20 -18 32z', '#3E8A3A')),
  'fruit-raisins': () => heapIn('#5A2E3A', '#3E1A26', 9, 3),
  // ---------- Meat, chicken & fish ----------
  'meat-chicken': () => svg(shadow(), path('M22 54q0 -24 28 -26q28 2 30 26q0 24 -30 26q-28 -2 -28 -26z', '#F3D2B8'), ell(26, 72, 10, 8, '#EDC2A2', 30), ell(74, 72, 10, 8, '#EDC2A2', -30), rect(14, 76, 10, 6, '#F6EEDC', 3), rect(76, 76, 10, 6, '#F6EEDC', 3), scatter(14, 30, 36, 40, 30, (x, y) => circle(x, y, 1, '#E3B49A'), 3)),
  'meat-chicken-breast': () => svg(shadow(), plate(50, 70, 42, 12), path('M18 60q0 -22 30 -24q30 0 36 18q-4 16 -32 16q-30 0 -34 -10z', '#F3C9B4'), stroke('M30 52q20 -8 44 0', '#E8B39A', 2)),
  'meat-wings': () => svg(shadow(), ...[[34, 46, -20], [62, 62, 25]].map(([x, y, d]) => rot(d, x, y, path(`M${x - 22} ${y}q0 -10 14 -10l14 2l12 -8q8 0 8 8l-8 12q-14 8 -26 6q-14 0 -14 -10z`, '#F2C3A8'), circle(x - 4, y - 2, 1, '#D9A08A')))),
  'meat-steak': () => svg(shadow(), plate(50, 70, 42, 12), path('M16 58q4 -20 34 -22q32 0 36 16q-2 18 -34 18q-34 2 -36 -12z', '#B5413A'), path('M26 54q12 -8 26 -4q16 4 26 0', 'none', 'stroke="#F2D6C8" stroke-width="4" stroke-linecap="round"'), path('M16 58q2 6 8 8', 'none', 'stroke="#F6E4D6" stroke-width="5" stroke-linecap="round"')),
  'meat-mince': () => svg(shadow(), plate(50, 72, 42, 12), path('M20 68q2 -26 30 -28q28 2 30 28z', '#C0524A'), scatter(60, 24, 44, 52, 22, (x, y, r) => circle(x, y, 1.6, r > 0.5 ? '#E6A8A0' : '#8E3530'), 7)),
  'meat-lamb': () => svg(shadow(), leg('#C2584E'), path('M30 44q12 -6 24 0', 'none', 'stroke="#F2D6C8" stroke-width="3" stroke-linecap="round"')),
  'meat-lamb-chops': () => svg(shadow(), ...[[30, 50, -10], [60, 60, 15]].map(([x, y, d]) => rot(d, x, y, path(`M${x - 16} ${y}q0 -16 16 -16q16 0 16 16q0 12 -16 14q-16 -2 -16 -14z`, '#C2584E'), path(`M${x - 13} ${y + 2}q4 12 13 12`, 'none', 'stroke="#F6E4D6" stroke-width="4"'), rect(x + 10, y - 28, 6, 26, '#F6EEDC', 3)))),
  'meat-liver': () => svg(shadow(), plate(50, 72, 42, 12), path('M18 64q-2 -24 26 -26q14 -2 20 6q18 -4 20 12q2 14 -20 16q-22 2 -46 -8z', '#6E1E22'), path('M28 52q8 -6 16 -4', 'none', 'stroke="rgba(255,255,255,.25)" stroke-width="3" stroke-linecap="round"')),
  'meat-bone': () => svg(shadow(), rot(-30, 50, 50, rect(26, 44, 48, 12, '#F6EEDC', 6), circle(24, 42, 9, '#F6EEDC'), circle(24, 58, 9, '#F6EEDC'), circle(76, 42, 9, '#F6EEDC'), circle(76, 58, 9, '#F6EEDC'), line(30, 48, 70, 48, '#E6D8BC', 2))),
  'meat-duck': () => svg(shadow(), plate(50, 72, 42, 12), ...[0, 1, 2, 3, 4].map((i) => path(`M${20 + i * 12} 66q2 -16 6 -18h6q2 2 0 18z`, i % 2 ? '#E08A8A' : '#D97A7A') + rect(20 + i * 12 + 6, 46, 7, 4, '#B8662E', 2)), circle(70, 24, 10, '#F2C744'), poly('78,24 88,22 80,28', C.orange), circle(72, 22, 1.5, C.ink)),
  'meat-turkey': () => svg(shadow(), plate(50, 74, 44, 12), path('M18 66q0 -30 32 -32q32 2 32 32z', '#C9772E'), rect(12, 60, 14, 8, '#F6EEDC', 4), rect(74, 60, 14, 8, '#F6EEDC', 4), ell(36, 52, 6, 3, 'rgba(255,255,255,.35)', -30), leaf(22, 74, 20), leaf(78, 74, -20)),
  'meat-sausage': () => svg(shadow(), plate(50, 72, 42, 12), ...[0, 1, 2].map((i) => rot(-10 + i * 8, 50, 60, rect(16, 50 + i * 8 - 8, 68, 12, '#B8663A', 6), line(24, 48 + i * 8 - 4, 76, 48 + i * 8 - 4, 'rgba(255,255,255,.3)', 2)))),
  'meat-salmon': () => fillet('#F39A6A', stroke('M30 46q-4 10 0 20M42 44q-4 12 0 24M54 44q-4 12 0 24M66 46q-4 10 0 20', '#FBD3B8', 2.5)),
  'meat-tuna': () => svg(shadow(), plate(50, 70, 42, 12), path('M18 58q2 -18 30 -20q32 -2 34 14q0 16 -32 18q-30 2 -32 -12z', '#A8283A'), stroke('M30 48q20 6 44 -2M28 60q22 6 48 -2', '#C8485A', 2)),
  'meat-white-fish': () => fillet('#F7F2EA', stroke('M34 46q-4 10 0 20M50 44q-4 12 0 24M66 46q-4 10 0 20', '#E6DCCB', 2)),
  'meat-mussels': () => svg(shadow(), ...[[34, 50, -30], [60, 46, 20], [48, 68, -5]].map(([x, y, d]) => rot(d, x, y, ell(x, y, 18, 9, '#2A2E44'), ell(x + 2, y - 1, 12, 5, '#F3A35A'), ell(x - 10, y - 3, 4, 2, 'rgba(255,255,255,.3)')))),
  'meat-anchovies': () => svg(shadow(), rect(14, 40, 72, 40, C.steelL, 8, `stroke="${C.steelD}" stroke-width="2"`), ...[0, 1, 2, 3].map((i) => path(`M20 ${48 + i * 8}q30 -6 58 0l4 -3v6l-4 -3q-28 6 -58 0z`, '#9AA4AC') + circle(24, 48 + i * 8, 1, C.ink))),
  'meat-pork': () => svg(shadow(), plate(50, 72, 42, 12), path('M18 62q2 -22 30 -24q30 0 34 16q-2 16 -32 16q-30 2 -32 -8z', '#F2B8B0'), path('M18 62q4 -16 30 -18', 'none', 'stroke="#FBE6DE" stroke-width="5" stroke-linecap="round"'), g('translate(76 24)', circle(0, 0, 14, '#F4A8B8'), ell(0, 4, 6, 4.5, '#E58098'), circle(-2, 4, 1.2, C.ink), circle(2, 4, 1.2, C.ink), circle(-5, -4, 1.5, C.ink), circle(5, -4, 1.5, C.ink), poly('-12,-10 -8,-16 -5,-11', '#F4A8B8'), poly('12,-10 8,-16 5,-11', '#F4A8B8'))),
  'meat-ham': () => svg(shadow(), plate(50, 72, 42, 12), ...[0, 1, 2].map((i) => ell(36 + i * 12, 62 - i * 4, 22, 9, i % 2 ? '#F2A8A8' : '#EE9A9E', 0, `stroke="#FBE0E0" stroke-width="3"`))),
  'meat-lard': () => svg(shadow(), rect(24, 40, 52, 40, '#F7F4EA', 4, `stroke="#E2DCC8" stroke-width="2"`), path('M24 40l8 -10h52l-8 10z', '#ECE6D4'), path('M76 40l8 -10v40l-8 10z', '#E2DCC8'), rect(30, 52, 40, 16, '#F4A8B8', 3)),
  'meat-gelatine': () => svg(shadow(), ...[0, 1, 2].map((i) => rot(-8 + i * 8, 50, 56, rect(22, 30 + i * 6, 56, 36, 'rgba(240,225,190,.65)', 3, `stroke="#D9C490" stroke-width="1.5"`), scatter(12, 26, 34 + i * 6, 48, 28, (x, y) => path(`M${x} ${y}l2 2l-2 2l-2 -2z`, 'rgba(200,180,130,.6)'), i + 2)))),
  'meat-white-wine': () => bottle('#D8E6B0', C.cream, '#C9A24A', '', 9),
  'meat-brandy': () => svg(shadow(50, 92, 26), path('M30 30q0 -6 8 -8h24q8 2 8 8v52q0 6 -6 6h-28q-6 0 -6 -6z', '#B8661E'), rect(42, 10, 16, 14, '#6E3A10', 3), rect(34, 46, 32, 22, C.cream, 3), ell(50, 57, 10, 6, '#E3B05A')),
  'meat-halal': () => svg(circle(50, 50, 40, C.greenD), circle(50, 50, 33, 'none', `stroke="${C.white}" stroke-width="2.5" stroke-dasharray="4 3"`), check(50, 52, 1.8, C.white)),
  // ---------- Dairy & eggs ----------
  'dairy-egg-yolk': () => svg(shadow(), ell(50, 60, 34, 20, C.white, 0, `stroke="${C.line}" stroke-width="2"`), circle(50, 56, 14, '#F7B320'), circle(45, 51, 4, 'rgba(255,255,255,.5)')),
  'dairy-egg-white': () => svg(shadow(), path('M14 56h72q-2 30 -36 30q-34 0 -36 -30z', C.white, `stroke="${C.steelD}" stroke-width="2.5"`), path('M18 58q8 -22 22 -14q10 -14 22 -2q14 -8 20 16z', '#FFFFFF', `stroke="${C.line}" stroke-width="2"`), g('translate(76 26)', path('M-11 -2q0 14 11 14q11 0 11 -14l-3 3l-3 -4l-5 4l-5 -4l-3 4z', '#F3E3C8', `stroke="#E0C9A0" stroke-width="1.5"`))),
  'dairy-cream': () => svg(shadow(50, 92, 26), path('M30 30l20 -14l20 14v58h-40z', C.white, `stroke="${C.line}" stroke-width="2.5"`), path('M30 30h40', 'none', `stroke="${C.line}" stroke-width="2"`), rect(30, 50, 40, 20, C.blueL), path('M40 60q10 -10 20 0', 'none', 'stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"'), path('M50 16v-6', C.line)),
  'dairy-yoghurt': () => tub(C.white, C.blue, ell(50, 34, 26, 3, '#E3EEF8') + path('M36 58q14 -10 28 0', 'none', `stroke="${C.blueL}" stroke-width="4" stroke-linecap="round"`) + circle(42, 70, 3, '#F4A6A6')),
  'dairy-cream-cheese': () => tub('#F3F6FA', '#6AA9E0', rect(30, 54, 40, 16, C.white, 3) + path('M36 62q14 -8 28 0', 'none', 'stroke="#BFD6EA" stroke-width="3"')),
  'dairy-mozzarella': () => svg(shadow(), plate(50, 72, 42, 12), circle(36, 58, 14, '#FBFAF3', `stroke="#E6E0CC" stroke-width="2"`), circle(62, 56, 16, '#FBFAF3', `stroke="#E6E0CC" stroke-width="2"`), leaf(50, 44, -30, '#3E9A40'), leaf(58, 40, 20, '#4FAE4A')),
  'dairy-parmesan': () => svg(shadow(), path('M16 70l64 -34l6 12v26h-70z', '#F2D98A'), path('M16 70l64 -34l6 12l-70 22z', '#E2B850'), path('M80 36l6 12v26l-6 0z', '#C99A3A'), scatter(8, 26, 60, 50, 12, (x, y) => circle(x, y, 1.2, '#E2C060'), 3)),
  'dairy-cheddar': () => svg(shadow(), path('M14 46l20 -16h52l-20 16z', '#F4A43A'), rect(14, 46, 52, 34, '#E8892A'), path('M66 46l20 -16v34l-20 16z', '#D27820')),
  'dairy-paneer': () => svg(shadow(), plate(50, 72, 42, 12), ...[[24, 50], [42, 48], [60, 50], [32, 60], [52, 60]].map(([x, y]) => rect(x, y, 14, 12, '#FBF8EE', 2, `stroke="#E6DFC8" stroke-width="1.5"`))),
  'dairy-ghee': () => jarOf('#F3C24A', '#C0392B', path('M36 44q14 -6 28 0', 'none', 'stroke="rgba(255,255,255,.5)" stroke-width="3"')),
  'dairy-condensed-milk': () => can(C.steel, '#F2E3C0', '') .replace('</svg>', `${path('M38 58q12 -10 24 0q-4 8 -12 8q-8 0 -12 -8z', C.white)}</svg>`),
  'dairy-buttermilk': () => glassOf('#F6F4EA'),
  'dairy-whipped-cream': () => svg(shadow(), path('M16 60h68q-2 26 -34 26q-32 0 -34 -26z', C.blueL), path('M22 60q0 -14 10 -14q0 -12 12 -12q2 -12 8 -14q6 4 6 14q12 0 12 12q10 0 10 14z', C.white, `stroke="${C.line}" stroke-width="2"`), stroke('M38 50q8 -4 14 -12M48 54q8 -6 12 -10', C.line, 1.5)),
  'dairy-creme-fraiche': () => tub('#FBF8EE', '#2E7A3A', path('M36 60q14 -8 28 0', 'none', 'stroke="#E6DFC8" stroke-width="3"') + rect(38, 66, 24, 8, '#2E7A3A', 2)),
  'dairy-custard': () => svg(shadow(), path('M24 30h44l-4 56h-36z', C.white, `stroke="${C.line}" stroke-width="2.5"`), path('M26 44h40l-3 40h-34z', '#F6D04A'), path('M24 30l-6 6h8z', C.line), stroke('M68 40q12 2 10 16q-2 10 -12 10', C.line, 3)),
  // ---------- Grains, bread & store cupboard ----------
  'grain-flour': () => bag('#F3EFE4', C.white, '', scatter(8, 32, 46, 36, 22, (x, y) => circle(x, y, 1.4, '#E2D6B8'), 3) + path('M38 66q4 -16 12 -20q8 4 12 20', 'none', `stroke="${C.wood}" stroke-width="3"`)),
  'grain-cornflour': () => svg(shadow(50, 92, 28), rect(28, 20, 44, 68, '#F2C744', 3), rect(28, 20, 44, 8, '#D9A31C'), rect(32, 40, 36, 30, C.white, 3), ell(50, 55, 7, 12, '#F7D86A'), scatter(10, 45, 45, 10, 20, (x, y) => circle(x, y, 1.4, '#E8B84A'), 2), leaf(58, 56, 60)),
  'grain-spaghetti': () => svg(shadow(), ...Array.from({ length: 10 }, (_, i) => line(30 + i * 3, 86, 44 + i * 2, 12, '#EFD38A', 2.5)), rect(34, 46, 34, 10, C.blue, 3)),
  'grain-roti': () => svg(shadow(), ell(50, 60, 38, 26, '#E8C48A'), scatter(14, 20, 40, 60, 36, (x, y, r) => ell(x, y, 3 + r * 3, 2, '#B98A4E', r * 90), 9)),
  'grain-naan': () => svg(shadow(), path('M14 60q-2 -26 30 -30q34 -4 44 20q6 26 -34 32q-38 4 -40 -22z', '#F0CE8E'), scatter(12, 22, 36, 58, 34, (x, y, r) => ell(x, y, 3 + r * 3, 2.4, '#C08040', r * 90), 4), scatter(10, 26, 40, 50, 30, (x, y) => circle(x, y, 0.9, C.ink), 6)),
  'grain-bun': () => svg(shadow(), path('M16 66q0 -36 34 -36q34 0 34 36z', '#D99A4A'), rect(16, 64, 68, 14, '#E8B870', 7), scatter(10, 28, 38, 44, 16, (x, y, r) => ell(x, y, 1.8, 1, '#FBF0D8', r * 90), 3)),
  'grain-breadcrumbs': () => heapIn('#E3B46A', '#C08A3A', 8, 1.6),
  'grain-oats': () => heapIn('#E8D6A8', '#C9B07A', 12, 2.6),
  'grain-couscous': () => heapIn('#F2D98A', '#E0BE5A', 14, 1.2),
  'grain-semolina': () => svg(shadow(50, 90, 36), path('M14 56h72q-2 30 -36 30q-34 0 -36 -30z', C.white, `stroke="${C.line}" stroke-width="2.5"`), path('M18 58q32 -26 64 0z', '#F3DD9A'), scatter(60, 22, 44, 56, 12, (x, y) => rect(x, y, 1.4, 1.4, '#D9B85A'), 16)),
  'grain-lentils': () => heapIn('#E2722A', '#C85A18', 17, 2.8),
  'grain-chickpeas': () => heapIn('#E8C88A', '#C9A060', 18, 4.5),
  'grain-kidney-beans': () => svg(shadow(50, 90, 36), path('M14 56h72q-2 30 -36 30q-34 0 -36 -30z', C.white, `stroke="${C.line}" stroke-width="2.5"`), scatter(14, 22, 40, 52, 16, (x, y, r) => ell(x, y, 6, 3.6, '#8E1F2E', r * 180) + ell(x - 1, y - 1, 2, 1, 'rgba(255,255,255,.3)', r * 180), 19)),
  'grain-sugar': () => svg(shadow(), ...[[20, 54], [44, 54], [32, 34], [58, 36]].map(([x, y]) => rect(x, y, 22, 22, C.white, 3, `stroke="${C.line}" stroke-width="2"`) + scatter(5, x + 3, y + 3, 16, 16, (px, py) => circle(px, py, 0.9, '#E6DFC8'), x)), scatter(20, 64, 66, 26, 14, (x, y) => rect(x, y, 2, 2, '#EDE8DA'), 4)),
  'grain-brown-sugar': () => heapIn('#B8803E', '#8E5A22', 21, 1.6),
  'grain-icing-sugar': () => svg(shadow(50, 90, 36), path('M14 56h72q-2 30 -36 30q-34 0 -36 -30z', C.white, `stroke="${C.line}" stroke-width="2.5"`), path('M18 58q32 -30 64 0z', '#FFFFFF', `stroke="${C.line}" stroke-width="1.5"`), circle(70, 24, 12, C.steelD), circle(70, 24, 10, '#D9E2E8'), scatter(14, 60, 36, 20, 16, (x, y) => circle(x, y, 1, '#FFFFFF', `stroke="${C.line}" stroke-width=".5"`), 3)),
  'grain-yeast': () => svg(shadow(), rect(22, 44, 56, 36, '#D8B46A', 4), path('M22 44l8 -10h56l-8 10z', '#E8C88A'), path('M78 44l8 -10v36l-8 10z', '#B8944A'), scatter(16, 26, 50, 48, 26, (x, y) => circle(x, y, 1.4, '#A8843A'), 3), steam(50, 26, 3, 10, '#C9B080')),
  'grain-baking-powder': () => svg(shadow(50, 90, 26), rect(30, 26, 40, 60, C.red, 4), ell(50, 26, 20, 5, C.steel), rect(30, 42, 40, 28, C.white), text(50, 56, 'BP', 12, C.red)),
  'grain-cocoa': () => heapIn('#5A3422', '#3B2016', 23, 1.4),
  'grain-dough': () => svg(shadow(), ell(50, 80, 38, 6, C.wood), path('M18 78q-2 -32 32 -34q34 2 32 34z', '#F6E2B8'), path('M30 58q6 -6 14 -6', 'none', 'stroke="rgba(255,255,255,.6)" stroke-width="4" stroke-linecap="round"'), scatter(8, 20, 70, 60, 6, (x, y) => circle(x, y, 1.2, '#FBF6EA'), 4)),
  'grain-batter': () => svg(shadow(), path('M14 46h72q-2 40 -36 40q-34 0 -36 -40z', C.steel), ell(50, 46, 36, 7, C.steelD), ell(50, 48, 32, 5, '#F6DC9A'), path('M60 20q-4 14 -6 26', 'none', 'stroke="#F6DC9A" stroke-width="5" stroke-linecap="round"'), rot(30, 66, 20, rect(60, 4, 10, 18, C.steelD, 3))),
  'grain-puff-pastry': () => svg(shadow(), ...[0, 1, 2, 3, 4].map((i) => rect(18, 70 - i * 7, 64, 6, i % 2 ? '#F3D28A' : '#E8B860', 3)), path('M18 38q32 -10 64 0v4h-64z', '#D99A3A')),
  'grain-oil': () => bottle('#F2C744', C.white, '#2E7A3A', '', 8).replace('</svg>', `${path('M44 58q6 -10 12 0q-2 6 -6 6q-4 0 -6 -6z', '#F2C744')}</svg>`),
  'grain-olive-oil': () => bottle('#8A9A3B', '#F7F2D8', '#3B3B32', '', 8).replace('</svg>', `${ell(50, 63, 6, 8, '#5C6E2C')}${ell(56, 56, 4, 2, C.green, -30)}</svg>`),
  'grain-vinegar': () => bottle('rgba(200,90,70,.6)', C.white, '#B8243A', '', 8).replace('</svg>', `${drops(50, 64, '#C8402A')}</svg>`),
  'grain-stock-cube': () => svg(shadow(), rect(20, 46, 30, 30, '#E8B048', 3), path('M20 46l8 -8h30l-8 8z', '#F2C76A'), path('M50 46l8 -8v30l-8 8z', '#C9902A'), path('M60 74h26l-2 -22h-22z', '#F6E2B0', `stroke="${C.line}" stroke-width="1.5"`), steam(73, 44, 2, 8, C.steel)),
  'grain-soy-sauce': () => bottle('#3B1E10', '#F7F2E6', C.red, '', 8),
  'grain-ketchup': () => bottle(C.red, C.white, C.white, '', 12).replace('</svg>', `${circle(50, 63, 7, C.red)}${path('M47 56l3 -3l3 3', 'none', `stroke="${C.greenD}" stroke-width="2"`)}</svg>`),
  'grain-mayonnaise': () => jarOf('#FBF4D8', C.blue, path('M40 62q10 -8 20 0', 'none', 'stroke="#F2E2A0" stroke-width="3"')),
  'grain-mustard': () => jarOf('#E8B820', '#6E4A1E', scatter(8, 36, 44, 28, 8, (x, y) => circle(x, y, 1.4, '#B8861A'), 3)),
  'grain-almonds': () => svg(shadow(), ...[[30, 44, -30], [52, 38, 20], [72, 52, -10], [40, 64, 40], [62, 70, -50], [26, 72, 10]].map(([x, y, d]) => rot(d, x, y, path(`M${x} ${y - 12}q10 8 0 24q-10 -16 0 -24z`, '#B97A44'), stroke(`M${x} ${y - 8}v14`, '#9A5E2E', 1)))),
  'grain-jam': () => jarOf('#B81E3A', '#F2E3C0', circle(50, 62, 5, '#E0334A') + leaf(56, 58, -30)),
};

function drops(x, y, color) {
  return path(`M${x} ${y - 7}C${x + 4} ${y - 2} ${x + 5} ${y + 1} ${x + 5} ${y + 3}A5 5 0 0 1 ${x - 5} ${y + 3}C${x - 5} ${y + 1} ${x - 4} ${y - 2} ${x} ${y - 7}z`, color);
}
