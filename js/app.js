/* ============ NorthPoint · App shell (desktop, sidebar), router & actions ============ */
const App = (() => {
  let db = Store.load();
  const state = { period: UI.todayKey(), lessonId: null, tradePage: 1, sidebar: false, scenario: 2, unlocked: false };
  let route = db.meta.onboarded ? 'inicio' : 'landing';

  let slide = false; // fires the 3D transition only when changing section
  function save() { Store.save(db); }
  function go(r) { slide = true; route = r; state.sidebar = false; window.scrollTo(0, 0); document.querySelector('.content')?.scrollTo(0, 0); render(); }

  const NAV = [
    { r: 'inicio', ic: 'home', label: 'Home' },
    { r: 'rutina', ic: 'flag', label: 'Rutina' },
    { r: 'academia', ic: 'academy', label: 'Academy', alias: ['lesson'] },
    { group: 'JOURNAL' },
    { r: 'dashboard', ic: 'grid', label: 'Dashboard' },
    { r: 'trades', ic: 'candles', label: 'Trades' },
    { r: 'coach', ic: 'cockpit', label: 'AI Coach' },
    { r: 'calendario', ic: 'cal', label: 'Calendar' },
    { r: 'cuentas', ic: 'building', label: 'Accounts' },
  ];
  const TITLES = { inicio: 'Home', rutina: 'Rutina · Co-piloto de sesión', academia: 'Academy', lesson: 'Academy', dashboard: 'Journal · Dashboard', trades: 'Trades', coach: 'Coach · Your trading analysis', calendario: 'Calendar', cuentas: 'Accounts', snowball: 'Snowball · Money Management', cartera: 'Wallet', plan: 'Plan & Discipline' };

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
        <span class="sb-pinfo"><b>${UI.esc(name)}</b><small>${UI.esc(db.meta.handle || 'my profile')}</small></span>
      </button>
      <nav class="navlist">${items}</nav>
      <div class="sb-foot">
        <button class="navitem" data-act="openSettings">${UI.icon('settings')}<span>Settings</span></button>
        <button class="navitem" data-act="seeLanding">${UI.icon('gift')}<span>Course page</span></button>
      </div>
    </aside>`;
  }

  function topbar() {
    const title = route === 'lesson' ? (Data.lessonById(state.lessonId)?.title || 'Lesson') : (TITLES[route] || 'Snowball');
    return `<header class="topbar">
      <div class="tb-left">
        <button class="icobtn only-mobile" data-act="toggleSidebar" aria-label="Menu">${UI.icon('panel')}</button>
        <div class="tb-title">${UI.esc(title)}</div>
      </div>
      <div class="tb-right">
        <span class="mkt"><i></i> Market Open</span>
        <button class="icobtn" data-act="addTrade" title="New trade">${UI.icon('plus')}</button>
        <button class="icobtn" data-act="openSettings" aria-label="Settings">${UI.icon('settings')}</button>
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
    if (route === 'rutina' && window.RutinaCtrl) window.RutinaCtrl.hydrate();
  }

  // ---- field readers ----
  const val = id => (document.getElementById(id)?.value || '').trim();
  const numv = id => { const v = (document.getElementById(id)?.value || '').replace(/[,\s]/g, ''); const n = parseFloat(v); return isNaN(n) ? 0 : n; };
  const sheetPick = g => document.querySelector(`.pick[data-g="${g}"] .chip.on`)?.dataset.v;
  const find = (k, id) => db[k].find(x => x.id === id);

  // ---- attachments (photos/videos) being captured ----
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

  // ---- password (local lock for this device) ----
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
      <div class="h2 center">NorthPoint is locked</div>
      <p class="muted small center mb16">Enter your password to continue.</p>
      <div class="form">
        <input class="input" id="lock-pass" type="password" placeholder="Password" autocomplete="current-password" />
        <button class="btn btn-primary full" data-act="unlock">${UI.icon('lock', '', 16)} Unlock</button>
      </div>
      <button class="onb-demo" data-act="forgotPass">Forgot your password?</button>
    </div></div>`;
    const inp = document.getElementById('lock-pass');
    if (inp) { inp.focus(); inp.addEventListener('keydown', e => { if (e.key === 'Enter') A.unlock(); }); }
  }

  function confirmDel(kind, id, label) {
    UI.modal(`<div class="h3 mb8">Delete ${label}?</div><p class="muted small mb16">This can't be undone.</p>
      <div class="btn-row"><button class="btn btn-ghost" data-act="closeSheet">Cancel</button>
      <button class="btn btn-danger" data-act="doDelete" data-kind="${kind}" data-id="${id}">Delete</button></div>`);
  }
  function seedFirstOpen() {
    if (!db.meta.onboarded && !db.trades.length && !db.accounts.length) { Data.seed(db); save(); UI.toast('Done · loaded your sample history'); }
    else if (!db.meta.onboarded) { db.meta.onboarded = true; if (!db.plan) db.plan = JSON.parse(JSON.stringify(Data.PLAN)); save(); }
    state.period = UI.todayKey();
  }

  const A = {
    openApp: () => { if (!db.meta.onboarded) A.openOnboard(); else { state.period = UI.todayKey(); go('inicio'); } },
    openOnboard: () => UI.modal(`
      <div class="onb">
        <div class="onb-logo">${UI.logo(44)}</div>
        <div class="h2 center">Create your NorthPoint account</div>
        <p class="muted small center mb16">Your session lives on this device. Start your journal from scratch.</p>
        <div class="form">
          ${Forms.field('Your name', Forms.input('onb-name', '', 'Your name'))}
          ${Forms.field('Email (optional)', Forms.input('onb-email', '', 'you@email.com', 'email'))}
          <button class="btn btn-primary full" data-act="createAccount">Create account & enter →</button>
        </div>
        <button class="onb-demo" data-act="startDemo">or explore the demo with sample data</button>
      </div>`),
    createAccount() {
      const name = val('onb-name') || 'Trader';
      const email = val('onb-email');
      db = Store.empty();
      db.meta.name = name; db.meta.email = email; db.meta.onboarded = true;
      db.plan = JSON.parse(JSON.stringify(Data.PLAN));
      db.money = JSON.parse(JSON.stringify(Data.MONEY));
      save(); UI.closeSheet(); state.period = UI.todayKey(); go('inicio'); UI.toast('Welcome, ' + name + '! 🧭');
    },
    startDemo() { db = Store.empty(); Data.seed(db); save(); UI.closeSheet(); state.period = UI.todayKey(); go('inicio'); UI.toast('Demo loaded · edit it however you like'); },
    logout: () => UI.modal(`<div class="h3 mb8">Log out?</div><p class="muted small mb16">Your data stays saved on this device.</p><div class="btn-row"><button class="btn btn-ghost" data-act="closeSheet">Cancel</button><button class="btn btn-primary" data-act="doLogout">Log out</button></div>`),
    doLogout() { UI.closeSheet(); go('landing'); },

    /* ---- Tradovate · live sync ---- */
    connectTradovate: () => UI.sheet(`
      <div class="sheet-head"><div class="h2">${UI.icon('plug', '', 18)} Connect Tradovate</div>
        <div class="muted small">Live sync of your real Tradeify trades.</div></div>
      <div class="form">
        ${Forms.field('Backend URL', Forms.input('sync-url', db.sync?.backendUrl || '', 'https://your-backend.onrender.com'), 'Your northpoint-sync server, running')}
        ${Forms.field('Tradovate username', Forms.input('sync-user', '', 'your username'))}
        ${Forms.field('Password', `<input class="input" id="sync-pass" type="password" autocomplete="off" />`)}
        <button class="btn btn-primary full" data-act="doConnectTradovate">Connect & sync</button>
      </div>
      ${db.sync?.session ? `<div class="setlist mt12">
        <button class="setrow2" data-act="syncTradovate">${UI.icon('sync', '', 18)} <span>Sync now</span></button>
        <button class="setrow2 danger" data-act="disconnectTradovate">${UI.icon('x', '', 18)} <span>Disconnect</span></button></div>` : ''}
      <p class="muted small mt12">Your password only travels to YOUR backend → Tradovate (HTTPS). You need the <b>northpoint-sync</b> server running (see its README).</p>`),
    async doConnectTradovate() {
      const url = val('sync-url').replace(/\/+$/, '');
      const name = val('sync-user'); const pass = document.getElementById('sync-pass')?.value;
      if (!url || !name || !pass) return UI.toast('Missing info');
      UI.toast('Connecting…');
      try {
        const r = await fetch(url + '/api/connect', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, password: pass }) });
        const d = await r.json(); if (!r.ok) throw new Error(d.error || ('HTTP ' + r.status));
        db.sync = { backendUrl: url, session: d.session, lastSync: '' }; save();
        await A.syncTradovate();
      } catch (e) { UI.toast("Couldn't connect: " + e.message); }
    },
    async syncTradovate() {
      if (!db.sync?.backendUrl || !db.sync?.session) return UI.toast('Connect Tradovate first');
      UI.toast('Syncing…');
      try {
        const r = await fetch(db.sync.backendUrl + '/api/trades?session=' + encodeURIComponent(db.sync.session));
        const d = await r.json(); if (!r.ok) throw new Error(d.error || ('HTTP ' + r.status));
        let acc = db.accounts.find(a => a.alias === 'Tradovate (sync)');
        if (!acc) { acc = { id: Store.uid(), firm: 'tradeify', alias: 'Tradovate (sync)', size: 50000, phase: 'funded', status: 'activa', createdAt: UI.todayISO() }; db.accounts.push(acc); }
        const have = new Set(db.trades.map(t => t.extId).filter(Boolean));
        let added = 0;
        (d.trades || []).forEach(t => { if (t.extId && have.has(t.extId)) return; db.trades.push({ id: Store.uid(), accountId: acc.id, ...t }); added++; });
        db.sync.lastSync = new Date().toISOString(); save(); UI.closeSheet(); render();
        UI.toast(added ? `${added} trade(s) synced` : "You're up to date");
      } catch (e) { UI.toast('Sync failed: ' + e.message); }
    },
    disconnectTradovate() { db.sync = null; save(); UI.closeSheet(); UI.toast('Tradovate disconnected'); render(); },

    /* ---- TradingView · webhook auto-sync (Pine strategy → Cloudflare Worker → here) ---- */
    connectTradingView: () => UI.sheet(`
      <div class="sheet-head"><div class="h2">${UI.icon('sync', '', 18)} Connect TradingView</div>
        <div class="muted small">Auto-import your strategy's closed trades via webhook.</div></div>
      <div class="form">
        ${Forms.field('Bridge URL', Forms.input('tv-url', db.tvsync?.url || '', 'https://northpoint-bridge.YOURNAME.workers.dev'), 'Your Cloudflare Worker — see northpoint-bridge/README.md')}
        ${Forms.field('Secret', Forms.input('tv-secret', db.tvsync?.secret || '', 'the same secret as in the Pine script'))}
        <button class="btn btn-primary full" data-act="doConnectTV">Connect &amp; sync</button>
      </div>
      ${db.tvsync?.url ? `<div class="setlist mt12">
        <button class="setrow2" data-act="syncTV">${UI.icon('sync', '', 18)} <span>Sync now${db.tvsync.lastSync ? ' · ' + new Date(db.tvsync.lastSync).toLocaleString() : ''}</span></button>
        <button class="setrow2 danger" data-act="disconnectTV">${UI.icon('x', '', 18)} <span>Disconnect</span></button></div>` : ''}
      <p class="muted small mt12">Use the SAME <b>Secret</b> in your Pine script and your Worker. TradingView posts each closed trade → your Worker → here. Note: webhook alerts need a paid TradingView plan.</p>`),
    async doConnectTV() {
      const url = val('tv-url').replace(/\/+$/, ''); const secret = val('tv-secret');
      if (!url || !secret) return UI.toast('Enter the Bridge URL and Secret');
      db.tvsync = { url, secret, lastSync: db.tvsync?.lastSync || '' }; save(); await A.syncTV();
    },
    async syncTV() {
      if (!db.tvsync?.url) return UI.toast('Connect TradingView first');
      UI.toast('Syncing…');
      try {
        const r = await fetch(db.tvsync.url + '/api/trades?session=' + encodeURIComponent(db.tvsync.secret));
        const d = await r.json(); if (!r.ok) throw new Error(d.error || ('HTTP ' + r.status));
        let acc = db.accounts.find(a => a.alias === 'TradingView');
        if (!acc) { acc = { id: Store.uid(), firm: 'tradeify', alias: 'TradingView', size: 50000, phase: 'funded', status: 'activa', createdAt: UI.todayISO() }; db.accounts.push(acc); }
        const have = new Set(db.trades.map(t => t.extId).filter(Boolean));
        let added = 0;
        (d.trades || []).forEach(t => { if (t.extId && have.has(t.extId)) return; db.trades.push({ id: Store.uid(), accountId: acc.id, ...t }); added++; });
        db.tvsync.lastSync = new Date().toISOString(); save(); UI.closeSheet(); render();
        UI.toast(added ? `${added} trade(s) synced from TradingView` : "You're up to date");
      } catch (e) { UI.toast('Sync failed: ' + e.message); }
    },
    disconnectTV() { db.tvsync = null; save(); UI.closeSheet(); UI.toast('TradingView disconnected'); render(); },
    /* ---- Rutina de sesión (Jarvis co-piloto) ---- */
    rutinaBias:         el => window.RutinaCtrl?.setBias(el.dataset.v),
    rutinaRule:         el => window.RutinaCtrl?.toggleRule(el.dataset.id),
    rutinaGoPhase:      el => window.RutinaCtrl?.goPhase(el.dataset.p),
    rutinaStartSession:  () => window.RutinaCtrl?.startSession(),
    rutinaSetORB:        () => window.RutinaCtrl?.setORB(),
    rutinaAddTrade:      () => window.RutinaCtrl?.addTrade(),
    rutinaCloseSession:  () => window.RutinaCtrl?.closeSession(),
    rutinaSaveJournal:   () => window.RutinaCtrl?.saveJournal(),
    rutinaReset:         () => window.RutinaCtrl?.reset(),
    rutinaVoice:         () => window.RutinaCtrl?.welcome(),
    rutinaObsConnect() {
      const h  = (document.getElementById('obs-host')?.value || 'localhost').trim();
      const p  = parseInt(document.getElementById('obs-port')?.value || '4455');
      const pw = document.getElementById('obs-pass')?.value || '';
      window.RutinaCtrl?.obsConnect(h, p, pw);
    },
    rutinaCopyClips:     () => window.RutinaCtrl?.copyClipTimestamps(),

    go: el => go(el.dataset.route),
    seeLanding: () => go('landing'),
    openDiscord: () => { try { window.open('https://discord.gg/', '_blank', 'noopener'); } catch (e) {} },
    toggleTheme: () => { db.meta.theme = db.meta.theme === 'dark' ? 'light' : 'dark'; applyTheme(); save(); UI.toast(db.meta.theme === 'dark' ? 'Dark mode' : 'Snow mode'); render(); },
    toggleSidebar: () => { state.sidebar = !state.sidebar; render(); },
    closeSheet: () => UI.closeSheet(),
    closeBg: (el, ev) => { if (ev.target === el) UI.closeSheet(); },
    pick: el => { const g = el.closest('.pick'); if (!g) return; g.querySelectorAll('[data-pick]').forEach(b => b.classList.remove('on')); el.classList.add('on'); },
    openSettings: () => UI.sheet(Views.settings()),

    prevMonth: () => { state.period = UI.shiftMonth(state.period, -1); render(); },
    nextMonth: () => { state.period = UI.shiftMonth(state.period, 1); render(); },
    openDay: el => UI.sheet(Views.daySheet(el.dataset.date)),

    /* ---- course ---- */
    openLesson: el => { state.lessonId = el.dataset.id; go('lesson'); },
    continueCourse: () => { const n = Q.nextLesson(); if (n) { state.lessonId = n.id; go('lesson'); } else UI.toast('Course complete! 🎓'); },
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
      if (result === 'be') p = 0; else { p = Math.abs(p); if (p === 0) return UI.toast('Enter the result in $'); if (result === 'loss') p = -p; }
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
      pendingMedia = []; save(); UI.closeSheet(); UI.toast(id ? 'Trade updated' : 'Trade added!'); render();
    },
    delTrade: el => confirmDel('trades', el.dataset.id, 'this trade'),
    setTradePage: el => { state.tradePage = Number(el.dataset.p); render(); },

    /* ---- accounts ---- */
    addAccount: () => UI.sheet(Forms.account()),
    editAccount: el => { const a = find('accounts', el.dataset.id); if (a) UI.sheet(Forms.account(a)); },
    openAccount: el => UI.sheet(Views.accountSheet(el.dataset.id), true),
    saveAccount(el) {
      const id = el.dataset.id; const firm = sheetPick('firm') || 'tradeify'; const size = numv('a-size') || 50000;
      const alias = val('a-alias') || `${Data.firmOf(firm).label} ${Math.round(size / 1000)}K`;
      const data = { firm, alias, size, phase: sheetPick('phase') || 'eval', status: sheetPick('status') || 'activa' };
      if (id) Object.assign(find('accounts', id), data); else db.accounts.push({ id: Store.uid(), ...data, createdAt: UI.todayISO() });
      save(); UI.closeSheet(); UI.toast(id ? 'Account updated' : 'Account added'); render();
    },
    delAccount: el => confirmDel('accounts', el.dataset.id, 'this account'),

    /* ---- payouts ---- */
    addPayout: () => UI.sheet(Forms.payout()),
    editPayout: el => { const p = find('payouts', el.dataset.id); if (p) UI.sheet(Forms.payout(p)); },
    savePayout(el) {
      const id = el.dataset.id; const amount = numv('p-amount'); if (amount <= 0) return UI.toast('Enter the amount');
      const data = { date: val('p-date') || UI.todayISO(), firm: sheetPick('pfirm') || 'tradeify', accountId: document.getElementById('p-account')?.value || '', amount };
      if (id) Object.assign(find('payouts', id), data); else db.payouts.push({ id: Store.uid(), ...data });
      save(); UI.closeSheet(); UI.toast(id ? 'Payout updated' : 'Another payout! 🤑'); render();
    },
    delPayout: el => confirmDel('payouts', el.dataset.id, 'this payout'),

    /* ---- goals ---- */
    addGoal: () => UI.sheet(Forms.goal()),
    editGoal: el => { const g = find('goals', el.dataset.id); if (g) UI.sheet(Forms.goal(g)); },
    saveGoal(el) {
      const id = el.dataset.id; const name = val('g-name'); if (!name) return UI.toast('What do you want to achieve?');
      const data = { name, icon: sheetPick('gicon') || 'target', monthly: sheetPick('gmonthly') === 'si', target: numv('g-target'), saved: numv('g-saved') };
      if (id) Object.assign(find('goals', id), data); else db.goals.push({ id: Store.uid(), ...data });
      save(); UI.closeSheet(); UI.toast(id ? 'Goal updated' : 'Goal added'); render();
    },
    delGoal: el => confirmDel('goals', el.dataset.id, 'this goal'),

    /* ---- journal ---- */
    addNote: () => { pendingMedia = []; UI.sheet(Forms.note()); },
    editNote: el => { const n = find('journal', el.dataset.id); if (n) { initMedia(n); UI.sheet(Forms.note(n)); } },
    async saveNote(el) {
      const id = el.dataset.id; const text = val('n-text'); if (!text) return UI.toast('Write something');
      const orig = id ? find('journal', id) : null;
      const media = await commitMedia(orig && orig.media);
      const data = { date: val('n-date') || UI.todayISO(), tag: sheetPick('ntag') || 'nota', text, media };
      if (orig) Object.assign(orig, data); else db.journal.push({ id: Store.uid(), ...data });
      pendingMedia = []; save(); UI.closeSheet(); UI.toast(id ? 'Note updated' : 'Note saved'); render();
    },
    delNote: el => confirmDel('journal', el.dataset.id, 'this note'),

    toggleCheck(el) { const idc = el.dataset.id, k = UI.todayISO(); const arr = db.checks[k] || []; db.checks[k] = arr.includes(idc) ? arr.filter(x => x !== idc) : arr.concat(idc); save(); render(); },

    /* ---- attachments: photos / videos ---- */
    async attachMedia(el) {
      const files = [...(el.files || [])]; el.value = '';
      for (const f of files) {
        const isVid = (f.type || '').startsWith('video');
        if (isVid && f.size > 60 * 1024 * 1024) { UI.toast('Video too large (max 60 MB)'); continue; }
        try { const blob = isVid ? f : await Media.compressImage(f); pendingMedia.push({ k: rndKey(), type: isVid ? 'video' : 'image', isNew: true, blob }); }
        catch (e) { UI.toast("Couldn't add the file"); }
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

    /* ---- password (local lock) ---- */
    async unlock() {
      const v = document.getElementById('lock-pass')?.value || '';
      if (await hashPass(v) === db.meta.pass) { state.unlocked = true; render(); } else UI.toast('Wrong password');
    },
    forgotPass: () => UI.modal(`<div class="h3 mb8">Reset password</div>
      <p class="muted small mb12">Your data lives only on this device — no server, no email. To reset the password you have to start over: the trades and notes on this device will be erased.</p>
      <p class="muted small mb16">If you have a backup (.json) you can reload your info afterward.</p>
      <div class="btn-row"><button class="btn btn-ghost" data-act="closeSheet">Cancel</button>
      <button class="btn btn-danger" data-act="doForgotReset">Reset & start over</button></div>`),
    doForgotReset() {
      db = Store.empty(); db.meta.onboarded = true; db.plan = JSON.parse(JSON.stringify(Data.PLAN)); db.money = JSON.parse(JSON.stringify(Data.MONEY));
      save(); state.unlocked = true; UI.closeSheet(); state.period = UI.todayKey(); go('inicio'); UI.toast('Done, starting fresh');
    },
    passwordSettings: () => UI.sheet(`<div class="sheet-head"><div class="h2">${UI.icon('lock', '', 18)} Access password</div><div class="muted small">${App.db.meta.pass ? 'Change or remove your password.' : 'Protect your app with a password on this device.'}</div></div>
      <div class="form">
        ${App.db.meta.pass ? Forms.field('Current password', `<input class="input" id="pw-cur" type="password" autocomplete="current-password" />`) : ''}
        ${Forms.field(App.db.meta.pass ? 'New password' : 'Password', `<input class="input" id="pw-new" type="password" autocomplete="new-password" placeholder="At least 4 characters" />`)}
        ${Forms.field('Confirm', `<input class="input" id="pw-conf" type="password" autocomplete="new-password" />`)}
        <button class="btn btn-primary full" data-act="savePassword">${App.db.meta.pass ? 'Change password' : 'Create password'}</button>
      </div>
      ${App.db.meta.pass ? `<button class="dellink" data-act="removePassword">${UI.icon('trash', '', 15)} Remove password</button>` : ''}
      <p class="muted small mt12">It's a local lock on this device. If you forget it, you can only reset by starting over (keep a .json backup).</p>`),
    async savePassword() {
      const cur = document.getElementById('pw-cur')?.value;
      const nw = document.getElementById('pw-new')?.value || '';
      const cf = document.getElementById('pw-conf')?.value || '';
      if (db.meta.pass) { if (await hashPass(cur || '') !== db.meta.pass) return UI.toast('Current password is wrong'); }
      if (nw.length < 4) return UI.toast('At least 4 characters');
      if (nw !== cf) return UI.toast("Passwords don't match");
      db.meta.pass = await hashPass(nw); state.unlocked = true; save(); UI.closeSheet(); UI.toast('Password saved 🔒');
    },
    async removePassword() {
      const cur = document.getElementById('pw-cur')?.value;
      if (await hashPass(cur || '') !== db.meta.pass) return UI.toast('Enter your current password to remove it');
      delete db.meta.pass; save(); UI.closeSheet(); UI.toast('Password removed');
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
      save(); UI.closeSheet(); UI.toast('Split updated'); render();
    },

    /* ---- wallet / monthly expenses ---- */
    addExpense: () => UI.sheet(Forms.expense()),
    editExpense: el => { const e = find('expenses', el.dataset.id); if (e) UI.sheet(Forms.expense(e)); },
    saveExpense(el) {
      const id = el.dataset.id;
      const name = val('x-name'); const amount = numv('x-amount');
      if (!name) return UI.toast('What expense is it?');
      if (amount <= 0) return UI.toast('Enter the amount');
      const icon = sheetPick('xicon') || 'wallet';
      const palette = { home: '#5fd0ff', wallet: '#7fb0ff', car: '#ffd24a', star: '#22c55e', flame: '#a855f7', shield: '#06b6d4', coin: '#8a97a8' };
      const data = { name, amount, icon, color: palette[icon] || '#5fd0ff' };
      if (!db.expenses) db.expenses = [];
      if (id) Object.assign(find('expenses', id), data); else db.expenses.push({ id: Store.uid(), ...data });
      save(); UI.closeSheet(); UI.toast(id ? 'Expense updated' : 'Expense added'); render();
    },
    delExpense: el => confirmDel('expenses', el.dataset.id, 'this expense'),
    doDelete(el) { const kk = el.dataset.kind, id = el.dataset.id; delMediaOf((db[kk] || []).find(x => x.id === id)); db[kk] = db[kk].filter(x => x.id !== id); save(); UI.closeSheet(); UI.toast('Deleted'); render(); },

    /* ---- settings ---- */
    saveName() { db.meta.name = val('set-name') || 'Trader'; save(); UI.toast('Done'); render(); },
    exportData() { try { const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'northpoint-backup.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); UI.toast('Backup downloaded'); } catch (e) { UI.toast("Couldn't do it"); } },
    exportCSV() {
      try {
        const esc = v => { v = (v == null ? '' : String(v)); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
        const L = []; const row = (...a) => L.push(a.map(esc).join(','));
        row('NorthPoint · Trades'); row('Date', 'Time', 'Account', 'Symbol', 'Side', 'Qty', 'Entry', 'Exit', 'PnL', 'Result', 'Setup');
        Q.tradesDesc().forEach(t => { const ac = Q.accById(t.accountId) || {}; row(t.date, t.time, ac.alias || '', t.instrument, t.side, t.contracts, t.entry, t.exit, t.pnl, t.result, Data.setupOf(t.setup).label); });
        const blob = new Blob(['﻿' + L.join('\n')], { type: 'text/csv;charset=utf-8' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'northpoint-trades.csv'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); UI.toast('Exported to Excel');
      } catch (e) { UI.toast("Couldn't do it"); }
    },
    resetDemo: () => UI.modal(`<div class="h3 mb8">Load sample data?</div><p class="muted small mb16">Replaces what you have.</p><div class="btn-row"><button class="btn btn-ghost" data-act="closeSheet">Cancel</button><button class="btn btn-danger" data-act="doReset">Load</button></div>`),
    doReset() { db = Store.empty(); Data.seed(db); save(); UI.closeSheet(); state.period = UI.todayKey(); go('inicio'); UI.toast('Sample loaded'); },
    wipeAll: () => UI.modal(`<div class="h3 mb8">Delete everything?</div><p class="muted small mb16">Everything on this device will be deleted.</p><div class="btn-row"><button class="btn btn-ghost" data-act="closeSheet">Cancel</button><button class="btn btn-danger" data-act="doWipe">Delete all</button></div>`),
    doWipe() { db = Store.empty(); db.meta.onboarded = true; db.plan = JSON.parse(JSON.stringify(Data.PLAN)); save(); UI.closeSheet(); state.period = UI.todayKey(); go('inicio'); UI.toast('Starting fresh'); },
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

  function applyTheme() { document.documentElement.setAttribute('data-theme', 'dark'); } // always dark (to match the landing)
  function boot() {
    applyTheme();
    try {
      var pv = new URLSearchParams(location.search).get('preview');
      if (pv) {
        var map = { dashboard:'dashboard', journal:'dashboard', coach:'coach', academia:'academia', academy:'academia' };
        db = Store.empty(); Data.seed(db); db.meta.onboarded = true; state.unlocked = true; state.period = UI.todayKey();
        route = map[pv] || 'dashboard';
      }
    } catch (e) {}
    render();
  }
  document.addEventListener('DOMContentLoaded', boot);
  if (document.readyState !== 'loading') boot();

  // HUD: animated crystal temperature (igloo style)
  setInterval(() => {
    const t = document.getElementById('hud-temp'); if (!t) return;
    const v = 16 + Math.random() * 24, d = Math.random() * 4 - 2;
    t.innerHTML = `TEMP&nbsp;&nbsp;${v.toFixed(2)}<br><span class="hud-d">${d >= 0 ? '+' : '−'}${Math.abs(d).toFixed(2)}</span>`;
  }, 1600);
  if ('serviceWorker' in navigator && location.protocol === 'https:') { window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {})); }

  return { save, go, render, get db() { return db; }, get route() { return route; }, get period() { return state.period; }, get lessonId() { return state.lessonId; }, get tradePage() { return state.tradePage; }, get scenario() { return state.scenario; }, get pendingMedia() { return pendingMedia; } };
})();
