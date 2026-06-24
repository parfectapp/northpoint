/* ============ RACHA · Snowball · Money Management ============ */
window.Views = window.Views || {};
(() => {
  const V = window.Views;
  const money = () => App.db.money || Data.MONEY;
  const baseAmt = () => Math.round(Q.avgPayout() > 0 ? Q.avgPayout() : money().base);

  function legend(allocs, monthly) {
    return `<div class="alloc-list">${allocs.map(a => `<div class="alloc">
      <span class="alloc-dot" style="background:${a.color}"></span>
      <div class="alloc-main"><div class="alloc-top"><span class="alloc-name">${UI.esc(a.name)}</span><span class="alloc-pct">${a.pct}%</span></div>
        <div class="alloc-sub muted small">${UI.esc(a.desc || '')} · <b>${UI.usd(monthly * a.pct / 100)}</b>/mes</div></div>
    </div>`).join('')}</div>`;
  }

  // -------- página Snowball --------
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
        <h1>Haz crecer tu riqueza como una bola de nieve.</h1>
        <p class="muted">Cada payout se divide, una parte se <b>reinvierte</b> y otra se <b>invierte</b>. Con el tiempo, el interés compuesto la hace crecer sola. Tú solo respetas los porcentajes.</p>
      </div>
      <div class="snow-card-r"><div class="mini-snowball"><span class="ms-glow"></span><span class="ms-ball"></span></div></div>
    </div>`;

    // rueda de quesos (reparto)
    const reparto = `<div class="card">
      <div class="card-head"><div class="ch-t">${UI.icon('pie', '', 18)} Reparto de cada payout</div>
        <button class="link" data-act="editMoney">Editar %</button></div>
      <div class="pie-row">
        <div class="pie-wrap">${UI.pie(allocs, 200)}<div class="pie-center"><b>${UI.usd(base)}</b><span class="muted small">por payout</span></div></div>
        ${legend(allocs, perMonth)}
      </div>
      <div class="muted small mt12">Base: tu payout promedio (${UI.usd(base)}). Edita los % para ajustarlo a tu realidad.</div>
    </div>`;

    return `<div class="page">${hero}${reparto}${growthPlan(perMonth, allocs)}${goalCalc(perMonth, allocs)}${portfolio()}<div class="spacer"></div></div>`;
  };

  // -------- calculadora de meta: pon un monto → cuánto/mes y en cuánto tiempo --------
  function goalCalc(perMonth, allocs) {
    const m = money();
    const target = Math.round(m.goalTarget || 1000000);
    const rate = m.goalRate || 10;
    const r = rate / 100 / 12;
    const investPct = allocs.filter(a => a.id === 'invest' || a.id === 'reinvest').reduce((s, a) => s + a.pct, 0);
    const myContrib = Math.round(perMonth * investPct / 100);
    const pmtFor = n => (r > 0 ? target * r / (Math.pow(1 + r, n) - 1) : target / n);
    const rows = [5, 10, 15, 20, 25, 30].map(Y =>
      `<div class="goal-row"><span class="gr-yr">En ${Y} años</span><b class="gr-amt">${UI.usd(pmtFor(Y * 12))}<small>/mes</small></b></div>`).join('');
    let current = '';
    if (myContrib > 0 && target > 0) {
      const n = Math.log(1 + target * r / myContrib) / Math.log(1 + r);
      const years = n / 12;
      current = `Con tu aporte actual de <b>${UI.usd(myContrib)}/mes</b> llegas a <b>${UI.usd(target)}</b> en <b>~${years.toFixed(1)} años</b> (a ${rate}% anual).`;
    }
    const tiers = [8, 10, 12, 15].map(rt => `<button class="tier ${rt === rate ? 'on' : ''}" data-act="setGoalRate" data-r="${rt}">${rt}%</button>`).join('');
    return `<div class="card">
      <div class="card-head"><div class="ch-t">${UI.icon('target', '', 18)} Calculadora de meta</div></div>
      <p class="muted small mb12">Pon cuánto quieres llegar a tener y te digo cuánto invertir al mes — y en cuánto tiempo lo logras.</p>
      <div class="goal-top">
        <label class="pc-field"><span class="muted small">Tu meta</span><div class="pc-in"><span class="pc-cur">$</span><input class="input" data-change="setGoalTarget" value="${target}" inputmode="numeric" autocomplete="off" /></div></label>
        <div class="goal-rate"><span class="muted small">Rendimiento anual</span><div class="tiers">${tiers}</div></div>
      </div>
      <div class="step-lbl mt12">Cuánto invertir al mes para llegar a ${UI.usd(target)}:</div>
      <div class="goal-grid">${rows}</div>
      ${current ? `<div class="goal-current mt12">${UI.icon('snow', '', 15)} ${current}</div>` : ''}
      <div class="disc muted small mt12">Cálculo con interés compuesto (aportes mensuales). Cifras ilustrativas.</div>
    </div>`;
  }

  // -------- Cartera (flujo del mes + gastos personalizables) --------
  function carteraBlock() {
    const inc = Q.monthlyIncome(), exp = Q.expensesTotal(), free = Q.freeCash(), rate = Q.savingsRate();
    const expenses = Q.expenses(), pieSegs = Q.expensesPie();
    const flujo = `<div class="card">
      <div class="card-head"><div class="ch-t">${UI.icon('wallet', '', 18)} Tu cartera · flujo del mes</div></div>
      <div class="cartera-flow">
        <div class="cf"><span class="muted small">Ingreso del mes</span><b class="up">${UI.usd(inc)}</b></div>
        <span class="cf-op">−</span>
        <div class="cf"><span class="muted small">Gastos del mes</span><b class="down">${UI.usd(exp)}</b></div>
        <span class="cf-op">=</span>
        <div class="cf free"><span class="muted small">Libre para tu Snowball</span><b class="ice">${UI.usd(free)}</b><span class="muted small">${rate}% de tu ingreso</span></div>
      </div>
      <div class="muted small mt12">Lo que te queda libre cada mes es lo que alimenta tu bola de nieve.</div>
    </div>`;
    const gastos = `<div class="card">
      <div class="card-head"><div class="ch-t">${UI.icon('pie', '', 18)} Gastos del mes</div><button class="link" data-act="addExpense">+ Gasto</button></div>
      ${expenses.length ? `<div class="pie-row">
        <div class="pie-wrap">${UI.pie(pieSegs, 200)}<div class="pie-center"><b>${UI.usd(exp)}</b><span class="muted small">al mes</span></div></div>
        <div class="alloc-list">${expenses.map(e => `<button class="exp-row" data-act="editExpense" data-id="${e.id}">
          <span class="exp-ic" style="background:${(e.color || '#5fd0ff')}22;color:${e.color || '#5fd0ff'}">${UI.icon(e.icon || 'wallet', '', 16)}</span>
          <span class="exp-name">${UI.esc(e.name)}</span><span class="exp-amt">${UI.usd(e.amount)}</span></button>`).join('')}</div>
      </div>` : UI.empty('wallet', 'Sin gastos todavía', 'Agrega tus gastos fijos para ver tu flujo.')}
    </div>`;
    return flujo + gastos;
  }

  // -------- plan de crecimiento --------
  function growthPlan(perMonth, allocs) {
    const sc = Data.PORTFOLIO.scenarios;
    const idx = Math.min(sc.length - 1, App.scenario);
    const chosen = sc[idx];
    const investPct = allocs.filter(a => a.id === 'invest' || a.id === 'reinvest').reduce((s, a) => s + a.pct, 0);
    const myContrib = Math.round(perMonth * investPct / 100);

    // curva compuesta ilustrativa (20 años, 10% anual)
    const r = 0.10 / 12; let cap = 0; const pts = [];
    for (let mo = 1; mo <= 240; mo++) { cap = cap * (1 + r) + chosen.monthly; if (mo % 12 === 0) pts.push(cap); }

    const tiers = sc.map((s, i) => `<button class="tier ${i === idx ? 'on' : ''}" data-act="setScenario" data-i="${i}">$${s.monthly.toLocaleString('en-US')}/mes</button>`).join('');
    const rateInfo = { 8: 'Conservador', 10: 'Mercado · S&P 500', 12: 'Agresivo', 15: 'Muy agresivo' };
    const rates = [8, 10, 12, 15].map(rt => `<div class="rate">
      <div class="rate-top"><span class="rate-r">${rt}%</span><span class="rate-yr">al año</span></div>
      <div class="rate-desc">${rateInfo[rt]}</div>
      <b class="rate-v">${chosen.r[rt]}</b>
      <span class="rate-sub">acumulado</span>
    </div>`).join('');

    return `<div class="card">
      <div class="card-head"><div class="ch-t">${UI.icon('snow', '', 18)} Plan de crecimiento Snowball</div></div>
      <div class="step-lbl">1 · ¿Cuánto inviertes al mes?</div>
      <div class="tiers">${tiers}</div>
      <div class="muted small mt6">Según tu reparto actual inviertes ≈ <b>${UI.usd(myContrib)}/mes</b>.</div>
      <div class="step-lbl mt12">2 · Lo que tendrías acumulado en 20-30 años, según el rendimiento anual:</div>
      <div class="snow-proj">
        <div class="proj-chart">${UI.areaChart(pts, '#5fd0ff')}<div class="muted small">Proyección · ${chosen.aportado} aportado en total</div></div>
        <div class="proj-rates"><div class="rates">${rates}</div></div>
      </div>
      <div class="disc muted small mt12">Cifras ilustrativas con interés compuesto. No es asesoría financiera; la inversión implica riesgo.</div>
    </div>`;
  }

  // -------- portafolio IA 2040 --------
  function portfolio() {
    const p = Data.PORTFOLIO;
    const assets = p.assets.map(a => `<div class="asset"><div class="asset-l"><b>${a[0]}</b><span class="muted small">${UI.esc(a[1])}</span></div><span class="asset-pct">${a[2]}%</span></div>`).join('');
    return `<div class="card">
      <div class="card-head"><div class="ch-t">${UI.icon('chart', '', 18)} A dónde va tu inversión · Portafolio IA Generacional 2040</div></div>
      <div class="muted small mb12">${UI.esc(p.perfil)} · IA, semiconductores, infraestructura digital y blockchain.</div>
      <div class="pie-row">
        <div class="pie-wrap">${UI.pie(p.sectors, 200)}<div class="pie-center"><b>2040</b><span class="muted small">tesis</span></div></div>
        <div class="alloc-list">${p.sectors.map(s => `<div class="alloc"><span class="alloc-dot" style="background:${s.color}"></span><div class="alloc-main"><div class="alloc-top"><span class="alloc-name">${UI.esc(s.name)}</span><span class="alloc-pct">${s.pct}%</span></div></div></div>`).join('')}</div>
      </div>
      <div class="muted small mt12 mb6">Portafolio maestro</div>
      <div class="assets-grid">${assets}</div>
    </div>`;
  }

  // -------- form editar % --------
  V.moneyForm = function () {
    const m = money();
    return `<div class="sheet-head"><div class="h2">Editar reparto</div><div class="muted small">Ajusta los % (se normalizan a 100).</div></div>
      <div class="form">${m.allocations.map(a => `<label class="field"><span class="f-lbl"><span class="alloc-dot" style="background:${a.color}"></span> ${UI.esc(a.name)}</span>
        <input class="input" id="alloc-${a.id}" value="${a.pct}" type="text" inputmode="numeric" /></label>`).join('')}
        ${Forms.field('Payouts al mes', `<input class="input" id="alloc-mes" value="${m.payoutsMes}" type="text" inputmode="numeric" />`)}
      </div>
      <div class="btn-row mt8"><button class="btn btn-ghost" data-act="closeSheet">Cancelar</button><button class="btn btn-primary" data-act="saveMoney">Guardar</button></div>`;
  };
})();
