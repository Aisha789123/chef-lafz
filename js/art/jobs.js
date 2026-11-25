// Kitchen jobs (people) and stations (places).
import { C, svg, g, rect, circle, ell, path, stroke, line, poly, text, shadow, chef, pot, pan, flames, flame, steam, bubbles, plate, board, knife, clock, person, scatter } from './kit.js';

const who = (o, ...extra) => svg(chef(50, 44, 1.25, o), ...extra);
const badge = (txt, color = C.blue) => circle(80, 82, 11, color) + text(80, 82.5, txt, 10, C.white);
const bench = (y = 70) => rect(6, y, 88, 8, C.steel, 2) + rect(10, y + 8, 4, 20, C.steelD) + rect(86, y + 8, 4, 20, C.steelD);
const ticket = (x, y) => rect(x, y, 22, 30, C.white, 2, `stroke="${C.steelD}" stroke-width="2"`) + stroke(`M${x + 4} ${y + 8}h14M${x + 4} ${y + 14}h10M${x + 4} ${y + 20}h12`, C.steelD, 2);
const cake = (x, y, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -8, 28, 16, '#F4A6A6', 3), rect(-14, -12, 28, 6, C.white, 3), circle(0, -16, 4, C.red));

export default {
  'job-chef': () => who({}),
  'job-head-chef': () => who({ hat: 'tallest', jacket: C.black, scarf: C.yellow }, rect(66, 60, 22, 30, C.wood, 3), rect(69, 64, 16, 24, C.white, 1), stroke('M72 70h10M72 76h8M72 82h10', C.steelD, 1.5), badge('1', C.yellowD)),
  'job-sous-chef': () => who({ hat: 'tall' }, badge('2', C.blue)),
  'job-chef-de-partie': () => who({ hat: 'tall', scarf: C.green }, g('translate(4 6) scale(.6)', pan(20, 120, 40)), badge('3', C.green)),
  'job-demi-chef': () => who({ hat: 'tall', scarf: C.orange }, badge('½', C.orange)),
  'job-commis': () => who({ hat: 'cap', scarf: C.blue }, rect(60, 70, 30, 22, C.tan, 3), circle(68, 70, 5, C.orange), circle(78, 68, 5, C.red), circle(86, 70, 4, C.green)),
  'job-apprentice': () => who({ hat: 'cap', scarf: C.purple }, rect(62, 66, 28, 24, C.blue, 2), rect(64, 68, 24, 20, C.white, 1), line(76, 68, 76, 88, C.blueD, 1.5), stroke('M66 74h8M66 80h8M78 74h8M78 80h8', C.steelD, 1.2)),
  'job-pastry-chef': () => who({ hat: 'tall', scarf: C.pink }, cake(78, 78, 1)),
  'job-kitchen-porter': () => who({ hat: 'cap', jacket: '#3D7CC9', scarf: null, hatColor: '#285A99' }, ...[0, 1, 2, 3].map((i) => ell(76, 88 - i * 5, 14, 4, C.white, 0, `stroke="${C.line}" stroke-width="1.5"`)), circle(68, 66, 3, C.white, `stroke="${C.blueL}"`), circle(86, 70, 3.5, C.white, `stroke="${C.blueL}"`)),
  'job-waiter': () => svg(chef(44, 44, 1.25, { hat: 'hair', jacket: C.black, scarf: null }), poly('38,70 44,74 50,70 50,78 44,74 38,78', C.white), ell(80, 52, 16, 4, C.steel), rect(78, 52, 4, 20, C.skin, 2), rect(72, 42, 8, 10, C.white, 2, `stroke="${C.line}"`), rect(84, 44, 6, 8, '#C9772E', 2)),
  'job-manager': () => svg(chef(50, 44, 1.25, { hat: 'hair', jacket: '#3B4A6B', scarf: null }), path('M47 68h6l-1 4l3 14h-10l3 -14z', C.red), rect(68, 66, 20, 26, C.white, 2, `stroke="${C.line}" stroke-width="2"`), stroke('M72 74h12M72 80h12M72 86h8', C.steelD, 1.5)),
  'job-customer': () => svg(rect(10, 70, 80, 6, C.wood, 2), rect(16, 76, 4, 20, C.woodD), rect(80, 76, 4, 20, C.woodD), chef(36, 40, 1, { hat: 'hair', jacket: C.purple, scarf: null }), ell(66, 66, 16, 5, C.white, 0, `stroke="${C.line}" stroke-width="2"`), ell(66, 63, 8, 3, '#C9772E'), rect(84, 46, 4, 20, C.steel, 2)),
  'job-team': () => svg(chef(24, 50, 0.8, { hat: 'cap', scarf: C.blue }), chef(76, 50, 0.8, { hat: 'tall', scarf: C.green }), chef(50, 40, 0.95, { hat: 'tallest', scarf: C.yellow })),
  'job-grill-station': () => svg(flames(50, 66, 5, 14, 0.75), rect(8, 64, 84, 6, C.black, 2), ...[16, 28, 40, 52, 64, 76, 88].map((x) => line(x - 4, 56, x, 66, '#555', 2.5)), ell(36, 56, 12, 6, '#8A3A2E'), ell(64, 56, 12, 6, '#8A3A2E'), rect(8, 70, 84, 26, C.steelD, 3), steam(50, 40, 3, 14, C.steel)),
  'job-fry-station': () => svg(rect(8, 50, 40, 46, C.steel, 4), rect(52, 50, 40, 46, C.steel, 4), rect(12, 54, 32, 14, '#E9B949', 2), rect(56, 54, 32, 14, '#E9B949', 2), bubbles(28, 58, 26, '#FFF6D0', 2), bubbles(72, 58, 26, '#FFF6D0', 6), rect(16, 30, 22, 24, 'none', 2, `stroke="${C.steelD}" stroke-width="2.5"`), rect(60, 30, 22, 24, 'none', 2, `stroke="${C.steelD}" stroke-width="2.5"`), ...[20, 26, 32].map((x) => rect(x, 40, 3, 12, '#F2C744', 1))),
  'job-sauce-section': () => svg(bench(76), pot(30, 50, 32, 24), pot(72, 52, 28, 22), ell(30, 50, 15, 3, '#C26B2A'), ell(72, 52, 13, 3, '#F2E3C0'), steam(30, 40, 2, 8, C.steel), steam(72, 42, 2, 8, C.steel), flame(30, 82, 0.4), flame(72, 82, 0.4)),
  'job-fish-section': () => svg(bench(70), path('M14 54q20 -18 50 -6l14 -8v24l-14 -8q-30 12 -50 -2z', '#7FA6C0'), circle(24, 52, 2.4, C.ink), stroke('M40 48q-2 6 0 12M50 46q-2 8 0 14', '#5E87A3', 2), scatter(10, 10, 62, 80, 6, (x, y) => rect(x, y, 5, 5, '#E3F2FB', 1), 3)),
  'job-larder': () => svg(bench(70), path('M14 60h34q-2 12 -17 12q-15 0 -17 -12z', C.white, `stroke="${C.line}" stroke-width="2"`), ell(24, 58, 7, 4, '#4FAE4A'), ell(36, 58, 6, 4, C.red), circle(30, 54, 4, '#9CCB76'), rect(54, 52, 30, 18, '#F6EEDC', 3), rect(54, 52, 30, 6, '#F2A8A8', 2), snow(76, 28)),
  'job-pastry-section': () => svg(bench(70), cake(30, 58, 1.2), path('M56 66q0 -18 14 -18q14 0 14 18z', '#F2D7A6'), stroke('M68 30c-6 -8 -6 -18 0 -20c6 2 6 12 0 20', C.steelD, 2), rect(66, 30, 4, 14, C.black, 2), scatter(8, 50, 40, 40, 20, (x, y) => circle(x, y, 1, C.white, `stroke="${C.line}" stroke-width=".5"`), 4)),
  'job-prep-area': () => svg(bench(74), board(10, 54, 80, 20), circle(26, 56, 7, C.orange), rect(38, 52, 6, 6, C.orange, 1), rect(46, 54, 6, 6, C.orange, 1), knife(66, 50, -10, 0.5), ...[0, 1, 2].map((i) => rect(12 + i * 26, 22, 22, 14, C.steel, 2) + ell(23 + i * 26, 23, 10, 2.5, [C.green, C.red, C.yellow][i]))),
  'job-pot-wash': () => svg(rect(8, 56, 84, 40, C.steelD, 3), rect(14, 60, 72, 22, '#8EA0AC', 4), bubbles(50, 60, 60, '#FFFFFF', 3), pot(36, 40, 26, 16), rect(60, 30, 22, 26, C.black, 4), stroke('M72 8v16', C.steel, 4), stroke('M72 24q0 6 -6 8', C.water, 3)),
  'job-dry-store': () => svg(...[24, 52, 80].map((y) => rect(8, y, 84, 4, C.wood, 2)), path('M14 24v-12h16v12z', '#E8D6A8'), path('M36 24v-14h14v14z', '#F3EFE4'), rect(58, 12, 14, 12, C.red, 2), rect(76, 14, 12, 10, C.yellow, 2), path('M14 52v-16h18v16z', '#E8D6A8'), rect(38, 38, 20, 14, C.tan, 2), rect(62, 36, 10, 16, '#F2C744', 2), rect(76, 40, 12, 12, C.blue, 2), path('M14 80v-14h22v14z', '#F3EFE4'), rect(42, 66, 18, 14, C.tan, 2), rect(66, 64, 20, 16, '#E8D6A8', 2)),
  'job-the-pass': () => svg(rect(6, 8, 88, 6, C.steelD, 2), ...[28, 72].map((x) => line(x, 14, x, 24, C.steelD, 2) + path(`M${x - 12} 24h24l4 8h-32z`, C.steel) + ell(x, 33, 14, 2.5, '#FFC93C')), rect(6, 62, 88, 8, C.steel, 2), ...[24, 50, 76].map((x) => plate(x, 58, 12, 4) + circle(x, 55, 4, '#C9772E')), ticket(38, 72)),
  'job-menu': () => svg(shadow(), path('M20 14h28v76h-28z', '#7A2A2A'), path('M48 14h32v76h-32z', '#F7F0DC', `stroke="${C.line}" stroke-width="2"`), stroke('M54 26h20M54 36h16M54 46h20M54 56h14M54 66h20M54 76h16', C.steelD, 2), path('M30 40l4 -8l4 8z', '#F2C744')),
  'job-order-ticket': () => svg(shadow(), path('M26 10h48v76l-6 -4l-6 4l-6 -4l-6 4l-6 -4l-6 4l-6 -4l-6 4z', C.white, `stroke="${C.steelD}" stroke-width="2"`), text(50, 22, 'T5', 11, C.red), stroke('M32 36h12M32 46h20M32 56h16M32 66h22', C.ink, 2.2), text(66, 36, '2', 9), text(66, 46, '1', 9), text(66, 56, '3', 9)),
  'job-shift': () => svg(clock(34, 40, 24, -60, 0), person(74, 64, 1.2, C.white), circle(74, 36, 7, C.skin), path('M66 30q8 -10 16 0z', C.white, `stroke="${C.line}"`), arrow3(30, 82)),
  'job-whites': () => svg(path('M28 18h44l14 16l-8 10l-6 -6v56h-44v-56l-6 6l-8 -10z', C.white, `stroke="${C.line}" stroke-width="2.5" stroke-linejoin="round"`), path('M42 18l8 10l8 -10', 'none', `stroke="${C.line}" stroke-width="2"`), ...[36, 48, 60, 72].flatMap((y) => [circle(42, y, 2, C.steelD), circle(58, y, 2, C.steelD)])),
};

function snow(cx, cy) { return [0, 60, 120].map((d) => `<g transform="rotate(${d} ${cx} ${cy})">${line(cx, cy - 10, cx, cy + 10, C.blue, 3)}</g>`).join(''); }
function arrow3(x, y) { return stroke(`M${x - 18} ${y}h36`, C.green, 4) + poly(`${x + 22},${y} ${x + 14},${y - 5} ${x + 14},${y + 5}`, C.green); }
