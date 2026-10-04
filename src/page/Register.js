import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { register, errorMessage } from '../lib/api';
import AuthLayout from '../components/AuthLayout';

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    try {
      await register(username, password);
      toast.success('Compte créé, vous pouvez vous connecter');
      navigate('/login');
    } catch (err) {
      setError(errorMessage(err, "L'inscription a échoué. Réessayez."));
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Créer un compte" subtitle="Quelques secondes suffisent.">
      <motion.form className="form" onSubmit={handleSubmit} animate={error ? { x: [0, -8, 8, -5, 5, 0] } : {}} transition={{ duration: 0.4 }}>
        <label className="field">
          <span>Nom d'utilisateur</span>
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
        </label>
        <label className="field">
          <span>Mot de passe</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required />
        </label>
        <label className="field">
          <span>Confirmer le mot de passe</span>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required />
        </label>
        <AnimatePresence>
          {error && (
            <motion.p className="form-error" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              {error}
            </motion.p>
          )}
        </AnimatePresence>
        <motion.button type="submit" className="btn btn-primary btn-block" disabled={loading} whileTap={{ scale: 0.98 }}>
          {loading ? 'Création…' : "S'inscrire"}
        </motion.button>
      </motion.form>
      <p className="auth-foot">Déjà un compte ? <Link to="/login">Se connecter</Link></p>
    </AuthLayout>
  );
}
