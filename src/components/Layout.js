import { useState } from 'react';
import { NavLink, useLocation, useNavigate, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, ArrowLeftRight, Tags, UserRound, LogOut, Menu, X } from 'lucide-react';
import { page } from './motion';
import { DEMO } from '../lib/api';

const links = [
  { to: '/', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/operation', label: 'Opérations', icon: ArrowLeftRight },
  { to: '/categories', label: 'Catégories', icon: Tags },
  { to: '/profile', label: 'Profil', icon: UserRound },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const outlet = useOutlet();
  const [open, setOpen] = useState(false);

  return (
    <div className="shell">
      <aside className={`sidebar ${open ? 'is-open' : ''}`}>
        <div className="brand">
          <span className="brand-mark">m</span>
          <span>myBank</span>
          {DEMO && <span className="demo-badge">Démo</span>}
          <button className="icon-btn menu-toggle" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="nav" onClick={() => setOpen(false)}>
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className="nav-item">
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="nav-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <Icon size={18} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <button className="nav-item logout" onClick={() => navigate('/login')}>
          <LogOut size={18} />
          <span>Déconnexion</span>
        </button>
      </aside>

      <main className="main">
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} {...page}>
            {outlet}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
