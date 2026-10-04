import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { login } from '../lib/api';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch {
      setError("Nom d'utilisateur ou mot de passe incorrect.");
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Bon retour" subtitle="Connectez-vous pour suivre vos comptes.">
      <motion.form className="form" onSubmit={handleSubmit} animate={error ? { x: [0, -8, 8, -5, 5, 0] } : {}} transition={{ duration: 0.4 }}>
        <label className="field">
          <span>Nom d'utilisateur</span>
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
        </label>
        <label className="field">
          <span>Mot de passe</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </label>
        <AnimatePresence>
          {error && (
            <motion.p className="form-error" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              {error}
            </motion.p>
          )}
        </AnimatePresence>
        <motion.button type="submit" className="btn btn-primary btn-block" disabled={loading} whileTap={{ scale: 0.98 }}>
          {loading ? 'Connexion…' : 'Se connecter'}
        </motion.button>
      </motion.form>
      <p className="auth-foot">Pas encore de compte ? <Link to="/signin">Créer un compte</Link></p>
    </AuthLayout>
  );
}
