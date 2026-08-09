import { useRef, type ReactNode, type MouseEvent } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface Props {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  href?: string;
  type?: 'button' | 'submit';
}

export default function MagneticButton({ children, className = '', strength = 0.35, onClick, href, type }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.4 });

  const handleMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const inner = href ? (
    <a href={href} onClick={onClick ? (e) => { e.preventDefault(); onClick(); } : undefined} className={className}>
      {children}
    </a>
  ) : (
    <button type={type ?? 'button'} onClick={onClick} className={className}>
      {children}
    </button>
  );

  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={reset} className="inline-block">
      <motion.div style={{ x: sx, y: sy }}>{inner}</motion.div>
    </div>
  );
}
