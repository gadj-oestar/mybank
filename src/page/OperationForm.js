import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowLeft, ArrowUpRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { createOperation, getCategories, getOperation, updateOperation, errorMessage } from '../lib/api';
import { today } from '../lib/format';
import PageHeader from '../components/PageHeader';

// Formulaire partagé entre la création (/operation/new) et l'édition (/operation/edit/:id).
// Le montant est saisi en valeur absolue : le type (revenu ou dépense) fixe le signe envoyé à l'API.
export default function OperationForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({ libelle: '', montant: '', categorie: '', date: today() });
  const [kind, setKind] = useState('expense');
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    getOperation(id)
      .then((op) => {
        const v = Number(op.montant);
        setKind(v < 0 ? 'expense' : 'income');
        setForm({ libelle: op.libelle, montant: String(Math.abs(v)), categorie: op.categorie, date: op.date });
      })
      .catch(() => toast.error("Impossible de charger l'opération"))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = Math.abs(parseFloat(form.montant));
    if (!amount) {
      toast.error('Le montant doit être supérieur à 0');
      return;
    }
    const payload = { ...form, montant: kind === 'expense' ? -amount : amount };
    setSaving(true);
    try {
      if (isEdit) await updateOperation(id, payload);
      else await createOperation(payload);
      toast.success(isEdit ? 'Opération modifiée' : 'Opération créée');
      navigate('/operation');
    } catch (err) {
      toast.error(errorMessage(err, "L'enregistrement a échoué"));
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader eyebrow={isEdit ? 'Modification' : 'Création'} title={isEdit ? "Modifier l'opération" : 'Nouvelle opération'}>
        <Link to="/operation" className="btn btn-ghost"><ArrowLeft size={18} /> Retour</Link>
      </PageHeader>

      <form className={`panel form ${loading ? 'is-loading' : ''}`} onSubmit={handleSubmit}>
        <div className="kind-toggle">
          {[
            { id: 'expense', label: 'Dépense', icon: ArrowDownRight },
            { id: 'income', label: 'Revenu', icon: ArrowUpRight },
          ].map(({ id: k, label, icon: Icon }) => (
            <button
              type="button"
              key={k}
              className={`kind is-${k} ${kind === k ? 'is-active' : ''}`}
              onClick={() => setKind(k)}
            >
              {kind === k && <motion.span layoutId="kind" className="kind-pill" />}
              <Icon size={18} /> <span>{label}</span>
            </button>
          ))}
        </div>

        <label className="field">
          <span>Libellé</span>
          <input name="libelle" value={form.libelle} onChange={handleChange} placeholder="Ex. Courses du samedi" required />
        </label>

        <div className="field-row">
          <label className="field">
            <span>Montant (€)</span>
            <input name="montant" type="number" min="0" step="0.01" inputMode="decimal" value={form.montant} onChange={handleChange} placeholder="0,00" required />
          </label>
          <label className="field">
            <span>Date</span>
            <input name="date" type="date" value={form.date} onChange={handleChange} required />
          </label>
        </div>

        <label className="field">
          <span>Catégorie</span>
          <input name="categorie" list="categories" value={form.categorie} onChange={handleChange} placeholder="Ex. Alimentation" required />
          <datalist id="categories">
            {categories.map((c) => <option key={c} value={c} />)}
          </datalist>
        </label>

        <motion.button type="submit" className="btn btn-primary btn-block" disabled={saving} whileTap={{ scale: 0.98 }}>
          <Check size={18} /> {saving ? 'Enregistrement…' : isEdit ? 'Enregistrer les modifications' : "Créer l'opération"}
        </motion.button>
      </form>
    </>
  );
}
