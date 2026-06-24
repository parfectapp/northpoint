/* ============ RACHA · App shell (escritorio, sidebar), router y acciones ============ */
const App = (() => {
  let db = Store.load();
  const state = { period: UI.todayKey(), lessonId: null, tradePage: 1, sidebar: false, scenario: 2 };
  let route = db.meta.onboarded ? 'inicio' : 'landing';

  let slide = false; // dispara la transición 3D solo al cambiar de sección
  function save() { Store.save(db); }
  function go(r) { slide = true; route = r; state.sidebar = false; window.scrollTo(0, 0); document.querySelector('.content')?.scrollTo(0, 0); render(); }

  const NAV = [
    { r: 'inicio', ic: 'home', label: 'Inicio' },
    { r: 'academia', ic: 'academy', label: 'Academia', alias: ['lesson'] },
    { group: 'JOURNAL' },
    { r: 'dashboard', ic: 'grid', label: 'Dashboard' },
    { r: 'trades', ic: 'candles', label: 'Trades' },
    { r: 'calendario', ic: 'cal', label: 'Calendario' },
    { r: 'cuentas', ic: 'building', label: 'Cuentas' },
    { group: 'TÚ' },
    { r: 'snowball', ic: 'snow', label: 'Snowball' },
    { r: 'cartera', ic: 'wallet', label: 'Cartera' },
    { r: 'plan', ic: 'shield', label: 'Plan' },
  ];
  const TITLES = { inicio: 'Inicio', academia: 'Academia', lesson: 'Academia', dashboard: 'Journal · Dashboard', trades: 'Trades', calendario: 'Calendario', cuentas: 'Cuentas', snowball: 'Snowball · Money Management', cartera: 'Cartera', plan: 'Plan & Disciplina' };

  function sidebar() {
    const name = db.meta.name || 'Trader';
    const cs = Q.courseStats();
    const items = NAV.map(it => {
      if (it.group) return `<div class="nav-group">${it.group}</div>`;
      const on = route === it.r || (it.alias && it.alias.includes(route));
      return `<button class="navitem ${on ? 'on' : ''}" data-act="go" data-route="${it.r}">${UI.icon(it.ic)}<span>${it.label}</span>${it.r === 'academia' ? `<span class="nav-badge">${cs.pct}%</span>` : ''}</button>`;
    }).join('');
    return `<aside class="sidebar ${state.sidebar ? 'open' : ''}">
      <div class="sb-brand">${UI.logo(30)}<span class="sb-name">NORTHPOINT<small>TRADING</small></span></div>
      <button class="sb-profile" data-act="openSettings">
        <span class="avatar">${UI.initials(name)}</span>
        <span class="sb-pinfo"><b>${UI.esc(name)}</b><small>${UI.esc(db.meta.handle || 'mi perfil')}</small></span>
      </button>
      <nav class="navlist">${items}</nav>
      <div class="sb-foot">
        <button class="navitem" data-act="openSettings">${UI.icon('settings')}<span>Ajustes</span></button>
        <button class="navitem" data-act="seeLanding">${UI.icon('gift')}<span>Página del curso</span></button>
      </div>
    </aside>`;
  }

  function topbar() {
    const title = route === 'lesson' ? (Data.lessonById(state.lessonId)?.title || 'Lección') : (TITLES[route] || 'Snowball');
    return `<header class="topbar">
      <div class="tb-left">
        <button class="icobtn only-mobile" data-act="toggleSidebar" aria-label="Menú">${UI.icon('panel')}</button>
        <div class="tb-title">${UI.esc(title)}</div>
      </div>
      <div class="tb-right">
        <span class="mkt"><i></i> Market Open</span>
        <button class="icobtn" data-act="addTrade" title="Nuevo trade">${UI.icon('plus')}</button>
        <button class="icobtn" data-act="openSettings" aria-label="Ajustes">${UI.icon('settings')}</button>
      </div>
    </header>`;
  }

  function render() {
    const root = document.getElementById('root');
    const cls = slide ? 'fadein slide3d' : 'fadein'; slide = false;
    if (route === 'landing') { document.body.classList.add('landing'); root.innerHTML = `<div class="fadein">${Views.landing()}</div>`; return; }
    document.body.classList.remove('landing');
    const view = Views[route] || Views.inicio;
    root.innerHTML = `<div class="layout">
        ${sidebar()}
        <div class="main">
          ${topbar()}
          <div class="content"><div class="${cls}">${view()}</div></div>
        </div>
        <div class="sb-scrim ${state.sidebar ? 'on' : ''}" data-act="toggleSidebar"></div>
      </div>`;
  }

  // ---- lectura de campos ----
  const val = id => (document.getElementById(id)?.value || '').trim();
  const numv = id => { const v = (document.getElementById(id)?.value || '').replace(/[,\s]/g, ''); const n = parseFloat(v); return isNaN(n) ? 0 : n; };
  const sheetPick = g => document.querySelector(`.pick[data-g="${g}"] .chip.on`)?.dataset.v;
  const find = (k, id) => db[k].find(x => x.id === id);

  function confirmDel(kind, id, label) {
    UI.modal(`<div class="h3 mb8">¿Eliminar ${label}?</div><p class="muted small mb16">No se puede deshacer.</p>
      <div class="btn-row"><button class="btn btn-ghost" data-act="closeSheet">Cancelar</button>
      <button class="btn btn-danger" data-act="doDelete" data-kind="${kind}" data-id="${id}">Eliminar</button></div>`);
  }
  function seedFirstOpen() {
    if (!db.meta.onboarded && !db.trades.length && !db.accounts.length) { Data.seed(db); save(); UI.toast('Listo · cargué tu historial de ejemplo'); }
    else if (!db.meta.onboarded) { db.meta.onboarded = true; if (!db.plan) db.plan = JSON.parse(JSON.stringify(Data.PLAN)); save(); }
    state.period = UI.todayKey();
  }

  const A = {
    openApp: () => { if (!db.meta.onboarded) A.openOnboard(); else { state.period = UI.todayKey(); go('inicio'); } },
    openOnboard: () => UI.modal(`
      <div class="onb">
        <div class="onb-logo">${UI.logo(44)}</div>
        <div class="h2 center">Crea tu cuenta en NorthPoint</div>
        <p class="muted small center mb16">Tu sesión vive en este dispositivo. Empieza tu journal desde cero.</p>
        <div class="form">
          ${Forms.field('Tu nombre', Forms.input('onb-name', '', 'Tu nombre'))}
          ${Forms.field('Correo (opcional)', Forms.input('onb-email', '', 'tu@correo.com', 'email'))}
          <button class="btn btn-primary full" data-act="createAccount">Crear cuenta y entrar →</button>
        </div>
        <button class="onb-demo" data-act="startDemo">o explora el demo con datos de ejemplo</button>
      </div>`),
    createAccount() {
      const name = val('onb-name') || 'Trader';
      const email = val('onb-email');
      db = Store.empty();
      db.meta.name = name; db.meta.email = email; db.meta.onboarded = true;
      db.plan = JSON.parse(JSON.stringify(Data.PLAN));
      db.money = JSON.parse(JSON.stringify(Data.MONEY));
      save(); UI.closeSheet(); state.period = UI.todayKey(); go('inicio'); UI.toast('¡Bienvenido, ' + name + '! 🧭');
    },
    startDemo() { db = Store.empty(); Data.seed(db); save(); UI.closeSheet(); state.period = UI.todayKey(); go('inicio'); UI.toast('Demo cargado · edítalo a tu gusto'); },
    logout: () => UI.modal(`<div class="h3 mb8">¿Cerrar sesión?</div><p class="muted small mb16">Tus datos se quedan guardados en este dispositivo.</p><div class="btn-row"><button class="btn btn-ghost" data-act="closeSheet">Cancelar</button><button class="btn btn-primary" data-act="doLogout">Cerrar sesión</button></div>`),
    doLogout() { UI.closeSheet(); go('landing'); },
    go: el => go(el.dataset.route),
    seeLanding: () => go('landing'),
    openDiscord: () => { try { window.open('https://discord.gg/', '_blank', 'noopener'); } catch (e) {} },
    toggleTheme: () => { db.meta.theme = db.meta.theme === 'dark' ? 'light' : 'dark'; applyTheme(); save(); UI.toast(db.meta.theme === 'dark' ? 'Modo oscuro' : 'Modo nieve'); render(); },
    toggleSidebar: () => { state.sidebar = !state.sidebar; render(); },
    closeSheet: () => UI.closeSheet(),
    closeBg: (el, ev) => { if (ev.target === el) UI.closeSheet(); },
    pick: el => { const g = el.closest('.pick'); if (!g) return; g.querySelectorAll('[data-pick]').forEach(b => b.classList.remove('on')); el.classList.add('on'); },
    openSettings: () => UI.sheet(Views.settings()),

    prevMonth: () => { state.period = UI.shiftMonth(state.period, -1); render(); },
    nextMonth: () => { state.period = UI.shiftMonth(state.period, 1); render(); },
    openDay: el => UI.sheet(Views.daySheet(el.dataset.date)),

    /* ---- curso ---- */
    openLesson: el => { state.lessonId = el.dataset.id; go('lesson'); },
    continueCourse: () => { const n = Q.nextLesson(); if (n) { state.lessonId = n.id; go('lesson'); } else UI.toast('¡Curso completado! 🎓'); },
    toggleLesson(el) { const id = el.dataset.id; if (db.progress[id]) delete db.progress[id]; else db.progress[id] = true; save(); render(); },
    nextLesson(el) {
      const all = Data.allLessons(); const i = all.findIndex(l => l.id === state.lessonId);
      if (i >= 0 && i < all.length - 1) { state.lessonId = all[i + 1].id; go('lesson'); } else go('academia');
    },
    prevLesson() { const all = Data.allLessons(); const i = all.findIndex(l => l.id === state.lessonId); if (i > 0) { state.lessonId = all[i - 1].id; go('lesson'); } },

    /* ---- trades ---- */
    addTrade: () => UI.sheet(Forms.trade()),
    addTradeFor: el => UI.sheet(Forms.trade({ date: el.dataset.date })),
    editTrade: el => { const t = find('trades', el.dataset.id); if (t) UI.sheet(Forms.trade(t)); },
    saveTrade(el) {
      const id = el.dataset.id;
      const result = sheetPick('result') || 'win';
      let p = numv('t-pnl');
      if (result === 'be') p = 0; else { p = Math.abs(p); if (p === 0) return UI.toast('Anota el resultado en $'); if (result === 'loss') p = -p; }
      const data = {
        date: val('t-date') || UI.todayISO(), time: val('t-time') || '08:00',
        accountId: document.getElementById('t-account')?.value || '',
        instrument: sheetPick('inst') || 'MNQ', side: sheetPick('side') || 'long', result, pnl: p,
        contracts: numv('t-contracts'), entry: numv('t-entry'), exit: numv('t-exit'),
        setup: sheetPick('setup') || 'orb', emotion: sheetPick('emotion') || 'disciplina', notes: val('t-notes'),
      };
      if (id) Object.assign(find('trades', id), data); else db.trades.push({ id: Store.uid(), duration: 0, ...data });
      save(); UI.closeSheet(); UI.toast(id ? 'Trade actualizado' : '¡Trade agregado!'); render();
    },
    delTrade: el => confirmDel('trades', el.dataset.id, 'este trade'),
    setTradePage: el => { state.tradePage = Number(el.dataset.p); render(); },

    /* ---- cuentas ---- */
    addAccount: () => UI.sheet(Forms.account()),
    editAccount: el => { const a = find('accounts', el.dataset.id); if (a) UI.sheet(Forms.account(a)); },
    openAccount: el => UI.sheet(Views.accountSheet(el.dataset.id), true),
    saveAccount(el) {
      const id = el.dataset.id; const firm = sheetPick('firm') || 'tradeify'; const size = numv('a-size') || 50000;
      const alias = val('a-alias') || `${Data.firmOf(firm).label} ${Math.round(size / 1000)}K`;
      const data = { firm, alias, size, phase: sheetPick('phase') || 'eval', status: sheetPick('status') || 'activa' };
      if (id) Object.assign(find('accounts', id), data); else db.accounts.push({ id: Store.uid(), ...data, createdAt: UI.todayISO() });
      save(); UI.closeSheet(); UI.toast(id ? 'Cuenta actualizada' : 'Cuenta agregada'); render();
    },
    delAccount: el => confirmDel('accounts', el.dataset.id, 'esta cuenta'),

    /* ---- payouts ---- */
    addPayout: () => UI.sheet(Forms.payout()),
    editPayout: el => { const p = find('payouts', el.dataset.id); if (p) UI.sheet(Forms.payout(p)); },
    savePayout(el) {
      const id = el.dataset.id; const amount = numv('p-amount'); if (amount <= 0) return UI.toast('Anota el monto');
      const data = { date: val('p-date') || UI.todayISO(), firm: sheetPick('pfirm') || 'tradeify', accountId: document.getElementById('p-account')?.value || '', amount };
      if (id) Object.assign(find('payouts', id), data); else db.payouts.push({ id: Store.uid(), ...data });
      save(); UI.closeSheet(); UI.toast(id ? 'Payout actualizado' : '¡Otro payout! 🤑'); render();
    },
    delPayout: el => confirmDel('payouts', el.dataset.id, 'este payout'),

    /* ---- metas ---- */
    addGoal: () => UI.sheet(Forms.goal()),
    editGoal: el => { const g = find('goals', el.dataset.id); if (g) UI.sheet(Forms.goal(g)); },
    saveGoal(el) {
      const id = el.dataset.id; const name = val('g-name'); if (!name) return UI.toast('¿Qué quieres lograr?');
      const data = { name, icon: sheetPick('gicon') || 'target', monthly: sheetPick('gmonthly') === 'si', target: numv('g-target'), saved: numv('g-saved') };
      if (id) Object.assign(find('goals', id), data); else db.goals.push({ id: Store.uid(), ...data });
      save(); UI.closeSheet(); UI.toast(id ? 'Meta actualizada' : 'Meta agregada'); render();
    },
    delGoal: el => confirmDel('goals', el.dataset.id, 'esta meta'),

    /* ---- bitácora ---- */
    addNote: () => UI.sheet(Forms.note()),
    editNote: el => { const n = find('journal', el.dataset.id); if (n) UI.sheet(Forms.note(n)); },
    saveNote(el) {
      const id = el.dataset.id; const text = val('n-text'); if (!text) return UI.toast('Escribe algo');
      const data = { date: val('n-date') || UI.todayISO(), tag: sheetPick('ntag') || 'nota', text };
      if (id) Object.assign(find('journal', id), data); else db.journal.push({ id: Store.uid(), ...data });
      save(); UI.closeSheet(); UI.toast(id ? 'Nota actualizada' : 'Nota guardada'); render();
    },
    delNote: el => confirmDel('journal', el.dataset.id, 'esta nota'),

    toggleCheck(el) { const idc = el.dataset.id, k = UI.todayISO(); const arr = db.checks[k] || []; db.checks[k] = arr.includes(idc) ? arr.filter(x => x !== idc) : arr.concat(idc); save(); render(); },

    /* ---- snowball / money management ---- */
    setScenario(el) { state.scenario = Number(el.dataset.i); render(); },
    setGoalTarget(el) {
      if (!db.money) db.money = JSON.parse(JSON.stringify(Data.MONEY));
      const v = parseFloat((el.value || '').replace(/[,\s$]/g, ''));
      if (!isNaN(v) && v > 0) { db.money.goalTarget = Math.round(v); save(); render(); }
    },
    setGoalRate(el) {
      if (!db.money) db.money = JSON.parse(JSON.stringify(Data.MONEY));
      db.money.goalRate = Number(el.dataset.r); save(); render();
    },
    editMoney: () => UI.sheet(Views.moneyForm()),
    saveMoney() {
      if (!db.money) db.money = JSON.parse(JSON.stringify(Data.MONEY));
      const raw = db.money.allocations.map(a => ({ a, v: Math.max(0, numv('alloc-' + a.id)) }));
      const sum = raw.reduce((s, x) => s + x.v, 0) || 1;
      raw.forEach(x => { x.a.pct = Math.round(x.v / sum * 100); });
      const diff = 100 - db.money.allocations.reduce((s, a) => s + a.pct, 0);
      if (diff !== 0) db.money.allocations[0].pct += diff;
      const mes = numv('alloc-mes'); if (mes > 0) db.money.payoutsMes = Math.round(mes);
      save(); UI.closeSheet(); UI.toast('Reparto actualizado'); render();
    },

    /* ---- cartera / gastos del mes ---- */
    addExpense: () => UI.sheet(Forms.expense()),
    editExpense: el => { const e = find('expenses', el.dataset.id); if (e) UI.sheet(Forms.expense(e)); },
    saveExpense(el) {
      const id = el.dataset.id;
      const name = val('x-name'); const amount = numv('x-amount');
      if (!name) return UI.toast('¿Qué gasto es?');
      if (amount <= 0) return UI.toast('Anota el monto');
      const icon = sheetPick('xicon') || 'wallet';
      const palette = { home: '#5fd0ff', wallet: '#7fb0ff', car: '#ffd24a', star: '#22c55e', flame: '#a855f7', shield: '#06b6d4', coin: '#8a97a8' };
      const data = { name, amount, icon, color: palette[icon] || '#5fd0ff' };
      if (!db.expenses) db.expenses = [];
      if (id) Object.assign(find('expenses', id), data); else db.expenses.push({ id: Store.uid(), ...data });
      save(); UI.closeSheet(); UI.toast(id ? 'Gasto actualizado' : 'Gasto agregado'); render();
    },
    delExpense: el => confirmDel('expenses', el.dataset.id, 'este gasto'),
    doDelete(el) { const kk = el.dataset.kind; db[kk] = db[kk].filter(x => x.id !== el.dataset.id); save(); UI.closeSheet(); UI.toast('Eliminado'); render(); },

    /* ---- ajustes ---- */
    saveName() { db.meta.name = val('set-name') || 'Trader'; save(); UI.toast('Listo'); render(); },
    exportData() { try { const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'racha-respaldo.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); UI.toast('Respaldo descargado'); } catch (e) { UI.toast('No se pudo'); } },
    exportCSV() {
      try {
        const esc = v => { v = (v == null ? '' : String(v)); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
        const L = []; const row = (...a) => L.push(a.map(esc).join(','));
        row('Snowball Investments · Trades'); row('Fecha', 'Hora', 'Cuenta', 'Símbolo', 'Lado', 'Qty', 'Entrada', 'Salida', 'PnL', 'Resultado', 'Setup');
        Q.tradesDesc().forEach(t => { const ac = Q.accById(t.accountId) || {}; row(t.date, t.time, ac.alias || '', t.instrument, t.side, t.contracts, t.entry, t.exit, t.pnl, t.result, Data.setupOf(t.setup).label); });
        const blob = new Blob(['﻿' + L.join('\n')], { type: 'text/csv;charset=utf-8' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'racha-trades.csv'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); UI.toast('Exportado a Excel');
      } catch (e) { UI.toast('No se pudo'); }
    },
    resetDemo: () => UI.modal(`<div class="h3 mb8">¿Cargar datos de ejemplo?</div><p class="muted small mb16">Reemplaza lo que tengas.</p><div class="btn-row"><button class="btn btn-ghost" data-act="closeSheet">Cancelar</button><button class="btn btn-danger" data-act="doReset">Cargar</button></div>`),
    doReset() { db = Store.empty(); Data.seed(db); save(); UI.closeSheet(); state.period = UI.todayKey(); go('inicio'); UI.toast('Ejemplo cargado'); },
    wipeAll: () => UI.modal(`<div class="h3 mb8">¿Borrar todo?</div><p class="muted small mb16">Se elimina todo de este dispositivo.</p><div class="btn-row"><button class="btn btn-ghost" data-act="closeSheet">Cancelar</button><button class="btn btn-danger" data-act="doWipe">Borrar todo</button></div>`),
    doWipe() { db = Store.empty(); db.meta.onboarded = true; db.plan = JSON.parse(JSON.stringify(Data.PLAN)); save(); UI.closeSheet(); state.period = UI.todayKey(); go('inicio'); UI.toast('Empezamos de cero'); },
  };

  document.addEventListener('click', ev => {
    const pk = ev.target.closest('[data-pick]'); if (pk) { A.pick(pk); return; }
    const el = ev.target.closest('[data-act]'); if (!el) return;
    const fn = A[el.dataset.act]; if (fn) { ev.preventDefault(); fn(el, ev); }
  });
  document.addEventListener('change', ev => {
    const el = ev.target.closest('[data-change]'); if (!el) return;
    const fn = A[el.dataset.change]; if (fn) fn(el, ev);
  });

  function applyTheme() { document.documentElement.setAttribute('data-theme', 'dark'); } // siempre oscuro (a juego con la landing)
  function boot() { applyTheme(); render(); }
  document.addEventListener('DOMContentLoaded', boot);
  if (document.readyState !== 'loading') boot();

  // HUD: temperatura animada del cristal (estilo igloo)
  setInterval(() => {
    const t = document.getElementById('hud-temp'); if (!t) return;
    const v = 16 + Math.random() * 24, d = Math.random() * 4 - 2;
    t.innerHTML = `TEMP&nbsp;&nbsp;${v.toFixed(2)}<br><span class="hud-d">${d >= 0 ? '+' : '−'}${Math.abs(d).toFixed(2)}</span>`;
  }, 1600);
  if ('serviceWorker' in navigator && location.protocol === 'https:') { window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {})); }

  return { save, go, render, get db() { return db; }, get route() { return route; }, get period() { return state.period; }, get lessonId() { return state.lessonId; }, get tradePage() { return state.tradePage; }, get scenario() { return state.scenario; } };
})();
