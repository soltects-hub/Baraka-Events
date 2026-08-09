import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useVelocity } from 'framer-motion';

export default function CameraHUD({ visible }: { visible: boolean }) {
  const { scrollY, scrollYProgress } = useScroll();
  const velocity = useVelocity(scrollY);
  const [tc, setTc] = useState('00:00:00:00');
  const [mm, setMm] = useState(24);
  const [scene, setScene] = useState('01 · ESTABLISHING — THE STAGE');
  const [rolling, setRolling] = useState(false);
  const stopTimer = useRef<number>(0);

  const focal = useTransform(scrollYProgress, [0, 1], [24, 135]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const total = Math.max(0, Math.round(v * 24 * 92));
    const f = total % 24;
    const s = Math.floor(total / 24) % 60;
    const m = Math.floor(total / 1440);
    setTc(`00:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`);
  });

  useMotionValueEvent(focal, 'change', (v) => setMm(Math.round(v)));

  useMotionValueEvent(velocity, 'change', (v) => {
    if (Math.abs(v) > 40) {
      setRolling(true);
      window.clearTimeout(stopTimer.current);
      stopTimer.current = window.setTimeout(() => setRolling(false), 300);
    }
  });

  useMotionValueEvent(scrollY, 'change', () => {
    const sections = document.querySelectorAll<HTMLElement>('[data-scene]');
    let current = '';
    sections.forEach((el) => {
      if (el.getBoundingClientRect().top <= window.innerHeight * 0.5) {
        current = el.dataset.scene ?? current;
      }
    });
    if (current) setScene(current);
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={visible ? { opacity: 1 } : {}}
      transition={{ duration: 1.2, delay: 2.2 }}
      className="pointer-events-none fixed inset-0 z-[85] hidden lg:block"
      aria-hidden
    >
      {/* viewfinder corner brackets */}
      <span className="absolute left-4 top-24 h-6 w-6 border-l border-t border-gold/30" />
      <span className="absolute right-4 top-24 h-6 w-6 border-r border-t border-gold/30" />
      <span className="absolute bottom-10 left-4 h-6 w-6 border-b border-l border-gold/30" />
      <span className="absolute bottom-10 right-4 h-6 w-6 border-b border-r border-gold/30" />

      {/* readout bar */}
      <div className="absolute bottom-2.5 left-6 right-6 flex items-end justify-between text-[10px] uppercase tracking-[0.22em] text-cream/45">
        <div className="flex items-center gap-2.5">
          <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${rolling ? 'bg-[#e5484d] animate-pulse' : 'bg-cream/25'}`} />
          <span className={rolling ? 'text-[#e5484d]/90' : ''}>{rolling ? 'REC' : 'STBY'}</span>
          <span className="font-mono tracking-[0.15em] text-cream/55">{tc}</span>
        </div>
        <div className="text-gold/70">SC {scene}</div>
        <div className="font-mono tracking-[0.15em]">{mm}mm · f/2.0 · ISO 800</div>
      </div>
    </motion.div>
  );
}
