import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { posts } from '../lib/posts';
import RevealText from '../components/RevealText';

export default function Blog() {
  useEffect(() => {
    document.title = 'The Baraka Journal \u2014 Wedding & Event Insights from Lahore';
    window.scrollTo(0, 0);
  }, []);

  const [featured, ...rest] = posts;

  return (
    <main className="bg-ink">
      {/* header */}
      <section className="relative overflow-hidden pt-36 pb-16 md:pt-44 md:pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full opacity-15 blur-[130px]"
          style={{ background: 'radial-gradient(circle, #c8a45d 0%, transparent 65%)' }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 md:px-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-4 text-[11px] uppercase tracking-[0.45em] text-gold"
          >
            The Baraka Journal
          </motion.p>
          <RevealText
            as="h1"
            text="Notes from the atelier"
            className="font-display text-4xl font-light leading-[1.08] text-cream sm:text-5xl md:text-7xl"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-6 max-w-xl text-sm font-light leading-relaxed text-cream/60 md:text-base"
          >
            Venue intelligence, design direction and honest planning advice for
            Lahore's weddings and events &mdash; written by the team that produces them.
          </motion.p>
        </div>
      </section>

      {/* featured post */}
      <section className="mx-auto max-w-[1200px] px-6 pb-16 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link to={`/blog/${featured.slug}`} className="group grid gap-0 overflow-hidden rounded-sm border border-white/8 bg-ink-2 lg:grid-cols-[1.4fr_1fr]">
            <div className="relative h-64 overflow-hidden sm:h-80 lg:h-[440px]">
              <img
                src={featured.image}
                alt={featured.imageAlt}
                className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-ink-2" />
              <span className="absolute left-5 top-5 rounded-full border border-gold/40 bg-ink/50 px-4 py-1.5 text-[10px] uppercase tracking-[0.25em] text-gold backdrop-blur-md">
                Featured
              </span>
            </div>
            <div className="flex flex-col justify-center p-7 md:p-10">
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-cream/45">
                <span className="text-gold">{featured.category}</span>
                <span className="h-1 w-1 rounded-full bg-cream/25" />
                <span>{featured.date}</span>
                <span className="h-1 w-1 rounded-full bg-cream/25" />
                <span>{featured.readTime}</span>
              </div>
              <h2 className="mt-4 font-display text-2xl font-light leading-snug text-cream transition-colors duration-300 group-hover:text-gold-soft md:text-4xl">
                {featured.title}
              </h2>
              <p className="mt-4 text-sm font-light leading-relaxed text-cream/60 md:text-base">{featured.excerpt}</p>
              <span className="mt-6 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-gold">
                Read the story
                <span className="transition-transform duration-300 group-hover:translate-x-2">&#10230;</span>
              </span>
            </div>
          </Link>
        </motion.div>
      </section>

      {/* grid */}
      <section className="mx-auto max-w-[1200px] px-6 pb-28 md:px-10 md:pb-36">
        <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {rest.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 0.8, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to={`/blog/${post.slug}`} className="group block overflow-hidden rounded-sm border border-white/8 bg-ink-2">
                <div className="relative h-52 overflow-hidden md:h-56">
                  <img
                    src={post.image}
                    alt={post.imageAlt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-cream/45">
                    <span className="text-gold">{post.category}</span>
                    <span className="h-1 w-1 rounded-full bg-cream/25" />
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="mt-3 font-display text-xl font-light leading-snug text-cream transition-colors duration-300 group-hover:text-gold-soft md:text-2xl">
                    {post.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-[13px] font-light leading-relaxed text-cream/55">{post.excerpt}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
