import { Fragment, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPost, getRelatedPosts } from '../lib/posts';
import MagneticButton from '../components/MagneticButton';
import { useSectionNav } from '../lib/useSectionNav';
import {
  useSEO,
  seoConfig,
  routes,
  generateArticleSchema,
  generateBreadcrumbSchema,
  applyStructuredData,
  composeSchemaGraph,
} from '../seo';

export default function BlogPost() {
  const { slug } = useParams();
  const post = slug ? getPost(slug) : undefined;
  const go = useSectionNav();

  useSEO({
    title: post ? `${post.title} \u2014 The Baraka Journal` : 'The Baraka Journal',
    description: post?.excerpt ?? seoConfig.site.description,
    canonical: post ? routes.blogPost(post.slug) : routes.blog,
    image: post?.image,
    imageAlt: post?.imageAlt,
    type: post ? 'article' : 'website',
    publishedDate: post?.publishedISO,
  });

  useEffect(() => {
    if (!post) return;
    window.scrollTo(0, 0);
    applyStructuredData(
      composeSchemaGraph([
        generateArticleSchema({
          title: post.title,
          description: post.excerpt,
          image: post.image,
          imageAlt: post.imageAlt,
          publishedDate: post.publishedISO,
          slug: post.slug,
        }),
        generateBreadcrumbSchema([
          { name: 'Home', url: seoConfig.site.url },
          { name: 'Blog', url: `${seoConfig.site.url}${routes.blog}` },
          { name: post.title, url: `${seoConfig.site.url}${routes.blogPost(post.slug)}` },
        ]),
      ])
    );
  }, [post]);

  if (!post) return <Navigate to="/blog" replace />;

  const related = getRelatedPosts(post.slug);

  return (
    <main className="bg-ink">
      {/* hero */}
      <section className="relative flex min-h-[62vh] items-end overflow-hidden pt-32 md:min-h-[70vh]">
        <div className="absolute inset-0">
          <img src={post.image} alt={post.imageAlt} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-ink/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/60" />
        </div>
        <div className="relative mx-auto w-full max-w-[900px] px-6 pb-14 md:px-10 md:pb-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            <Link to="/blog" className="text-[10px] uppercase tracking-[0.3em] text-cream/50 transition-colors hover:text-gold">
              &#10229; The Baraka Journal
            </Link>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-cream/50">
              <span className="rounded-full border border-gold/40 bg-ink/40 px-4 py-1.5 text-gold backdrop-blur-md">{post.category}</span>
              <span>{post.date}</span>
              <span className="h-1 w-1 rounded-full bg-cream/25" />
              <span>{post.readTime}</span>
            </div>
            <h1 className="mt-5 font-display text-3xl font-light leading-[1.12] text-cream sm:text-4xl md:text-6xl">{post.title}</h1>
          </motion.div>
        </div>
      </section>

      {/* body */}
      <article className="mx-auto max-w-[760px] px-6 py-14 md:px-10 md:py-20">
        {post.blocks.map((b, i) =>
          b.h ? (
            <motion.h2
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-12 font-display text-2xl font-light text-gold-soft md:text-3xl"
            >
              {b.h}
            </motion.h2>
          ) : (
            <Fragment key={i}>
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 text-[15px] font-light leading-[1.9] text-cream/75 md:text-base"
              >
                {b.p}
              </motion.p>
              {b.related && b.related.length > 0 && (
                <p className="mt-3 text-[12px] uppercase tracking-[0.15em] text-cream/40">
                  Related:{' '}
                  {b.related.map((r, ri) => (
                    <span key={r.slug}>
                      {ri > 0 && ' · '}
                      <Link to={`/blog/${r.slug}`} className="gold-underline text-gold hover:text-gold-soft">
                        {r.text}
                      </Link>
                    </span>
                  ))}
                </p>
              )}
            </Fragment>
          )
        )}

        {/* CTA */}
        <div className="mt-16 rounded-sm border border-gold/25 bg-ink-2 p-8 text-center md:p-10">
          <p className="font-display text-2xl font-light text-cream md:text-3xl">
            Planning something <em className="italic text-gold-soft">extraordinary</em>?
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm font-light leading-relaxed text-cream/60">
            Book a complimentary consultation with our atelier in Gulberg &mdash; we'll bring the venue intelligence, you bring the vision.
          </p>
          <div className="mt-7">
            <MagneticButton
              onClick={() => go('#contact')}
              className="rounded-full bg-gold px-9 py-4 text-[12px] font-medium uppercase tracking-[0.25em] text-ink transition-transform duration-300 hover:scale-[1.03]"
            >
              Book Consultation
            </MagneticButton>
          </div>
        </div>
      </article>

      {/* related */}
      <section className="mx-auto max-w-[1200px] px-6 pb-28 md:px-10 md:pb-36">
        <h3 className="mb-8 font-display text-2xl font-light text-cream md:text-3xl">More from the Journal</h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p) => (
            <Link key={p.slug} to={`/blog/${p.slug}`} className="group block overflow-hidden rounded-sm border border-white/8 bg-ink-2">
              <div className="relative h-44 overflow-hidden">
                <img src={p.image} alt={p.imageAlt} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105" />
              </div>
              <div className="p-5">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gold">{p.category}</span>
                <h4 className="mt-2 font-display text-lg font-light leading-snug text-cream transition-colors duration-300 group-hover:text-gold-soft">{p.title}</h4>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
