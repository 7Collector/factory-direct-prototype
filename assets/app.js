/* Factory Direct · app shell: router, shared UI, overview, guided demo. */
(function () {
  const FD = window.FD;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const inr = n => (n < 0 ? '−' : '') + '₹' + Math.abs(Math.round(n)).toLocaleString('en-IN');
  FD.$ = $; FD.$$ = $$; FD.inr = inr;

  /* ---------- persisted state ---------- */
  const KEY = 'fd-proto-v2';
  const defaults = { card: 'bedsheet', lang: 'en', price: 345, cost: 218, qty: 100, r: 5, bid: null, day: 14, replenished: false, applied: false, fdView: true, hubSamples: {}, hubPacked: {}, hubReturns: {}, manifest: false, ftab: 'cards', htab: 'samples' };
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { saved = {}; }
  FD.state = Object.assign({}, defaults, saved);
  FD.save = () => { try { localStorage.setItem(KEY, JSON.stringify(FD.state)); } catch (e) { /* private mode */ } };
  FD.reset = () => { try { localStorage.removeItem(KEY); } catch (e) { } FD.state = Object.assign({}, defaults); FD.route(); FD.toast('Demo reset'); };

  /* ---------- icons (24px stroke) ---------- */
  const P = {
    card: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M7 9h10M7 13h6"/>',
    factory: '<path d="M3 21V10l6 4V10l6 4V6l6 3v12z"/><path d="M7 17h2M12 17h2M17 17h2"/>',
    hub: '<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
    phone: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    play: '<path d="M7 5l12 7-12 7z"/>',
    box: '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',
    rupee: '<path d="M7 4h11M7 9h11M7 4c5 0 7 2 7 5s-3 5-7 5l8 7"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    trend: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    return: '<path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 010 10h-3"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3"/>',
    truck: '<path d="M2 6h12v10H2zM14 10h4l3 3v3h-7z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    batch: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    reset: '<path d="M4 4v6h6"/><path d="M20 12a8 8 0 10-2.3 5.7M4 10a8 8 0 011.8-3"/>',
    heart: '<path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
    cart: '<path d="M3 4h2l2.5 11h11L21 7H6.5"/><circle cx="9" cy="19.5" r="1.5"/><circle cx="17" cy="19.5" r="1.5"/>'
  };
  FD.icon = (n, s = 20, w = 2) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;

  /* ---------- toast, drawer, modal ---------- */
  FD.toast = (msg, kind) => {
    const t = document.createElement('div'); t.className = 'toast ' + (kind || ''); t.textContent = msg;
    $('#toasts').appendChild(t); setTimeout(() => t.remove(), 3200);
  };
  const scrim = () => $('#scrim');
  FD.openDrawer = (html, onMount) => {
    const d = $('#drawer'); d.innerHTML = html; d.classList.add('on'); scrim().classList.add('on');
    d.setAttribute('aria-hidden', 'false'); $$('[data-close]', d).forEach(b => b.onclick = FD.closeOverlays);
    onMount && onMount(d); setTimeout(() => { const f = $('input,button', d); f && f.focus({ preventScroll: true }); }, 50);
  };
  FD.openModal = (html, onMount) => {
    const m = $('#modal'); m.innerHTML = html; m.classList.add('on'); scrim().classList.add('on');
    m.setAttribute('aria-hidden', 'false'); $$('[data-close]', m).forEach(b => b.onclick = FD.closeOverlays);
    onMount && onMount(m);
  };
  FD.closeOverlays = () => {
    ['#drawer', '#modal'].forEach(s => { const e = $(s); e.classList.remove('on'); e.setAttribute('aria-hidden', 'true'); });
    scrim().classList.remove('on');
  };

  /* ---------- router ---------- */
  FD.views = FD.views || {};
  const routes = ['overview', 'factory', 'hub', 'buyer', 'console'];
  FD.go = (r, opts) => { FD._opts = opts || null; if (location.hash === '#/' + r) FD.route(); else location.hash = '#/' + r; };
  FD.route = (keep) => {
    keep = keep === true;
    let r = (location.hash.replace(/^#\/?/, '') || 'overview').split('?')[0];
    if (!routes.includes(r)) r = 'overview';
    FD.current = r;
    $$('.tabs a').forEach(a => a.setAttribute('aria-current', a.dataset.r === r ? 'page' : 'false'));
    const main = $('#main');
    main.innerHTML = `<div class="view${keep ? ' still' : ''}">${FD.views[r].render()}</div>`;
    FD.views[r].mount && FD.views[r].mount(main, FD._opts);
    FD._opts = null;
    document.title = { overview: 'Factory Direct · Meesho C2M', factory: 'Supplier Panel · Factory Direct', hub: 'Cluster Hub · Factory Direct', buyer: 'Buyer app · Factory Direct', console: 'C2M Console · Factory Direct' }[r];
    if (!FD.tour.active && !keep) window.scrollTo({ top: 0 });
  };
  FD.refresh = () => { const y = window.scrollY; FD.route(true); window.scrollTo({ top: y }); };
  window.addEventListener('hashchange', FD.route);

  /* ---------- waterfall chart (SVG) ---------- */
  FD.waterfallSVG = function () {
    const W = 1140, H = 380, L = 52, R = 12, T = 30, B = 58, min = 300, max = 390;
    const steps = FD.waterfall, n = steps.length, bw = (W - L - R) / n, y = v => T + (max - v) / (max - min) * (H - T - B);
    let run = 0, out = '';
    [300, 320, 340, 360, 380].forEach(v => {
      out += `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="#ECEAF1"/><text x="${L - 8}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="#8B8BA3" font-weight="700">₹${v}</text>`;
    });
    // wholesale parity line at ₹342
    out += `<line x1="${L}" x2="${W - R}" y1="${y(342)}" y2="${y(342)}" stroke="#570A57" stroke-dasharray="4 4" opacity=".5"/><text x="${L + bw * 1.2}" y="${y(342) + 16}" font-size="11" fill="#616173" font-weight="700">₹342 · the factory just matches its ₹19 wholesale margin</text>`;
    steps.forEach((s, i) => {
      const x = L + i * bw + bw * .18, w = bw * .64;
      let y1, y2, fill, label;
      if (s.total) { y1 = y(s.v); y2 = y(min); run = s.ghost ? run : s.v; fill = s.fd ? '#9F2089' : s.ghost ? 'none' : '#570A57'; label = '₹' + s.v; }
      else { const from = run, to = run + s.v; run = to; y1 = y(Math.max(from, to)); y2 = y(Math.min(from, to)); fill = s.v < 0 ? '#F5841F' : '#F43397'; label = (s.v > 0 ? '+' : '−') + Math.abs(s.v); }
      const h = Math.max(2, y2 - y1);
      out += s.ghost
        ? `<rect x="${x}" y="${y1}" width="${w}" height="${h}" rx="6" fill="#FFF0F7" stroke="#F43397" stroke-dasharray="5 4"/>`
        : `<rect x="${x}" y="${y1}" width="${w}" height="${h}" rx="6" fill="${fill}"><animate attributeName="height" from="0" to="${h}" dur=".6s" begin="${i * .06}s" fill="freeze"/></rect>`;
      out += `<text x="${x + w / 2}" y="${y1 - 8}" text-anchor="middle" font-size="13" font-weight="900" fill="${s.total ? (s.ghost ? '#F43397' : '#353543') : s.v < 0 ? '#C25E00' : '#F43397'}">${label}</text>`;
      const words = s.l.split(' '); const l1 = words.slice(0, Math.ceil(words.length / 2)).join(' '), l2 = words.slice(Math.ceil(words.length / 2)).join(' ');
      out += `<text x="${x + w / 2}" y="${H - B + 20}" text-anchor="middle" font-size="11.5" font-weight="${s.total ? 800 : 600}" fill="#616173">${l1}</text>${l2 ? `<text x="${x + w / 2}" y="${H - B + 35}" text-anchor="middle" font-size="11.5" font-weight="${s.total ? 800 : 600}" fill="#616173">${l2}</text>` : ''}`;
    });
    return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Cost waterfall from ₹381 trader all-in price to ₹345 Factory Direct price">${out}</svg>`;
  };

  /* ---------- overview ---------- */
  FD.views.overview = {
    render() {
      const s = FD.settle(345, 218, 5);
      const loop = [
        ['card', 'Demand Card', 'Meesho shows a factory what sells, as ratios and signals, never a forecast.', 'factory'],
        ['factory', 'Factory bids', '100–200 units at its own spec and its own price.', 'factory'],
        ['hub', 'Cluster Hub', 'In the factory\'s own town: checks spec, packs singles, grades returns.', 'hub'],
        ['phone', 'Buyer sees a maker', 'A maker line and a Spec Card. Pays 9% less, like for like.', 'buyer'],
        ['chart', 'Reads by rule', 'D+14, 30, 60: reorder, fix or stop. No account manager.', 'console']
      ];
      const barriers = [
        ['box', 'Operational hassle', 'A Cluster Hub in the factory\'s town packs singles, grades returns and consolidates one pickup, at published rates.'],
        ['batch', 'Inventory risk', 'A 100–200 unit Pilot Batch, smaller than the smallest B2B order. Unsold stock stays the factory\'s.'],
        ['trend', 'Unproven demand', 'A Demand Card plus a settlement calculator: a case the factory computes itself, not a promise.'],
        ['clock', 'Weak early scale-up', 'A disclosed 60-day trial slot and rule-based reads at D+14, 30 and 60.']
      ];
      const maxF = FD.funnel[0].v;
      return `
      <section class="hero" id="ov-hero">
        <div style="position:relative;z-index:1">
          <div class="eyebrow">Meesho C2M · DICE Challenge 3.0 · working prototype</div>
          <h1>Bring a proven product to its factory, not a cold catalogue to the app.</h1>
          <p class="lead">Meesho already knows what sells, at what price and why it comes back. Factory Direct flips the order: product first, factory second, cluster third.</p>
          <div class="ctas">
            <button class="btn white lg" data-tour-start>${FD.icon('play', 18)} Start guided demo</button>
            <button class="btn outline lg" data-go="factory">Open Supplier Panel ${FD.icon('arrow', 18)}</button>
          </div>
        </div>
        <div class="pricecard" id="ov-price">
          <div class="lbl">Same 240 TC double bedsheet set, like for like</div>
          <div class="cmp">
            <div class="side today"><small>Today, via a trader</small><b class="num">₹381</b><small>₹317 + ₹64 delivery</small></div>
            <div class="arrow">${FD.icon('arrow', 16, 3)}</div>
            <div class="side fd"><small>Factory Direct</small><b class="num">₹345</b><small>all-in, delivery included</small></div>
          </div>
          <div class="save"><span>Buyer saves</span><b class="num">₹36 · 9.4%</b></div>
          <div class="save" style="background:var(--m-lilac-50);color:var(--m-plum);margin-top:8px"><span>Factory keeps per set</span><b class="num">${inr(s.keep)} <small style="font-size:12px;font-weight:700;color:var(--ink-2)">vs ₹19 wholesale</small></b></div>
          <div class="foot">Scenario from the detailed deck, slide 4. Meesho never holds stock, sets a price or brands a product.</div>
        </div>
      </section>

      <div class="section-title"><div><div class="eyebrow">How it works</div><h2>One loop, four screens</h2></div><p>Click any step to open the screen that runs it.</p></div>
      <div class="loop" id="ov-loop">
        ${loop.map((l, i) => `<button class="step" data-go="${l[3]}"><span class="n">0${i + 1}</span><span class="ic">${FD.icon(l[0], 22)}</span><b>${l[1]}</b><p>${l[2]}</p><span class="go">Open →</span></button>`).join('')}
      </div>

      <div class="section-title"><div><div class="eyebrow">Where the price comes from</div><h2>₹38 moves when the factory sells the set itself</h2></div><p>The trader keeps only ₹4. The rest sits in inbound freight, credit, returns and pickup density, costs a reseller cannot remove.</p></div>
      <div class="card pad" id="ov-wf">
        ${FD.waterfallSVG()}
        <div class="row between mt-8">
          <div class="wf-legend"><span><i style="background:#570A57"></i>Price paid</span><span><i style="background:#F5841F"></i>Cost removed</span><span><i style="background:#F43397"></i>Extra to the factory</span><span><i style="background:#FFF0F7;border:1px dashed #F43397"></i>Panipat idle capacity: ₹340</span></div>
          <span class="xs faint">Per kept unit · axis starts at ₹300 · every step is a scenario, to be replaced by quotes</span>
        </div>
      </div>

      <div class="section-title"><div><div class="eyebrow">The brief's four barriers</div><h2>What answers each</h2></div></div>
      <div class="grid g2">${barriers.map(b => `<div class="barrier"><span class="ic">${FD.icon(b[0], 20)}</span><h3>${b[1]}</h3><p>${b[2]}</p></div>`).join('')}</div>

      <div class="section-title" id="ov-scale-t"><div><div class="eyebrow">Scale</div><h2>From 30 factories in Panipat to about 850 in 24 months</h2></div><p>Fill a cluster before opening the next; density is the cost advantage. Each new cluster reuses the same cards, gates, Hub rate card and rules.</p></div>
      <div class="card pad" id="ov-road">
        <div class="row between"><b>Cumulative replenishing factories, base scenario</b><span class="pill brand plain">One cluster a quarter</span></div>
        <div class="road mt-24">${FD.road.map((q, i) => `<div class="q ${i === 0 ? 'first' : ''}"><div class="dot">${q.q.replace('Q', '')}</div><div class="t"><b>${q.c}</b><small>${q.q} · ${q.d}</small><span class="v num">${q.v}</span></div></div>`).join('')}</div>
      </div>
      <div class="grid g2 mt-24">
        <div class="card pad">
          <b>Sizing funnel · five clusters, 24 months</b>
          <div class="funnel mt-16">${FD.funnel.map(f => { const w = Math.max(6, Math.sqrt(f.v / maxF) * 100); return `<div class="f"><div class="bar"><i style="width:${w}%"></i><span class="${w < 40 ? 'dark' : ''}" style="${w < 40 ? `left:calc(${w}% + 10px)` : ''}">${f.l}</span></div><b class="num">${f.v.toLocaleString('en-IN')}</b></div>`; }).join('')}</div>
          <p class="xs faint mt-12">Square-root scale. Rates are assumptions from Amazon, ONDC and Meesho precedents that the pilot replaces.</p>
        </div>
        <div class="card pad">
          <b>Buyer savings a year at month 24</b>
          <div class="scen mt-16">${FD.scenarios.map(s => `<div class="${s.base ? 'base' : ''}"><span><b class="xs" style="font-size:13px;display:block">${s.k}</b><small>${s.s}</small></span><b class="num">${s.v}</b></div>`).join('')}</div>
          <p class="xs faint mt-12">Two-year cash cost ₹8–11 crore, about ₹1.0–1.3 lakh per replenishing factory. The pilot measures incremental share against matched controls.</p>
        </div>
      </div>

      <div class="section-title"><div><div class="eyebrow">Guardrails</div><h2>What a factory never gets</h2></div><p>Only a published pickup rate and a refundable fee. Every right is earned by rule.</p></div>
      <div class="never"><span>Cash</span><span>Ad credits</span><span>Volume guarantee</span><span>Funded markdown</span><span>A Meesho-set price</span><span>Exclusivity</span><span>Meesho taking title to stock</span></div>
      `;
    },
    mount(root) {
      $$('[data-go]', root).forEach(b => b.addEventListener('click', () => FD.go(b.dataset.go)));
      $$('[data-tour-start]', root).forEach(b => b.addEventListener('click', () => FD.tour.start()));
    }
  };

  /* ---------- guided demo ---------- */
  FD.tour = {
    active: false, i: 0,
    steps: [
      { r: 'overview', sel: '#ov-price', t: 'The idea in one number', b: 'Same bedsheet set, like for like. The buyer pays ₹345 all-in instead of ₹381, and the factory still beats its wholesale margin.', say: 'Meesho already knows what sells. Today a factory lists cold and waits. We flip the order: product first, factory second, cluster third.' },
      { r: 'factory', sel: '#dcard', t: 'The Demand Card', b: 'What a Panipat factory sees in its Supplier Panel: shares, trends, price bands, return reasons and a reorder record. Ratios, never a forecast.', say: 'One in four bedsheet-set orders, rising, most land at ₹330–380, returns come from thread count and colour bleed.', pre: () => { FD.state.ftab = 'cards'; FD.state.card = 'bedsheet'; } },
      { r: 'factory', sel: '#dcard', t: 'In the owner\'s language', b: 'The whole card flips to Hindi. 7 of the 10 Panipat owners we called asked for it.', say: 'Same card, same numbers, in Hindi.', pre: () => { FD.state.ftab = 'cards'; FD.state.lang = 'hi'; } },
      { r: 'factory', sel: '#drawer', t: 'The factory computes its own case', b: 'At ₹345 all-in it receives ₹245 per kept set on day 7 and keeps ₹27, about ₹22 in today\'s money, against ₹19 wholesale. Try the 12% returns step: that is the stop line.', say: 'Nothing here is promised. The factory types its own cost and price.', pre: () => { Object.assign(FD.state, { ftab: 'cards', lang: 'en', card: 'bedsheet', r: 5, price: 345, cost: 218, _calcCard: 'bedsheet' }); }, post: () => FD.openCalc && FD.openCalc() },
      { r: 'factory', sel: '#modal', t: 'A bid, not a contract', b: 'Confirm the spec, choose 100–200 units at your own price. The Hub checks one sample in 3 days. No cash, no ad credit, no guarantee.', say: '100 units, smaller than its smallest B2B order.', post: () => FD.openBid && FD.openBid() },
      { r: 'hub', sel: '#hub-main', t: 'The Cluster Hub does the B2C work', b: 'One shared operator per cluster, paid per task: checks samples against the card, packs singles, grades every return and sends one pickup a day.', say: 'This is how hundreds of factories onboard without an account manager each.', pre: () => { FD.state.htab = 'samples'; } },
      { r: 'buyer', sel: '#phone', t: 'The buyer sees a maker and a spec', b: 'Today: ₹317 plus ₹64 at checkout, no thread count, no maker. With Factory Direct: ₹345 all-in, a maker line and a Hub-checked Spec Card. No badge, no ranking boost.', say: '15 of 20 buyers we interviewed picked this listing.', pre: () => { FD.state.fdView = true; } },
      { r: 'console', sel: '#con-table', t: 'Rules, not account managers', b: 'Thirty pilot batches against thirty matched controls. Every status is computed from the reads; a human looks only when a rule says so.', say: 'Hub-packed SLA miss? That is the Hub\'s miss, nothing against the factory.', pre: () => { FD.state.day = 14; } },
      { r: 'console', sel: '#con-kpis', t: 'The north star moves', b: 'Advance to D+60: half the factories have placed a second batch on their own money. That is the only retention signal a B2B maker cares about.', say: 'Every window ends at a gate with a number.', pre: () => { FD.state.day = 60; } },
      { r: 'overview', sel: '#ov-road', t: 'Then one cluster a quarter', b: 'Panipat, Karur, Moradabad, Tiruppur, then second Hubs and Surat: about 850 replenishing factories and ₹61 crore a year saved for buyers in the base case.', say: 'Meesho never holds stock, sets a price or brands a product.' }
    ],
    start() { this.active = true; document.body.classList.add('touring'); this.i = 0; document.activeElement && document.activeElement.blur(); this.show(); },
    stop() {
      this.active = false; document.body.classList.remove('touring'); $('#tour').classList.remove('on'); this.clear(); FD.closeOverlays();
    },
    clear() { $$('.tour-focus').forEach(e => e.classList.remove('tour-focus')); },
    show() {
      const st = this.steps[this.i]; FD.closeOverlays(); this.clear();
      st.pre && st.pre(); FD.save();
      if (FD.current !== st.r) { location.hash = '#/' + st.r; } else FD.route();
      setTimeout(() => {
        st.post && st.post();
        setTimeout(() => {
          const el = $(st.sel);
          const t = $('#tour'); t.classList.remove('at-left', 'at-right');
          if (el && !['#drawer', '#modal'].includes(st.sel)) {
            el.classList.add('tour-focus');
            const rc = el.getBoundingClientRect(), vw = window.innerWidth;
            // keep the focused element clear of the demo card: dock the card on the emptier side
            if (rc.width < vw * .62) t.classList.add(rc.left + rc.width / 2 > vw / 2 ? 'at-left' : 'at-right');
            el.scrollIntoView({ behavior: 'smooth', block: rc.height > window.innerHeight * .6 ? 'start' : 'center' });
          } else if (st.sel === '#drawer') t.classList.add('at-left');
          else if (st.sel === '#modal') t.classList.add('at-left');
        }, 120);
      }, 60);
      const t = $('#tour');
      t.innerHTML = `
        <div class="top"><span class="ct">Guided demo · ${this.i + 1} of ${this.steps.length}</span><button class="x" data-t="x" aria-label="Close demo">${FD.icon('x', 18)}</button></div>
        <h3>${st.t}</h3><p>${st.b}</p>${st.say ? `<div class="say">Say: “${st.say}”</div>` : ''}
        <div class="nav"><button class="btn ghost sm" data-t="prev" ${this.i === 0 ? 'disabled' : ''}>${FD.icon('back', 16)} Back</button>
          <div class="bars">${this.steps.map((_, k) => `<i class="${k <= this.i ? 'on' : ''}"></i>`).join('')}</div>
          <button class="btn white sm" data-t="next">${this.i === this.steps.length - 1 ? 'Finish' : 'Next'} ${FD.icon('arrow', 16)}</button></div>`;
      t.classList.add('on');
      $('[data-t=x]', t).onclick = () => this.stop();
      $('[data-t=prev]', t).onclick = () => this.prev();
      $('[data-t=next]', t).onclick = () => this.next();
    },
    next() { if (this.i < this.steps.length - 1) { this.i++; this.show(); } else this.stop(); },
    prev() { if (this.i > 0) { this.i--; this.show(); } }
  };

  /* ---------- boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    $('#scrim').addEventListener('click', () => { if (!FD.tour.active) FD.closeOverlays(); });
    $('#btn-tour').addEventListener('click', () => FD.tour.start());
    $('#btn-reset').addEventListener('click', () => FD.reset());
    document.addEventListener('keydown', e => {
      const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
      if (e.key === 'Escape') { if (FD.tour.active) FD.tour.stop(); else FD.closeOverlays(); }
      if (typing) return;
      if (FD.tour.active && (e.key === 'ArrowRight' || e.key === 'PageDown')) { e.preventDefault(); FD.tour.next(); }
      if (FD.tour.active && (e.key === 'ArrowLeft' || e.key === 'PageUp')) { e.preventDefault(); FD.tour.prev(); }
      if (!FD.tour.active && !e.metaKey && !e.ctrlKey && !e.altKey && /^[1-5]$/.test(e.key)) FD.go(routes[+e.key - 1]);
    });
    FD.route();
  });
})();
