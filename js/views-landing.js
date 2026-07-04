/* ============ RACHA · Landing del curso "De Cero a Payout" ============ */
window.Views = window.Views || {};
(() => {
  const V = window.Views;

  // ⚙️ Edita estos datos y listo:
  const CFG = {
    whatsapp: '524434405815',          // tu número con código de país (sin +)
    waMsg: 'Hi André, I want to join the Zero to Payout course 🚀',
    checkout: '',                      // ← PEGA AQUÍ tu link de pago (Stripe Payment Link / Gumroad / Lemon Squeezy / MercadoPago / Hotmart). Vacío = los botones de compra van a WhatsApp. Ver PAGOS.md
    price: 4990,                        // precio en MXN
    priceOld: 7990,
    spots: 50,
  };
  const wa = () => `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(CFG.waMsg)}`;
  const buy = () => CFG.checkout || wa();   // botón de compra: link de pago si existe, si no WhatsApp
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
        <a class="lp-link" href="#pricing">Pricing</a>
        <button class="lp-btn ghost" data-act="openApp">Get started</button>
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

    return `<div class="lp np">${nav}${heroSky()}${appShowcase()}${featureGrid()}${credibility()}${seaBottom()}</div>`;
  };

  // ====================== CREDIBILIDAD / CERTIFICACIONES (inglés, fondo oscuro propio) ======================
  function credibility() {
    const firms = ['Apex', 'Tradeify', 'Topstep', 'MyFundedFutures', 'Take Profit Trader', 'Bulenox'];
    const seals = [
      ['shield', 'Risk-Managed Method', '1% max risk per trade, hard daily stop loss'],
      ['lock', 'SSL Secure Checkout', '256-bit encrypted payments'],
      ['checkc', '30-Day Money-Back', 'Full refund, no questions asked'],
      ['academy', 'Certificate of Completion', 'Earn your Zero-to-Payout certificate'],
      ['sync', 'Lifetime Updates', 'Every new lesson and feature, free forever'],
      ['trophy', 'Verified Results', 'Real, documented prop-firm payouts'],
    ];
    const tts = [
      ['I blew 4 accounts before this. Passed my first Apex eval in 9 days.', 'Diego R.', 'Funded · Apex 50K'],
      ['The journal alone changed my trading. I finally see my own patterns.', 'Marisol G.', 'Tradeify 100K'],
      ['90 minutes a day, real rules, no hype. First payout last month.', 'Andrés V.', 'Funded trader'],
    ];
    const faqs = [
      ['Do I need any experience?', 'No. We start from the routine and the core concepts. If you already trade, you go straight to tightening your risk management and your payout funnel.'],
      ['How much capital do I need?', 'You trade with prop-firm accounts (Apex, Tradeify, and more). Your investment is the evaluation fee — not your own capital at direct risk.'],
      ['How much time per day?', 'The system trades the first 90 minutes of the New York session. Discipline over hours in front of the screen.'],
      ['Is the app an extra cost?', 'No. The NorthPoint journal is included with the course and runs on your phone — even offline.'],
      ['Is there a guarantee?', 'Yes. If it is not for you, email us within 30 days for a full refund. No questions asked.'],
    ];
    const stars = `<span class="np-stars5">${UI.icon('star', '', 13)}${UI.icon('star', '', 13)}${UI.icon('star', '', 13)}${UI.icon('star', '', 13)}${UI.icon('star', '', 13)}</span>`;

    return `<section class="np-cred">
      <div class="np-cred-inner">

        <div class="np-cred-stats">
          <div><b>11</b><span>verified payouts</span></div>
          <div><b>$10.5K</b><span>paid out</span></div>
          <div><b>90 min</b><span>trading a day</span></div>
          <div><b>1.52</b><span>profit factor</span></div>
        </div>

        <div class="np-cred-block">
          <span class="nf-eyebrow">${UI.icon('building', '', 13)} GET FUNDED WITH</span>
          <h2>The industry's leading prop firms.</h2>
          <div class="np-firms">${firms.map(f => `<span class="np-firm">${f}</span>`).join('')}</div>
          <p class="np-cred-sub">You trade evaluation capital from the top prop firms — not your own money. We teach you to pass the eval and get paid.</p>
        </div>

        <div class="np-cred-block">
          <span class="nf-eyebrow">${UI.icon('shield', '', 13)} CERTIFICATIONS &amp; GUARANTEES</span>
          <h2>Built to be trusted.</h2>
          <div class="np-seals">
            ${seals.map(s => `<div class="np-seal"><span class="np-seal-ic">${UI.icon(s[0], '', 22)}</span><div><b>${s[1]}</b><span>${s[2]}</span></div></div>`).join('')}
          </div>
        </div>

        <div class="np-cred-block">
          <span class="nf-eyebrow">${UI.icon('users', '', 13)} WHAT STUDENTS SAY</span>
          <h2>From quitting to cashing out.</h2>
          <div class="np-tts">
            ${tts.map(t => `<figure class="np-tt">${stars}<blockquote>"${t[0]}"</blockquote><figcaption><b>${t[1]}</b><span>${t[2]}</span></figcaption></figure>`).join('')}
          </div>
        </div>

        <div class="np-price-wrap" id="pricing">
          <div class="np-price-card">
            <span class="np-price-badge">MOST POPULAR</span>
            <div class="np-price-name">Zero to Payout</div>
            <div class="np-price-row"><span class="np-price-old">$399</span><span class="np-price-now">$249</span><span class="np-price-cur">USD</span></div>
            <div class="np-price-sub">One-time payment · lifetime access · only ${CFG.spots} seats</div>
            <ul class="np-price-list">
              <li>${UI.icon('check', '', 15)} Full "Zero to Payout" course — 8 modules</li>
              <li>${UI.icon('check', '', 15)} NorthPoint journal &amp; analytics app</li>
              <li>${UI.icon('check', '', 15)} Private community + templates</li>
              <li>${UI.icon('check', '', 15)} Daily market bias &amp; support</li>
              <li>${UI.icon('check', '', 15)} Certificate of completion</li>
              <li>${UI.icon('check', '', 15)} 30-day money-back guarantee</li>
            </ul>
            <a class="lp-btn gold full" href="${buy()}" target="_blank" rel="noopener">${UI.icon('lock', '', 17)} Enroll now — $249 →</a>
            <div class="np-price-guar">${UI.icon('shield', '', 14)} 30-day money-back guarantee · secure checkout</div>
            <a class="np-price-alt" href="${wa()}" target="_blank" rel="noopener">${UI.icon('wapp', '', 15)} Questions? Chat on WhatsApp</a>
          </div>
        </div>

        <div class="np-cred-block">
          <span class="nf-eyebrow">${UI.icon('help', '', 13)} FAQ</span>
          <h2>Questions, answered.</h2>
          <div class="np-faq">
            ${faqs.map(f => `<details class="np-faq-i"><summary>${f[0]}${UI.icon('chevDown', '', 16)}</summary><p>${f[1]}</p></details>`).join('')}
          </div>
        </div>

        <p class="np-cred-disc">Trading futures involves a substantial risk of loss. Past results do not guarantee future returns. NorthPoint is educational content and is not financial advice.</p>
      </div>
    </section>`;
  }

  // -------- TODO LO QUE HAY: grid de funciones --------
  function featureGrid() {
    const items = [
      ['cockpit', 'AI Coach', 'An AI reads your whole history and turns your edge — best hours, setups, mistakes — into mechanizable rules.'],
      ['candles', 'Trade journal', 'Log every trade: symbol, side, P&L, setup and how you executed. The habit that makes you profitable.'],
      ['cal', 'P&L calendar', 'Your month in green and red. The truth about your consistency, day by day.'],
      ['image', 'Setup photos & video', 'Attach the screenshot or video of your chart to every trade.'],
      ['building', 'Funded accounts', 'Track your Apex / Tradeify accounts by phase and log every payout.'],
      ['academy', 'Zero to Payout course', '8 video modules, from your first eval to cashing your payout.'],
      ['sync', 'Live sync', 'Connect your account and sync your real trades automatically.'],
      ['lock', 'Private & offline', 'Password lock, your data on your device, works without internet.'],
    ];
    return `<section class="np-grid-sec">
      <div class="np-showcase-intro"><span class="nf-eyebrow">THE JOURNAL + THE COURSE</span><h2>Everything you need to reach payout.</h2></div>
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
      <div class="np-cue ss-mono">// NORTHPOINT · © 2026 · Your compass in the markets.<br>Scroll to set sail ↓ &nbsp;·&nbsp; ♪ Sound: Off</div>
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
  // -------- iPhone mockups (como en las otras landings) mostrando la app --------
  const npPhoneChrome = `<span class="np-ip-btn np-ip-vol"></span><span class="np-ip-btn np-ip-pow"></span><span class="np-ip-island"></span>`;
  function npPhone(scr, cls) {
    return `<div class="np-iphone ${cls || ''}">${npPhoneChrome}<div class="np-ip-scr">${scr}</div></div>`;
  }
  // captura real de la app (tomada de la app verdadera)
  function shotImg(name, alt) {
    return `<img class="np-ip-img" src="assets/shots/${name}.jpg" alt="${alt}" loading="lazy" />`;
  }
  function phoneScreen(title, body) {
    return `<div class="np-ip-app">
      <div class="np-ip-sb"><span>9:41</span><span class="np-ip-sb-r">5G<span class="np-bat"></span></span></div>
      <div class="np-ip-top"><span class="np-ip-ttl">${title}</span></div>
      <div class="np-ip-pad">${body}</div>
    </div>`;
  }
  function psDash() {
    const cells = ['up', 'up', 'down', 'up', 'none', 'none', 'none', 'up', 'down', 'up', 'up', 'up', 'none', 'none', 'up', 'flat', 'up', 'up', 'none', 'none', 'none'];
    return phoneScreen('Dashboard', `
      <div class="as-kpis"><div><span>PNL</span><b class="up">+$7.7K</b></div><div><span>PF</span><b>1.52</b></div><div><span>Win</span><b>44%</b></div></div>
      <div class="np-ip-lbl">Junio · calendario de P&amp;L</div>
      <div class="as-cal">${cells.map(c => `<span class="as-cc ${c}"></span>`).join('')}</div>`);
  }
  function psSnow() {
    return phoneScreen('Snowball', `
      <div class="np-ip-pie"><div class="pie-wrap">${UI.pie(Data.MONEY.allocations, 130)}<div class="pie-center"><b>$955</b><span class="muted small">payout</span></div></div></div>
      <div class="as-flow"><div><span>Ingreso</span><b class="up">$3,818</b></div><div><span>Gastos</span><b class="down">$1,060</b></div><div class="hi"><span>Libre</span><b class="ice">$2,758</b></div></div>`);
  }
  function psAcad() {
    const mods = [['Bienvenida y mentalidad', 100], ['La rutina del trader', 66], ['ORB + Killzones', 0], ['Gestión de riesgo', 0]];
    return phoneScreen('Academia', `
      <div class="as-prog"><span>24% del curso</span><div class="as-bar2"><span style="width:24%"></span></div></div>
      ${mods.map(m => `<div class="as-mod"><span class="as-mod-ic ${m[1] === 100 ? 'done' : ''}"></span><span class="as-mod-t">${m[0]}</span><span class="as-mod-p">${m[1]}%</span></div>`).join('')}`);
  }
  function appShowcase() {
    return `<section class="np-showcase">
      <div class="np-showcase-intro">
        <span class="nf-eyebrow">THE PLATFORM</span>
        <h2>The journal that coaches you<br>to your first payout.</h2>
      </div>
      ${feature('JOURNAL', 'Every trade, on your calendar.', 'A dashboard with your P&amp;L, profit factor and win rate — plus the green/red calendar that tells you the truth, day by day.', npPhone(shotImg('dashboard', 'NorthPoint journal dashboard')), false)}
      ${feature('AI COACH', 'A journal that studies you back.', 'Every trade you log feeds an AI that finds your edge — your best hours, setups and mistakes — and turns it into clear rules. Your journal, but it coaches you.', npPhone(shotImg('coach', 'AI Coach — your trading analyzed')), true)}
      ${feature('ACADEMY', 'The full course, inside.', 'Zero to Payout: 8 modules covering your NY routine, ORB, risk management and the Eval → Buffer → Payout funnel.', npPhone(shotImg('academia', 'Academy · Zero to Payout course')), false)}
    </section>`;
  }

  // -------- BOTTOM: the lost sailor, guided by NorthPoint to the payout --------
  function seaBottom() {
    return `<section class="np-sea-bottom">
      <div class="np-cta">
        <span class="nf-eyebrow">YOUR COMPASS</span>
        <h2>Lost in the markets? We light the way.</h2>
        <p>You're the sailor. NorthPoint is the North Star that guides you — from your first funded eval, through the buffer, to cashing your payout.</p>
        <div class="np-cta-row">
          <a class="lp-btn gold" href="${buy()}" target="_blank" rel="noopener">${UI.icon('academy', '', 17)} Enroll — $249</a>
          <button class="lp-btn ghost" data-act="openApp">Try the app free →</button>
        </div>
      </div>
      <div class="np-sea">
        <svg class="np-guide" viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
          <defs>
            <radialGradient id="npStarG"><stop offset="0" stop-color="#eaf4ff" stop-opacity=".9"/><stop offset="1" stop-color="#eaf4ff" stop-opacity="0"/></radialGradient>
            <linearGradient id="npBeamG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bcd8ff" stop-opacity=".45"/><stop offset="1" stop-color="#bcd8ff" stop-opacity="0"/></linearGradient>
            <linearGradient id="npLhBeam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffe6a8" stop-opacity=".5"/><stop offset="1" stop-color="#ffe6a8" stop-opacity="0"/></linearGradient>
          </defs>

          <!-- guiding beam from the star down to the route -->
          <path class="np-beam" d="M600,58 L455,300 L770,300 Z" fill="url(#npBeamG)"/>

          <!-- north star (the compass) -->
          <circle class="np-star-halo" cx="600" cy="50" r="58" fill="url(#npStarG)"/>
          <g class="np-northstar" transform="translate(600,50)">
            <polygon points="0,-34 8,-8 34,0 8,8 0,34 -8,8 -34,0 -8,-8" fill="#eef6ff"/>
            <polygon points="0,-17 5,-5 17,0 5,5 0,17 -5,5 -17,0 -5,-5" fill="#9fc2ea"/>
            <circle r="4.5" fill="#0a1a2e" stroke="#eef6ff" stroke-width="1.6"/>
          </g>

          <!-- the guided route: eval → buffer → payout -->
          <path class="np-route" d="M225,238 C430,228 520,198 660,184 C800,170 905,150 1012,132" fill="none" stroke="#e9c46a" stroke-width="3.4" stroke-linecap="round" stroke-dasharray="2 13"/>

          <!-- waypoints -->
          <g class="np-wp">
            <circle cx="475" cy="204" r="7" fill="#6fc1e8"/><circle cx="475" cy="204" r="12" fill="none" stroke="#6fc1e8" stroke-opacity=".4"/>
            <text x="475" y="228" text-anchor="middle" class="np-wp-t">EVAL</text>
            <circle cx="735" cy="171" r="7" fill="#6fc1e8"/><circle cx="735" cy="171" r="12" fill="none" stroke="#6fc1e8" stroke-opacity=".4"/>
            <text x="735" y="195" text-anchor="middle" class="np-wp-t">BUFFER</text>
          </g>

          <!-- lighthouse = payout -->
          <path class="np-lhbeam" d="M1012,120 L1200,66 L1200,176 Z" fill="url(#npLhBeam)"/>
          <g class="np-lh">
            <path d="M1002,238 L1006,150 L1018,150 L1022,238 Z" fill="#eef3f8"/>
            <rect x="1004" y="176" width="16" height="12" fill="#d34f4f"/><rect x="1004" y="206" width="16" height="12" fill="#d34f4f"/>
            <rect x="1003" y="140" width="18" height="12" rx="2" fill="#20344e"/>
            <circle cx="1012" cy="130" r="9" fill="#ffe6a8"/><circle class="np-lh-core" cx="1012" cy="130" r="4.5" fill="#fff"/>
            <path d="M1000,148 L1024,148 L1021,142 L1003,142 Z" fill="#cdd9e6"/>
            <text x="1012" y="258" text-anchor="middle" class="np-wp-t gold">PAYOUT 🏁</text>
          </g>

          <!-- the sailor's boat, at the start of the route -->
          <g class="np-boat2" transform="translate(210,232)">
            <path d="M-4,-58 L-4,-4 L34,-12 Z" fill="#eef3f8"/>
            <path d="M-8,-60 L-8,-2 L-40,-12 Z" fill="#ffffff"/>
            <rect x="-8" y="-62" width="4" height="60" rx="2" fill="#7a5a3a"/>
            <path d="M-46,0 Q0,34 44,0 L34,20 Q0,42 -34,20 Z" fill="#1f3f63"/>
            <path d="M-46,0 Q0,34 44,0 L40,7 Q0,38 -40,7 Z" fill="#2c537c"/>
            <g transform="translate(-6,-24)"><rect x="-6" y="8" width="12" height="18" rx="4" fill="#2b6da8"/><circle cx="0" cy="2" r="6.5" fill="#f3c9a0"/><path d="M-7,0 a7 4 0 0 1 14 0 Z" fill="#1f3550"/><rect x="-7" y="-1" width="14" height="2" rx="1" fill="#1f3550"/></g>
          </g>
        </svg>

        <svg class="np-waves" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path class="w w1" d="M0,160 C240,110 480,210 720,170 C960,130 1200,210 1440,160 L1440,320 L0,320 Z"/>
          <path class="w w2" d="M0,200 C240,160 480,250 720,210 C960,175 1200,250 1440,205 L1440,320 L0,320 Z"/>
          <path class="w w3" d="M0,245 C240,215 480,285 720,250 C960,220 1200,285 1440,250 L1440,320 L0,320 Z"/>
        </svg>
        <div class="np-foot ss-mono">NORTHPOINT · © 2026 · Your compass in the markets. — Trading involves risk. Educational content.</div>
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
