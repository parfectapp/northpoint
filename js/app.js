/* ============ RACHA · App shell (escritorio, sidebar), router y acciones ============ */
const App = (() => {
  let db = Store.load();
  const state = { period: UI.todayKey(), lessonId: null, tradePage: 1, sidebar: false, scenario: 2, unlocked: false };
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
    { r: 'coach', ic: 'cockpit', label: 'Coach IA' },
    { r: 'calendario', ic: 'cal', label: 'Calendario' },
    { r: 'cuentas', ic: 'building', label: 'Cuentas' },
    { group: 'TÚ' },
    { r: 'snowball', ic: 'snow', label: 'Snowball' },
    { r: 'cartera', ic: 'wallet', label: 'Cartera' },
    { r: 'plan', ic: 'shield', label: 'Plan' },
  ];
  const TITLES = { inicio: 'Inicio', academia: 'Academia', lesson: 'Academia', dashboard: 'Journal · Dashboard', trades: 'Trades', coach: 'Coach · Análisis de tu operativa', calendario: 'Calendario', cuentas: 'Cuentas', snowball: 'Snowball · Money Management', cartera: 'Cartera', plan: 'Plan & Disciplina' };

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
    if (db.meta.pass && !state.unlocked && route !== 'landing') { lockScreen(); return; }
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
    if (typeof Media !== 'undefined') Media.hydrate(root);
  }

  // ---- lectura de campos ----
  const val = id => (document.getElementById(id)?.value || '').trim();
  const numv = id => { const v = (document.getElementById(id)?.value || '').replace(/[,\s]/g, ''); const n = parseFloat(v); return isNaN(n) ? 0 : n; };
  const sheetPick = g => document.querySelector(`.pick[data-g="${g}"] .chip.on`)?.dataset.v;
  const find = (k, id) => db[k].find(x => x.id === id);

  // ---- adjuntos (fotos/videos) en proceso de captura ----
  let pendingMedia = [];
  const rndKey = () => Math.random().toString(36).slice(2, 9);
  function initMedia(rec) { pendingMedia = ((rec && rec.media) || []).map(m => ({ k: rndKey(), type: m.type, id: m.id })); }
  function refreshStrip() {
    const el = document.getElementById('media-strip'); if (!el) return;
    el.innerHTML = Forms.mediaStrip(); if (typeof Media !== 'undefined') Media.hydrate(el);
  }
  async function commitMedia(origMedia) {
    const out = [], keep = [];
    for (const m of pendingMedia) {
      if (m.isNew) { const id = await Media.put(m.blob); out.push({ id, type: m.type }); keep.push(id); if (m.url) URL.revokeObjectURL(m.url); }
      else { out.push({ id: m.id, type: m.type }); keep.push(m.id); }
    }
    (origMedia || []).forEach(o => { if (!keep.includes(o.id) && typeof Media !== 'undefined') Media.del(o.id); });
    return out;
  }
  function delMediaOf(rec) { if (rec && rec.media && typeof Media !== 'undefined') rec.media.forEach(m => Media.del(m.id)); }

  // ---- contraseña (candado local de este dispositivo) ----
  async function hashPass(s) {
    try {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('np:' + s));
      return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) { let h = 5381; for (const c of ('np:' + s)) h = ((h << 5) + h + c.charCodeAt(0)) >>> 0; return 'f' + h.toString(16); }
  }
  function lockScreen() {
    const root = document.getElementById('root');
    document.body.classList.remove('landing');
    root.innerHTML = `<div class="lockwrap fadein"><div class="lockcard">
      <div class="lock-logo">${UI.logo(46)}</div>
      <div class="h2 center">NorthPoint está bloqueado</div>
      <p class="muted small center mb16">Ingresa tu contraseña para entrar.</p>
      <div class="form">
        <input class="input" id="lock-pass" type="password" placeholder="Contraseña" autocomplete="current-password" />
        <button class="btn btn-primary full" data-act="unlock">${UI.icon('lock', '', 16)} Entrar</button>
      </div>
      <button class="onb-demo" data-act="forgotPass">¿Olvidaste tu contraseña?</button>
    </div></div>`;
    const inp = document.getElementById('lock-pass');
    if (inp) { inp.focus(); inp.addEventListener('keydown', e => { if (e.key === 'Enter') A.unlock(); }); }
  }

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

    /* ---- Tradovate · sync en vivo ---- */
    connectTradovate: () => UI.sheet(`
      <div class="sheet-head"><div class="h2">${UI.icon('plug', '', 18)} Conectar Tradovate</div>
        <div class="muted small">Sync en vivo de tus trades reales de Tradeify.</div></div>
      <div class="form">
        ${Forms.field('URL del backend', Forms.input('sync-url', db.sync?.backendUrl || '', 'https://tu-backend.onrender.com'), 'El servidor northpoint-sync corriendo')}
        ${Forms.field('Usuario de Tradovate', Forms.input('sync-user', '', 'tu usuario'))}
        ${Forms.field('Contraseña', `<input class="input" id="sync-pass" type="password" autocomplete="off" />`)}
        <button class="btn btn-primary full" data-act="doConnectTradovate">Conectar y sincronizar</button>
      </div>
      ${db.sync?.session ? `<div class="setlist mt12">
        <button class="setrow2" data-act="syncTradovate">${UI.icon('sync', '', 18)} <span>Sincronizar ahora</span></button>
        <button class="setrow2 danger" data-act="disconnectTradovate">${UI.icon('x', '', 18)} <span>Desconectar</span></button></div>` : ''}
      <p class="muted small mt12">Tu contraseña solo viaja a TU backend → Tradovate (HTTPS). Necesitas el servidor <b>northpoint-sync</b> corriendo (ver su README).</p>`),
    async doConnectTradovate() {
      const url = val('sync-url').replace(/\/+$/, '');
      const name = val('sync-user'); const pass = document.getElementById('sync-pass')?.value;
      if (!url || !name || !pass) return UI.toast('Faltan datos');
      UI.toast('Conectando…');
      try {
        const r = await fetch(url + '/api/connect', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, password: pass }) });
        const d = await r.json(); if (!r.ok) throw new Error(d.error || ('HTTP ' + r.status));
        db.sync = { backendUrl: url, session: d.session, lastSync: '' }; save();
        await A.syncTradovate();
      } catch (e) { UI.toast('No conectó: ' + e.message); }
    },
    async syncTradovate() {
      if (!db.sync?.backendUrl || !db.sync?.session) return UI.toast('Conecta Tradovate primero');
      UI.toast('Sincronizando…');
      try {
        const r = await fetch(db.sync.backendUrl + '/api/trades?session=' + encodeURIComponent(db.sync.session));
        const d = await r.json(); if (!r.ok) throw new Error(d.error || ('HTTP ' + r.status));
        let acc = db.accounts.find(a => a.alias === 'Tradovate (sync)');
        if (!acc) { acc = { id: Store.uid(), firm: 'tradeify', alias: 'Tradovate (sync)', size: 50000, phase: 'funded', status: 'activa', createdAt: UI.todayISO() }; db.accounts.push(acc); }
        const have = new Set(db.trades.map(t => t.extId).filter(Boolean));
        let added = 0;
        (d.trades || []).forEach(t => { if (t.extId && have.has(t.extId)) return; db.trades.push({ id: Store.uid(), accountId: acc.id, ...t }); added++; });
        db.sync.lastSync = new Date().toISOString(); save(); UI.closeSheet(); render();
        UI.toast(added ? `${added} trade(s) sincronizados` : 'Ya estás al día');
      } catch (e) { UI.toast('Sync falló: ' + e.message); }
    },
    disconnectTradovate() { db.sync = null; save(); UI.closeSheet(); UI.toast('Tradovate desconectado'); render(); },
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
    addTrade: () => { pendingMedia = []; UI.sheet(Forms.trade()); },
    addTradeFor: el => { pendingMedia = []; UI.sheet(Forms.trade({ date: el.dataset.date })); },
    editTrade: el => { const t = find('trades', el.dataset.id); if (t) { initMedia(t); UI.sheet(Forms.trade(t)); } },
    async saveTrade(el) {
      const id = el.dataset.id;
      const result = sheetPick('result') || 'win';
      let p = numv('t-pnl');
      if (result === 'be') p = 0; else { p = Math.abs(p); if (p === 0) return UI.toast('Anota el resultado en $'); if (result === 'loss') p = -p; }
      const orig = id ? find('trades', id) : null;
      const media = await commitMedia(orig && orig.media);
      const data = {
        date: val('t-date') || UI.todayISO(), time: val('t-time') || '08:00',
        accountId: document.getElementById('t-account')?.value || '',
        instrument: sheetPick('inst') || 'MNQ', side: sheetPick('side') || 'long', result, pnl: p,
        contracts: numv('t-contracts'), entry: numv('t-entry'), exit: numv('t-exit'),
        setup: sheetPick('setup') || 'orb', emotion: sheetPick('emotion') || 'disciplina', notes: val('t-notes'), media,
      };
      if (orig) Object.assign(orig, data); else db.trades.push({ id: Store.uid(), duration: 0, ...data });
      pendingMedia = []; save(); UI.closeSheet(); UI.toast(id ? 'Trade actualizado' : '¡Trade agregado!'); render();
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
    addNote: () => { pendingMedia = []; UI.sheet(Forms.note()); },
    editNote: el => { const n = find('journal', el.dataset.id); if (n) { initMedia(n); UI.sheet(Forms.note(n)); } },
    async saveNote(el) {
      const id = el.dataset.id; const text = val('n-text'); if (!text) return UI.toast('Escribe algo');
      const orig = id ? find('journal', id) : null;
      const media = await commitMedia(orig && orig.media);
      const data = { date: val('n-date') || UI.todayISO(), tag: sheetPick('ntag') || 'nota', text, media };
      if (orig) Object.assign(orig, data); else db.journal.push({ id: Store.uid(), ...data });
      pendingMedia = []; save(); UI.closeSheet(); UI.toast(id ? 'Nota actualizada' : 'Nota guardada'); render();
    },
    delNote: el => confirmDel('journal', el.dataset.id, 'esta nota'),

    toggleCheck(el) { const idc = el.dataset.id, k = UI.todayISO(); const arr = db.checks[k] || []; db.checks[k] = arr.includes(idc) ? arr.filter(x => x !== idc) : arr.concat(idc); save(); render(); },

    /* ---- adjuntos: fotos / videos ---- */
    async attachMedia(el) {
      const files = [...(el.files || [])]; el.value = '';
      for (const f of files) {
        const isVid = (f.type || '').startsWith('video');
        if (isVid && f.size > 60 * 1024 * 1024) { UI.toast('Video muy pesado (máx 60 MB)'); continue; }
        try { const blob = isVid ? f : await Media.compressImage(f); pendingMedia.push({ k: rndKey(), type: isVid ? 'video' : 'image', isNew: true, blob }); }
        catch (e) { UI.toast('No se pudo agregar el archivo'); }
      }
      refreshStrip();
    },
    removeMedia(el) {
      const k = el.dataset.key, it = pendingMedia.find(m => m.k === k);
      if (it && it.isNew && it.url) URL.revokeObjectURL(it.url);
      pendingMedia = pendingMedia.filter(m => m.k !== k); refreshStrip();
    },
    async openMedia(el) {
      const it = pendingMedia.find(m => m.k === el.dataset.key); if (!it) return;
      let url = it.isNew ? (it.url || URL.createObjectURL(it.blob)) : null;
      if (!url) { const b = await Media.get(it.id); if (!b) return; url = URL.createObjectURL(b); }
      UI.modal(`<div class="lightbox">${it.type === 'video' ? `<video src="${url}" controls autoplay playsinline></video>` : `<img src="${url}" alt="" />`}</div>`);
    },
    async viewMedia(el) {
      const id = el.dataset.id, type = el.dataset.type || 'image';
      const b = await Media.get(id); if (!b) return; const url = URL.createObjectURL(b);
      UI.modal(`<div class="lightbox">${type === 'video' ? `<video src="${url}" controls autoplay playsinline></video>` : `<img src="${url}" alt="" />`}</div>`);
    },

    /* ---- contraseña (candado local) ---- */
    async unlock() {
      const v = document.getElementById('lock-pass')?.value || '';
      if (await hashPass(v) === db.meta.pass) { state.unlocked = true; render(); } else UI.toast('Contraseña incorrecta');
    },
    forgotPass: () => UI.modal(`<div class="h3 mb8">Restablecer contraseña</div>
      <p class="muted small mb12">Tus datos viven solo en este dispositivo, sin servidor ni correo. Para restablecer la contraseña hay que empezar de cero: se borran los trades y notas de este equipo.</p>
      <p class="muted small mb16">Si tienes un respaldo (.json) podrás volver a cargar tu info después.</p>
      <div class="btn-row"><button class="btn btn-ghost" data-act="closeSheet">Cancelar</button>
      <button class="btn btn-danger" data-act="doForgotReset">Restablecer y empezar de cero</button></div>`),
    doForgotReset() {
      db = Store.empty(); db.meta.onboarded = true; db.plan = JSON.parse(JSON.stringify(Data.PLAN)); db.money = JSON.parse(JSON.stringify(Data.MONEY));
      save(); state.unlocked = true; UI.closeSheet(); state.period = UI.todayKey(); go('inicio'); UI.toast('Listo, empezamos de cero');
    },
    passwordSettings: () => UI.sheet(`<div class="sheet-head"><div class="h2">${UI.icon('lock', '', 18)} Contraseña de acceso</div><div class="muted small">${App.db.meta.pass ? 'Cambia o quita tu contraseña.' : 'Protege tu app con una contraseña en este dispositivo.'}</div></div>
      <div class="form">
        ${App.db.meta.pass ? Forms.field('Contraseña actual', `<input class="input" id="pw-cur" type="password" autocomplete="current-password" />`) : ''}
        ${Forms.field(App.db.meta.pass ? 'Nueva contraseña' : 'Contraseña', `<input class="input" id="pw-new" type="password" autocomplete="new-password" placeholder="Mínimo 4 caracteres" />`)}
        ${Forms.field('Confirmar', `<input class="input" id="pw-conf" type="password" autocomplete="new-password" />`)}
        <button class="btn btn-primary full" data-act="savePassword">${App.db.meta.pass ? 'Cambiar contraseña' : 'Crear contraseña'}</button>
      </div>
      ${App.db.meta.pass ? `<button class="dellink" data-act="removePassword">${UI.icon('trash', '', 15)} Quitar contraseña</button>` : ''}
      <p class="muted small mt12">Es un candado local de este dispositivo. Si la olvidas, solo puedes restablecer empezando de cero (guarda un respaldo .json).</p>`),
    async savePassword() {
      const cur = document.getElementById('pw-cur')?.value;
      const nw = document.getElementById('pw-new')?.value || '';
      const cf = document.getElementById('pw-conf')?.value || '';
      if (db.meta.pass) { if (await hashPass(cur || '') !== db.meta.pass) return UI.toast('Contraseña actual incorrecta'); }
      if (nw.length < 4) return UI.toast('Mínimo 4 caracteres');
      if (nw !== cf) return UI.toast('Las contraseñas no coinciden');
      db.meta.pass = await hashPass(nw); state.unlocked = true; save(); UI.closeSheet(); UI.toast('Contraseña guardada 🔒');
    },
    async removePassword() {
      const cur = document.getElementById('pw-cur')?.value;
      if (await hashPass(cur || '') !== db.meta.pass) return UI.toast('Escribe tu contraseña actual para quitarla');
      delete db.meta.pass; save(); UI.closeSheet(); UI.toast('Contraseña quitada');
    },

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
    setGoalYears(el) {
      if (!db.money) db.money = JSON.parse(JSON.stringify(Data.MONEY));
      db.money.goalYears = Number(el.dataset.y); save(); render();
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
    doDelete(el) { const kk = el.dataset.kind, id = el.dataset.id; delMediaOf((db[kk] || []).find(x => x.id === id)); db[kk] = db[kk].filter(x => x.id !== id); save(); UI.closeSheet(); UI.toast('Eliminado'); render(); },

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

  return { save, go, render, get db() { return db; }, get route() { return route; }, get period() { return state.period; }, get lessonId() { return state.lessonId; }, get tradePage() { return state.tradePage; }, get scenario() { return state.scenario; }, get pendingMedia() { return pendingMedia; } };
})();
