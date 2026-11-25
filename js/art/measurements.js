// Measurements & temperature.
import { C, svg, g, rect, circle, ell, path, stroke, line, poly, text, shadow, rot, scatter, clock, thermo, arrow, hand, check } from './kit.js';

const scale = (label) => svg(shadow(50, 92, 36), rect(16, 56, 68, 32, C.steelL, 8, `stroke="${C.steelD}" stroke-width="2.5"`), rect(28, 64, 44, 16, '#CDE8D0', 3), text(50, 72.5, label, 11, C.ink), ell(50, 50, 34, 6, C.steel), rect(46, 50, 8, 8, C.steelD));
const jugMl = (label, fill = 0.6) => svg(shadow(50, 92, 28), path('M26 18h46l-4 70h-38z', 'rgba(215,235,248,.9)', `stroke="${C.steelD}" stroke-width="2.5"`), path(`M${27 + (1 - fill) * 2} ${88 - 70 * fill}h${44 - (1 - fill) * 4}l${-(fill * 4)} ${70 * fill}h-38z`, 'rgba(126,200,240,.85)'),
  stroke('M72 26q14 2 12 22q-2 14 -14 14', C.steelD, 4), ...[32, 44, 56, 68].map((y) => line(30, y, 38, y, C.steelD, 2)), text(50, 50, label, 12, C.blueD));
const msp = (label, r) => svg(shadow(), rot(-20, 50, 50, ell(34, 50, r, r * 0.75, C.steel), ell(34, 49, r * 0.75, r * 0.5, '#F2E3C0'), rect(32 + r * 0.8, 47, 50, 6, C.steel, 3)), rect(58, 66, 34, 18, C.white, 6, `stroke="${C.line}" stroke-width="2"`), text(75, 75.5, label, 11, C.ink));
const pie = (frac, color = '#F2A24A') => {
  const a = frac * 2 * Math.PI - Math.PI / 2, x = 50 + 32 * Math.cos(a), y = 52 + 32 * Math.sin(a);
  return circle(50, 52, 34, C.white, `stroke="${C.line}" stroke-width="3"`) + path(`M50 52L50 20A32 32 0 ${frac > 0.5 ? 1 : 0} 1 ${x.toFixed(1)} ${y.toFixed(1)}z`, color);
};

export default {
  'meas-gram': () => scale('100 g'),
  'meas-kilogram': () => svg(shadow(50, 92, 30), path('M24 30h52l4 58h-60z', '#E8D6A8'), path('M24 30l6 -10h40l6 10z', '#D9C490'), rect(30, 48, 40, 24, C.white, 4), text(50, 60.5, '1 kg', 13, C.ink)),
  'meas-litre': () => jugMl('1 L', 0.8),
  'meas-millilitre': () => jugMl('250 ml', 0.3),
  'meas-teaspoon': () => msp('tsp', 8),
  'meas-tablespoon': () => msp('tbsp', 13),
  'meas-cup': () => svg(shadow(50, 90, 30), path('M24 30h52l-6 56h-40z', C.red), ell(50, 30, 26, 6, '#F2E3C0', 0, `stroke="${C.redD}" stroke-width="2"`), stroke('M76 40q14 0 12 14q-2 10 -14 10', C.redD, 4), text(50, 60, '1', 18, C.white)),
  'meas-pinch': () => svg(hand(52, 40, 180, 1.4), scatter(12, 40, 60, 22, 26, (x, y) => circle(x, y, 1.4, C.ink), 3), ell(50, 92, 26, 4, C.line)),
  'meas-handful': () => svg(hand(50, 64, 0, 1.6), ...[[38, 32], [50, 28], [62, 32], [44, 38], [56, 38]].map(([x, y], i) => ell(x, y, 7, 4, i % 2 ? '#3E9A40' : '#4FAE4A', i * 30))),
  'meas-half': () => svg(pie(0.5)),
  'meas-quarter': () => svg(pie(0.25)),
  'meas-dozen': () => svg(rect(8, 36, 84, 44, '#D9C490', 6), ...Array.from({ length: 12 }, (_, i) => ell(17 + (i % 6) * 13.2, 48 + Math.floor(i / 6) * 20, 5.5, 7, '#F6EEDC', 0, `stroke="#D9CFB8" stroke-width="1"`)), rect(36, 84, 28, 12, C.white, 6), text(50, 90.5, '12', 10, C.ink)),
  'meas-portion': () => svg(shadow(), ell(50, 72, 40, 12, C.white, 0, `stroke="${C.line}" stroke-width="2"`), ell(42, 66, 14, 7, '#F3E2A8'), ell(60, 64, 11, 7, '#B5413A'), ell(52, 58, 6, 3, C.green), rect(70, 16, 22, 22, C.white, 6, `stroke="${C.line}" stroke-width="2"`), text(81, 27.5, '×1', 11, C.ink)),
  'meas-scales': () => scale('0 g'),
  'meas-jug': () => jugMl('', 0.5),
  'meas-weigh': () => svg(shadow(50, 92, 36), rect(16, 60, 68, 28, C.steelL, 8, `stroke="${C.steelD}" stroke-width="2.5"`), rect(30, 66, 40, 14, '#CDE8D0', 3), text(50, 73.5, '250 g', 9, C.ink), ell(50, 54, 34, 6, C.steel), path('M30 54q0 -26 20 -26q20 0 20 26z', '#C9A85A'), arrow(84, 20, 84, 44, C.red, 3)),
  'meas-measure': () => svg(...[[18, 30], [48, 22], [76, 36]].map(([x, y], i) => rect(x - 10, y, 22, 40 - i * 8, 'rgba(215,235,248,.9)', 3, `stroke="${C.steelD}" stroke-width="2"`) + rect(x - 10, y + 20 - i * 4, 22, 20 - i * 4, ['#F2A24A', C.water, '#F6F0E2'][i], 2)), ell(50, 88, 40, 4, C.line)),
  'meas-celsius': () => svg(thermo(36, 56, 1, 0.7), rect(52, 26, 40, 30, C.white, 6, `stroke="${C.line}" stroke-width="2"`), text(72, 41.5, '°C', 18, C.red)),
  'meas-temperature': () => svg(thermo(50, 56, 1.1, 0.55), stroke('M70 26c-3 -4 3 -6 0 -10M78 30c-3 -4 3 -6 0 -10', C.red, 2.5), stroke('M22 40l6 -4l6 4l6 -4', C.blue, 2.5)),
  'meas-minute': () => svg(clock(50, 50, 38, -90, 6), path('M50 50L50 18A32 32 0 0 1 53.3 18.2z', 'rgba(218,74,60,.5)'), rect(30, 90, 40, 8, C.white, 4), text(50, 94, '1 min', 7, C.ink)),
  'meas-hour': () => svg(clock(50, 50, 38, -90, 0), path('M50 50L50 18A32 32 0 1 1 49.9 18z', 'rgba(61,124,201,.25)'), text(50, 94, '60 min', 7, C.ink)),
  'meas-centimetre': () => svg(rect(8, 40, 84, 22, C.yellow, 3, `stroke="${C.yellowD}" stroke-width="2"`), ...Array.from({ length: 9 }, (_, i) => line(14 + i * 9, 40, 14 + i * 9, i % 2 ? 46 : 50, C.ink, 1.5)), path('M14 72h9', 'none', `stroke="${C.red}" stroke-width="3"`), text(50, 76, '1 cm', 10, C.red), cubeIcon(76, 70)),
  'meas-more': () => svg(circle(50, 50, 38, '#E3F4E8'), arrow(50, 76, 50, 26, C.greenD, 7), text(78, 28, '+', 26, C.greenD)),
  'meas-less': () => svg(circle(50, 50, 38, '#FDECE3'), arrow(50, 24, 50, 74, C.orangeD, 7), text(78, 28, '−', 26, C.orangeD)),
  'meas-room-temp': () => svg(path('M14 50l36 -30l36 30v40h-72z', '#F2E3C0', `stroke="${C.brownL}" stroke-width="3" stroke-linejoin="round"`), thermo(50, 70, 0.55, 0.45, C.orange), text(74, 64, '20°', 12, C.ink)),
  'meas-boiling-point': () => svg(rect(20, 44, 60, 40, C.steel, 6), rect(16, 40, 68, 6, C.steelD, 3), scatter(8, 26, 30, 48, 10, (x, y) => circle(x, y, 3, C.white, `stroke="${C.steelD}"`), 3), rect(30, 56, 40, 18, C.white, 4), text(50, 65.5, '100°C', 11, C.red)),
};

function cubeIcon(x, y) {
  return rect(x, y, 10, 10, C.orange, 1) + path(`M${x} ${y}l3 -3h10l-3 3z`, '#F7B06A') + path(`M${x + 10} ${y}l3 -3v10l-3 3z`, '#D9731A');
}
