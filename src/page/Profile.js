import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProfile, updateProfile, errorMessage } from '../lib/api';
import PageHeader from '../components/PageHeader';

export default function Profile() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProfile()
      .then((data) => setUsername(data.username || ''))
      .catch(() => toast.error('Impossible de charger le profil'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { username };
    if (password) payload.password = password;
    setSaving(true);
    try {
      const data = await updateProfile(payload);
      toast.success(data.message || 'Profil mis à jour');
      setPassword('');
    } catch (err) {
      toast.error(errorMessage(err, 'La mise à jour a échoué'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader eyebrow="Compte" title="Profil" />
      <form className={`panel form ${loading ? 'is-loading' : ''}`} onSubmit={handleSubmit}>
        <div className="profile-head">
          <span className="avatar xl">{(username || '?').charAt(0).toUpperCase()}</span>
          <div>
            <strong>{username || '…'}</strong>
            <p className="muted">Modifiez votre identifiant ou votre mot de passe.</p>
          </div>
        </div>
        <label className="field">
          <span>Nom d'utilisateur</span>
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
        </label>
        <label className="field">
          <span>Nouveau mot de passe</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Laisser vide pour ne pas changer"
            autoComplete="new-password"
          />
        </label>
        <motion.button type="submit" className="btn btn-primary btn-block" disabled={saving} whileTap={{ scale: 0.98 }}>
          <Check size={18} /> {saving ? 'Enregistrement…' : 'Mettre à jour'}
        </motion.button>
      </form>
    </>
  );
}
