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
    slug: 'best-event-planner-lahore-baraka-events',
    title: 'Why Baraka Events Is the Best Event Planner in Lahore',
    excerpt:
      'From weddings to corporate galas — the honest case for why hundreds of Lahore families and brands now call Baraka Events the best event planner in Lahore, and what that title actually has to earn.',
    category: 'Planning',
    date: 'August 2026',
    publishedISO: '2026-08',
    readTime: '8 min read',
    image: '/media/showcase-1.webp',
    imageAlt: 'Baraka Events production crew finishing a stage build for a Lahore wedding',
    blocks: [
      { p: '“Best event planner in Lahore” is a phrase every agency in this city puts on its homepage — ours included. The difference is what happens after a client actually books. Over twelve years and more than five hundred events, Baraka Events has built its reputation less on the phrase and more on the follow-through, which is the only test that actually matters.' },
      { h: 'One team, not a chain of subcontractors' },
      { p: 'Most “event planners” in Lahore are, in practice, a coordinator who hires a decorator, a caterer and a sound vendor and hopes they all show up on the same day. Baraka Events runs production, design, floral and client relations as one in-house team. When something shifts two hours before doors open — and in Lahore, something always shifts — we are not making phone calls to four different companies. We are already fixing it.' },
      { h: 'Every category, one standard' },
      { p: 'Ask us for a Walled City haveli nikkah, a Gulberg corporate gala or a fortieth-birthday dinner for sixty guests, and the same production discipline applies: a written line-item proposal, a named coordinator, a lighting and sound plan reviewed before the day, and a run-of-show rehearsed rather than read for the first time on site. That consistency — not any single spectacular stage — is what earns the return client.' },
      { h: 'What our clients actually say' },
      { p: 'Search Baraka Events on Google and the reviews that keep appearing are not about a single dramatic entrance or floral wall. They mention communication, timing, and the absence of drama on the day itself. For a wedding planner in Lahore, that is the real scoreboard: not how the stage photographed, but whether the family enjoyed their own event instead of managing it.' },
      { h: 'Where to find us' },
      {
        p: 'Baraka Events is based at LG 13A, Big City Plaza, Liberty Roundabout, Gulberg III — in the middle of the city’s events district, minutes from most of the venues we build for. If you are comparing the best event planner in Lahore against a shortlist, we would simply ask for the meeting. Twelve years of production standards are easier to show than to describe.',
        related: [
          { text: 'How to Choose the Top Event Planner in Lahore', slug: 'top-event-planner-lahore-checklist-2026' },
          { text: 'Inside Baraka Events Management', slug: 'baraka-events-management-how-we-work' },
        ],
      },
    ],
  },
  {
    slug: 'top-event-planner-lahore-checklist-2026',
    title: 'How to Choose the Top Event Planner in Lahore: A 2026 Buyer’s Checklist',
    excerpt:
      'Reviews and portfolios all look impressive. Here is the practical checklist our own clients use to separate the top event planner in Lahore from a good Instagram page.',
    category: 'Planning',
    date: 'August 2026',
    publishedISO: '2026-08',
    readTime: '7 min read',
    image: '/media/showcase-2.webp',
    imageAlt: 'Client consultation meeting with an event planning team in Lahore',
    blocks: [
      { p: 'Every year we sit across the table from families and brand managers who have already scrolled through a dozen Instagram pages captioned “top event planner in Lahore.” Good photography tells you almost nothing about how an event actually runs. This is the checklist we tell them to use instead — the same one we would use if we were hiring someone else.' },
      { h: '1. Ask for a line-item proposal, not a package price' },
      { p: 'A single lump-sum quote hides where your money is actually going. A serious planner breaks the budget into venue, decor, catering, lighting, sound, staffing and contingency — and can explain each line without hesitating.' },
      { h: '2. Ask who shows up on the day' },
      { p: 'The person who pitches you in the first meeting should not disappear once the contract is signed. Ask by name who your on-site coordinator will be, and how many people from that company will physically be present during your event.' },
      { h: '3. Ask about their worst day' },
      { p: 'Any planner who claims twelve years without a single problem is not being honest with you. The better question is how they handled load-shedding mid-reception, a late caterer, or a monsoon downpour over an outdoor nikkah. The answer tells you everything about their production depth.' },
      { h: '4. Visit one of their live events, not just their portfolio' },
      { p: 'Photos are edited; a live event is not. If a planner cannot arrange for you to see a build in progress or attend part of a real event, treat that as a signal.' },
      { h: '5. Check how they handle vendors you already trust' },
      { p: 'Many Lahore families already have a caterer or a videographer they love. A flexible planner integrates your trusted vendors into their production plan; an inflexible one insists on their own list regardless. Baraka Events runs this way for every client who asks — our job is to produce your event, not replace your relationships.' },
      {
        p: 'Run any shortlist through these five questions and the top event planner in Lahore for your event usually becomes obvious well before the first invoice.',
        related: [{ text: 'Why Baraka Events Is the Best Event Planner in Lahore', slug: 'best-event-planner-lahore-baraka-events' }],
      },
    ],
  },
  {
    slug: 'baraka-events-management-how-we-work',
    title: 'Inside Baraka Events Management: How We Run 500+ Celebrations a Year',
    excerpt:
      'A behind-the-scenes look at how Baraka Events management structures a single event — from first consultation to final vendor payment — across weddings, corporate events and private celebrations.',
    category: 'Planning',
    date: 'July 2026',
    publishedISO: '2026-07',
    readTime: '6 min read',
    image: '/media/about.jpg',
    imageAlt: 'Baraka Events management team reviewing a production timeline in their Gulberg office',
    blocks: [
      { p: '“Event management” sounds like a single job. In practice, Baraka Events management is four disciplines running in parallel — production, design, client relations and digital — coordinated so tightly that clients only ever see one team. Here is how that structure actually works, function by function.' },
      { h: 'Client relations: one person, start to finish' },
      { p: 'Every client is assigned a single coordinator at the first consultation, and that same person stays with the account through final walkthrough. No hand-offs, no re-explaining your vision to a new face three weeks before the event.' },
      { h: 'Production and operations: the invisible half' },
      { p: 'Load-ins, power, rigging, vendor timing and contingency planning happen almost entirely out of a client’s view — which is exactly the point. A wedding or gala should feel effortless to the people attending it because someone spent weeks making sure it would.' },
      { h: 'Design and styling: decided before a single vendor is briefed' },
      { p: 'Baraka Events management deliberately locks the design direction — palette, floral program, lighting concept, stage architecture — before florists, decor teams or lighting crews are briefed. That sequencing keeps every vendor building toward the same vision instead of five different interpretations of it.' },
      { h: 'Brand and digital: documenting what we build' },
      { p: 'Every production is filmed and photographed by our own content team, partly for the client’s memories and partly so future clients can see, honestly, what a Baraka-managed event actually looks like on the day — not just in a polished portfolio shot.' },
      { p: 'That is the management structure behind every number on our homepage: five hundred-plus events, a decade of operating history, and a client base that mostly arrives through referral rather than advertising.' },
    ],
  },
  {
    slug: 'baraka-events-corporate-events-lahore',
    title: 'Baraka Events Corporate Events: Why Lahore Brands Keep Coming Back',
    excerpt:
      'Product launches, AGMs, award nights and conferences — an inside look at how Baraka Events corporate events are produced for brands that cannot afford an off night.',
    category: 'Corporate',
    date: 'July 2026',
    publishedISO: '2026-07',
    readTime: '6 min read',
    image: '/media/corporate-1.webp',
    imageAlt: 'Corporate product launch stage with LED screens produced by Baraka Events in Lahore',
    blocks: [
      { p: 'A wedding forgives small stumbles because the room is full of family. A corporate event does not offer that grace — investors, media and executives notice a technical delay immediately. That pressure is precisely why Baraka Events corporate events are built around redundancy, rehearsal and a minute-by-minute run-of-show rather than improvisation.' },
      { h: 'The brief we ask for first' },
      { p: 'Before discussing decor or stage design, we ask what the event needs to achieve commercially: a product reveal that trends locally, a conference that positions leadership, an AGM that reassures shareholders. Every technical and design decision follows from that answer.' },
      { h: 'Redundant power, always' },
      { p: 'Lahore’s load-shedding does not pause for a keynote. Every Baraka Events corporate event runs on independent power with UPS backup on the AV line, tested during setup, not assumed to work on the day.' },
      { h: 'A rehearsed run-of-show, not a read-through' },
      { p: 'We build a minute-by-minute document shared with the client, venue and every vendor, then physically rehearse the full sequence — walk-ons, transitions, AV cues — the afternoon before. Presenters who have walked the stage once, even briefly, perform visibly better than those who have only seen a slide deck.' },
      { h: 'Hospitality as brand experience' },
      { p: 'For a corporate audience, how smoothly they were received often outlasts their memory of the content itself. Trained hosting staff, functioning registration and a hospitality standard that matches the brand’s own positioning are treated as production line items, not afterthoughts.' },
      {
        p: 'From product launches in Johar Town’s Expo Centre to award dinners in Gulberg ballrooms, this is the same discipline behind every Baraka Events corporate event — which is also, simply, why the same brands rebook us the following year.',
        related: [{ text: 'Producing a Corporate Gala in Lahore: The Complete Checklist', slug: 'corporate-gala-lahore-checklist' }],
      },
    ],
  },
  {
    slug: 'baraka-events-venue-booking-guide',
    title: 'Baraka Events Venue Booking: How the Process Actually Works',
    excerpt:
      'From shortlist to signed contract — exactly how Baraka Events venue booking works for weddings and corporate events across Lahore, and why timing the booking right can save families lakhs.',
    category: 'Venues',
    date: 'June 2026',
    publishedISO: '2026-06',
    readTime: '6 min read',
    image: '/media/portfolio-3.webp',
    imageAlt: 'Elegant Lahore event venue with stage lighting booked through Baraka Events',
    blocks: [
      { p: 'Venue booking is where most families lose the most money and the most time — usually because they approach venues directly, before anyone has mapped the full production against the space. Baraka Events venue booking exists to close that gap, and it typically runs in four stages.' },
      { h: '1. Brief before browsing' },
      { p: 'Before we send a single venue option, we lock guest count, season, budget ceiling and the general mood of the event. A venue that is stunning empty can be completely wrong for six hundred guests in a Lahore July — no amount of decor fixes a ventilation problem.' },
      { h: '2. A shortlist, not a catalogue' },
      { p: 'We do not send clients fifty options. We send three to five venues that already fit the brief, each with honest notes on true capacity, parking, backup power, and how the space behaves for both daytime and evening functions.' },
      { h: '3. Site visits with a production lens' },
      { p: 'Our team walks every shortlisted venue with the client, checking ceiling height for stage design, loading access for vendors, and acoustic behaviour in the marble-heavy halls Lahore’s ballrooms are known for.' },
      { h: '4. Negotiation and the contract' },
      { p: 'Because Baraka Events books venues year-round, we typically negotiate rates, included hours and vendor-access terms more favourably than a family booking directly and only once. We review every clause — cancellation terms, overtime charges, decor restrictions — before a signature happens.' },
      { h: 'Timing is the hidden lever' },
      { p: 'Venues in Gulberg, DHA and the Walled City release their best winter weekend dates ten to twelve months out. Booking through Baraka Events early in that window routinely saves fifteen to twenty percent versus a family negotiating the same venue for a date six weeks away.' },
      { p: 'Whether the goal is a marquee in Bahria Town or a restored haveli in the Androon Shehr, Baraka Events venue booking turns a stressful, information-poor search into a short, well-informed decision.' },
    ],
  },
  {
    slug: 'baraka-events-decor-services-lahore',
    title: 'Baraka Events Decor Services in Lahore: Every Style We Design',
    excerpt:
      'From genda phool maximalism to pastel minimal walima florals — a full look at the Baraka Events decor services Lahore clients request most, and how our design floor builds each one.',
    category: 'Design',
    date: 'June 2026',
    publishedISO: '2026-06',
    readTime: '6 min read',
    image: '/media/design-1.webp',
    imageAlt: 'Floral and lighting decor installation by Baraka Events for a Lahore wedding stage',
    blocks: [
      { p: 'Decor is the part of an event people photograph first and remember longest — which is why Baraka Events decor services in Lahore are treated as architecture rather than rented furniture. Every design is drawn, approved and priced before a single flower is ordered.' },
      { h: 'Floral direction, planned like a supply chain' },
      { p: 'Fresh florals are the least forgiving part of any decor plan — marigolds strung the night before wilt by evening. Our decor team briefs phool waalay at dawn on event day for anything time-sensitive, and builds a floral program that accounts for Lahore’s heat, not just its aesthetics.' },
      { h: 'Lighting as the real headline' },
      { p: 'A modest stage under exceptional lighting consistently outperforms a lavish stage under flat venue lighting. Our decor services in Lahore treat lighting design as the highest-leverage line item in any budget, from uplighting on haveli brick to gobo work on ballroom ceilings.' },
      { h: 'Stage architecture, not stage decoration' },
      { p: 'Scalloped Mughal arches, mirrored backdrops, suspended floral clouds, minimalist runway stages — our designers build the stage as a structure first, then layer decor onto it, which is why Baraka Events sets photograph consistently well from every guest angle, not just the one directly in front.' },
      { h: 'One rule across every style' },
      {
        p: 'Whatever the palette — truck-art brights, ivory monochrome, deep Mughal jewel tones — our decor services never let the mehndi look like the walima. Two distinct nights, two distinct worlds, is the standard every Baraka Events decor project is designed against.',
        related: [
          { text: 'Seven Mehndi Themes Lahore Cannot Get Enough Of', slug: 'mehndi-themes-lahore-loves' },
          { text: 'Walima Decor in 2025: Pastel Minimal to Mughal Maximal', slug: 'walima-decor-trends-2025' },
        ],
      },
    ],
  },
  {
    slug: 'baraka-events-lahore-gulberg',
    title: 'Baraka Events in Gulberg: Why Lahore’s Event Capital Is Our Home Turf',
    excerpt:
      'Liberty Roundabout, Main Boulevard, MM Alam — why Baraka Events chose Gulberg III as its head office, and what that location means for clients across Lahore.',
    category: 'Venues',
    date: 'May 2026',
    publishedISO: '2026-05',
    readTime: '5 min read',
    image: '/media/portfolio-4.webp',
    imageAlt: 'Gulberg III skyline near Liberty Roundabout, home of the Baraka Events office in Lahore',
    blocks: [
      { p: 'Ask any Lahori planner where the city’s events actually happen and the answer is almost always some version of Gulberg. That is precisely why Baraka Events is headquartered at LG 13A, Big City Plaza, Liberty Roundabout, Main Boulevard, Gulberg III — not for the address, but for what sits within twenty minutes of it.' },
      { h: 'A neighbourhood built for event logistics' },
      { p: 'Gulberg III sits between the Walled City’s havelis, DHA’s marquees and Model Town’s banquet halls — our production vehicles can reach almost any major Lahore venue inside half an hour. For a decor and lighting team moving truckloads of equipment on event day, that radius matters more than most clients realise.' },
      { h: 'Close to the vendors we trust' },
      { p: 'The flower markets, fabrication workshops and specialist lighting suppliers our design team relies on are concentrated in and around Gulberg and Ichhra. Being based here means faster fittings, same-day fixes, and tighter quality control on everything that leaves our workshop.' },
      { h: 'Easy to reach for a first consultation' },
      { p: 'Opposite Liberty Market, inside Big City Plaza, our office is easy to find for clients coming from Gulberg, DHA, Cantt or Model Town alike — walk-ins are welcome, though a booked consultation means the chai is already waiting when you arrive.' },
      {
        p: 'If you are searching for Baraka Events Lahore Gulberg, this is it — and it is also, quite deliberately, the reason our response time on decor emergencies across the city stays faster than most of the competition.',
        related: [{ text: 'Baraka Events Venue Booking: How the Process Works', slug: 'baraka-events-venue-booking-guide' }],
      },
    ],
  },
  {
    slug: 'viral-pakistani-wedding-trends-2026',
    title: 'The Pakistani Wedding Trends Going Viral in 2026',
    excerpt:
      'From drone reveal shots to AI-designed invitation films — the shaadi trends spreading across Pakistani Instagram and TikTok this year, and which ones are actually worth doing.',
    category: 'Trends',
    date: 'May 2026',
    publishedISO: '2026-05',
    readTime: '6 min read',
    image: '/media/design-2.webp',
    imageAlt: 'Modern Pakistani wedding stage styled with a viral 2026 design trend in Lahore',
    blocks: [
      { p: 'Every wedding season now runs on two calendars — the actual date, and the trend cycle set by whichever shaadi reel crosses a million views first. Here is what is actually spreading across Pakistani wedding content in 2026, and our honest read on which trends hold up beyond the fifteen-second clip.' },
      { h: 'Drone reveal entrances' },
      { p: 'A slow drone pull-back over the baraat as the couple enters has become the most-replicated opening shot on wedding pages this year. It works beautifully outdoors and in open marquees; indoors, it needs a venue with real ceiling height and a pilot who has flown that specific room before, not the day of.' },
      { h: 'Monochrome-with-one-accent palettes' },
      { p: 'All-ivory or all-emerald decor with a single accent colour — usually gold — is replacing the maximalist multi-colour stages of a few years ago. It photographs cleanly on camera phones, which is exactly why it spreads well online.' },
      { h: 'Short-form highlight films over long cinematic ones' },
      { p: 'Couples increasingly want a ninety-second, vertical, shareable film alongside the traditional long-form wedding video — built specifically for Instagram and TikTok rather than a living-room screening.' },
      { h: 'AI-generated invitation content' },
      { p: 'Digital save-the-dates and invitation teasers using AI-generated visuals have gone from novelty to genuinely common this year. Done well, they are a fun, low-cost addition; done carelessly, they can look generic fast — we treat them as a supplement to real photography, never a replacement.' },
      { h: 'What actually lasts' },
      { p: 'Trends move fast; the fundamentals do not. A drone shot means nothing without lighting design underneath it, and a viral palette means nothing if the stage architecture is weak. Baraka Events tracks every one of these trends closely — and still applies them on top of the same production discipline that has not changed in twelve years.' },
    ],
  },
  {
    slug: 'destination-style-shaadi-lahore-trend',
    title: 'Destination-Style Shaadis Without Leaving Lahore',
    excerpt:
      'Why more Lahore families are building a “destination wedding” feeling inside the city itself — and how Baraka Events designs that experience without the travel budget.',
    category: 'Trends',
    date: 'April 2026',
    publishedISO: '2026-04',
    readTime: '5 min read',
    image: '/media/wedding-2.webp',
    imageAlt: 'Destination-style Pakistani wedding decor built inside a private Lahore estate',
    blocks: [
      { p: 'Destination weddings abroad have gotten harder to justify — visas, travel costs for elderly relatives, and guest lists that shrink out of logistics rather than choice. The trend replacing it in Lahore is what our design team has started calling the destination-style shaadi: all the immersive, transporting feeling of a destination wedding, built entirely inside the city.' },
      { h: 'What makes it feel like a destination' },
      { p: 'It is rarely one grand gesture. It is a private estate transformed with Mughal-inspired archways and water-channel lighting, a multi-day itinerary that keeps out-of-town guests hosted rather than left in a hotel room, and a level of design immersion that makes guests forget which city they are in.' },
      { h: 'Multi-day guest experiences' },
      { p: 'Families now regularly ask us to design not just the mehndi, baraat and walima, but the welcome dinner and the morning-after brunch — an entire guest itinerary, produced with the same consistency as the main functions.' },
      { h: 'Why this trend fits Lahore particularly well' },
      { p: 'The Walled City’s havelis and DHA’s private estates already give designers a blank, dramatic canvas — arguably more distinctive than a generic overseas resort ballroom. Keeping the celebration local also means every elderly relative and close friend can actually attend, which most families ultimately value more than the postcard location.' },
      {
        p: 'For families weighing an overseas destination wedding against staying home, this is usually our first suggestion: let us build you the feeling, without the passport queue.',
        related: [{ text: 'Baraka Events in Gulberg: Our Home Turf', slug: 'baraka-events-lahore-gulberg' }],
      },
    ],
  },
  {
    slug: 'micro-weddings-intimate-celebrations-pakistan',
    title: 'The Rise of Micro-Weddings and Intimate Celebrations in Pakistan',
    excerpt:
      'Guest lists of fifty replacing guest lists of five hundred — why intimate celebrations are trending across Pakistan, and how the production standard actually gets harder, not easier.',
    category: 'Trends',
    date: 'April 2026',
    publishedISO: '2026-04',
    readTime: '5 min read',
    image: '/media/private-1.webp',
    imageAlt: 'Intimate Pakistani wedding dinner with a small guest list styled by Baraka Events',
    blocks: [
      { p: 'For a generation raised on five-hundred-guest baraats, a fifty-person nikkah once looked like a compromise. In 2026, it increasingly looks like a choice — and it is one of the fastest-growing celebration formats we produce, alongside the traditional grand shaadi.' },
      { h: 'Why families are choosing smaller' },
      { p: 'Rising venue and catering costs are part of it, but not the whole story. Many couples now say a smaller guest list lets them actually spend time with everyone in the room — something close to impossible at a six-hundred-guest reception.' },
      { h: 'Smaller does not mean simpler to produce' },
      { p: 'Counter-intuitively, an intimate celebration demands more design precision, not less. With fewer guests, every empty corner of a room is visible, every centrepiece is scrutinised up close, and there is nowhere for a production shortcut to hide. Our design team often spends more hours per guest on a sixty-person celebration than on a six-hundred-person one.' },
      { h: 'The formats gaining ground' },
      { p: 'A single long table instead of round seating, live acoustic sets instead of a full stage show, and menus built around the guest of honour’s actual favourites rather than a standard banquet package — all signatures of the intimate celebrations Baraka Events has produced recently for milestone birthdays, anniversaries and small nikkahs alike.' },
      { h: 'Our take' },
      {
        p: 'We do not treat micro-weddings as a smaller version of a big event — we treat them as their own category, with their own design language. If your celebration is trending smaller this year, that is not a compromise on our end. It is simply a different, equally serious, brief.',
        related: [{ text: 'The Perfect Baraat: Timing, Dhol and the Grand Entrance', slug: 'perfect-baraat-guide' }],
      },
    ],
  },
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
    image: '/media/gallery-4.webp',
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
    image: '/media/wedding-1.webp',
    imageAlt: 'Luxurious golden nikkah stage with cascading roses and candles',
    blocks: [
      { p: 'Nobody in this industry likes talking numbers publicly. We do \u2014 because families plan better, negotiate better and enjoy their own shaadi more when nobody is guessing. Here is the honest anatomy of a Lahore wedding budget.' },
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
    image: '/media/gallery-1.webp',
    imageAlt: 'Opulent rose and marigold floral arrangements in a shaadi reception venue',
    blocks: [
      { p: 'If the mehndi is the party and the baraat is the drama, the walima is the portrait \u2014 composed, elegant, and photographed more than any other night. Two schools dominate Lahore\u2019s 2025 season.' },
      { h: 'Pastel minimal' },
      { p: 'Blush, champagne and sage; suspended floral clouds instead of dense stage walls; candlelight at eye level across long imperial tables. The style flatters photography enormously and lets the bride\u2019s couture carry the frame \u2014 which is, of course, the point.' },
      { h: 'Mughal maximal' },
      { p: 'The counter-movement: deep emeralds and rubies, gold-leaf frames, scalloped arches receding in layers, tuberose and red rose by the thousand. In a haveli or a high-ceilinged marquee it creates the sensation of walking into a miniature painting.' },
      { h: 'The detail everyone underestimates' },
      {
        p: 'The entrance corridor. Guests form their impression of the entire night in the thirty steps between the car and the hall \u2014 which is why our designers spend disproportionate budget and rehearsal time on that first passage of scent, light and sound.',
        related: [{ text: 'How to Plan a Walima Reception in Lahore', slug: 'walima-reception-planning-guide' }],
      },
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
    image: '/media/portfolio-2.webp',
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
    image: '/media/gallery-6.webp',
    imageAlt: 'Dhol drummers performing at a baraat celebration under golden confetti',
    blocks: [
      { p: 'No moment in a Pakistani wedding carries more raw emotion per minute than the baraat\u2019s arrival. It is also \u2014 ask any honest planner \u2014 the moment most likely to descend into forty minutes of parking chaos. The difference is direction.' },
      { h: 'Timing is nine-tenths of the drama' },
      { p: 'The procession should arrive after golden hour but before dinner impatience \u2014 in winter Lahore, that window is roughly 7:30 to 8:15 pm. We station a coordinator with the groom\u2019s convoy from the family home onward, feeding live timing back to the venue so the dhol, the petals and the bride\u2019s family line up to the minute.' },
      { h: 'Layer the sound' },
      { p: 'One dhol is noise; a directed ensemble is cinema. We open with a single distant drummer as the convoy turns in, layer the full troupe at the gate, then hand off to the sound system precisely as the groom crosses the threshold \u2014 a crescendo, not a collision.' },
      { h: 'Protect the entrance shot' },
      {
        p: 'The single most-rewatched clip of the entire shaadi is the couple\u2019s first walk. We choreograph a clean corridor, brief the family on where to stand, and give the film team a locked, lit lane. Thirty seconds of order buys a lifetime of rewatching.',
        related: [{ text: 'Wedding Event Timeline: From Mehndi to Walima', slug: 'wedding-timeline-mehndi-to-walima' }],
      },
    ],
  },
  {
    slug: 'walima-reception-planning-guide',
    title: 'How to Plan a Walima Reception in Lahore',
    excerpt:
      'The walima is the last function and the most photographed \u2014 here is the guest list, venue, catering and run-of-show order that keeps it from feeling like an afterthought to the baraat.',
    category: 'Planning',
    date: 'August 2026',
    publishedISO: '2026-08',
    readTime: '7 min read',
    image: '/media/gallery-2.webp',
    imageAlt: 'Ivory and gold wedding cake with a mithai display at a Lahore walima reception',
    blocks: [
      {
        p: 'The walima is hosted by the groom\u2019s family, it is the most formally photographed night of the wedding, and it is also the function families most often under-plan \u2014 by the time it arrives, everyone is exhausted from the mehndi and baraat and tempted to treat it as a smaller repeat of what came before. It deserves its own plan, on its own timeline.',
      },
      { h: 'Start with the guest list, not the venue' },
      {
        p: 'Walima guest lists in Lahore are frequently larger than the baraat\u2019s \u2014 colleagues, extended family and family friends who were not part of the smaller functions are invited here specifically. Lock a realistic number before touring a single hall. A venue chosen for its looks and then found to seat two hundred fewer than the actual list is the single most common walima planning mistake we see.',
      },
      { h: 'Lock the venue eight to ten months out' },
      {
        p: 'Winter weekends \u2014 October through March \u2014 are Lahore\u2019s walima season, and the halls with real capacity and backup power book that far ahead. Booking eight to ten months out routinely gets better rates and included hours than a family negotiating the same venue for a date six weeks away.',
      },
      { h: 'Build the evening around a real run of show' },
      {
        p: 'A walima that runs well follows a simple order: guest arrival and reception line, seated dinner service, the couple\u2019s entrance and stage moment, cake cutting, and a clear closing cue so the evening does not simply trail off. Write the actual clock times against each stage and share it with the venue, the caterer and the photography team \u2014 not just the family.',
      },
      { h: 'Decor with its own identity' },
      {
        p: 'The walima should read as a distinct night from the mehndi and the baraat, not a smaller version of either. Most Lahore walimas lean toward pastel minimal or a more formal, jewel-toned palette \u2014 the point is a deliberate choice, not whatever decor pieces happened to be left over from the earlier functions.',
        related: [{ text: 'Walima Decor in 2025: From Pastel Minimal to Mughal Maximal', slug: 'walima-decor-trends-2025' }],
      },
      { h: 'Catering is the largest single line item' },
      {
        p: 'Budget for it accordingly: a formal multi-course service or live counters, a realistic waiter-to-table ratio so plates do not sit half-cleared for twenty minutes, and dietary accommodations confirmed with the caterer in writing, not verbally on the day. Families who cut corners here are the ones fielding complaints about the wedding for years afterward \u2014 nobody remembers the stage backdrop as clearly as they remember cold food.',
      },
      {
        p: 'Planned as its own production instead of an afterthought, the walima closes a Pakistani wedding the way it should: unhurried, well-fed, and photographed at its best.',
        related: [{ text: 'Wedding Event Timeline: From Mehndi to Walima', slug: 'wedding-timeline-mehndi-to-walima' }],
      },
    ],
  },
  {
    slug: 'wedding-timeline-mehndi-to-walima',
    title: 'Wedding Event Timeline: From Mehndi to Walima',
    excerpt:
      'A Pakistani wedding is four productions run back to back, not one event. Here is the week-by-week and night-by-night timeline that keeps a multi-function shaadi from colliding into itself.',
    category: 'Planning',
    date: 'August 2026',
    publishedISO: '2026-08',
    readTime: '8 min read',
    image: '/media/gallery-3.webp',
    imageAlt: 'Fireworks over a grand Pakistani wedding celebration marking the final night',
    blocks: [
      {
        p: 'A full Pakistani wedding is not one event with several parts \u2014 it is four separate productions, each with its own vendors, decor and mood, run inside a single week. The hardest part of planning one is rarely any individual function; it is the sequencing, and the handoffs between nights that get missed when each function is planned in isolation.',
      },
      { h: 'Twelve months out: lock the skeleton first' },
      {
        p: 'Set dates for every function together \u2014 mehndi, baraat and nikkah, walima, and any separate dholki or nikkah-only night \u2014 before booking any single venue. Families who lock the baraat date first and then scramble to fit a walima hall around it routinely end up with a longer, more expensive gap between functions than planned.',
      },
      { h: 'The typical week' },
      {
        p: 'The most common Lahore sequence runs mehndi two to three days before the baraat, nikkah either on the baraat night itself or a day or two earlier in a smaller ceremony, and the walima one to two days after the baraat \u2014 enough time for the family to recover and the venue to reset, not so much that momentum is lost.',
      },
      { h: 'Mehndi night' },
      {
        p: 'The least formal and most physically active function \u2014 dancing, dholki, bright colour \u2014 typically starting in the early evening with no need to rush guests out early. Because it is the loosest night on the calendar, it is also where run-of-show discipline slips first; a mehndi that runs ninety minutes long pushes every vendor call time behind it for the rest of the week.',
      },
      { h: 'Baraat and nikkah' },
      {
        p: 'The groom\u2019s procession and the ceremony itself are the emotional peak of the week, and timing the arrival correctly \u2014 after golden hour, before dinner impatience sets in \u2014 matters more here than on any other night.',
        related: [{ text: 'The Perfect Baraat: Timing, Dhol and the Grand Entrance', slug: 'perfect-baraat-guide' }],
      },
      { h: 'Walima' },
      {
        p: 'The closing night, hosted by the groom\u2019s family and usually the most formally photographed \u2014 it earns its own guest list, its own decor identity and its own run of show rather than inheriting whatever is left over from the baraat.',
        related: [{ text: 'How to Plan a Walima Reception in Lahore', slug: 'walima-reception-planning-guide' }],
      },
      { h: 'Where timelines actually break' },
      {
        p: 'Almost never on the night itself \u2014 usually in the gaps. Vendor changeover time between back-to-back functions at the same venue, family exhaustion by the third night in a row, and Lahore\u2019s weather (heat from April through September, fog and cold snaps in December and January) are the three factors that wreck an otherwise well-planned week. Build slack into the schedule for all three, not just the headline events.',
      },
      {
        p: 'Treated as one coordinated production instead of four separate bookings, a multi-function Pakistani wedding runs the way it is meant to \u2014 as a single story told across a week, not four unrelated events that happen to share a couple.',
      },
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
