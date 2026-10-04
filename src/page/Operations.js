import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { deleteOperation, getOperations } from '../lib/api';
import { categoryColor, formatDate, formatEuro } from '../lib/format';
import PageHeader from '../components/PageHeader';
import { item } from '../components/motion';

const filters = [
  { id: 'all', label: 'Toutes' },
  { id: 'income', label: 'Revenus' },
  { id: 'expense', label: 'Dépenses' },
];

export default function Operations() {
  const navigate = useNavigate();
  const [ops, setOps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    getOperations()
      .then(setOps)
      .catch(() => toast.error('Impossible de charger les opérations'))
      .finally(() => setLoading(false));
  }, []);

  // Le bouton supprimer demande une seconde pression, annulée après 3 s.
  useEffect(() => {
    if (!confirmId) return;
    const t = setTimeout(() => setConfirmId(null), 3000);
    return () => clearTimeout(t);
  }, [confirmId]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...ops]
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      .filter((op) => {
        const v = Number(op.montant);
        if (filter === 'income' && v < 0) return false;
        if (filter === 'expense' && v >= 0) return false;
        return !q || `${op.libelle} ${op.categorie}`.toLowerCase().includes(q);
      });
  }, [ops, query, filter]);

  const handleDelete = async (id) => {
    if (confirmId !== id) {
      setConfirmId(id);
      return;
    }
    setConfirmId(null);
    try {
      await deleteOperation(id);
      setOps((prev) => prev.filter((op) => op.id !== id));
      toast.success('Opération supprimée');
    } catch {
      toast.error('La suppression a échoué');
    }
  };

  return (
    <>
      <PageHeader eyebrow="Historique" title="Opérations">
        <Link to="/operation/new" className="btn btn-primary">
          <Plus size={18} /> Ajouter
        </Link>
      </PageHeader>

      <div className="toolbar">
        <label className="search">
          <Search size={18} />
          <input
            type="search"
            placeholder="Rechercher un libellé ou une catégorie"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className="segmented" role="tablist">
          {filters.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              className={filter === f.id ? 'is-active' : ''}
              onClick={() => setFilter(f.id)}
            >
              {filter === f.id && <motion.span layoutId="seg" className="seg-pill" />}
              <span>{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="cards">
          {[0, 1, 2, 3].map((i) => <div key={i} className="card skeleton" />)}
        </div>
      ) : visible.length === 0 ? (
        <motion.div className="empty" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
          <p>{ops.length === 0 ? 'Aucune opération pour le moment.' : 'Aucun résultat pour cette recherche.'}</p>
          {ops.length === 0 && <Link to="/operation/new" className="btn btn-primary"><Plus size={18} /> Créer la première</Link>}
        </motion.div>
      ) : (
        <motion.div className="cards" layout>
          <AnimatePresence mode="popLayout">
            {visible.map((op, i) => {
              const v = Number(op.montant);
              return (
                <motion.article
                  key={op.id}
                  className="card op-card"
                  layout
                  variants={item}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ y: -3 }}
                >
                  <div className="op-top">
                    <span className="avatar" style={{ '--c': categoryColor(op.categorie) }}>
                      {(op.categorie || '?').charAt(0).toUpperCase()}
                    </span>
                    <span className="chip" style={{ '--c': categoryColor(op.categorie) }}>{op.categorie}</span>
                  </div>
                  <h3>{op.libelle}</h3>
                  <p className={`amount big ${v < 0 ? 'is-expense' : 'is-income'}`}>
                    {v > 0 ? '+' : ''}{formatEuro(v)}
                  </p>
                  <p className="muted">{formatDate(op.date)}</p>
                  <div className="card-actions">
                    <button className="btn btn-ghost" onClick={() => navigate(`/operation/edit/${op.id}`)}>
                      <Pencil size={16} /> Modifier
                    </button>
                    <button
                      className={`btn btn-ghost danger ${confirmId === op.id ? 'is-confirm' : ''}`}
                      onClick={() => handleDelete(op.id)}
                    >
                      <Trash2 size={16} /> {confirmId === op.id ? 'Confirmer' : 'Supprimer'}
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </>
  );
}
