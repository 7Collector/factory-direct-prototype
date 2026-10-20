/* Factory Direct · v2 "Scroll story".
   Narrative steps on the left, one sticky live stage on the right. Every scene is rendered once
   and kept alive; scrolling (or ←/→/Space) only switches which scene is showing. */
(function () {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const inr = v => '₹' + Math.round(v).toLocaleString('en-IN');
  const E = FD.econ;

  const S = { card: 0, lang: 'en', r: 5, price: null, cost: null, qty: 150, bidDone: false, sample: 's2', verdict: {}, fd: true, sel: 0, day: 14 };
  const card = () => FD.cards[S.card];
  const mobile = matchMedia('(max-width: 900px)');

  /* ---------- scenes ---------- */
  const scenes = {};

  scenes.problem = {
    tag: 'The brief', url: 'meesho · <b>DICE 3.0 brief</b>', center: true,
    html: () => {
      const b = [
        ['Operational hassle', 'One-parcel-at-a-time packing, returns and pickups. Built for bulk, not singles.'],
        ['Inventory risk', 'Making stock for an unknown buyer, with returns a B2B order never has.'],
        ['Unproven demand', 'No proof orders will come, and no way to check the numbers first.'],
        ['Weak early scale-up', 'Early orders are thin, so the few who try leave within weeks.']
      ];
      // illustrative: a cold catalogue's first 30 days
      const days = [9, 7, 8, 6, 5, 6, 4, 4, 3, 4, 3, 2, 3, 2, 2, 1, 2, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0];
      return `<div class="barriers">${b.map((x, i) => `<div><span class="n">0${i + 1}</span><b>${x[0]}</b><small>${x[1]}</small></div>`).join('')}</div>
        <div class="thirty"><div class="row between"><span class="lbl">A cold factory catalogue · first 30 days</span><span class="pill grey">illustrative</span></div>
        <div class="track">${days.map(d => `<i class="${d ? '' : 'x'}" style="height:${d ? 18 + d * 9 : 6}%;align-self:flex-end"></i>`).join('')}</div>
        <div class="row between xs faint mt8"><span>Day 1</span><span>Orders thin out · the factory goes back to its trader</span><span>Day 30</span></div></div>`;
    }
  };

  scenes.insight = {
    tag: 'The idea', url: 'meesho · <b>Factory Direct</b>', center: true,
    html: () => `<div class="loopwrap"><svg class="loopsvg" viewBox="0 0 520 420" role="img" aria-label="Product first, factory second, cluster third">
      <defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#9F2089"/></marker></defs>
      <g fill="none" stroke="#9F2089" stroke-width="2" stroke-dasharray="5 6" marker-end="url(#ah)" opacity=".7">
        <path d="M330 92 C 420 110, 450 170, 440 238"/>
        <path d="M370 330 C 300 380, 220 380, 150 330"/>
        <path d="M80 238 C 70 170, 100 110, 190 92"/>
      </g>
      ${[[150, 30, '01', 'Product first', "Meesho's data shows", 'what sells, at what price'], [300, 250, '02', 'Factory second', 'The maker bids 100–200', 'units, its own price'], [0, 250, '03', 'Cluster third', 'A shared Hub in the', "factory's own town"]].map((n, i) => `
        <g class="node" data-n="${i}" transform="translate(${n[0]} ${n[1]})"><rect width="220" height="96" rx="18"/>
          <text class="k" x="20" y="28">${n[2]}</text><text class="t" x="20" y="52">${n[3]}</text>
          <text class="s" x="20" y="72">${n[4]}</text><text class="s" x="20" y="87">${n[5]}</text></g>`).join('')}
      <text x="260" y="196" text-anchor="middle" font-family="Mulish" font-weight="900" font-size="13" fill="#8E8EA4" letter-spacing="1.5">THE LOOP</text>
      <text x="260" y="220" text-anchor="middle" font-family="Mulish" font-weight="800" font-size="13" fill="#5E5E70">reorder, fix or stop</text>
    </svg></div>`,
    enter: el => {
      if (el._t) return;
      let i = 0; const nodes = $$('.node', el);
      const tick = () => { nodes.forEach((n, j) => n.classList.toggle('hot', j === i)); i = (i + 1) % 3; };
      tick(); el._t = setInterval(tick, 1400);
    },
    leave: el => { clearInterval(el._t); el._t = null; }
  };

  scenes.card = {
    tag: 'Supplier Panel · Kalpana Textiles', url: 'supplier.meesho.com/<b>demand-cards</b>',
    html: () => `<div class="row between"><div class="tabs" role="tablist" id="dc-tabs">${FD.cards.map((c, i) => `<button role="tab" data-i="${i}" aria-selected="${i === S.card}">${c.name}</button>`).join('')}</div></div><div id="dc"></div>`,
    bind: el => {
      el.addEventListener('click', e => {
        const t = e.target.closest('[data-i]'); if (t) { S.card = +t.dataset.i; S.price = S.cost = null; refreshCard(); return; }
        const l = e.target.closest('[data-l]'); if (l) { S.lang = l.dataset.l; drawCard(); }
      });
      drawCard();
    }
  };
  function drawCard() {
    const c = card(), hi = S.lang === 'hi', T = FD.i18n[S.lang], el = $('#dc');
    $$('#dc-tabs [data-i]').forEach(b => b.setAttribute('aria-selected', +b.dataset.i === S.card));
    const top = c.bands.reduce((m, b, i, a) => b.v > a[m].v ? i : m, 0);
    const trend = { up: ['up', '↑'], flat: ['flat', '→'], down: ['down', '↓'] }[c.trend];
    el.innerHTML = `<div class="dc ${hi ? 'hi' : ''}"><div class="hd"><div><div class="lbl">${T.card} · Panipat · Oct 2026</div><h3>${hi ? c.hiName : c.name}</h3></div>
      <div class="lang" role="group" aria-label="Language"><button data-l="en" aria-pressed="${!hi}">EN</button><button data-l="hi" aria-pressed="${hi}">हिं</button></div></div>
      <dl class="bd" style="margin:0">
        <div class="fact"><dt>${T.what}</dt><dd>${hi ? c.hiSpec : c.spec}</dd></div>
        <div class="fact"><dt>${T.sells}</dt><dd><span class="meter"><i style="width:${c.share * 100 / .35}%"></i></span>${hi ? c.hiShare : c.shareTxt}</dd></div>
        <div class="fact"><dt>${T.way}</dt><dd><span class="${trend[0]}">${trend[1]}</span> ${hi ? c.hiTrend : c.trendTxt}</dd></div>
        <div class="fact"><dt>${T.price}</dt><dd><div class="bands" style="height:58px;max-width:260px">${c.bands.map((b, i) => `<div class="${i === top ? 'top' : ''}"><i style="height:${b.v * 60}px"></i><small>${b.l}</small></div>`).join('')}</div></dd></div>
        <div class="fact"><dt>${T.ret}</dt><dd>${(hi ? c.hiReturns : c.returns).map(r => `<span class="pill grey" style="margin:2px 4px 2px 0">${r}</span>`).join('')}</dd></div>
        <div class="fact"><dt>${T.room}</dt><dd><b>${hi ? c.hiRoom : c.room}</b> · ${hi ? c.hiRoomTxt : c.roomTxt}</dd></div>
        <div class="fact"><dt>${T.reord}</dt><dd><span class="dots5">${[0, 1, 2, 3, 4].map(i => `<i class="${i < c.reorder ? 'f' : ''}"></i>`).join('')}</span>${c.reorder ? c.reorder + ' ' : ''}${hi ? c.hiReorder : c.reorderTxt}</dd></div>
        <div class="fact"><dt>${T.ask}</dt><dd>${hi ? c.hiAsk : c.ask}</dd></div>
      </dl></div><div class="nf ${hi ? 'hi' : ''}">${T.nf}</div>`;
  }

  scenes.money = {
    tag: 'Supplier Panel · Kalpana Textiles', url: 'supplier.meesho.com/<b>calculator</b>',
    html: () => `<div class="row between"><div><div class="lbl">Settlement calculator</div><div class="small muted mt4" id="m-card"></div></div><span class="pill brand">paid day 7</span></div>
      <div class="row mt16" style="gap:12px;flex-wrap:nowrap">
        <div class="field" style="flex:1"><label for="m-price">Your price, all-in</label><div class="inp"><span>₹</span><input id="m-price" type="number" inputmode="numeric" min="150" max="600"></div></div>
        <div class="field" style="flex:1"><label for="m-cost">Your cost per unit</label><div class="inp"><span>₹</span><input id="m-cost" type="number" inputmode="numeric" min="50" max="500"></div></div>
      </div>
      <div class="lbl mt16">If buyers return</div>
      <div class="ladder mt8" id="m-ladder">${FD.ladder.map(l => `<button data-r="${l.r}" class="${l.stop ? 'stop' : ''}" aria-pressed="${l.r === S.r}"><b>${l.l}</b><small>${l.s}</small></button>`).join('')}</div>
      <div class="brk mt16" id="m-brk"></div>
      <div class="keep mt12" id="m-keep"></div>
      <div class="verdict mt12" id="m-verdict"></div>`,
    bind: el => {
      el.addEventListener('click', e => { const b = e.target.closest('[data-r]'); if (b) { S.r = +b.dataset.r; drawMoney(); } });
      $('#m-price').addEventListener('input', e => { S.price = +e.target.value || 0; drawMoney(true); });
      $('#m-cost').addEventListener('input', e => { S.cost = +e.target.value || 0; drawMoney(true); });
      drawMoney();
    }
  };
  function drawMoney(typing) {
    const c = card(), price = S.price ?? c.price, cost = S.cost ?? c.cost;
    if (!typing) { $('#m-price').value = price; $('#m-cost').value = cost; }
    $('#m-card').textContent = `${c.name} · wholesale pays you ${inr(c.wholesale)} a unit`;
    $$('#m-ladder [data-r]').forEach(b => b.setAttribute('aria-pressed', +b.dataset.r === S.r));
    const s = FD.settle(price, cost, S.r);
    $('#m-brk').innerHTML = `<div><span>Buyer pays, delivery included</span><span class="num">${inr(price)}</span></div>
      <div><span>Forward shipping</span><span class="num">−${inr(E.SHIP)}</span></div>
      <div><span>Hub packing, published rate</span><span class="num">−${inr(E.PACK)}</span></div>
      <div><span>Returns reserve at ${S.r}% × ₹${E.REVERSE}</span><span class="num">−₹${s.reserve.toFixed(1).replace('.0', '')}</span></div>
      <div class="tot"><span>You receive per kept unit</span><span class="num">${inr(s.recv)}</span></div>`;
    const stop = S.r >= 12, beat = s.today > c.wholesale;
    $('#m-keep').innerHTML = `<div class="${stop ? 'bad' : 'hl'}"><small>You keep, after your ${inr(cost)} cost</small><b class="num">${inr(s.keep)}</b></div>
      <div class="${stop ? 'bad' : ''}"><small>In today's money (${E.DAYS} days at 18%)</small><b class="num">${inr(s.today)}</b></div>`;
    const v = $('#m-verdict');
    if (stop) { v.className = 'verdict bad mt12'; v.innerHTML = `<b>Stop.</b> At 12% returns you keep ${inr(s.today)} in today's money, below the ${inr(c.wholesale)} wholesale pays. Replenishment stops by rule.`; }
    else if (S.r >= 6) { v.className = 'verdict warn mt12'; v.innerHTML = `<b>Review line.</b> ${inr(s.today)} vs ${inr(c.wholesale)} wholesale. Above 6% return codes go back to the floor.`; }
    else { v.className = 'verdict ' + (beat ? 'ok' : 'warn') + ' mt12'; v.innerHTML = beat ? `<b>Beats wholesale.</b> ${inr(s.today)} in today's money vs ${inr(c.wholesale)}, and the factory computed it itself.` : `<b>Below wholesale</b> at this price. The price is yours to change.`; }
  }

  scenes.bid = {
    tag: 'Supplier Panel · Kalpana Textiles', url: 'supplier.meesho.com/<b>bid</b>',
    html: () => `<div id="bid"></div>`,
    bind: el => {
      el.addEventListener('input', e => {
        if (e.target.id === 'b-qty') { S.qty = +e.target.value; $('#b-qtyv').textContent = S.qty; $('#b-tot').textContent = inr(S.qty * card().cost); }
        if (e.target.id === 'b-price') S.price = +e.target.value || 0;
        if (e.target.matches('.spec input')) $('#b-go').disabled = $$('.spec input', el).some(i => !i.checked);
      });
      el.addEventListener('click', e => {
        if (e.target.closest('#b-go')) { S.bidDone = true; drawBid(); }
        if (e.target.closest('#b-again')) { S.bidDone = false; drawBid(); }
      });
      drawBid();
    }
  };
  function drawBid() {
    const c = card(), el = $('#bid'), price = S.price ?? c.price;
    if (S.bidDone) {
      const steps = [['Bid received', `${S.qty} ${c.unit} at ${inr(price)}, your spec`, true], ['Day 3 · Hub checks a sample', 'Against the card: thread count, size, wash test'], ['Day 7 · Slot goes live', 'A disclosed 60-day trial slot, ~20,000 impressions'], ['D+14 · first read', 'Rules, not an account manager'], ['D+30 · second read', 'Sell-through past 50% unlocks a replenishment offer'], ['D+60 · your call', 'Reorder on your own money, or stop. Stock stays yours.']];
      el.innerHTML = `<div class="row"><div class="okmark">✓</div><div><div class="lbl">Bid placed · ${c.name}</div><h3 style="font-size:22px;margin-top:4px">What happens next</h3></div></div>
        <div class="tl mt20">${steps.map((s, i) => `<div class="${s[2] ? 'd' : ''}" style="animation-delay:${i * 90}ms"><i>${s[2] ? '✓' : i + 1}</i><span><b>${s[0]}</b><small>${s[1]}</small></span></div>`).join('')}</div>
        <button class="btn o sm" id="b-again">Edit the bid</button>`;
      return;
    }
    el.innerHTML = `<div class="row between"><div><div class="lbl">Bid on this card</div><h3 style="font-size:20px;margin-top:4px">${c.name}</h3></div><span class="pill grey">${c.bids} other bids</span></div>
      <div class="lbl mt20">Confirm the spec you'll make</div>
      <div class="spec mt8">${c.chips.map(ch => `<label><input type="checkbox" checked> ${ch}</label>`).join('')}</div>
      <div class="row between mt20"><label class="lbl" for="b-qty">Pilot batch</label><span class="small"><b class="num" id="b-qtyv" style="font-size:18px">${S.qty}</b> ${c.unit}</span></div>
      <input type="range" id="b-qty" min="100" max="200" step="10" value="${S.qty}" class="mt8" aria-label="Pilot batch size">
      <div class="row between xs faint"><span>100</span><span>smaller than your smallest B2B order</span><span>200</span></div>
      <div class="row mt16" style="flex-wrap:nowrap;gap:12px;align-items:flex-end">
        <div class="field" style="flex:1"><label for="b-price">Your price, all-in</label><div class="inp"><span>₹</span><input id="b-price" type="number" value="${price}"></div></div>
        <div style="flex:1"><div class="xs faint" style="font-weight:800">Stock you fund</div><div style="font-size:22px;font-weight:900;line-height:44px" class="num" id="b-tot">${inr(S.qty * c.cost)}</div></div>
      </div>
      <div class="lbl mt20">Meesho gives you</div>
      <div class="never mt8"><span>no cash</span><span>no ad credit</span><span>no guarantee</span></div>
      <button class="btn mt20" id="b-go" style="width:100%">Submit bid</button>`;
  }

  scenes.hub = {
    tag: 'Cluster Hub · Panipat', url: 'hub.meesho.com/<b>panipat</b>',
    html: () => `<div class="stats3"><div><small>Parcels today</small><b class="num">412</b></div><div><small>Factories</small><b class="num">7</b></div><div><small>Courier pickup</small><b class="num">1</b></div></div>
      <div class="gauge"><i style="width:${412 / 600 * 100}%"></i><span class="be" style="left:${400 / 600 * 100}%"><span>break-even 400 a day</span></span></div>
      <div class="row between mt24"><span class="lbl">Spec check · sample vs card</span><div class="samples seg" id="h-tabs">${FD.hub.samples.map(s => `<button data-s="${s.id}" aria-pressed="${s.id === S.sample}">${s.f.split(' ')[0]}</button>`).join('')}</div></div>
      <div id="h-sample" class="mt8"></div>`,
    bind: el => {
      el.addEventListener('click', e => {
        const t = e.target.closest('[data-s]'); if (t) { S.sample = t.dataset.s; drawSample(); }
        const v = e.target.closest('[data-v]'); if (v) { S.verdict[S.sample] = v.dataset.v; drawSample(); }
      });
      drawSample();
    }
  };
  function drawSample() {
    const s = FD.hub.samples.find(x => x.id === S.sample), v = S.verdict[s.id];
    $$('#h-tabs [data-s]').forEach(b => b.setAttribute('aria-pressed', b.dataset.s === S.sample));
    const ok = (a, m) => a === m || (/[–+]/.test(a) && (() => { const n = parseFloat(m.replace(/,/g, '')); const [lo, hi] = a.replace(/,/g, '').split(/[–+]/).map(parseFloat); return n >= lo && (isNaN(hi) || n <= hi); })());
    $('#h-sample').innerHTML = `<div class="small muted"><b style="color:var(--ink)">${s.f}</b> · ${s.card}</div>
      <table class="cmp mt8"><thead><tr><th>Check</th><th>Card asks</th><th style="text-align:right">Measured</th></tr></thead><tbody>
      ${s.checks.map(c => `<tr><td>${c[0]}</td><td class="muted">${c[1]}</td><td class="${ok(c[1], c[2]) ? 'okc' : 'badc'}">${c[2]} ${ok(c[1], c[2]) ? '✓' : '✕'}</td></tr>`).join('')}</tbody></table>
      <div class="row mt12">${v ? `<span class="pill ${v === 'pass' ? 'ok' : 'bad'} dot">${v === 'pass' ? 'Passed · slot can go live' : 'Sent back · factory sees the failed check'}</span><button class="btn o sm" data-v="">Undo</button>`
        : `<button class="btn sm" data-v="pass">Pass</button><button class="btn o sm" data-v="fail">Send back</button><span class="xs faint">${s.pass ? 'All checks match the card' : 'One check misses the card'}</span>`}</div>`;
  }

  scenes.buyer = {
    tag: 'Buyer app', url: '', phone: true,
    html: () => `<div class="buyer"><div class="phone"><div class="screen"><div class="notch"></div>
        <div class="sbar"><span>9:41</span><span>●●● 5G</span></div>
        <div class="psrch">Search "double bedsheet 240 TC"</div>
        <div class="pscroll" id="p-body"></div>
        <div class="pcta"><button class="btn o">Add to cart</button><button class="btn">Buy now</button></div></div></div>
      <div><div class="seg solid" id="p-seg"><button data-fd="0">Today</button><button data-fd="1">Factory Direct</button></div>
        <div class="adds mt20" id="p-adds">
          <div><i>1</i><span><b>A maker line</b><small>Who made it and where. No badge, no ranking boost.</small></span></div>
          <div><i>2</i><span><b>A Hub-checked Spec Card</b><small>Thread count, size and wash test, measured.</small></span></div>
          <div><i>3</i><span><b>One all-in price</b><small>₹345 with delivery, instead of ₹317 + ₹64 at checkout.</small></span></div>
        </div></div></div>`,
    bind: el => { el.addEventListener('click', e => { const b = e.target.closest('[data-fd]'); if (b) { S.fd = b.dataset.fd === '1'; drawPhone(); } }); drawPhone(); }
  };
  const sheetSVG = `<svg viewBox="0 0 270 170" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="270" height="170" fill="#F6EEF4"/>
    <path d="M20 120 L135 70 L250 120 L135 160 Z" fill="#fff" stroke="#E3CCE7"/><path d="M20 120 L135 160 L135 168 L20 128Z" fill="#EBD9EE"/><path d="M250 120 L135 160 L135 168 L250 128Z" fill="#E3CCE7"/>
    <g fill="#F43397" opacity=".55">${[[80, 108], [120, 92], [160, 110], [110, 128], [150, 136], [190, 118], [130, 112]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="6"/>`).join('')}</g>
    <g fill="#9F2089" opacity=".5">${[[100, 116], [140, 100], [175, 126], [125, 146], [92, 126]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="3.5"/>`).join('')}</g>
    <rect x="60" y="66" width="56" height="26" rx="10" fill="#fff" stroke="#E3CCE7"/><rect x="150" y="62" width="56" height="26" rx="10" fill="#fff" stroke="#E3CCE7"/></svg>`;
  function drawPhone() {
    const fd = S.fd;
    $$('#p-seg [data-fd]').forEach(b => b.setAttribute('aria-pressed', (b.dataset.fd === '1') === fd));
    $('#p-adds').classList.toggle('dim', !fd);
    $('#p-body').innerHTML = `<div class="pimg">${sheetSVG}</div><div class="pb">
      <div class="pt">Cotton double bedsheet with 2 pillow covers, floral print, 90×100 inch</div>
      <div class="pp"><b class="num ${fd ? 'badge-n' : ''}" ${fd ? 'data-n="3"' : ''}>${fd ? '₹345' : '₹317'}</b>${fd ? '<span class="ai">All-in · free delivery</span>' : '<span class="del">+ ₹64 delivery at checkout</span>'}</div>
      <div class="row mt8" style="gap:6px"><span class="rate">4.1 ★</span><span class="xs faint">2,184 ratings</span></div>
      ${fd ? `<div class="mk badge-n" data-n="1"><span class="f">✦</span><span><b>Made by Kalpana Textiles, Panipat</b><small>Sold by the factory · checked at the Panipat Hub</small></span></div>
        <div class="sc badge-n" data-n="2"><div class="h"><span>Spec Card</span><span style="color:var(--green)">Hub-checked ✓</span></div>
        <div class="g"><div><small>Thread count</small><b>236</b></div><div><small>Size</small><b>90×100 in</b></div><div><small>Pillow covers</small><b>2</b></div><div><small>Wash test</small><b>no bleed</b></div></div></div>`
      : `<div class="miss">Sold by <b>HomeDecor_Trends</b> · thread count not stated · size "double"</div>`}
      </div>`;
  }

  scenes.rules = {
    tag: 'C2M Console', url: 'console.meesho.com/<b>pilot · D+14</b>',
    html: () => `<div class="rsplit"><div class="rlist"><table class="rtable"><thead><tr><th>Factory</th><th class="r">Sold</th><th>Status</th></tr></thead><tbody id="r-body"></tbody></table></div>
      <div class="rdetail" id="r-detail"></div></div>`,
    bind: el => {
      el.addEventListener('click', e => { const tr = e.target.closest('tr[data-id]'); if (tr) { S.sel = +tr.dataset.id; drawRules(); } });
      el.addEventListener('keydown', e => { const tr = e.target.closest('tr[data-id]'); if (tr && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); S.sel = +tr.dataset.id; drawRules(); } });
      drawRules();
    }
  };
  function drawRules() {
    const rows = FD.pilot.map(p => { const r = FD.read(p, 14); return { p, r, j: FD.judge(r) }; });
    const n = { ok: 0, warn: 0, bad: 0 }; rows.forEach(x => n[x.j.s]++);
    const order = { bad: 0, warn: 1, ok: 2 };
    if (!drawRules.sorted) { drawRules.sorted = rows.slice().sort((a, b) => order[a.j.s] - order[b.j.s] || a.p.id - b.p.id).map(x => x.p.id); S.sel = drawRules.sorted[0]; }
    $('#r-body').innerHTML = drawRules.sorted.map(id => { const x = rows[id]; return `<tr data-id="${id}" tabindex="0" aria-selected="${id === S.sel}"><td><b>${x.p.f}</b><small>${x.p.sku}</small></td><td class="r num">${x.r.sold}%</td><td><span class="pill ${x.j.s} dot">${x.j.short}</span></td></tr>`; }).join('');
    const x = rows[S.sel], r = x.r, j = x.j;
    const reads = [['impr', (r.impr / 1000).toFixed(1) + 'k', 'impressions · slot 20k', r.impr < r.slot * .9], ['conv', r.conv + '%', 'kept conversion · bench 1.8%', r.conv < FD.BENCH], ['sla', r.sla + '%', 'dispatch SLA · ' + (r.hub ? 'Hub-packed' : 'factory-packed'), r.sla < 95], ['ret', r.ret + '%', 'customer returns', r.ret > 6], ['rto', r.rto + '%', 'RTO · median 15%', r.rto > FD.RTO_MED], ['contrib', inr(r.contrib), 'contribution per unit', r.contrib < 0]];
    $('#r-detail').innerHTML = `<div><div class="row between"><span class="lbl">30 pilot batches · D+14</span></div>
        <div class="sbarx mt8"><i style="flex:${n.ok};background:var(--green)"></i><i style="flex:${n.warn};background:#E7A33A"></i><i style="flex:${n.bad};background:var(--red)"></i></div>
        <div class="row xs mt8" style="gap:14px;font-weight:800"><span class="okc">${n.ok} on track</span><span style="color:var(--amber)">${n.warn} auto action</span><span class="badc">${n.bad} stop</span></div></div>
      <div><h3 style="font-size:18px">${x.p.f}</h3><div class="xs faint">${x.p.sku} · 100-unit pilot batch</div></div>
      <div class="reads">${reads.map(q => `<div class="${q[3] && (j.k === q[0] || (q[0] === 'sla' && j.k.startsWith('sla')) || (q[0] === 'ret' && j.k.startsWith('ret'))) ? 'flag' : ''}"><b class="num">${q[1]}</b><small>${q[2]}</small></div>`).join('')}</div>
      <div class="action ${j.s}"><b>${j.s === 'ok' ? 'No rule fired' : 'Rule fired · ' + j.label}</b><div class="mt4">${j.action}</div><div class="h">Human looks only if: ${j.human}</div></div>`;
  }

  scenes.north = {
    tag: 'C2M Console', url: 'console.meesho.com/<b>north-star</b>',
    html: () => `<div class="ns"><div class="row between"><span class="lbl">Second batch on the factory's own money</span><div class="seg" id="n-seg">${[14, 30, 60, 90].map(d => `<button data-d="${d}" aria-pressed="${d === S.day}">D+${d}</button>`).join('')}</div></div>
      <div class="big num" id="n-big"></div>
      <div><div class="prog"><i id="n-bar"></i><span class="gate" id="n-gate"><span></span></span></div></div>
      <div class="cmp2"><span>Pilot batches</span><div class="prog"><i id="n-p"></i></div><b class="num" id="n-pv"></b>
        <span class="faint">Matched controls</span><div class="prog"><i class="c" id="n-c"></i></div><b class="num faint" id="n-cv"></b></div>
      <p class="small muted" id="n-txt"></p><span class="pill grey" style="align-self:flex-start">illustrative pilot reads</span></div>`,
    bind: el => { el.addEventListener('click', e => { const b = e.target.closest('[data-d]'); if (b) { S.day = +b.dataset.d; drawNorth(); } }); drawNorth(); }
  };
  function drawNorth() {
    const d = S.day, re = FD.pilot.filter(p => FD.read(p, d).reordered).length, ctrl = { 14: 0, 30: 0, 60: 3, 90: 4 }[d];
    const gate = d >= 90 ? 60 : 50;
    $$('#n-seg [data-d]').forEach(b => b.setAttribute('aria-pressed', +b.dataset.d === d));
    $('#n-big').innerHTML = `${re}<span>/30</span>`;
    $('#n-bar').style.width = re / 30 * 100 + '%';
    const g = $('#n-gate'); g.style.left = gate + '%'; g.firstElementChild.textContent = `gate ${gate}% by D+${d >= 90 ? 90 : 60}`;
    $('#n-p').style.width = re / 30 * 100 + '%'; $('#n-pv').textContent = re + '/30';
    $('#n-c').style.width = ctrl / 30 * 100 + '%'; $('#n-cv').textContent = ctrl + '/30';
    $('#n-txt').textContent = { 14: 'Too early: nobody reorders before the batch sells through. Reads are about listing, SLA and returns.', 30: 'Sell-through passes 50% for most batches; the panel offers replenishment. Still 0 reorders.', 60: `${re} of 30 factories paid for a second batch themselves, past the 50% gate. Controls: ${ctrl}.`, 90: `${re} of 30 by D+90, past the 60% gate, against ${ctrl} of 30 matched controls.` }[d];
  }

  scenes.waterfall = {
    tag: 'Unit economics', url: 'console.meesho.com/<b>unit-economics</b>', center: true,
    html: () => `<div class="wf">${wfSVG()}</div>
      <div class="legend mt12"><span><i style="background:#570A57"></i>Price paid</span><span><i style="background:#F4B5D7"></i>Cost removed</span><span><i style="background:#038D63"></i>Extra to the factory</span><span><i style="background:#fff;border:1px dashed #9F2089"></i>Idle capacity floor</span></div>
      <p class="xs faint mt8">Per kept unit · 240 TC double bedsheet set · axis starts at ₹300 · scenario, to be replaced by quotes</p>`
  };
  function wfSVG() {
    const W = 640, H = 330, L = 44, R = 10, T = 26, B = 64, min = 300, max = 390;
    const y = v => T + (max - v) / (max - min) * (H - T - B);
    const items = FD.waterfall, bw = (W - L - R) / items.length, pad = 12;
    let run = 0, out = '';
    for (let v = 300; v <= 390; v += 30) out += `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="#EEEBF2"/><text x="${L - 8}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="#8E8EA4">₹${v}</text>`;
    items.forEach((it, i) => {
      const x = L + i * bw + pad / 2, w = bw - pad;
      let top, bot, fill, lab, stroke = 'none', dash = '';
      if (it.total) { top = y(it.v); bot = y(min); run = it.ghost ? run : it.v; lab = '₹' + it.v; fill = it.ghost ? '#fff' : it.fd ? '#9F2089' : '#570A57'; if (it.ghost) { stroke = '#9F2089'; dash = 'stroke-dasharray="4 4"'; } }
      else { const a = run, b = run + it.v; top = y(Math.max(a, b)); bot = y(Math.min(a, b)); run = b; fill = it.v > 0 ? '#038D63' : '#F4B5D7'; lab = (it.v > 0 ? '+' : '−') + '₹' + Math.abs(it.v); }
      out += `<rect x="${x}" y="${top}" width="${w}" height="${Math.max(2, bot - top)}" rx="4" fill="${fill}" stroke="${stroke}" ${dash}/>`;
      out += `<text x="${x + w / 2}" y="${top - 7}" text-anchor="middle" font-size="12.5" font-weight="900" fill="${it.v > 0 && !it.total ? '#038D63' : it.fd ? '#9F2089' : '#353543'}">${lab}</text>`;
      const words = it.l.split(' '), half = Math.ceil(words.length / 2);
      [words.slice(0, half).join(' '), words.slice(half).join(' ')].forEach((t, k) => { if (t) out += `<text x="${x + w / 2}" y="${H - B + 18 + k * 14}" text-anchor="middle" font-size="11" font-weight="${it.total ? 800 : 600}" fill="${it.ghost ? '#8E8EA4' : '#5E5E70'}">${t}</text>`; });
      if (i < items.length - 1 && !items[i + 1].ghost) out += `<line x1="${x + w}" x2="${x + w + pad}" y1="${y(run)}" y2="${y(run)}" stroke="#C9C4D2" stroke-dasharray="2 2"/>`;
    });
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Waterfall from ₹381 to ₹345" font-family="Mulish">${out}</svg>`;
  }

  scenes.scale = {
    tag: 'C2M Console', url: 'console.meesho.com/<b>roadmap</b>', center: true,
    html: () => `<div class="row between"><span class="lbl">Factories replenishing on their own money</span><span class="xs faint">cluster by cluster</span></div>
      <div class="road mt12">${FD.road.map(r => `<div><span class="q">${r.q}</span><span class="c"><b>${r.c}</b><small>${r.d}</small></span><span class="t"><i data-w="${r.v / 850 * 100}"></i></span><span class="v num">${r.v}</span></div>`).join('')}</div>
      <div class="lbl mt24">Buyer savings a year, month 24</div>
      <div class="scen mt8">${FD.scenarios.map(s => `<div class="${s.base ? 'base' : ''}"><span class="lbl">${s.k}</span><b class="num">${s.v}</b><small>${s.s}</small></div>`).join('')}</div>`,
    enter: el => $$('.road i', el).forEach((i, k) => setTimeout(() => { i.style.width = i.dataset.w + '%'; }, 80 + k * 90))
  };

  /* ---------- steps ---------- */
  const STEPS = [
    { ch: 'Problem', scene: 'problem', h: 'Factories <em>don\'t come online</em>, and the few who do leave early.', l: ['They are built for bulk B2B orders with no returns. Selling one parcel at a time means new operations, unsold stock and no proof that orders will come.'], q: ['Humein demand dikhao, lekin paisa kab aayega woh bhi clear karo.', 'A factory owner in our interviews: "Show us demand, but also make clear when the money arrives."'] },
    { ch: 'Insight', scene: 'insight', h: 'The demand <em>already exists</em> on Meesho.', l: ['A Panipat factory\'s bedsheet already sells here under trader names. Its cold start is a routing problem, not a demand problem.', 'So flip the order: product first, factory second, cluster third.'] },
    { ch: 'Factory', scene: 'card', h: 'Show the factory <em>what sells</em>, not a forecast.', l: ['A Demand Card: what to make, how much sells, at what price and why it comes back. Ratios and signals, in English or Hindi.', 'Switch cards and language on the right.'], k: ['1 in 4', 'bedsheet-set orders on Meesho match this card'] },
    { ch: 'Factory', scene: 'money', h: 'It checks <em>its own money</em> before it makes a thing.', l: ['Price minus shipping, Hub packing and a returns reserve. Paid on day 7.', 'Try the returns ladder: at 12% the rule says stop.'], k: ['₹22', 'in today\'s money per set, against ₹19 from wholesale (₹245 received, ₹27 kept)'], g: true },
    { ch: 'Factory', scene: 'bid', h: 'Then it bids. <em>Small</em>, at its own price.', l: ['100–200 units, smaller than its smallest B2B order. Its spec, its price, its stock.', 'Meesho puts in no cash, no ad credit and no guarantee.'], k: ['100–200', 'units in a Pilot Batch, read at D+14, 30 and 60'] },
    { ch: 'Hub', scene: 'hub', h: 'A Cluster Hub in <em>the factory\'s own town</em>.', l: ['It checks the sample against the card, packs singles and books one pickup for the whole cluster. Published rates.', 'Try passing or sending back a sample.'], k: ['412', 'parcels from 7 factories, one pickup. Break-even is 400 a day.'], ill: true },
    { ch: 'Buyer', scene: 'buyer', h: 'The buyer sees <em>a maker and a spec</em>.', l: ['Same set. Today: ₹317 plus ₹64 at checkout, no thread count, no maker. With Factory Direct: ₹345 all-in.'], k: ['15 of 20', 'buyers we interviewed picked the Factory Direct listing'], q: ['Checked hai toh COD chhod sakta hoon.', 'A COD buyer: "If it\'s checked, I can skip cash on delivery."'] },
    { ch: 'Rules', scene: 'rules', h: 'Reads by rule, <em>not by account manager</em>.', l: ['30 pilot batches at D+14. Each read runs seven rules: reorder, fix or stop.', 'Click a batch to see which rule fired, what happened automatically and when a human looks.'], k: ['17 · 10 · 3', 'on track · auto action · stop'], ill: true },
    { ch: 'Rules', scene: 'north', h: 'One number: <em>a second batch on its own money</em>.', l: ['Not GMV, not sign-ups. The factory reorders only if the first batch paid.', 'Step through D+14 to D+90.'], k: ['20/30', 'by D+90, against 4 of 30 matched controls'], ill: true },
    { ch: 'Scale', scene: 'waterfall', h: 'Where the <em>₹36</em> comes from.', l: ['The trader keeps only ₹4. The rest sits in inbound freight, credit, returns and pickup density: costs a reseller cannot remove.', 'The factory still keeps ₹2 more than through a trader.'], k: ['₹381 → ₹345', 'all-in, like for like · 9.4% cheaper'] },
    { ch: 'Scale', scene: 'scale', h: 'Cluster by cluster, <em>15 → 850</em> factories.', l: ['Panipat first, then Karur, Moradabad, Tiruppur, second Hubs and Surat, only if each gate holds.'], k: ['₹61 cr', 'base case buyer savings a year (₹26 cr low, ₹202 cr high)'] }
  ];
  const CHAPTERS = ['Problem', 'Insight', 'Factory', 'Hub', 'Buyer', 'Rules', 'Scale'];

  /* ---------- build ---------- */
  const stepsEl = $('#steps'), scenesEl = $('#scenes');
  STEPS.forEach((st, i) => {
    const sc = scenes[st.scene];
    const s = document.createElement('section');
    s.className = 'step'; s.dataset.i = i; s.dataset.ch = st.ch; s.id = 'step-' + st.scene;
    s.innerHTML = `<div class="ch"><span class="eyebrow">${st.ch}</span><span class="n">${String(i + 1).padStart(2, '0')} / ${STEPS.length}</span></div>
      <h2>${st.h}</h2>${st.l.map(t => `<p class="l">${t}</p>`).join('')}
      ${st.q ? `<blockquote lang="hi-Latn">“${st.q[0]}”<small>${st.q[1]}</small></blockquote>` : ''}
      ${st.k ? `<div class="key"><b class="num ${st.g ? 'g' : ''}">${st.k[0]}</b><span>${st.k[1]}</span></div>` : ''}
      ${st.ill ? '<span class="ill">illustrative sample data</span>' : ''}
      <div class="inline"><div class="frame"><div class="chrome"><span class="dots"><i></i><i></i><i></i></span><span class="tag">${sc.tag}</span></div><div class="scenes"></div></div></div>`;
    stepsEl.appendChild(s);
    const el = document.createElement('div');
    el.className = 'scene' + (sc.center ? ' center' : ''); el.dataset.key = st.scene;
    el.innerHTML = sc.html();
    scenesEl.appendChild(el);
    sc.el = el;
  });
  STEPS.forEach(st => scenes[st.scene].bind && scenes[st.scene].bind(scenes[st.scene].el));
  function refreshCard() { drawCard(); drawMoney(); drawBid(); }

  /* chapters */
  const chapEl = $('#chapters');
  chapEl.innerHTML = CHAPTERS.map(c => `<button data-c="${c}">${c}</button>`).join('');
  chapEl.addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (b) go($(`.step[data-ch="${b.dataset.c}"]`)); });

  /* ---------- activation ---------- */
  const stepEls = $$('.step'), tagEl = $('#f-tag'), urlEl = $('#f-url'), chromeEl = $('#f-chrome');
  let cur = -1;
  function activate(i) {
    if (i === cur) return;
    const prev = STEPS[cur], st = STEPS[i];
    if (prev && prev.scene !== st.scene) { const p = scenes[prev.scene]; p.leave && p.leave(p.el); }
    if (!mobile.matches) STEPS.forEach(x => { if (x.scene !== st.scene) scenes[x.scene].el.classList.remove('on'); });
    cur = i;
    stepEls.forEach((s, j) => s.classList.toggle('on', j === i));
    const sc = scenes[st.scene];
    sc.el.classList.add('on'); sc.enter && sc.enter(sc.el);
    tagEl.textContent = sc.tag;
    urlEl.innerHTML = sc.url || 'meesho app · <b>product page</b>';
    const ci = CHAPTERS.indexOf(st.ch);
    $$('button', chapEl).forEach((b, j) => { b.classList.toggle('on', j === ci); b.classList.toggle('done', j < ci); });
    const on = $('button.on', chapEl); if (on && chapEl.scrollWidth > chapEl.clientWidth) chapEl.scrollTo({ left: chapEl.scrollLeft + on.getBoundingClientRect().left - chapEl.getBoundingClientRect().left - 8, behavior: 'smooth' });
  }
  function clearChapters() { cur = -1; stepEls.forEach(s => s.classList.remove('on')); $$('button', chapEl).forEach(b => b.classList.remove('on')); }

  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) activate(+e.target.dataset.i); }), { rootMargin: '-45% 0px -45% 0px' });
  stepEls.forEach(s => io.observe(s));
  const edge = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { if (e.target.id === 'close') $$('button', chapEl).forEach(b => { b.classList.remove('on'); b.classList.add('done'); }); else clearChapters(); } }), { rootMargin: '-45% 0px -45% 0px' });
  edge.observe($('#hero')); edge.observe($('#close'));

  /* progress */
  const bar = $('#progress');
  const onScroll = () => { const h = document.documentElement; bar.style.width = (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight) * 100) + '%'; };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- keyboard ---------- */
  const stops = () => [$('#hero'), ...stepEls, $('#close')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  function go(el) { if (el) el.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: el.classList.contains('step') && !mobile.matches ? 'center' : 'start' }); }
  function here() {
    const mid = innerHeight / 2, list = stops();
    let best = 0, bd = Infinity;
    list.forEach((el, i) => { const r = el.getBoundingClientRect(); const d = r.top <= mid && r.bottom >= mid ? 0 : Math.min(Math.abs(r.top - mid), Math.abs(r.bottom - mid)); if (d < bd) { bd = d; best = i; } });
    return best;
  }
  addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target, typing = t.matches && t.matches('input, textarea, select, [contenteditable]');
    if (typing) return;
    const next = ['ArrowRight', 'PageDown', ' '].includes(e.key), prev = ['ArrowLeft', 'PageUp'].includes(e.key);
    if (e.key === ' ' && t.matches && t.matches('button, a, [tabindex], tr')) return;
    if (!next && !prev && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    const list = stops();
    if (e.key === 'Home') return go(list[0]);
    if (e.key === 'End') return go(list[list.length - 1]);
    const i = here();
    go(list[Math.max(0, Math.min(list.length - 1, i + (next ? 1 : -1)))]);
  });
  $('#cue').addEventListener('click', () => go(stepEls[0]));

  /* ---------- narrow screens: each scene moves inline into its step ---------- */
  function place() {
    STEPS.forEach((st, i) => {
      const el = scenes[st.scene].el;
      if (mobile.matches) { $('.inline .scenes', stepEls[i]).appendChild(el); el.classList.add('on'); scenes[st.scene].enter && scenes[st.scene].enter(el); }
      else { scenesEl.appendChild(el); el.classList.toggle('on', i === cur); }
    });
  }
  mobile.addEventListener('change', place); place();
  chromeEl.hidden = false;
})();
