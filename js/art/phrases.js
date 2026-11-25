// Kitchen phrases: a chef (or the young cook, in a cap) with a speech bubble holding a symbol.
import {
  C, svg, g, rect, circle, ell, path, stroke, line, poly, text, chef, speech, check, cross, arrow, roundArrow,
  flame, flames, clock, thermo, sparkle, warnSign, hand, knife, spoon, person, drops, steam, motion,
} from './kit.js';

const CX = 71, CY = 26;
// Head chef speaking / young cook (commis, cap) speaking.
const sayChef = (sym, o = {}) => svg(chef(28, 62, 0.95, o), speech(), sym);
const sayMe = (sym, o = {}) => svg(chef(28, 62, 0.95, { hat: 'cap', scarf: C.blue, ...o }), speech(), sym);

const q = (x, y, s = 18, color = C.blue) => text(x, y, '?', s, color, 900);
const plateSm = (x, y, w = 16) => ell(x, y + 1.5, w, w * 0.3, C.line) + ell(x, y, w, w * 0.3, C.white, 0, `stroke="${C.steelD}" stroke-width="1.5"`);
const ear = (x, y) => g(`translate(${x} ${y})`, path('M-6 -10C2 -16 12 -10 10 0C9 6 4 6 3 11C2 16 -4 17 -6 13', C.skin, `stroke="${C.skinD}" stroke-width="2"`), stroke('M-1 -4c3 -3 7 0 5 4c-1 2 -3 2 -3 5', C.skinD, 2));
const ticket = (x, y, w = 22, h = 28) => rect(x, y, w, h, C.white, 2, `stroke="${C.steelD}" stroke-width="2"`) +
  line(x + 4, y + 7, x + w - 4, y + 7, C.steelD, 2) + line(x + 4, y + 13, x + w - 6, y + 13, C.steelD, 2) + line(x + 4, y + 19, x + w - 8, y + 19, C.steelD, 2);
const magnifier = (x, y) => circle(x, y, 9, '#E8F4FB', `stroke="${C.ink}" stroke-width="3.5"`) + line(x + 7, y + 7, x + 14, y + 14, C.ink, 5);
const eye = (x, y) => ell(x, y, 11, 7, C.white, 0, `stroke="${C.ink}" stroke-width="2.5"`) + circle(x, y, 4.5, C.blueD) + circle(x, y, 2, C.ink);
const box = (x, y, w = 22, h = 16) => rect(x, y, w, h, C.tan, 2) + rect(x, y, w, 4, C.wood, 1) + line(x + w / 2, y, x + w / 2, y + 7, C.woodD, 2);
const thumbsUp = (x, y, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-8, -2, 16, 16, C.skin, 4), rect(-4, -14, 7, 15, C.skin, 3.5), rect(-11, -1, 5, 15, C.blue, 2));
const heart = (x, y, s = 1, color = C.red) => g(`translate(${x} ${y}) scale(${s})`, path('M0 10C-14 0 -12 -10 -6 -10C-3 -10 -1 -8 0 -6C1 -8 3 -10 6 -10C12 -10 14 0 0 10z', color));
const snail = (x, y) => g(`translate(${x} ${y})`, path('M-14 8h26q4 0 4 -4l2 -6h-3l-3 5h-26z', C.greenL), circle(-2, -1, 9, C.brownL), stroke('M-2 -1m-5 0a5 5 0 1 0 5 -5a3 3 0 1 0 3 3', C.brown, 1.8), line(13, -3, 15, -9, C.ink, 1.5), line(15, -2, 19, -7, C.ink, 1.5));
const power = (x, y, color) => stroke(`M${x - 7} ${y - 6}a10 10 0 1 0 14 0`, color, 4) + line(x, y - 11, x, y - 1, color, 4);
const bin = (x, y) => rect(x - 9, y - 6, 18, 20, C.greenD, 2) + rect(x - 11, y - 10, 22, 4, C.greenD, 2) + rect(x - 3, y - 13, 6, 3, C.greenD, 1) + line(x - 4, y - 2, x - 4, y + 10, C.greenL, 2) + line(x + 4, y - 2, x + 4, y + 10, C.greenL, 2);
const peanut = (x, y, s = 1) => g(`translate(${x} ${y}) scale(${s})`, ell(0, -5, 6, 7, C.tan), ell(0, 6, 6, 7, C.tan), circle(-2, -6, 1, C.brownL), circle(2, 5, 1, C.brownL));

export default {
  'phr-yes-chef': () => sayMe(check(CX, CY + 2, 1.3)),
  'phr-heard': () => sayMe(ear(64, 26) + check(83, 30, 0.7)),
  'phr-behind': () => sayMe(arrow(54, 36, 90, 36, C.red, 4) + person(74, 34, 0.7, C.blue)),
  'phr-hot': () => sayMe(rect(56, 34, 30, 5, C.black, 2) + line(86, 36, 93, 36, C.black, 4) + stroke('M61 28c-3 -4 3 -6 0 -10M71 28c-3 -4 3 -6 0 -10M81 28c-3 -4 3 -6 0 -10', C.red, 3), { mouth: 'open' }),
  'phr-sharp': () => sayMe(knife(64, 27, 0, 0.6) + sparkle(87, 22, 0.7, C.yellowD), { mouth: 'open' }),
  'phr-corner': () => sayMe(rect(54, 10, 7, 30, C.steelD, 1) + rect(54, 33, 36, 7, C.steelD, 1) + stroke('M67 10v12q0 5 5 5h12', C.red, 4) + poly('90,27 83,22 83,32', C.red), { mouth: 'open' }),
  'phr-service': () => sayChef(path('M56 36a15 15 0 0 1 30 0z', C.yellow) + rect(52, 35, 38, 5, C.yellowD, 2) + circle(71, 19, 3, C.yellowD) + motion(86, 12, 2, 5, C.yellowD), { mouth: 'open' }),
  'phr-fire-table': () => sayChef(flame(61, 31, 1) + text(82, 27, '5', 24, C.ink), { mouth: 'open' }),
  'phr-86': () => sayChef(text(71, 27, '86', 26, C.red, 900) + line(54, 37, 88, 15, C.red, 3)),
  'phr-on-the-pass': () => sayChef(path('M60 10h22l4 8h-30z', C.steelD) + stroke('M63 21l-3 6M71 21v7M79 21l3 6', C.orange, 2.2) + plateSm(71, 36, 15) + circle(71, 34, 4, C.orange)),
  'phr-plate-up': () => sayChef(plateSm(71, 38, 17) + ell(66, 35, 6, 3.5, C.greenD) + ell(76, 34, 6, 4, C.brownL) + arrow(71, 8, 71, 26, C.red, 3.5)),
  'phr-how-long': () => sayChef(clock(65, 26, 13, -30, 20) + q(86, 26), { eyes: 'wide' }),
  'phr-two-minutes': () => sayMe(clock(63, 26, 13, -90, 60) + text(85, 26, '2', 22, C.ink)),
  'phr-clean-as-you-go': () => sayChef(rect(56, 24, 24, 14, C.yellow, 3) + rect(56, 34, 24, 4, C.green, 2) + sparkle(84, 16, 0.8) + sparkle(64, 15, 0.5) + circle(85, 32, 2, C.water) + circle(80, 37, 1.6, C.water)),
  'phr-mise-en-place': () => sayChef(rect(53, 32, 36, 7, C.steelD, 2) + bowlSm(60, 30, C.red) + bowlSm(71, 30, C.green) + bowlSm(82, 30, C.yellow) + ell(60, 22, 4, 2.5, C.red) + ell(71, 22, 4, 2.5, C.green) + ell(82, 22, 4, 2.5, C.yellow)),
  'phr-where-is': () => sayMe(magnifier(64, 23) + q(86, 24, 20), { eyes: 'wide' }),
  'phr-show-me': () => sayMe(hand(64, 30, 90, 0.75) + q(85, 22, 20), { eyes: 'wide' }),
  'phr-repeat': () => sayMe(roundArrow(66, 26, 10, C.blue) + ear(85, 26)),
  'phr-slowly': () => sayMe(snail(70, 24) + stroke('M52 14h8M52 20h5', C.steelD, 2)),
  'phr-order-in': () => sayChef(ticket(58, 11) + arrow(88, 12, 88, 34, C.red, 3), { mouth: 'open' }),
  'phr-away': () => sayChef(plateSm(64, 30, 12) + circle(64, 28, 4, C.brownL) + arrow(76, 29, 92, 29, C.green, 4), { mouth: 'open' }),
  'phr-hands': () => sayChef(hand(62, 30, -10, 0.7) + hand(80, 30, 10, 0.7) + plateSm(71, 12, 12), { mouth: 'open' }),
  'phr-all-day': () => sayChef(ticket(54, 15, 18, 24) + ticket(58, 12, 18, 24) + text(85, 27, '5', 22, C.ink)),
  'phr-stop': () => sayChef(poly('64,10 78,10 88,20 88,32 78,42 64,42 54,32 54,20', C.red) + rect(60, 23, 22, 6, C.white, 2), { mouth: 'open' }),
  'phr-careful': () => sayChef(warnSign(71, 28, 0.8), { mouth: 'open' }),
  'phr-coming-through': () => sayMe(person(66, 34, 0.7, C.blue) + motion(53, 20, 3, 8, C.steelD) + arrow(78, 26, 92, 26, C.red, 3.5), { mouth: 'open' }),
  'phr-wet-floor': () => sayChef(poly('71,10 84,40 58,40', C.yellow, `stroke="${C.ink}" stroke-width="2" stroke-linejoin="round"`) + drops(71, 31, C.blue, 1)),
  'phr-help': () => sayMe(person(62, 34, 0.6, C.blue) + person(81, 34, 0.6, C.green) + heart(71, 13, 0.5)),
  'phr-need-help': () => sayMe(hand(64, 30, 0, 0.75) + text(84, 26, '!', 26, C.red, 900), { eyes: 'wide' }),
  'phr-thank-you': () => sayMe(heart(71, 27, 1.5), { eyes: 'happy' }),
  'phr-sorry': () => sayMe(circle(68, 26, 13, C.yellow) + circle(63, 23, 1.8, C.ink) + circle(73, 23, 1.8, C.ink) + stroke('M62 33q6 -5 12 0', C.ink, 2) + drops(84, 18, C.water, 0.9), { mouth: 'sad' }),
  'phr-good-morning': () => sayMe(circle(71, 26, 9, C.yellow) + rays(71, 26)),
  'phr-taste-this': () => sayChef(spoon(64, 24, -60, 0.8) + circle(62, 19, 3.5, C.orange) + sparkle(86, 18, 0.6, C.orange)),
  'phr-needs-salt': () => sayChef(rect(58, 18, 16, 22, C.white, 4, `stroke="${C.steelD}" stroke-width="2"`) + path('M58 22q8 -10 16 0z', C.steelD) + circle(63, 13, 1.2, C.ink) + circle(66, 10, 1.2, C.ink) + circle(69, 13, 1.2, C.ink) + text(85, 27, '+', 24, C.green, 900)),
  'phr-refire': () => sayChef(flame(64, 31, 0.9) + roundArrow(83, 26, 7, C.red, 3)),
  'phr-came-back': () => sayChef(plateSm(74, 32, 14) + circle(74, 30, 4, C.brownL) + stroke('M88 18h-26', C.red, 3.5) + poly('56,18 63,13 63,23', C.red), { mouth: 'sad' }),
  'phr-faster': () => sayChef(poly('74,8 60,28 70,28 66,44 84,22 74,22 78,8', C.yellow, `stroke="${C.yellowD}" stroke-width="2" stroke-linejoin="round"`), { mouth: 'open' }),
  'phr-slow-down': () => sayChef(hand(71, 18, 180, 0.65) + arrow(62, 30, 62, 42, C.blue, 3) + arrow(80, 30, 80, 42, C.blue, 3)),
  'phr-ready': () => sayMe(thumbsUp(71, 28, 1.1), { eyes: 'happy' }),
  'phr-done': () => sayMe(rect(58, 12, 26, 26, C.white, 4, `stroke="${C.greenD}" stroke-width="3"`) + check(71, 25, 0.9)),
  'phr-on-it': () => sayMe(text(71, 26, 'OK!', 20, C.green, 900) + motion(53, 16, 3, 6, C.steelD)),
  'phr-last-orders': () => sayChef(path('M60 10h22l-11 16l11 16h-22l11 -16z', C.sand, `stroke="${C.brown}" stroke-width="2.5" stroke-linejoin="round"`) + poly('66,39 76,39 71,32', C.yellowD)),
  'phr-fire': () => sayChef(flames(66, 34, 3, 9, 0.75) + text(87, 26, '!', 24, C.red, 900), { mouth: 'open', eyes: 'wide' }),
  'phr-label-it': () => sayChef(path('M56 16h24l8 10l-8 10h-24z', C.white, `stroke="${C.steelD}" stroke-width="2"`) + circle(82, 26, 2, C.steelD) + text(67, 26, '12/5', 9, C.ink)),
  'phr-fifo': () => sayChef(box(54, 22, 10, 12) + box(66, 22, 10, 12) + box(78, 22, 10, 12) + arrow(84, 15, 56, 15, C.green, 3)),
  'phr-prep-list': () => sayChef(rect(60, 9, 22, 32, C.wood, 3) + rect(62, 13, 18, 26, C.white, 1) + rect(66, 7, 10, 5, C.steelD, 2) + stroke('M64 19l2 2l3 -4M64 26l2 2l3 -4M64 33l2 2l3 -4', C.green, 1.8) + line(71, 19, 77, 19, C.steelD, 1.5) + line(71, 26, 77, 26, C.steelD, 1.5) + line(71, 33, 77, 33, C.steelD, 1.5)),
  'phr-clean-down': () => sayChef(path('M58 20h26l-3 20h-20z', C.blue) + rect(56, 18, 30, 4, C.blueD, 2) + circle(63, 16, 4, C.white, `stroke="${C.steel}"`) + circle(71, 14, 5, C.white, `stroke="${C.steel}"`) + circle(79, 16, 4, C.white, `stroke="${C.steel}"`) + sparkle(89, 11, 0.5)),
  'phr-break': () => sayChef(rect(60, 22, 20, 18, C.white, 4, `stroke="${C.steelD}" stroke-width="2"`) + stroke('M80 26q7 0 6 6q-1 5 -6 5', C.steelD, 2.5) + rect(62, 24, 16, 5, C.brownL, 2) + steam(70, 18, 2, 7, C.steel), { eyes: 'happy' }),
  'phr-staff-meal': () => sayChef(path('M56 26h30q0 14 -15 14q-15 0 -15 -14z', C.blue) + ell(71, 26, 15, 4, C.cream) + circle(66, 24, 3, C.orange) + circle(74, 23, 3, C.greenD) + steam(71, 18, 2, 8, C.steel)),
  'phr-walk-in': () => sayChef(rect(58, 9, 26, 33, C.steelL, 2, `stroke="${C.steelD}" stroke-width="2"`) + rect(78, 20, 3, 10, C.steelD, 1.5) + snow(68, 24)),
  'phr-is-this-ok': () => sayMe(plateSm(65, 32, 13) + circle(65, 30, 4.5, C.orange) + ell(61, 29, 3, 1.6, C.green) + q(86, 24, 20), { eyes: 'wide' }),
  'phr-where-put': () => sayMe(box(56, 22, 20, 16) + q(85, 24, 20), { eyes: 'wide' }),
  'phr-what-next': () => sayMe(arrow(54, 26, 76, 26, C.green, 4) + q(86, 25, 20), { eyes: 'wide' }),
  'phr-how-many': () => sayChef(text(64, 26, '123', 13, C.ink) + q(86, 25, 20), { eyes: 'wide' }),
  'phr-one-moment': () => sayMe(rect(63, 22, 16, 16, C.skin, 5) + rect(67, 7, 6, 18, C.skin, 3) + rect(60, 28, 6, 4, C.skinD, 2)),
  'phr-dont-know': () => sayMe(stroke('M57 34l7 -8l7 8l7 -8l7 8', C.steelD, 3) + q(71, 15, 18, C.steelD), { mouth: 'flat' }),
  'phr-english-little': () => sayMe(text(66, 25, 'ABC', 14, C.blue) + rect(84, 30, 3, 6, C.green, 1) + rect(88, 24, 3, 12, C.greyL, 1) + rect(92, 18, 3, 18, C.greyL, 1)),
  'phr-cut-myself': () => sayMe(hand(66, 30, 0, 0.75) + rect(59, 19, 12, 5, '#4D8FE0', 2, 'transform="rotate(-20 65 21)"') + drops(84, 22, C.red, 1.1), { mouth: 'sad' }),
  'phr-burned-myself': () => sayMe(hand(64, 30, 0, 0.75) + flame(83, 32, 0.8), { mouth: 'sad' }),
  'phr-we-are-out': () => sayMe(path('M56 22h30v16h-30z', C.tan) + path('M56 22l-4 -8h12l4 8zM86 22l4 -8h-12l-4 8z', C.wood) + text(71, 31, '0', 12, C.brown)),
  'phr-bring-me': () => sayChef(box(70, 18, 20, 16) + arrow(68, 26, 52, 26, C.green, 3.5)),
  'phr-take-this': () => sayChef(box(54, 18, 20, 16) + arrow(76, 26, 92, 26, C.green, 3.5)),
  'phr-turn-on': () => sayChef(rect(54, 12, 24, 26, C.steelD, 3) + rect(57, 20, 18, 14, C.black, 2) + rect(59, 22, 14, 3, C.orange, 1) + power(86, 26, C.green)),
  'phr-turn-off': () => sayChef(power(71, 27, C.red) + cross(86, 13, 0.4)),
  'phr-check-temp': () => sayChef(thermo(66, 30, 0.55) + text(83, 24, '°C', 14, C.red)),
  'phr-wipe-plate': () => sayChef(plateSm(66, 30, 15) + rect(78, 16, 14, 10, C.blueL, 2, 'transform="rotate(20 85 21)"') + sparkle(56, 18, 0.5)),
  'phr-keep-warm': () => sayChef(path('M57 34a14 14 0 0 1 28 0z', C.steel) + rect(54, 33, 34, 4, C.steelD, 2) + circle(71, 19, 2.5, C.steelD) + steam(71, 14, 3, 9, C.orange)),
  'phr-dont-touch': () => sayChef(hand(66, 28, 0, 0.75) + cross(70, 24, 1.1), { mouth: 'open' }),
  'phr-bin-it': () => sayChef(bin(71, 28)),
  'phr-wash-up': () => sayChef(rect(54, 26, 34, 14, C.steel, 3) + ell(66, 26, 7, 7, C.white, 0, `stroke="${C.steelD}" stroke-width="1.5"`) + ell(76, 26, 7, 7, C.white, 0, `stroke="${C.steelD}" stroke-width="1.5"`) + circle(60, 22, 3, C.white, `stroke="${C.blueL}"`) + circle(84, 20, 3.5, C.white, `stroke="${C.blueL}"`) + stroke('M86 10v6h-4', C.steelD, 2.5)),
  'phr-restock': () => sayChef(line(54, 38, 88, 38, C.woodD, 3) + line(54, 24, 88, 24, C.woodD, 3) + box(57, 12, 12, 11) + box(57, 27, 12, 10) + box(72, 27, 12, 10) + text(80, 15, '+', 18, C.green, 900)),
  'phr-not-yet': () => sayMe(clock(66, 26, 13, -60, 30) + cross(86, 32, 0.45)),
  'phr-let-me-check': () => sayMe(eye(66, 26) + check(86, 28, 0.6)),
  'phr-allergy': () => sayChef(peanut(62, 26, 1) + warnSign(82, 28, 0.5), { mouth: 'open' }),
  'phr-on-the-fly': () => sayChef(path('M54 30l38 -18l-14 30l-6 -10z', C.white, `stroke="${C.blueD}" stroke-width="2.5" stroke-linejoin="round"`) + line(72, 32, 92, 12, C.blueD, 2) + motion(50, 34, 2, 6, C.steelD), { mouth: 'open' }),
  'phr-how-do-i': () => sayMe(knife(60, 30, -20, 0.5) + q(86, 24, 20), { eyes: 'wide' }),
  'phr-whats-this': () => sayMe(text(64, 26, 'ABC', 14, C.blue) + q(87, 25, 20)),
  'phr-good-job': () => sayChef(poly('71,9 75.5,20 87,20 78,27 81,39 71,32 61,39 64,27 55,20 66.5,20', C.yellow, `stroke="${C.yellowD}" stroke-width="2" stroke-linejoin="round"`) + sparkle(89, 12, 0.5), { eyes: 'happy', mouth: 'big' }),
  'phr-do-again': () => sayChef(roundArrow(68, 27, 11, C.orange, 4.5) + text(68, 27, '2', 12, C.ink)),
  'phr-what-time': () => sayMe(circle(60, 13, 4, C.red) + circle(82, 13, 4, C.red) + clock(71, 27, 12, -120, 0, C.white, C.red) + line(64, 39, 61, 42, C.red, 2.5) + line(78, 39, 81, 42, C.red, 2.5)),
};

function bowlSm(x, y, color) {
  return path(`M${x - 5} ${y - 6}h10q0 7 -5 7q-5 0 -5 -7z`, C.white, `stroke="${C.steelD}" stroke-width="1.5"`) + ell(x, y - 6, 5, 1.5, color);
}
function rays(cx, cy) {
  let o = '';
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    o += line(cx + Math.cos(a) * 12, cy + Math.sin(a) * 12, cx + Math.cos(a) * 17, cy + Math.sin(a) * 17, C.orange, 3);
  }
  return o;
}
function snow(cx, cy) {
  let o = '';
  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI) / 3;
    o += line(cx - Math.cos(a) * 8, cy - Math.sin(a) * 8, cx + Math.cos(a) * 8, cy + Math.sin(a) * 8, C.blue, 2.5);
  }
  return o;
}
export { snow, rays, heart, ticket, eye, box, bin, peanut, thumbsUp, magnifier, ear, snail, power };
