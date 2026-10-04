const euro = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
const day = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

export const formatEuro = (value) => euro.format(Number(value) || 0);

export const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? iso : day.format(d);
};

export const today = () => new Date().toISOString().slice(0, 10);

// Couleur stable par catégorie, dérivée de son nom.
const palette = ['#f59e0b', '#10b981', '#6366f1', '#ef4444', '#06b6d4', '#ec4899', '#84cc16', '#8b5cf6'];
export const categoryColor = (name = '') => {
  let h = 2166136261; // FNV-1a
  for (const c of name.toLowerCase()) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
  return palette[(h >>> 5) % palette.length];
};
