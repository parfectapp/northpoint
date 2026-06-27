/* ============ RACHA · Catálogos, curso, plan y datos de ejemplo ============ */
const Data = (() => {

  // ---- firmas de fondeo ----
  const FIRMS = [
    { id: 'tradeify', label: 'Tradeify',         color: '#22c55e' },
    { id: 'apex',     label: 'Apex',             color: '#ef4444' },
    { id: 'lucid',    label: 'Lucid Trading',    color: '#a855f7' },
    { id: 'tpt',      label: 'TakeProfitTrader', color: '#3b82f6' },
    { id: 'mff',      label: 'MyFundedFutures',  color: '#f59e0b' },
    { id: 'otra',     label: 'Otra',             color: '#94a3b8' },
  ];
  const firmOf = id => FIRMS.find(f => f.id === id) || FIRMS[FIRMS.length - 1];

  // ---- fase de la cuenta (eval → buffer → payout) ----
  const PHASES = [
    { id: 'eval',   label: 'Evaluación', short: 'EVAL',   color: '#f59e0b' },
    { id: 'buffer', label: 'Buffer',     short: 'BUFFER', color: '#3b82f6' },
    { id: 'payout', label: 'Payout',     short: 'PAYOUT', color: '#22c55e' },
    { id: 'funded', label: 'Fondeada',   short: 'PA',     color: '#5bf0ad' },
  ];
  const phaseOf = id => PHASES.find(p => p.id === id) || PHASES[0];

  const ACC_STATUS = [
    { id: 'activa',  label: 'Activa',  color: '#22c55e' },
    { id: 'pasada',  label: 'Cobrada', color: '#5bf0ad' },
    { id: 'quemada', label: 'Quemada', color: '#ef4444' },
  ];
  const statusOf = id => ACC_STATUS.find(s => s.id === id) || ACC_STATUS[0];

  const INSTRUMENTS = ['MNQ', 'NQ', 'MES', 'ES', 'MGC', 'M2K', 'Otro'];

  // ---- setups (ORB + Killzones + EMAs 14/50 + SMC) ----
  const SETUPS = [
    { id: 'orb', label: 'ORB' }, { id: 'killzone', label: 'Killzone' }, { id: 'smc', label: 'SMC' },
    { id: 'emas', label: 'EMAs 14/50' }, { id: 'breakout', label: 'Breakout' }, { id: 'rev', label: 'Reversión' }, { id: 'otro', label: 'Otro' },
  ];
  const setupOf = id => SETUPS.find(s => s.id === id) || SETUPS[SETUPS.length - 1];

  const RESULTS = [
    { id: 'win',  label: 'Win',  color: '#22c55e' },
    { id: 'loss', label: 'Loss', color: '#ef4444' },
    { id: 'be',   label: 'BE',   color: '#94a3b8' },
  ];

  const EMOTIONS = [
    { id: 'disciplina', label: 'Disciplinado' }, { id: 'paciencia', label: 'Paciente' }, { id: 'neutral', label: 'Neutral' },
    { id: 'fomo', label: 'FOMO' }, { id: 'revancha', label: 'Revancha' }, { id: 'ansioso', label: 'Ansioso' },
  ];

  // ====================== CURSO ======================
  const COURSE = [
    { id: 'm0', n: 0, title: 'Bienvenida y mentalidad', icon: 'flag', color: '#3d6bf5',
      desc: 'La base mental antes de tocar una sola vela.',
      lessons: [
        { id: 'l01', title: 'Cómo aprovechar este curso', dur: '6 min', desc: 'Cómo está armado el programa, qué necesitas y cómo usar tu journal Snowball desde hoy.' },
        { id: 'l02', title: 'La rentabilidad no es suerte', dur: '9 min', desc: 'Por qué ganar consistente es resultado de reglas + horarios + repetición, no de adivinar.' },
        { id: 'l03', title: 'Define tu “para qué”', dur: '7 min', desc: 'Tu depa, tu coche y tu libertad. Lo configuras en Metas para no perder el norte.' },
        { id: 'l04', title: 'Firma tu contrato del trader', dur: '5 min', desc: 'El compromiso que te separa del que quema cuentas. Lo firmas en la sección Plan.' },
      ] },
    { id: 'm1', n: 1, title: 'La rutina del trader rentable', icon: 'clock', color: '#22c55e',
      desc: 'Tu bloque de Nueva York, paso a paso.',
      lessons: [
        { id: 'l11', title: 'El bloque NY: 7:00 a 9:00', dur: '11 min', desc: 'Premarket en Discord, apertura, ORB y cierre. Operar 90 minutos con foco.' },
        { id: 'l12', title: 'Setup de TradingView', dur: '8 min', desc: 'Layout de 5 min + 1 min para MNQ, indicadores y plantilla lista.' },
        { id: 'l13', title: 'Daily bias antes de abrir', dur: '9 min', desc: 'Cómo decidir si hoy buscas largos o cortos antes de la campana.' },
      ] },
    { id: 'm2', n: 2, title: 'ORB — Opening Range Breakout', icon: 'candles', color: '#3b82f6',
      desc: 'El corazón de la estrategia.',
      lessons: [
        { id: 'l21', title: 'Marcar el rango de apertura', dur: '10 min', desc: 'Cómo y cuándo trazar el ORB, y por qué funciona.' },
        { id: 'l22', title: 'Ruptura real vs. fakeout', dur: '12 min', desc: 'Distinguir la ruptura que paga de la trampa.' },
        { id: 'l23', title: 'Entrada, stop y primer target', dur: '11 min', desc: 'Dónde entras, dónde te sales y cómo gestionas el trade.' },
      ] },
    { id: 'm3', n: 3, title: 'Killzones y horarios', icon: 'target', color: '#f59e0b',
      desc: 'Operar solo cuando vale la pena.',
      lessons: [
        { id: 'l31', title: 'Qué son las killzones', dur: '9 min', desc: 'Las ventanas de mayor probabilidad del día.' },
        { id: 'l32', title: 'Alinear killzone + ORB', dur: '10 min', desc: 'La confluencia que dispara tu win rate.' },
      ] },
    { id: 'm4', n: 4, title: 'Confluencias: EMAs 14/50 + SMC', icon: 'chart', color: '#a855f7',
      desc: 'Lectura institucional del mercado.',
      lessons: [
        { id: 'l41', title: 'Tendencia con EMAs 14 y 50', dur: '9 min', desc: 'Filtro de dirección simple y potente.' },
        { id: 'l42', title: 'SMC: estructura y liquidez', dur: '13 min', desc: 'Order blocks, barridos de liquidez y cómo leerlos.' },
        { id: 'l43', title: 'Anatomía del A+ setup', dur: '12 min', desc: 'Cuando todo se alinea: la única entrada que tomas.' },
      ] },
    { id: 'm5', n: 5, title: 'Gestión de riesgo', icon: 'shield', color: '#ef4444',
      desc: 'El módulo que te salva la cuenta.',
      lessons: [
        { id: 'l51', title: 'Riesgo por trade y máximo diario', dur: '11 min', desc: 'El número que separa al rentable del quemado.' },
        { id: 'l52', title: 'W = stop, y “si pierdes, remas”', dur: '8 min', desc: 'Si ganas el día, cierras. Si pierdes, sin revancha.' },
        { id: 'l53', title: 'Tamaño por fase: 4 mini / 2 mini / 5 micro', dur: '9 min', desc: 'Cuántos contratos según estés en eval, buffer o payout.' },
      ] },
    { id: 'm6', n: 6, title: 'El embudo: Eval → Buffer → Payout', icon: 'coin', color: '#22c55e',
      desc: 'De pasar la prueba a cobrar.',
      lessons: [
        { id: 'l61', title: 'Pasar la evaluación', dur: '10 min', desc: 'Target $1,000, riesgo $600, 5 trades. Sin apurar.' },
        { id: 'l62', title: 'Construir el buffer', dur: '9 min', desc: 'El colchón que te deja cobrar tranquilo.' },
        { id: 'l63', title: 'Cobrar el payout (y el fee)', dur: '11 min', desc: 'Cadencia ~15 días, el 10% de fee y cómo escalar varias cuentas.' },
      ] },
    { id: 'm7', n: 7, title: 'Psicología y disciplina', icon: 'book', color: '#06b6d4',
      desc: 'El juego interior.',
      lessons: [
        { id: 'l71', title: 'FOMO, revancha y miedo', dur: '12 min', desc: 'Detectarlos en vivo y cortarlos.' },
        { id: 'l72', title: 'El journal como hábito', dur: '8 min', desc: 'Registrar cada trade en Snowball y revisarlo cada semana.' },
      ] },
    { id: 'm8', n: 8, title: 'De payout a patrimonio', icon: 'trophy', color: '#ffd24a',
      desc: 'Que el dinero trabaje.',
      lessons: [
        { id: 'l81', title: 'Qué hacer con cada cobro', dur: '10 min', desc: 'Reinvertir vs. retirar, y construir tus metas.' },
        { id: 'l82', title: 'Tu plan a 90 días', dur: '9 min', desc: 'El mapa para sostener el ingreso.' },
      ] },
  ];
  const allLessons = () => COURSE.flatMap(m => m.lessons.map(l => ({ ...l, moduleId: m.id })));
  const lessonById = id => allLessons().find(l => l.id === id);

  // ---- plan (del PDF NorthPoint · Zero to Hero) ----
  const PLAN = {
    pledge: 'Me comprometo a respetar la estructura de este plan por encima de cualquier impulso emocional. La rentabilidad no es suerte: es el resultado de seguir mis reglas de riesgo y mis horarios sin excepción. Me presento en cada sesión, sigo el plan y opero hasta cobrar el payout. Mi disciplina es mi libertad financiera.',
    routine: [
      { t: '7:00', label: 'Discord · premarket', note: 'Noticias y sesgo del día' },
      { t: '7:30', label: 'Apertura NY', note: 'Marco el rango de apertura' },
      { t: '7:45', label: 'ORB + entrada', note: 'Solo A+ setups' },
      { t: '9:00', label: 'Cierre', note: 'Cierro pantallas, anoto el journal' },
    ],
    rules: [
      'Solo opero A+ setups: ORB + Killzone + EMAs 14/50 + SMC.',
      'Trabajo en 5 min y confirmo en 1 min (MNQ).',
      'Defino mi daily bias antes de la apertura.',
      'Si voy ganador del día (W): cierro y paro. W = stop.',
      'Si voy perdedor (L): remo con disciplina, jamás opero por revancha.',
      'Respeto el riesgo máximo diario sin una sola excepción.',
    ],
    phases: [
      { id: 'eval',   target: 1000, maxLoss: 600, trades: 5, size: '4 mini' },
      { id: 'buffer', target: 500,  maxLoss: 450, trades: 2, size: '2 mini' },
      { id: 'payout', target: 250,  maxLoss: 500, trades: 2, size: '5 micro' },
    ],
    checklist: [
      { id: 'bias', label: 'Definí mi daily bias' }, { id: 'premkt', label: 'Revisé premarket / Discord' },
      { id: 'aplus', label: 'Solo entré en A+ setups' }, { id: 'risk', label: 'Respeté el riesgo máximo' },
      { id: 'wstop', label: 'Si gané el día, paré (W = stop)' }, { id: 'journal', label: 'Registré mis trades' },
    ],
  };

  // ====================== HOME (estilo TradeSyncer) ======================
  const HOME = {
    instruments: [
      { sym: 'NQ', name: 'Nasdaq 100', price: 29656.25, chg: 1.75, pct: 0.01 },
      { sym: 'ES', name: 'S&P 500', price: 7433.50, chg: 0.25, pct: 0.00 },
      { sym: 'GC', name: 'Oro', price: 4077.90, chg: 0.00, pct: 0.00 },
      { sym: 'CL', name: 'Petróleo', price: 75.19, chg: 0.00, pct: 0.00 },
      { sym: 'RTY', name: 'Russell 2000', price: 2996.10, chg: -0.30, pct: -0.01 },
      { sym: 'YM', name: 'Dow', price: 52007.00, chg: -7.00, pct: -0.01 },
      { sym: 'MNQ', name: 'Micro Nasdaq', price: 29656.25, chg: 1.75, pct: 0.01 },
    ],
    firms: [
      { id: 'tradeify', name: 'Tradeify', rating: 4.7, maxFunding: '$750K', split: '90%', cost: '$120', tags: ['Instant funding', 'Automated payouts', '+4'] },
      { id: 'lucid', name: 'Lucid Trading', rating: 4.8, maxFunding: '$600K', split: '90%', cost: '$100', tags: ['End of day drawdowns', 'No hard breach rules', '+4'] },
      { id: 'apex', name: 'Apex Trader Funding', rating: 4.6, maxFunding: '$6.0M', split: '—', cost: '$155', tags: ['No daily drawdown', 'Trade on holidays', '+3'] },
    ],
    community: [
      { user: 'bakurafx', accounts: 3, balance: 253296.12, profit: 2361.50, items: [['LFE0***', 1181.00], ['PAA…', 590.30], ['PAAP***', 590.20]] },
      { user: 'shhmellow', accounts: 4, balance: 203805.56, profit: 2602.04, items: [['AFA…', 707.40], ['AFAD***', 673.46], ['AFAD***', 828.48], ['AFAD***', 593.48]] },
      { user: 'blascous', accounts: 10, balance: 1580559, profit: 13692.50, items: [['FTDF***', 1821.00], ['FTDF***', 1821.00], ['FTDF***', 1821.00], ['TAK…', 917.50]] },
      { user: 'wildcard', accounts: 11, balance: 512976.72, profit: 11148.00, items: [['TDF***', 1821.00], ['TDF***', 1640.50], ['TDF***', 1290.00]] },
    ],
    orders: 871601,
    econ: [
      { day: 'Dom', date: 21, events: [] },
      { day: 'Lun', date: 22, events: [['Fed · Waller habla', '07:00', 'red'], ['CFTC posiciones', '01:30', 'yellow']] },
      { day: 'Mar', date: 23, today: true, events: [['S&P Global PMI', '07:45', 'red'], ['S&P Global PMI Serv.', '07:45', 'red'], ['S&P Global PMI Comp.', '07:45', 'red'], ['Subasta 2 años', '11:00', 'yellow'], ['API inventarios', '02:30', 'yellow']] },
      { day: 'Mié', date: 24, events: [['Venta casas nuevas', '08:00', 'red'], ['Inventarios crudo', '08:30', 'red'], ['Cushing crudo', '08:30', 'yellow'], ['Subasta 5 años', '11:00', 'yellow']] },
      { day: 'Jue', date: 25, events: [['Bienes durables', '01:30', 'red'], ['Precios PCE', '06:30', 'red'], ['Ingreso personal', '06:30', 'yellow'], ['Gasto personal', '06:30', 'yellow'], ['Core PCE', '06:30', 'red']] },
      { day: 'Vie', date: 26, events: [['Balanza comercial', '01:30', 'yellow'], ['Michigan sentimiento', '08:00', 'red'], ['Michigan expectativas', '08:00', 'yellow']] },
      { day: 'Sáb', date: 27, events: [] },
    ],
  };

  // ====================== SNOWBALL · money management ======================
  // Reparto de cada payout (la "rueda de quesos")
  const MONEY = {
    base: 955, // monto promedio por payout (se recalcula con tus payouts reales)
    payoutsMes: 4,
    goalTarget: 1000000, // meta de patrimonio (calculadora)
    goalRate: 10,        // rendimiento anual asumido para la meta
    goalYears: 10,       // plazo de la meta (años)
    allocations: [
      { id: 'reinvest', name: 'Reinversión en fondeo', pct: 30, color: '#5fd0ff', icon: 'sync', desc: 'Más cuentas → más payouts' },
      { id: 'invest', name: 'Inversión (Portafolio IA 2040)', pct: 30, color: '#7fb0ff', icon: 'chart', desc: 'Interés compuesto a 20-30 años' },
      { id: 'expenses', name: 'Gastos / vida', pct: 20, color: '#ffd24a', icon: 'wallet', desc: 'Tu día a día' },
      { id: 'reserve', name: 'Reserva / emergencias', pct: 12, color: '#22c55e', icon: 'shield', desc: '3-6 meses de colchón' },
      { id: 'reward', name: 'Gusto / recompensa', pct: 8, color: '#a855f7', icon: 'star', desc: 'Disfruta tu progreso' },
    ],
  };

  // Portafolio IA Generacional 2040 (del documento de André)
  const PORTFOLIO = {
    perfil: '24 años · perfil agresivo · horizonte 20-30 años',
    sectors: [
      { name: 'Chips / Semiconductores', pct: 28, color: '#5fd0ff' },
      { name: 'IA / Cloud / Software', pct: 25, color: '#7fb0ff' },
      { name: 'Crypto / Blockchain', pct: 18, color: '#a855f7' },
      { name: 'Networking IA', pct: 10, color: '#22c55e' },
      { name: 'ETF Mercado', pct: 8, color: '#ffd24a' },
      { name: 'Energía + Materiales', pct: 6, color: '#f59e0b' },
      { name: 'Bonos / Cash', pct: 5, color: '#8a97a8' },
    ],
    assets: [
      ['NVDA', 'GPU e IA factories', 10], ['BTC', 'Reserva digital', 10], ['MSFT', 'IA empresarial y Cloud', 8],
      ['AVGO', 'ASICs y networking IA', 8], ['QQQ', 'Tecnología USA', 8], ['AMZN', 'AWS + IA', 6], ['ANET', 'Data Centers IA', 6],
      ['META', 'Datos + modelos IA', 5], ['TSM', 'Fabricación de chips', 5], ['COIN', 'Infraestructura crypto', 5],
      ['ASML', 'Equipos EUV', 4], ['CRCL', 'Stablecoins', 4], ['GOOGL', 'DeepMind / Gemini', 3], ['XLU', 'Energía IA', 3],
      ['AMD', 'GPU alternativa', 2], ['MRVL', 'Networking', 2], ['IGV', 'Software ETF', 2], ['SPY', 'Mercado general', 2],
      ['TSLA', 'Robótica IA', 2], ['Bonos/Otros', 'Defensa y liquidez', 5],
    ],
    scenarios: [
      { monthly: 500, aportado: '$180K', r: { 8: '$700K', 10: '$1.1M', 12: '$1.7M', 15: '$3.4M' } },
      { monthly: 2000, aportado: '$720K', r: { 8: '$2.8M', 10: '$4.5M', 12: '$7M', 15: '$14M' } },
      { monthly: 2500, aportado: '$900K', r: { 8: '$3.5M', 10: '$5.6M', 12: '$8.8M', 15: '$17M' } },
      { monthly: 3000, aportado: '$1.08M', r: { 8: '$4.2M', 10: '$6.8M', 12: '$10.5M', 15: '$20M' } },
    ],
  };

  // ====================== DATOS DE EJEMPLO ======================
  function seed(db) {
    const id = () => Store.uid();
    db.meta.name = 'André';
    db.meta.handle = 'redpillmacouzet';
    db.meta.seeded = true;
    db.meta.onboarded = true;
    db.plan = JSON.parse(JSON.stringify(PLAN));
    db.money = JSON.parse(JSON.stringify(MONEY));

    // --- cuentas (números reales tipo Tradeify) ---
    const a1 = { id: id(), firm: 'tradeify', alias: 'TDFYSL50909144440', size: 50000, phase: 'payout', status: 'activa', createdAt: '2026-06-21' };
    const a2 = { id: id(), firm: 'tradeify', alias: 'TDFYSL50350052692', size: 50000, phase: 'payout', status: 'activa', createdAt: '2026-06-21' };
    const a3 = { id: id(), firm: 'tradeify', alias: 'TDFYSL50592331321', size: 50000, phase: 'payout', status: 'activa', createdAt: '2026-06-21' };
    const apex = { id: id(), firm: 'apex', alias: 'Apex 50K', size: 50000, phase: 'funded', status: 'pasada', createdAt: '2026-03-20' };
    db.accounts = [a1, a2, a3, apex];
    const accIds = [a1.id, a2.id, a3.id];

    // --- payouts (11 cobros = $10,500) ---
    const P = (date, firm, acc, amount) => ({ id: id(), date, firm, accountId: acc, amount });
    db.payouts = [
      P('2026-04-09', 'apex', apex.id, 1200), P('2026-04-16', 'apex', apex.id, 1100),
      P('2026-04-23', 'apex', apex.id, 1100), P('2026-04-30', 'apex', apex.id, 1100),
      P('2026-05-08', 'tradeify', a1.id, 800), P('2026-05-15', 'tradeify', a1.id, 800),
      P('2026-05-22', 'tradeify', a1.id, 700), P('2026-05-29', 'tradeify', a1.id, 700),
      P('2026-06-05', 'tradeify', a2.id, 1100), P('2026-06-12', 'tradeify', a2.id, 1000), P('2026-06-19', 'tradeify', a3.id, 900),
    ];

    // --- 54 trades reales (Jun 21 +4.4K · 10W-15L ; Jun 22 +3.3K · 14W-15L) ---
    let s = 20260621;
    const rng = () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    const pick = arr => arr[Math.floor(rng() * arr.length)];
    const qtys = [20, 25, 28, 30, 38, 40];
    db.trades = [];
    function genDay(date, nW, nL, net, lossSum) {
      let losses = [], wins = [];
      for (let i = 0; i < nL; i++) losses.push(300 + rng() * 850);
      let ls = losses.reduce((a, b) => a + b, 0); losses = losses.map(v => v * lossSum / ls);
      const winSum = net + lossSum;
      for (let i = 0; i < nW; i++) wins.push(550 + rng() * 1150);
      let ws = wins.reduce((a, b) => a + b, 0); wins = wins.map(v => v * winSum / ws);
      const items = [];
      wins.forEach(v => items.push({ pnl: Math.round(v), result: 'win' }));
      losses.forEach(v => items.push({ pnl: -Math.round(v), result: 'loss' }));
      for (let i = items.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [items[i], items[j]] = [items[j], items[i]]; }
      let minute = 7 * 60 + 45;
      items.forEach(it => {
        minute += 2 + Math.floor(rng() * 5);
        const hh = Math.floor(minute / 60), mm = minute % 60;
        const side = rng() > 0.5 ? 'short' : 'long';
        const qty = pick(qtys);
        const entry = 30500 + rng() * 130;
        const pts = it.pnl / (2 * qty);
        const exit = side === 'long' ? entry + pts : entry - pts;
        const dur = Math.floor(18 + rng() * 720);
        db.trades.push({
          id: id(), date, time: `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`,
          accountId: pick(accIds), instrument: 'MNQ', side, contracts: qty,
          entry: Math.round(entry * 100) / 100, exit: Math.round(exit * 100) / 100,
          pnl: it.pnl, result: it.result, setup: pick(['orb', 'orb', 'killzone', 'smc']),
          emotion: it.result === 'win' ? 'disciplina' : 'paciencia', duration: dur, notes: '',
        });
      });
    }
    genDay('2026-06-21', 10, 15, 4400, 7400);
    genDay('2026-06-22', 14, 15, 3300, 7300);

    // --- Cartera · gastos del mes (ejemplos, 100% editables) ---
    db.goals = [];
    db.expenses = [
      { id: id(), name: 'Renta', amount: 420, icon: 'home', color: '#5fd0ff' },
      { id: id(), name: 'Comida', amount: 260, icon: 'wallet', color: '#7fb0ff' },
      { id: id(), name: 'Coche (gas + seguro)', amount: 180, icon: 'car', color: '#ffd24a' },
      { id: id(), name: 'Suscripciones', amount: 60, icon: 'star', color: '#22c55e' },
      { id: id(), name: 'Salidas / gusto', amount: 140, icon: 'flame', color: '#a855f7' },
    ];

    // --- bitácora + progreso del curso ---
    db.journal = [
      { id: id(), date: '2026-06-22', tag: 'win', text: 'Semana +$7.7K en Tradeify. ORB limpio y W = stop. La constancia paga.' },
      { id: id(), date: '2026-06-21', tag: 'leccion', text: '44% win rate pero profit factor 1.52: gano cuando acierto, corto rápido cuando no. Disciplina.' },
    ];
    db.progress = { l01: true, l02: true, l03: true, l04: true, l11: true, l12: true };
  }

  return {
    FIRMS, firmOf, PHASES, phaseOf, ACC_STATUS, statusOf,
    INSTRUMENTS, SETUPS, setupOf, RESULTS, EMOTIONS,
    COURSE, allLessons, lessonById, PLAN, HOME, MONEY, PORTFOLIO, seed,
  };
})();
