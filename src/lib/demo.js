// Mode démo (REACT_APP_DEMO=true) : l'API est simulée en mémoire,
// pour présenter l'interface sans lancer le back-end Symfony.
const month = (offset, day) => {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - offset);
  d.setDate(day);
  return d.toISOString().slice(0, 10);
};

let nextId = 100;
let operations = [
  ['Salaire', 2150, 'Salaire', 0, 1],
  ['Loyer', -720, 'Logement', 0, 2],
  ['Courses Carrefour', -86.4, 'Alimentation', 0, 3],
  ['Pass Navigo', -86.4, 'Transport', 1, 30],
  ['Restaurant', -42, 'Sorties', 1, 26],
  ['Salaire', 2150, 'Salaire', 1, 1],
  ['Loyer', -720, 'Logement', 1, 2],
  ['Courses Lidl', -64.2, 'Alimentation', 1, 14],
  ['Salle de sport', -29.99, 'Santé', 1, 5],
  ['Salaire', 2100, 'Salaire', 2, 1],
  ['Loyer', -720, 'Logement', 2, 2],
  ['Vacances', -540, 'Sorties', 2, 12],
  ['Salaire', 2100, 'Salaire', 3, 1],
  ['Loyer', -720, 'Logement', 3, 2],
  ['Prime', 400, 'Salaire', 4, 20],
  ['Loyer', -720, 'Logement', 4, 2],
  ['Courses', -210, 'Alimentation', 5, 10],
].map(([libelle, montant, categorie, m, d], i) => ({ id: i + 1, libelle, montant, categorie, date: month(m, d) }));
let profile = { username: 'gad' };

const reply = (config, status, data) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      const res = { data, status, statusText: String(status), headers: {}, config };
      if (status >= 400) reject(Object.assign(new Error(`Erreur ${status}`), { response: res, config }));
      else resolve(res);
    }, 250)
  );

export default function demoAdapter(config) {
  const method = config.method.toUpperCase();
  const path = config.url.replace(/^.*\/api/, '').replace(/^(?!\/)/, '/');
  const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : config.data || {};
  const id = Number(path.split('/')[2]);
  const toOp = (b) => ({ libelle: b.libelle, montant: Number(b.montant), categorie: b.categorie, date: b.date });

  if (path === '/operations' && method === 'GET') return reply(config, 200, operations);
  if (path === '/operations' && method === 'POST') {
    const op = { id: nextId++, ...toOp(body) };
    operations = [...operations, op];
    return reply(config, 200, { message: 'Opération créée avec succès', id: op.id });
  }
  if (path.startsWith('/operations/')) {
    const op = operations.find((o) => o.id === id);
    if (!op) return reply(config, 404, { error: 'Opération introuvable' });
    if (method === 'GET') return reply(config, 200, op);
    if (method === 'PUT') {
      operations = operations.map((o) => (o.id === id ? { ...o, ...toOp(body) } : o));
      return reply(config, 200, { message: 'Opération modifiée avec succès' });
    }
    if (method === 'DELETE') {
      operations = operations.filter((o) => o.id !== id);
      return reply(config, 200, { message: 'Opération supprimée avec succès' });
    }
  }
  if (path === '/categories') return reply(config, 200, [...new Set(operations.map((o) => o.categorie))]);
  if (path === '/profil' && method === 'GET') return reply(config, 200, profile);
  if (path === '/profil' && method === 'PUT') {
    profile = { username: body.username || profile.username };
    return reply(config, 200, { message: 'Profil mis à jour' });
  }
  if (path === '/login' || path === '/register') {
    return body.username && body.password
      ? reply(config, 200, { message: 'OK' })
      : reply(config, 401, { message: 'Identifiants invalides' });
  }
  return reply(config, 404, { error: 'Route inconnue' });
}
