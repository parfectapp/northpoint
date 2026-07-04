/* ============ RACHA · UI: iconos, formato, gráficas, calendario ============ */
const UI = (() => {
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const initials = n => (n || 'T').trim().split(/\s+/).slice(0, 2).map(x => x[0]).join('').toUpperCase();

  const ICONS = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h6v-6h2v6h6V10"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    academy: '<path d="M12 4 2 9l10 5 10-5-10-5Z"/><path d="M6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5"/><path d="M22 9v5"/>',
    play: '<path d="M8 5v14l11-7Z"/>',
    playc: '<circle cx="12" cy="12" r="9"/><path d="M10 9v6l5-3Z"/>',
    flag: '<path d="M5 21V4M5 4h11l-1.5 4L16 12H5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    candles: '<path d="M6 4v4M6 16v4M18 3v5M18 17v4"/><rect x="3.5" y="8" width="5" height="8" rx="1"/><rect x="15.5" y="8" width="5" height="9" rx="1"/>',
    chart: '<path d="M4 20V4M4 20h16"/><rect x="7" y="12" width="3" height="5"/><rect x="12" y="8" width="3" height="9"/><rect x="17" y="5" width="3" height="12"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
    shield: '<path d="M12 3 5 6v5c0 5 3.5 8 7 10 3.5-2 7-5 7-10V6l-7-3Z"/><path d="m9 11.5 2 2 4-4.2"/>',
    coin: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5c0-1 1-1.7 2.5-1.7s2.5.7 2.5 1.7-1 1.5-2.5 1.5-2.5.5-2.5 1.5 1 1.7 2.5 1.7 2.5-.7 2.5-1.7"/>',
    wallet: '<path d="M3 7a2 2 0 0 1 2-2h12v4"/><path d="M3 7v10a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2Z"/><circle cx="16.5" cy="13" r="1.3"/>',
    car: '<path d="M5 16h14M4 16l1.5-5a2 2 0 0 1 1.9-1.4h9.2A2 2 0 0 1 18.5 11L20 16M3 16v3h2v-2M21 16v3h-2v-2"/><circle cx="7.5" cy="16.5" r="1.5"/><circle cx="16.5" cy="16.5" r="1.5"/>',
    trophy: '<path d="M7 4h10v4a5 5 0 0 1-10 0V4Z"/><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M9 18h6M10 14v4M14 14v4M8 21h8"/>',
    book: '<path d="M5 4h11a2 2 0 0 1 2 2v14H6a1 1 0 0 1-1-1V4Z"/><path d="M9 4v15M5 19a1 1 0 0 1 1-1h12"/>',
    bolt: '<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/>',
    flame: '<path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-1 .4-2 1-2.6C9 11 9 13 11 13c0-3-1-5 1-10Z"/>',
    cockpit: '<circle cx="12" cy="13" r="8"/><path d="M12 13l4-3M12 5V3M5 13H3M21 13h-2"/>',
    link: '<path d="M9 15l6-6M10.5 7.5 12 6a4 4 0 0 1 6 6l-1.5 1.5M13.5 16.5 12 18a4 4 0 0 1-6-6l1.5-1.5"/>',
    users: '<circle cx="9" cy="8" r="3.4"/><path d="M3 20c1-3.6 3.6-5.4 6-5.4s5 1.8 6 5.4"/><path d="M16 5.2A3 3 0 0 1 18 11M17.6 14.8c2 .7 3.4 2.5 3.9 5"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/>',
    building: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3"/>',
    gift: '<rect x="3" y="8" width="18" height="5" rx="1"/><path d="M5 13v8h14v-8M12 8v13M12 8C12 8 9 3 6.5 5S9 8 12 8ZM12 8c0 0 3-5 5.5-3S15 8 12 8Z"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/>',
    bell: '<path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5A2.5 2.5 0 1 1 13 12c-1 .6-1 1-1 2M12 17h.01"/>',
    moon: '<path d="M20 14A8 8 0 1 1 10 4a6 6 0 0 0 10 10Z"/>',
    sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/>',
    panel: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    checkc: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.4 2.4 4.6-4.8"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    chev: '<path d="m9 6 6 6-6 6"/>', chevL: '<path d="m15 6-6 6 6 6"/>', chevR: '<path d="m9 6 6 6-6 6"/>', chevDown: '<path d="m6 9 6 6 6-6"/>',
    back: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
    trash: '<path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="M14 6l4 4"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    trendUp: '<path d="M3 17l6-6 4 4 7-8"/><path d="M21 11V7h-4"/>',
    trendDn: '<path d="M3 7l6 6 4-4 7 8"/><path d="M21 13v4h-4"/>',
    arrUp: '<path d="M12 19V5M5 12l7-7 7 7"/>', arrDn: '<path d="M12 5v14M19 12l-7 7-7-7"/>',
    share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 11 16 7M8.2 13 16 17"/>',
    download: '<path d="M12 4v11M8 11l4 4 4-4M5 20h14"/>',
    wapp: '<path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.6-1.2A9 9 0 1 0 12 3Z"/><path d="M9 8.5c0 4 2.5 6.5 6.5 6.5.6 0 1-.5 1-1l-.2-1.4-2 .6c-1.6-.6-2.4-1.4-3-3l.6-2L10.5 7c-.5 0-1 .4-1 1Z" fill="currentColor" stroke="none"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    star: '<path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9Z"/>',
    sync: '<path d="M21 12a9 9 0 0 1-15 6.7L3 16M3 12a9 9 0 0 1 15-6.7L21 8M3 21v-5h5M21 3v5h-5"/>',
    snow: '<path d="M12 2v20M5 5.5l14 13M19 5.5l-14 13M12 5l2.4 1.4M12 5 9.6 6.4M12 19l2.4-1.4M12 19l-2.4-1.4M4.3 8.2l2.7.1M4.3 8.2l.1 2.7M19.7 15.8l-2.7-.1M19.7 15.8l-.1-2.7M19.7 8.2l-2.7.1M19.7 8.2l-.1 2.7M4.3 15.8l2.7-.1M4.3 15.8l.1-2.7"/>',
    pie: '<path d="M12 3a9 9 0 1 0 9 9h-9V3Z"/><path d="M14 3.5A9 9 0 0 1 20.5 10H14Z"/>',
    plug: '<path d="M9 2v6M15 2v6M7 8h10v3a5 5 0 0 1-10 0V8ZM12 16v6"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.6"/><path d="m4 18 5-5 3.5 3 3-3 5 5"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3Z"/>',
  };
  function icon(name, cls, size) {
    const p = ICONS[name] || ICONS.list; const s = size || 18;
    return `<svg class="ic ${cls || ''}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  }
  // estrella / rosa de los vientos de NORTHPOINT
  function compassStar(c, t1, t2) {
    let p = '';
    for (let i = 0; i < 8; i++) {
      const a = (-90 + i * 45) * Math.PI / 180;
      const L = (i % 2 === 0) ? 29 : 13;
      const tx = c + Math.cos(a) * L, ty = c + Math.sin(a) * L;
      const w = 4.6;
      const lx = c + Math.cos(a - Math.PI / 2) * w, ly = c + Math.sin(a - Math.PI / 2) * w;
      const rx = c + Math.cos(a + Math.PI / 2) * w, ry = c + Math.sin(a + Math.PI / 2) * w;
      const f = n => n.toFixed(1);
      p += `<path d="M${f(tx)} ${f(ty)} L${f(lx)} ${f(ly)} L${c} ${c} Z" fill="${t1}"/>`;
      p += `<path d="M${f(tx)} ${f(ty)} L${f(rx)} ${f(ry)} L${c} ${c} Z" fill="${t2}"/>`;
    }
    return p + `<circle cx="${c}" cy="${c}" r="2.4" fill="${t1}"/>`;
  }
  function logo(size) {
    const s = size || 28;
    return `<svg width="${s}" height="${s}" viewBox="0 0 64 64" aria-hidden="true" style="flex:none">${compassStar(32, '#2f4d70', '#557aa3')}</svg>`;
  }

  // ---- formato ----
  const usd = n => '$' + Math.round(Math.abs(n || 0)).toLocaleString('en-US');
  function pnl(n) { n = Math.round(n || 0); const s = n > 0 ? '+' : n < 0 ? '−' : ''; return s + '$' + Math.abs(n).toLocaleString('en-US'); }
  // compacto estilo TradeSyncer: +$7.7K / +$759.80
  function money(n, sign) {
    const a = Math.abs(n || 0); const sg = (n > 0 ? '+' : n < 0 ? '−' : '');
    const body = a >= 1000 ? '$' + (a / 1000).toFixed(1) + 'K' : '$' + a.toFixed(2);
    return (sign ? sg : (n < 0 ? '−' : '')) + body;
  }
  function bigK(n) { const a = Math.abs(n || 0); const sg = n > 0 ? '+' : n < 0 ? '−' : ''; return sg + '$' + (a >= 1000 ? (a / 1000).toFixed(1) + 'K' : Math.round(a)); }
  const pnlClass = n => (n > 0 ? 'up' : n < 0 ? 'down' : 'flat');
  const num = n => Math.round(n || 0).toLocaleString('en-US');
  const pct = (a, b) => b ? Math.round((a / b) * 100) : 0;
  const pct1 = (a, b) => b ? Math.round((a / b) * 1000) / 10 : 0;
  function dur(sec) { sec = Math.round(sec || 0); if (sec < 60) return sec + 's'; const m = Math.floor(sec / 60), s = sec % 60; return s ? `${m}m ${s}s` : `${m}m`; }
  function price(n) { return '$' + (n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

  // ---- fechas ----
  const MES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const MESL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  function date(iso) { if (!iso) return ''; const [y, m, d] = iso.split('-').map(Number); return `${MES[m - 1]} ${d}`; }
  function dateUS(iso) { if (!iso) return ''; const [y, m, d] = iso.split('-').map(Number); return `${MESL[m - 1].slice(0, 3)} ${d}, ${y}`; }
  function dateLong(iso) { if (!iso) return ''; const [y, m, d] = iso.split('-').map(Number); return `${MESL[m - 1]} ${d}, ${y}`; }
  function monthKey(iso) { return (iso || '').slice(0, 7); }
  function monthLabel(key) { const [y, m] = key.split('-').map(Number); return `${MESL[m - 1]} ${y}`; }
  const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const todayKey = () => todayISO().slice(0, 7);
  function shiftMonth(key, d) { let [y, m] = key.split('-').map(Number); m += d; while (m < 1) { m += 12; y--; } while (m > 12) { m -= 12; y++; } return y + '-' + String(m).padStart(2, '0'); }
  // matriz domingo→sábado
  function monthMatrix(key) {
    const [y, m] = key.split('-').map(Number);
    const first = new Date(y, m - 1, 1);
    const days = new Date(y, m, 0).getDate();
    const lead = first.getDay(); // 0 = domingo
    const cells = [];
    for (let i = 0; i < lead; i++) cells.push(null);
    for (let d = 1; d <= days; d++) cells.push(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }

  // ---- gráficas SVG ----
  function areaChart(vals, color) {
    color = color || '#22c55e';
    if (!vals.length) return '';
    const w = 300, h = 90, pad = 4;
    const min = Math.min(0, ...vals), max = Math.max(0, ...vals) || 1;
    const range = (max - min) || 1;
    const x = i => pad + (i / (vals.length - 1 || 1)) * (w - pad * 2);
    const y = v => h - pad - ((v - min) / range) * (h - pad * 2);
    const pts = vals.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
    const area = `${pad},${h - pad} ${pts} ${w - pad},${h - pad}`;
    return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
      <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".35"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
      <polygon points="${area}" fill="url(#ag)"/>
      <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round"/>
    </svg>`;
  }
  function barChart(vals) {
    if (!vals.length) return '';
    const w = 300, h = 90, gap = 6;
    const max = Math.max(1, ...vals.map(Math.abs));
    const bw = (w - gap * (vals.length - 1)) / vals.length;
    return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${vals.map((v, i) => {
      const bh = Math.max(2, (Math.abs(v) / max) * (h - 8));
      const x = i * (bw + gap);
      return `<rect x="${x.toFixed(1)}" y="${(h - bh).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="2" fill="${v >= 0 ? '#22c55e' : '#ef4444'}"/>`;
    }).join('')}</svg>`;
  }
  function donut(pctv, color, label) {
    color = color || '#22c55e'; const r = 26, c = 2 * Math.PI * r; const off = c * (1 - Math.min(1, pctv / 100));
    return `<svg width="68" height="68" viewBox="0 0 68 68"><circle cx="34" cy="34" r="${r}" fill="none" stroke="#d3dce2" stroke-width="7"/>
      <circle cx="34" cy="34" r="${r}" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${off}" transform="rotate(-90 34 34)"/>
      ${label ? `<text x="34" y="38" text-anchor="middle" fill="#e7ecf3" font-size="15" font-weight="700" font-family="Sora">${label}</text>` : ''}</svg>`;
  }
  function scoreTri(win, profit, risk) {
    // 3 ejes (arriba=Profit, abajo-izq=Loss/control, abajo-der=Win) normalizados 0..1
    const cx = 60, cy = 58, R = 44;
    const ax = [[cx, cy - R], [cx - R * 0.87, cy + R * 0.5], [cx + R * 0.87, cy + R * 0.5]];
    const vals = [profit, risk, win];
    const pt = (i) => { const a = ax[i], k = Math.max(.08, vals[i]); return [cx + (a[0] - cx) * k, cy + (a[1] - cy) * k]; };
    const poly = [0, 1, 2].map(i => pt(i).map(n => n.toFixed(1)).join(',')).join(' ');
    const grid = ax.map(a => `${a[0]},${a[1]}`).join(' ');
    return `<svg width="120" height="118" viewBox="0 0 120 120">
      <polygon points="${grid}" fill="none" stroke="#c4cfd8" stroke-width="1.5"/>
      <polygon points="${ax.map(a=>`${cx+(a[0]-cx)*.5},${cy+(a[1]-cy)*.5}`).join(' ')}" fill="none" stroke="#c4cfd8" stroke-width="1"/>
      <line x1="${cx}" y1="${cy}" x2="${ax[0][0]}" y2="${ax[0][1]}" stroke="#c4cfd8"/><line x1="${cx}" y1="${cy}" x2="${ax[1][0]}" y2="${ax[1][1]}" stroke="#c4cfd8"/><line x1="${cx}" y1="${cy}" x2="${ax[2][0]}" y2="${ax[2][1]}" stroke="#c4cfd8"/>
      <polygon points="${poly}" fill="#2f9fc633" stroke="#2f9fc6" stroke-width="2"/>
    </svg>`;
  }

  // ---- pie / rueda de quesos ----
  function pie(segs, size) {
    size = size || 200; const cx = size / 2, cy = size / 2, r = size / 2 - 2;
    if (!segs.length) return '';
    const polar = deg => { const a = (deg - 90) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
    let cum = 0;
    const wedges = segs.map(s => {
      const start = cum / 100 * 360, end = (cum + s.pct) / 100 * 360; cum += s.pct;
      if (s.pct >= 99.999) return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${s.color}"/>`;
      const [x1, y1] = polar(start), [x2, y2] = polar(end); const large = (end - start) > 180 ? 1 : 0;
      return `<path d="M${cx} ${cy} L${x1.toFixed(2)} ${y1.toFixed(2)} A${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z" fill="${s.color}" stroke="#ffffff" stroke-width="2.2" opacity=".94"/>`;
    }).join('');
    return `<svg viewBox="0 0 ${size} ${size}" class="pie-svg">${wedges}<circle cx="${cx}" cy="${cy}" r="${(r * 0.46).toFixed(1)}" fill="#f3f7f9" stroke="#dde5ea" stroke-width="1.5"/></svg>`;
  }

  function bar(value, max, color) {
    const w = max > 0 ? Math.max(0, Math.min(100, Math.round((value / max) * 100))) : 0;
    return `<div class="bar-track"><span style="width:${w}%;background:${color || 'var(--brand)'}"></span></div>`;
  }
  function dot(color) { return `<span class="dot" style="background:${color}"></span>`; }

  let toastT;
  function toast(msg) { const el = document.getElementById('toast'); if (!el) return; el.innerHTML = msg; el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2400); }

  function sheet(html, big) {
    const root = document.getElementById('sheet-root');
    root.innerHTML = `<div class="sheet-bg" data-act="closeBg"><div class="sheet ${big ? 'big' : ''}"><div class="grab"></div>${html}</div></div>`;
    requestAnimationFrame(() => root.querySelector('.sheet-bg')?.classList.add('in'));
    if (typeof Media !== 'undefined') Media.hydrate(root);
  }
  function modal(html) {
    const root = document.getElementById('sheet-root');
    root.innerHTML = `<div class="modal-bg" data-act="closeBg"><div class="modal">${html}</div></div>`;
    requestAnimationFrame(() => root.querySelector('.modal-bg')?.classList.add('in'));
    if (typeof Media !== 'undefined') Media.hydrate(root);
  }
  function closeSheet() { document.getElementById('sheet-root').innerHTML = ''; }
  function empty(ic, title, sub) { return `<div class="empty"><div class="empty-ic">${icon(ic, '', 26)}</div><div class="empty-t">${title}</div>${sub ? `<div class="empty-s">${sub}</div>` : ''}</div>`; }

  return {
    esc, initials, icon, logo, compassStar,
    usd, pnl, money, bigK, pnlClass, num, pct, pct1, dur, price,
    date, dateUS, dateLong, monthKey, monthLabel, todayISO, todayKey, shiftMonth, monthMatrix, MES, MESL, DOW,
    areaChart, barChart, donut, scoreTri, pie, bar, dot,
    toast, sheet, modal, closeSheet, empty,
  };
})();
