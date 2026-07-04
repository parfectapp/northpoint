/* ============ NorthPoint · Views: Home, Dashboard, Trades, Calendar, Accounts, Goals ============ */
window.Views = window.Views || {};
(() => {
  const V = window.Views;
  const t12 = t => { if (!t) return ''; let [h, m] = t.split(':').map(Number); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return `${h}:${String(m).padStart(2, '0')} ${ap}`; };

  function sideTag(side) {
    const long = side === 'long';
    return `<span class="side ${long ? 'long' : 'short'}">${UI.icon(long ? 'arrUp' : 'arrDn', '', 13)} ${long ? 'Long' : 'Short'}</span>`;
  }
  function statusPill(r) { const c = r === 'win' ? 'win' : r === 'loss' ? 'loss' : 'be'; const lbl = r === 'win' ? 'Win' : r === 'loss' ? 'Loss' : 'BE'; return `<span class="pill ${c}">${lbl}</span>`; }
  function tradePct(t) { const e = t.entry || 0; if (!e) return ''; const mv = (t.side === 'long' ? (t.exit - t.entry) : (t.entry - t.exit)) / e * 100; return (mv >= 0 ? '+' : '') + mv.toFixed(2) + '%'; }

  // -------- trades table --------
  function tradeTable(trades, paginate) {
    if (!trades.length) return UI.empty('candles', 'No trades', 'Add your first trade with the + button.');
    let rows = trades, pager = '';
    if (paginate) {
      const size = 10, total = Math.ceil(trades.length / size), page = Math.min(Math.max(1, App.tradePage), total);
      rows = trades.slice((page - 1) * size, page * size);
      pager = `<div class="pager">
        <span class="muted small">${trades.length} trade(s)</span>
        <div class="pg-nav">
          <button class="icobtn sm" data-act="setTradePage" data-p="${Math.max(1, page - 1)}" ${page === 1 ? 'disabled' : ''}>${UI.icon('chevL', '', 15)}</button>
          <span class="small">Page ${page} of ${total}</span>
          <button class="icobtn sm" data-act="setTradePage" data-p="${Math.min(total, page + 1)}" ${page === total ? 'disabled' : ''}>${UI.icon('chevR', '', 15)}</button>
        </div>
      </div>`;
    }
    const body = rows.map(t => {
      const ac = Q.accById(t.accountId) || {};
      return `<tr data-act="editTrade" data-id="${t.id}">
        <td><div class="td-date">${UI.dateUS(t.date)}</div><div class="td-sub muted">${t12(t.time)}</div></td>
        <td><b>${UI.esc(t.instrument || 'MNQ')}</b>${t.media && t.media.length ? ` <span class="td-clip" title="${t.media.length} attachment(s)">${UI.icon('image', '', 12)}</span>` : ''}</td>
        <td class="td-acc muted">${UI.esc(ac.alias || '—')}</td>
        <td>${sideTag(t.side)}</td>
        <td>${t.contracts || 0}</td>
        <td class="muted">${t.entry ? UI.price(t.entry) : '—'}</td>
        <td class="muted">${t.exit ? UI.price(t.exit) : '—'}</td>
        <td class="${UI.pnlClass(t.pnl)} bold">${UI.money(t.pnl, true)}</td>
        <td class="${UI.pnlClass(t.pnl)} small">${tradePct(t)}</td>
        <td class="muted small">${UI.dur(t.duration)}</td>
        <td>${statusPill(t.result)}</td>
      </tr>`;
    }).join('');
    return `<div class="table-wrap"><table class="trades">
      <thead><tr><th>Date / Time</th><th>Symbol</th><th>Account</th><th>Side</th><th>Qty</th><th>Entry</th><th>Exit</th><th>P&amp;L</th><th>%</th><th>Duration</th><th>Status</th></tr></thead>
      <tbody>${body}</tbody></table></div>${pager}`;
  }
  V.tradeTable = tradeTable;

  // -------- calendar with weekly column (TradeSyncer style) --------
  function calendarFull(key) {
    const map = Q.dayMap(key), cells = UI.monthMatrix(key), weeks = Q.weeklyRows(key), today = UI.todayISO();
    let html = `<div class="ts-cal">
      <div class="ts-cal-head">${UI.DOW.map(d => `<span>${d}</span>`).join('')}<span>Week</span></div>
      <div class="ts-cal-body">`;
    for (let w = 0; w < cells.length / 7; w++) {
      for (let i = 0; i < 7; i++) {
        const d = cells[w * 7 + i];
        if (!d) { html += `<div class="ts-cell empty"></div>`; continue; }
        const e = map[d], cls = !e ? 'none' : e.pnl > 0 ? 'up' : e.pnl < 0 ? 'down' : 'flat';
        html += `<button class="ts-cell ${cls} ${d === today ? 'today' : ''}" data-act="openDay" data-date="${d}">
          <span class="ts-d">${Number(d.slice(8))}</span>
          ${e ? `<span class="ts-pnl">${UI.bigK(e.pnl)}</span><span class="ts-wl">${e.w}W · ${e.l}L</span>` : ''}
        </button>`;
      }
      const wk = weeks[w] || { pnl: 0, n: 0 };
      html += `<div class="ts-week ${wk.pnl > 0 ? 'up' : wk.pnl < 0 ? 'down' : ''}">
        <span class="ts-wk-pnl">${UI.bigK(wk.pnl)}</span><span class="ts-wk-n muted">${wk.n} trades</span></div>`;
    }
    html += `</div></div>`;
    return html;
  }
  V.calendarFull = calendarFull;

  function calCard(key) {
    const st = Q.stats(Q.monthTrades(key));
    return `<div class="card">
      <div class="card-head">
        <div class="ch-t">${UI.logo(20)} NorthPoint Calendar</div>
        <div class="cal-nav"><button class="icobtn sm" data-act="prevMonth">${UI.icon('chevL', '', 15)}</button><b>${UI.monthLabel(key)}</b><button class="icobtn sm" data-act="nextMonth">${UI.icon('chevR', '', 15)}</button></div>
      </div>
      ${calendarFull(key)}
      <div class="cal-total">
        <span>Total: <b class="${UI.pnlClass(st.net)}">${UI.bigK(st.net)}</b></span>
        <div class="cal-counts">
          <span>${st.n}<small>Trades</small></span>
          <span class="up">${st.wins}<small>Wins</small></span>
          <span class="down">${st.losses}<small>Losses</small></span>
          <span class="muted">${st.be}<small>BE</small></span>
        </div>
      </div>
    </div>`;
  }

  function kpi(label, valueHtml, sub, cls) { return `<div class="card kpi"><div class="kpi-l">${label}</div><div class="kpi-v ${cls || ''}">${valueHtml}</div>${sub ? `<div class="kpi-s muted">${sub}</div>` : ''}</div>`; }

  // -------- HOME is defined in views-inicio.js (TradeSyncer-style Home) --------

  // -------- DASHBOARD (journal) --------
  V.dashboard = function () {
    const all = Q.allTrades(), key = App.period;
    const st = Q.stats(all), sc = Q.score();
    const best = Q.bestTrade(all), worst = Q.worstTrade(all);
    const cum = Q.cumulative(all);

    const top = `<div class="grid2-wide">
      <div class="card big-kpi">
        <div><div class="bk-l">PNL</div><div class="bk-v ${UI.pnlClass(st.net)}">${UI.bigK(st.net)}</div><div class="muted small">${st.n} trades</div></div>
        <div class="bk-circle ${UI.pnlClass(st.net)}">${UI.icon(st.net >= 0 ? 'trendUp' : 'trendDn', '', 26)}</div>
      </div>
      <div class="card big-kpi">
        <div><div class="bk-l">Profit Factor</div><div class="bk-v up">${st.profitFactor === Infinity ? '∞' : st.profitFactor}</div><div class="muted small">${st.profitFactor >= 1 ? 'Profitable' : 'In the red'}</div></div>
        ${UI.donut(Math.min(100, (st.profitFactor === Infinity ? 3 : st.profitFactor) / 3 * 100), 'var(--brand)')}
      </div>
    </div>`;

    const charts = `<div class="grid4">
      <div class="card chartcard"><div class="cc-l">NorthPoint Score</div><div class="score-wrap">${UI.scoreTri(sc.win, sc.profit, sc.risk)}<div class="score-v">${sc.value}<small> / 100</small></div></div><div class="score-bar"></div></div>
      <div class="card chartcard"><div class="cc-l">Cumulative PNL</div>${UI.areaChart(cum, '#22c55e')}<div class="muted small">${UI.dateUS('2026-06-21')} → ${UI.dateUS('2026-06-22')}</div></div>
      <div class="card chartcard"><div class="cc-l">Drawdown</div><svg class="spark" viewBox="0 0 300 90" preserveAspectRatio="none"><line x1="4" y1="20" x2="296" y2="20" stroke="#ef4444" stroke-width="2" stroke-dasharray="0"/></svg><div class="muted small">Current: <span class="up">$0.00</span></div></div>
      <div class="card chartcard"><div class="cc-l">PNL by day</div>${UI.barChart(Q.pnlByDay(key))}<div class="muted small">${UI.monthLabel(key)}</div></div>
    </div>`;

    const cards3 = `<div class="grid3">
      ${tradeStat('Best Trade', best, 'up')}
      <div class="card statcard"><div class="sc-l">Total Trades</div><div class="sc-v">${st.n}</div><div class="muted small">trades</div></div>
      ${tradeStat('Worst Trade', worst, 'down')}
    </div>`;

    const hist = `<div class="card"><div class="card-head"><div class="ch-t">${UI.icon('list', '', 18)} Trades History</div><button class="link" data-act="go" data-route="trades">View all</button></div>${tradeTable(Q.tradesDesc().slice(0, 10), false)}</div>`;

    return `<div class="page">${top}${charts}${calCard(key)}${cards3}${hist}</div>`;
  };

  function tradeStat(label, t, cls) {
    if (!t) return `<div class="card statcard"><div class="sc-l">${label}</div><div class="sc-v">—</div></div>`;
    return `<div class="card statcard"><div class="sc-l">${label} ${UI.icon(cls === 'up' ? 'trendUp' : 'trendDn', cls, 15)}</div>
      <div class="sc-v ${cls}">${UI.money(t.pnl, true)}</div>
      <div class="muted small">${t.contracts} ${t.instrument} ${t.side} · ${UI.dateUS(t.date)}</div></div>`;
  }

  // -------- TRADES --------
  V.trades = function () {
    const all = Q.allTrades(), st = Q.stats(all), best = Q.bestTrade(all);
    const cards = `<div class="grid4">
      ${kpi('Win Rate', st.winRate + '%', st.wins + 'W · ' + st.losses + 'L', st.winRate >= 50 ? 'up' : 'down')}
      ${kpi('Profit Factor', st.profitFactor === Infinity ? '∞' : st.profitFactor, 'Profitable', 'up')}
      ${kpi('Best Trade', UI.money(best ? best.pnl : 0, true), best ? best.contracts + ' ' + best.instrument : '', 'up')}
      ${kpi('Avg Win / Loss', UI.money((st.net && st.n) ? st.expectancy : 0, true), '+' + UI.money(st.avgWin) + ' / −' + UI.money(st.avgLoss))}
    </div>`;
    return `<div class="page">${cards}<div class="card"><div class="card-head"><div class="ch-t">${UI.icon('list', '', 18)} Trades History</div><button class="link" data-act="addTrade">+ Trade</button></div>${tradeTable(Q.tradesDesc(), true)}</div></div>`;
  };

  // -------- CALENDAR --------
  V.calendario = function () {
    const key = App.period, ts = Q.monthTrades(key), st = Q.stats(ts);
    const setups = Q.bySetup(ts);
    const setupCard = setups.length ? `<div class="card"><div class="card-head"><div class="ch-t">${UI.icon('bolt', '', 18)} By setup</div></div>
      ${setups.map(r => { const max = Math.max(...setups.map(x => Math.abs(x.net)), 1); return `<div class="setrow"><div class="set-top"><span>${UI.esc(Data.setupOf(r.setup).label)}</span><span class="${UI.pnlClass(r.net)} bold">${UI.money(r.net, true)}</span></div>${UI.bar(Math.abs(r.net), max, r.net >= 0 ? 'var(--up)' : 'var(--down)')}<div class="muted small mt6">${r.n} trades · ${r.winRate}% win</div></div>`; }).join('')}</div>` : '';
    return `<div class="page">${calCard(key)}
      <div class="grid4">
        ${kpi('Net for month', UI.bigK(st.net), st.n + ' trades', UI.pnlClass(st.net))}
        ${kpi('Win rate', st.winRate + '%', '')}
        ${kpi('Profit factor', st.profitFactor === Infinity ? '∞' : st.profitFactor, '', 'up')}
        ${kpi('Expectancy', UI.money(st.expectancy, true), 'per trade', UI.pnlClass(st.expectancy))}
      </div>${setupCard}</div>`;
  };

  // -------- ACCOUNTS --------
  V.cuentas = function () {
    const accs = App.db.accounts, months = Q.payoutsByMonth(), payouts = Q.payoutsDesc();
    const accCard = `<div class="card"><div class="card-head"><div class="ch-t">${UI.icon('building', '', 18)} Funded accounts</div><button class="link" data-act="addAccount">+ Account</button></div>
      <div class="table-wrap"><table class="trades acc-table"><thead><tr><th>Account</th><th>Firm</th><th>Phase</th><th>Size</th><th>P&amp;L</th><th>Balance</th><th>Status</th></tr></thead><tbody>
      ${accs.map(a => { const f = Data.firmOf(a.firm), ph = Data.phaseOf(a.phase), stt = Data.statusOf(a.status), p = Q.accPnl(a.id); return `<tr data-act="openAccount" data-id="${a.id}"><td><b>${UI.esc(a.alias)}</b></td><td>${UI.dot(f.color)} ${f.label}</td><td><span class="phase" style="color:${ph.color}">${ph.short}</span></td><td class="muted">${UI.usd(a.size)}</td><td class="${UI.pnlClass(p)} bold">${UI.money(p, true)}</td><td>${UI.usd(Q.accBalance(a))}</td><td><span class="pill ${a.status === 'quemada' ? 'loss' : 'win'}">${stt.label}</span></td></tr>`; }).join('')}
      </tbody></table></div></div>`;

    const payCard = `<div class="card"><div class="card-head"><div class="ch-t">${UI.icon('coin', '', 18)} Payouts</div><button class="link" data-act="addPayout">+ Payout</button></div>
      <div class="payhero"><div><div class="ph-k">Total paid out</div><div class="ph-v up">${UI.usd(Q.payoutsTotal())}</div></div><div class="ph-tag">${Q.payoutsCount()} cash-outs · avg ${UI.usd(Q.avgPayout())}</div></div>
      <div class="paymonths">${months.map(([k, v]) => `<div class="pm"><span>${UI.monthLabel(k)}</span><b class="up">${UI.usd(v)}</b></div>`).join('')}</div>
      <div class="paylist">${payouts.map(p => { const f = Data.firmOf(p.firm); return `<div class="payrow">${UI.dot(f.color)}<div class="pr-main"><div class="pr-firm">${f.label}</div><div class="muted small">${UI.dateLong(p.date)}</div></div><div class="pr-amt up">${UI.usd(p.amount)}</div><button class="icobtn sm" data-act="editPayout" data-id="${p.id}">${UI.icon('edit', '', 15)}</button></div>`; }).join('')}</div></div>`;

    return `<div class="page grid2-wide">${accCard}${payCard}</div>`;
  };

  // -------- WALLET (monthly expenses + profitability, customizable) --------
  V.cartera = function () {
    const inc = Q.monthlyIncome(), exp = Q.expensesTotal(), free = Q.freeCash(), rate = Q.savingsRate();
    const st = Q.stats(Q.allTrades());
    const expenses = Q.expenses(), pieSegs = Q.expensesPie();
    const avg = Q.avgPayout() > 0 ? Q.avgPayout() : (Q.money().base || 0);
    const payoutsForExp = avg > 0 && exp > 0 ? Math.ceil(exp / avg) : 0;

    const summary = `<div class="card snow-card glass">
      <div class="snow-card-l">
        <div class="eyebrow">${UI.icon('wallet', '', 15)} YOUR WALLET</div>
        <h1>What comes in, what goes out and what grows.</h1>
        <p class="muted">Your trading income minus your monthly expenses. What's left over feeds your Snowball.</p>
        <div class="cartera-flow">
          <div class="cf"><span class="muted small">Monthly income</span><b class="up">${UI.usd(inc)}</b></div>
          <span class="cf-op">−</span>
          <div class="cf"><span class="muted small">Monthly expenses</span><b class="down">${UI.usd(exp)}</b></div>
          <span class="cf-op">=</span>
          <div class="cf free"><span class="muted small">Free to invest</span><b class="ice">${UI.usd(free)}</b><span class="muted small">${rate}% of your income</span></div>
        </div>
      </div>
      <div class="snow-card-r"><div class="mini-snowball"><span class="ms-glow"></span><span class="ms-ball"></span></div></div>
    </div>`;

    const rentab = `<div class="card">
      <div class="card-head"><div class="ch-t">${UI.icon('trendUp', '', 18)} Your profitability</div><button class="link" data-act="go" data-route="dashboard">View journal</button></div>
      <div class="grid4">
        ${kpi('Capital generated', UI.usd(Q.payoutsTotal()), Q.payoutsCount() + ' payouts', 'up')}
        ${kpi('All-time PNL', UI.bigK(st.net), st.n + ' trades', UI.pnlClass(st.net))}
        ${kpi('Win rate', st.winRate + '%', '')}
        ${kpi('Profit factor', st.profitFactor === Infinity ? '∞' : st.profitFactor, '', 'up')}
      </div>
    </div>`;

    const gastos = `<div class="card">
      <div class="card-head"><div class="ch-t">${UI.icon('pie', '', 18)} Monthly expenses</div><button class="link" data-act="addExpense">+ Expense</button></div>
      ${expenses.length ? `<div class="pie-row">
        <div class="pie-wrap">${UI.pie(pieSegs, 200)}<div class="pie-center"><b>${UI.usd(exp)}</b><span class="muted small">per month</span></div></div>
        <div class="alloc-list">${expenses.map(e => `<button class="exp-row" data-act="editExpense" data-id="${e.id}">
          <span class="exp-ic" style="background:${(e.color || '#5fd0ff')}22;color:${e.color || '#5fd0ff'}">${UI.icon(e.icon || 'wallet', '', 16)}</span>
          <span class="exp-name">${UI.esc(e.name)}</span><span class="exp-amt">${UI.usd(e.amount)}</span></button>`).join('')}</div>
      </div>` : UI.empty('wallet', 'No expenses yet', 'Add your fixed expenses to see your flow.')}
      ${exp > 0 ? `<div class="cartera-need">${UI.icon('coin', '', 16)} <span>To cover your <b>${UI.usd(exp)}/mo</b> in expenses you need to generate ≈ <b>${payoutsForExp} payout${payoutsForExp !== 1 ? 's' : ''} a month</b> (of ${UI.usd(avg)} each). Anything extra is growth.</span></div>` : ''}
    </div>`;

    return `<div class="page">${summary}${rentab}${gastos}<div class="spacer"></div></div>`;
  };

  // -------- SHEETS --------
  V.daySheet = function (date) {
    const ts = Q.dayTrades(date).slice().sort((a, b) => (a.time < b.time ? -1 : 1)), net = Q.dayPnl(date), st = Q.stats(ts);
    return `<div class="sheet-head"><div class="h2">${UI.dateLong(date)}</div><div class="day-net ${UI.pnlClass(net)}">${UI.pnl(net)} <span class="muted small">· ${st.wins}W ${st.losses}L</span></div></div>
      ${ts.length ? tradeTable(ts, false) : UI.empty('candles', 'No trades this day')}
      <button class="btn btn-primary full mt8" data-act="addTradeFor" data-date="${date}">${UI.icon('plus', '', 16)} Add a trade for this day</button>`;
  };

  V.accountSheet = function (id) {
    const a = Q.accById(id); if (!a) return '';
    const f = Data.firmOf(a.firm), ph = Data.phaseOf(a.phase), stt = Data.statusOf(a.status);
    const p = Q.accPnl(a.id), st = Q.stats(Q.accTrades(a.id));
    return `<div class="sheet-head"><div class="h2">${UI.dot(f.color)} ${UI.esc(a.alias)}</div><div class="muted small">${f.label} · ${UI.usd(a.size)} · <span style="color:${stt.color}">${stt.label}</span></div></div>
      <div class="grid2 mb12"><div class="card statbox"><div class="sb-val">${UI.usd(Q.accBalance(a))}</div><div class="sb-lbl">Estimated balance</div></div><div class="card statbox"><div class="sb-val ${UI.pnlClass(p)}">${UI.money(p, true)}</div><div class="sb-lbl">P&amp;L</div></div></div>
      <div class="phasebar mb12">${Data.PHASES.map(x => `<span class="pbi ${x.id === a.phase ? 'on' : ''}" style="${x.id === a.phase ? `background:${x.color}22;color:${x.color};border-color:${x.color}66` : ''}">${x.short}</span>`).join('')}</div>
      <div class="muted small mb6">Recent trades</div>${tradeTable(Q.accTrades(a.id).slice().sort((x, y) => (x.date < y.date ? 1 : -1)).slice(0, 8), false)}
      <div class="btn-row mt12"><button class="btn btn-ghost" data-act="editAccount" data-id="${a.id}">${UI.icon('edit', '', 15)} Edit</button><button class="btn btn-danger" data-act="delAccount" data-id="${a.id}">Delete</button></div>`;
  };
})();
