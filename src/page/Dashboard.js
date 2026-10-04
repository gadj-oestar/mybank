import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Plus, Wallet } from 'lucide-react';
import { getOperations } from '../lib/api';
import { formatDate, formatEuro, categoryColor } from '../lib/format';
import AnimatedNumber from '../components/AnimatedNumber';
import PageHeader from '../components/PageHeader';
import { item, list } from '../components/motion';

const monthLabel = new Intl.DateTimeFormat('fr-FR', { month: 'short' });

// Les 6 derniers mois, revenus et dépenses séparés.
function byMonth(ops) {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return { key: d.toISOString().slice(0, 7), label: monthLabel.format(d), income: 0, expense: 0 };
  });
  for (const op of ops) {
    const m = months.find((x) => op.date?.startsWith(x.key));
    if (!m) continue;
    const v = Number(op.montant);
    if (v >= 0) m.income += v;
    else m.expense += -v;
  }
  return months;
}

function byCategory(ops) {
  const totals = {};
  for (const op of ops) {
    const v = Number(op.montant);
    if (v < 0) totals[op.categorie || 'Autre'] = (totals[op.categorie || 'Autre'] || 0) - v;
  }
  return Object.entries(totals)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
}

export default function Dashboard() {
  const [ops, setOps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOperations()
      .then(setOps)
      .catch(() => setOps([]))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const op of ops) {
      const v = Number(op.montant);
      if (v >= 0) income += v;
      else expense += -v;
    }
    return { balance: income - expense, income, expense };
  }, [ops]);

  const months = useMemo(() => byMonth(ops), [ops]);
  const maxMonth = Math.max(1, ...months.map((m) => Math.max(m.income, m.expense)));
  const categories = useMemo(() => byCategory(ops), [ops]);
  const maxCat = Math.max(1, ...categories.map((c) => c.total));
  const recent = useMemo(
    () => [...ops].sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 5),
    [ops]
  );

  return (
    <>
      <PageHeader eyebrow="Vue d'ensemble" title="Tableau de bord">
        <Link to="/operation/new" className="btn btn-primary">
          <Plus size={18} /> Nouvelle opération
        </Link>
      </PageHeader>

      <motion.section className="stats" variants={list} initial="initial" animate="animate">
        <motion.div className="stat stat-hero" variants={item}>
          <div className="stat-icon"><Wallet size={20} /></div>
          <p className="stat-label">Solde</p>
          <p className="stat-value"><AnimatedNumber value={stats.balance} /></p>
          <p className="stat-foot">{ops.length} opération{ops.length > 1 ? 's' : ''}</p>
        </motion.div>
        <motion.div className="stat" variants={item}>
          <div className="stat-icon is-income"><ArrowUpRight size={20} /></div>
          <p className="stat-label">Revenus</p>
          <p className="stat-value"><AnimatedNumber value={stats.income} /></p>
        </motion.div>
        <motion.div className="stat" variants={item}>
          <div className="stat-icon is-expense"><ArrowDownRight size={20} /></div>
          <p className="stat-label">Dépenses</p>
          <p className="stat-value"><AnimatedNumber value={stats.expense} /></p>
        </motion.div>
      </motion.section>

      <section className="grid-2">
        <motion.div className="panel" variants={item} initial="initial" animate="animate">
          <div className="panel-head">
            <h2>Flux des 6 derniers mois</h2>
            <div className="legend">
              <span><i className="dot is-income" /> Revenus</span>
              <span><i className="dot is-expense" /> Dépenses</span>
            </div>
          </div>
          <div className="bars" role="img" aria-label="Revenus et dépenses par mois">
            {months.map((m, i) => (
              <div className="bar-group" key={m.key}>
                <div className="bar-pair">
                  {[['income', m.income], ['expense', m.expense]].map(([kind, v], j) => (
                    <motion.div
                      key={kind}
                      className={`bar is-${kind}`}
                      initial={{ height: 0 }}
                      animate={{ height: `${(v / maxMonth) * 100}%` }}
                      transition={{ delay: 0.25 + i * 0.06 + j * 0.03, type: 'spring', stiffness: 120, damping: 18 }}
                    >
                      <span className="tip">
                        {kind === 'income' ? 'Revenus' : 'Dépenses'} {m.label} : {formatEuro(v)}
                      </span>
                    </motion.div>
                  ))}
                </div>
                <span className="bar-label">{m.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="panel" variants={item} initial="initial" animate="animate">
          <div className="panel-head">
            <h2>Dépenses par catégorie</h2>
            <Link to="/categories" className="link">Tout voir</Link>
          </div>
          {categories.length === 0 ? (
            <p className="muted">{loading ? 'Chargement…' : 'Aucune dépense enregistrée.'}</p>
          ) : (
            <ul className="meters">
              {categories.map((c, i) => (
                <li key={c.name} title={`${c.name} : ${formatEuro(c.total)}`}>
                  <div className="meter-row">
                    <span><i className="dot" style={{ background: categoryColor(c.name) }} /> {c.name}</span>
                    <span className="num">{formatEuro(c.total)}</span>
                  </div>
                  <div className="meter">
                    <motion.div
                      className="meter-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${(c.total / maxCat) * 100}%` }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </section>

      <motion.section className="panel" variants={item} initial="initial" animate="animate">
        <div className="panel-head">
          <h2>Dernières opérations</h2>
          <Link to="/operation" className="link">Toutes les opérations</Link>
        </div>
        {recent.length === 0 ? (
          <p className="muted">{loading ? 'Chargement…' : 'Aucune opération pour le moment.'}</p>
        ) : (
          <motion.ul className="rows" variants={list} initial="initial" animate="animate">
            {recent.map((op) => (
              <motion.li key={op.id} className="row" variants={item}>
                <span className="avatar" style={{ '--c': categoryColor(op.categorie) }}>
                  {(op.categorie || '?').charAt(0).toUpperCase()}
                </span>
                <div className="row-main">
                  <strong>{op.libelle}</strong>
                  <span className="muted">{op.categorie} · {formatDate(op.date)}</span>
                </div>
                <span className={`amount ${Number(op.montant) < 0 ? 'is-expense' : 'is-income'}`}>
                  {Number(op.montant) > 0 ? '+' : ''}{formatEuro(op.montant)}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </motion.section>
    </>
  );
}
