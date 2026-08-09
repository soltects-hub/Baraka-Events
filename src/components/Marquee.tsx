import { motion } from 'framer-motion';

const items = ['Mehndi Nights', 'Baraat Processions', 'Nikkah Ceremonies', 'Walima Receptions', 'Corporate Galas', 'Destination Shaadis'];

export default function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-white/5 bg-ink-2 py-6">
      <motion.div
        className="flex w-max items-center gap-10 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
      >
        {row.map((item, i) => (
          <div key={i} className="flex items-center gap-10">
            <span className="font-display text-2xl italic text-cream/60 md:text-3xl">{item}</span>
            <span className="h-1.5 w-1.5 rotate-45 bg-gold/70" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
