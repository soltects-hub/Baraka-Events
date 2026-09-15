import { useRef, type ReactNode, type MouseEvent as ReactMouseEvent } from 'react';
import { m, useMotionValue, useSpring } from 'framer-motion';

interface Props {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  href?: string;
  type?: 'button' | 'submit';
  size?: 'sm' | 'md';
  /** 'primary' is the flame pill — one per view. 'ghost' is the champagne
   *  outline for everything that sits next to it. */
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
}

export default function MagneticButton({
  children,
  className = '',
  strength = 0.35,
  onClick,
  href,
  type = 'button',
  size = 'md',
  variant = 'primary',
  disabled = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: ReactMouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const sizeClass = size === 'sm' ? 'px-5 py-2.5 text-[12px]' : 'px-9 py-4 text-[12px]';

  // Material (colour, glow, sweep) lives in .btn-flame / .btn-ghost in
  // index.css, which also own the transition so the shadow eases with the
  // transform instead of snapping.
  const variantClass = variant === 'ghost' ? 'btn-ghost' : 'btn-flame';
  const buttonClass = `inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full font-medium uppercase tracking-[0.22em] hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 ${variantClass} ${sizeClass} ${className}`;

  return (
    <m.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      {href ? (
        <a
          href={href}
          onClick={onClick}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className={buttonClass}
        >
          {children}
        </a>
      ) : (
        <button type={type} onClick={onClick} disabled={disabled} className={buttonClass}>
          {children}
        </button>
      )}
    </m.div>
  );
}
