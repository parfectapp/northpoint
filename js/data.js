/* ============ NorthPoint · Catalogs, course, plan & sample data ============ */
const Data = (() => {

  // ---- prop firms ----
  const FIRMS = [
    { id: 'tradeify', label: 'Tradeify',         color: '#22c55e' },
    { id: 'apex',     label: 'Apex',             color: '#ef4444' },
    { id: 'lucid',    label: 'Lucid Trading',    color: '#a855f7' },
    { id: 'tpt',      label: 'TakeProfitTrader', color: '#3b82f6' },
    { id: 'mff',      label: 'MyFundedFutures',  color: '#f59e0b' },
    { id: 'otra',     label: 'Other',            color: '#94a3b8' },
  ];
  const firmOf = id => FIRMS.find(f => f.id === id) || FIRMS[FIRMS.length - 1];

  // ---- account phase (eval → buffer → payout) ----
  const PHASES = [
    { id: 'eval',   label: 'Evaluation', short: 'EVAL',   color: '#f59e0b' },
    { id: 'buffer', label: 'Buffer',     short: 'BUFFER', color: '#3b82f6' },
    { id: 'payout', label: 'Payout',     short: 'PAYOUT', color: '#22c55e' },
    { id: 'funded', label: 'Funded',     short: 'PA',     color: '#5bf0ad' },
  ];
  const phaseOf = id => PHASES.find(p => p.id === id) || PHASES[0];

  const ACC_STATUS = [
    { id: 'activa',  label: 'Active',   color: '#22c55e' },
    { id: 'pasada',  label: 'Paid out', color: '#5bf0ad' },
    { id: 'quemada', label: 'Blown',    color: '#ef4444' },
  ];
  const statusOf = id => ACC_STATUS.find(s => s.id === id) || ACC_STATUS[0];

  const INSTRUMENTS = ['MNQ', 'NQ', 'MES', 'ES', 'MGC', 'M2K', 'Other'];

  // ---- setups (ORB + Killzones + EMAs 14/50 + SMC) ----
  const SETUPS = [
    { id: 'orb', label: 'ORB' }, { id: 'killzone', label: 'Killzone' }, { id: 'smc', label: 'SMC' },
    { id: 'emas', label: 'EMAs 14/50' }, { id: 'breakout', label: 'Breakout' }, { id: 'rev', label: 'Reversal' }, { id: 'otro', label: 'Other' },
  ];
  const setupOf = id => SETUPS.find(s => s.id === id) || SETUPS[SETUPS.length - 1];

  const RESULTS = [
    { id: 'win',  label: 'Win',  color: '#22c55e' },
    { id: 'loss', label: 'Loss', color: '#ef4444' },
    { id: 'be',   label: 'BE',   color: '#94a3b8' },
  ];

  const EMOTIONS = [
    { id: 'disciplina', label: 'Disciplined' }, { id: 'paciencia', label: 'Patient' }, { id: 'neutral', label: 'Neutral' },
    { id: 'fomo', label: 'FOMO' }, { id: 'revancha', label: 'Revenge' }, { id: 'ansioso', label: 'Anxious' },
  ];

  // ====================== COURSE ======================
  const COURSE = [
    { id: 'm0', n: 0, title: 'Welcome & mindset', icon: 'flag', color: '#3d6bf5',
      desc: 'The mental base before you touch a single candle.',
      lessons: [
        { id: 'l01', title: 'How to get the most from this course', dur: '6 min', desc: 'How the program is built, what you need, and how to use your NorthPoint journal from day one.' },
        { id: 'l02', title: 'Profitability is not luck', dur: '9 min', desc: 'Why consistent winning is the result of rules + timing + repetition, not guessing.' },
        { id: 'l03', title: 'Define your “why”', dur: '7 min', desc: 'Your apartment, your car and your freedom. Set them in Goals so you never lose your north.' },
        { id: 'l04', title: 'Sign your trader’s contract', dur: '5 min', desc: 'The commitment that separates you from the one who blows accounts. Sign it in the Plan section.' },
      ] },
    { id: 'm1', n: 1, title: 'The profitable trader’s routine', icon: 'clock', color: '#22c55e',
      desc: 'Your New York block, step by step.',
      lessons: [
        { id: 'l11', title: 'The NY block: 7:00 to 9:00', dur: '11 min', desc: 'Premarket on Discord, the open, ORB and close. Trade 90 minutes with focus.' },
        { id: 'l12', title: 'TradingView setup', dur: '8 min', desc: '5-min + 1-min layout for MNQ, indicators and a ready template.' },
        { id: 'l13', title: 'Daily bias before the open', dur: '9 min', desc: 'How to decide whether you look for longs or shorts before the bell.' },
      ] },
    { id: 'm2', n: 2, title: 'ORB — Opening Range Breakout', icon: 'candles', color: '#3b82f6',
      desc: 'The heart of the strategy.',
      lessons: [
        { id: 'l21', title: 'Marking the opening range', dur: '10 min', desc: 'How and when to draw the ORB, and why it works.' },
        { id: 'l22', title: 'Real breakout vs. fakeout', dur: '12 min', desc: 'Telling the breakout that pays from the trap.' },
        { id: 'l23', title: 'Entry, stop and first target', dur: '11 min', desc: 'Where you enter, where you exit and how you manage the trade.' },
      ] },
    { id: 'm3', n: 3, title: 'Killzones and timing', icon: 'target', color: '#f59e0b',
      desc: 'Trade only when it’s worth it.',
      lessons: [
        { id: 'l31', title: 'What killzones are', dur: '9 min', desc: 'The highest-probability windows of the day.' },
        { id: 'l32', title: 'Aligning killzone + ORB', dur: '10 min', desc: 'The confluence that lifts your win rate.' },
      ] },
    { id: 'm4', n: 4, title: 'Confluences: EMAs 14/50 + SMC', icon: 'chart', color: '#a855f7',
      desc: 'Reading the market like an institution.',
      lessons: [
        { id: 'l41', title: 'Trend with the 14 & 50 EMAs', dur: '9 min', desc: 'A simple, powerful direction filter.' },
        { id: 'l42', title: 'SMC: structure and liquidity', dur: '13 min', desc: 'Order blocks, liquidity sweeps and how to read them.' },
        { id: 'l43', title: 'Anatomy of the A+ setup', dur: '12 min', desc: 'When everything aligns: the only entry you take.' },
      ] },
    { id: 'm5', n: 5, title: 'Risk management', icon: 'shield', color: '#ef4444',
      desc: 'The module that saves your account.',
      lessons: [
        { id: 'l51', title: 'Risk per trade and daily max', dur: '11 min', desc: 'The number that separates the profitable from the blown.' },
        { id: 'l52', title: 'W = stop, and “if you lose, grind”', dur: '8 min', desc: 'If you win the day, close. If you lose, no revenge.' },
        { id: 'l53', title: 'Size by phase: 4 mini / 2 mini / 5 micro', dur: '9 min', desc: 'How many contracts depending on eval, buffer or payout.' },
      ] },
    { id: 'm6', n: 6, title: 'The funnel: Eval → Buffer → Payout', icon: 'coin', color: '#22c55e',
      desc: 'From passing the test to getting paid.',
      lessons: [
        { id: 'l61', title: 'Passing the evaluation', dur: '10 min', desc: 'Target $1,000, risk $600, 5 trades. No rushing.' },
        { id: 'l62', title: 'Building the buffer', dur: '9 min', desc: 'The cushion that lets you cash out calmly.' },
        { id: 'l63', title: 'Cashing the payout (and the fee)', dur: '11 min', desc: '~15-day cadence, the 10% fee and how to scale several accounts.' },
      ] },
    { id: 'm7', n: 7, title: 'Psychology & discipline', icon: 'book', color: '#06b6d4',
      desc: 'The inner game.',
      lessons: [
        { id: 'l71', title: 'FOMO, revenge and fear', dur: '12 min', desc: 'Spotting them live and cutting them off.' },
        { id: 'l72', title: 'The journal as a habit', dur: '8 min', desc: 'Log every trade in NorthPoint and review it every week.' },
      ] },
    { id: 'm8', n: 8, title: 'From payout to wealth', icon: 'trophy', color: '#ffd24a',
      desc: 'Put the money to work.',
      lessons: [
        { id: 'l81', title: 'What to do with each cash-out', dur: '10 min', desc: 'Reinvest vs. withdraw, and building your goals.' },
        { id: 'l82', title: 'Your 90-day plan', dur: '9 min', desc: 'The map to keep the income going.' },
      ] },
  ];
  const allLessons = () => COURSE.flatMap(m => m.lessons.map(l => ({ ...l, moduleId: m.id })));
  const lessonById = id => allLessons().find(l => l.id === id);

  // ---- plan (from the NorthPoint · Zero to Hero PDF) ----
  const PLAN = {
    pledge: 'I commit to respecting the structure of this plan above any emotional impulse. Profitability is not luck: it is the result of following my risk rules and my schedule without exception. I show up to every session, I follow the plan, and I trade until I cash the payout. My discipline is my financial freedom.',
    routine: [
      { t: '7:00', label: 'Discord · premarket', note: 'News and daily bias' },
      { t: '7:30', label: 'NY open', note: 'Mark the opening range' },
      { t: '7:45', label: 'ORB + entry', note: 'Only A+ setups' },
      { t: '9:00', label: 'Close', note: 'Close screens, log the journal' },
    ],
    rules: [
      'I only trade A+ setups: ORB + Killzone + EMAs 14/50 + SMC.',
      'I work on the 5-min and confirm on the 1-min (MNQ).',
      'I define my daily bias before the open.',
      'If I’m green for the day (W): I close and stop. W = stop.',
      'If I’m red (L): I grind with discipline, never revenge-trade.',
      'I respect the daily max loss without a single exception.',
    ],
    phases: [
      { id: 'eval',   target: 1000, maxLoss: 600, trades: 5, size: '4 mini' },
      { id: 'buffer', target: 500,  maxLoss: 450, trades: 2, size: '2 mini' },
      { id: 'payout', target: 250,  maxLoss: 500, trades: 2, size: '5 micro' },
    ],
    checklist: [
      { id: 'bias', label: 'Defined my daily bias' }, { id: 'premkt', label: 'Checked premarket / Discord' },
      { id: 'aplus', label: 'Only entered A+ setups' }, { id: 'risk', label: 'Respected the max risk' },
      { id: 'wstop', label: 'If I won the day, I stopped (W = stop)' }, { id: 'journal', label: 'Logged my trades' },
    ],
  };

  // ====================== HOME (TradeSyncer style) ======================
  const HOME = {
    instruments: [
      { sym: 'NQ', name: 'Nasdaq 100', price: 29656.25, chg: 1.75, pct: 0.01 },
      { sym: 'ES', name: 'S&P 500', price: 7433.50, chg: 0.25, pct: 0.00 },
      { sym: 'GC', name: 'Gold', price: 4077.90, chg: 0.00, pct: 0.00 },
      { sym: 'CL', name: 'Oil', price: 75.19, chg: 0.00, pct: 0.00 },
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
      { day: 'Sun', date: 21, events: [] },
      { day: 'Mon', date: 22, events: [['Fed · Waller speaks', '07:00', 'red'], ['CFTC positioning', '01:30', 'yellow']] },
      { day: 'Tue', date: 23, today: true, events: [['S&P Global PMI', '07:45', 'red'], ['S&P Global PMI Serv.', '07:45', 'red'], ['S&P Global PMI Comp.', '07:45', 'red'], ['2-year auction', '11:00', 'yellow'], ['API inventories', '02:30', 'yellow']] },
      { day: 'Wed', date: 24, events: [['New home sales', '08:00', 'red'], ['Crude inventories', '08:30', 'red'], ['Cushing crude', '08:30', 'yellow'], ['5-year auction', '11:00', 'yellow']] },
      { day: 'Thu', date: 25, events: [['Durable goods', '01:30', 'red'], ['PCE prices', '06:30', 'red'], ['Personal income', '06:30', 'yellow'], ['Personal spending', '06:30', 'yellow'], ['Core PCE', '06:30', 'red']] },
      { day: 'Fri', date: 26, events: [['Trade balance', '01:30', 'yellow'], ['Michigan sentiment', '08:00', 'red'], ['Michigan expectations', '08:00', 'yellow']] },
      { day: 'Sat', date: 27, events: [] },
    ],
  };

  // ====================== SNOWBALL · money management ======================
  // Split of each payout (the "pie wheel")
  const MONEY = {
    base: 955, // average amount per payout (recalculated from your real payouts)
    payoutsMes: 4,
    goalTarget: 1000000, // wealth goal (calculator)
    goalRate: 10,        // assumed annual return for the goal
    goalYears: 10,       // goal horizon (years)
    allocations: [
      { id: 'reinvest', name: 'Reinvest in funding', pct: 30, color: '#5fd0ff', icon: 'sync', desc: 'More accounts → more payouts' },
      { id: 'invest', name: 'Investing (AI Portfolio 2040)', pct: 30, color: '#7fb0ff', icon: 'chart', desc: 'Compound interest over 20-30 years' },
      { id: 'expenses', name: 'Expenses / life', pct: 20, color: '#ffd24a', icon: 'wallet', desc: 'Your day to day' },
      { id: 'reserve', name: 'Reserve / emergencies', pct: 12, color: '#22c55e', icon: 'shield', desc: '3-6 months cushion' },
      { id: 'reward', name: 'Treat / reward', pct: 8, color: '#a855f7', icon: 'star', desc: 'Enjoy your progress' },
    ],
  };

  // Generational AI Portfolio 2040
  const PORTFOLIO = {
    perfil: 'Age 24 · aggressive profile · 20-30 year horizon',
    sectors: [
      { name: 'Chips / Semiconductors', pct: 28, color: '#5fd0ff' },
      { name: 'AI / Cloud / Software', pct: 25, color: '#7fb0ff' },
      { name: 'Crypto / Blockchain', pct: 18, color: '#a855f7' },
      { name: 'AI Networking', pct: 10, color: '#22c55e' },
      { name: 'Market ETF', pct: 8, color: '#ffd24a' },
      { name: 'Energy + Materials', pct: 6, color: '#f59e0b' },
      { name: 'Bonds / Cash', pct: 5, color: '#8a97a8' },
    ],
    assets: [
      ['NVDA', 'GPUs & AI factories', 10], ['BTC', 'Digital reserve', 10], ['MSFT', 'Enterprise AI & Cloud', 8],
      ['AVGO', 'ASICs & AI networking', 8], ['QQQ', 'US tech', 8], ['AMZN', 'AWS + AI', 6], ['ANET', 'AI data centers', 6],
      ['META', 'Data + AI models', 5], ['TSM', 'Chip manufacturing', 5], ['COIN', 'Crypto infrastructure', 5],
      ['ASML', 'EUV equipment', 4], ['CRCL', 'Stablecoins', 4], ['GOOGL', 'DeepMind / Gemini', 3], ['XLU', 'AI energy', 3],
      ['AMD', 'Alternative GPU', 2], ['MRVL', 'Networking', 2], ['IGV', 'Software ETF', 2], ['SPY', 'Broad market', 2],
      ['TSLA', 'AI robotics', 2], ['Bonds/Other', 'Defense & liquidity', 5],
    ],
    scenarios: [
      { monthly: 500, aportado: '$180K', r: { 8: '$700K', 10: '$1.1M', 12: '$1.7M', 15: '$3.4M' } },
      { monthly: 2000, aportado: '$720K', r: { 8: '$2.8M', 10: '$4.5M', 12: '$7M', 15: '$14M' } },
      { monthly: 2500, aportado: '$900K', r: { 8: '$3.5M', 10: '$5.6M', 12: '$8.8M', 15: '$17M' } },
      { monthly: 3000, aportado: '$1.08M', r: { 8: '$4.2M', 10: '$6.8M', 12: '$10.5M', 15: '$20M' } },
    ],
  };

  // ====================== SAMPLE DATA ======================
  function seed(db) {
    const id = () => Store.uid();
    db.meta.name = 'André';
    db.meta.handle = 'redpillmacouzet';
    db.meta.seeded = true;
    db.meta.onboarded = true;
    db.plan = JSON.parse(JSON.stringify(PLAN));
    db.money = JSON.parse(JSON.stringify(MONEY));

    // --- accounts (real Tradeify-style numbers) ---
    const a1 = { id: id(), firm: 'tradeify', alias: 'TDFYSL50909144440', size: 50000, phase: 'payout', status: 'activa', createdAt: '2026-06-21' };
    const a2 = { id: id(), firm: 'tradeify', alias: 'TDFYSL50350052692', size: 50000, phase: 'payout', status: 'activa', createdAt: '2026-06-21' };
    const a3 = { id: id(), firm: 'tradeify', alias: 'TDFYSL50592331321', size: 50000, phase: 'payout', status: 'activa', createdAt: '2026-06-21' };
    const apex = { id: id(), firm: 'apex', alias: 'Apex 50K', size: 50000, phase: 'funded', status: 'pasada', createdAt: '2026-03-20' };
    db.accounts = [a1, a2, a3, apex];
    const accIds = [a1.id, a2.id, a3.id];

    // --- payouts (11 cash-outs = $10,500) ---
    const P = (date, firm, acc, amount) => ({ id: id(), date, firm, accountId: acc, amount });
    db.payouts = [
      P('2026-04-09', 'apex', apex.id, 1200), P('2026-04-16', 'apex', apex.id, 1100),
      P('2026-04-23', 'apex', apex.id, 1100), P('2026-04-30', 'apex', apex.id, 1100),
      P('2026-05-08', 'tradeify', a1.id, 800), P('2026-05-15', 'tradeify', a1.id, 800),
      P('2026-05-22', 'tradeify', a1.id, 700), P('2026-05-29', 'tradeify', a1.id, 700),
      P('2026-06-05', 'tradeify', a2.id, 1100), P('2026-06-12', 'tradeify', a2.id, 1000), P('2026-06-19', 'tradeify', a3.id, 900),
    ];

    // --- 54 sample trades (Jun 21 +4.4K · 10W-15L ; Jun 22 +3.3K · 14W-15L) ---
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

    // --- Wallet · monthly expenses (samples, 100% editable) ---
    db.goals = [];
    db.expenses = [
      { id: id(), name: 'Rent', amount: 420, icon: 'home', color: '#5fd0ff' },
      { id: id(), name: 'Food', amount: 260, icon: 'wallet', color: '#7fb0ff' },
      { id: id(), name: 'Car (gas + insurance)', amount: 180, icon: 'car', color: '#ffd24a' },
      { id: id(), name: 'Subscriptions', amount: 60, icon: 'star', color: '#22c55e' },
      { id: id(), name: 'Going out / fun', amount: 140, icon: 'flame', color: '#a855f7' },
    ];

    // --- journal + course progress ---
    db.journal = [
      { id: id(), date: '2026-06-22', tag: 'win', text: 'Week +$7.7K on Tradeify. Clean ORB and W = stop. Consistency pays.' },
      { id: id(), date: '2026-06-21', tag: 'leccion', text: '44% win rate but 1.52 profit factor: I win when I’m right, cut fast when I’m not. Discipline.' },
    ];
    db.progress = { l01: true, l02: true, l03: true, l04: true, l11: true, l12: true };
  }

  return {
    FIRMS, firmOf, PHASES, phaseOf, ACC_STATUS, statusOf,
    INSTRUMENTS, SETUPS, setupOf, RESULTS, EMOTIONS,
    COURSE, allLessons, lessonById, PLAN, HOME, MONEY, PORTFOLIO, seed,
  };
})();
