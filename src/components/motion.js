// Variantes d'animation partagées entre les pages.
export const page = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18 } },
};

export const list = {
  animate: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

export const item = {
  initial: { opacity: 0, y: 14, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 24 } },
  exit: { opacity: 0, x: -40, scale: 0.96, transition: { duration: 0.22 } },
};
