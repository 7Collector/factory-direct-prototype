/* Factory Direct · the four product screens: Supplier Panel, Cluster Hub, Buyer app, C2M Console. */
(function () {
  const FD = window.FD, $ = FD.$, $$ = FD.$$, inr = FD.inr, I = FD.icon, S = () => FD.state;
  const card = () => FD.cards.find(c => c.id === S().card) || FD.cards[0];
  const KALPANA = FD.pilot[0];
  const days = [14, 30, 60, 90];
  const daySeg = (id) => `<div class="seg brand" id="${id}" role="group" aria-label="Read day">${days.map(d => `<button data-d="${d}" aria-pressed="${S().day === d}">D+${d}</button>`).join('')}</div>`;
  const bindDaySeg = (root, id) => $$('#' + id + ' button', root).forEach(b => b.onclick = () => { S().day = +b.dataset.d; FD.save(); FD.refresh(); });

  /* =====================================================================
     SUPPLIER PANEL
     ===================================================================== */
  function verdict(s, wholesale) {
    if (s.keep < 0) return ['bad', 'Below cost', 'At this price and cost the batch loses money. The panel will not offer a replenishment until contribution is positive.'];
    if (s.today < wholesale - .5) return ['bad', 'Below wholesale', `You keep ${inr(s.today)} in today's money against about ₹${wholesale} on wholesale. This is why replenishment stops at 12% returns.`];
    if (s.today < wholesale + 1.5) return ['warn', 'Wholesale parity', `About the same as wholesale (₹${wholesale}), but paid in 7 days. Returns above 6% send codes to your floor; the Spec Card and Hub grading bring them back under 5%.`];
    return ['ok', 'Clears wholesale', `You keep ${inr(s.today)} in today's money against about ₹${wholesale} on wholesale, and you are paid in 7 days instead of 15–60.`];
  }

  function journey() {
    const st = S().replenished ? 2 : 1;
    const steps = [['Applicant', 'floor video + Udyam'], ['Verified', 'Gate 1 visit passed'], ['Live', '60-day trial slot'], ['Replenishing', 'second batch, own money'], ['Anchor', 'by rule · 3 SKUs']];
    return `<div class="journey" aria-label="Factory journey">${steps.map((s, i) => `<div class="${i <= st ? 'done' : ''} ${i === st + 1 ? 'now' : ''}"><b>${s[0]}</b>${s[1]}</div>`).join('')}</div>`;
  }

  function demandCard() {
    const c = card(), L = S().lang, t = FD.i18n[L], hi = L === 'hi';
    const s = FD.settle(c.price, c.cost, 5);
    const maxB = Math.max(...c.bands.map(b => b.v));
    const bid = S().bid && S().bid.card === c.id ? S().bid : null;
    const tr = { up: ['up', '▲'], down: ['down', '▼'], flat: ['flat', '▬'] }[c.trend];
    return `
    <article class="dcard" id="dcard">
      <div class="hd">
        <div><div class="eyebrow">${t.card} · Panipat · Oct 2026</div><h2 class="${hi ? 'hi' : ''}">${hi ? c.hiName : c.name}</h2></div>
        <div class="lang" role="group" aria-label="Language"><button data-l="en" aria-pressed="${!hi}">EN</button><button data-l="hi" aria-pressed="${hi}" class="hi">हिं</button></div>
      </div>
      <div class="bd ${hi ? 'hi' : ''}">
        <dl>
          <div class="fact"><dt>${t.what}</dt><dd>${hi ? c.hiSpec : c.spec}</dd></div>
          <div class="fact"><dt>${t.sells}</dt><dd><div class="meter"><span class="track"><i style="width:${c.share * 100}%"></i></span><span>${hi ? c.hiShare : c.shareTxt}</span></div></dd></div>
          <div class="fact"><dt>${t.way}</dt><dd><span class="trend ${tr[0]}">${tr[1]} ${hi ? c.hiTrend : c.trendTxt}</span></dd></div>
          <div class="fact"><dt>${t.price}</dt><dd><div class="bands">${c.bands.map(b => `<div class="${b.v === maxB ? 'top' : ''}"><i style="height:${Math.round(b.v * 70)}px"></i><small class="num">${b.l}<br><em>${Math.round(b.v * 100)}% of orders</em></small></div>`).join('')}</div></dd></div>
          <div class="fact"><dt>${t.ret}</dt><dd><div class="chips">${(hi ? c.hiReturns : c.returns).map(r => `<span class="pill warn plain">${r}</span>`).join('')}</div></dd></div>
          <div class="fact"><dt>${t.room}</dt><dd><b style="color:var(--m-primary)">${hi ? c.hiRoom : c.room}</b> <span class="muted">· ${hi ? c.hiRoomTxt : c.roomTxt}</span></dd></div>
          <div class="fact"><dt>${t.reord}</dt><dd><span class="dots">${Array.from({ length: 5 }, (_, i) => `<i class="${i < c.reorder ? 'f' : ''}"></i>`).join('')}</span><b>${c.reorder}/5</b> <span class="muted">${hi ? c.hiReorder : c.reorderTxt}</span></dd></div>
          <div class="fact"><dt>${t.ask}</dt><dd>${hi ? c.hiAsk : c.ask}</dd></div>
        </dl>
        <div class="money">
          <div><small>${t.money} ${inr(c.price)} all-in</small><div class="big num">${inr(s.recv)}</div><small>${t.recv}</small></div>
          <div style="text-align:right"><small>${t.keep} ${inr(c.cost)}</small><div class="big num" style="color:var(--green)">${inr(s.keep)}</div><small>vs ~₹${c.wholesale} wholesale</small></div>
        </div>
        <div class="notforecast">${I('shield', 16)} ${t.nf}</div>
        <div class="row mt-16" style="flex-wrap:nowrap">
          <button class="btn outline" id="btn-calc" style="flex:1">${I('rupee', 16)} ${t.calc}</button>
          ${bid ? `<button class="btn" style="flex:1" disabled>${I('check', 16)} Bid sent · ${bid.qty} at ${inr(bid.price)}</button>` : `<button class="btn" id="btn-bid" style="flex:1">${t.bid} ${I('arrow', 16)}</button>`}
        </div>
      </div>
    </article>`;
  }

  FD.openCalc = function () {
    const c = card(), st = S();
    if (st._calcCard !== c.id) { st.price = c.price; st.cost = c.cost; st._calcCard = c.id; }
    FD.openDrawer(`
      <div class="dh"><div><div class="eyebrow">Settlement calculator</div><h2 style="font-size:20px;margin-top:4px">Your money, per kept unit</h2><p class="small muted mt-4">${c.name} · type your own numbers</p></div><button class="x" data-close aria-label="Close">${I('x')}</button></div>
      <div class="db">
        <div class="seg" id="presets" style="margin-bottom:16px"><button data-p="full" aria-pressed="true">Full cost</button><button data-p="idle" aria-pressed="false">Idle capacity</button></div>
        <div class="grid" style="grid-template-columns:1fr 1fr;gap:12px">
          <div class="field"><label for="c-price">All-in price to buyer</label><div class="input-pre"><span>₹</span><input class="input num" id="c-price" type="number" inputmode="numeric" value="${st.price}"></div></div>
          <div class="field"><label for="c-cost">Your cost per unit</label><div class="input-pre"><span>₹</span><input class="input num" id="c-cost" type="number" inputmode="numeric" value="${st.cost}"></div></div>
        </div>
        <div class="field mt-16"><label>Customer-return rate · the same ladder every read uses</label>
          <div class="ladder" id="ladder">${FD.ladder.map(l => `<button class="${l.stop ? 'stop' : ''}" data-r="${l.r}" aria-pressed="${st.r === l.r}"><b>${l.l}</b><small>${l.s}</small></button>`).join('')}</div></div>
        <div class="breakdown mt-16" id="bd"></div>
        <div class="keep mt-16" id="keep"></div>
        <div id="verdict" class="mt-12"></div>
        <p class="xs faint mt-12">Shipping ₹65–70 + GST for 500 g–1 kg; Hub packing at the published rate; returns reserve = rate × ₹170 reverse fee. Today's money discounts 18% a year for the ~41 days from production to payout. Meesho charges no commission and no RTO fee.</p>
      </div>
      <div class="df"><button class="btn block" id="calc-bid">Bid at these numbers ${I('arrow', 16)}</button></div>`, d => {
      const draw = () => {
        const price = +$('#c-price', d).value || 0, cost = +$('#c-cost', d).value || 0, r = st.r;
        st.price = price; st.cost = cost; FD.save();
        const s = FD.settle(price, cost, r), e = FD.econ;
        $('#bd', d).innerHTML = `
          <div><span>Buyer pays, delivery included</span><span class="num">${inr(price)}</span></div>
          <div><span>Forward shipping, incl. GST</span><span class="num">− ${inr(e.SHIP)}</span></div>
          <div><span>Hub packing, incl. GST</span><span class="num">− ${inr(e.PACK)}</span></div>
          <div><span>Returns reserve · ${r}% × ₹170</span><span class="num">− ${inr(s.reserve)}</span></div>
          <div class="tot"><span>You receive, day 7</span><span class="num">${inr(s.recv)}</span></div>`;
        $('#keep', d).innerHTML = `<div class="hl"><small>You keep per kept unit</small><b class="num">${inr(s.keep)}</b><small>after your cost of ${inr(cost)}</small></div><div><small>In today's money</small><b class="num">${inr(s.today)}</b><small>vs ~₹${c.wholesale} wholesale</small></div>`;
        const v = verdict(s, c.wholesale);
        $('#verdict', d).innerHTML = `<div class="verdict ${v[0]}"><span class="pill ${v[0]}">${v[1]}</span><span>${v[2]}</span></div>`;
      };
      $$('#c-price,#c-cost', d).forEach(i => i.addEventListener('input', draw));
      $$('#ladder button', d).forEach(b => b.onclick = () => { st.r = +b.dataset.r; $$('#ladder button', d).forEach(x => x.setAttribute('aria-pressed', x === b)); draw(); });
      $$('#presets button', d).forEach(b => b.onclick = () => {
        $$('#presets button', d).forEach(x => x.setAttribute('aria-pressed', x === b));
        const idle = b.dataset.p === 'idle';
        $('#c-price', d).value = idle ? c.price - 5 : c.price; $('#c-cost', d).value = idle ? c.cost - 13 : c.cost; draw();
      });
      $('#calc-bid', d).onclick = () => { FD.closeOverlays(); setTimeout(() => FD.openBid(st.price), 250); };
      draw();
    });
  };

  FD.openBid = function (presetPrice) {
    const c = card();
    const b = { step: 1, qty: 100, price: presetPrice || c.price, checks: {} };
    const paint = () => {
      const s = FD.settle(b.price, c.cost, 5), kept = Math.round(b.qty * .95);
      let body = '';
      if (b.step === 1) body = `
        <h3>Confirm the spec this card asks for</h3><p class="small muted mt-4">The Hub checks one sample against it before the listing goes live.</p>
        <div class="stack gap-8 mt-16">${c.chips.map((x, i) => `<label class="check"><input type="checkbox" data-c="${i}" ${b.checks[i] ? 'checked' : ''}> ${x}</label>`).join('')}</div>
        <button class="btn block lg mt-24" id="b-next" ${c.chips.every((_, i) => b.checks[i]) ? '' : 'disabled'}>Continue</button>`;
      if (b.step === 2) body = `
        <h3>How many, and at what price?</h3><p class="small muted mt-4">100–200 units, smaller than your smallest B2B order. The price is always yours.</p>
        <div class="field mt-24"><label for="b-qty">Pilot batch · <b class="num" id="b-qty-out" style="color:var(--m-primary)">${b.qty} ${c.unit}</b></label><input id="b-qty" type="range" min="100" max="200" step="10" value="${b.qty}"></div>
        <div class="field mt-16"><label for="b-price">All-in price to the buyer</label><div class="input-pre"><span>₹</span><input class="input num" id="b-price" type="number" value="${b.price}"></div></div>
        <div class="keep mt-16"><div class="hl"><small>You keep per kept unit</small><b class="num" id="b-keep">${inr(s.keep)}</b></div><div><small>On ${kept} kept at 5% returns</small><b class="num" id="b-tot">${inr(s.keep * kept)}</b></div></div>
        <div class="row mt-24" style="flex-wrap:nowrap"><button class="btn ghost" id="b-back">${I('back', 16)} Back</button><button class="btn lg" style="flex:1" id="b-next">Review bid</button></div>`;
      if (b.step === 3) body = `
        <h3>Review your bid</h3>
        <div class="breakdown mt-12">
          <div><span>Demand Card</span><span>${c.name}</span></div>
          <div><span>Quantity</span><span class="num">${b.qty} ${c.unit}</span></div>
          <div><span>All-in price</span><span class="num">${inr(b.price)}</span></div>
          <div><span>You receive per kept unit, day 7</span><span class="num">${inr(s.recv)}</span></div>
          <div><span>Packing</span><span>Cluster Hub, ₹10 + GST a parcel</span></div>
        </div>
        <div class="verdict ok mt-16">${I('shield', 18)}<span>No cash, no ad credit, no volume guarantee. Stock stays yours, and anything unsold goes back to your B2B shelf.</span></div>
        <div class="row mt-24" style="flex-wrap:nowrap"><button class="btn ghost" id="b-back">${I('back', 16)} Back</button><button class="btn lg" style="flex:1" id="b-submit">Submit bid</button></div>`;
      if (b.step === 4) body = `
        <div class="success"><div class="tick">${I('check', 32, 3)}</div><h3>Bid received</h3><p class="small muted mt-4">${b.qty} ${c.unit} of ${c.name.toLowerCase()} at ${inr(b.price)} all-in</p></div>
        <div class="timeline mt-16">
          <div class="done"><i>${I('check', 12, 3)}</i><span><b>Bid on the card</b><small>Just now</small></span></div>
          <div><i>2</i><span><b>Hub checks one sample against the spec</b><small>Within 3 days · drop it at the Panipat Hub</small></span></div>
          <div><i>3</i><span><b>Listing goes live</b><small>Maker line, Spec Card, a disclosed 60-day trial slot</small></span></div>
          <div><i>4</i><span><b>First read at D+14</b><small>Paid 7 days after each delivery</small></span></div>
        </div>
        <button class="btn block lg mt-16" id="b-done">Done</button>`;
      FD.openModal(`<div class="mh"><div><div class="eyebrow">Bid on this card</div></div><button class="x" data-close aria-label="Close">${I('x')}</button></div>
        <div class="mb">${b.step < 4 ? `<div class="stepper">${[1, 2, 3].map(k => `<span class="${k <= b.step ? 'on' : ''}"></span>`).join('')}</div>` : ''}${body}</div>`, m => {
        $$('[data-c]', m).forEach(x => x.onchange = () => { b.checks[x.dataset.c] = x.checked; $('#b-next', m).disabled = !c.chips.every((_, i) => b.checks[i]); });
        const q = $('#b-qty', m), p = $('#b-price', m);
        const live = () => { b.qty = +q.value; b.price = +p.value || 0; const s2 = FD.settle(b.price, c.cost, 5), k = Math.round(b.qty * .95); $('#b-qty-out', m).textContent = b.qty + ' ' + c.unit; $('#b-keep', m).textContent = inr(s2.keep); $('#b-tot', m).textContent = inr(s2.keep * k); };
        q && q.addEventListener('input', live); p && p.addEventListener('input', live);
        const nx = $('#b-next', m); nx && (nx.onclick = () => { b.step++; paint(); });
        const bk = $('#b-back', m); bk && (bk.onclick = () => { b.step--; paint(); });
        const sb = $('#b-submit', m); sb && (sb.onclick = () => { S().bid = { card: c.id, qty: b.qty, price: b.price }; FD.save(); b.step = 4; paint(); });
        const dn = $('#b-done', m); dn && (dn.onclick = () => { FD.closeOverlays(); if (FD.current === 'factory' && !FD.tour.active) FD.refresh(); });
      });
    };
    paint();
  };

  function sellChart(day) {
    const pts = [0, 7, 14, 21, 30, 45, 60, 75, 90].map(d => {
      let v = 0;
      if (d >= 14) v = FD.read(KALPANA, d >= 90 ? 90 : d >= 60 ? 60 : d >= 30 ? 30 : 14).sold;
      if (d > 14 && d < 30) v = Math.round(58 + (78 - 58) * (d - 14) / 16);
      if (d > 30 && d < 60) v = Math.round(78 + (100 - 78) * (d - 30) / 30);
      if (d < 14) v = Math.round(58 * d / 14 * .9);
      return { d, v };
    });
    const W = 520, H = 200, L = 30, R = 28, T = 16, B = 28, x = d => L + d / 90 * (W - L - R), y = v => T + (100 - v) / 100 * (H - T - B);
    const shown = pts.filter(p => p.d <= day);
    const path = shown.map((p, i) => (i ? 'L' : 'M') + x(p.d) + ' ' + y(p.v)).join(' ');
    const area = path + ` L${x(shown[shown.length - 1].d)} ${y(0)} L${x(0)} ${y(0)} Z`;
    const last = shown[shown.length - 1];
    return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Sell-through of the pilot batch">
      <defs><linearGradient id="sg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#9F2089" stop-opacity=".25"/><stop offset="1" stop-color="#9F2089" stop-opacity="0"/></linearGradient></defs>
      ${[0, 50, 100].map(v => `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="#ECEAF1"/><text x="${L - 6}" y="${y(v) + 4}" font-size="12" text-anchor="end" fill="#8B8BA3" font-weight="700">${v}</text>`).join('')}
      <line x1="${x(30)}" x2="${x(30)}" y1="${T}" y2="${y(0)}" stroke="#F43397" stroke-dasharray="3 3"/><text x="${x(30) + 4}" y="${T + 10}" font-size="12" fill="#F43397" font-weight="800">D+30 gate · 50%</text>
      <line x1="${x(30) - 6}" x2="${x(30) + 6}" y1="${y(50)}" y2="${y(50)}" stroke="#F43397" stroke-width="2"/>
      ${[14, 30, 60, 90].map(d => `<text x="${x(d)}" y="${H - 6}" font-size="12" text-anchor="middle" fill="#8B8BA3" font-weight="700">D+${d}</text>`).join('')}
      <path d="${area}" fill="url(#sg)"/><path d="${path}" fill="none" stroke="#9F2089" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
      <circle cx="${x(last.d)}" cy="${y(last.v)}" r="6" fill="#fff" stroke="#9F2089" stroke-width="3"/>
    </svg>`;
  }

  function readTiles(r) {
    const fl = c => c ? 'flag' : '';
    return `<div class="reads">
      <div class="${fl(r.impr < r.slot * .9)}"><b class="num">${r.impr.toLocaleString('en-IN')}</b><small>impressions · slot ${r.slot.toLocaleString('en-IN')}</small></div>
      <div class="${fl(r.conv < FD.BENCH)}"><b class="num">${r.conv}%</b><small>kept conversion · benchmark ${FD.BENCH}%</small></div>
      <div class="${fl(r.sla < 95)}"><b class="num">${r.sla}%</b><small>on-time dispatch · ${r.hub ? 'Hub-packed' : 'factory-packed'}</small></div>
      <div class="${fl(r.ret > 6)}"><b class="num">${r.ret}%</b><small>returns · ≤4 target · 12 stop</small></div>
      <div class="${fl(r.rto > FD.RTO_MED)}"><b class="num">${r.rto}%</b><small>RTO · median ${FD.RTO_MED}%</small></div>
      <div class="${fl(r.contrib < 0)}"><b class="num">${r.contrib < 0 ? '−' : '+'}₹${Math.abs(r.contrib)}</b><small>contribution per kept unit</small></div>
    </div>`;
  }

  function batchTab() {
    const d = S().day, r = FD.read(KALPANA, d), j = FD.judge(r);
    const offer = d >= 30 && r.sold >= 50 && j.s === 'ok';
    const kept = Math.round(r.sold * (1 - r.ret / 100)), recv = FD.settle(345, 218, 5).recv;
    return `
      <div class="page-head"><div><div class="eyebrow">My Pilot Batch</div><h1>Double bedsheet set · 100 sets at ₹345</h1><p>Live since 12 Oct. Reads at D+14, 30 and 60 decide reorder, fix or stop, by rule.</p></div>${daySeg('fday')}</div>
      <div class="grid split" style="--cols:minmax(0,1.3fr) minmax(0,1fr)">
        <div class="card pad">
          <div class="row between"><div><div class="xs faint" style="font-weight:800">SOLD THROUGH</div><div style="font-size:34px;font-weight:900" class="num">${r.sold}<span class="faint" style="font-size:18px"> / 100</span></div></div><span class="pill ${j.s}">${j.label}</span></div>
          <div class="mt-12">${sellChart(d)}</div>
        </div>
        <div class="card pad">
          <div class="xs faint" style="font-weight:800">PAYOUTS · 7 DAYS AFTER DELIVERY</div>
          <div style="font-size:34px;font-weight:900;color:var(--green)" class="num">${inr(kept * recv)}</div>
          <p class="small muted">${kept} kept sets × ${inr(recv)} received. Against 15–60 days of credit and bad debt on wholesale.</p>
          <div class="divider"></div>
          <div class="xs faint" style="font-weight:800">RETURN CODES SENT TO YOUR FLOOR</div>
          <div class="chips mt-8"><span class="pill warn plain">colour bleed × 2</span><span class="pill warn plain">size short × 1</span></div>
        </div>
      </div>
      ${offer || S().replenished ? `
      <div class="card pad mt-24" id="replen" style="background:var(--grad);border:0;color:#fff">
        ${S().replenished ? `<div class="row between"><div class="row" style="flex-wrap:nowrap"><span style="width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,.2);display:grid;place-items:center">${I('check', 26, 3)}</span><div><h3 style="color:#fff">Second batch placed · 150 sets on your own money</h3><p style="color:rgba(255,255,255,.85)" class="small">You are now Replenishing. This is the north star the programme counts.</p></div></div><span class="pill plain" style="background:#fff;color:var(--m-primary)">Replenishing</span></div>`
        : `<div class="row between"><div><div class="eyebrow" style="color:#FFD3EA">Replenishment offer</div><h3 style="color:#fff;font-size:20px;margin-top:4px">Your D+${d} read clears the gate. Make a second batch?</h3><p style="color:rgba(255,255,255,.85)" class="small mt-4">${r.sold}% sold through with positive contribution. The decision and the money are yours; Meesho funds nothing.</p></div><div class="row"><button class="btn outline" style="color:#fff;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.6);background:transparent" id="rep-no">Not now</button><button class="btn white" id="rep-yes">Place 150 sets</button></div></div>`}
      </div>` : `<div class="card pad-sm mt-24 row" style="background:var(--m-lilac-50);border-color:var(--m-lilac-200)">${I('clock', 18)}<span class="small"><b>Next read at D+30.</b> If sell-through passes 50% with positive contribution, a replenishment offer appears here. Switch the read to D+30 above to see it.</span></div>`}
      <div class="card pad mt-24"><div class="row between"><h3 style="font-size:18px">D+${d} read</h3><span class="xs faint">Status is computed by rule; no one sets it by hand</span></div>
      <div class="mt-16">${readTiles(r)}</div>
      <div class="action ${j.s} mt-16"><b>Automatic action</b><p>${j.action}</p><div class="h">A human looks only if: ${j.human}</div></div></div>`;
  }

  function verifyTab() {
    return `
      <div class="page-head"><div><div class="eyebrow">Get verified</div><h1>Three gates, about 10 days, no cash</h1><p>Kalpana Textiles is already Verified. This replays what a new applicant sees.</p></div></div>
      <div class="grid split" style="--cols:minmax(0,1.2fr) minmax(0,.8fr)">
        <div class="card pad" id="g0">
          <div class="row between"><div><span class="pill brand plain">Gate 0 · documents</span><h3 class="mt-8" style="font-size:18px">Free, checked by API in 48 hours</h3></div></div>
          <div class="grid mt-16" style="grid-template-columns:1fr 1fr;gap:12px">
            <div class="field"><label for="v-name">Factory name</label><input class="input" id="v-name" value="Kalpana Textiles"></div>
            <div class="field"><label for="v-udyam">Udyam registration</label><input class="input" id="v-udyam" value="UDYAM-HR-12-0034567"></div>
            <div class="field"><label for="v-gst">GSTIN</label><input class="input" id="v-gst" value="06AAKFK4821M1Z3"></div>
            <div class="field"><label for="v-power">Industrial power connection</label><input class="input" id="v-power" placeholder="Optional"></div>
          </div>
          <div class="field mt-16"><label>Floor video</label>
            <button id="v-video" style="width:100%;border:2px dashed var(--line-2);border-radius:14px;padding:20px;display:flex;gap:14px;align-items:center;text-align:left">
              <span style="width:44px;height:44px;border-radius:12px;background:var(--m-lilac-50);color:var(--m-primary);display:grid;place-items:center">${I('upload')}</span>
              <span><b class="small">Record a 20–30 second walk-through of your floor</b><small class="xs muted" style="display:block">Geotagged. Proves you make, not just pack.</small></span></button></div>
          <button class="btn lg block mt-24" id="v-submit" disabled>Submit for Gate 0</button>
          <div id="v-checks" class="mt-16"></div>
        </div>
        <div class="stack gap-16">
          <div class="card pad"><b>Why these gates</b><p class="small muted mt-8">Legal Metrology lets a brand owner call itself a manufacturer, so the declaration proves nothing. A geotagged floor video, one manufacturing registration, then a Hub visit, does.</p></div>
          <div class="card pad"><span class="pill grey plain">Gate 1 · the visit</span><p class="small mt-8"><b>₹2,000–3,000</b>, refunded as shipping credit after 100 delivered units. Screens out rented-label "factories".</p></div>
          <div class="card pad"><span class="pill grey plain">Gate 2 · performance</span><p class="small mt-8">Tiers move on evidence only, with automatic demotion. Screens out factories that list and wait.</p></div>
        </div>
      </div>`;
  }

  FD.views.factory = {
    render() {
      const tab = S().ftab, c = card();
      const nav = [['cards', 'card', 'Demand Cards', FD.cards.length], ['batch', 'batch', 'My Pilot Batch'], ['verify', 'shield', 'Get verified']];
      let main = '';
      if (tab === 'cards') main = `
        <div class="page-head"><div><div class="eyebrow">Supplier Panel · Factory Partner</div><h1>Open Demand Cards in Panipat</h1><p>Ratios from all Meesho orders in each category. Any Verified factory in the cluster can bid.</p></div><span class="pill ok">Verified · Gate 1 passed 12 Oct</span></div>
        ${journey()}
        <div class="grid split mt-24" style="--cols:minmax(0,.75fr) minmax(0,1.25fr);align-items:start">
          <div class="dlist" id="dlist">${FD.cards.map(x => `<button class="dl-item" data-id="${x.id}" aria-selected="${x.id === c.id}">
            <div class="t"><b>${x.name}</b><span class="pill ${x.room === 'High' ? 'ok' : x.room === 'Medium' ? 'warn' : 'grey'} plain">Room ${x.room.toLowerCase()}</span></div>
            <div class="m"><span>${Math.round(x.share * 100)}% of orders</span><span>${{ up: '▲ rising', down: '▼ falling', flat: '▬ flat' }[x.trend]}</span><span>${x.status}</span></div></button>`).join('')}
            <p class="xs faint" style="padding:4px 4px 0">A card closes once 3–5 batches cover its gap, so one spec is never flooded.</p>
          </div>
          ${demandCard()}
        </div>`;
      if (tab === 'batch') main = batchTab();
      if (tab === 'verify') main = verifyTab();
      return `<div class="panel">
        <aside class="side">
          <div class="card who"><div class="av">KT</div><b>Kalpana Textiles</b><small>Panipat · Udyam NIC 13921 · GST HR</small></div>
          <nav class="card snav" aria-label="Supplier Panel">${nav.map(n => `<button data-tab="${n[0]}" aria-current="${tab === n[0]}">${I(n[1], 18)} ${n[2]}${n[3] ? `<span class="badge">${n[3]}</span>` : ''}</button>`).join('')}</nav>
          <div class="card pad-sm"><div class="xs faint" style="font-weight:800">PAYOUT</div><b style="font-size:20px">7 days</b><p class="xs muted">after each delivery · 0% commission</p></div>
        </aside>
        <div>${main}</div></div>`;
    },
    mount(root) {
      $$('[data-tab]', root).forEach(b => b.onclick = () => { S().ftab = b.dataset.tab; FD.save(); FD.route(); });
      $$('#dlist [data-id]', root).forEach(b => b.onclick = () => { S().card = b.dataset.id; FD.save(); FD.refresh(); });
      $$('#dcard [data-l]', root).forEach(b => b.onclick = () => { S().lang = b.dataset.l; FD.save(); const dc = $('#dcard', root); dc.outerHTML = demandCard(); FD.views.factory.mount(root); });
      const bc = $('#btn-calc', root); bc && (bc.onclick = () => FD.openCalc());
      const bb = $('#btn-bid', root); bb && (bb.onclick = () => FD.openBid());
      bindDaySeg(root, 'fday');
      const ry = $('#rep-yes', root); ry && (ry.onclick = () => { S().replenished = true; FD.save(); FD.refresh(); FD.toast('Second batch placed · you are now Replenishing', 'ok'); });
      const rn = $('#rep-no', root); rn && (rn.onclick = () => FD.toast('Offer stays open until the D+60 read'));
      // Gate 0 flow
      const vv = $('#v-video', root);
      if (vv) {
        let up = false;
        vv.onclick = () => { up = true; vv.style.borderStyle = 'solid'; vv.style.borderColor = 'var(--green)'; vv.innerHTML = `<span style="width:44px;height:44px;border-radius:12px;background:var(--green-50);color:var(--green);display:grid;place-items:center">${I('check', 22, 3)}</span><span><b class="small">floor-walkthrough.mp4 · 24 s</b><small class="xs muted" style="display:block">Geotagged 29.39°N, 76.97°E · Sector 29, Panipat</small></span>`; $('#v-submit', root).disabled = false; };
        $('#v-submit', root).onclick = () => {
          if (!up) return;
          $('#v-submit', root).disabled = true; $('#v-submit', root).textContent = 'Checking…';
          const checks = ['Udyam NIC 13921: weaving and finishing of textiles (manufacturing)', 'GST principal place matches the Udyam address', 'Video geotag within 200 m of the registered address', 'Not on the reseller or importer list'];
          const box = $('#v-checks', root); box.innerHTML = '<div class="timeline"></div>';
          checks.forEach((c, i) => setTimeout(() => {
            box.firstChild.insertAdjacentHTML('beforeend', `<div class="done" style="animation:viewIn .3s"><i>${I('check', 12, 3)}</i><span><b>${c}</b><small>Checked by API</small></span></div>`);
            if (i === checks.length - 1) setTimeout(() => {
              box.insertAdjacentHTML('beforeend', `<div class="verdict ok mt-8"><span class="pill ok">Gate 0 passed</span><span>Book the Gate 1 Hub visit. Fee ₹2,500, refunded as shipping credit after 100 delivered units.</span></div>
                <div class="chips mt-12" id="slots">${['Thu 23 Oct · 11:00', 'Fri 24 Oct · 15:00', 'Sat 25 Oct · 10:00'].map(s => `<button class="chip" style="cursor:pointer">${s}</button>`).join('')}</div>`);
              $('#v-submit', root).textContent = 'Gate 0 passed';
              $$('#slots button', root).forEach(s => s.onclick = () => { $$('#slots button', root).forEach(x => { x.style.background = ''; x.style.color = ''; }); s.style.background = 'var(--m-primary)'; s.style.color = '#fff'; FD.toast('Gate 1 visit booked · ' + s.textContent, 'ok'); });
            }, 300);
          }, 450 * (i + 1)));
        };
      }
    }
  };

  /* =====================================================================
     CLUSTER HUB
     ===================================================================== */
  FD.views.hub = {
    render() {
      const st = S(), H = FD.hub, tab = st.htab;
      const packedN = H.packing.filter(p => st.hubPacked[p.f]).reduce((a, p) => a + p.n, 0);
      const total = H.packing.reduce((a, p) => a + p.n, 0);
      const samplesLeft = H.samples.filter(s => !st.hubSamples[s.id]).length;
      const returnsLeft = H.returns.filter(r => !st.hubReturns[r.id]).length;
      let body = '';
      if (tab === 'samples') {
        const sel = H.samples.find(s => s.id === st._sample) || H.samples[0];
        const res = st.hubSamples[sel.id];
        body = `<div class="grid split" style="--cols:minmax(0,.8fr) minmax(0,1.2fr);gap:0">
          <div class="list" style="border-right:1px solid var(--line)">${H.samples.map(s => { const r = st.hubSamples[s.id]; return `<button class="li" data-s="${s.id}" aria-selected="${s.id === sel.id}"><span class="ic">${I('search', 18)}</span><span><b>${s.f}</b><small>${s.card}</small></span>${r ? `<span class="pill ${r === 'pass' ? 'ok' : 'bad'} plain">${r === 'pass' ? 'Passed' : 'Sent back'}</span>` : '<span class="pill grey plain">To check</span>'}</button>`; }).join('')}</div>
          <div style="padding:20px 22px">
            <div class="row between"><div><b style="font-size:16px">${sel.f}</b><div class="small muted">Sample vs the ${sel.card} card spec</div></div></div>
            <div class="mt-16"><div class="cmp-row h"><span>Check</span><span>Card asks</span><span>Measured</span><span></span></div>
            ${sel.checks.map((c, i) => { const ok = !(sel.pass === false && i < 2 && c[1] !== c[2]); return `<div class="cmp-row"><span>${c[0]}</span><span class="muted">${c[1]}</span><b>${c[2]}</b><span class="${ok ? 'okc' : 'badc'}">${ok ? '✓' : '✕'}</span></div>`; }).join('')}</div>
            ${res ? `<div class="verdict ${res === 'pass' ? 'ok' : 'bad'} mt-16">${res === 'pass' ? '<span class="pill ok">Passed</span><span>Spec Card published on the listing with today\'s date. The factory\'s listing can go live.</span>' : '<span class="pill bad">Sent back</span><span>Measured below the card spec. The factory can resubmit a sample; there is no listing until it passes.</span>'}</div>`
            : `<div class="row mt-16" style="flex-wrap:nowrap"><button class="btn outline" style="flex:1" data-res="fail">Send back</button><button class="btn" style="flex:1" data-res="pass">Pass · publish Spec Card</button></div>`}
          </div></div>`;
      }
      if (tab === 'packing') body = `
        <table class="tbl"><thead><tr><th>Factory</th><th>SKU</th><th class="r">Parcels</th><th class="r"></th></tr></thead><tbody>
        ${H.packing.map(p => `<tr style="cursor:default"><td><b>${p.f}</b></td><td class="muted">${p.sku}</td><td class="r num"><b>${p.n}</b></td><td class="r">${st.hubPacked[p.f] ? '<span class="pill ok plain">Packed</span>' : `<button class="btn sm outline" data-pack="${p.f}">Mark packed</button>`}</td></tr>`).join('')}
        </tbody></table>
        <div class="row between" style="padding:16px 18px;border-top:1px solid var(--line)"><span class="small"><b class="num">${packedN} / ${total}</b> parcels packed for today's pickup</span><div class="row"><button class="btn sm ghost" id="pack-all">Pack all</button><button class="btn sm" id="manifest">${I('truck', 16)} Pickup manifest</button></div></div>`;
      if (tab === 'returns') body = `<div class="list">${H.returns.map(r => { const g = st.hubReturns[r.id]; return `
        <div class="li" style="grid-template-columns:auto 1fr;align-items:start"><span class="ic">${I('return', 18)}</span>
          <div><div class="row between"><span><b>${r.f}</b><small>${r.sku} · ${r.why}</small></span>${g ? `<span class="pill ok plain">Code sent · ${g.code}</span>` : ''}</div>
          ${g ? '' : `<div class="xs faint mt-12" style="font-weight:800">DEFECT CODE</div><div class="codes mt-4" data-codes="${r.id}">${H.codes.map(c => `<button data-code="${c}" aria-pressed="false">${c}</button>`).join('')}</div>
          <div class="xs faint mt-12" style="font-weight:800">GRADE</div><div class="codes mt-4" data-grades="${r.id}">${H.grades.map(c => `<button data-grade="${c}" aria-pressed="false">${c}</button>`).join('')}</div>
          <button class="btn sm mt-12" data-send="${r.id}" disabled>Send code to factory</button>`}</div></div>`; }).join('')}</div>`;

      return `
      <div class="page-head"><div><div class="eyebrow">Cluster Hub · Panipat</div><h1>Today at the Hub</h1><p>An independent operator paid per task at a published rate card. It never takes title and never sets a price.</p></div><span class="pill brand">${I('truck', 14)} One Valmo pickup · 16:30</span></div>
      <div class="kpis">
        <div class="card kpi"><div class="l">Parcels today</div><div class="v num">${total}</div><div class="gauge"><i style="width:${Math.min(100, total / 600 * 100)}%"></i><span class="be" style="left:${400 / 600 * 100}%"><span>break-even 400</span></span></div></div>
        <div class="card kpi"><div class="l">Spec samples</div><div class="v num">${samplesLeft}</div><div class="s">to check against the card</div></div>
        <div class="card kpi"><div class="l">Returns</div><div class="v num">${returnsLeft}</div><div class="s">to grade · codes go to the floor</div></div>
        <div class="card kpi"><div class="l">Pickup</div><div class="v" style="font-size:24px">${st.manifest ? 'Manifest ready' : 'Packing'}</div><div class="s">7 factories, one truck</div></div>
      </div>
      <div class="grid split mt-24" style="--cols:minmax(0,1.6fr) minmax(0,.7fr);align-items:start">
        <div class="card" id="hub-main" style="overflow:hidden">
          <div class="row between" style="padding:16px 18px;border-bottom:1px solid var(--line)"><div class="seg" id="htabs">${[['samples', 'Spec samples', samplesLeft], ['packing', 'Packing', H.packing.length], ['returns', 'Returns', returnsLeft]].map(t => `<button data-h="${t[0]}" aria-pressed="${tab === t[0]}">${t[1]} <span class="faint">${t[2]}</span></button>`).join('')}</div></div>
          ${body}
        </div>
        <div class="stack gap-16">
          <div class="card pad"><b>Published rate card</b><div class="ratecard mt-8"><div><span>Packing a parcel</span><b>₹10</b></div><div><span>Grading a return</span><b>₹12</b></div><div><span>Gate 1 verification visit</span><b>₹2,500</b></div><div><span>Storage</span><b>none</b></div></div><p class="xs faint mt-8">One price for every seller, traders included. Stock stays on the factory's shelf; the Hub holds only the day's staged units.</p></div>
          <div class="card pad"><b>Scale rule</b><p class="small muted mt-8">Break-even at about 400 parcels a day (about 6 replenishing factories). A second site opens at 1,500 a day, not at a factory count.</p></div>
        </div>
      </div>`;
    },
    mount(root) {
      const st = S(), H = FD.hub;
      $$('#htabs button', root).forEach(b => b.onclick = () => { st.htab = b.dataset.h; FD.save(); FD.refresh(); });
      $$('[data-s]', root).forEach(b => b.onclick = () => { st._sample = b.dataset.s; FD.refresh(); });
      $$('[data-res]', root).forEach(b => b.onclick = () => { const id = st._sample || H.samples[0].id; st.hubSamples[id] = b.dataset.res; FD.save(); FD.refresh(); FD.toast(b.dataset.res === 'pass' ? 'Spec Card published · factory notified' : 'Sample sent back with measurements', b.dataset.res === 'pass' ? 'ok' : ''); });
      $$('[data-pack]', root).forEach(b => b.onclick = () => { st.hubPacked[b.dataset.pack] = true; FD.save(); FD.refresh(); });
      const pa = $('#pack-all', root); pa && (pa.onclick = () => { H.packing.forEach(p => st.hubPacked[p.f] = true); FD.save(); FD.refresh(); });
      const mf = $('#manifest', root); mf && (mf.onclick = () => {
        const total = H.packing.reduce((a, p) => a + p.n, 0);
        st.manifest = true; FD.save();
        FD.openModal(`<div class="mh"><div><div class="eyebrow">Pickup manifest · today 16:30</div><h3 class="mt-4">One Valmo pickup for the whole cluster</h3></div><button class="x" data-close aria-label="Close">${I('x')}</button></div>
          <div class="mb"><table class="tbl"><thead><tr><th>Factory</th><th class="r">Parcels</th></tr></thead><tbody>${H.packing.map(p => `<tr style="cursor:default"><td>${p.f}</td><td class="r num">${p.n}</td></tr>`).join('')}<tr style="cursor:default"><td><b>Total</b></td><td class="r num"><b>${total}</b></td></tr></tbody></table>
          <div class="verdict ok mt-16">${I('truck', 18)}<span>Seven separate pickups become one. Consolidation is gated at ≥₹5 a parcel saved; the pickup rate is ₹5 (₹6 with GST).</span></div>
          <button class="btn block lg mt-16" data-close>Hand over to Valmo</button></div>`);
        $$('[data-close]', $('#modal')).forEach(b => b.addEventListener('click', () => { if (FD.current === 'hub') FD.refresh(); }));
      });
      // returns grading
      const pick = {};
      $$('[data-codes]', root).forEach(g => $$('button', g).forEach(b => b.onclick = () => { $$('button', g).forEach(x => x.setAttribute('aria-pressed', x === b)); (pick[g.dataset.codes] = pick[g.dataset.codes] || {}).code = b.dataset.code; upd(g.dataset.codes); }));
      $$('[data-grades]', root).forEach(g => $$('button', g).forEach(b => b.onclick = () => { $$('button', g).forEach(x => x.setAttribute('aria-pressed', x === b)); (pick[g.dataset.grades] = pick[g.dataset.grades] || {}).grade = b.dataset.grade; upd(g.dataset.grades); }));
      const upd = id => { const b = $(`[data-send="${id}"]`, root); b.disabled = !(pick[id] && pick[id].code && pick[id].grade); };
      $$('[data-send]', root).forEach(b => b.onclick = () => { st.hubReturns[b.dataset.send] = pick[b.dataset.send]; FD.save(); FD.refresh(); FD.toast('Defect code sent to the factory floor', 'ok'); });
    }
  };

  /* =====================================================================
     BUYER APP
     ===================================================================== */
  const bedArt = `<svg viewBox="0 0 336 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><pattern id="flo" width="34" height="34" patternUnits="userSpaceOnUse"><rect width="34" height="34" fill="#F6D9EA"/><circle cx="9" cy="9" r="5" fill="#E05FA8"/><circle cx="9" cy="9" r="2" fill="#FFE07A"/><circle cx="26" cy="25" r="4" fill="#B2479B"/><circle cx="26" cy="25" r="1.6" fill="#FFE07A"/><path d="M14 22c3-2 5-2 7 0" stroke="#5FA27A" stroke-width="1.6" fill="none"/></pattern>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBEFF5"/><stop offset="1" stop-color="#F3E1EC"/></linearGradient></defs>
    <rect width="336" height="300" fill="url(#wall)"/><rect y="236" width="336" height="64" fill="#E9D3C2"/>
    <rect x="34" y="70" width="268" height="110" rx="14" fill="#7A3B5C"/>
    <rect x="22" y="150" width="292" height="96" rx="12" fill="url(#flo)"/>
    <path d="M22 200h292v34a12 12 0 01-12 12H34a12 12 0 01-12-12z" fill="#000" opacity=".06"/>
    <rect x="48" y="128" width="104" height="42" rx="18" fill="#FCEAF3" stroke="#E7B9D3"/><rect x="184" y="128" width="104" height="42" rx="18" fill="#FCEAF3" stroke="#E7B9D3"/>
    <rect x="16" y="246" width="18" height="20" fill="#5A2B44"/><rect x="302" y="246" width="18" height="20" fill="#5A2B44"/>
  </svg>`;

  FD.views.buyer = {
    render() {
      const fd = S().fdView;
      const screen = `
        <div class="screen"><div class="notch"></div>
          <div class="sbar"><span>9:41</span><span>●●● ▮</span></div>
          <div class="mbar">${I('back', 20)}<div class="s">${I('search', 14)} double bedsheet cotton</div>${I('heart', 20)}${I('cart', 20)}</div>
          <div class="pscroll">
            <div class="pimg">${bedArt}<div class="dotsnav"><i></i><i></i><i></i><i></i></div></div>
            <div class="pbody">
              <div class="ptitle">${fd ? 'Cotton Double Bedsheet, 240 TC, with 2 Pillow Covers' : 'Elegant Bedsheets'} ${fd ? '' : '<span class="faint">+3 More</span>'}</div>
              <div class="pprice ${fd ? 'mark' : ''}" ${fd ? 'data-n="3"' : ''}><b class="num">${fd ? '₹345' : '₹317'}</b>${fd ? '<span class="allin">All-in · free delivery</span>' : '<span class="del">+ ₹64 delivery at checkout</span>'}</div>
              ${fd ? `<div class="l4l">${I('check', 14, 3)} ₹36 less than the ₹381 paid today, like for like</div>` : `<div class="row mt-8" style="gap:8px"><span class="rating">4.0 ★</span><span class="xs muted">22,550 Ratings</span></div>`}
              ${fd ? `<div class="maker mark" data-n="1"><span class="fi">${I('factory', 18)}</span><span><b>Made and sold by Kalpana Textiles</b><small>Panipat, Haryana · factory visited by the Hub · floor clip 24 s</small></span></div>
                <div class="speccard mark" data-n="2"><div class="h"><span>Spec Card</span><span class="faint">Hub-checked · 12 Oct</span></div>
                <div class="g"><div><small>Thread count</small><b>240 TC</b></div><div><small>Size</small><b>90 × 100 in</b></div><div><small>Pillow covers</small><b>2</b></div><div><small>Fabric</small><b>100% cotton</b></div><div><small>Colour-fastness</small><b>Passed wash test</b></div><div><small>Returns, this spec</small><b>Below median</b></div></div></div>
                <div class="xs faint mt-12">New listing · no ratings yet · pay now and skip COD</div>`
            : `<div class="missing"><b>Not shown:</b> thread count, GSM, size check, who made it, where.</div>
                <div class="xs muted mt-12">Sold by <b>Elegant Home Store</b> · a reseller</div>
                <div class="xs faint mt-8">A star block whose "Reviews" is really the ratings count. Buyers cannot compare like for like, so competition cuts spec.</div>`}
            </div>
          </div>
          <div class="pcta"><button class="btn outline">${I('cart', 16)} Add to Cart</button><button class="btn">Buy Now</button></div>
        </div>`;
      const co = [['Maker line', 'A fact about the seller of record, not a Meesho endorsement. It stays clear of r.5(6)(b) of the E-Commerce Amendment Rules 2026.'], ['Spec Card', 'Chips come from the Hub\'s sample check against the Demand Card spec, dated. It answers "will it match the photo?"'], ['All-in price first', 'Drip pricing is a listed dark pattern. The like-for-like line compares identical spec and destination.']];
      return `<div class="grid split" style="--cols:minmax(0,.9fr) minmax(0,1.1fr);align-items:center;gap:48px">
        <div class="phone-wrap"><div class="phone" id="phone">${screen}</div></div>
        <div>
          <div class="eyebrow">Buyer app · product page</div>
          <h1 style="font-size:32px;margin-top:8px">The buyer sees a maker and a spec, never a badge</h1>
          <p class="muted mt-12">Same bedsheet set. Toggle between the listing observed on 29 Sep 2026 and the same product under Factory Direct.</p>
          <div class="seg brand mt-24" id="bseg"><button data-v="0" aria-pressed="${!fd}">Today</button><button data-v="1" aria-pressed="${fd}">With Factory Direct</button></div>
          <div class="mt-16">${co.map((c, i) => `<div class="callout ${fd ? '' : 'dim'}"><i>${i + 1}</i><div><b>${c[0]}</b><p>${c[1]}</p></div></div>`).join('')}</div>
          <div class="quote mt-24"><q>Checked hai toh COD chhod sakta hoon.</q><small>A COD buyer in our interviews: "If it's checked, I can skip cash on delivery."</small>
            <div class="statline"><div><b>15 / 20</b><small>buyers chose this listing</small></div><div><b>7 / 14</b><small>COD buyers would prepay</small></div><div><b>0</b><small>badges or ranking boosts</small></div></div></div>
        </div></div>`;
    },
    mount(root) { $$('#bseg button', root).forEach(b => b.onclick = () => { S().fdView = b.dataset.v === '1'; FD.save(); FD.refresh(); }); }
  };

  /* =====================================================================
     C2M CONSOLE
     ===================================================================== */
  FD.views.console = {
    render() {
      const st = S(), d = st.day;
      const rows = FD.pilot.map(p => { const r = FD.read(p, d); return { p, r, j: FD.judge(r) }; });
      const n = s => rows.filter(x => x.j.s === s).length;
      const reordered = rows.filter(x => x.r.reordered).length;
      const avgSold = Math.round(rows.reduce((a, x) => a + x.r.sold, 0) / rows.length);
      const rets = rows.map(x => x.r.ret).sort((a, b) => a - b); const medRet = ((rets[14] + rets[15]) / 2).toFixed(1);
      const gate = d >= 90 ? 60 : 50;
      const f = st._filter || 'all';
      const list = rows.filter(x => f === 'all' || x.j.s === f);
      const sel = rows.find(x => x.p.id === (st._sel ?? 0)) || rows[0];
      const at30 = FD.pilot.filter(p => FD.read(p, 30).sold >= 50).length;
      const gates = [
        { t: '21 of 30 cards carry a Verified-factory bid', w: 'D+14', v: '24 / 30', s: 'pass' },
        { t: '40% of approached apply · 60% pass Gates 0+1', w: 'Day 14', v: '40% · 64%', s: 'pass' },
        { t: '≥8% like-for-like saving, positive contribution', w: 'D+30', v: d >= 30 ? '9.4%' : 'pending', s: d >= 30 ? 'pass' : '' },
        { t: '50% sold through at D+30 · Hub SLA 95%', w: 'D+60', v: d >= 30 ? `${Math.round(at30 / 30 * 100)}% · 96%` : 'pending', s: d >= 30 ? (at30 >= 15 ? 'pass' : 'fail') : '' },
        { t: '50% reorder by D+60 · 60% by D+90', w: 'D+90', v: d >= 60 ? `${Math.round(reordered / 30 * 100)}%` : 'pending', s: d >= 60 ? (reordered / 30 * 100 >= gate ? 'pass' : 'fail') : '' }
      ];
      const control = { 14: 0, 30: 0, 60: 3, 90: 4 }[d];
      const ctlSold = { 14: 24, 30: 37, 60: 55, 90: 66 }[d];
      const sr = sel.r, sj = sel.j, fired = sj.k.startsWith('sla') ? 'sla' : sj.k;
      return `
      <div class="page-head"><div><div class="eyebrow">C2M Cluster Team · Panipat pilot</div><h1>30 Pilot Batches</h1><p>30 Demand Cards, 30 factories and 30 matched controls on business as usual. Every status is computed from the reads.</p></div>
        <div class="stack gap-4" style="align-items:flex-end"><span class="xs faint" style="font-weight:800">READ</span>${daySeg('cday')}</div></div>
      <div class="kpis" id="con-kpis">
        <div class="card kpi hero-k"><div class="l">North star · second batch on own money</div><div class="v num">${reordered} <span style="font-size:18px;opacity:.7">/ 30</span></div><div class="prog"><i style="width:${reordered / 30 * 100}%"></i><span class="gate" style="left:${gate}%"></span></div><div class="s mt-8">${d < 60 ? 'First reorders land after the D+30 offer' : `${Math.round(reordered / 30 * 100)}% · gate ${gate}% at D+${d >= 90 ? 90 : 60}`} · controls ${control}/30</div></div>
        <div class="card kpi"><div class="l">Avg sell-through</div><div class="v num">${avgSold}%</div><div class="prog"><i style="width:${avgSold}%"></i><span class="gate" style="left:50%"></span></div><div class="s mt-8">of the 100-unit batch · gate 50% at D+30</div></div>
        <div class="card kpi"><div class="l">Median returns</div><div class="v num">${medRet}%</div><div class="s">≤4% target · 6% review · 12% stop</div></div>
        <div class="card kpi"><div class="l">Like-for-like saving</div><div class="v num" style="color:var(--green)">9.4%</div><div class="s">₹36 on ₹381 · gate ≥8%</div></div>
      </div>
      <div class="grid g3 mt-24">
        <div class="card pad"><b>Status at D+${d}</b>
          <div class="statusbar"><i style="flex:${n('ok')};background:var(--green)"></i><i style="flex:${n('warn')};background:#F0A93B"></i><i style="flex:${n('bad')};background:var(--red)"></i></div>
          <div class="legend"><span style="--c:var(--green)">On track ${n('ok')}</span><span style="--c:#F0A93B">Auto action ${n('warn')}</span><span style="--c:var(--red)">Stop ${n('bad')}</span></div>
          <p class="xs faint mt-12">Auto actions clear by the next read: listings get completed, factory-packed SKUs move to the Hub.</p>
          <div class="divider"></div><b class="small">vs 30 matched controls</b>
          <div class="stack gap-8 mt-12">${[['Avg sell-through', avgSold, ctlSold, '%'], ['Second batch placed', reordered, control, '/30']].map(c => `<div><div class="row between xs" style="font-weight:700"><span>${c[0]}</span><span class="num"><b style="color:var(--m-primary)">${c[1]}${c[3]}</b> <span class="faint">vs ${c[2]}${c[3]}</span></span></div><div class="prog" style="margin-top:6px"><i style="width:${c[3] === '%' ? c[1] : c[1] / 30 * 100}%"></i></div><div class="prog" style="margin-top:4px;height:6px"><i style="width:${c[3] === '%' ? c[2] : c[2] / 30 * 100}%;background:var(--ink-3)"></i></div></div>`).join('')}</div></div>
        <div class="card pad" style="grid-column:span 2"><b>Pilot gates · each window ends at a stop-or-go number</b>
          <div class="gatelist mt-12">${gates.map(g => `<div class="${g.s}"><i>${g.s === 'pass' ? '✓' : g.s === 'fail' ? '✕' : '·'}</i><span><b>${g.t}</b><small>read at ${g.w}</small></span><b class="num">${g.v}</b></div>`).join('')}</div></div>
      </div>
      <div class="grid split mt-24" style="--cols:minmax(0,1.3fr) minmax(0,1fr);align-items:start">
        <div class="card" id="con-table" style="overflow:hidden">
          <div class="row between" style="padding:16px 18px"><b>Batches</b><div class="filters" id="filters">${[['all', 'All', rows.length], ['ok', 'On track', n('ok')], ['warn', 'Auto action', n('warn')], ['bad', 'Stop', n('bad')]].map(x => `<button data-f="${x[0]}" aria-pressed="${f === x[0]}">${x[1]}<span>${x[2]}</span></button>`).join('')}</div></div>
          <div class="scroll"><table class="tbl"><thead><tr><th>Factory · SKU</th><th>Sold</th><th class="r">Returns</th><th class="r">Contrib.</th><th>Status</th></tr></thead><tbody>
            ${list.map(x => `<tr data-id="${x.p.id}" tabindex="0" aria-selected="${x.p.id === sel.p.id}"><td><b>${x.p.f}</b><small>${x.p.sku}</small></td><td class="num"><span class="mini-bar"><i style="width:${x.r.sold}%"></i></span>${x.r.sold}</td><td class="r num" style="${x.r.ret > 6 ? 'color:var(--red);font-weight:800' : ''}">${x.r.ret}%</td><td class="r num" style="${x.r.contrib < 0 ? 'color:var(--red);font-weight:800' : ''}">${x.r.contrib < 0 ? '−' : '+'}₹${Math.abs(x.r.contrib)}</td><td><span class="pill ${x.r.reordered ? 'brand' : x.j.s}">${x.r.reordered ? 'Reordered' : x.j.short}</span></td></tr>`).join('')}
          </tbody></table></div>
        </div>
        <div class="stack gap-16" style="position:sticky;top:88px">
          <div class="card pad" id="con-detail">
            <div class="row between"><div><div class="eyebrow">D+${d} read</div><h3 class="mt-4" style="font-size:18px">${sel.p.f}</h3><div class="small muted">${sel.p.sku} · ${sr.sold} of 100 sold</div></div><span class="pill ${sj.s}">${sj.label}</span></div>
            <div class="mt-16">${readTiles(sr)}</div>
            <div class="action ${sj.s} mt-16"><b>Automatic action</b><p>${sj.action}</p><div class="h">A human looks only if: ${sj.human}</div></div>
            ${sr.reordered ? `<div class="verdict ok mt-12">${I('check', 16, 3)}<span>Placed a self-funded second batch at D+${sel.p.reorderDay}.</span></div>` : ''}
          </div>
          <details class="card pad rules"><summary>How status is computed · 7 rules in priority order</summary>
            <div class="mt-12">${FD.rules.map((r, i) => `<div class="rule-row ${r.k === fired ? 'fired' : ''}"><i>${i + 1}</i><span><b>${r.t}</b>${r.a}<br><span class="faint">Human: ${r.h}</span></span></div>`).join('')}</div></details>
        </div>
      </div>`;
    },
    mount(root) {
      const st = S();
      bindDaySeg(root, 'cday');
      $$('#filters button', root).forEach(b => b.onclick = () => { st._filter = b.dataset.f; FD.refresh(); });
      $$('#con-table tbody tr', root).forEach(tr => {
        const go = () => { st._sel = +tr.dataset.id; const y = window.scrollY; FD.refresh(); window.scrollTo({ top: y }); };
        tr.onclick = go; tr.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } };
      });
    }
  };
})();
