/* Factory Direct · v1 Keynote. Thirteen chapters, one live widget each.
   Numbers come from ../assets/data.js; nothing here is computed differently. */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const rs = n => '₹' + Math.round(n).toLocaleString('en-IN');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ICON = {
    box: '<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
    batch: '<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/>',
    trend: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    data: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
    card: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h6"/>',
    factory: '<path d="M3 21V10l6 4v-4l6 4V5l6 3v13z"/>',
    hub: '<circle cx="12" cy="12" r="3"/><circle cx="4" cy="6" r="2"/><circle cx="20" cy="6" r="2"/><circle cx="4" cy="18" r="2"/><circle cx="20" cy="18" r="2"/><path d="M6 7l4 3M18 7l-4 3M6 17l4-3M18 17l-4-3"/>',
    repeat: '<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 013-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 01-3 3H3"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    replay: '<path d="M3 12a9 9 0 109-9 9 9 0 00-6.4 2.6L3 8"/><path d="M3 3v5h5"/>'
  };
  const ic = (n, s = 20) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n]}</svg>`;

  /* shared state for the live widgets */
  const S = { card: 0, lang: 'en', price: 345, cost: 218, r: 5, qty: 100, bidDone: false, sample: 0, verdicts: {}, fd: true, day: 14, row: 0, nsDay: 60 };

  /* ================= slides ================= */
  const slides = [
    /* 1 · hook */
    {
      name: 'The ₹38', cls: 'hero1',
      k: 'Factory Direct · Meesho C2M',
      h: 'A bedsheet set costs <em>₹381</em> on Meesho today. ₹38 of it doesn’t need to be there.',
      p: 'Same 240 thread-count double set, like for like. Most of the gap is the trader’s chain, not the cloth.',
      w: () => `<div class="panel tag" id="hook">
        <div class="row between"><span class="lbl">What the buyer pays today · per kept set</span><button class="link row" id="replay" style="gap:6px">${ic('replay', 14)} Replay</button></div>
        <div class="price"><b class="num" id="hookp">₹381</b><span id="hookl">trader-listed, all-in</span></div>
        <div class="stackrows" id="srows"></div>
      </div>`,
      mount: el => {
        const rows = FD.waterfall.filter(s => !s.total && s.v < 0);
        const box = $('#srows', el);
        box.innerHTML = rows.map(s => `<div class="srow"><div class="bar"><i style="width:${(-s.v / 13) * 100}%"></i><span>${s.l}</span></div><b class="num">−₹${-s.v}</b></div>`).join('') +
          `<div class="srow res"><div class="bar"><i style="width:100%"></i><span>Doesn’t need to be there · ₹2 of it goes to the factory</span></div><b class="num">₹38</b></div>
           <div class="srow fin"><div class="bar"><i style="width:100%"></i><span>Buyer pays with Factory Direct, all-in</span></div><b class="num">₹345</b></div>`;
        const play = () => {
          const items = $$('.srow', box);
          items.forEach(i => i.classList.remove('in'));
          const p = $('#hookp', el), lab = $('#hookl', el); p.textContent = '₹381'; lab.textContent = 'trader-listed, all-in'; p.style.color = '';
          let cur = 381;
          items.forEach((it, i) => setTimeout(() => {
            it.classList.add('in');
            if (i < rows.length) { cur += rows[i].v; p.textContent = rs(cur); }
            if (i === items.length - 1) { p.textContent = '₹345'; p.style.color = 'var(--green)'; lab.textContent = 'with Factory Direct, all-in'; }
          }, reduced ? 0 : 350 + i * 380));
        };
        $('#replay', el).onclick = play;
        return play;
      },
      notes: 'Open on one number. A 240 thread-count double bedsheet set is ₹381 on Meesho today. ₹38 of that is trader margin, inbound freight, working capital, avoidable returns and pickup density. Factory Direct removes it: the buyer pays ₹345 all-in, and ₹2 of the saving stays with the factory.',
      src: 'Deck slide 4 · cost stack per kept unit'
    },
    /* 2 · problem */
    {
      name: 'The problem',
      k: 'Why factories stay offline',
      h: 'Factories don’t come online. The few who do <em>leave in 30 days.</em>',
      p: 'A Panipat mill sells by the truckload. Listing cold, packing singles and waiting on returns makes no sense to it.',
      w: () => `<div style="width:100%">
        <div class="barriers">
          ${[['box', 'Operational hassle', 'Singles to pack, returns to grade, a courier every day.'],
             ['batch', 'Inventory risk', 'Make stock for a channel that may not sell it.'],
             ['trend', 'Unproven demand', 'No idea what sells online, at what price.'],
             ['clock', 'Weak early scale-up', 'No orders in week one, so it quits by week four.']]
            .map(b => `<div class="bar-t"><span class="ic">${ic(b[0])}</span><h3>${b[1]}</h3><p>${b[2]}</p></div>`).join('')}
        </div>
        <div class="quote"><q>Humein demand dikhao, lekin paisa kab aayega woh bhi clear karo.</q><small>A Panipat factory owner: “Show us the demand, but also make clear when the money arrives.”</small></div>
      </div>`,
      notes: 'These are the brief’s four barriers. Every one of them is a reason a B2B maker says no on the first call, or says yes and churns inside a month. The owner’s line is the brief in one sentence: show me demand, and tell me when I get paid.',
      src: 'Brief · four barriers; owner calls in Panipat'
    },
    /* 3 · insight */
    {
      name: 'The insight',
      k: 'Flip the order',
      h: 'Meesho already knows <em>what sells.</em> Start there.',
      p: 'Product first, factory second, cluster third. Bring a proven product to its factory, not a cold catalogue to the app.',
      extra: `<div class="flip"><span>Product</span><i>→</i><span>Factory</span><i>→</i><span>Cluster</span></div>`,
      w: () => {
        const steps = [['data', 'Demand signal', 'What sells, at what price, why it returns'], ['card', 'Demand Card', 'Sent to factories that make it'], ['factory', 'Pilot Batch', '100–200 units at their price'], ['hub', 'Cluster Hub', 'Checks, packs, grades, one pickup'], ['repeat', 'Reorder', 'Second batch on own money']];
        const R = 230, cx = 300, cy = 300;
        const nodes = steps.map((s, i) => {
          const a = -Math.PI / 2 + i * 2 * Math.PI / 5;
          return `<div class="node" data-i="${i}" style="left:${cx + R * Math.cos(a)}px;top:${cy + R * Math.sin(a)}px"><div class="c">${ic(s[0], 26)}</div><b>${s[1]}</b><small>${s[2]}</small></div>`;
        }).join('');
        return `<div class="loopwrap" id="loop">
          <svg viewBox="0 0 600 600"><circle cx="300" cy="300" r="${R}" fill="none" stroke="#F1E3F3" stroke-width="3"/>
          <circle id="loopArc" cx="300" cy="300" r="${R}" fill="none" stroke="#9F2089" stroke-width="3" stroke-linecap="round" stroke-dasharray="0 ${2 * Math.PI * R}" transform="rotate(-90 300 300)" style="transition:stroke-dasharray .6s cubic-bezier(.2,.7,.2,1)"/></svg>
          ${nodes}
          <div class="loopcenter"><b>Every reorder makes the next card sharper.</b><small>Click a step</small></div>
        </div>`;
      },
      mount: el => {
        const C = 2 * Math.PI * 230;
        let i = 0, t;
        const set = n => {
          i = n;
          $$('.node', el).forEach(x => x.classList.toggle('on', +x.dataset.i === i));
          $('#loopArc', el).setAttribute('stroke-dasharray', `${C * (i / 5) + 1} ${C}`);
        };
        $$('.node', el).forEach(x => x.onclick = () => { clearInterval(t); set(+x.dataset.i); });
        return () => { clearInterval(t); set(0); if (!reduced) t = setInterval(() => { if (!el.classList.contains('on')) return clearInterval(t); set((i + 1) % 5); }, 1600); };
      },
      notes: 'Meesho already knows what sells, at what price, and why it comes back. Today a factory lists cold and waits. We flip the order: product first, factory second, cluster third. The loop closes when the factory reorders on its own money; that reorder sharpens the next card.',
      src: 'Guided demo · step 1'
    },
    /* 4 · demand card */
    {
      name: 'Demand Card', illus: true,
      k: 'What the factory sees',
      h: 'A <em>Demand Card</em>, not a forecast.',
      p: 'Shares, trend, price bands, return reasons and a reorder record, in the owner’s language. Ratios, never a promise of orders.',
      extra: `<div class="cardtabs" id="ctabs">${FD.cards.map((c, i) => `<button data-c="${i}" aria-pressed="${i === 0}">${c.name}</button>`).join('')}</div>`,
      w: () => `<div class="dc" id="dc"></div>`,
      mount: el => {
        const draw = () => {
          const c = FD.cards[S.card], hi = S.lang === 'hi', L = FD.i18n[S.lang], m = FD.settle(c.price, c.cost, 5);
          const T = (en, h) => hi ? h : en;
          const maxb = Math.max(...c.bands.map(b => b.v));
          $('#dc', el).innerHTML = `
            <div class="hd"><div><span class="lbl">${L.card} · Panipat · Oct 2026</span><h3 class="${hi ? 'hi' : ''}">${T(c.name, c.hiName)}</h3></div>
              <div class="seg" role="group" aria-label="Language"><button data-l="en" aria-pressed="${!hi}">EN</button><button data-l="hi" class="hi" aria-pressed="${hi}">हिं</button></div></div>
            <dl class="dcb ${hi ? 'hi' : ''}" style="margin:0">
              <div class="fact"><dt>${L.what}</dt><dd style="font-size:13px">${T(c.spec, c.hiSpec)}</dd></div>
              <div class="fact"><dt>${L.sells}</dt><dd><span class="track"><i style="width:${c.share * 100}%"></i></span>${T(c.shareTxt, c.hiShare)} · <span class="${c.trend === 'up' ? 'okc' : c.trend === 'down' ? 'badc' : ''}">${T(c.trendTxt, c.hiTrend)}</span></dd></div>
              <div class="fact"><dt>${L.price}</dt><dd><div class="bands" style="max-width:300px">${c.bands.map(b => `<div class="${b.v === maxb ? 'top' : ''}"><i style="height:${b.v / maxb * 30}px"></i><small>${b.l}</small></div>`).join('')}</div></dd></div>
              <div class="fact"><dt>${L.ret}</dt><dd>${T(c.returns, c.hiReturns).join(' · ')}</dd></div>
              <div class="fact"><dt>${L.room}</dt><dd><b>${T(c.room, c.hiRoom)}</b> · ${T(c.roomTxt, c.hiRoomTxt)}</dd></div>
              <div class="fact"><dt>${L.reord}</dt><dd>${c.reorder ? `<span class="dots5">${[0, 1, 2, 3, 4].map(i => `<i class="${i < c.reorder ? 'f' : ''}"></i>`).join('')}</span>${c.reorder} ${T(c.reorderTxt, c.hiReorder)}` : T(c.reorderTxt, c.hiReorder)}</dd></div>
              <div class="fact"><dt>${L.ask}</dt><dd>${T(c.ask, c.hiAsk)}</dd></div>
            </dl>
            <div style="padding:0 24px 20px" class="${hi ? 'hi' : ''}">
              <div class="dcmoney"><div><b class="num">${rs(m.recv)}</b><small>${L.recv}</small></div><div><b class="num">${rs(m.today)} <span style="font-size:14px;color:var(--ink-3)">vs ${rs(c.wholesale)}</span></b><small>${hi ? 'आज के पैसे में मुनाफ़ा, थोक के मुकाबले' : 'you keep in today’s money, vs wholesale'}</small></div></div>
              <div class="nf">${L.nf}</div>
            </div>`;
          $$('[data-l]', el).forEach(b => b.onclick = () => { S.lang = b.dataset.l; draw(); });
          $$('#ctabs button', el).forEach(b => b.setAttribute('aria-pressed', +b.dataset.c === S.card));
        };
        $$('#ctabs button', el).forEach(b => b.onclick = () => { S.card = +b.dataset.c; draw(); });
        draw();
      },
      notes: 'This is what a Panipat factory sees. One in four bedsheet-set orders, rising, most land at ₹330–380, returns come from thread count and colour bleed. Flip to हिं: same card, same numbers, in Hindi. 7 of the 10 Panipat owners we called asked for it. Switch to the cushion card: it is closing, and the card says so.',
      src: 'Guided demo · steps 2–3 · DEMO_SCRIPT'
    },
    /* 5 · your money */
    {
      name: 'Your money',
      k: 'The factory computes its own case',
      h: 'Paid on <em>day 7</em>. And it still beats wholesale.',
      p: 'The factory types its own price and cost. Shipping, Hub packing and a returns reserve come off; what is left is its money.',
      points: [['1', '<b>₹245</b> received per kept set, paid on day 7'], ['2', '<b>₹27</b> kept, <b>₹22</b> in today’s money against <b>₹19</b> wholesale'], ['!', 'At <b>12% returns</b> it falls below wholesale: that is the stop line']],
      w: () => `<div class="panel calc" id="calc">
        <div class="ins">
          <div class="field"><label for="c-price">Your price to the buyer, all-in</label><div class="inpre"><span>₹</span><input class="input num" id="c-price" type="number" min="150" max="600" value="${S.price}"></div></div>
          <div class="field"><label for="c-cost">Your cost to make one set</label><div class="inpre"><span>₹</span><input class="input num" id="c-cost" type="number" min="50" max="500" value="${S.cost}"></div></div>
        </div>
        <div class="ladder" id="ladder" role="group" aria-label="Customer returns">${FD.ladder.map(l => `<button data-r="${l.r}" class="${l.stop ? 'stop' : ''}" aria-pressed="${l.r === S.r}"><b>${l.l}</b><small>${l.s}</small></button>`).join('')}</div>
        <div class="bd" id="c-bd"></div>
        <div class="keep" id="c-keep"></div>
        <div class="verdict" id="c-v"></div>
      </div>`,
      mount: el => {
        const draw = () => {
          const e = FD.econ, m = FD.settle(S.price, S.cost, S.r), stop = S.r >= 12;
          $('#c-bd', el).innerHTML = `
            <div><span class="muted">Buyer pays, all-in</span><span class="num">${rs(S.price)}</span></div>
            <div><span class="muted">Forward shipping</span><span class="num">−${rs(e.SHIP)}</span></div>
            <div><span class="muted">Hub packing</span><span class="num">−${rs(e.PACK)}</span></div>
            <div><span class="muted">Returns reserve at ${S.r}% × ₹${e.REVERSE}</span><span class="num">−₹${(Math.round(m.reserve * 10) / 10).toLocaleString('en-IN')}</span></div>
            <div class="tot"><span>You receive per kept set · day 7</span><span class="num">${rs(m.recv)}</span></div>`;
          $('#c-keep', el).innerHTML = `
            <div><b class="num">${rs(m.keep)}</b><small>you keep, after your ₹${S.cost} cost</small></div>
            <div class="hl"><b class="num">${rs(m.today)}</b><small>in today’s money · wholesale gives ${rs(e.WHOLESALE)}</small></div>`;
          $('#calc', el).classList.toggle('stop', stop);
          const v = $('#c-v', el), gap = Math.round(m.today) - e.WHOLESALE;
          if (stop) { v.className = 'verdict bad'; v.innerHTML = `${ic('x', 18)} Stop line. ${rs(m.today)} is below the ₹19 wholesale margin, so replenishment stops at 12% returns.`; }
          else if (gap > 0) { v.className = 'verdict ok'; v.innerHTML = `${ic('check', 18)} Beats wholesale by ${rs(gap)} a set, with no 30-day credit and no bad debt.`; }
          else { v.className = 'verdict warn'; v.innerHTML = `${ic('clock', 18)} At these numbers wholesale pays the same or more. Change your price or cost.`; }
          $$('#ladder button', el).forEach(b => b.setAttribute('aria-pressed', +b.dataset.r === S.r));
        };
        $('#c-price', el).oninput = e => { S.price = +e.target.value || 0; draw(); };
        $('#c-cost', el).oninput = e => { S.cost = +e.target.value || 0; draw(); };
        $$('#ladder button', el).forEach(b => b.onclick = () => { S.r = +b.dataset.r; draw(); });
        draw();
      },
      notes: 'Nothing here is promised. The factory types its own cost and price. At ₹345 all-in it receives ₹245 per kept set on day 7 and keeps ₹27, about ₹22 in today’s money, against ₹19 wholesale. Now press 12%: that is the kill condition. Below wholesale, replenishment stops.',
      src: 'Guided demo · step 4 · deck slide 4'
    },
    /* 6 · the bid */
    {
      name: 'The bid', illus: true,
      k: 'A bid, not a contract',
      h: '100 units. <em>Smaller than its smallest</em> B2B order.',
      p: 'The factory confirms the spec and picks 100–200 units at its own price. The Hub checks one sample in 3 days.',
      w: () => `<div class="panel bid" id="bid"></div>`,
      mount: el => {
        const draw = () => {
          const box = $('#bid', el);
          if (S.bidDone) {
            box.innerHTML = `<div class="row" style="gap:16px"><span class="tick">${ic('check', 30)}</span><div><span class="lbl">Bid sent · Double bedsheet set</span><h3 style="font-size:24px;margin-top:4px">${S.qty} sets at ${rs(S.price)}, all-in</h3></div></div>
              <div class="timeline">${[['Today', 'Bid received', 'You can withdraw it until the sample ships', 1], ['Day 3', 'Hub checks one sample', 'Against the card: thread count, size, wash test'], ['Day 7', 'Listing goes live', 'Disclosed 60-day trial slot, your price'], ['Day 14 · 30 · 60', 'Reads by rule', 'Reorder, fix or stop. You see every number'], ['Every kept set', 'Paid on day 7', 'Into your bank account, no credit period']]
                .map((t, i) => `<div class="${t[3] ? 'd' : ''}" style="animation-delay:${reduced ? 0 : i * 120}ms"><i>${t[3] ? ic('check', 14) : i + 1}</i><span><b>${t[1]}</b><small>${t[0]} · ${t[2]}</small></span></div>`).join('')}</div>
              <button class="btn out sm" id="b-again">Edit bid</button>`;
            $('#b-again', el).onclick = () => { S.bidDone = false; draw(); };
            return;
          }
          box.innerHTML = `<span class="lbl">Bid on this card · Double bedsheet set</span>
            <div class="checks">${['240 thread count', '90×100 inch', '2 pillow covers', '100% cotton'].map(c => `<label class="check"><input type="checkbox" data-c checked> ${c}</label>`).join('')}</div>
            <div style="margin-top:22px" class="row between"><span class="lbl">How many sets</span><b class="num" style="font-size:28px;color:var(--m-primary)" id="b-q">${S.qty}</b></div>
            <input type="range" id="b-qty" min="100" max="200" step="10" value="${S.qty}" aria-label="Quantity">
            <div class="row between faint" style="font-size:12px;font-weight:800"><span>100</span><span>200</span></div>
            <div class="row between" style="margin-top:16px"><div class="field" style="flex:1"><label for="b-price">Your price, all-in</label><div class="inpre"><span>₹</span><input class="input num" id="b-price" type="number" value="${S.price}"></div></div>
              <div style="flex:1;text-align:right"><span class="lbl">Stock value at your cost</span><b class="num" style="display:block;font-size:26px" id="b-val">${rs(S.qty * S.cost)}</b></div></div>
            <div class="never-line"><span>No cash</span><span>No ad credit</span><span>No guarantee</span><span>Stock stays yours</span></div>
            <button class="btn" id="b-go" style="width:100%;margin-top:18px">Send bid</button>`;
          const sync = () => { $('#b-go', el).disabled = $$('[data-c]', el).some(c => !c.checked); };
          $$('[data-c]', el).forEach(c => c.onchange = sync);
          $('#b-qty', el).oninput = e => { S.qty = +e.target.value; $('#b-q', el).textContent = S.qty; $('#b-val', el).textContent = rs(S.qty * S.cost); };
          $('#b-price', el).oninput = e => { S.price = +e.target.value || 0; };
          $('#b-go', el).onclick = () => { S.bidDone = true; draw(); };
        };
        draw();
        return draw;
      },
      notes: '100 units, smaller than its smallest B2B order. The factory confirms every spec line, picks a quantity and its own price. No cash, no ad credit, no guarantee; unsold stock stays the factory’s. Send it and show the timeline: sample check on day 3, live on day 7, reads at D+14, 30 and 60.',
      src: 'Guided demo · step 5'
    },
    /* 7 · cluster hub */
    {
      name: 'Cluster Hub', illus: true,
      k: 'The B2C work, done once per cluster',
      h: 'One Hub per town. <em>Hundreds of factories,</em> no account managers.',
      p: 'A shared operator paid per task: checks samples against the card, packs singles, grades returns, sends one pickup a day.',
      w: () => `<div class="hubgrid">
        <div class="panel" style="padding:22px">
          <span class="lbl">Sample check · against the card</span>
          <div class="stabs" style="margin-top:10px">${FD.hub.samples.map((s, i) => `<button data-s="${i}" aria-pressed="${i === S.sample}"><b>${s.f}</b><small>${s.card}</small></button>`).join('')}</div>
          <div id="h-cmp"></div>
        </div>
        <div class="panel" style="padding:22px">
          <span class="lbl">Today’s pickup · one truck</span>
          <div class="row" style="align-items:baseline;gap:8px;margin-top:8px"><b class="num" style="font-size:44px;font-weight:900;color:var(--m-primary);line-height:1" id="h-tot">0</b><span class="muted" style="font-weight:700">parcels from ${FD.hub.packing.length} factories</span></div>
          <div id="h-pk" style="margin-top:6px"></div>
          <div class="gauge" id="h-g"><i style="width:0"></i><div class="be" style="left:${400 / 500 * 100}%"><span>break-even 400/day</span></div></div>
          <div class="faint" style="font-size:12px;font-weight:700;margin-top:10px">Scale: 0–500 parcels a day</div>
        </div>
      </div>`,
      mount: el => {
        const drawS = () => {
          const s = FD.hub.samples[S.sample], v = S.verdicts[s.id];
          $$('.stabs button', el).forEach(b => b.setAttribute('aria-pressed', +b.dataset.s === S.sample));
          const ok = (a, m) => s.pass || !['GSM', 'Size'].includes(a) ? true : false;
          $('#h-cmp', el).innerHTML = `<div class="cmp h"><span>Check</span><span>Card asks</span><span>Measured</span><span></span></div>` +
            s.checks.map(c => { const g = ok(c[0]); return `<div class="cmp"><span style="font-weight:700">${c[0]}</span><span class="muted">${c[1]}</span><span class="${g ? '' : 'badc'}" style="font-weight:800">${c[2]}</span><span class="${g ? 'okc' : 'badc'}">${ic(g ? 'check' : 'x', 16)}</span></div>`; }).join('') +
            `<div class="row" style="margin-top:16px">${v ? `<span class="pill ${v === 'pass' ? 'ok' : 'bad'}">${v === 'pass' ? 'Passed · listing can go live' : 'Sent back with the two failed checks'}</span><button class="link" data-undo>Undo</button>` :
              `<button class="btn sm" data-v="pass" ${s.pass ? '' : 'disabled title="Two checks fail"'}>Pass sample</button><button class="btn out sm" data-v="fail">Send back</button><span class="faint" style="font-size:12px;font-weight:700">${s.pass ? 'All checks match' : '2 checks fail'}</span>`}</div>`;
          $$('[data-v]', el).forEach(b => b.onclick = () => { S.verdicts[s.id] = b.dataset.v; drawS(); });
          const u = $('[data-undo]', el); if (u) u.onclick = () => { delete S.verdicts[s.id]; drawS(); };
        };
        $$('.stabs button', el).forEach(b => b.onclick = () => { S.sample = +b.dataset.s; drawS(); });
        drawS();
        const pk = FD.hub.packing, max = Math.max(...pk.map(p => p.n)), tot = pk.reduce((a, p) => a + p.n, 0);
        $('#h-pk', el).innerHTML = pk.map(p => `<div class="pk"><div class="b"><i style="width:0" data-w="${p.n / max * 100}"></i><span>${p.f}</span></div><b class="num">${p.n}</b></div>`).join('');
        return () => {
          $$('#h-pk i', el).forEach(i => i.style.width = '0');
          $('#h-g i', el).style.width = '0';
          $('#h-tot', el).textContent = '0';
          setTimeout(() => {
            $$('#h-pk i', el).forEach(i => i.style.width = i.dataset.w + '%');
            $('#h-g i', el).style.width = (tot / 500 * 100) + '%';
            let n = 0; const step = () => { n = Math.min(tot, n + 14); $('#h-tot', el).textContent = n; if (n < tot) requestAnimationFrame(step); };
            reduced ? ($('#h-tot', el).textContent = tot) : step();
          }, reduced ? 0 : 200);
        };
      },
      notes: 'This is how hundreds of factories onboard without an account manager each. Click Singla Textiles: the towel measures 472 GSM against a 500–600 ask, so it goes back with the codes. On the right, one pickup of 412 parcels from 7 factories; the Hub breaks even at about 400 a day.',
      src: 'Guided demo · step 6'
    },
    /* 8 · buyer */
    {
      name: 'The buyer',
      k: 'Same listing, told straight',
      h: 'The buyer sees <em>a maker and a spec.</em> One price, all-in.',
      p: 'Today: ₹317, then ₹64 more at checkout, no thread count, no maker. With Factory Direct: ₹345 all-in and a Hub-checked Spec Card. No badge, no ranking boost.',
      extra: `<div class="seg solid" role="group" aria-label="Listing" id="bseg" style="margin-top:26px"><button data-fd="0">Today</button><button data-fd="1">Factory Direct</button></div>`,
      w: () => `<div class="buyerw"><div class="phone"><div class="screen" id="screen"></div></div>
        <div class="bside">
          <div class="bstat"><b class="num">15/20</b><small>buyers we interviewed picked the Factory Direct listing</small></div>
          <div class="quote" style="margin-top:0;padding:16px 18px"><q style="font-size:18px">Checked hai toh COD chhod sakta hoon.</q><small>A COD buyer: “If it’s checked, I can skip cash on delivery.”</small></div>
          <div class="adds" id="adds">
            <div><i>1</i><span><b>All-in price</b>No ₹64 surprise at checkout</span></div>
            <div><i>2</i><span><b>Maker line</b>Who made it, and where</span></div>
            <div><i>3</i><span><b>Spec Card</b>Measured at the Hub, not claimed</span></div>
          </div>
        </div></div>`,
      mount: el => {
        const img = `<svg viewBox="0 0 290 210" aria-hidden="true"><rect width="290" height="210" fill="#F6EEF4"/><rect x="40" y="70" width="210" height="110" rx="10" fill="#fff"/><rect x="40" y="70" width="210" height="30" rx="10" fill="#E5CCE9"/><g fill="#F43397" opacity=".55">${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="${62 + i * 34}" cy="${128 + (i % 2) * 22}" r="9"/>`).join('')}</g><rect x="58" y="40" width="70" height="38" rx="9" fill="#fff" stroke="#E5CCE9"/><rect x="162" y="40" width="70" height="38" rx="9" fill="#fff" stroke="#E5CCE9"/></svg>`;
        const draw = () => {
          const fd = S.fd;
          $$('#bseg button', el).forEach(b => b.setAttribute('aria-pressed', (b.dataset.fd === '1') === fd));
          $('#adds', el).classList.toggle('dim', !fd);
          $('#screen', el).innerHTML = `<span class="notch"></span><div class="sbar"><span>9:41</span><span>▮▮▮</span></div>
            <div class="mbar"><span style="font-weight:900;color:var(--m-primary);font-size:14px">‹</span><div class="s">Search bedsheets</div></div>
            <div class="pimg">${img}</div>
            <div class="pb">
              <div class="pt">Double bedsheet set with 2 pillow covers, floral, 90×100 in</div>
              <div class="pp">${fd ? `<b class="num mk" data-n="1">₹345</b><span class="ai">all-in · free delivery</span>` : `<b class="num">₹317</b><span class="del">+ ₹64 at checkout</span>`}</div>
              <div style="margin-top:6px"><span class="rating">4.1 ★</span> <span class="faint" style="font-size:11px;font-weight:700">2,318 ratings</span></div>
              ${fd ? `<div class="maker mk" data-n="2"><span class="fi">${ic('factory', 16)}</span><span><b>Made by Kalpana Textiles, Panipat</b><small>Ships from the Panipat Cluster Hub</small></span></div>
                <div class="spec mk" data-n="3"><div class="h"><span>Spec Card</span><span class="okc">Hub-checked</span></div><div class="g">
                  <div><small>Thread count</small>236</div><div><small>Size</small>90×100 in</div><div><small>Fabric</small>100% cotton</div><div><small>Wash test</small>No bleed</div></div></div>`
              : `<div class="miss">Thread count not stated. Seller: “Trendz Home Store”. Fabric: “cotton feel”.</div><div class="l4l" style="color:var(--ink-3)">Cash on delivery available</div>`}
            </div>
            <div class="pcta"><button class="btn out" tabindex="-1">Add to cart</button><button class="btn" tabindex="-1">Buy now</button></div>`;
        };
        $$('#bseg button', el).forEach(b => b.onclick = () => { S.fd = b.dataset.fd === '1'; draw(); });
        draw();
      },
      notes: 'Toggle Today: ₹317, then ₹64 at checkout, no thread count, no maker. Toggle Factory Direct: ₹345 all-in, a maker line and a Hub-checked Spec Card. No badge and no ranking boost. 15 of 20 buyers we interviewed picked this listing, and one COD buyer said: if it’s checked, I can skip cash on delivery.',
      src: 'Guided demo · step 7'
    },
    /* 9 · reads by rule */
    {
      name: 'Reads by rule', illus: true,
      k: 'Rules, not account managers',
      h: 'Thirty batches. <em>Every status computed,</em> none judged.',
      p: 'Reads at D+14, 30 and 60 against thirty matched controls. A human looks only when a rule says so.',
      extra: `<div class="seg" role="group" aria-label="Read" id="rday" style="margin-top:26px">${[14, 30, 60].map(d => `<button data-d="${d}">D+${d}</button>`).join('')}</div>`,
      w: () => `<div class="reads9">
        <div class="panel" style="padding:22px">
          <div class="row between"><span class="lbl">Pilot cohort · 30 batches</span><span class="faint" id="r-sum" style="font-size:12px;font-weight:800"></span></div>
          <div class="sbar3" id="r-bar"></div>
          <div class="leg" id="r-leg"></div>
          <div class="brows" id="r-rows"></div>
        </div>
        <div class="panel soft" style="padding:22px" id="r-det"></div>
      </div>`,
      mount: el => {
        const pick = [0, 1, 2, 4, 9, 15, 18, 11];
        const draw = () => {
          const reads = FD.pilot.map(p => { const r = FD.read(p, S.day); return { p, r, j: FD.judge(r) }; });
          const n = s => reads.filter(x => x.j.s === s).length;
          const c = { ok: n('ok'), warn: n('warn'), bad: n('bad') };
          $$('#rday button', el).forEach(b => b.setAttribute('aria-pressed', +b.dataset.d === S.day));
          $('#r-sum', el).textContent = `D+${S.day} read`;
          $('#r-bar', el).innerHTML = `<i style="flex:${c.ok};background:var(--green)"></i><i style="flex:${c.warn};background:#F0B54A"></i><i style="flex:${c.bad};background:var(--red)"></i>`;
          $('#r-leg', el).innerHTML = `<span style="--c:var(--green)">${c.ok} on track</span><span style="--c:#F0B54A">${c.warn} fix</span><span style="--c:var(--red)">${c.bad} stop</span>`;
          $('#r-rows', el).innerHTML = pick.map((i, k) => { const x = reads[i]; return `<button class="brow" data-k="${k}" aria-pressed="${k === S.row}"><span><b>${x.p.f}</b><small>${x.p.sku} · ${x.r.sold}/100 sold</small></span><span class="pill ${x.j.s}">${x.j.short}</span></button>`; }).join('');
          const x = reads[pick[S.row]], r = x.r, j = x.j;
          const flag = { impr: 'impr', conv: 'conv', slaHub: 'sla', slaFac: 'sla', ret6: 'ret', ret12: 'ret', rto: 'rto', contrib: 'contrib' }[j.k];
          const tile = (k, v, l) => `<div class="${flag === k ? 'flag' : ''}"><b class="num">${v}</b><small>${l}</small></div>`;
          $('#r-det', el).innerHTML = `<div class="row between"><div><span class="lbl">${x.p.sku}</span><h3 style="font-size:22px;margin-top:4px">${x.p.f}</h3></div><span class="pill ${j.s}">${j.label}</span></div>
            <div class="tiles">${tile('impr', (r.impr / 1000).toFixed(1) + 'k', 'impressions · slot 20k')}${tile('conv', r.conv + '%', 'kept conversion · 1.8% bar')}${tile('sla', r.sla + '%', 'dispatch SLA · ' + (r.hub ? 'Hub' : 'factory'))}${tile('ret', r.ret + '%', 'customer returns')}${tile('rto', r.rto + '%', 'RTO · median 15%')}${tile('contrib', rs(r.contrib), 'contribution / unit')}</div>
            <div class="act ${j.s}"><b>Rule fired → automatic action</b><p>${j.action}</p><div class="h">A human looks only if: <span style="font-weight:600;color:var(--ink-2)">${j.human}.</span></div></div>`;
          $$('.brow', el).forEach(b => b.onclick = () => { S.row = +b.dataset.k; draw(); });
        };
        $$('#rday button', el).forEach(b => b.onclick = () => { S.day = +b.dataset.d; draw(); });
        draw();
      },
      notes: 'Thirty pilot batches against thirty matched controls. Every status is computed from the reads. Click Shree Balaji: a Hub-packed SLA miss is the Hub’s miss, nothing against the factory. Click Rajdhani Terry: returns at 12.6%, replenishment stops automatically. Step to D+30 and watch fixes clear.',
      src: 'Guided demo · step 8'
    },
    /* 10 · north star */
    {
      name: 'North star', illus: true,
      k: 'The only retention signal a B2B maker cares about',
      h: 'A <em>second batch</em>, on the factory’s own money.',
      p: 'Gate: half the pilot reorders by D+60, 60% by D+90. Matched controls that list the old way barely move.',
      extra: `<div class="seg" role="group" aria-label="Day" id="nday" style="margin-top:26px">${[14, 30, 60, 90].map(d => `<button data-d="${d}">D+${d}</button>`).join('')}</div>`,
      w: () => `<div class="panel ns" style="max-width:820px">
        <div class="ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="none" stroke="#F1E3F3" stroke-width="10"/><circle id="ns-arc" cx="60" cy="60" r="52" fill="none" stroke="#9F2089" stroke-width="10" stroke-linecap="round" stroke-dasharray="${2 * Math.PI * 52}" stroke-dashoffset="${2 * Math.PI * 52}"/></svg>
          <div class="c"><div><b class="num" id="ns-n">0<small>/30</small></b><span>reordered on own money</span></div></div></div>
        <div>
          <div class="cmpbars" id="ns-bars"></div>
          <div class="lbl" style="margin-top:22px">Pilot gates</div>
          <div class="gates" id="ns-gates"></div>
        </div>
      </div>`,
      mount: el => {
        const C = 2 * Math.PI * 52;
        const draw = () => {
          const n = FD.pilot.filter(p => FD.read(p, S.nsDay).reordered).length;
          const ctrl = S.nsDay >= 60 ? 3 : 0;
          $$('#nday button', el).forEach(b => b.setAttribute('aria-pressed', +b.dataset.d === S.nsDay));
          $('#ns-n', el).innerHTML = `${n}<small>/30</small>`;
          $('#ns-arc', el).setAttribute('stroke-dashoffset', C * (1 - n / 30));
          $('#ns-bars', el).innerHTML = `
            <div class="cb"><div class="t"><span>Factory Direct pilot</span><span class="num" style="color:var(--m-primary)">${n}/30 · ${Math.round(n / 30 * 100)}%</span></div><div class="tr"><i style="width:${n / 30 * 100}%;background:var(--m-primary)"></i><div class="gate" style="left:50%"></div></div></div>
            <div class="cb"><div class="t"><span>Matched controls, listing cold</span><span class="num faint">${S.nsDay >= 60 ? '3/30 · 10%' : 'read at D+60'}</span></div><div class="tr"><i style="width:${ctrl / 30 * 100}%;background:var(--ink-3)"></i><div class="gate" style="left:50%"></div></div></div>
            <div class="faint" style="font-size:12px;font-weight:700">Black line: the 50% gate</div>`;
          const g = [['D+60', '50% place a second batch', n >= 15 && S.nsDay >= 60], ['D+90', '60% place a second batch', n >= 18 && S.nsDay >= 90], ['Any', 'Contribution positive on matured units', S.nsDay >= 30]];
          $('#ns-gates', el).innerHTML = g.map(x => `<div class="${x[2] ? 'pass' : ''}"><i>${x[2] ? ic('check', 12) : '·'}</i><span>${x[1]}</span><span class="faint">${x[0]}</span></div>`).join('');
        };
        $$('#nday button', el).forEach(b => b.onclick = () => { S.nsDay = +b.dataset.d; draw(); });
        return () => { const keep = S.nsDay; S.nsDay = 14; draw(); setTimeout(() => { S.nsDay = keep; draw(); }, reduced ? 0 : 300); };
      },
      notes: 'Advance to D+60: 16 of 30 factories have placed a second batch on their own money, past the 50% gate. By D+90 it is 20 of 30. The matched controls that list the old way: 3 of 30. Every window ends at a gate with a number.',
      src: 'Guided demo · step 9 · README north star'
    },
    /* 11 · waterfall */
    {
      name: 'Where ₹36 comes from',
      k: 'The cost stack, per kept set',
      h: 'Where the <em>₹36</em> comes from.',
      p: 'No subsidy. The chain gets shorter: no trader, no warehouse hop, fewer returns, denser pickups. ₹2 stays with the factory.',
      points: [['−', 'Returns fall from 8% to 5% because the spec is checked: <b>₹13</b>'], ['−', 'Freight, capital and margin of the trader chain: <b>₹19</b>'], ['−', 'One dense Hub pickup a day: <b>₹6</b>']],
      w: () => `<div class="panel wfwrap" style="padding:24px 26px 20px"><div class="row between"><span class="lbl">₹ per kept set · axis starts at ₹320</span><span class="faint" style="font-size:12px;font-weight:700">Hover a bar</span></div><div id="wf"></div>
        <div class="wflegend"><span><i style="background:#D9D4E0"></i>Today</span><span><i style="background:#F5B860"></i>Removed</span><span><i style="background:#038D63"></i>Factory keeps</span><span><i style="background:#9F2089"></i>Factory Direct</span><span><i style="background:#fff;border:1.5px dashed #B9B3C4"></i>Idle-capacity floor</span></div></div>`,
      mount: el => {
        const W = 820, H = 470, pl = 44, pr = 10, pt = 30, pb = 74, lo = 320, hi = 385;
        const y = v => pt + (hi - v) / (hi - lo) * (H - pt - pb);
        const steps = FD.waterfall, bw = (W - pl - pr) / steps.length;
        let run = 0, out = '';
        for (let v = 320; v <= 380; v += 20) out += `<line x1="${pl}" x2="${W - pr}" y1="${y(v)}" y2="${y(v)}" stroke="#EEEBF2"/><text x="${pl - 8}" y="${y(v) + 4}" text-anchor="end" font-size="12" fill="#8B8BA3" font-weight="700">₹${v}</text>`;
        steps.forEach((s, i) => {
          const x = pl + i * bw + 10, w = bw - 20;
          let top, bot, fill, lab;
          if (s.total) { top = s.v; bot = lo; run = s.v; fill = s.ghost ? '#fff' : s.fd ? '#9F2089' : '#D9D4E0'; lab = '₹' + s.v; }
          else { const nx = run + s.v; top = Math.max(run, nx); bot = Math.min(run, nx); fill = s.v > 0 ? '#038D63' : '#F5B860'; lab = (s.v > 0 ? '+' : '−') + '₹' + Math.abs(s.v); run = nx; }
          const words = s.l.split(' ');
          const l1 = words.slice(0, Math.ceil(words.length / 2)).join(' '), l2 = words.slice(Math.ceil(words.length / 2)).join(' ');
          out += `<g class="wfb" style="opacity:0;transition:opacity .35s ${reduced ? 0 : i * 90}ms"><title>${s.l}: ${lab}</title>
            <rect x="${x}" y="${y(top)}" width="${w}" height="${Math.max(2, y(bot) - y(top))}" rx="5" fill="${fill}" ${s.ghost ? 'stroke="#B9B3C4" stroke-dasharray="4 3" stroke-width="1.5"' : ''}/>
            <text x="${x + w / 2}" y="${y(top) - 8}" text-anchor="middle" font-size="15" font-weight="900" fill="${s.fd ? '#9F2089' : s.v > 0 && !s.total ? '#038D63' : '#353543'}">${lab}</text>
            <text x="${x + w / 2}" y="${H - pb + 20}" text-anchor="middle" font-size="12" font-weight="700" fill="#616173">${l1}</text>
            <text x="${x + w / 2}" y="${H - pb + 36}" text-anchor="middle" font-size="12" font-weight="700" fill="#616173">${l2}</text></g>`;
          if (i < steps.length - 2) out += `<line x1="${x + w}" x2="${x + w + 20}" y1="${y(run)}" y2="${y(run)}" stroke="#B9B3C4" stroke-dasharray="3 3"/>`;
        });
        const x0 = pl + 10, x7 = pl + 7 * bw + bw - 10;
        out += `<path d="M${x0} ${H - pb + 50} V${H - pb + 58} H${x7} V${H - pb + 50}" fill="none" stroke="#9F2089" stroke-width="1.5"/><text x="${(x0 + x7) / 2}" y="${H - 2}" text-anchor="middle" font-size="13" font-weight="900" fill="#9F2089">−₹36 for the buyer (9.4%), and the factory still beats wholesale</text>`;
        $('#wf', el).innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Cost waterfall from ₹381 to ₹345">${out}</svg>`;
        return () => { $$('.wfb', el).forEach(g => g.style.opacity = 0); requestAnimationFrame(() => requestAnimationFrame(() => $$('.wfb', el).forEach(g => g.style.opacity = 1))); };
      },
      notes: 'Walk the bars left to right. ₹4 of trader margin, ₹8 of inbound freight, ₹7 of working capital, ₹13 from returns falling from 8% to 5% because the spec is checked, ₹6 from a denser pickup rate. ₹2 goes back to the factory. ₹381 becomes ₹345. A factory with idle capacity could go to ₹340, but that is not the plan. Every step is a scenario, to be replaced by quotes.',
      src: 'Deck slide 4 · FD.waterfall'
    },
    /* 12 · scale */
    {
      name: 'Scale', full: true,
      w: () => `<div style="width:100%;max-width:1240px;margin:0 auto">
        <div class="copy" style="margin-bottom:34px"><div class="k">Then one cluster a quarter</div><h2 style="max-width:980px">Panipat <em>15</em> → Surat <em>850</em> replenishing factories in 24 months.</h2></div>
        <div class="road">${FD.road.map((r, i) => `<div class="q" style="transition-delay:${reduced ? 0 : i * 110}ms"><div class="dt">${r.q}</div><b>${r.c}</b><small>${r.d}</small><span class="v num">${r.v}</span><div class="bar" style="height:${8 + r.v / 850 * 70}px"></div></div>`).join('')}</div>
        <div class="scens">${FD.scenarios.map(s => `<div class="${s.base ? 'base' : ''}"><span class="lbl">${s.k} case · saved for buyers / year</span><b class="num">${s.v}</b><small>${s.s}</small></div>`).join('')}</div>
      </div>`,
      notes: 'Panipat first with 15 factories, then Karur, Moradabad, Tiruppur, second Hubs and Surat, if the gate holds: about 850 factories still replenishing on their own money at month 24. Base case ₹61 crore a year saved for buyers; low case ₹26 crore; ₹202 crore is the high case, and not the plan.',
      src: 'Guided demo · step 10 · deck slides 9–10'
    },
    /* 13 · close */
    {
      name: 'Close', full: true,
      w: () => `<div class="close">
        <div class="copy"><div class="k" style="justify-content:center">Factory Direct</div></div>
        <h2 style="margin-top:18px">Meesho never <em>holds stock</em>, <em>sets a price</em> or <em>brands a product.</em></h2>
        <p>It shows a factory what sells, checks the product once, and pays on day 7. The factory decides everything else.</p>
        <div class="bigstat">
          <div><b class="num">₹345</b><small>buyer pays, not ₹381</small></div>
          <div><b class="num">₹22 <span style="font-size:22px;color:var(--ink-3)">vs ₹19</span></b><small>factory keeps, today’s money</small></div>
          <div><b class="num">50%</b><small>reorder on own money by D+60</small></div>
          <div><b class="num">850</b><small>factories in 24 months</small></div>
        </div>
        <div class="lbl" style="margin-top:34px">What a factory never gets</div>
        <div class="nevers" style="margin-top:12px"><span>Cash upfront</span><span>Ad credit</span><span>A guarantee of orders</span><span>Its stock taken off its hands</span></div>
        <div class="credit"><span><b>Team Violet</b> · Rakshit Rajendra</span><span>Meesho DICE Challenge 3.0</span><span>Prototype · not an official Meesho product</span></div>
      </div>`,
      notes: 'Close on the principle. Meesho never holds stock, sets a price or brands a product. No cash, no ad credit, no guarantee: the factory keeps the decision and the money. Then take questions; the explorer has every screen if the panel wants to click around.',
      src: 'Guided demo · step 10'
    }
  ];

  /* ================= build ================= */
  const host = $('#slides'), dotsEl = $('#dots');
  const replays = [];
  slides.forEach((s, i) => {
    const el = document.createElement('section');
    el.className = 'slide' + (s.full ? ' full' : '') + (s.cls ? ' ' + s.cls : '');
    el.setAttribute('aria-roledescription', 'slide');
    el.setAttribute('aria-label', `${i + 1} of ${slides.length}: ${s.name}`);
    el.innerHTML = (s.full ? '' : `<div class="copy"><div class="k">${String(i + 1).padStart(2, '0')}<i>·</i>${s.k}</div><h2>${s.h}</h2><p class="lede">${s.p}</p>
        ${s.points ? `<div class="points">${s.points.map(p => `<div><i>${p[0]}</i><span>${p[1]}</span></div>`).join('')}</div>` : ''}${s.extra || ''}</div>`) +
      `<div class="widget">${s.w()}</div>` + (s.illus ? '<div class="illus">Illustrative sample data · scenario numbers follow the detailed deck</div>' : '');
    host.appendChild(el);
    replays[i] = s.mount ? s.mount(el) : null;
    const d = document.createElement('button');
    d.className = 'dot'; d.setAttribute('aria-label', `Slide ${i + 1}: ${s.name}`);
    d.innerHTML = `<span></span><em>${i + 1} · ${s.name}</em>`;
    d.onclick = () => go(i);
    dotsEl.appendChild(d);
  });
  const els = $$('.slide', host), dots = $$('.dot', dotsEl);

  /* ================= navigation ================= */
  let cur = -1;
  function go(n, fromHash) {
    n = Math.max(0, Math.min(slides.length - 1, n));
    if (n === cur) return;
    const back = n < cur;
    els.forEach((e, i) => { e.classList.toggle('on', i === n); e.classList.toggle('back', back ? i > n : i < n); e.setAttribute('aria-hidden', i !== n); e.inert = i !== n; });
    dots.forEach((d, i) => { d.classList.toggle('on', i === n); d.classList.toggle('done', i < n); d.setAttribute('aria-current', i === n ? 'step' : 'false'); });
    cur = n;
    $('#counter').innerHTML = `<b>${String(n + 1).padStart(2, '0')}</b> / ${slides.length}`;
    $('#chap').textContent = slides[n].name;
    $('#prev').disabled = n === 0; $('#next').disabled = n === slides.length - 1;
    $('#notes-t').textContent = `Notes · ${n + 1} ${slides[n].name}`;
    $('#notes-p').textContent = slides[n].notes;
    $('#notes-s').textContent = 'Source: ' + slides[n].src;
    if (!fromHash) history.replaceState(null, '', '#' + (n + 1));
    if (replays[n]) replays[n]();
    if (document.body.classList.contains('stacked')) window.scrollTo(0, 0);
  }
  const next = () => go(cur + 1), prev = () => go(cur - 1);
  $('#next').onclick = next; $('#prev').onclick = prev;

  const toggleNotes = () => { const n = $('#notes'); const on = n.classList.toggle('on'); n.setAttribute('aria-hidden', !on); };
  const toggleFull = () => { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen && document.documentElement.requestFullscreen().catch(() => {}); };
  $('#t-notes').onclick = toggleNotes; $('#t-full').onclick = toggleFull;

  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target, typing = t.matches && t.matches('input, textarea, select');
    if (typing && !['PageDown', 'PageUp', 'Escape'].includes(e.key)) return;
    switch (e.key) {
      case 'ArrowRight': case 'PageDown': case ' ': e.preventDefault(); next(); break;
      case 'ArrowLeft': case 'PageUp': e.preventDefault(); prev(); break;
      case 'Home': e.preventDefault(); go(0); break;
      case 'End': e.preventDefault(); go(slides.length - 1); break;
      case 'n': case 'N': toggleNotes(); break;
      case 'f': case 'F': toggleFull(); break;
      case 'Escape': if ($('#notes').classList.contains('on')) toggleNotes(); break;
      default: if (/^[1-9]$/.test(e.key)) go(+e.key - 1);
    }
  });
  let tx = 0, ty = 0;
  document.addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  document.addEventListener('touchend', e => {
    if (e.target.closest && e.target.closest('input[type=range]')) return;
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) dx < 0 ? next() : prev();
  }, { passive: true });
  window.addEventListener('hashchange', () => { const n = parseInt(location.hash.slice(1), 10); if (n) go(n - 1, true); });

  /* ================= fit the stage ================= */
  const stage = $('#stage');
  function fit() {
    const w = innerWidth, h = innerHeight;
    const stacked = w < 760 || (w < 1000 && h > w * 1.1);
    document.body.classList.toggle('stacked', stacked);
    if (stacked) { stage.style.transform = ''; stage.style.left = stage.style.top = ''; return; }
    const pad = Math.min(w, h) > 700 ? 16 : 0;
    const s = Math.min((w - pad * 2) / 1440, (h - pad * 2) / 810);
    stage.style.transform = `scale(${s})`;
    stage.style.left = (w - 1440 * s) / 2 + 'px';
    stage.style.top = (h - 810 * s) / 2 + 'px';
  }
  addEventListener('resize', fit);
  fit();
  go((parseInt(location.hash.slice(1), 10) || 1) - 1, true);
})();
