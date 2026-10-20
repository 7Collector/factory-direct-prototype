/* Factory Direct · data and economics.
   Every scenario number here follows the detailed deck (Team Violet, DICE S3). Factory names,
   batch reads and Hub queues are illustrative sample data for the demo. */
window.FD = window.FD || {};

/* ---------- unit economics (deck slide 4) ---------- */
FD.econ = {
  SHIP: 80,          // forward shipping 500 g–1 kg, ₹65–70 + 18% GST
  PACK: 12,          // Hub packing at the published rate, incl. GST
  REVERSE: 170,      // reverse fee per customer return, sensitivity value
  WHOLESALE: 19,     // effective wholesale margin, today's money (30-day credit, 1.5% bad debt)
  RATE: 0.18,        // cost of money, per year
  DAYS: 41           // production to payout under a 7-day payout
};
FD.settle = function (price, cost, r) {
  const e = FD.econ;
  const reserve = e.REVERSE * r / 100;
  const recv = price - e.SHIP - e.PACK - reserve;
  const keep = recv - cost;
  const today = keep - recv * e.RATE * e.DAYS / 365;
  return { reserve, recv, keep, today };
};
FD.ladder = [
  { r: 4, l: '≤4%', s: 'target' },
  { r: 5, l: '5%', s: 'base case' },
  { r: 6, l: '6%', s: 'review line' },
  { r: 12, l: '12%', s: 'stop', stop: true }
];

/* ₹381 → ₹345 cost stack per kept unit, 240 TC double bedsheet set */
FD.waterfall = [
  { l: 'Trader all-in', v: 381, total: true },
  { l: 'Trader margin', v: -4 },
  { l: 'Inbound freight', v: -8 },
  { l: 'Working capital', v: -7 },
  { l: 'Returns 8%→5%', v: -13 },
  { l: 'Pickup rate cut', v: -6 },
  { l: 'Factory keeps', v: +2 },
  { l: 'Factory Direct', v: 345, total: true, fd: true },
  { l: 'Idle capacity', v: 340, total: true, ghost: true }
];

/* ---------- Demand Cards (Panipat, Oct 2026) ---------- */
FD.cards = [
  {
    id: 'bedsheet', name: 'Double bedsheet set', hiName: 'डबल बेडशीट सेट', unit: 'sets', hiUnit: 'सेट',
    spec: '90×100 inch double bedsheet + 2 pillow covers · cotton, 200–240 thread count · floral or geometric, 3–4 colours',
    hiSpec: '90×100 इंच डबल बेडशीट + 2 तकिया कवर · कॉटन, 200–240 थ्रेड काउंट · फ्लोरल या ज्योमेट्रिक, 3–4 रंग',
    share: .25, shareTxt: '1 in 4 bedsheet-set orders on Meesho', hiShare: 'Meesho पर हर 4 में से 1 बेडशीट-सेट ऑर्डर',
    trend: 'up', trendTxt: 'Rising vs the 90 days before', hiTrend: 'पिछले 90 दिनों से बढ़ रहा है',
    bands: [{ l: '₹280–330', v: .30 }, { l: '₹330–380', v: .55 }, { l: '₹380+', v: .15 }],
    returns: ['thread count low', 'colour bleed', 'size short'], hiReturns: ['थ्रेड काउंट कम', 'रंग निकलना', 'साइज़ छोटा'],
    room: 'High', roomTxt: 'More buyers search for this than find it', hiRoom: 'ऊँची', hiRoomTxt: 'जितने खरीदार ढूँढते हैं, उतना माल नहीं मिलता',
    reorder: 3, reorderTxt: 'of the last 5 batches were ordered again', hiReorder: 'पिछले 5 बैच में से दोबारा ऑर्डर हुए',
    ask: '100–200 sets · checked day 14, 30, 60 · stock stays yours', hiAsk: '100–200 सेट · दिन 14, 30, 60 पर जाँच · माल आपका ही रहेगा',
    chips: ['240 thread count', '90×100 inch', '2 pillow covers', '100% cotton'],
    price: 345, cost: 218, wholesale: 19, bids: 4, status: '3 of 5 reordered'
  },
  {
    id: 'towel', name: 'Bath towel 2-pack', hiName: 'बाथ टॉवल 2-पैक', unit: 'packs', hiUnit: 'पैक',
    spec: '70×140 cm · 500–600 GSM cotton terry · solid colours · pack of 2',
    hiSpec: '70×140 सेमी · 500–600 GSM कॉटन टेरी · सादे रंग · 2 का पैक',
    share: .18, shareTxt: 'About 1 in 6 towel orders on Meesho', hiShare: 'Meesho पर लगभग हर 6 में से 1 टॉवल ऑर्डर',
    trend: 'flat', trendTxt: 'Flat vs the 90 days before', hiTrend: 'पिछले 90 दिनों जैसा ही',
    bands: [{ l: '₹220–260', v: .40 }, { l: '₹260–300', v: .45 }, { l: '₹300+', v: .15 }],
    returns: ['GSM low', 'colour fade', 'shedding'], hiReturns: ['GSM कम', 'रंग फीका', 'रोएँ झड़ना'],
    room: 'Medium', roomTxt: 'Search roughly matches supply', hiRoom: 'मध्यम', hiRoomTxt: 'माँग और माल लगभग बराबर',
    reorder: 2, reorderTxt: 'of the last 5 batches were ordered again', hiReorder: 'पिछले 5 बैच में से दोबारा ऑर्डर हुए',
    ask: '100–200 packs · checked day 14, 30, 60 · stock stays yours', hiAsk: '100–200 पैक · दिन 14, 30, 60 पर जाँच · माल आपका ही रहेगा',
    chips: ['550 GSM', '70×140 cm', 'pack of 2', 'cotton terry'],
    price: 289, cost: 160, wholesale: 17, bids: 3, status: '2 of 5 reordered'
  },
  {
    id: 'mat', name: 'Anti-skid bath mat', hiName: 'एंटी-स्किड बाथ मैट', unit: 'mats', hiUnit: 'मैट',
    spec: '40×60 cm · microfibre or cotton, 1,200+ GSM · anti-skid backing',
    hiSpec: '40×60 सेमी · माइक्रोफ़ाइबर या कॉटन, 1,200+ GSM · फिसलन-रोधी बैकिंग',
    share: .31, shareTxt: 'About 1 in 3 bath-mat orders on Meesho', hiShare: 'Meesho पर लगभग हर 3 में से 1 बाथ-मैट ऑर्डर',
    trend: 'up', trendTxt: 'Rising vs the 90 days before', hiTrend: 'पिछले 90 दिनों से बढ़ रहा है',
    bands: [{ l: '₹180–230', v: .35 }, { l: '₹230–280', v: .50 }, { l: '₹280+', v: .15 }],
    returns: ['backing peels', 'size short'], hiReturns: ['बैकिंग उखड़ना', 'साइज़ छोटा'],
    room: 'High', roomTxt: 'More buyers search for this than find it', hiRoom: 'ऊँची', hiRoomTxt: 'जितने खरीदार ढूँढते हैं, उतना माल नहीं मिलता',
    reorder: 0, reorderTxt: 'First batch here · no reorder record yet', hiReorder: 'यहाँ पहला बैच · अभी कोई रिकॉर्ड नहीं',
    ask: '100–200 mats · checked day 14, 30, 60 · stock stays yours', hiAsk: '100–200 मैट · दिन 14, 30, 60 पर जाँच · माल आपका ही रहेगा',
    chips: ['1,200 GSM', '40×60 cm', 'anti-skid'],
    price: 259, cost: 128, wholesale: 16, bids: 1, status: 'first batch here'
  },
  {
    id: 'cushion', name: 'Cushion cover 5-pack', hiName: 'कुशन कवर 5-पैक', unit: 'sets', hiUnit: 'सेट',
    spec: '16×16 inch · jute or cotton blend · zip closure · set of 5',
    hiSpec: '16×16 इंच · जूट या कॉटन मिश्रण · ज़िप · 5 का सेट',
    share: .12, shareTxt: 'About 1 in 8 cushion-cover orders on Meesho', hiShare: 'Meesho पर लगभग हर 8 में से 1 कुशन-कवर ऑर्डर',
    trend: 'down', trendTxt: 'Falling vs the 90 days before', hiTrend: 'पिछले 90 दिनों से घट रहा है',
    bands: [{ l: '₹250–300', v: .50 }, { l: '₹300–350', v: .35 }, { l: '₹350+', v: .15 }],
    returns: ['zip fails', 'colour differs from photo'], hiReturns: ['ज़िप खराब', 'रंग फ़ोटो से अलग'],
    room: 'Low', roomTxt: 'Supply already covers search · card closing', hiRoom: 'कम', hiRoomTxt: 'माल पहले से काफ़ी है · कार्ड बंद हो रहा है',
    reorder: 1, reorderTxt: 'of the last 5 batches were ordered again', hiReorder: 'पिछले 5 बैच में से दोबारा ऑर्डर हुए',
    ask: '100 sets · checked day 14, 30, 60 · stock stays yours', hiAsk: '100 सेट · दिन 14, 30, 60 पर जाँच · माल आपका ही रहेगा',
    chips: ['16×16 inch', 'set of 5', 'zip closure'],
    price: 299, cost: 172, wholesale: 18, bids: 5, status: 'closing · gap nearly covered'
  }
];

FD.i18n = {
  en: { what: 'What to make', sells: 'How much sells', way: 'Which way', price: 'At what price', ret: 'Why it comes back', room: 'Is there room', reord: 'Did others reorder', ask: 'What we ask', money: 'Your money at', recv: 'you receive per kept unit, paid day 7', keep: 'you keep, at your cost of', nf: 'From all Meesho orders in this category. Not a forecast and not a promise of orders.', calc: 'Check my numbers', bid: 'Bid on this card', card: 'Demand Card' },
  hi: { what: 'क्या बनाना है', sells: 'कितना बिकता है', way: 'रुझान', price: 'किस दाम पर', ret: 'वापसी क्यों होती है', room: 'जगह है?', reord: 'दूसरों ने दोबारा बनाया?', ask: 'हम क्या माँगते हैं', money: 'आपका पैसा,', recv: 'हर रखे गए यूनिट पर, 7वें दिन भुगतान', keep: 'आपका मुनाफ़ा, आपकी लागत', nf: 'इस कैटेगरी के सभी Meesho ऑर्डर से। यह पूर्वानुमान नहीं है, ऑर्डर का वादा नहीं है।', calc: 'मेरा हिसाब देखें', bid: 'इस कार्ड पर बोली लगाएँ', card: 'डिमांड कार्ड' }
};

/* ---------- sizing and roadmap (deck slides 3, 9, 10) ---------- */
FD.funnel = [
  { l: 'Units of all kinds in five clusters', v: 47000 },
  { l: 'Finished-goods makers able to run a 100-unit batch', v: 8500 },
  { l: 'Apply within 24 months (35%)', v: 2975 },
  { l: 'Pass Gate 0 and Gate 1 (65%)', v: 1935 },
  { l: 'Launch a Pilot Batch (80%)', v: 1550 },
  { l: 'Still replenishing on own money, month 24', v: 850 }
];
FD.road = [
  { q: 'Q1', c: 'Panipat', d: 'Home textiles', v: 15 },
  { q: 'Q2', c: 'Karur', d: 'Bed, kitchen and table linen', v: 180 },
  { q: 'Q3', c: 'Moradabad', d: 'Packable metal decor', v: 320 },
  { q: 'Q4', c: 'Tiruppur', d: 'Innerwear and basics', v: 480 },
  { q: 'Q5–6', c: 'Second Hubs', d: 'Panipat and Karur density', v: 650 },
  { q: 'Q7–8', c: 'Surat', d: 'Sarees, if the gate holds', v: 850 }
];
FD.scenarios = [
  { k: 'Low', v: '₹26 cr', s: '850 factories × 1,000 orders/mo · ₹25 saved each' },
  { k: 'Base', v: '₹61 cr', s: '850 × 2,000 orders/mo · ₹30 saved · ~₹612 cr NMV', base: true },
  { k: 'High', v: '₹202 cr', s: '1,400 × 3,000 orders/mo · ₹40 saved (not the plan)' }
];

/* ---------- pilot cohort: 30 batches with reads at D+14 / 30 / 60 / 90 ----------
   kind sets the trajectory; fix is the read at which an automatic action has cleared it. */
(function () {
  const names = ['Kalpana Textiles', 'Shree Balaji Handloom', 'Aggarwal Home Furnishing', 'Panipat Weavers Co.', 'Rajdhani Terry Mills', 'Gupta Bedlinen', 'Sahil Textiles', 'Om Shanti Looms', 'Haryana Cotton Works', 'Jai Mata Di Textiles', 'Bansal Furnishings', 'Mehta Handloom', 'Chawla Home Textiles', 'Dindoli Weaves', 'Kharkhoda Terry', 'Sidhu Bedsheets', 'Arora Textile Mills', 'Noor Handloom', 'Sharma Bath Linen', 'Madhav Furnishings', 'Pooja Textiles', 'Vijay Home Linen', 'Kartik Weaving', 'Lakshmi Cotton', 'Singla Textiles', 'Yamuna Terry Works', 'Goel Furnishings', 'Nav Durga Looms', 'Garg Home Textiles', 'Ritu Bedlinen'];
  const skus = ['Double bedsheet set', 'Bath towel 2-pack', 'Anti-skid bath mat', 'Double bedsheet set', 'Bath towel 2-pack', 'Cushion cover 5-pack'];
  // [kind, fixed-at-day, reorder-day]
  const plan = [
    ['ok', 0, 60], ['slaHub', 30, 60], ['conv', 30, 90], ['ok', 0, 60], ['ret12', 0, 0], ['ok', 0, 60],
    ['ok', 0, 60], ['impr', 30, 60], ['ok', 0, 0], ['neg', 0, 0], ['ok', 0, 60], ['ret6', 60, 90],
    ['ok', 0, 60], ['conv', 0, 0], ['ok', 0, 60], ['slaFac', 30, 60], ['ok', 0, 90], ['ok', 0, 60],
    ['rto', 0, 60], ['ok', 0, 0], ['conv', 60, 0], ['ok', 0, 60], ['neg', 0, 0], ['ok', 0, 60],
    ['ret6', 0, 0], ['ok', 0, 60], ['slaHub', 30, 0], ['ok', 0, 90], ['ok', 0, 60], ['ok', 0, 0]
  ];
  let seed = 20261021;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  const between = (a, b) => a + rnd() * (b - a);
  FD.pilot = names.map((f, i) => {
    const [kind, fix, reorderDay] = plan[i];
    const base = {
      impr: Math.round(between(19500, 24500)), conv: +between(1.9, 2.6).toFixed(1), sla: Math.round(between(95, 99)),
      ret: +between(2.4, 4.6).toFixed(1), rto: Math.round(between(9, 14)), contrib: Math.round(between(18, 30)),
      pace: between(0.95, 1.2), hub: rnd() < .72
    };
    return { id: i, f, sku: skus[i % skus.length], kind, fix, reorderDay, base, slot: 20000 };
  });
  // Kalpana Textiles is the factory shown in the Supplier Panel and the buyer listing
  Object.assign(FD.pilot[0].base, { impr: 21400, conv: 2.1, sla: 97, ret: 4.2, rto: 13, contrib: 26, pace: 1.12, hub: true });
})();

FD.BENCH = 1.8; FD.RTO_MED = 15;
FD.read = function (p, day) {
  const b = p.base, active = !p.fix || day < p.fix;
  const r = { impr: b.impr, conv: b.conv, sla: b.sla, ret: b.ret, rto: b.rto, contrib: b.contrib, hub: b.hub, slot: p.slot };
  if (active) {
    if (p.kind === 'impr') r.impr = 14200;
    if (p.kind === 'conv') r.conv = 1.3;
    if (p.kind === 'slaHub') { r.sla = 91; r.hub = true; }
    if (p.kind === 'slaFac') { r.sla = 89; r.hub = false; }
    if (p.kind === 'ret6') r.ret = 7.4;
    if (p.kind === 'rto') r.rto = 19;
  } else if (p.kind === 'slaFac') r.hub = true; // routed to Hub packing
  if (p.kind === 'ret12') { r.ret = 12.6; r.contrib = 4; }
  if (p.kind === 'neg') r.contrib = -4;
  // cumulative sell-through of the 100-unit pilot batch
  const curve = { 14: 52, 30: 78, 60: 100, 90: 100 }[day] || 52;
  let sold = curve * b.pace;
  if (['impr', 'conv'].includes(p.kind) && active) sold *= .55;
  if (['ret12', 'neg', 'ret6'].includes(p.kind)) sold *= .8;
  r.sold = Math.max(18, Math.min(100, Math.round(sold)));
  r.reordered = !!p.reorderDay && day >= p.reorderDay;
  r.stopped = p.kind === 'ret12' || p.kind === 'neg';
  return r;
};
FD.judge = function (r) {
  if (r.contrib < 0) return { s: 'bad', k: 'contrib', label: 'Stop · contribution negative', short: 'Stop · margin', action: 'Block the next batch until contribution on matured units is positive. The factory sees the calculation in its panel.', human: 'the factory asks for the calculation' };
  if (r.ret >= 12) return { s: 'bad', k: 'ret12', label: 'Stop · returns ≥12%', short: 'Stop · returns', action: 'Replenishment stops: below wholesale at this rate. Return codes go to the factory; the maker line is removed if the D+20 mystery buy fails.', human: 'defect codes point to a production fault' };
  if (r.impr < r.slot * .9) return { s: 'warn', k: 'impr', label: 'Below slot allocation', short: 'Fix listing', action: 'Listing is probably incomplete or mis-categorised: re-run the catalogue completeness check and the slot.', human: 'still below the floor after 7 days' };
  if (r.conv < FD.BENCH) return { s: 'warn', k: 'conv', label: 'Conversion below benchmark', short: 'Show gap', action: `Show the factory the gap to the ${FD.BENCH}% card benchmark: price, imagery or spec. The price is the factory's to set; nothing else happens.`, human: 'the factory disputes the benchmark' };
  if (r.sla < 95) return r.hub
    ? { s: 'warn', k: 'slaHub', label: 'SLA missed · Hub-packed', short: 'Hub SLA', action: "The miss is the Hub's: operator SLA ticket. No action against the factory.", human: 'SLA still under 95% after a week' }
    : { s: 'warn', k: 'slaFac', label: 'SLA missed · factory-packed', short: 'Route to Hub', action: 'Stock not synced: route to Hub packing, cut live stock, pause the slot until dispatch is back above 95%.', human: 'SLA still under 95% after routing' };
  if (r.ret > 6) return { s: 'warn', k: 'ret6', label: 'Returns above review line', short: 'Return codes', action: "Spec mismatch: return codes go to the factory's floor and a D+20 mystery buy is booked. Replenishment continues below 12%.", human: 'codes point to a production fault' };
  if (r.rto > FD.RTO_MED) return { s: 'warn', k: 'rto', label: 'RTO above median', short: 'RTO tools', action: 'Address and COD behaviour, not the product: platform RTO tools (address check, prepaid nudge). No action against the factory.', human: 'never, on product grounds' };
  return { s: 'ok', k: 'ok', label: 'On track', short: 'On track', action: 'Nothing to do. When sell-through passes 50% with positive contribution, the panel offers a replenishment order; the decision and the money stay with the factory.', human: 'no one' };
};
FD.rules = [
  { k: 'contrib', t: 'Contribution negative on matured units', a: 'Block the next batch until contribution is positive', h: 'Factory asks for the calculation' },
  { k: 'ret12', t: 'Customer returns at 12% or more', a: 'Stop replenishment (below wholesale)', h: 'Codes point to a production fault' },
  { k: 'impr', t: 'Impressions under 90% of the slot allocation', a: 'Re-run listing completeness and the slot', h: 'Still below after 7 days' },
  { k: 'conv', t: 'Kept conversion under the 1.8% benchmark', a: 'Show the benchmark gap in the panel, nothing else', h: 'Factory disputes the benchmark' },
  { k: 'sla', t: 'Dispatch SLA under 95%', a: "Hub-packed: the Hub's miss. Factory-packed: route to Hub", h: 'Still under 95% after routing' },
  { k: 'ret6', t: 'Customer returns above 6%', a: 'Return codes to the floor, D+20 mystery buy', h: 'Codes point to a production fault' },
  { k: 'rto', t: 'RTO above the 15% category median', a: 'Platform RTO tools, never against the factory', h: 'Never, on product grounds' }
];

/* ---------- Cluster Hub queues (illustrative) ---------- */
FD.hub = {
  samples: [
    { id: 's1', f: 'Kartik Weaving', card: 'Double bedsheet set', checks: [['Thread count', '200–240', '236'], ['Size', '90×100 in', '90×100 in'], ['Pillow covers', '2', '2'], ['Colour-fastness wash', 'no bleed', 'no bleed']], pass: true },
    { id: 's2', f: 'Singla Textiles', card: 'Bath towel 2-pack', checks: [['GSM', '500–600', '472'], ['Size', '70×140 cm', '70×138 cm'], ['Pieces', '2', '2'], ['Shedding test', 'low', 'low']], pass: false },
    { id: 's3', f: 'Noor Handloom', card: 'Anti-skid bath mat', checks: [['GSM', '1,200+', '1,260'], ['Size', '40×60 cm', '40×60 cm'], ['Backing', 'anti-skid', 'anti-skid'], ['Peel test', 'holds', 'holds']], pass: true }
  ],
  packing: [
    { f: 'Kalpana Textiles', sku: 'Double bedsheet set', n: 64 },
    { f: 'Gupta Bedlinen', sku: 'Double bedsheet set', n: 58 },
    { f: 'Shree Balaji Handloom', sku: 'Bath towel 2-pack', n: 71 },
    { f: 'Panipat Weavers Co.', sku: 'Double bedsheet set', n: 49 },
    { f: 'Sahil Textiles', sku: 'Anti-skid bath mat', n: 66 },
    { f: 'Bansal Furnishings', sku: 'Bath towel 2-pack', n: 53 },
    { f: 'Chawla Home Textiles', sku: 'Double bedsheet set', n: 51 }
  ],
  returns: [
    { id: 'r1', f: 'Rajdhani Terry Mills', sku: 'Double bedsheet set', why: 'Buyer: "colour ran in first wash"', hint: 'colour bleed' },
    { id: 'r2', f: 'Kalpana Textiles', sku: 'Double bedsheet set', why: 'Buyer: "smaller than bed"', hint: 'size short' },
    { id: 'r3', f: 'Mehta Handloom', sku: 'Cushion cover 5-pack', why: 'Buyer: "zip stuck"', hint: 'zip fails' },
    { id: 'r4', f: 'Shree Balaji Handloom', sku: 'Bath towel 2-pack', why: 'Buyer: "thin towel"', hint: 'GSM low' },
    { id: 'r5', f: 'Gupta Bedlinen', sku: 'Double bedsheet set', why: 'Buyer: "changed my mind"', hint: 'no defect' }
  ],
  codes: ['thread count low', 'colour bleed', 'size short', 'GSM low', 'zip fails', 'transit damage', 'no defect'],
  grades: ['Resell A', 'Back to B2B shelf', 'Scrap']
};
