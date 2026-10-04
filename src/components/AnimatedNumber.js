import { useEffect, useRef } from 'react';
import { animate, useReducedMotion } from 'framer-motion';
import { formatEuro } from '../lib/format';

// Compteur qui défile jusqu'à la valeur cible.
export default function AnimatedNumber({ value, format = formatEuro }) {
  const ref = useRef(null);
  const from = useRef(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduce) {
      node.textContent = format(value);
      return;
    }
    const controls = animate(from.current, value, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => { node.textContent = format(v); },
    });
    from.current = value;
    return () => controls.stop();
  }, [value, format, reduce]);

  return <span ref={ref} className="num">{format(0)}</span>;
}
