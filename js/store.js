/* ============ RACHA · Caché local (offline-first). Todo vive en el teléfono ============ */
const Store = (() => {
  const KEY = 'racha_db_v1';

  const empty = () => ({
    meta: { name: '', currency: 'USD', seeded: false, onboarded: false },
    accounts: [],   // cuentas de fondeo
    trades: [],     // operaciones
    payouts: [],    // retiros cobrados
    goals: [],      // (legacy, sin uso)
    expenses: [],   // Cartera · gastos del mes (personalizable)
    journal: [],    // notas / bitácora diaria
    plan: null,     // reglas + pledge + checklist (se siembra de Data.PLAN)
    checks: {},     // { 'YYYY-MM-DD': [idsDeChecklistCumplidos] }
    progress: {},   // { lessonId: true } — lecciones del curso completadas
    money: null,    // Snowball · money management (se siembra de Data.MONEY)
    sync: null,     // conexión Tradovate { backendUrl, session, lastSync }
    tvsync: null,   // conexión TradingView webhook { url, secret, lastSync }
  });

  function load() {
    try { const raw = localStorage.getItem(KEY); if (raw) return { ...empty(), ...JSON.parse(raw) }; } catch (e) {}
    return empty();
  }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function wipe() { try { localStorage.removeItem(KEY); } catch (e) {} }

  const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

  return { empty, load, save, wipe, uid };
})();
