import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { getCategories, getOperations } from '../lib/api';
import { categoryColor, formatEuro } from '../lib/format';
import AnimatedNumber from '../components/AnimatedNumber';
import PageHeader from '../components/PageHeader';
import { item, list } from '../components/motion';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [ops, setOps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCategories(), getOperations()])
      .then(([cats, operations]) => {
        setCategories(cats);
        setOps(operations);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const rows = useMemo(
    () =>
      categories
        .map((name) => {
          const own = ops.filter((op) => op.categorie === name);
          return { name, count: own.length, total: own.reduce((s, op) => s + Number(op.montant), 0) };
        })
        .sort((a, b) => b.count - a.count),
    [categories, ops]
  );

  return (
    <>
      <PageHeader eyebrow="Organisation" title="Catégories" />
      {loading ? (
        <div className="cards">{[0, 1, 2].map((i) => <div key={i} className="card skeleton short" />)}</div>
      ) : rows.length === 0 ? (
        <div className="empty"><p>Aucune catégorie utilisée pour le moment.</p></div>
      ) : (
        <motion.div className="cards" variants={list} initial="initial" animate="animate">
          {rows.map((c) => (
            <motion.article key={c.name} className="card cat-card" variants={item} whileHover={{ y: -3 }} style={{ '--c': categoryColor(c.name) }}>
              <span className="avatar">{c.name.charAt(0).toUpperCase()}</span>
              <h3>{c.name}</h3>
              <p className="muted">{c.count} opération{c.count > 1 ? 's' : ''}</p>
              <p className={`amount ${c.total < 0 ? 'is-expense' : 'is-income'}`}>
                <AnimatedNumber value={c.total} format={formatEuro} />
              </p>
            </motion.article>
          ))}
        </motion.div>
      )}
    </>
  );
}
