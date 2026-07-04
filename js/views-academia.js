/* ============ NorthPoint · Views: Academy (course) ============ */
window.Views = window.Views || {};
(() => {
  const V = window.Views;

  // -------- COURSE HUB --------
  V.academia = function () {
    const cs = Q.courseStats();
    const next = Q.nextLesson();
    const nextMod = next ? Data.COURSE.find(m => m.lessons.some(l => l.id === next.id)) : null;

    const hero = `<div class="card course-hero">
      <div class="ch-l">
        <div class="eyebrow">${UI.icon('academy', '', 15)} COURSE · ZERO TO PAYOUT</div>
        <h1>Learn the system, then take it to your journal.</h1>
        <p class="muted">${Data.COURSE.length} modules · ${Data.allLessons().length} lessons. Your progress saves itself.</p>
        <div class="course-prog">
          <div class="cp-bar">${UI.bar(cs.done, cs.total, 'var(--brand)')}</div>
          <span class="cp-txt"><b>${cs.pct}%</b> · ${cs.done}/${cs.total} lessons</span>
        </div>
        <button class="btn btn-primary" data-act="continueCourse">${UI.icon('play', '', 16)} ${cs.done ? 'Continue course' : 'Start course'}${next ? ` · ${UI.esc(next.title)}` : ''}</button>
      </div>
      <div class="ch-r">${UI.donut(cs.pct, 'var(--brand)', cs.pct + '%')}<span class="muted small">complete</span></div>
    </div>`;

    const modules = Data.COURSE.map(m => {
      const ms = Q.moduleStats(m);
      const lessons = m.lessons.map(l => {
        const done = Q.lessonDone(l.id);
        return `<button class="lesson-row" data-act="openLesson" data-id="${l.id}">
          <span class="lr-ic ${done ? 'done' : ''}">${done ? UI.icon('check', '', 14) : UI.icon('play', '', 13)}</span>
          <span class="lr-title">${UI.esc(l.title)}</span>
          <span class="lr-dur">${l.dur}</span>
        </button>`;
      }).join('');
      return `<div class="card module">
        <div class="mod-head">
          <div class="mod-ic" style="background:${m.color}1f;color:${m.color};border-color:${m.color}55">${UI.icon(m.icon, '', 20)}</div>
          <div class="mod-info"><div class="mod-t"><span class="mod-n">Module ${m.n}</span> · ${UI.esc(m.title)}</div><div class="muted small">${UI.esc(m.desc)}</div></div>
          <div class="mod-prog ${ms.pct === 100 ? 'full' : ''}">${ms.done}/${ms.total}</div>
        </div>
        <div class="lessons">${lessons}</div>
      </div>`;
    }).join('');

    return `<div class="page">${hero}<div class="modgrid">${modules}</div></div>`;
  };

  // -------- LESSON --------
  V.lesson = function () {
    const l = Data.lessonById(App.lessonId);
    if (!l) return V.academia();
    const mod = Data.COURSE.find(m => m.lessons.some(x => x.id === l.id));
    const done = Q.lessonDone(l.id);
    const idx = mod.lessons.findIndex(x => x.id === l.id);

    const list = mod.lessons.map(x => {
      const d = Q.lessonDone(x.id);
      return `<button class="lesson-row ${x.id === l.id ? 'active' : ''}" data-act="openLesson" data-id="${x.id}">
        <span class="lr-ic ${d ? 'done' : ''}">${d ? UI.icon('check', '', 14) : UI.icon('play', '', 13)}</span>
        <span class="lr-title">${UI.esc(x.title)}</span><span class="lr-dur">${x.dur}</span></button>`;
    }).join('');

    return `<div class="page lesson-page">
      <button class="link mb12" data-act="go" data-route="academia">${UI.icon('back', '', 15)} Back to Academy</button>
      <div class="lesson-grid">
        <div class="lesson-main">
          <div class="video">
            <div class="video-ph">${UI.icon('playc', '', 56)}<span>Lesson video</span><small class="muted">Paste your video (YouTube/Vimeo) here when you publish</small></div>
          </div>
          <div class="lesson-meta">
            <span class="pill-mod" style="color:${mod.color};border-color:${mod.color}55">Module ${mod.n}</span>
            <span class="muted small">${UI.icon('clock', '', 13)} ${l.dur}</span>
          </div>
          <h1 class="lesson-title">${UI.esc(l.title)}</h1>
          <p class="lesson-desc">${UI.esc(l.desc)}</p>
          <div class="lesson-actions">
            <button class="btn ${done ? 'btn-ghost' : 'btn-primary'}" data-act="toggleLesson" data-id="${l.id}">${done ? UI.icon('checkc', '', 16) + ' Completed' : UI.icon('check', '', 16) + ' Mark complete'}</button>
            <button class="btn btn-ghost" data-act="nextLesson">Next ${UI.icon('chevR', '', 16)}</button>
          </div>
        </div>
        <aside class="lesson-aside">
          <div class="card">
            <div class="ch-t mb8">${UI.icon(mod.icon, '', 16)} ${UI.esc(mod.title)}</div>
            <div class="lessons">${list}</div>
          </div>
        </aside>
      </div>
    </div>`;
  };
})();
