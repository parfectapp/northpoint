/* ============ NorthPoint · Coach (memory + analysis of your trading) ============
   Reads ALL your trades (your "memory") and pulls actionable patterns:
   by hour, side, day, setup and emotion. Generates mechanizable rules
   for the bot and improves month over month as you log more trades. */
window.Views = window.Views || {};
(() => {
  const V = window.Views;
  const MIN = 8; // minimum sample for reliable analysis

  // ---- grouping helpers (use Q.stats) ----
  const closed = ts => ts.filter(t => t.result !== 'be');
  function groupRows(arr, keyFn, labelFn) {
    const m = {};
    arr.forEach(t => { const k = keyFn(t); if (k === null || k === undefined || k === '') return; (m[k] = m[k] || []).push(t); });
    return Object.keys(m).map(k => ({ key: k, label: labelFn(k, m[k]), ts: m[k], ...Q.stats(m[k]) }));
  }
  const hourOf = t => { const h = parseInt((t.time || '').slice(0, 2), 10); return isNaN(h) ? null : h; };
  const WD = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const wdOf = t => { const [y, m, d] = (t.date || '').split('-').map(Number); if (!y) return null; return new Date(y, m - 1, d).getDay(); };
  const emoLabel = id => (Data.EMOTIONS.find(e => e.id === id) || { label: id }).label;
  const pfTxt = st => (st.profitFactor === Infinity ? '∞' : st.profitFactor);

  function streaks(all) {
    const seq = Q.tradesDesc().slice().reverse().filter(t => t.result !== 'be');
    let cw = 0, cl = 0, mw = 0, ml = 0;
    seq.forEach(t => {
      if (t.result === 'win') { cw++; cl = 0; mw = Math.max(mw, cw); }
      else { cl++; cw = 0; ml = Math.max(ml, cl); }
    });
    return { maxWin: mw, maxLoss: ml };
  }

  // ---- insight engine (the "coach that learns") ----
  function insights(all) {
    const out = [], cl = closed(all), st = Q.stats(all);

    // 1) is there an edge?
    if (st.expectancy > 0)
      out.push({ tone: 'good', ic: 'trendUp', title: `You have a real edge: +${UI.money(st.expectancy)} per trade`,
        text: `Across ${st.n} trades your Profit Factor is ${pfTxt(st)} and your win rate ${st.winRate}%. This is exactly what the bot should replicate.` });
    else
      out.push({ tone: 'bad', ic: 'trendDn', title: `No edge yet: ${UI.money(st.expectancy, true)} per trade`,
        text: `Profit Factor ${pfTxt(st)} across ${st.n} trades. The goal is to get above 1.0. Below I show you where the money is leaking.` });

    // 2) side (long vs short)
    const sd = groupRows(cl, t => t.side, k => (k === 'long' ? 'Longs' : 'Shorts')).filter(r => r.n >= 4);
    if (sd.length === 2) {
      const [a, b] = sd.sort((x, y) => y.expectancy - x.expectancy);
      if (a.expectancy > 0 && (a.expectancy - b.expectancy) > 12)
        out.push({ tone: 'tip', ic: 'bolt', title: `You win more on ${a.label.toLowerCase()} than on ${b.label.toLowerCase()}`,
          text: `${a.label}: ${a.winRate}% win, ${UI.money(a.expectancy, true)}/trade. ${b.label}: ${b.winRate}% win, ${UI.money(b.expectancy, true)}/trade.`,
          rule: `The bot prioritizes ${a.label.toLowerCase()} and filters or sizes down ${b.label.toLowerCase()}.` });
    }

    // 3) time window
    const hr = groupRows(cl, hourOf, k => `${String(k).padStart(2, '0')}:00`).filter(r => r.n >= 3);
    if (hr.length >= 2) {
      const best = hr.slice().sort((x, y) => y.expectancy - x.expectancy)[0];
      const worst = hr.slice().sort((x, y) => x.expectancy - y.expectancy)[0];
      if (best.key !== worst.key && worst.expectancy < 0 && best.expectancy > 0)
        out.push({ tone: 'tip', ic: 'clock', title: `Your best hour is ${best.label}`,
          text: `At ${best.label} your expectancy is ${UI.money(best.expectancy, true)}/trade. At ${worst.label} it's ${UI.money(worst.expectancy, true)} — that's where you tend to lose.`,
          rule: `The bot only enters in your winning window and shuts off in the hours where you historically lose.` });
    }

    // 4) emotion (FOMO / revenge)
    const badEmo = cl.filter(t => t.emotion === 'fomo' || t.emotion === 'revancha');
    if (badEmo.length >= 3) {
      const s = Q.stats(badEmo);
      if (s.net < 0)
        out.push({ tone: 'bad', ic: 'flame', title: `FOMO and revenge cost you ${UI.money(Math.abs(s.net))}`,
          text: `${badEmo.length} impulse trades with a ${s.winRate}% hit rate. This is exactly what a bot removes effortlessly.`,
          rule: `Automatic discipline: after your loss limit, the bot blocks more entries (zero revenge).` });
    }

    // 5) weak day of the week
    const wd = groupRows(cl, wdOf, k => WD[k]).filter(r => r.n >= 3);
    if (wd.length >= 3) {
      const worst = wd.slice().sort((x, y) => x.net - y.net)[0];
      if (worst.net < 0)
        out.push({ tone: 'tip', ic: 'cal', title: `Watch out on ${worst.label}s`,
          text: `On ${worst.label}s you rack up ${UI.money(worst.net, true)} across ${worst.n} trades (${worst.winRate}% win).`,
          rule: `Optional: the bot doesn't trade or sizes down on ${worst.label}s.` });
    }

    // 6) best setup
    const setups = Q.bySetup(cl).filter(r => r.n >= 3);
    if (setups.length >= 2 && setups[0].net > 0) {
      const bs = setups[0];
      out.push({ tone: 'good', ic: 'candles', title: `Your most profitable setup: ${Data.setupOf(bs.setup).label}`,
        text: `${UI.money(bs.net, true)} across ${bs.n} trades, ${bs.winRate}% win, PF ${pfTxt(bs)}.`,
        rule: `The bot prioritizes ${Data.setupOf(bs.setup).label} and watches for its decay month over month.` });
    }

    // 7) streak discipline
    const sk = streaks(all);
    if (sk.maxLoss >= 3)
      out.push({ tone: 'tip', ic: 'shield', title: `Your worst streak was ${sk.maxLoss} losses in a row`,
        text: `That's where accounts blow up. Your rule "W = stop / if you lose, grind" exists exactly for this.`,
        rule: `The bot cuts the day when it hits your max losses — without a single exception.` });

    return out;
  }

  // ---- render a breakdown with bars ----
  function breakdown(title, ic, rws, sortBy) {
    if (!rws.length) return '';
    const list = rws.slice().sort(sortBy || ((a, b) => b.net - a.net));
    const max = Math.max(...list.map(r => Math.abs(r.net)), 1);
    const body = list.map(r => `<div class="setrow">
        <div class="set-top"><span>${UI.esc(r.label)}</span><span class="${UI.pnlClass(r.net)} bold">${UI.money(r.net, true)}</span></div>
        ${UI.bar(Math.abs(r.net), max, r.net >= 0 ? 'var(--up)' : 'var(--down)')}
        <div class="muted small mt6">${r.n} trades · ${r.winRate}% win · exp ${UI.money(r.expectancy, true)}</div>
      </div>`).join('');
    return `<div class="card"><div class="card-head"><div class="ch-t">${UI.icon(ic, '', 18)} ${title}</div></div>${body}</div>`;
  }

  function kpi(label, value, sub, cls) {
    return `<div class="card kpi"><div class="kpi-l">${label}</div><div class="kpi-v ${cls || ''}">${value}</div>${sub ? `<div class="kpi-s muted">${sub}</div>` : ''}</div>`;
  }

  // ---- COACH VIEW ----
  V.coach = function () {
    const all = Q.allTrades();
    const st = Q.stats(all);

    const hero = `<div class="card coach-hero glass">
      <div class="coach-hero-l">
        <div class="eyebrow">${UI.icon('cockpit', '', 15)} COACH · MEMORY OF YOUR TRADING</div>
        <h1>The bot learns from every trade you log.</h1>
        <p class="muted">This is the memory that analyzes your history and turns your judgment into <b>mechanizable rules</b>. The more you trade and log, the sharper it gets — and the closer it is to being automated.</p>
      </div>
      <div class="coach-hero-r"><div class="coach-orb"><span></span><span></span><span></span></div></div>
    </div>`;

    if (all.length < MIN) {
      return `<div class="page">${hero}
        <div class="card">${UI.empty('cockpit', `I need at least ${MIN} trades to analyze your trading`,
          `You have ${all.length}. Log your trades (or connect them from Tradovate) and your analysis with bot rules will appear here.`)}
          <div class="btn-row mt12" style="justify-content:center">
            <button class="btn btn-primary" data-act="addTrade">${UI.icon('plus', '', 16)} Add trade</button>
            <button class="btn btn-ghost" data-act="connectTradovate">${UI.icon('plug', '', 16)} Connect Tradovate</button>
          </div>
        </div></div>`;
    }

    const kpis = `<div class="grid4">
      ${kpi('Expectancy / trade', UI.money(st.expectancy, true), st.expectancy > 0 ? 'you have an edge' : 'still in the red', UI.pnlClass(st.expectancy))}
      ${kpi('Profit Factor', pfTxt(st), st.profitFactor >= 1 ? 'profitable' : 'below 1.0', st.profitFactor >= 1 ? 'up' : 'down')}
      ${kpi('Win Rate', st.winRate + '%', st.wins + 'W · ' + st.losses + 'L')}
      ${kpi('Memory', st.n + ' trades', 'analyzed')}
    </div>`;

    const ins = insights(all);
    const insCard = `<div class="card">
      <div class="card-head"><div class="ch-t">${UI.icon('bolt', '', 18)} What I see in your trading</div></div>
      <div class="coach-insights">${ins.map(i => `<div class="insight">
        <div class="ins-badge ${i.tone}">${UI.icon(i.ic, '', 18)}</div>
        <div class="ins-body">
          <div class="ins-title">${i.title}</div>
          <div class="ins-text">${i.text}</div>
          ${i.rule ? `<div class="ins-rule">${UI.icon('cockpit', '', 13)} Rule for the bot: ${i.rule}</div>` : ''}
        </div>
      </div>`).join('')}</div>
    </div>`;

    // compiled rules to automate
    const reglas = ins.filter(i => i.rule);
    const reglasCard = reglas.length ? `<div class="card coach-rules">
      <div class="card-head"><div class="ch-t">${UI.icon('shield', '', 18)} Rules to automate</div><span class="muted small">${reglas.length} rule${reglas.length !== 1 ? 's' : ''}</span></div>
      <ol class="rule-list">${reglas.map(i => `<li>${UI.esc(i.rule)}</li>`).join('')}</ol>
      <p class="muted small mt8">These are the rules we pulled from YOUR history. As you log more trades they adjust, and we validate them each month before putting them in the bot.</p>
    </div>` : '';

    const cl = closed(all);
    const desgloses = `<div class="grid2-wide">
      ${breakdown('By hour of day', 'clock', groupRows(cl, hourOf, k => `${String(k).padStart(2, '0')}:00`), (a, b) => Number(a.key) - Number(b.key))}
      ${breakdown('By side', 'share', groupRows(cl, t => t.side, k => (k === 'long' ? 'Longs' : 'Shorts')))}
      ${breakdown('By day of week', 'cal', groupRows(cl, wdOf, k => WD[k]), (a, b) => Number(a.key) - Number(b.key))}
      ${breakdown('By setup', 'candles', Q.bySetup(cl).map(r => ({ ...r, label: Data.setupOf(r.setup).label })))}
      ${breakdown('By emotion', 'flame', groupRows(cl, t => t.emotion || 'neutral', k => emoLabel(k)))}
    </div>`;

    const foot = `<div class="card coach-foot">
      <p class="muted small">⚠️ The bot won't be "smarter" than you — it'll be <b>more disciplined</b>: it runs your rules with no emotion, no revenge, the same risk every time. That's the real edge. And all of this improves on its own as you feed its memory with every trade.</p>
      <div class="btn-row"><button class="btn btn-primary" data-act="addTrade">${UI.icon('plus', '', 16)} Log trade</button><button class="btn btn-ghost" data-act="exportCSV">${UI.icon('download', '', 16)} Export for the bot</button></div>
    </div>`;

    return `<div class="page">${hero}${kpis}${insCard}${reglasCard}${desgloses}${foot}</div>`;
  };
})();
