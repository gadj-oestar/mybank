import { motion } from 'framer-motion';

// Fond animé et carte centrée pour la connexion et l'inscription.
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth">
      <div className="auth-bg" aria-hidden="true">
        <span className="blob b1" />
        <span className="blob b2" />
        <span className="blob b3" />
      </div>
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
      >
        <div className="brand"><span className="brand-mark">m</span><span>myBank</span></div>
        <h1>{title}</h1>
        <p className="muted">{subtitle}</p>
        {children}
      </motion.div>
    </div>
  );
}
