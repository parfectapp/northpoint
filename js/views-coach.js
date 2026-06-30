/* ============ NorthPoint · Coach (memoria + análisis de tu operativa) ============
   Lee TODOS tus trades (tu "memoria") y saca patrones accionables:
   por hora, lado, día, setup y emoción. Genera reglas mecanizables
   para el bot y mejora mes a mes conforme registras más operaciones. */
window.Views = window.Views || {};
(() => {
  const V = window.Views;
  const MIN = 8; // muestra mínima para análisis confiable

  // ---- helpers de agrupación (usan Q.stats) ----
  const closed = ts => ts.filter(t => t.result !== 'be');
  function groupRows(arr, keyFn, labelFn) {
    const m = {};
    arr.forEach(t => { const k = keyFn(t); if (k === null || k === undefined || k === '') return; (m[k] = m[k] || []).push(t); });
    return Object.keys(m).map(k => ({ key: k, label: labelFn(k, m[k]), ts: m[k], ...Q.stats(m[k]) }));
  }
  const hourOf = t => { const h = parseInt((t.time || '').slice(0, 2), 10); return isNaN(h) ? null : h; };
  const WD = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
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

  // ---- motor de insights (el "coach que aprende") ----
  function insights(all) {
    const out = [], cl = closed(all), st = Q.stats(all);

    // 1) ¿hay ventaja?
    if (st.expectancy > 0)
      out.push({ tone: 'good', ic: 'trendUp', title: `Tienes ventaja real: +${UI.money(st.expectancy)} por trade`,
        text: `En ${st.n} trades tu Profit Factor es ${pfTxt(st)} y tu win rate ${st.winRate}%. Esto es lo que el bot debe replicar exactamente.` });
    else
      out.push({ tone: 'bad', ic: 'trendDn', title: `Aún sin ventaja: ${UI.money(st.expectancy, true)} por trade`,
        text: `Profit Factor ${pfTxt(st)} en ${st.n} trades. La meta es pasar de 1.0. Abajo te muestro dónde se está yendo el dinero.` });

    // 2) lado (largo vs corto)
    const sd = groupRows(cl, t => t.side, k => (k === 'long' ? 'Largos' : 'Cortos')).filter(r => r.n >= 4);
    if (sd.length === 2) {
      const [a, b] = sd.sort((x, y) => y.expectancy - x.expectancy);
      if (a.expectancy > 0 && (a.expectancy - b.expectancy) > 12)
        out.push({ tone: 'tip', ic: 'bolt', title: `Ganas más en ${a.label.toLowerCase()} que en ${b.label.toLowerCase()}`,
          text: `${a.label}: ${a.winRate}% win, ${UI.money(a.expectancy, true)}/trade. ${b.label}: ${b.winRate}% win, ${UI.money(b.expectancy, true)}/trade.`,
          rule: `El bot prioriza ${a.label.toLowerCase()} y filtra o baja tamaño en ${b.label.toLowerCase()}.` });
    }

    // 3) ventana horaria
    const hr = groupRows(cl, hourOf, k => `${String(k).padStart(2, '0')}:00`).filter(r => r.n >= 3);
    if (hr.length >= 2) {
      const best = hr.slice().sort((x, y) => y.expectancy - x.expectancy)[0];
      const worst = hr.slice().sort((x, y) => x.expectancy - y.expectancy)[0];
      if (best.key !== worst.key && worst.expectancy < 0 && best.expectancy > 0)
        out.push({ tone: 'tip', ic: 'clock', title: `Tu mejor hora es la de ${best.label}`,
          text: `A las ${best.label} tu expectativa es ${UI.money(best.expectancy, true)}/trade. A las ${worst.label} es ${UI.money(worst.expectancy, true)} — ahí sueles perder.`,
          rule: `El bot solo entra en tu ventana ganadora y se apaga en las horas donde históricamente pierdes.` });
    }

    // 4) emoción (FOMO / revancha)
    const badEmo = cl.filter(t => t.emotion === 'fomo' || t.emotion === 'revancha');
    if (badEmo.length >= 3) {
      const s = Q.stats(badEmo);
      if (s.net < 0)
        out.push({ tone: 'bad', ic: 'flame', title: `FOMO y revancha te cuestan ${UI.money(Math.abs(s.net))}`,
          text: `${badEmo.length} trades por impulso con ${s.winRate}% de aciertos. Esto es exactamente lo que un bot elimina sin esfuerzo.`,
          rule: `Disciplina automática: tras tu límite de pérdidas, el bot bloquea más entradas (cero revancha).` });
    }

    // 5) día de la semana flojo
    const wd = groupRows(cl, wdOf, k => WD[k]).filter(r => r.n >= 3);
    if (wd.length >= 3) {
      const worst = wd.slice().sort((x, y) => x.net - y.net)[0];
      if (worst.net < 0)
        out.push({ tone: 'tip', ic: 'cal', title: `Cuídate los ${worst.label.toLowerCase()}`,
          text: `Los ${worst.label.toLowerCase()} acumulas ${UI.money(worst.net, true)} en ${worst.n} trades (${worst.winRate}% win).`,
          rule: `Opcional: el bot no opera o baja tamaño los ${worst.label.toLowerCase()}.` });
    }

    // 6) mejor setup
    const setups = Q.bySetup(cl).filter(r => r.n >= 3);
    if (setups.length >= 2 && setups[0].net > 0) {
      const bs = setups[0];
      out.push({ tone: 'good', ic: 'candles', title: `Tu setup más rentable: ${Data.setupOf(bs.setup).label}`,
        text: `${UI.money(bs.net, true)} en ${bs.n} trades, ${bs.winRate}% win, PF ${pfTxt(bs)}.`,
        rule: `El bot prioriza ${Data.setupOf(bs.setup).label} y vigila su decaimiento mes a mes.` });
    }

    // 7) disciplina de rachas
    const sk = streaks(all);
    if (sk.maxLoss >= 3)
      out.push({ tone: 'tip', ic: 'shield', title: `Tu peor racha fue de ${sk.maxLoss} pérdidas seguidas`,
        text: `Ahí es donde se quema la cuenta. Tu regla "W = stop / si pierdes, remas" existe justo por esto.`,
        rule: `El bot corta el día al llegar a tu máximo de pérdidas — sin una sola excepción.` });

    return out;
  }

  // ---- render de un desglose con barras ----
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

  // ---- VISTA COACH ----
  V.coach = function () {
    const all = Q.allTrades();
    const st = Q.stats(all);

    const hero = `<div class="card coach-hero glass">
      <div class="coach-hero-l">
        <div class="eyebrow">${UI.icon('cockpit', '', 15)} COACH · MEMORIA DE TU OPERATIVA</div>
        <h1>El bot aprende de cada trade que registras.</h1>
        <p class="muted">Esta es la memoria que analiza tu historial y convierte tu criterio en <b>reglas mecanizables</b>. Mientras más operas y registras, más afina — y más cerca queda de automatizarse.</p>
      </div>
      <div class="coach-hero-r"><div class="coach-orb"><span></span><span></span><span></span></div></div>
    </div>`;

    if (all.length < MIN) {
      return `<div class="page">${hero}
        <div class="card">${UI.empty('cockpit', `Necesito al menos ${MIN} trades para analizar tu operativa`,
          `Llevas ${all.length}. Registra tus operaciones (o conéctalas desde Tradovate) y aquí aparecerá tu análisis con reglas para el bot.`)}
          <div class="btn-row mt12" style="justify-content:center">
            <button class="btn btn-primary" data-act="addTrade">${UI.icon('plus', '', 16)} Agregar trade</button>
            <button class="btn btn-ghost" data-act="connectTradovate">${UI.icon('plug', '', 16)} Conectar Tradovate</button>
          </div>
        </div></div>`;
    }

    const kpis = `<div class="grid4">
      ${kpi('Expectativa / trade', UI.money(st.expectancy, true), st.expectancy > 0 ? 'tienes ventaja' : 'aún en rojo', UI.pnlClass(st.expectancy))}
      ${kpi('Profit Factor', pfTxt(st), st.profitFactor >= 1 ? 'rentable' : 'bajo 1.0', st.profitFactor >= 1 ? 'up' : 'down')}
      ${kpi('Win Rate', st.winRate + '%', st.wins + 'W · ' + st.losses + 'L')}
      ${kpi('Memoria', st.n + ' trades', 'analizados')}
    </div>`;

    const ins = insights(all);
    const insCard = `<div class="card">
      <div class="card-head"><div class="ch-t">${UI.icon('bolt', '', 18)} Lo que veo en tu operativa</div></div>
      <div class="coach-insights">${ins.map(i => `<div class="insight">
        <div class="ins-badge ${i.tone}">${UI.icon(i.ic, '', 18)}</div>
        <div class="ins-body">
          <div class="ins-title">${i.title}</div>
          <div class="ins-text">${i.text}</div>
          ${i.rule ? `<div class="ins-rule">${UI.icon('cockpit', '', 13)} Regla para el bot: ${i.rule}</div>` : ''}
        </div>
      </div>`).join('')}</div>
    </div>`;

    // reglas compiladas para automatizar
    const reglas = ins.filter(i => i.rule);
    const reglasCard = reglas.length ? `<div class="card coach-rules">
      <div class="card-head"><div class="ch-t">${UI.icon('shield', '', 18)} Reglas para automatizar</div><span class="muted small">${reglas.length} regla${reglas.length !== 1 ? 's' : ''}</span></div>
      <ol class="rule-list">${reglas.map(i => `<li>${UI.esc(i.rule)}</li>`).join('')}</ol>
      <p class="muted small mt8">Estas son las reglas que sacamos de TU historial. Conforme registres más trades, se ajustan y validamos cada mes antes de meterlas al bot.</p>
    </div>` : '';

    const cl = closed(all);
    const desgloses = `<div class="grid2-wide">
      ${breakdown('Por hora del día', 'clock', groupRows(cl, hourOf, k => `${String(k).padStart(2, '0')}:00`), (a, b) => Number(a.key) - Number(b.key))}
      ${breakdown('Por lado', 'share', groupRows(cl, t => t.side, k => (k === 'long' ? 'Largos' : 'Cortos')))}
      ${breakdown('Por día de la semana', 'cal', groupRows(cl, wdOf, k => WD[k]), (a, b) => Number(a.key) - Number(b.key))}
      ${breakdown('Por setup', 'candles', Q.bySetup(cl).map(r => ({ ...r, label: Data.setupOf(r.setup).label })))}
      ${breakdown('Por emoción', 'flame', groupRows(cl, t => t.emotion || 'neutral', k => emoLabel(k)))}
    </div>`;

    const foot = `<div class="card coach-foot">
      <p class="muted small">⚠️ El bot no será "más listo" que tú — será <b>más disciplinado</b>: ejecuta tus reglas sin emoción, sin revancha, con el mismo riesgo siempre. Ese es el edge real. Y todo esto mejora solo conforme alimentes tu memoria con cada trade.</p>
      <div class="btn-row"><button class="btn btn-primary" data-act="addTrade">${UI.icon('plus', '', 16)} Registrar trade</button><button class="btn btn-ghost" data-act="exportCSV">${UI.icon('download', '', 16)} Exportar para el bot</button></div>
    </div>`;

    return `<div class="page">${hero}${kpis}${insCard}${reglasCard}${desgloses}${foot}</div>`;
  };
})();
