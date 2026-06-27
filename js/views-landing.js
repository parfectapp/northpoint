/* ============ RACHA · Landing del curso "De Cero a Payout" ============ */
window.Views = window.Views || {};
(() => {
  const V = window.Views;

  // ⚙️ Edita estos datos y listo:
  const CFG = {
    whatsapp: '524434405815',          // tu número con código de país (sin +)
    waMsg: 'Hola André, quiero entrar al curso De Cero a Payout 🚀',
    price: 4990,                        // precio en MXN
    priceOld: 7990,
    spots: 50,
  };
  const wa = () => `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(CFG.waMsg)}`;
  const mxn = n => '$' + (n).toLocaleString('es-MX');

  const stat = (v, k) => `<div class="lp-stat"><div class="lp-stat-v">${v}</div><div class="lp-stat-k">${k}</div></div>`;

  // mini-mockup del journal en el hero
  function mock() {
    const cells = [
      'up', 'up', 'down', 'up', 'none', 'none', 'none',
      'up', 'down', 'up', 'up', 'up', 'none', 'none',
      'up', 'flat', 'up', 'up', 'none', 'none', 'none',
    ];
    const amts = { 0: '+420', 1: '+180', 2: '−260', 3: '+540', 7: '+380', 8: '−290', 9: '+460', 10: '+220', 14: '+350', 16: '+290', 17: '+410' };
    return `<div class="lp-phone">
      <div class="lp-ph-top"><span class="lp-ph-lbl">Total cobrado</span><b class="lp-ph-big">$10,500</b><span class="lp-ph-tag">11 payouts</span></div>
      <div class="lp-ph-cal">
        ${cells.map((c, i) => `<span class="lp-cc ${c}">${amts[i] ? `<i>${amts[i]}</i>` : ''}</span>`).join('')}
      </div>
      <div class="lp-ph-foot"><span>Junio</span><b class="lp-up">+$3,000</b></div>
    </div>`;
  }

  const MODULES = [
    ['clock', 'La rutina del trader rentable', 'El bloque NY: premarket 7:00, apertura 7:30, ORB 7:45, cierre 9:00. Operar 90 minutos con foco, no todo el día.'],
    ['bolt', 'ORB + Killzones', 'Cómo marcar el rango de apertura y leer las killzones para entrar solo en los momentos de mayor probabilidad.'],
    ['chart', 'EMAs 14/50 + SMC', 'Lectura institucional: estructura, liquidez y order blocks combinados con medias para confirmar el A+ setup.'],
    ['shield', 'Gestión de riesgo', 'Riesgo por trade, máximo diario y por qué "W = stop". El número que separa al rentable del quemado.'],
    ['target', 'El embudo Eval → Buffer → Payout', 'Pasar el fondeo, construir el buffer y cobrar. Targets y riesgo exactos por fase para no reventar la cuenta.'],
    ['book', 'Psicología y disciplina', 'El contrato del trader, manejo de FOMO y revancha, y cómo el journal convierte la disciplina en hábito.'],
    ['candles', 'Tu journal Snowball', 'Te llevas la plataforma: calendario de P&L, control de cuentas y tu cartera. Mides tu progreso real cada día.'],
    ['coin', 'De payout a patrimonio', 'Qué hacer con cada cobro: reinvertir, escalar cuentas y construir tu depa, tu coche y tu libertad.'],
  ];

  V.landing = function () {
    const nav = `<nav class="lp-nav">
      <div class="lp-brand">${UI.logo(28)} <b>NORTHPOINT</b></div>
      <div class="lp-nav-r">
        <a class="lp-link" href="#temario">Temario</a>
        <button class="lp-btn ghost" data-act="openApp">Crear cuenta</button>
      </div>
    </nav>`;

    const hero = `<header class="lp-hero">
      <div class="lp-hero-txt">
        <span class="lp-eyebrow">CURSO + APP · CUPO LIMITADO</span>
        <h1>De <span class="grad">Cero a Payout</span>.<br>Aprende a cobrar de cuentas de fondeo.</h1>
        <p class="lp-sub">El sistema exacto con el que paso evaluaciones y cobro payouts operando los primeros 90 minutos de Nueva York en MNQ. Una <b>plataforma</b> con el curso completo + tu journal de trading en un solo lugar.</p>
        <div class="lp-cta-row">
          <a class="lp-btn gold" href="${wa()}" target="_blank" rel="noopener">${UI.icon('wapp', '', 18)} Quiero entrar</a>
          <button class="lp-btn ghost" data-act="openApp">${UI.icon('play', '', 16)} Entrar a la plataforma</button>
        </div>
        <div class="lp-stats">
          ${stat('11', 'payouts cobrados')}
          ${stat('$10.5K', 'en los últimos meses')}
          ${stat('90 min', 'de operación al día')}
        </div>
      </div>
      <div class="lp-hero-art">${mock()}</div>
    </header>`;

    const proof = `<section class="lp-proof">
      <div class="lp-proof-i">${UI.icon('trophy', '', 18)} Resultados reales, no promesas</div>
      <div class="lp-proof-i">${UI.icon('shield', '', 18)} Gestión de riesgo primero</div>
      <div class="lp-proof-i">${UI.icon('clock', '', 18)} Solo 90 min al día</div>
      <div class="lp-proof-i">${UI.icon('candles', '', 18)} App de journal incluida</div>
    </section>`;

    const forWho = `<section class="lp-section">
      <h2>¿Para quién es esto?</h2>
      <div class="lp-cards3">
        <div class="lp-card"><div class="lp-card-ic">${UI.icon('user', '', 22)}</div><h3>El que empieza</h3><p>Quieres entrar al trading de futuros con un método claro y dejar de improvisar.</p></div>
        <div class="lp-card"><div class="lp-card-ic">${UI.icon('flame', '', 22)}</div><h3>El que ya opera</h3><p>Tienes cuentas de fondeo pero te cuesta pasar la eval o sostener el payout.</p></div>
        <div class="lp-card"><div class="lp-card-ic">${UI.icon('target', '', 22)}</div><h3>El disciplinado</h3><p>No buscas magia. Buscas un sistema, reglas y datos para mejorar cada semana.</p></div>
      </div>
    </section>`;

    const temario = `<section class="lp-section" id="temario">
      <h2>Qué vas a aprender</h2>
      <p class="lp-section-sub">8 módulos, del setup a cobrar. Más la app para aplicarlo desde el día 1.</p>
      <div class="lp-mods">
        ${MODULES.map((m, i) => `<div class="lp-mod">
          <div class="lp-mod-n">${String(i + 1).padStart(2, '0')}</div>
          <div class="lp-mod-ic">${UI.icon(m[0], '', 20)}</div>
          <div><h3>${m[1]}</h3><p>${m[2]}</p></div>
        </div>`).join('')}
      </div>
    </section>`;

    const includes = `<section class="lp-section">
      <h2>Todo lo que incluye</h2>
      <div class="lp-incl">
        ${[
          ['academy', 'Curso en video', 'Acceso de por vida a los 8 módulos dentro de la plataforma.'],
          ['candles', 'Journal Snowball', 'Dashboard, calendario de P&L, cuentas de fondeo y tu cartera.'],
          ['wapp', 'Comunidad', 'Grupo privado para dudas, sesgo diario y acompañamiento.'],
          ['book', 'Plantillas', 'Checklist de sesión, plan de riesgo y el contrato del trader.'],
        ].map(x => `<div class="lp-incl-i">${UI.icon(x[0], '', 20)}<div><b>${x[1]}</b><span>${x[2]}</span></div></div>`).join('')}
      </div>
    </section>`;

    const price = `<section class="lp-section">
      <div class="lp-price">
        <div class="lp-price-tag">Inscripción</div>
        <div class="lp-price-row"><span class="lp-old">${mxn(CFG.priceOld)}</span><span class="lp-now">${mxn(CFG.price)}</span></div>
        <div class="lp-price-sub">Pago único · acceso de por vida · cupo a ${CFG.spots} alumnos</div>
        <ul class="lp-price-list">
          <li>${UI.icon('check', '', 16)} Curso completo "De Cero a Payout"</li>
          <li>${UI.icon('check', '', 16)} Journal Snowball + money management</li>
          <li>${UI.icon('check', '', 16)} Comunidad privada + plantillas</li>
          <li>${UI.icon('check', '', 16)} Sesgo diario y soporte</li>
        </ul>
        <a class="lp-btn gold full" href="${wa()}" target="_blank" rel="noopener">${UI.icon('wapp', '', 18)} Apartar mi lugar</a>
      </div>
    </section>`;

    const faqs = [
      ['¿Necesito experiencia previa?', 'No. Empezamos desde la rutina y los conceptos base. Si ya operas, vas directo a afinar tu gestión y tu embudo de payout.'],
      ['¿Cuánto capital necesito?', 'Trabajamos con cuentas de fondeo (Apex, Tradeify, etc.). La inversión es la cuenta de evaluación, no tu capital en riesgo directo.'],
      ['¿Cuánto tiempo al día?', 'El sistema opera los primeros 90 minutos de Nueva York. Disciplina por encima de horas frente a la pantalla.'],
      ['¿La plataforma tiene costo aparte?', 'No. El journal Snowball viene incluido con el curso y funciona en tu teléfono, incluso sin internet.'],
    ];
    const faq = `<section class="lp-section">
      <h2>Preguntas frecuentes</h2>
      <div class="lp-faq">
        ${faqs.map(f => `<details class="lp-faq-i"><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join('')}
      </div>
    </section>`;

    const finalCta = `<section class="lp-final">
      <h2>Tu próximo payout empieza con disciplina.</h2>
      <p>Únete, aplica el sistema y haz crecer tu riqueza con Snowball.</p>
      <a class="lp-btn gold" href="${wa()}" target="_blank" rel="noopener">${UI.icon('wapp', '', 18)} Quiero mi lugar</a>
    </section>`;

    const foot = `<footer class="lp-foot">
      <div>${UI.logo(24)} <b>NORTHPOINT</b> · De Cero a Payout</div>
      <p class="lp-disc">El trading de futuros implica riesgo de pérdida. Los resultados pasados no garantizan resultados futuros. Este contenido es educativo y no constituye asesoría financiera.</p>
    </footer>`;

    return `<div class="lp np">${nav}${heroSky()}${appShowcase()}${featureGrid()}${seaBottom()}</div>`;
  };

  // -------- TODO LO QUE HAY: grid de funciones --------
  function featureGrid() {
    const items = [
      ['candles', 'Journal de trades', 'Cada operación: símbolo, lado, P&L, setup, cómo operaste y notas.'],
      ['cal', 'Calendario de P&L', 'Tu mes en verde y rojo. La verdad de tu consistencia, día a día.'],
      ['image', 'Fotos y videos del setup', 'Adjunta el screenshot o video de tu gráfico a cada trade y a tu bitácora.'],
      ['building', 'Cuentas de fondeo', 'Controla tus cuentas Apex / Tradeify por fase y registra cada payout.'],
      ['snow', 'Snowball', 'Reparte cada payout: reinversión, inversión, gastos, reserva y gusto.'],
      ['wallet', 'Cartera', 'Tus gastos del mes y cuántos payouts necesitas generar para cubrirlos.'],
      ['academy', 'Academia', 'El curso "De Cero a Payout": 8 módulos con video y tu progreso.'],
      ['shield', 'Plan & disciplina', 'Rutina NY, tus reglas, el contrato del trader, checklist y bitácora.'],
      ['sync', 'Sync en vivo', 'Conecta tu cuenta y sincroniza tus trades reales en automático.'],
      ['lock', 'Privado y offline', 'Candado con contraseña, tus datos en tu dispositivo y funciona sin internet.'],
    ];
    return `<section class="np-grid-sec">
      <div class="np-showcase-intro"><span class="nf-eyebrow">TODO ADENTRO</span><h2>Todo lo que hay en tu brújula.</h2></div>
      <div class="np-fgrid">${items.map(x => `<div class="np-fcard">${UI.icon(x[0], '', 22)}<h3>${x[1]}</h3><p>${x[2]}</p></div>`).join('')}</div>
    </section>`;
  }

  // ====================== HERO NORTHPOINT (día + estrella + mar + marinero) ======================
  function gulls() {
    let s = '';
    for (let i = 0; i < 5; i++) {
      const top = (8 + Math.random() * 30).toFixed(0), dur = (26 + Math.random() * 24).toFixed(0),
        dl = (-Math.random() * 30).toFixed(0), sc = (0.5 + Math.random() * 0.7).toFixed(2);
      s += `<span class="np-gull" style="top:${top}%;transform:scale(${sc});animation-duration:${dur}s;animation-delay:${dl}s">
        <svg viewBox="0 0 40 16"><path d="M2 12 Q10 2 20 11 Q30 2 38 12" fill="none" stroke="#3a567a" stroke-width="2.2" stroke-linecap="round"/></svg></span>`;
    }
    return s;
  }
  // estrellas titilando para el cielo nocturno
  function stars() {
    let s = '';
    for (let i = 0; i < 70; i++) {
      const left = (Math.random() * 100).toFixed(1), top = (Math.random() * 72).toFixed(1),
        sz = (1 + Math.random() * 2.3).toFixed(1), dl = (Math.random() * 4).toFixed(1),
        dur = (2.4 + Math.random() * 3.4).toFixed(1), o = (0.35 + Math.random() * 0.6).toFixed(2);
      s += `<span class="np-star-dot" style="left:${left}%;top:${top}%;width:${sz}px;height:${sz}px;--o:${o};animation-delay:${dl}s;animation-duration:${dur}s"></span>`;
    }
    return s;
  }

  // -------- CIELO NOCTURNO (arriba): NORTHPOINT + estrella polar --------
  function heroSky() {
    return `<section class="np-hero">
      <div class="np-stars">${stars()}</div>
      <span class="np-shoot"></span><span class="np-shoot s2"></span>
      <div class="np-moon"><span class="np-moon-core"></span></div>
      <span class="np-cloud c1"></span><span class="np-cloud c2"></span>
      <div class="np-brand-wrap">
        <div class="np-star">
          <svg viewBox="0 0 64 64" class="np-star-svg">${UI.compassStar(32, '#dbe8f8', '#9fc2ea')}</svg>
          <span class="np-star-glow"></span>
        </div>
        <h1 class="np-title">NORTHPOINT</h1>
        <div class="np-sub">TRADING ANALYTICS</div>
        <button class="np-beta" data-act="openApp">Beta</button>
      </div>
      <div class="np-cue ss-mono">// NORTHPOINT · © 2026 · Tu brújula en los mercados.<br>Scroll para zarpar ↓ &nbsp;·&nbsp; ♪ Sonido: Off</div>
    </section>`;
  }

  // -------- MEDIO: mientras bajas, te va mostrando la app --------
  function shotDashboard() {
    const cells = ['up', 'up', 'down', 'up', 'none', 'none', 'none', 'up', 'down', 'up', 'up', 'up', 'none', 'none', 'up', 'flat', 'up', 'up', 'none', 'none', 'none'];
    return `<div class="app-shot">
      <div class="as-bar"><i></i><i></i><i></i><span>Journal · Dashboard</span></div>
      <div class="as-pad">
        <div class="as-kpis"><div><span>PNL</span><b class="up">+$7.7K</b></div><div><span>Profit factor</span><b>1.52</b></div><div><span>Win rate</span><b>44.4%</b></div></div>
        <div class="as-cal">${cells.map(c => `<span class="as-cc ${c}"></span>`).join('')}</div>
      </div></div>`;
  }
  function shotSnowball() {
    return `<div class="app-shot">
      <div class="as-bar"><i></i><i></i><i></i><span>Snowball · Money &amp; Cartera</span></div>
      <div class="as-pad as-snow">
        <div class="pie-wrap as-pie">${UI.pie(Data.MONEY.allocations, 140)}<div class="pie-center"><b>$955</b><span class="muted small">payout</span></div></div>
        <div class="as-flow">
          <div><span>Ingreso</span><b class="up">$3,818</b></div>
          <div><span>Gastos</span><b class="down">$1,060</b></div>
          <div class="hi"><span>Libre</span><b class="ice">$2,758</b></div>
        </div>
      </div></div>`;
  }
  function shotAcademia() {
    const mods = [['Bienvenida y mentalidad', 100], ['La rutina del trader', 66], ['ORB + Killzones', 0], ['Gestión de riesgo', 0]];
    return `<div class="app-shot">
      <div class="as-bar"><i></i><i></i><i></i><span>Academia · Curso</span></div>
      <div class="as-pad">
        <div class="as-prog"><span>24% del curso</span><div class="as-bar2"><span style="width:24%"></span></div></div>
        ${mods.map(m => `<div class="as-mod"><span class="as-mod-ic ${m[1] === 100 ? 'done' : ''}"></span><span class="as-mod-t">${m[0]}</span><span class="as-mod-p">${m[1]}%</span></div>`).join('')}
      </div></div>`;
  }
  function feature(eyebrow, title, body, shot, flip) {
    return `<div class="np-feature ${flip ? 'flip' : ''}">
      <div class="nf-text"><span class="nf-eyebrow">${eyebrow}</span><h2>${title}</h2><p>${body}</p></div>
      <div class="nf-shot">${shot}</div>
    </div>`;
  }
  function appShowcase() {
    return `<section class="np-showcase">
      <div class="np-showcase-intro">
        <span class="nf-eyebrow">LA PLATAFORMA</span>
        <h2>Una brújula para tu trading.<br>Conforme bajas, la conoces.</h2>
      </div>
      ${feature('JOURNAL', 'Cada trade, en tu calendario.', 'Dashboard con tu P&amp;L, profit factor y win rate. El calendario verde/rojo que te dice la verdad, día a día.', shotDashboard(), false)}
      ${feature('SNOWBALL · INTEGRADO', 'Tu dinero, en piloto automático.', 'Snowball y tu cartera, juntos: reparte cada payout, controla tus gastos del mes y mira cuántos payouts necesitas para cubrirlos.', shotSnowball(), true)}
      ${feature('ACADEMIA', 'El curso completo, adentro.', 'De Cero a Payout: 8 módulos con tu rutina NY, ORB, gestión de riesgo y el embudo Eval → Buffer → Payout.', shotAcademia(), false)}
    </section>`;
  }

  // -------- FONDO: el mar + marinero + CTA --------
  function seaBottom() {
    return `<section class="np-sea-bottom">
      <div class="np-cta">
        <h2>¿Listo para zarpar?</h2>
        <p>Aprende el sistema, lleva tu journal y haz crecer tu riqueza como una bola de nieve.</p>
        <div class="np-cta-row">
          <button class="lp-btn gold" data-act="openApp">Crear cuenta y entrar →</button>
          <a class="lp-btn ghost" href="${wa()}" target="_blank" rel="noopener">${UI.icon('wapp', '', 18)} Tomar el curso</a>
        </div>
      </div>
      <div class="np-sea">
        <svg class="np-waves" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path class="w w1" d="M0,160 C240,110 480,210 720,170 C960,130 1200,210 1440,160 L1440,320 L0,320 Z"/>
          <path class="w w2" d="M0,200 C240,160 480,250 720,210 C960,175 1200,250 1440,205 L1440,320 L0,320 Z"/>
          <path class="w w3" d="M0,245 C240,215 480,285 720,250 C960,220 1200,285 1440,250 L1440,320 L0,320 Z"/>
        </svg>
        <div class="np-boat">
          <svg viewBox="0 0 220 170" aria-hidden="true">
            <path d="M112 18 L112 104 L168 96 Z" fill="#eef3f8"/>
            <path d="M112 18 L112 104 L168 96 Z" fill="none" stroke="#cdd9e6" stroke-width="2"/>
            <path d="M112 40 L150 92 M112 64 L142 93 M112 86 L134 94" stroke="#d34f4f" stroke-width="3" opacity=".55"/>
            <path d="M108 16 L108 110 L72 100 Z" fill="#ffffff"/>
            <rect x="108" y="14" width="4" height="96" rx="2" fill="#7a5a3a"/>
            <path d="M36 108 Q110 150 186 108 L172 132 Q110 162 50 132 Z" fill="#1f3f63"/>
            <path d="M36 108 Q110 150 186 108 L182 116 Q110 154 40 116 Z" fill="#2c537c"/>
            <path d="M52 118 H170" stroke="#e8eef4" stroke-width="3" opacity=".7"/>
            <g transform="translate(86 78)">
              <rect x="-7" y="10" width="14" height="22" rx="5" fill="#2b6da8"/>
              <path d="M-7 14 H7 M-7 20 H7" stroke="#fff" stroke-width="2.4" opacity=".85"/>
              <circle cx="0" cy="3" r="8" fill="#f3c9a0"/>
              <path d="M-9 0 a9 5 0 0 1 18 0 Z" fill="#1f3550"/>
              <rect x="-9" y="-1" width="18" height="2.4" rx="1.2" fill="#1f3550"/>
              <circle cx="0" cy="-3.4" r="1.6" fill="#d34f4f"/>
            </g>
          </svg>
        </div>
        <div class="np-foot ss-mono">NORTHPOINT · © 2026 · Tu brújula en los mercados. — El trading implica riesgo. Contenido educativo.</div>
      </div>
    </section>`;
  }

  // ---------- ESCENA 1: SNOWBALL ----------
  function snowStageSnowball() {
    return `<section class="snow-stage snowball-stage">
      <svg class="ss-mtns" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice">
        <path class="m far" d="M0,270 L240,150 L430,255 L660,120 L900,255 L1150,140 L1440,250 L1440,420 L0,420Z"/>
        <path class="m mid" d="M0,330 L260,215 L520,330 L780,205 L1050,330 L1310,235 L1440,315 L1440,420 L0,420Z"/>
        <path class="m near" d="M0,390 L300,310 L600,390 L900,305 L1200,390 L1440,335 L1440,420 L0,420Z"/>
      </svg>
      <div class="ss-fog"></div>
      <div class="ss-ground"></div>
      <div class="ss-fall">${flakes()}</div>
      <div class="ss-stage">
        <span class="sbr-shadow"></span>
        <div class="sbr-wrap">
          <span class="sbr-glow"></span>
          <div class="sbr-ball">
            <span class="sbr-shade"></span>
            <span class="sbr-grain"></span>
            <span class="sbr-spec"></span>
          </div>
        </div>
      </div>
      <svg class="ss-grain" aria-hidden="true"><filter id="ggrain"><feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#ggrain)"/></svg>
      <div class="ss-ui">
        <div class="ss-tr ss-mono">////// Manifiesto<br>Cada payout se divide, se reinvierte<br>y crece solo. Disciplina + interés<br>compuesto = libertad.</div>
        <div class="ss-bl ss-mono">// SNOWBALL INVESTMENTS · © 2026 · Tu riqueza, bola de nieve.<br>Scroll para descubrir ↓ &nbsp;·&nbsp; ♪ Sonido: Off</div>
      </div>
    </section>`;
  }

  // ---------- HERO ANIMADO: SNOWBALL (estilo igloo.inc) ----------
  function flakes() {
    let s = '';
    for (let i = 0; i < 30; i++) {
      const l = (Math.random() * 100).toFixed(1), d = (6 + Math.random() * 9).toFixed(1), dl = (-Math.random() * 12).toFixed(1),
        sz = (2 + Math.random() * 4).toFixed(1), o = (.25 + Math.random() * .6).toFixed(2), x = (Math.random() * 40 - 20).toFixed(0);
      s += `<span class="flake" style="left:${l}%;width:${sz}px;height:${sz}px;animation-duration:${d}s;animation-delay:${dl}s;opacity:${o};--x:${x}px"></span>`;
    }
    return s;
  }
  // ---------- ESCENA 2: CRISTAL (PORTFOLIO_CO_01) ----------
  function snowStageCrystal() {
    return `<section class="snow-stage ice">
      <div class="ss-scan"></div>
      <div class="ss-fog2"></div>
      <div class="ss-fall">${flakes()}</div>
      <svg class="hud-lines" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g stroke="rgba(64,80,92,.5)" stroke-width="1" fill="none">
          <path d="M515 250 L360 208 M360 208 L348 203 M360 208 L353 216"/>
          <path d="M510 300 L322 312 M322 312 L310 307 M322 312 L315 321"/>
          <path d="M520 345 L352 396 M352 396 L340 392 M352 396 L346 405"/>
          <path d="M690 250 L862 214 M862 214 L850 210 M862 214 L854 222"/>
          <path d="M695 330 L884 372 M884 372 L872 368"/>
        </g>
        <g fill="rgba(64,80,92,.6)"><circle cx="348" cy="203" r="2"/><circle cx="310" cy="307" r="2"/><circle cx="340" cy="392" r="2"/><circle cx="850" cy="210" r="2"/></g>
      </svg>
      <div class="ss-stage">
        <div class="crystal-wrap" data-act="openApp">
          <span class="cr-glow"></span>
          <div class="crystal">
            <svg class="cr-svg" viewBox="0 0 260 366" aria-hidden="true">
              <defs>
                <linearGradient id="icL" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1f6f9" stop-opacity=".95"/><stop offset="1" stop-color="#9eafba" stop-opacity=".8"/></linearGradient>
                <linearGradient id="icD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cdd9e0"/><stop offset="1" stop-color="#6c7d86"/></linearGradient>
                <radialGradient id="icCore" cx="50%" cy="42%" r="62%"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#dcebf5"/><stop offset="1" stop-color="#9fb6c4" stop-opacity="0"/></radialGradient>
                <clipPath id="icClip"><path d="M130 14 L192 86 L224 176 L180 296 L130 352 L88 286 L40 188 L74 92 Z"/></clipPath>
              </defs>
              <path d="M130 14 L192 86 L224 176 L180 296 L130 352 L88 286 L40 188 L74 92 Z" fill="url(#icD)" opacity=".6"/>
              <g clip-path="url(#icClip)">
                <circle cx="130" cy="198" r="80" fill="url(#icCore)"/>
                <circle cx="130" cy="190" r="44" fill="#ffffff" opacity=".35"/>
                <text x="130" y="212" text-anchor="middle" font-family="'Sora',sans-serif" font-weight="800" font-size="52" fill="#ffffff" opacity=".6">$</text>
              </g>
              <g opacity=".5">
                <polygon points="130,70 74,92 40,188 120,210" fill="url(#icL)"/>
                <polygon points="130,70 192,86 224,176 120,210" fill="url(#icL)" opacity=".82"/>
                <polygon points="40,188 88,286 130,352 120,210" fill="url(#icL)" opacity=".7"/>
                <polygon points="224,176 180,296 130,352 120,210" fill="url(#icL)" opacity=".62"/>
                <polygon points="130,14 74,92 130,70 192,86" fill="#ffffff" opacity=".5"/>
              </g>
              <g fill="none" stroke="#ffffff" stroke-opacity=".75" stroke-width="1.2" stroke-linejoin="round">
                <path d="M130 14 L192 86 L224 176 L180 296 L130 352 L88 286 L40 188 L74 92 Z"/>
                <path d="M130 14 L130 70 M74 92 L130 70 L192 86 M40 188 L120 210 L224 176 M88 286 L120 210 L180 296 M120 210 L130 352"/>
              </g>
              <polygon points="100,62 120,72 96,150 80,150" fill="#ffffff" opacity=".45"/>
            </svg>
          </div>
        </div>
      </div>
      <div class="ss-ui">
        <div class="hud-label"><span class="hl-1">PORTFOLIO_CO_01</span><span class="hl-2">SNOWBALL INVESTMENTS</span></div>
        <div class="hud-temp" id="hud-temp">TEMP&nbsp;&nbsp;35.58<br><span class="hud-d">+01.99</span></div>
        <button class="hud-explore" data-act="openApp"><span>D 23.06.2026</span><b>CLICK TO EXPLORE →</b></button>
        <div class="ss-bl ss-mono">♪ Sonido: Off</div>
      </div>
    </section>`;
  }

  // ---------- SECCIÓN MONEY MANAGEMENT (teaser) ----------
  function moneySection() {
    const m = Data.MONEY;
    return `<section class="lp-section" id="snowball">
      <span class="lp-eyebrow" style="display:table;margin:0 auto 14px">${UI.icon('snow', '', 13)} SNOWBALL · MONEY MANAGEMENT</span>
      <h2>Tu dinero, en piloto automático</h2>
      <p class="lp-section-sub">No solo aprendes a cobrar. Aprendes a repartir cada payout para que tu patrimonio crezca como una bola de nieve.</p>
      <div class="money-grid">
        <div class="lp-card money-pie"><div class="pie-wrap">${UI.pie(m.allocations, 220)}<div class="pie-center"><b>100%</b><span class="muted small">cada payout</span></div></div></div>
        <div class="money-legend">
          ${m.allocations.map(a => `<div class="ml"><span class="alloc-dot" style="background:${a.color}"></span><span class="ml-name">${a.name}</span><b>${a.pct}%</b></div>`).join('')}
          <div class="money-note">Reinversión + inversión = <b>60%</b> alimenta tu snowball. Dentro de la plataforma proyectas tu patrimonio a 20-30 años con tu Portafolio IA 2040.</div>
          <button class="lp-btn blue" data-act="openApp">Ver el plan completo →</button>
        </div>
      </div>
    </section>`;
  }
})();
