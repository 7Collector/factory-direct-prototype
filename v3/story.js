/* Factory Direct · Story 3 "Follow the bedsheet".
   One 240 TC double bedsheet set travels from Meesho's data to a Panipat factory, the Cluster Hub,
   a buyer's home and back to the reorder. Plain JS, reads numbers from ../assets/data.js. */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const CARD = FD.cards[0];
  const K = FD.pilot[0];               // Kalpana Textiles
  const E = FD.econ;

  /* ---------- icons ---------- */
  const P = {
    tag: '<path d="M3 12V4h8l9 9-8 8z"/><circle cx="7.5" cy="8.5" r="1.4"/>',
    chart: '<path d="M4 20V11M10 20V5M16 20v-6M2 20h20"/>',
    factory: '<path d="M3 21V11l5 3v-3l5 3V5h5l2 16zM2 21h20"/>',
    box: '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',
    home: '<path d="M3 11l9-7 9 7v10H3z"/><path d="M9 21v-6h6v6"/>',
    repeat: '<path d="M4 12a8 8 0 0 1 14-5.3L20 9M20 12a8 8 0 0 1-14 5.3L4 15"/><path d="M20 4v5h-5M4 20v-5h5"/>',
    grid: '<circle cx="5" cy="5" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="12" cy="19" r="2"/><circle cx="19" cy="19" r="2"/>',
    rupee: '<path d="M6 4h12M6 9h12M9 4a5 5 0 0 1 0 10H6l8 7"/>',
    pin: '<path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
    check: '<path d="M4 12.5l5 5L20 6.5"/>',
    truck: '<path d="M2 6h11v10H2zM13 10h5l3 3v3h-8z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    notes: '<path d="M5 4h14v16H5zM9 9h6M9 13h6M9 17h3"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    batch: '<path d="M4 8h16v12H4zM8 8V4h8v4"/>',
    trend: '<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>',
    replay: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'
  };
  const ic = (k, s = 16, w = 2) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[k]}</svg>`;

  /* ---------- flat avatars ---------- */
  function avatar(o) {
    const back = o.hair === 'long' ? `<path d="M19 31c0-11 6-17 13-17s13 6 13 17v15c-3 2-6 2-8 0V30H27v16c-2 2-5 2-8 0z" fill="${o.hc}"/>`
      : o.hair === 'bun' ? `<circle cx="32" cy="14" r="6" fill="${o.hc}"/>` : '';
    const front = {
      long: `<path d="M20.5 28c1-8.5 6-13.5 11.5-13.5S42.5 19.5 43.5 28c-4.5-1-9.5-4-11.5-8.5-2 4.5-7 7.5-11.5 8.5z" fill="${o.hc}"/>`,
      bun: `<path d="M20.5 29c0-9 5-14.5 11.5-14.5S43.5 20 43.5 29c-3-4-7-7.5-11.5-8-4.5.5-8.5 4-11.5 8z" fill="${o.hc}"/>`,
      short: `<path d="M20.6 27c0-8.5 5-13 11.4-13s11.4 4.5 11.4 13c-2.4-3.6-5.4-5.4-11.4-5.4s-9 1.8-11.4 5.4z" fill="${o.hc}"/>`,
      side: `<path d="M20.6 28c-.6-9 4.6-14 11.4-14s12 5 11.4 14c-1.4-3-3-5-5-6-3 2-9 2.6-14 1.6-1.6 1-3 2.6-3.8 4.4z" fill="${o.hc}"/>`
    }[o.hair];
    return `<svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
      <circle cx="32" cy="32" r="32" fill="${o.bg}"/>${back}
      <path d="M9 64c2-12.5 11-19 23-19s21 6.5 23 19z" fill="${o.top}"/>
      ${o.vest ? `<path d="M22 47l4 17h-6l-5-14zM42 47l-4 17h6l5-14z" fill="${o.vest}"/>` : ''}
      ${o.collar ? `<path d="M27 45l5 7 5-7" fill="none" stroke="${o.collar}" stroke-width="2" stroke-linejoin="round"/>` : ''}
      <rect x="27.5" y="37" width="9" height="10" rx="4" fill="${o.skin}"/>
      <ellipse cx="32" cy="29.5" rx="11" ry="12.5" fill="${o.skin}"/>
      ${front}
      ${o.beard ? `<path d="M21.2 31c.4 8.5 5 13.5 10.8 13.5S42.4 39.5 42.8 31c-1.6 3.4-4.4 4.8-10.8 4.8S22.8 34.4 21.2 31z" fill="${o.hc}"/>` : ''}
      <circle cx="27.6" cy="30.5" r="1.4" fill="#2A2230"/><circle cx="36.4" cy="30.5" r="1.4" fill="#2A2230"/>
      ${o.glasses ? `<g fill="none" stroke="#570A57" stroke-width="1.3"><circle cx="27.6" cy="30.5" r="3.6"/><circle cx="36.4" cy="30.5" r="3.6"/><path d="M31.2 30.3h1.6"/></g>` : ''}
      ${o.mous ? `<path d="M27.4 35.2c1.6-1.2 3.2-1.2 4.6 0 1.4-1.2 3-1.2 4.6 0-1.2 1.8-3.2 2-4.6.9-1.4 1.1-3.4.9-4.6-.9z" fill="${o.mous}"/>` : `<path d="M28.6 35.6c2 1.7 4.8 1.7 6.8 0" fill="none" stroke="#8A4536" stroke-width="1.4" stroke-linecap="round"/>`}
      ${o.bindi ? `<circle cx="32" cy="24.8" r="1.1" fill="#D23B3B"/>` : ''}
      ${o.ear ? `<circle cx="21" cy="33.5" r="1.4" fill="${o.ear}"/><circle cx="43" cy="33.5" r="1.4" fill="${o.ear}"/>` : ''}
    </svg>`;
  }
  const PEOPLE = {
    ananya: { name: 'Ananya', role: 'Category analyst, Meesho', av: avatar({ bg: '#EBD9F0', skin: '#E7B48F', hc: '#2C1E2A', hair: 'long', top: '#9F2089', glasses: true, ear: '#F5841F' }) },
    rajesh: { name: 'Rajesh Kalpana', role: 'Owner, Kalpana Textiles · Panipat', av: avatar({ bg: '#FCE3C8', skin: '#C98D63', hc: '#A7A3AE', hair: 'short', top: '#FFFFFF', collar: '#E2DCE6', mous: '#77727E' }) },
    imran: { name: 'Imran', role: 'Operator, Panipat Cluster Hub', av: avatar({ bg: '#D3EFE2', skin: '#B97E58', hc: '#231C22', hair: 'side', top: '#38546B', vest: '#F5841F', beard: true }) },
    priya: { name: 'Priya', role: 'Buyer · Bareilly', av: avatar({ bg: '#FBD8E7', skin: '#D9A07A', hc: '#2A1C20', hair: 'bun', top: '#F43397', bindi: true, ear: '#F5C24A' }) }
  };

  /* ---------- place illustrations (420×150) ---------- */
  const sheet = (x, y, w, h, c, d) => `<g transform="translate(${x} ${y})"><path d="M0 0h${w}v${h - 6}q-${w / 4} 6-${w / 2} 0t-${w / 2} 0z" fill="${c}"/>${d ? `<circle cx="${w * .3}" cy="${h * .35}" r="3" fill="${d}"/><circle cx="${w * .7}" cy="${h * .6}" r="3" fill="${d}"/><circle cx="${w * .55}" cy="${h * .2}" r="2" fill="${d}"/>` : ''}</g>`;
  const PLACES = {
    today: () => `<rect width="420" height="150" fill="#F5ECF8"/><circle cx="360" cy="18" r="70" fill="#FAF3FC"/>
      <rect y="124" width="420" height="26" fill="#EBDCF0"/>
      <g transform="translate(196 56)">
        <rect x="0" y="46" width="130" height="24" rx="7" fill="#F5841F"/><path d="M10 58h110" stroke="#FFD3A8" stroke-width="2" stroke-dasharray="6 6"/>
        <rect x="6" y="24" width="118" height="24" rx="7" fill="#9F2089"/><path d="M16 36h98" stroke="#E5A8DA" stroke-width="2" stroke-dasharray="3 7"/>
        <rect x="12" y="2" width="106" height="24" rx="7" fill="#F9B776"/><circle cx="34" cy="14" r="4" fill="#F43397"/><circle cx="64" cy="14" r="4" fill="#fff"/><circle cx="94" cy="14" r="4" fill="#F43397"/>
        <rect x="18" y="-14" width="42" height="16" rx="6" fill="#fff" stroke="#EBDCF0"/><rect x="66" y="-14" width="42" height="16" rx="6" fill="#fff" stroke="#EBDCF0"/>
      </g>
      <path d="M318 56 352 30" stroke="#C9A9D2" stroke-width="1.5"/>
      <g transform="translate(346 14) rotate(10)"><path d="M0 0h50l12 15-12 15H0z" fill="#fff" stroke="#DDBFE2" stroke-width="1.5"/><circle cx="52" cy="15" r="2.5" fill="#DDBFE2"/><text x="23" y="20" text-anchor="middle" font-size="14" font-weight="900" fill="#570A57" font-family="Mulish">₹381</text></g>
      <g transform="translate(98 94)"><rect width="46" height="32" rx="4" fill="#E8C49A"/><path d="M0 10h46M23 0v10" stroke="#C99A66" stroke-width="2"/><text x="23" y="25" text-anchor="middle" font-size="10" font-weight="900" fill="#7A4A00" font-family="Mulish">+₹64</text></g>`,
    office: () => `<rect width="420" height="150" fill="#F3E8F7"/>
      <rect x="40" y="18" width="96" height="66" rx="6" fill="#fff" opacity=".8"/><path d="M88 18v66M40 51h96" stroke="#E8D6EE" stroke-width="3"/><circle cx="62" cy="38" r="9" fill="#FCE3C8"/>
      <g transform="translate(170 22)"><rect width="66" height="44" rx="6" fill="#fff" stroke="#E5CCE9"/><rect x="10" y="10" width="20" height="6" rx="3" fill="#F43397"/><rect x="10" y="22" width="44" height="4" rx="2" fill="#ECDCEF"/><rect x="10" y="30" width="34" height="4" rx="2" fill="#ECDCEF"/></g>
      <g transform="translate(246 30) rotate(4)"><rect width="52" height="36" rx="6" fill="#fff" stroke="#E5CCE9"/><rect x="8" y="8" width="16" height="5" rx="2.5" fill="#F5841F"/><rect x="8" y="18" width="36" height="4" rx="2" fill="#ECDCEF"/></g>
      <rect y="112" width="420" height="38" fill="#E8D7EE"/><rect x="150" y="104" width="250" height="10" rx="4" fill="#C9A9D2"/>
      <g transform="translate(218 52)"><rect width="104" height="54" rx="7" fill="#353543"/><rect x="5" y="5" width="94" height="44" rx="4" fill="#fff"/>
        <rect x="14" y="30" width="10" height="14" rx="2" fill="#E5CCE9"/><rect x="30" y="20" width="10" height="24" rx="2" fill="#9F2089"/><rect x="46" y="34" width="10" height="10" rx="2" fill="#E5CCE9"/><rect x="62" y="26" width="10" height="18" rx="2" fill="#E5CCE9"/><rect x="78" y="14" width="10" height="30" rx="2" fill="#F43397"/>
        <rect x="46" y="54" width="12" height="10" fill="#353543"/></g>
      <g transform="translate(350 70)"><rect x="0" y="16" width="24" height="20" rx="4" fill="#F5841F"/><path d="M12 16C6 6 2 4 0 0M12 16c2-9 6-12 12-14M12 16c0-8-1-12 0-16" stroke="#038D63" stroke-width="4" fill="none" stroke-linecap="round"/></g>
      <g transform="translate(176 90)"><rect width="16" height="14" rx="3" fill="#fff"/><path d="M16 4h4v6h-4" fill="none" stroke="#fff" stroke-width="2"/></g>`,
    factory: (more) => `<rect width="420" height="150" fill="#FFF2E2"/><circle cx="60" cy="30" r="16" fill="#FFD9A8"/>
      <rect y="122" width="420" height="28" fill="#F7DFC2"/>
      <path d="M176 64V40l34 24V40l34 24V40l34 24V40l34 24V40l34 24v62H176z" fill="#FFE3C4"/>
      <path d="M176 64V40l34 24V40l34 24V40l34 24V40l34 24V40l34 24" fill="none" stroke="#F5841F" stroke-width="4" stroke-linejoin="round"/>
      <path d="M210 40v24M244 40v24M278 40v24M312 40v24M346 40v24" stroke="#FFF4EA" stroke-width="4"/>
      <rect x="190" y="74" width="132" height="20" rx="5" fill="#fff"/><text x="256" y="88" text-anchor="middle" font-size="10.5" font-weight="900" fill="#9F2089" font-family="Mulish" letter-spacing=".6">KALPANA TEXTILES</text>
      <rect x="336" y="88" width="30" height="34" rx="3" fill="#E39A57"/><rect x="196" y="102" width="22" height="14" rx="2" fill="#FFF4EA"/><rect x="228" y="102" width="22" height="14" rx="2" fill="#FFF4EA"/><rect x="260" y="102" width="22" height="14" rx="2" fill="#FFF4EA"/><rect x="292" y="102" width="22" height="14" rx="2" fill="#FFF4EA"/>
      <path d="M50 62h110" stroke="#B88A5E" stroke-width="2"/><path d="M50 58v66M160 58v66" stroke="#B88A5E" stroke-width="4" stroke-linecap="round"/>
      ${sheet(58, 62, 30, 40, '#F5841F', '#fff')}${sheet(92, 62, 30, 46, '#9F2089', '#F9B776')}${sheet(126, 62, 28, 38, '#F43397', '#fff')}
      ${more ? `<g transform="translate(372 76)"><rect x="0" y="22" width="36" height="24" rx="3" fill="#E8C49A"/><rect x="4" y="0" width="30" height="22" rx="3" fill="#F0D2AE"/><path d="M0 32h36M4 10h30" stroke="#C99A66" stroke-width="1.5"/></g>
        <g transform="translate(366 50)"><rect width="46" height="20" rx="10" fill="#038D63"/><text x="23" y="14" text-anchor="middle" font-size="10" font-weight="900" fill="#fff" font-family="Mulish">+150</text></g>` : ''}`,
    hub: () => `<rect width="420" height="150" fill="#E6F5EE"/><circle cx="66" cy="44" r="14" fill="#FFE7C4"/>
      <rect y="122" width="420" height="28" fill="#CFEBDD"/>
      <path d="M128 72Q228 18 328 72v50H128z" fill="#fff"/><path d="M128 72Q228 18 328 72" fill="none" stroke="#038D63" stroke-width="4"/>
      <rect x="168" y="52" width="120" height="17" rx="5" fill="#038D63"/><text x="228" y="64" text-anchor="middle" font-size="8.5" font-weight="900" fill="#fff" font-family="Mulish" letter-spacing=".6">PANIPAT CLUSTER HUB</text>
      <rect x="198" y="76" width="60" height="46" rx="3" fill="#D9F0E5"/><path d="M198 84h60M198 92h60M198 100h60M198 108h60M198 116h60" stroke="#B7DFCB" stroke-width="2"/>
      <g fill="#F0C48F" stroke="#D69A55" stroke-width="1.2"><rect x="140" y="100" width="24" height="22" rx="2"/><rect x="166" y="100" width="24" height="22" rx="2"/><rect x="152" y="80" width="24" height="20" rx="2"/></g>
      <g fill="#F5841F"><rect x="270" y="104" width="20" height="18" rx="2"/><rect x="292" y="104" width="20" height="18" rx="2"/><rect x="280" y="88" width="20" height="16" rx="2" fill="#9F2089"/></g>
      <g class="ill-truck" transform="translate(334 88)"><rect width="52" height="30" rx="4" fill="#9F2089"/><path d="M52 10h14l10 10v10H52z" fill="#570A57"/><rect x="56" y="13" width="10" height="7" rx="1.5" fill="#E6F5EE"/><circle cx="14" cy="32" r="6" fill="#353543"/><circle cx="62" cy="32" r="6" fill="#353543"/><circle cx="14" cy="32" r="2.4" fill="#fff"/><circle cx="62" cy="32" r="2.4" fill="#fff"/></g>`,
    home: () => `<rect width="420" height="150" fill="#FDEAF2"/>
      <rect x="296" y="20" width="84" height="58" rx="5" fill="#E2F1FA"/><path d="M338 20v58M296 49h84" stroke="#fff" stroke-width="4"/><circle cx="360" cy="36" r="7" fill="#FFE7C4"/>
      <path d="M290 18h96" stroke="#F43397" stroke-width="3" stroke-linecap="round"/><path d="M292 18c4 22 0 40-6 64M384 18c-4 22 0 40 6 64" stroke="#F9B8D5" stroke-width="10" fill="none" stroke-linecap="round"/>
      <rect y="122" width="420" height="28" fill="#F7D6E5"/>
      <rect x="150" y="60" width="14" height="66" rx="5" fill="#B8708F"/>
      <rect x="162" y="92" width="190" height="24" rx="7" fill="#F5841F"/><path d="M162 104h190" stroke="#F9B776" stroke-width="3" stroke-dasharray="2 10"/>
      <g fill="#fff"><circle cx="210" cy="100" r="3.5"/><circle cx="250" cy="108" r="3.5"/><circle cx="290" cy="99" r="3.5"/><circle cx="330" cy="108" r="3.5"/></g>
      <g fill="#F43397"><circle cx="230" cy="106" r="2.5"/><circle cx="270" cy="98" r="2.5"/><circle cx="310" cy="105" r="2.5"/></g>
      <rect x="168" y="80" width="40" height="14" rx="6" fill="#fff"/><rect x="212" y="80" width="40" height="14" rx="6" fill="#fff"/>
      <rect x="166" y="114" width="6" height="12" fill="#B8708F"/><rect x="344" y="114" width="6" height="12" fill="#B8708F"/>
      <g transform="translate(372 92)"><rect width="32" height="30" rx="3" fill="#E9B9CE"/><path d="M16 0v-14M8 -14h16l-4-14h-8z" stroke="#B8708F" stroke-width="2" fill="#FFE7C4"/></g>
      <g transform="translate(96 100)"><rect width="34" height="24" rx="3" fill="#E8C49A"/><path d="M0 8h34M17 0v8" stroke="#C99A66" stroke-width="1.6"/><circle cx="26" cy="17" r="5" fill="#038D63"/><path d="M23.6 17l1.7 1.7 3-3.2" stroke="#fff" stroke-width="1.4" fill="none"/></g>`,
    cluster: () => `<rect width="420" height="150" fill="#FFF4E8"/>
      <path d="M0 112C80 92 160 100 240 94s120-14 180-10v66H0z" fill="#F7E3CB"/>
      ${[[60, 92], [118, 84], [176, 86], [236, 80], [296, 78], [356, 76]].map(([x, y], i) => `<g transform="translate(${x} ${y})"><path d="M0 26V10l10 8V10l10 8V4h10v22z" fill="${i === 0 ? '#F5841F' : '#E9C7A2'}"/><circle cx="15" cy="-8" r="5" fill="${['#9F2089', '#038D63', '#9F2089', '#F0A93B', '#038D63', '#9F2089'][i]}"/></g>`).join('')}
      <path d="M20 132C120 120 220 128 400 116" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" stroke-dasharray="1 14"/>`,
    india: () => `<rect width="420" height="150" fill="#F5EEF8"/>
      <path d="M30 120C90 120 100 60 160 66s70 50 130 40 60-70 110-76" stroke="#E5CCE9" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="M30 120C90 120 100 60 160 66s70 50 130 40 60-70 110-76" stroke="#fff" stroke-width="2" fill="none" stroke-dasharray="6 8"/>
      ${[[40, 119, 1], [108, 86], [170, 67], [232, 92], [300, 104], [372, 44]].map(([x, y, f]) => `<g transform="translate(${x} ${y - 22})"><path d="M0 22s-9-8-9-14a9 9 0 0 1 18 0c0 6-9 14-9 14z" fill="${f ? '#F5841F' : '#9F2089'}"/><circle cy="8" r="3.2" fill="#fff"/></g>`).join('')}`
  };

  /* ---------- route ---------- */
  const STOPS = [
    { l: 'Today', i: 'tag', tone: 'today' },
    { l: 'Meesho data', i: 'chart', tone: 'lilac' },
    { l: 'Factory', i: 'factory', tone: 'cream' },
    { l: 'Cluster Hub', i: 'box', tone: 'mint' },
    { l: "Priya's home", i: 'home', tone: 'pink' },
    { l: 'Reorder', i: 'repeat', tone: 'cream' },
    { l: 'The cluster', i: 'grid', tone: 'sand' },
    { l: 'The ₹36', i: 'rupee', tone: 'lilac' },
    { l: 'India', i: 'pin', tone: 'sky' }
  ];

  /* ---------- state ---------- */
  const S = { cut: false, built: false, lang: 'en', price: 345, cost: 218, r: 5, qty: 100, bidPrice: 345, bid: false, hub: 0, hubMax: 0, packed: false, picked: false, fd: false, reDay: 14, placed: false, clDay: 60, sel: 0 };
  let beat = 0, lastDir = 1, notesOpen = false, seen = false;

  /* ---------- small helpers ---------- */
  const fmt = (v, f) => f === 'inr' ? inr(v) : f === 'pct' ? v.toFixed(1) + '%' : f === 'k' ? Math.round(v).toLocaleString('en-IN') : String(Math.round(v));
  const cnt = (to, f = 'int', from = 0) => `<span class="num" data-to="${to}" data-from="${from}" data-f="${f}">${fmt(REDUCED ? to : from, f)}</span>`;
  function countUp(root) {
    $$('[data-to]', root).forEach(el => {
      const to = +el.dataset.to, from = +el.dataset.from, f = el.dataset.f;
      if (REDUCED || to === from) { el.textContent = fmt(to, f); return; }
      const t0 = performance.now(), dur = +el.dataset.dur || 900;
      const step = t => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = fmt(from + (to - from) * e, f); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  }
  function confetti(from) {
    if (REDUCED) return;
    const r = from.getBoundingClientRect(), box = document.createElement('div');
    box.className = 'confetti'; box.style.left = (r.left + r.width / 2) + 'px'; box.style.top = (r.top + r.height / 2) + 'px';
    const cols = ['#9F2089', '#F43397', '#F5841F', '#038D63', '#F9B776', '#570A57'];
    for (let i = 0; i < 34; i++) {
      const s = document.createElement('i'), a = Math.random() * Math.PI * 2, d = 70 + Math.random() * 120;
      s.style.background = cols[i % cols.length];
      s.style.setProperty('--x', Math.cos(a) * d + 'px'); s.style.setProperty('--y', (Math.sin(a) * d - 60) + 'px'); s.style.setProperty('--r', (Math.random() * 540 - 270) + 'deg');
      s.style.animationDelay = (Math.random() * .08) + 's';
      box.appendChild(s);
    }
    document.body.appendChild(box); setTimeout(() => box.remove(), 1500);
  }
  const quote = (hi, en, cite) => ({ hi, en, cite });

  /* ---------- widgets ---------- */
  const W = {};

  W.receipt = () => {
    const cuts = FD.waterfall.filter(x => !x.total && x.v < 0);
    const removable = -cuts.reduce((a, b) => a + b.v, 0);   // 38
    const need = 381 - removable;                             // 343
    return `<div class="card receipt">
      <div class="row between"><span class="eyebrow">Today on Meesho · 240 TC double bedsheet set</span><span class="pill brand">${ic('tag', 13)} via a trader</span></div>
      <div class="row mt12" style="align-items:flex-end;gap:16px">
        <div class="big" id="r-price">${S.cut ? cnt(345, 'inr', 381) : cnt(381, 'inr', 0)}</div>
        <div class="muted small" style="padding-bottom:6px">${S.cut ? '<b class="ok-t">all-in, like for like</b><br>same set, same spec' : 'all-in to the buyer<br>= <b>₹317</b> price + <b>₹64</b> delivery'}</div>
      </div>
      <div class="stackbar ${S.cut ? 'cut-on' : ''}" aria-label="Price stack">
        <div class="keep" style="flex:${need}">₹${need} it really costs</div>
        <div class="cuts" style="flex:${S.cut ? 0.0001 : removable}">${S.cut ? '' : '₹' + removable}</div>
        <div class="fk" style="flex:${S.cut ? 2 : 0.0001}"></div>
      </div>
      <div class="cutlegend ${S.cut ? 'gone' : ''}">${cuts.map(c => `<div><b>₹${-c.v}</b>${c.l.replace('Returns 8%→5%', 'Returns 8% → 5%')}</div>`).join('')}</div>
      <div class="row between mt16">
        <span class="small muted">${S.cut ? `<b class="m-t">₹36</b> back to the buyer · <b class="g-t">+₹2</b> more for the factory` : `<b>₹${removable}</b> of it is cost that does not need to exist.`}</span>
        <button class="btn ${S.cut ? 'line' : ''}" id="r-cut">${S.cut ? 'Put it back' : 'Take out the ₹' + removable}</button>
      </div>
    </div>
    <div class="card soft mt12">
      <div class="eyebrow">Why no factory sells direct today · the brief's four barriers</div>
      <div class="barriers mt8">
        ${[['box', 'Operational hassle', 'A Cluster Hub in its own town'], ['batch', 'Inventory risk', 'A 100-unit Pilot Batch'], ['trend', 'Unproven demand', 'A Demand Card it can check'], ['clock', 'Weak early scale-up', 'A 60-day slot, reads by rule']]
          .map(b => `<div><i>${ic(b[0], 15)}</i><span><b>${b[1]}</b>→ ${b[2]}</span></div>`).join('')}
      </div>
    </div>`;
  };
  W.receipt.bind = root => { $('#r-cut', root).onclick = () => { S.cut = !S.cut; restage(); }; };

  W.signals = () => `<div class="card">
      <div class="row between"><span class="eyebrow">What Meesho already sees · Panipat home textiles</span><span class="pill brand">Oct 2026</span></div>
      <div class="signals mt12">
        <div class="sig"><div class="l">How much sells</div><div class="v">1 in 4</div><div class="s">bedsheet-set orders are this set</div><div class="meter mt8" style="width:100%"><i style="width:25%"></i></div></div>
        <div class="sig"><div class="l">At what price</div><div class="v">₹330–380</div><div class="s">where 55% of orders land</div>
          <div class="mini-bands">${CARD.bands.map((b, i) => `<i class="${i === 1 ? 't' : ''}" style="height:${b.v * 100 * .8}px"></i>`).join('')}</div></div>
        <div class="sig"><div class="l">Why it comes back</div><div class="v sm">${CARD.returns.slice(0, 2).join(', ')}</div><div class="s">and ${CARD.returns[2]}: all fixable on the floor</div></div>
        <div class="sig"><div class="l">Room · reorders</div><div class="v">High · 3 of 5</div><div class="s">more searches than supply; last batches reordered</div></div>
      </div>
      <div class="arrowdown">Ananya turns signals into one card</div>
      <div class="cardgen ${S.built ? 'made pop' : ''}">
        <span class="ic">${ic(S.built ? 'check' : 'spark', 22)}</span>
        <div style="flex:1;min-width:0"><b>${S.built ? 'Demand Card ready · Double bedsheet set' : 'Demand Card · draft'}</b>
          <div class="xs muted">${S.built ? 'Shares and signals, never a forecast. Going to Panipat bedsheet makers.' : 'One product, one cluster, one spec.'}</div></div>
        ${S.built ? `<span class="pill ok">${ic('check', 12)} Sent</span>` : `<button class="btn" id="g-build">Build the card</button>`}
      </div>
    </div>`;
  W.signals.bind = root => { const b = $('#g-build', root); if (b) b.onclick = () => { S.built = true; restage(); }; };

  W.dcard = () => {
    const L = FD.i18n[S.lang], hi = S.lang === 'hi', s = FD.settle(CARD.price, CARD.cost, 5);
    const t = (en, h) => hi ? `<span class="hi">${h}</span>` : en;
    return `<div class="dcard ${hi ? 'is-hi' : ''}">
      <div class="hd"><div><div class="eyebrow">${t(L.card + ' · Panipat · Oct 2026', L.card + ' · पानीपत · अक्टूबर 2026')}</div><h3>${t(CARD.name, CARD.hiName)}</h3></div>
        <div class="lang" role="group" aria-label="Language"><button data-l="en" aria-pressed="${!hi}">EN</button><button data-l="hi" aria-pressed="${hi}" class="hi">हिं</button></div></div>
      <div class="bd">
        <div class="fact full"><dt>${t(L.what, L.what)}</dt><dd>${hi ? `<span class="hi">${CARD.hiSpec}</span>` : `<div class="row" style="gap:6px">${CARD.chips.map(c => `<span class="chip sm">${c}</span>`).join('')}</div>`}</dd></div>
        <div class="fgrid">
          <div class="fact"><dt>${t(L.sells, L.sells)}</dt><dd><span class="meter"><i style="width:25%"></i></span>${t(CARD.shareTxt, CARD.hiShare)}</dd></div>
          <div class="fact"><dt>${t(L.way, L.way)}</dt><dd><span class="up">↑</span> ${t(CARD.trendTxt, CARD.hiTrend)}</dd></div>
          <div class="fact"><dt>${t(L.price, L.price)}</dt><dd><div class="bands">${CARD.bands.map((b, i) => `<div class="${i === 1 ? 't' : ''}"><i style="height:${Math.round(b.v * 44)}px"></i>${b.l}</div>`).join('')}</div></dd></div>
          <div class="fact"><dt>${t(L.ret, L.ret)}</dt><dd>${(hi ? CARD.hiReturns : CARD.returns).map(x => `<span class="rtag ${hi ? 'hi' : ''}">${x}</span>`).join('')}</dd></div>
          <div class="fact"><dt>${t(L.room, L.room)}</dt><dd><b class="m-t">${t(CARD.room, CARD.hiRoom)}</b> · ${t(CARD.roomTxt, CARD.hiRoomTxt)}</dd></div>
          <div class="fact"><dt>${t(L.reord, L.reord)}</dt><dd><span class="dots">${[0, 1, 2, 3, 4].map(i => `<i class="${i < CARD.reorder ? 'f' : ''}"></i>`).join('')}</span>${CARD.reorder}/5 ${t(CARD.reorderTxt, CARD.hiReorder)}</dd></div>
        </div>
        <div class="fact full"><dt>${t(L.ask, L.ask)}</dt><dd>${t(CARD.ask, CARD.hiAsk)}</dd></div>
        <div class="money">
          <div><small>${t(L.money + ' ₹345', L.money + ' ₹345 पर')}</small><span class="big">${inr(s.recv)}</span> <small style="display:inline">${t(L.recv, L.recv)}</small></div>
          <div style="text-align:right"><span class="big g-t">${inr(s.keep)}</span><small>${t(L.keep + ' ₹218', L.keep + ' ₹218 पर')}</small></div>
        </div>
        <div class="nf">${t(L.nf, L.nf)}</div>
      </div>
    </div>`;
  };
  W.dcard.bind = root => $$('.lang button', root).forEach(b => b.onclick = () => { S.lang = b.dataset.l; restage(); });

  function verdict(s) {
    const w = E.WHOLESALE;
    if (s.keep < 0) return ['bad', 'Below cost: the panel will not offer a replenishment.'];
    if (s.today < w - .5) return ['bad', `Below wholesale (₹${w}). This is why replenishment stops at 12% returns.`];
    if (s.today < w + 1.5) return ['warn', `About wholesale (₹${w}), but paid in 7 days instead of 15–60.`];
    return ['ok', `Clears wholesale (₹${w}), and paid in 7 days instead of 15–60.`];
  }
  W.calc = () => {
    const s = FD.settle(S.price, S.cost, S.r), v = verdict(s), dec = n => Number.isInteger(n) ? inr(n) : '₹' + n.toFixed(2);
    return `<div class="card calc">
      <div class="row between"><span class="eyebrow">Settlement calculator · his numbers, not ours</span><span class="pill brand">${ic('clock', 12)} paid day 7</span></div>
      <div class="calc-g mt12">
        <div>
          <div class="ins">
            <div class="field"><label for="c-price">His price, all-in</label><div class="pre"><span>₹</span><input class="input num" id="c-price" type="number" inputmode="numeric" value="${S.price}" min="200" max="500"></div></div>
            <div class="field"><label for="c-cost">His cost per set</label><div class="pre"><span>₹</span><input class="input num" id="c-cost" type="number" inputmode="numeric" value="${S.cost}" min="100" max="400"></div></div>
          </div>
          <div class="field mt12"><label>Customer returns</label>
            <div class="ladder" id="c-lad">${FD.ladder.map(l => `<button data-r="${l.r}" aria-pressed="${S.r === l.r}" class="${l.stop ? 'stop' : ''}"><b>${l.l}</b><small>${l.s}</small></button>`).join('')}</div></div>
          <div class="verdict ${v[0]} mt12">${ic(v[0] === 'ok' ? 'check' : 'clock', 16)}<span>${v[1]}</span></div>
        </div>
        <div>
          <div class="bk">
            <div><span>Price</span><span>${inr(S.price)}</span></div>
            <div><span class="muted">− Shipping</span><span>${inr(E.SHIP)}</span></div>
            <div><span class="muted">− Hub packing</span><span>${inr(E.PACK)}</span></div>
            <div><span class="muted">− Returns reserve (${S.r}% × ₹${E.REVERSE})</span><span>${dec(s.reserve)}</span></div>
            <div class="tot"><span>He receives, day 7</span><span>${inr(s.recv)}</span></div>
          </div>
          <div class="keep mt12">
            <div class="hl"><small>He keeps per set</small><b>${cnt(s.keep, 'inr', S._lk ?? 0)}</b></div>
            <div><small>In today's money</small><b class="${s.today < E.WHOLESALE - .5 ? 'r-t' : 'g-t'}">${cnt(s.today, 'inr', S._lt ?? 0)}</b><small>vs ₹${E.WHOLESALE} wholesale</small></div>
          </div>
        </div>
      </div>
    </div>`;
  };
  W.calc.bind = root => {
    const s0 = FD.settle(S.price, S.cost, S.r); S._lk = s0.keep; S._lt = s0.today;
    const upd = () => { S.price = +$('#c-price', root).value || 0; S.cost = +$('#c-cost', root).value || 0; restage(true); };
    ['#c-price', '#c-cost'].forEach(id => { const el = $(id, root); el.onchange = upd; el.onkeydown = e => { if (e.key === 'Enter') upd(); }; });
    $$('#c-lad button', root).forEach(b => b.onclick = () => { S.r = +b.dataset.r; restage(true); });
  };

  W.bid = () => {
    if (S.bid) return `<div class="card">
      <div class="row" style="gap:16px"><span class="tick pop">${ic('check', 28, 2.6)}</span><div><span class="eyebrow">Bid placed · Kalpana Textiles</span><h3 style="font-size:24px;margin-top:4px">${S.qty} sets at ${inr(S.bidPrice)}</h3><div class="small muted">His spec, his price. Nothing paid, nothing guaranteed.</div></div></div>
      <div class="tl mt20">
        <div class="ok"><i>${ic('check', 13, 3)}</i><span><b>Bid in, card matched</b><small>240 TC · 90×100 inch · 2 pillow covers</small></span></div>
        <div><i>2</i><span><b>Spec sample to the Panipat Cluster Hub</b><small>checked against the card before anything goes live</small></span></div>
        <div><i>3</i><span><b>Batch of ${S.qty} goes live, 60-day trial slot</b><small>stock stays his; packed and shipped by the Hub</small></span></div>
        <div><i>4</i><span><b>Paid day 7 · read at D+14, 30, 60</b><small>by rule, no account manager</small></span></div>
      </div>
      <button class="btn ghost sm mt8" id="b-edit">${ic('back', 14)} Change the bid</button>
    </div>`;
    return `<div class="card">
      <div class="row between"><span class="eyebrow">Bid on this card · Double bedsheet set</span><span class="pill brand">${CARD.bids} bids so far</span></div>
      <div class="bid-g mt12">
        <div>
          <label class="field" for="b-qty"><span class="lbl2">Pilot Batch</span></label>
          <div class="qty"><b class="num" id="b-q">${S.qty}</b><span class="muted small">sets</span></div>
          <input type="range" id="b-qty" min="100" max="200" step="10" value="${S.qty}" aria-label="Pilot batch size">
          <div class="row between xs faint"><span>100</span><span>smaller than his smallest B2B order</span><span>200</span></div>
        </div>
        <div>
          <div class="field"><label for="b-price">His price, all-in</label><div class="pre"><span>₹</span><input class="input num" id="b-price" type="number" value="${S.bidPrice}" min="250" max="450"></div></div>
          <div class="xs faint mt4">Card's band: most orders at ₹330–380. Meesho never sets it.</div>
        </div>
      </div>
      <div class="mt16"><div class="eyebrow">What he never gets, and never owes</div>
        <div class="never mt8"><span>Upfront cash</span><span>Volume guarantee</span><span>A Meesho-set price</span><span>Exclusivity</span><span>Meesho taking his stock</span></div></div>
      <div class="row between mt20"><span class="small muted">Unsold stock stays his. That is the only risk, and it is 100 sets.</span><button class="btn" id="b-go">Place bid ${ic('arrow', 15)}</button></div>
    </div>`;
  };
  W.bid.bind = root => {
    const q = $('#b-qty', root);
    if (q) { q.oninput = () => { S.qty = +q.value; $('#b-q', root).textContent = S.qty; }; $('#b-price', root).onchange = e => { S.bidPrice = +e.target.value || 345; }; $('#b-go', root).onclick = e => { S.bidPrice = +$('#b-price', root).value || 345; S.bid = true; restage(); confetti(e.currentTarget); }; }
    const ed = $('#b-edit', root); if (ed) ed.onclick = () => { S.bid = false; restage(); };
  };

  W.hub = () => {
    const pk = FD.hub.packing, total = pk.reduce((a, b) => a + b.n, 0), be = 400;
    const steps = ['Check sample', 'Pack', 'One pickup'];
    const state = i => i < S.hub ? 'done' : i === S.hub ? 'now' : '';
    let body;
    if (S.hub === 0) body = `<div class="cmp h mt12"><span>Kalpana sample</span><span>Card says</span><span>Measured</span><span></span></div>
      ${[['Thread count', '200–240', '238'], ['Size', '90×100 in', '90×100 in'], ['Pillow covers', '2', '2'], ['Colour-fastness wash', 'no bleed', 'no bleed']].map((c, i) => `<div class="cmp chk" style="animation-delay:${i * .12}s"><span><b>${c[0]}</b></span><span class="muted">${c[1]}</span><span><b>${c[2]}</b></span><span class="y">${ic('check', 16, 3)}</span></div>`).join('')}
      <div class="row between mt16"><span class="small muted">If it fails, nothing goes live. The factory sees which check failed.</span><button class="btn" id="h-pass">${ic('shield', 16)} Pass sample</button></div>`;
    else if (S.hub === 1) body = `<div class="row between mt12"><span class="small"><b class="num" id="h-n">${S.packed ? total : 0}</b> <span class="muted">of ${total} parcels packed today · <b class="m-t">${pk[0].n}</b> are Kalpana's</span></span>${S.packed ? '' : `<button class="btn" id="h-pack">${ic('box', 16)} Pack today's parcels</button>`}</div>
      <div class="parcels" id="h-grid">${pk.map((p, fi) => Array.from({ length: p.n }, () => `<i class="${S.packed ? (fi === 0 ? 'k on' : 'on f' + fi) : (fi === 0 ? 'k' : 'f' + fi)}"></i>`).join('')).join('')}</div>
      <div class="flist mt12">${pk.map((p, i) => `<span class="${i === 0 ? 'me' : ''}"><i class="f${i}"></i>${p.f.replace(' Textiles', '').replace(' Furnishings', '').replace(' Home', '').replace(' Handloom', '').replace(' Co.', '')} ${p.n}</span>`).join('')}</div>
      ${S.packed ? `<div class="row between mt16"><span class="small muted">Singles, packed to the card. The factory never touches a courier.</span><button class="btn" id="h-next">${ic('truck', 16)} Call the pickup</button></div>` : ''}`;
    else body = `<div class="truckrow mt12 ${S.picked ? 'go' : ''}"><div class="road"></div>
        <svg class="mtruck" viewBox="0 0 120 56" width="120" height="56" aria-hidden="true"><rect x="2" y="6" width="74" height="38" rx="5" fill="#9F2089"/><text x="39" y="30" text-anchor="middle" font-size="12" font-weight="900" fill="#fff" font-family="Mulish">${total}</text><path d="M76 18h20l14 14v12H76z" fill="#570A57"/><rect x="82" y="22" width="13" height="9" rx="2" fill="#E6F5EE"/><circle cx="22" cy="46" r="8" fill="#353543"/><circle cx="92" cy="46" r="8" fill="#353543"/><circle cx="22" cy="46" r="3" fill="#fff"/><circle cx="92" cy="46" r="3" fill="#fff"/></svg></div>
      <div class="row between mt12"><b>One pickup · ${total} parcels · ${pk.length} factories</b><span class="pill ok">${ic('check', 12)} above break-even</span></div>
      <div class="gauge"><i style="width:${S.picked ? total / 500 * 100 : 0}%"></i><span class="be" style="left:${be / 500 * 100}%"><span>break-even ${be}/day</span></span></div>
      <div class="row between xs faint mt8"><span>0</span><span>500 parcels</span></div>
      <div class="truck mt16">${ic('truck', 22)}<span>Seven factories share one truck, one rate card and one operator. Kalpana alone ships ${pk[0].n}: too few for a pickup, plenty for a Hub.</span></div>`;
    return `<div class="card">
      <div class="row between"><span class="eyebrow">Panipat Cluster Hub · today</span><span class="pill brand">independent operator · published rates</span></div>
      <div class="hubsteps mt12">${steps.map((s, i) => `<button data-h="${i}" class="${state(i)}"><i>${i < S.hub ? ic('check', 12, 3) : i + 1}</i>${s}</button>`).join('')}</div>
      ${body}
    </div>`;
  };
  W.hub.bind = root => {
    $$('.hubsteps button', root).forEach(b => b.onclick = () => { const i = +b.dataset.h; if (i <= S.hubMax) { S.hub = i; restage(); } });
    const pass = $('#h-pass', root); if (pass) pass.onclick = () => { S.hub = 1; S.hubMax = Math.max(S.hubMax || 0, 1); restage(); };
    const pack = $('#h-pack', root);
    if (pack) pack.onclick = () => {
      pack.disabled = true;
      const tiles = $$('#h-grid i', root), n = $('#h-n', root), total = tiles.length;
      let k = 0; const per = REDUCED ? total : Math.ceil(total / 45);
      const tick = () => {
        for (let j = 0; j < per && k < total; j++, k++) tiles[k].classList.add('on');
        n.textContent = k;
        if (k < total) setTimeout(tick, 22); else { S.packed = true; setTimeout(restage, 250); }
      };
      tick();
    };
    const nx = $('#h-next', root); if (nx) nx.onclick = () => { S.hub = 2; S.hubMax = 2; restage(); setTimeout(() => { S.picked = true; const tr = $('.truckrow'); if (tr) { tr.classList.add('go'); const g = $('.gauge i'); if (g) g.style.width = (412 / 500 * 100) + '%'; } }, 120); };
  };

  W.buyer = () => {
    const fd = S.fd;
    return `<div class="buyer">
      <div class="phone"><div class="screen">
        <div class="notch"></div><div class="sb"><span>9:41</span><span>●●● 4G</span></div>
        <div class="mb"><span class="wm-s">meesho</span><span class="s">double bedsheet cotton</span></div>
        <div class="scroll">
          <div class="pimg">${placeSVG('home')}</div>
          <div class="pb">
            <div class="pt">${fd ? 'Double bedsheet set, 240 TC cotton, 90×100 in + 2 pillow covers' : 'Premium Cotton Double Bedsheet with 2 Pillow Covers'}</div>
            <div class="pp"><b class="num" id="ph-price">${fd ? cnt(345, 'inr', S._fromToday ? 381 : 345) : '₹317'}</b>${fd ? '<span class="ai">all-in · free delivery</span>' : '<span class="del">+ ₹64 delivery</span>'}</div>
            <div class="row mt4" style="gap:6px"><span class="rating">4.1 ★</span><span class="xs faint">${fd ? '1,284 ratings' : '22,410 ratings'}</span></div>
            ${fd ? `<div class="maker pop mark" data-n="1"><span class="fi">${ic('factory', 15)}</span><span><b>Made and sold by Kalpana Textiles · Panipat</b><small>The factory itself, not a reseller</small></span></div>
              <div class="spec pop mark" data-n="2"><div class="h"><span>Spec Card</span><span class="g-t">${ic('shield', 11)} Hub-checked</span></div><div class="g">${[['Thread count', '240'], ['Size', '90×100 in'], ['Pillow covers', '2'], ['Fabric', '100% cotton']].map(x => `<div><small>${x[0]}</small><b>${x[1]}</b></div>`).join('')}</div></div>
              <div class="l4l mark" data-n="3">₹36 less than the same spec elsewhere</div>`
            : `<div class="missing">Sold by <b>SR Home Traders</b> · thread count not stated · size “double”</div>`}
          </div>
        </div>
        <div class="pcta"><button class="btn line">Add to cart</button><button class="btn">Buy now</button></div>
      </div></div>
      <div class="side">
        <div class="seg" role="group" aria-label="Listing"><button data-fd="0" aria-pressed="${!fd}">Today</button><button data-fd="1" aria-pressed="${fd}">Factory Direct</button></div>
        <div class="adds mt16 ${fd ? '' : 'dim'}">
          <div><i>1</i><span><b>A maker, not a badge</b>The buyer sees who made it, and where.</span></div>
          <div><i>2</i><span><b>A Spec Card the Hub checked</b>Thread count, size, pieces, fabric.</span></div>
          <div><i>3</i><span><b>₹345 all-in</b>Was ₹317 + ₹64 delivery = ₹381.</span></div>
        </div>
        <div class="choose mt16 ${fd ? '' : 'dim'}"><b>${fd ? cnt(15, 'int', 0) : '15'}<small>/20</small></b><span>buyers in our test picked the Factory Direct listing</span></div>
        <div class="rq mt12"><span class="hi">“Checked hai toh COD chhod sakta hoon.”</span><small>“If it's checked, I can skip cash on delivery.” · a buyer we interviewed</small></div>
      </div>
    </div>`;
  };
  W.buyer.bind = root => $$('.seg button', root).forEach(b => b.onclick = () => { const v = b.dataset.fd === '1'; if (v === S.fd) return; S._fromToday = v; S.fd = v; restage(); });

  W.reorder = () => {
    const r = FD.read(K, S.reDay), j = FD.judge(r), offer = r.sold > 50;
    const C = 2 * Math.PI * 34;
    return `<div class="card">
      <div class="row between"><span class="eyebrow">Supplier Panel · Kalpana Textiles · Pilot Batch</span>
        <div class="seg" role="group" aria-label="Read day">${[14, 30].map(d => `<button data-d="${d}" aria-pressed="${S.reDay === d}">D+${d}</button>`).join('')}</div></div>
      <div class="re-g mt12">
        <div class="sold">
          <svg class="ring" viewBox="0 0 84 84" width="96" height="96" aria-hidden="true"><circle cx="42" cy="42" r="34" fill="none" stroke="#F1E3F3" stroke-width="10"/><circle cx="42" cy="42" r="34" fill="none" stroke="#9F2089" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - r.sold / 100)}" transform="rotate(-90 42 42)" class="ringv"/></svg>
          <div><b class="big2">${cnt(r.sold, 'int', S._ls ?? 0)}<small>/100</small></b><div class="small muted">sets sold by D+${S.reDay}</div><span class="pill ${j.s} mt4">${j.label}</span></div>
        </div>
        <div class="reads">
          <div><b>${r.impr.toLocaleString('en-IN')}</b><small>impressions</small></div>
          <div><b>${r.conv}%</b><small>kept conversion · bench ${FD.BENCH}%</small></div>
          <div><b>${r.ret}%</b><small>returns · review at 6%</small></div>
          <div><b>${r.sla}%</b><small>dispatch SLA</small></div>
          <div><b>${r.rto}%</b><small>RTO · median ${FD.RTO_MED}%</small></div>
          <div><b class="g-t">₹${r.contrib}</b><small>contribution / set</small></div>
        </div>
      </div>
      <div class="offer mt16 ${S.placed ? 'placed glow' : ''}">
        ${S.placed ? `<div class="row" style="gap:14px"><span class="tick">${ic('check', 26, 2.6)}</span><div><b style="font-size:17px">Second batch: 150 sets, on his own money</b><div class="small muted">No one asked him to. This is the north star: a factory that reorders by itself.</div></div></div>`
        : `<div class="row between"><div><b style="font-size:16px">${ic('repeat', 15)} Replenishment offer · 150 sets</b><div class="small muted">Over 50% sold with positive contribution. His money, his price, his call.</div></div><button class="btn" id="re-place">Place 150 sets</button></div>`}
      </div>
      <div class="xs muted mt12">${ic('shield', 12)} Rules act on their own. A human looks only if defect codes point to a production fault, the factory disputes a benchmark, or SLA stays under 95% after routing.</div>
    </div>`;
  };
  W.reorder.bind = root => {
    S._ls = FD.read(K, S.reDay).sold;
    $$('.seg button', root).forEach(b => b.onclick = () => { S._ls = FD.read(K, S.reDay).sold; S.reDay = +b.dataset.d; restage(true); });
    const p = $('#re-place', root); if (p) p.onclick = e => { const btn = e.currentTarget; S.placed = true; confetti(btn); restage(true); };
  };

  const CTRL = { 14: [0, 24], 30: [0, 37], 60: [3, 55], 90: [4, 66] };
  W.cluster = () => {
    const d = S.clDay, reads = FD.pilot.map(p => ({ p, r: FD.read(p, d) })).map(x => ({ ...x, j: FD.judge(x.r) }));
    const re = reads.filter(x => x.r.reordered).length;
    const sell = Math.round(reads.reduce((a, x) => a + x.r.sold, 0) / 30);
    const sel = reads[S.sel], grp = k => reads.filter(x => !x.r.reordered && x.j.s === k).length;
    return `<div class="card">
      <div class="row between"><span class="eyebrow">C2M Console · Panipat pilot · 30 batches</span>
        <div class="seg" role="group" aria-label="Read day">${[14, 30, 60, 90].map(x => `<button data-d="${x}" aria-pressed="${d === x}">D+${x}</button>`).join('')}</div></div>
      <div class="cluster mt12">
        <div>
          <div class="dotgrid">${reads.map((x, i) => `<button class="fdot ${x.r.reordered ? 're' : x.j.s} ${i === S.sel ? 'sel' : ''}" data-i="${i}" title="${x.p.f}" aria-label="${x.p.f}: ${x.j.short}">${i === 0 ? 'K' : x.r.reordered ? ic('repeat', 13, 2.6) : ''}</button>`).join('')}</div>
          <div class="legend mt12"><span style="--c:#9F2089">reordered ${re}</span><span style="--c:#038D63">on track ${grp('ok')}</span><span style="--c:#F0A93B">being fixed ${grp('warn')}</span><span style="--c:#D23B3B">stopped ${grp('bad')}</span></div>
          <div class="selinfo mt12"><b>${sel.p.f}</b> · ${sel.p.sku} · ${sel.r.sold}/100 sold · <span class="pill ${sel.j.s}">${sel.j.short}</span><div class="xs mt4">${sel.j.action}</div></div>
        </div>
        <div>
          <div class="ns"><div class="eyebrow" style="color:var(--m)">North star · own-money 2nd batch</div>
            <div class="v mt8">${cnt(re, 'int', S._lre ?? 0)}<small> / 30</small></div>
            <div class="prog"><i style="width:${re / 30 * 100}%"></i><span class="gate" style="left:50%"></span></div>
            <div class="xs muted mt8">Gate: 50% by D+60 · 60% by D+90</div></div>
          <div class="ctl mt12"><div class="row between"><span class="xs muted"><b>Matched controls</b> reordered</span><b>${CTRL[d][0]}/30</b></div>
            <div class="row between mt4"><span class="xs muted">Sell-through, pilot vs control</span><b>${sell}% · <span class="faint">${CTRL[d][1]}%</span></b></div></div>
        </div>
      </div>
    </div>`;
  };
  W.cluster.bind = root => {
    S._lre = FD.pilot.filter(p => FD.read(p, S.clDay).reordered).length;
    $$('.seg button', root).forEach(b => b.onclick = () => { S._lre = FD.pilot.filter(p => FD.read(p, S.clDay).reordered).length; S.clDay = +b.dataset.d; restage(true); });
    $$('.fdot', root).forEach(b => b.onclick = () => { S.sel = +b.dataset.i; S._lre = FD.pilot.filter(p => FD.read(p, S.clDay).reordered).length; restage(true); });
  };

  W.waterfall = () => {
    const WF = FD.waterfall, Wd = 680, H = 300, L = 46, R = 10, T = 26, B = 52, lo = 320, hi = 390;
    const y = v => T + (hi - v) / (hi - lo) * (H - T - B);
    const bw = (Wd - L - R) / WF.length;
    let run = 0, out = '';
    for (let v = 330; v <= 390; v += 20) out += `<line x1="${L}" x2="${Wd - R}" y1="${y(v)}" y2="${y(v)}" stroke="#ECEAF1"/><text x="${L - 8}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="#8B8BA3" font-weight="700">₹${v}</text>`;
    out += `<path d="M${L - 4} ${y(lo) - 6}l4 -4 4 4 4 -4" stroke="#8B8BA3" fill="none"/>`;
    WF.forEach((s, i) => {
      const x = L + i * bw + bw * .16, w = bw * .68;
      let y0, y1, col, lab;
      if (s.total) { y0 = y(s.v); y1 = y(lo); run = s.v; col = s.ghost ? 'none' : s.fd ? 'url(#wfm)' : '#B9B4C6'; lab = '₹' + s.v; }
      else { const a = run, b = run + s.v; y0 = y(Math.max(a, b)); y1 = y(Math.min(a, b)); run = b; col = s.v < 0 ? '#F5841F' : '#038D63'; lab = (s.v < 0 ? '−₹' : '+₹') + Math.abs(s.v); }
      const delay = (i * .09).toFixed(2);
      out += `<g class="wfb" style="animation-delay:${delay}s;transform-origin:${x + w / 2}px ${s.total ? y1 : y0}px"><rect x="${x}" y="${y0}" width="${w}" height="${Math.max(2, y1 - y0)}" rx="5" fill="${col}" ${s.ghost ? 'stroke="#9F2089" stroke-dasharray="4 3" stroke-width="1.5"' : ''}/></g>
        <text x="${x + w / 2}" y="${y0 - 7}" text-anchor="middle" font-size="${s.total ? 14 : 12.5}" font-weight="900" fill="${s.fd ? '#9F2089' : s.total ? '#353543' : s.v < 0 ? '#C25E00' : '#038D63'}">${lab}</text>
        ${s.total || i === WF.length - 1 ? '' : `<line x1="${x + w}" x2="${x + bw + bw * .16}" y1="${y(run)}" y2="${y(run)}" stroke="#C9C4D4" stroke-dasharray="2 2"/>`}`;
      const words = s.l.split(' '), mid = Math.ceil(words.length / 2);
      const l1 = words.length > 1 ? words.slice(0, mid).join(' ') : s.l, l2 = words.length > 1 ? words.slice(mid).join(' ') : '';
      out += `<text x="${x + w / 2}" y="${H - B + 18}" text-anchor="middle" font-size="11.5" font-weight="${s.total ? 900 : 700}" fill="${s.fd ? '#9F2089' : '#616173'}">${l1}</text>${l2 ? `<text x="${x + w / 2}" y="${H - B + 32}" text-anchor="middle" font-size="11.5" font-weight="${s.total ? 900 : 700}" fill="${s.fd ? '#9F2089' : '#616173'}">${l2}</text>` : ''}`;
    });
    out += `<line x1="${L}" x2="${Wd - R}" y1="${y(342)}" y2="${y(342)}" stroke="#570A57" stroke-dasharray="5 4" opacity=".55"/><text x="${L + bw * 3.5}" y="${y(342) + 16}" text-anchor="middle" font-size="11.5" fill="#570A57" font-weight="800">₹342 · factory just matches its ₹19 wholesale margin</text>`;
    return `<div class="card">
      <div class="row between"><span class="eyebrow">Cost per kept set · ₹381 → ₹345 (−9.4%)</span><span class="pill brand">deck slide 4</span></div>
      <svg class="wf mt8" viewBox="0 0 ${Wd} ${H}" width="100%" role="img" aria-label="Waterfall from 381 to 345 rupees"><defs><linearGradient id="wfm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9F2089"/><stop offset="1" stop-color="#570A57"/></linearGradient></defs>${out}</svg>
      <div class="wf-k mt8"><span><i style="background:#F5841F"></i>cost that disappears</span><span><i style="background:#038D63"></i>more for the factory</span><span><i style="border:1.5px dashed #9F2089"></i>₹340 floor if it fills idle capacity</span></div>
    </div>`;
  };

  W.india = () => {
    const max = 850;
    return `<div class="card">
      <div class="row between"><span class="eyebrow">One cluster a quarter · replenishing factories</span><span class="pill brand">24 months</span></div>
      <div class="trail mt12">${FD.road.map((r, i) => `<div class="q ${i === 0 ? 'first' : ''}" style="animation-delay:${i * .1}s">
        <div class="bar"><i style="height:${Math.max(6, r.v / max * 100)}%"></i></div>
        <div class="pin"><span>${r.q}</span></div><b>${r.c}</b><small>${r.d}</small><span class="v">${cnt(r.v, 'int', 0)}</span></div>`).join('')}</div>
      <div class="eyebrow mt16">Saved for buyers each year, month 24</div>
      <div class="scen mt8">${FD.scenarios.map(s => `<div class="${s.base ? 'base' : ''}"><span class="xs faint" style="font-weight:900">${s.k.toUpperCase()}${s.base ? ' · THE PLAN' : ''}</span><b>${s.v}</b><small>${s.s}</small></div>`).join('')}</div>
    </div>`;
  };

  /* ---------- beats ---------- */
  const BEATS = [
    { stop: 0, place: 'today', kicker: 'Meet the bedsheet', title: 'One bedsheet set. <em>₹381</em> all-in. ₹38 of it shouldn\'t be there.',
      narr: 'A 240 TC double set from Panipat reaches a buyer through a trader. Follow it once, end to end, and watch where the ₹38 goes.',
      w: 'receipt', notes: 'Open on the product, not the platform. ₹317 plus ₹64 delivery is ₹381. ₹38 of that is trader margin, freight, working capital, avoidable returns and a high pickup rate. Click "Take out the ₹38": the buyer gets ₹36 back, the factory keeps ₹2 more. Then the brief\'s four barriers, each with the answer we will meet on this journey.' },
    { stop: 1, place: 'office', who: 'ananya', kicker: 'Stop 1 · Meesho\'s data', title: 'Meesho already knows <em>what Panipat should make</em>.',
      say: quote(null, 'We already see what sells, at what price, and why it comes back.'),
      narr: 'The order flips: <b>product first, factory second, cluster third.</b>', steps: true,
      w: 'signals', notes: 'Ananya is a category analyst. She does not recruit sellers; she reads demand. One in four bedsheet-set orders, most land at ₹330–380, returns are thread count, colour bleed, size. Click "Build the card": a Demand Card is shares and signals, never a forecast.' },
    { stop: 2, place: 'factory', who: 'rajesh', kicker: 'Stop 2 · Kalpana Textiles, Panipat', title: 'Rajesh gets the card <em>in his own language</em>.',
      say: quote('“Humein demand dikhao, lekin paisa kab aayega woh bhi clear karo.”', '“Show us the demand, but also make clear when the money will come.”', 'a Panipat factory owner we interviewed'),
      narr: 'Same facts in English or Hindi. Ratios and signals he can check against his own floor.',
      w: 'dcard', notes: 'This quote is from our factory interviews: demand is not enough, cash timing matters. Toggle to हिं: the full card is in Hindi. Point at the last block: ₹245 per kept set on day 7, ₹27 kept at his ₹218 cost. And the note: not a forecast, not a promise of orders.' },
    { stop: 2, place: 'factory', who: 'rajesh', kicker: 'Stop 2 · “Paisa kab aayega?”', title: '<em>₹245 on day 7.</em> He keeps ₹27, more than wholesale.',
      say: quote('“Paisa kab aayega?”', '“When does the money come?”'),
      narr: 'He checks it himself. At 5% returns he keeps <b>₹22 in today\'s money against ₹19 on wholesale</b>. At 12% it stops.',
      w: 'calc', notes: 'Every number is his to change. ₹345 minus ₹80 shipping, ₹12 Hub packing and a returns reserve gives ₹245 on day 7. He keeps ₹27; discounted at 18% over 41 days that is ₹22 against ₹19 wholesale. Click 12%: it falls below wholesale, and that is exactly where replenishment stops by rule.' },
    { stop: 2, place: 'factory', who: 'rajesh', kicker: 'Stop 2 · The bid', title: 'He bids <em>100 sets at his own price</em>. No cash, no guarantee.',
      say: quote('“Sau set, mera daam. Bacha toh mera hi maal hai.”', '“A hundred sets, my price. Whatever is left is still my stock.”'),
      narr: 'A Pilot Batch is smaller than his smallest B2B order. That is the whole risk.',
      w: 'bid', notes: 'Inventory risk is answered by size: 100 to 200 sets. Meesho pays nothing upfront, guarantees nothing and never sets the price. Place the bid and show what happens next: sample to the Hub, 60-day slot, paid day 7, reads by rule.' },
    { stop: 3, place: 'hub', who: 'imran', kicker: 'Stop 3 · Panipat Cluster Hub', title: 'Imran checks the sample <em>against the card</em>, then packs for seven factories.',
      say: quote('“Ek shed, ek truck, saat factory.”', '“One shed, one truck, seven factories.”'),
      narr: 'The Hub answers operational hassle: spec check, singles packing, returns grading, one pickup.',
      w: 'hub', notes: 'An independent operator paid per task at a published rate card; never takes title, never sets a price. Pass the sample: 238 thread count against a 200–240 card. Pack: 412 parcels from seven factories, Kalpana\'s 64 in magenta. One pickup clears the 400-parcel break-even.' },
    { stop: 4, place: 'home', who: 'priya', kicker: 'Stop 4 · Priya\'s home, Bareilly', title: 'Priya sees a maker and a spec, and pays <em>₹345 instead of ₹381</em>.',
      say: quote('“Wahi chadar, ₹36 kam. Aur pata hai kisne banayi.”', '“The same sheet, ₹36 less. And I know who made it.”'),
      narr: 'Flip the listing. Same product, same rating; now with a maker line, a Hub-checked Spec Card and an all-in price.',
      w: 'buyer', notes: 'Toggle Today → Factory Direct and watch the price move from ₹381 to ₹345 all-in. Three additions: the maker line "Made and sold by Kalpana Textiles · Panipat", the Spec Card, the price. 15 of 20 buyers in our test picked it. The quote on the right is from a buyer interview: a checked spec lets them drop COD, which cuts RTO.' },
    { stop: 5, place: 'factory2', who: 'rajesh', kicker: 'Stop 5 · Back at Kalpana', title: 'Day 14: <em>58 of 100 sold</em>. The panel offers a second batch.',
      say: quote('“Paisa saatvein din aa gaya. Ab doosra batch.”', '“The money came on day seven. Now the second batch.”'),
      narr: 'Reads arrive at D+14 and D+30. The offer, the money and the decision stay his.',
      w: 'reorder', notes: 'Here is the north star. Switch D+14 to D+30: 58 then 87 sold, all reads green. Over 50% with positive contribution triggers a replenishment offer; Meesho does not fund it. Click "Place 150 sets": a second batch on his own money. No account manager; humans only look on three exceptions.' },
    { stop: 6, place: 'cluster', who: 'ananya', kicker: 'Stop 6 · Zoom out', title: 'Kalpana is one of <em>30 batches</em>, read against 30 matched controls.',
      say: quote(null, 'Every dot is a factory. Rules move them; we only watch the exceptions.'),
      narr: 'The pilot passes if half the factories reorder on their own money by D+60. At D+60: <b>16 of 30</b>. Controls: <b>3</b>.',
      w: 'cluster', notes: 'Each dot is a pilot batch; K is Kalpana. Switch D+14 → D+90. At D+60, 16 of 30 have reordered on their own money, over the 50% gate; matched controls, 3. Click a red or amber dot: the rule and the automatic action are shown. Sample data is illustrative.' },
    { stop: 7, place: 'office', who: 'ananya', kicker: 'Stop 7 · Where the ₹36 came from', title: 'Nothing here is a discount. <em>Every rupee is a cost that disappears.</em>',
      say: quote(null, 'The buyer saves ₹36, the factory keeps ₹2 more, and Meesho funds none of it.'),
      narr: 'No trader margin, freight or working-capital drag; returns fall from 8% to 5%; a lower pickup rate at Hub volume.',
      w: 'waterfall', notes: 'Walk the bars left to right: trader margin ₹4, inbound freight ₹8, working capital ₹7, returns 8% → 5% saves ₹13, pickup rate ₹6. The factory keeps ₹2 more. ₹345 all-in. The dashed line at ₹342 is where the factory would only match wholesale, so there is headroom. ₹340 if it fills idle capacity.' },
    { stop: 8, place: 'india', kicker: 'Stop 8 · Then India', title: 'Panipat first. <em>850 factories</em> in 24 months.',
      narr: 'One cluster a quarter, each gated by the one before. Base case: <b>₹61 crore a year</b> saved for buyers.',
      w: 'india', notes: 'Panipat 15, Karur 180, Moradabad 320, Tiruppur 480, second Hubs 650, Surat 850 if the gate holds. Low ₹26 crore, base ₹61 crore, high ₹202 crore, and high is not the plan.' },
    { stop: 8, full: true, kicker: 'The end of the route', w: 'close', notes: 'Close on the guardrails: Meesho never holds stock, sets a price or brands a product, and a factory never gets cash, ad credits or a volume guarantee. Every right is earned by rule. Thank the panel.' }
  ];
  PLACES.factory2 = () => PLACES.factory(true);

  W.close = () => `<div class="closer">
      <div class="kicker">The end of the route</div>
      <h1 class="mt8">Meesho never holds stock, never sets a price, never <em>brands a product</em>.</h1>
      <p class="narr mt12">It brings a proven product to its factory, and lets the factory decide everything else.</p>
      <div class="three">
        <div><b>${cnt(345, 'inr', 381)}</b><small>Priya pays, all-in · was ₹381</small></div>
        <div><b>${cnt(27, 'inr', 0)}</b><small>Rajesh keeps per set · ₹22 in today's money vs ₹19 wholesale</small></div>
        <div><b>${cnt(850, 'int', 0)}</b><small>factories replenishing on their own money by month 24</small></div>
      </div>
      <div class="mt20"><div class="eyebrow">What a factory never gets</div>
        <div class="never c mt8"><span>Cash</span><span>Ad credits</span><span>Volume guarantee</span><span>Funded markdown</span><span>A Meesho-set price</span><span>Exclusivity</span><span>Meesho taking title to stock</span></div></div>
      <div class="row mt20" style="justify-content:center"><button class="btn" id="x-replay">${ic('replay', 15)} Follow it again</button><a class="btn line" href="../explore.html">Open the full prototype</a></div>
      <p class="xs faint mt16">Team Violet · Rakshit Rajendra · Meesho DICE Challenge 3.0 · Business Track</p>
    </div>`;
  W.close.bind = root => { $('#x-replay', root).onclick = () => go(0); };

  /* ---------- scene render ---------- */
  function storyHTML(b) {
    const p = b.who && PEOPLE[b.who];
    return `<div class="story">
      <div class="kicker">${b.kicker}</div>
      <h1>${b.title}</h1>
      <div class="post">
        <div class="pimg">${placeSVG(b.place)}</div>
      </div>
      ${p ? `<div class="who"><span class="av">${p.av}</span><span><b>${p.name}</b><small>${p.role}</small></span></div>` : ''}
      ${b.say ? `<div class="bubble">${b.say.hi ? `<span class="hi">${b.say.hi}</span>` : b.say.en}${b.say.hi && b.say.en ? `<small>${b.say.en}${b.say.cite ? ` <i>· ${b.say.cite}</i>` : ''}</small>` : ''}</div>` : ''}
      <p class="narr">${b.narr}</p>
      ${b.steps ? `<div class="flip"><span>${ic('box', 14)} Product</span>${ic('arrow', 14)}<span>${ic('factory', 14)} Factory</span>${ic('arrow', 14)}<span>${ic('grid', 14)} Cluster</span></div>` : ''}
    </div>`;
  }
  const placeSVG = k => `<svg viewBox="0 16 420 134" preserveAspectRatio="xMidYMax slice" width="100%" height="100%" aria-hidden="true">${PLACES[k]()}</svg>`;
  const scene = () => $('#scene');
  function render(dir) {
    const b = BEATS[beat], el = scene();
    const cls = dir < 0 ? 'in-l' : 'in-r';
    el.className = 'scene' + (b.full ? ' full' : '') + ' w-' + b.w;
    el.innerHTML = b.full ? `<div class="stage ${cls}" id="stage">${W[b.w]()}</div>` : `${storyHTML(b).replace('class="story"', `class="story ${cls}"`)}<div class="stage ${cls} d1" id="stage">${W[b.w]()}</div>`;
    const st = $('#stage');
    if (W[b.w].bind) W[b.w].bind(st);
    countUp(el);
    document.body.dataset.tone = b.full ? 'lilac' : STOPS[b.stop].tone;
    updateChrome();
  }
  // re-render only the stage (keeps the story column still)
  function restage(quiet) {
    const b = BEATS[beat], st = $('#stage');
    st.innerHTML = W[b.w]();
    if (!quiet) { st.classList.remove('in-l', 'in-r', 'd1'); }
    if (W[b.w].bind) W[b.w].bind(st);
    countUp(st);
  }

  function updateChrome() {
    const b = BEATS[beat];
    $('#count').textContent = `${beat + 1} / ${BEATS.length}`;
    $$('#beats button').forEach((d, i) => { d.className = i === beat ? 'on' : i < beat ? 'done' : ''; d.setAttribute('aria-current', i === beat ? 'step' : 'false'); });
    $('#prev').disabled = beat === 0;
    $('#next').innerHTML = beat === BEATS.length - 1 ? `Again ${ic('replay', 15)}` : `Next ${ic('arrow', 15)}`;
    $$('.stop').forEach((s, i) => { s.classList.toggle('now', i === b.stop); s.classList.toggle('done', i < b.stop); });
    const sub = BEATS.filter(x => x.stop === b.stop), si = sub.indexOf(b);
    $$('.stop .sub').forEach(x => x.textContent = '');
    if (sub.length > 1) { const s = $$('.stop')[b.stop].querySelector('.sub'); if (s) s.textContent = `${si + 1}/${sub.length}`; }
    moveToken(b.stop);
    $('#notes-t').textContent = `Talk track · ${beat + 1} of ${BEATS.length}`;
    $('#notes-b').textContent = b.notes;
    if (location.hash !== '#b' + (beat + 1)) history.replaceState(null, '', '#b' + (beat + 1));
  }

  function go(n, dir) {
    n = Math.max(0, Math.min(BEATS.length - 1, n));
    if (n === beat && scene().innerHTML) return;
    lastDir = dir ?? (n >= beat ? 1 : -1);
    beat = n;
    if (!seen && n > 0) { seen = true; const h = $('#hint'); if (h) h.classList.add('hide'); }
    render(lastDir);
  }
  const next = () => go(beat === BEATS.length - 1 ? 0 : beat + 1, 1);
  const prev = () => go(beat - 1, -1);

  /* ---------- curved route with travelling token ---------- */
  let RT = { len: [], path: null, cur: null, anim: 0 };
  function buildRoute() {
    const box = $('#route'), w = box.clientWidth, h = box.clientHeight, n = STOPS.length;
    const padX = Math.min(56, w / (n * 2)), cy = 30;
    const pts = STOPS.map((s, i) => [padX + i * (w - 2 * padX) / (n - 1), cy + Math.sin(i * 1.15 + .3) * 9]);
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < n - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    $('#route-svg').setAttribute('viewBox', `0 0 ${w} ${h}`);
    $('#route-svg').innerHTML = `
      <path d="${d}" fill="none" stroke="#DCD3E3" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 9"/>
      <path id="rt-done" d="${d}" fill="none" stroke="url(#rtg)" stroke-width="4" stroke-linecap="round"/>
      <path id="rt-trail" d="${d}" fill="none" stroke="#F5841F" stroke-width="10" stroke-linecap="round" opacity=".18"/>
      <defs><linearGradient id="rtg" x1="0" x2="1"><stop offset="0" stop-color="#570A57"/><stop offset="1" stop-color="#9F2089"/></linearGradient></defs>
      <g id="rt-tok"><g class="tok-b"><ellipse cx="0" cy="17" rx="11" ry="2.5" fill="#570A57" opacity=".12"/>
        <rect x="-15" y="-11" width="30" height="20" rx="5" fill="#F5841F"/><rect x="-15" y="-11" width="30" height="7" rx="4" fill="#F9B776"/>
        <path d="M-10 3h20" stroke="#fff" stroke-width="1.6" stroke-dasharray="3 3"/><circle cx="-7" cy="-7.5" r="1.8" fill="#F43397"/><circle cx="0" cy="-7.5" r="1.8" fill="#fff"/><circle cx="7" cy="-7.5" r="1.8" fill="#F43397"/></g></g>`;
    const path = $('#rt-done'), total = path.getTotalLength();
    // arc length at each stop: sample the path
    const L = [0]; let acc = 0, prevPt = path.getPointAtLength(0), k = 1;
    for (let s = 2; s <= total && k < n; s += 2) { const p = path.getPointAtLength(s); if (p.x >= pts[k][0]) { L.push(s); k++; } prevPt = p; }
    while (L.length < n) L.push(total);
    RT = { len: L, path, total, cur: RT.cur == null ? null : RT.cur, anim: 0 };
    $('#stops').innerHTML = STOPS.map((s, i) => `<button class="stop" data-s="${i}" style="left:${pts[i][0]}px;top:${pts[i][1]}px" aria-label="Go to ${s.l}"><span class="dot">${ic(s.i, 15)}</span><span class="lbl">${s.l}<em class="sub"></em></span></button>`).join('');
    $$('#stops .stop').forEach(b => b.onclick = () => { const s = +b.dataset.s; go(BEATS.findIndex(x => x.stop === s)); });
    const c = RT.cur == null ? L[BEATS[beat].stop] : Math.min(RT.cur, total);
    placeToken(c);
  }
  function placeToken(l) {
    RT.cur = l;
    const p = RT.path.getPointAtLength(l), t = RT.total;
    $('#rt-tok').setAttribute('transform', `translate(${p.x.toFixed(1)} ${(p.y - 27).toFixed(1)})`);
    $('#rt-done').style.strokeDasharray = `${l} ${t + 10}`;
    const tr = Math.min(70, l);
    $('#rt-trail').style.strokeDasharray = `0 ${l - tr} ${tr} ${t + 10}`;
  }
  function moveToken(stop) {
    if (!RT.path) return;
    const to = RT.len[stop], from = RT.cur ?? to;
    cancelAnimationFrame(RT.anim);
    if (REDUCED || Math.abs(to - from) < 1) { placeToken(to); return; }
    const t0 = performance.now(), dur = Math.min(1300, 600 + Math.abs(to - from) * .9);
    const step = t => { const k = Math.min(1, (t - t0) / dur), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; placeToken(from + (to - from) * e); if (k < 1) RT.anim = requestAnimationFrame(step); };
    RT.anim = requestAnimationFrame(step);
  }

  /* ---------- notes ---------- */
  function toggleNotes(v) { notesOpen = v ?? !notesOpen; $('#notes').classList.toggle('open', notesOpen); $('#notes').setAttribute('aria-hidden', String(!notesOpen)); $('#btn-notes').setAttribute('aria-pressed', String(notesOpen)); }

  /* ---------- boot ---------- */
  function boot() {
    $('#beats').innerHTML = BEATS.map((b, i) => `<button aria-label="Beat ${i + 1}"></button>`).join('');
    $$('#beats button').forEach((d, i) => d.onclick = () => go(i));
    $('#next').onclick = next; $('#prev').onclick = prev;
    $('#btn-notes').onclick = () => toggleNotes(); $('#notes-x').onclick = () => toggleNotes(false);
    const m = /^#b(\d+)$/.exec(location.hash); beat = m ? Math.max(0, Math.min(BEATS.length - 1, +m[1] - 1)) : 0;
    if (beat > 0) { seen = true; $('#hint').classList.add('hide'); }
    buildRoute();
    render(1);
    let rz; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(buildRoute, 120); });
    window.addEventListener('hashchange', () => { const mm = /^#b(\d+)$/.exec(location.hash); if (mm && +mm[1] - 1 !== beat) go(+mm[1] - 1); });
    document.addEventListener('keydown', e => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target.tagName || '').toLowerCase(), typing = tag === 'input' || tag === 'textarea';
      if (typing && e.key !== 'Escape') return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
      else if (e.key === 'Home') go(0); else if (e.key === 'End') go(BEATS.length - 1);
      else if (e.key === 'n' || e.key === 'N') toggleNotes();
      else if (e.key === 'f' || e.key === 'F') { if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {}); else document.exitFullscreen?.(); }
      else if (e.key === 'Escape') toggleNotes(false);
    });
    let sx = 0, sy = 0, ok = false;
    document.addEventListener('touchstart', e => { const t = e.touches[0]; ok = !e.target.closest('input,.dotgrid,.screen .scroll'); sx = t.clientX; sy = t.clientY; }, { passive: true });
    document.addEventListener('touchend', e => { if (!ok) return; const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy; if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) dx < 0 ? next() : prev(); }, { passive: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
