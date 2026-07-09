/* ============ NorthPoint · Views: Plan, Discipline, Journal & Settings ============ */
window.Views = window.Views || {};
(() => {
  const V = window.Views;
  const tagLabel = { win: 'Win', leccion: 'Lesson', error: 'Error', nota: 'Note' };

  V.plan = function () {
    const plan = App.db.plan || Data.PLAN;
    const today = UI.todayISO(), done = App.db.checks[today] || [];
    const items = plan.checklist || Data.PLAN.checklist;
    const okCount = items.filter(i => done.includes(i.id)).length;

    const checklist = `<div class="card">
      <div class="card-head"><div class="ch-t">${UI.icon('check', '', 18)} Today's checklist</div><span class="muted small">${okCount}/${items.length}</span></div>
      ${items.map(i => { const on = done.includes(i.id); return `<button class="checkitem ${on ? 'on' : ''}" data-act="toggleCheck" data-id="${i.id}"><span class="ci-box">${on ? UI.icon('check', '', 14) : ''}</span><span class="ci-lbl">${UI.esc(i.label)}</span></button>`; }).join('')}
      ${okCount === items.length ? `<div class="ci-done">Session under control! Discipline = freedom.</div>` : ''}
    </div>`;

    const routine = `<div class="card"><div class="card-head"><div class="ch-t">${UI.icon('clock', '', 18)} My routine (NY time)</div></div>
      <div class="routine">${(plan.routine || []).map(r => `<div class="rt"><div class="rt-t">${r.t}</div><div class="rt-line"><span class="rt-dot"></span></div><div class="rt-main"><div class="rt-lbl">${UI.esc(r.label)}</div><div class="muted small">${UI.esc(r.note || '')}</div></div></div>`).join('')}</div></div>`;

    const fases = `<div class="card"><div class="card-head"><div class="ch-t">${UI.icon('target', '', 18)} Funnel: Eval → Buffer → Payout</div></div>
      <div class="ftable"><div class="fhead"><span>Phase</span><span>Target</span><span>Max loss</span><span>Size</span></div>
      ${(plan.phases || Data.PLAN.phases).map(p => { const ph = Data.phaseOf(p.id); return `<div class="frow"><span class="phase" style="color:${ph.color}">${ph.short}</span><span class="up">${UI.usd(p.target)}</span><span class="down">${UI.usd(p.maxLoss)}</span><span>${UI.esc(p.size)}</span></div>`; }).join('')}</div></div>`;

    const reglas = `<div class="card"><div class="card-head"><div class="ch-t">${UI.icon('bolt', '', 18)} My rules</div></div><ul class="rules">${(plan.rules || []).map(r => `<li>${UI.esc(r)}</li>`).join('')}</ul></div>`;

    const pledge = `<div class="card pledge"><div class="pl-seal">${UI.logo(34)}</div><div class="pl-title">My commitment</div><p class="pl-text">"${UI.esc(plan.pledge)}"</p><div class="pl-sign">— ${UI.esc(App.db.meta.name || 'Trader')}</div></div>`;

    const notes = Q.db().journal.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
    const tagColor = { win: 'var(--up)', leccion: 'var(--gold)', error: 'var(--down)', nota: 'var(--muted)' };
    const bitacora = `<div class="card"><div class="card-head"><div class="ch-t">${UI.icon('book', '', 18)} Journal</div><button class="link" data-act="addNote">+ Note</button></div>
      ${notes.length ? notes.map(n => `<div class="note-wrap"><button class="noterow" data-act="editNote" data-id="${n.id}"><span class="nt-tag" style="background:${tagColor[n.tag] || 'var(--muted)'}22;color:${tagColor[n.tag] || 'var(--muted)'}">${tagLabel[n.tag] || 'Note'}</span><div class="nt-main"><div class="muted small">${UI.date(n.date)}</div><div class="nt-text">${UI.esc(n.text)}</div></div></button>${n.media && n.media.length ? `<div class="note-media">${n.media.map(mm => `<button class="media-item sm" data-act="viewMedia" data-id="${mm.id}" data-type="${mm.type}">${mm.type === 'video' ? `<video data-media="${mm.id}" muted playsinline></video><span class="media-play">${UI.icon('play', '', 14)}</span>` : `<img data-media="${mm.id}" alt="" />`}</button>`).join('')}</div>` : ''}</div>`).join('') : UI.empty('book', 'Empty journal', 'Write down your lessons.')}</div>`;

    return `<div class="page"><div class="grid2-wide">${checklist}${routine}</div><div class="grid2-wide">${fases}${reglas}</div>${pledge}${bitacora}</div>`;
  };

  V.settings = function () {
    const d = App.db;
    return `<div class="sheet-head"><div class="h2">Settings</div></div>
      <div class="form">${Forms.field('Your name', Forms.input('set-name', d.meta.name, 'Your name'))}<button class="btn btn-ghost full" data-act="saveName">Save name</button></div>
      <div class="setlist">
        <button class="setrow2" data-act="connectTradovate">${UI.icon('plug', '', 18)} <span>Connect Tradovate (live sync)${d.sync?.session ? ' · connected' : ''}</span></button>
        <button class="setrow2" data-act="connectTradingView">${UI.icon('sync', '', 18)} <span>Connect TradingView (auto-sync)${d.tvsync?.url ? ' · connected' : ''}</span></button>
        <button class="setrow2" data-act="exportCSV">${UI.icon('download', '', 18)} <span>Export trades to Excel (.csv)</span></button>
        <button class="setrow2" data-act="exportData">${UI.icon('share', '', 18)} <span>Back up my data (.json)</span></button>
        <button class="setrow2" data-act="seeLanding">${UI.icon('gift', '', 18)} <span>View course page</span></button>
        <button class="setrow2" data-act="resetDemo">${UI.icon('play', '', 18)} <span>Load sample data</span></button>
        <button class="setrow2" data-act="passwordSettings">${UI.icon('lock', '', 18)} <span>Access password${d.meta.pass ? ' · on' : ''}</span></button>
        <button class="setrow2" data-act="logout">${UI.icon('user', '', 18)} <span>Log out</span></button>
        <button class="setrow2 danger" data-act="wipeAll">${UI.icon('trash', '', 18)} <span>Delete everything and start over</span></button>
      </div>
      <div class="muted small center mt12">NorthPoint · your data lives on this device.</div>`;
  };
})();
