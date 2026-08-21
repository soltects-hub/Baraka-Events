export interface PostBlock {
  h?: string;
  p?: string;
  /** Optional inline "Related reading" links shown after this paragraph. */
  related?: { text: string; slug: string }[];
}

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  /** ISO 8601 date (year-month precision, matching the editorial `date` field above). */
  publishedISO: string;
  readTime: string;
  image: string;
  imageAlt: string;
  blocks: PostBlock[];
}

export const posts: Post[] = [
  {
    slug: 'top-wedding-venues-lahore-2025',
    title: 'The 10 Most Beautiful Wedding Venues in Lahore for 2025',
    excerpt:
      'From Walled City havelis to DHA\u2019s grandest marquees \u2014 our producers rank the venues that photograph like cinema and host like royalty.',
    category: 'Venues',
    date: 'March 2025',
    publishedISO: '2025-03',
    readTime: '7 min read',
    image: '/media/portfolio-1.jpg',
    imageAlt: 'Grand Pakistani wedding reception in a historic Lahore haveli courtyard',
    blocks: [
      { p: 'Lahore does not lack beautiful venues \u2014 it lacks honest guidance about them. After producing more than 450 events across this city, we know which courtyards flood in monsoon season, which marquees have ceilings tall enough for a proper stage reveal, and which havelis make every photograph look like a film still.' },
      { h: 'The Walled City: havelis with history' },
      { p: 'For families who want their shaadi to feel rooted in Lahore\u2019s soul, nothing rivals a restored haveli in the Androon Shehr. Courtyard acoustics carry the dhol beautifully, brick facades glow under amber uplighting, and the rooftop views toward Badshahi Mosque are unrepeatable anywhere else in Pakistan. Book 10\u201312 months ahead \u2014 winter weekends disappear first.' },
      { h: 'Gulberg & MM Alam: the convenient classics' },
      { p: 'When guest convenience matters \u2014 elderly relatives, tight schedules, out-of-town mehmaan \u2014 Gulberg\u2019s banquet complexes and five-star ballrooms remain the sensible crown. The best of them offer 20-foot ceilings, proper loading docks for stage builds, and in-house catering flexible enough to accept your family\u2019s trusted caterer.' },
      { h: 'DHA & Bahria: marquee country' },
      { p: 'The purpose-built marquees of DHA and Bahria Town give our designers the most freedom: blank ceilings for floral chandeliers, deep stages for multi-level sets, and parking that swallows six hundred cars without drama. If your vision involves a custom-built world \u2014 a Mughal garden indoors, a Parisian street, a mirrored infinity hall \u2014 this is where we build it.' },
      { h: 'The gardens: Shalimar-inspired outdoor ceremonies' },
      { p: 'October through March, Lahore\u2019s gardens host the city\u2019s most romantic nikkahs \u2014 water channels, cypress lines and golden-hour light no ballroom can imitate. The catch is contingency: a producer must always hold an indoor fallback, weather-proof power, and heating for the late-night walima crowd. That is precisely the kind of invisible engineering Baraka exists for.' },
      { p: 'Choosing among them comes down to three questions: how many guests, which season, and what story you want the night to tell. Bring us those three answers and we will bring you the venue \u2014 usually one you did not know existed.' },
    ],
  },
  {
    slug: 'mehndi-themes-lahore-loves',
    title: 'Seven Mehndi Themes Lahore Cannot Get Enough Of',
    excerpt:
      'Genda phool maximalism, vintage truck-art brights, monochrome ivory \u2014 the mehndi moods defining this wedding season, from our design floor.',
    category: 'Design',
    date: 'March 2025',
    publishedISO: '2025-03',
    readTime: '6 min read',
    image: '/media/gallery-4.jpg',
    imageAlt: 'Outdoor mehndi dinner under string lights and marigold garlands',
    blocks: [
      { p: 'The mehndi is the night guests actually dance \u2014 which makes it the night design earns its keep. These are the seven directions our Lahore clients are requesting most, and what each one demands to be done properly.' },
      { h: '1. Genda Phool Maximalism' },
      { p: 'Ceilings dripping with marigold strings, mirrored stage backs doubling every bloom, and haldi-yellow seating. It photographs spectacularly but demands fresh flowers strung the same morning \u2014 we brief our phool waalay at dawn.' },
      { h: '2. Truck-Art Brights' },
      { p: 'Lahori pop: chamakpatti panels, hand-painted signage, rickshaw photo-booths and neon nastaliq. Playful, proudly local, and best balanced with clean white linens so the palette sings instead of shouting.' },
      { h: '3. Ivory Monochrome' },
      { p: 'The quiet rebellion \u2014 all-white florals, rattan lanterns, ivory kurtas encouraged on the invite. It strips colour so that mehndi itself, the dancing and the haldi become the colour. Lighting design carries the whole night here.' },
      { h: '4. Mughal Courtyard' },
      { p: 'Scalloped arches, surahi centrepieces, qawwali before the dance floor opens. Built for haveli venues, and the theme our destination guests from abroad request most.' },
      { p: 'Whichever direction you choose, one rule holds: the mehndi should look nothing like the walima. Two nights, two worlds \u2014 that contrast is what your guests will still talk about at the next family shaadi.' },
    ],
  },
  {
    slug: 'luxury-shaadi-cost-lahore',
    title: 'What a Luxury Shaadi in Lahore Actually Costs in 2025',
    excerpt:
      'A transparent, line-item look at real wedding budgets \u2014 venue, decor, catering, film \u2014 and where smart families spend versus save.',
    category: 'Planning',
    date: 'February 2025',
    publishedISO: '2025-02',
    readTime: '8 min read',
    image: '/media/wedding-1.jpg',
    imageAlt: 'Luxurious golden nikkah stage with cascading roses and candles',
    blocks: [
      { p: 'Nobody in this industry likes talking numbers publicly. We do \u2014 because families plan better, negotiate better and enjoy their own shaadi more when nobody is guessing. Here is the honest anatomy of a luxury Lahore wedding budget.' },
      { h: 'The four pillars of every budget' },
      { p: 'Venue and marquee typically claim 20\u201325% of total spend. Decor and production \u2014 stage, florals, lighting, sound \u2014 another 25\u201330%. Catering runs 25\u201335% depending on guest count and menu ambition. Photography and film, the only deliverable that outlives the night, deserves the final 10\u201315%.' },
      { h: 'Where smart families spend' },
      { p: 'Lighting is the single highest-leverage line item \u2014 a modest stage under exceptional light beats a lavish stage under flat white flood every single time. The second is sound: guests forgive a plain centrepiece, never a speech they could not hear.' },
      { h: 'Where smart families save' },
      { p: 'Off-peak dates (March\u2013April, September) unlock 15\u201320% savings on identical venues. Repurposing nikkah florals into walima lounge arrangements. And guest-count honesty: every fifty guests trimmed funds an upgrade somewhere the camera will actually see.' },
      { h: 'The Baraka proposal' },
      { p: 'Every engagement begins with a line-item proposal \u2014 every rupee visible, every alternative priced. No surprises has been our policy for twelve years; it is also, not coincidentally, why 98% of our clients return for the family\u2019s next celebration.' },
    ],
  },
  {
    slug: 'walima-decor-trends-2025',
    title: 'Walima Decor in 2025: From Pastel Minimal to Mughal Maximal',
    excerpt:
      'The reception is the finale \u2014 the night of the couple\u2019s first entrance as a married pair. Here is how Lahore is staging it this season.',
    category: 'Design',
    date: 'February 2025',
    publishedISO: '2025-02',
    readTime: '5 min read',
    image: '/media/gallery-1.jpg',
    imageAlt: 'Opulent rose and marigold floral arrangements in a shaadi reception venue',
    blocks: [
      { p: 'If the mehndi is the party and the baraat is the drama, the walima is the portrait \u2014 composed, elegant, and photographed more than any other night. Two schools dominate Lahore\u2019s 2025 season.' },
      { h: 'Pastel minimal' },
      { p: 'Blush, champagne and sage; suspended floral clouds instead of dense stage walls; candlelight at eye level across long imperial tables. The style flatters photography enormously and lets the bride\u2019s couture carry the frame \u2014 which is, of course, the point.' },
      { h: 'Mughal maximal' },
      { p: 'The counter-movement: deep emeralds and rubies, gold-leaf frames, scalloped arches receding in layers, tuberose and red rose by the thousand. In a haveli or a high-ceilinged marquee it creates the sensation of walking into a miniature painting.' },
      { h: 'The detail everyone underestimates' },
      { p: 'The entrance corridor. Guests form their impression of the entire night in the thirty steps between the car and the hall \u2014 which is why our designers spend disproportionate budget and rehearsal time on that first passage of scent, light and sound.' },
    ],
  },
  {
    slug: 'corporate-gala-lahore-checklist',
    title: 'Producing a Corporate Gala in Lahore: The Complete Checklist',
    excerpt:
      'Launches, summits and award nights \u2014 a producer\u2019s field guide to venues, AV, guest flow and the details that make executives look brilliant.',
    category: 'Corporate',
    date: 'January 2025',
    publishedISO: '2025-01',
    readTime: '6 min read',
    image: '/media/portfolio-2.jpg',
    imageAlt: 'Dramatic corporate launch stage with golden LED screen in Lahore',
    blocks: [
      { p: 'A corporate event has one job: make the organisation look as good as its ambitions. That outcome is engineered weeks earlier \u2014 in run-of-show documents, redundancy plans and rehearsals. This is the checklist our production team runs for every gala in Lahore.' },
      { h: 'Venue and technical foundations' },
      { p: 'Ceiling height above 18 feet for any meaningful stage design. Independent power with UPS backup on the AV line \u2014 load-shedding does not care about your keynote. Dedicated VIP arrival separate from general guest flow. And acoustic treatment: Lahore\u2019s marble-heavy ballrooms echo mercilessly without it.' },
      { h: 'The run of show' },
      { p: 'Every minute scripted, every speech time-boxed, every walk-up cue rehearsed with the actual presenters. We build a minute-by-minute document shared with client, venue and crew \u2014 then rehearse the full sequence the afternoon before, twice.' },
      { h: 'Hospitality is the brand' },
      { p: 'Guests remember how smoothly they were received long after they forget the LED content. Trained hosting staff, colour-coded lanyards that actually work, chai service that never runs dry \u2014 hospitality is where Pakistani corporate events are won.' },
    ],
  },
  {
    slug: 'perfect-baraat-guide',
    title: 'The Perfect Baraat: Timing, Dhol and the Grand Entrance',
    excerpt:
      'The groom\u2019s procession is pure theatre \u2014 and theatre rewards direction. How we choreograph baraats that stop traffic and start tears.',
    category: 'Traditions',
    date: 'January 2025',
    publishedISO: '2025-01',
    readTime: '5 min read',
    image: '/media/gallery-6.jpg',
    imageAlt: 'Dhol drummers performing at a baraat celebration under golden confetti',
    blocks: [
      { p: 'No moment in a Pakistani wedding carries more raw emotion per minute than the baraat\u2019s arrival. It is also \u2014 ask any honest planner \u2014 the moment most likely to descend into forty minutes of parking chaos. The difference is direction.' },
      { h: 'Timing is nine-tenths of the drama' },
      { p: 'The procession should arrive after golden hour but before dinner impatience \u2014 in winter Lahore, that window is roughly 7:30 to 8:15 pm. We station a coordinator with the groom\u2019s convoy from the family home onward, feeding live timing back to the venue so the dhol, the petals and the bride\u2019s family line up to the minute.' },
      { h: 'Layer the sound' },
      { p: 'One dhol is noise; a directed ensemble is cinema. We open with a single distant drummer as the convoy turns in, layer the full troupe at the gate, then hand off to the sound system precisely as the groom crosses the threshold \u2014 a crescendo, not a collision.' },
      { h: 'Protect the entrance shot' },
      { p: 'The single most-rewatched clip of the entire shaadi is the couple\u2019s first walk. We choreograph a clean corridor, brief the family on where to stand, and give the film team a locked, lit lane. Thirty seconds of order buys a lifetime of rewatching.' },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

/**
 * Related posts, topic-matched by category first (same "Venues", "Design",
 * "Corporate" etc.), then filled with the most recent remaining posts.
 * Previously this was just "the first 3 other posts by array order" —
 * topic-matching makes internal linking meaningfully relevant instead of
 * arbitrary, for every post automatically (existing and future).
 */
export function getRelatedPosts(slug: string, limit = 3): Post[] {
  const current = getPost(slug);
  const others = posts.filter((p) => p.slug !== slug);
  if (!current) return others.slice(0, limit);

  const sameCategory = others.filter((p) => p.category === current.category);
  const rest = others.filter((p) => p.category !== current.category);
  return [...sameCategory, ...rest].slice(0, limit);
}
