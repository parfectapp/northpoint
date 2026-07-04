/* ============ NorthPoint · Forms (capture sheets) ============ */
const Forms = (() => {
  const esc = UI.esc;

  // ---- field helpers ----
  const field = (label, inner, hint) =>
    `<label class="field"><span class="f-lbl">${label}</span>${inner}${hint ? `<span class="f-hint">${hint}</span>` : ''}</label>`;
  const input = (id, val, ph, type) =>
    `<input class="input" id="${id}" value="${esc(val == null ? '' : val)}" placeholder="${ph || ''}" ${type ? `type="${type}"` : ''} autocomplete="off" />`;
  const numField = (id, val, ph) =>
    `<input class="input" id="${id}" value="${val == null || val === '' ? '' : val}" placeholder="${ph || '0'}" type="text" inputmode="decimal" autocomplete="off" />`;
  const dateField = (id, val) =>
    `<input class="input" id="${id}" value="${val || UI.todayISO()}" type="date" />`;
  const area = (id, val, ph) =>
    `<textarea class="input area" id="${id}" placeholder="${ph || ''}" rows="3">${esc(val || '')}</textarea>`;

  function pick(group, opts, current) {
    return `<div class="pick" data-g="${group}">` + opts.map(o =>
      `<button class="chip ${o.v === current ? 'on' : ''}" data-pick data-v="${o.v}">${o.label}</button>`).join('') + `</div>`;
  }
  function select(id, opts, current) {
    return `<select class="input" id="${id}">` + opts.map(o =>
      `<option value="${o.v}" ${o.v === current ? 'selected' : ''}>${esc(o.label)}</option>`).join('') + `</select>`;
  }
  const head = (t, sub) => `<div class="sheet-head"><div class="h2">${t}</div>${sub ? `<div class="muted small">${sub}</div>` : ''}</div>`;
  const actions = (act, id, label) =>
    `<div class="btn-row mt8"><button class="btn btn-ghost" data-act="closeSheet">Cancel</button>
     <button class="btn btn-primary" data-act="${act}" ${id ? `data-id="${id}"` : ''}>${label}</button></div>`;
  const delRow = (act, id) => id ? `<button class="dellink" data-act="${act}" data-id="${id}">${UI.icon('trash', '', 15)} Delete</button>` : '';

  const accOptions = () => {
    const a = App.db.accounts.map(x => ({ v: x.id, label: `${x.alias} · ${Data.firmOf(x.firm).label}` }));
    return a.length ? a : [{ v: '', label: 'No accounts yet' }];
  };

  // ---- attachments: photos / videos ----
  function mediaStrip() {
    const list = (typeof App !== 'undefined' && App.pendingMedia) || [];
    return list.map(m => {
      let inner;
      if (m.isNew) {
        if (!m.url) m.url = URL.createObjectURL(m.blob);
        inner = m.type === 'video' ? `<video src="${m.url}" muted playsinline></video>` : `<img src="${m.url}" alt="" />`;
      } else {
        inner = m.type === 'video' ? `<video data-media="${m.id}" muted playsinline></video>` : `<img data-media="${m.id}" alt="" />`;
      }
      return `<div class="media-item" data-act="openMedia" data-key="${m.k}">${inner}${m.type === 'video' ? `<span class="media-play">${UI.icon('play', '', 16)}</span>` : ''}<button class="media-del" data-act="removeMedia" data-key="${m.k}" aria-label="Remove">${UI.icon('x', '', 12)}</button></div>`;
    }).join('');
  }
  function mediaField(label) {
    return `<div class="field"><span class="f-lbl">${label || 'Setup photos / videos'}</span>
      <div class="media-strip" id="media-strip">${mediaStrip()}</div>
      <label class="media-add">${UI.icon('plus', '', 16)} Add photo or video
        <input type="file" accept="image/*,video/*" multiple data-change="attachMedia" hidden />
      </label></div>`;
  }

  // ---- TRADE ----
  function trade(t) {
    t = t || {};
    const inst = Data.INSTRUMENTS.map(i => ({ v: i, label: i }));
    const setups = Data.SETUPS.map(s => ({ v: s.id, label: s.label }));
    const emo = Data.EMOTIONS.map(e => ({ v: e.id, label: e.label }));
    return head(t.id ? 'Edit trade' : 'New trade', 'Log how your trade went') + `
      <div class="form">
        <div class="grid2">
          ${field('Date', dateField('t-date', t.date))}
          ${field('Time', input('t-time', t.time, '07:48', 'time'))}
        </div>
        ${field('Account', select('t-account', accOptions(), t.accountId))}
        ${field('Instrument', pick('inst', inst, t.instrument || 'MNQ'))}
        ${field('Direction', pick('side', [{ v: 'long', label: 'Long' }, { v: 'short', label: 'Short' }], t.side || 'long'))}
        ${field('Result', pick('result', [{ v: 'win', label: 'Win' }, { v: 'loss', label: 'Loss' }, { v: 'be', label: 'BE' }], t.result || 'win'))}
        <div class="grid2">
          ${field('Contracts', numField('t-contracts', t.contracts, '4'))}
          ${field('Result $ (±)', numField('t-pnl', t.pnl, '+420 / -260'), 'Negative if you lost')}
        </div>
        <div class="grid2">
          ${field('Entry', numField('t-entry', t.entry, '30500.25'))}
          ${field('Exit', numField('t-exit', t.exit, '30516.50'))}
        </div>
        ${field('Setup', pick('setup', setups, t.setup || 'orb'))}
        ${field('How did I trade?', pick('emotion', emo, t.emotion || 'disciplina'))}
        ${field('Notes', area('t-notes', t.notes, 'What did you see? Did you follow the plan?'))}
        ${mediaField('Setup screenshot (photos / videos)')}
      </div>` + actions('saveTrade', t.id, t.id ? 'Save' : 'Add trade') + delRow('delTrade', t.id);
  }

  // ---- ACCOUNT ----
  function account(a) {
    a = a || {};
    const firms = Data.FIRMS.map(f => ({ v: f.id, label: f.label }));
    const phases = Data.PHASES.map(p => ({ v: p.id, label: p.label }));
    const status = Data.ACC_STATUS.map(s => ({ v: s.id, label: s.label }));
    return head(a.id ? 'Edit account' : 'New funded account') + `
      <div class="form">
        ${field('Firm', pick('firm', firms, a.firm || 'tradeify'))}
        ${field('Name / alias', input('a-alias', a.alias, 'Tradeify 50K'))}
        ${field('Account size ($)', numField('a-size', a.size, '50000'))}
        ${field('Phase', pick('phase', phases, a.phase || 'eval'))}
        ${field('Status', pick('status', status, a.status || 'activa'))}
      </div>` + actions('saveAccount', a.id, a.id ? 'Save' : 'Add account');
  }

  // ---- PAYOUT ----
  function payout(p) {
    p = p || {};
    const firms = Data.FIRMS.map(f => ({ v: f.id, label: f.label }));
    return head(p.id ? 'Edit payout' : 'Log payout', 'Another cash-out!') + `
      <div class="form">
        ${field('Date', dateField('p-date', p.date))}
        ${field('Firm', pick('pfirm', firms, p.firm || 'tradeify'))}
        ${field('Account (optional)', select('p-account', [{ v: '', label: '— Unassigned —' }].concat(accOptions().filter(o => o.v)), p.accountId || ''))}
        ${field('Amount paid out ($)', numField('p-amount', p.amount, '1000'), 'What landed in your pocket')}
      </div>` + actions('savePayout', p.id, p.id ? 'Save' : 'Log payout') + delRow('delPayout', p.id);
  }

  // ---- GOAL ----
  function goal(g) {
    g = g || {};
    const icons = [
      { v: 'home', label: 'Home' }, { v: 'car', label: 'Car' }, { v: 'wallet', label: 'Expenses' },
      { v: 'target', label: 'Goal' }, { v: 'trophy', label: 'Trophy' },
    ];
    return head(g.id ? 'Edit goal' : 'New goal', 'Your reason for trading') + `
      <div class="form">
        ${field('What do you want to achieve?', input('g-name', g.name, 'Apartment down payment'))}
        ${field('Icon', pick('gicon', icons, g.icon || 'target'))}
        ${field('Type', pick('gmonthly', [{ v: 'no', label: 'One-time goal' }, { v: 'si', label: 'Monthly expense' }], g.monthly ? 'si' : 'no'))}
        <div class="grid2">
          ${field('Target amount ($)', numField('g-target', g.target, '15000'))}
          ${field('Already have ($)', numField('g-saved', g.saved, '0'))}
        </div>
      </div>` + actions('saveGoal', g.id, g.id ? 'Save' : 'Add goal') + delRow('delGoal', g.id);
  }

  // ---- JOURNAL NOTE ----
  function note(n) {
    n = n || {};
    const tags = [
      { v: 'nota', label: 'Note' }, { v: 'win', label: 'Win' },
      { v: 'leccion', label: 'Lesson' }, { v: 'error', label: 'Error' },
    ];
    return head(n.id ? 'Edit note' : 'New note') + `
      <div class="form">
        ${field('Date', dateField('n-date', n.date))}
        ${field('Tag', pick('ntag', tags, n.tag || 'nota'))}
        ${field('What happened today?', area('n-text', n.text, 'Discipline, emotions, what to improve...'))}
        ${mediaField('Photos / videos')}
      </div>` + actions('saveNote', n.id, n.id ? 'Save' : 'Save note') + delRow('delNote', n.id);
  }

  // ---- EXPENSE (Wallet) ----
  function expense(e) {
    e = e || {};
    const icons = [
      { v: 'home', label: 'Home' }, { v: 'wallet', label: 'Food' }, { v: 'car', label: 'Car' },
      { v: 'star', label: 'Subscription' }, { v: 'flame', label: 'Treat' }, { v: 'shield', label: 'Insurance' }, { v: 'coin', label: 'Other' },
    ];
    return head(e.id ? 'Edit expense' : 'New expense', 'Your fixed monthly expense') + `
      <div class="form">
        ${field('What expense is it?', input('x-name', e.name, 'Rent'))}
        ${field('Amount per month ($)', numField('x-amount', e.amount, '400'))}
        ${field('Icon', pick('xicon', icons, e.icon || 'wallet'))}
      </div>` + actions('saveExpense', e.id, e.id ? 'Save' : 'Add expense') + delRow('delExpense', e.id);
  }

  return { trade, account, payout, goal, note, expense, pick, field, input, numField, head, mediaField, mediaStrip };
})();
