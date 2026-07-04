/* ============ NorthPoint · Snowball · Money Management ============ */
window.Views = window.Views || {};
(() => {
  const V = window.Views;
  const money = () => App.db.money || Data.MONEY;
  const baseAmt = () => Math.round(Q.avgPayout() > 0 ? Q.avgPayout() : money().base);

  function legend(allocs, monthly) {
    return `<div class="alloc-list">${allocs.map(a => `<div class="alloc">
      <span class="alloc-dot" style="background:${a.color}"></span>
      <div class="alloc-main"><div class="alloc-top"><span class="alloc-name">${UI.esc(a.name)}</span><span class="alloc-pct">${a.pct}%</span></div>
        <div class="alloc-sub muted small">${UI.esc(a.desc || '')} · <b>${UI.usd(monthly * a.pct / 100)}</b>/mo</div></div>
    </div>`).join('')}</div>`;
  }

  // -------- Snowball page --------
  V.snowball = function () {
    const m = money();
    const base = baseAmt();
    const perMonth = base * (m.payoutsMes || 4);
    const allocs = m.allocations;
    const snowPct = allocs.filter(a => a.id === 'reinvest' || a.id === 'invest').reduce((s, a) => s + a.pct, 0);
    const snowMonthly = perMonth * snowPct / 100;

    const hero = `<div class="card snow-card glass">
      <div class="snow-card-l">
        <div class="eyebrow">${UI.icon('snow', '', 15)} SNOWBALL · MONEY MANAGEMENT</div>
        <h1>Grow your wealth like a snowball.</h1>
        <p class="muted">Every payout gets split — part is <b>reinvested</b> and part is <b>invested</b>. Over time, compound interest grows it on its own. You just respect the percentages.</p>
      </div>
      <div class="snow-card-r"><div class="mini-snowball"><span class="ms-glow"></span><span class="ms-ball"></span></div></div>
    </div>`;

    // pie wheel (split)
    const reparto = `<div class="card">
      <div class="card-head"><div class="ch-t">${UI.icon('pie', '', 18)} Split of each payout</div>
        <button class="link" data-act="editMoney">Edit %</button></div>
      <div class="pie-row">
        <div class="pie-wrap">${UI.pie(allocs, 200)}<div class="pie-center"><b>${UI.usd(base)}</b><span class="muted small">per payout</span></div></div>
        ${legend(allocs, perMonth)}
      </div>
      <div class="muted small mt12">Base: your average payout (${UI.usd(base)}). Edit the % to fit your reality.</div>
    </div>`;

    return `<div class="page">${hero}${reparto}${portfolio()}<div class="spacer"></div></div>`;
  };

  // -------- goal calculator: set an amount → how much/month and how long --------
  function goalCalc(perMonth, allocs) {
    const m = money();
    const target = Math.round(m.goalTarget || 1000000);
    const rate = m.goalRate || 10;
    const r = rate / 100 / 12;
    const investPct = allocs.filter(a => a.id === 'invest' || a.id === 'reinvest').reduce((s, a) => s + a.pct, 0);
    const myContrib = Math.round(perMonth * investPct / 100);
    const pmtFor = n => (r > 0 ? target * r / (Math.pow(1 + r, n) - 1) : target / n);
    const rows = [5, 10, 15, 20, 25, 30].map(Y =>
      `<div class="goal-row"><span class="gr-yr">In ${Y} years</span><b class="gr-amt">${UI.usd(pmtFor(Y * 12))}<small>/mo</small></b></div>`).join('');
    let current = '';
    if (myContrib > 0 && target > 0) {
      const n = Math.log(1 + target * r / myContrib) / Math.log(1 + r);
      const years = n / 12;
      current = `With your current contribution of <b>${UI.usd(myContrib)}/mo</b> you reach <b>${UI.usd(target)}</b> in <b>~${years.toFixed(1)} years</b> (at ${rate}% annual).`;
    }
    const tiers = [8, 10, 12, 15].map(rt => `<button class="tier ${rt === rate ? 'on' : ''}" data-act="setGoalRate" data-r="${rt}">${rt}%</button>`).join('');
    return `<div class="card">
      <div class="card-head"><div class="ch-t">${UI.icon('target', '', 18)} Goal calculator</div></div>
      <p class="muted small mb12">Set how much you want to have and I'll tell you how much to invest per month — and how long it takes.</p>
      <div class="goal-top">
        <label class="pc-field"><span class="muted small">Your goal</span><div class="pc-in"><span class="pc-cur">$</span><input class="input" data-change="setGoalTarget" value="${target}" inputmode="numeric" autocomplete="off" /></div></label>
        <div class="goal-rate"><span class="muted small">Annual return</span><div class="tiers">${tiers}</div></div>
      </div>
      <div class="step-lbl mt12">How much to invest per month to reach ${UI.usd(target)}:</div>
      <div class="goal-grid">${rows}</div>
      ${current ? `<div class="goal-current mt12">${UI.icon('snow', '', 15)} ${current}</div>` : ''}
      <div class="disc muted small mt12">Compound interest calculation (monthly contributions). Illustrative figures.</div>
    </div>`;
  }

  // -------- Wallet (monthly flow + customizable expenses) --------
  function carteraBlock() {
    const inc = Q.monthlyIncome(), exp = Q.expensesTotal(), free = Q.freeCash(), rate = Q.savingsRate();
    const expenses = Q.expenses(), pieSegs = Q.expensesPie();
    const flujo = `<div class="card">
      <div class="card-head"><div class="ch-t">${UI.icon('wallet', '', 18)} Your wallet · monthly flow</div></div>
      <div class="cartera-flow">
        <div class="cf"><span class="muted small">Monthly income</span><b class="up">${UI.usd(inc)}</b></div>
        <span class="cf-op">−</span>
        <div class="cf"><span class="muted small">Monthly expenses</span><b class="down">${UI.usd(exp)}</b></div>
        <span class="cf-op">=</span>
        <div class="cf free"><span class="muted small">Free for your Snowball</span><b class="ice">${UI.usd(free)}</b><span class="muted small">${rate}% of your income</span></div>
      </div>
      <div class="muted small mt12">What's left free each month is what feeds your snowball.</div>
    </div>`;
    const gastos = `<div class="card">
      <div class="card-head"><div class="ch-t">${UI.icon('pie', '', 18)} Monthly expenses</div><button class="link" data-act="addExpense">+ Expense</button></div>
      ${expenses.length ? `<div class="pie-row">
        <div class="pie-wrap">${UI.pie(pieSegs, 200)}<div class="pie-center"><b>${UI.usd(exp)}</b><span class="muted small">per month</span></div></div>
        <div class="alloc-list">${expenses.map(e => `<button class="exp-row" data-act="editExpense" data-id="${e.id}">
          <span class="exp-ic" style="background:${(e.color || '#5fd0ff')}22;color:${e.color || '#5fd0ff'}">${UI.icon(e.icon || 'wallet', '', 16)}</span>
          <span class="exp-name">${UI.esc(e.name)}</span><span class="exp-amt">${UI.usd(e.amount)}</span></button>`).join('')}</div>
      </div>` : UI.empty('wallet', 'No expenses yet', 'Add your fixed expenses to see your flow.')}
    </div>`;
    return flujo + gastos;
  }

  // -------- AI Portfolio 2040 --------
  function portfolio() {
    const p = Data.PORTFOLIO;
    const assets = p.assets.map(a => `<div class="asset"><div class="asset-l"><b>${a[0]}</b><span class="muted small">${UI.esc(a[1])}</span></div><span class="asset-pct">${a[2]}%</span></div>`).join('');
    return `<div class="card">
      <div class="card-head"><div class="ch-t">${UI.icon('chart', '', 18)} Where your investment goes · Generational AI Portfolio 2040</div></div>
      <div class="muted small mb12">${UI.esc(p.perfil)} · AI, semiconductors, digital infrastructure and blockchain.</div>
      <div class="pie-row">
        <div class="pie-wrap">${UI.pie(p.sectors, 200)}<div class="pie-center"><b>2040</b><span class="muted small">thesis</span></div></div>
        <div class="alloc-list">${p.sectors.map(s => `<div class="alloc"><span class="alloc-dot" style="background:${s.color}"></span><div class="alloc-main"><div class="alloc-top"><span class="alloc-name">${UI.esc(s.name)}</span><span class="alloc-pct">${s.pct}%</span></div></div></div>`).join('')}</div>
      </div>
      <div class="muted small mt12 mb6">Master portfolio</div>
      <div class="assets-grid">${assets}</div>
    </div>`;
  }

  // -------- edit % form --------
  V.moneyForm = function () {
    const m = money();
    return `<div class="sheet-head"><div class="h2">Edit split</div><div class="muted small">Adjust the % (they normalize to 100).</div></div>
      <div class="form">${m.allocations.map(a => `<label class="field"><span class="f-lbl"><span class="alloc-dot" style="background:${a.color}"></span> ${UI.esc(a.name)}</span>
        <input class="input" id="alloc-${a.id}" value="${a.pct}" type="text" inputmode="numeric" /></label>`).join('')}
        ${Forms.field('Payouts per month', `<input class="input" id="alloc-mes" value="${m.payoutsMes}" type="text" inputmode="numeric" />`)}
      </div>
      <div class="btn-row mt8"><button class="btn btn-ghost" data-act="closeSheet">Cancel</button><button class="btn btn-primary" data-act="saveMoney">Save</button></div>`;
  };
})();
