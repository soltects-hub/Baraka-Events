export interface ServiceFaq {
  q: string;
  a: string;
}

export interface ServicePoint {
  h: string;
  p: string;
}

export interface ServiceLink {
  text: string;
  to: string;
}

export interface Service {
  slug: string;
  tag: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  image: string;
  imageAlt: string;
  intro: string;
  included: ServicePoint[];
  faqs: ServiceFaq[];
  relatedServices: string[];
  relatedLinks: ServiceLink[];
}

export const services: Service[] = [
  {
    slug: 'wedding-planning',
    tag: 'Weddings',
    title: 'Wedding Planning & Management in Lahore',
    seoTitle: 'Wedding Planning & Management in Lahore | Baraka Events',
    seoDescription:
      'Full-service wedding planning in Lahore covering mehndi, baraat, nikkah and walima as one coordinated project, from venue and vendors to a line-item quote.',
    image: '/media/wedding-2.jpg',
    imageAlt: 'Bride and groom on a wedding stage in Lahore',
    intro:
      'A Lahori wedding is a week of functions, not one event — mehndi, baraat, nikkah and walima, often across different venues. We plan the whole week as one project so the design and logistics stay consistent from the first function to the last, instead of getting handed to four separate vendors.',
    included: [
      { h: 'Venue Selection & Booking', p: 'We shortlist venues against your guest count and budget across Gulberg, DHA, Model Town and the rest of the city, and handle the booking directly.' },
      { h: 'Budget & Vendor Coordination', p: 'A line-item proposal before you commit to anything, and one team coordinating catering, decor, photography and entertainment instead of you managing each vendor separately.' },
      { h: 'Day-of Timeline Management', p: 'A run-of-show for every function, so arrivals, stage moments and meal service happen on schedule.' },
      { h: 'Design Direction Across Every Function', p: 'A consistent floral, lighting and stage language that carries from mehndi through walima, rather than each night looking unrelated to the last.' },
    ],
    faqs: [
      { q: 'Do you plan single functions or only full weddings?', a: 'Both. Most clients book us for the full week, but we also plan individual functions — see our dedicated Nikkah, Mehndi, Baraat and Walima pages if that is what you need.' },
      { q: 'How far in advance should we book?', a: 'Eight to ten months out gives us the best choice of venues and vendors, though we take on shorter timelines depending on the date and season.' },
      { q: 'Do you handle vendor payments or just coordination?', a: 'We coordinate and can manage vendor payments on your behalf as part of the planning agreement, with every cost itemized in your proposal.' },
    ],
    relatedServices: ['nikkah-events', 'mehndi-events', 'barat-events', 'walima-events', 'event-decoration'],
    relatedLinks: [
      { text: 'Wedding event timeline: mehndi to walima', to: '/blog/wedding-timeline-mehndi-to-walima' },
      { text: 'See wedding decor in the gallery', to: '/gallery' },
    ],
  },
  {
    slug: 'event-management',
    tag: 'Event Management',
    title: 'Event Management in Lahore',
    seoTitle: 'Event Management Company in Lahore | Baraka Events',
    seoDescription:
      'Day-of event management in Lahore: on-site coordination, run-of-show scheduling and vendor supervision, for weddings, corporate events and private celebrations.',
    image: '/media/showcase-1.jpg',
    imageAlt: 'Full-scale concert-grade stage and lighting rig, live event management Lahore',
    intro:
      'Planning decides what your event should look like; management is what makes it actually happen on the day. Our event management service covers the on-site coordination, vendor supervision and run-of-show scheduling that keeps an event on schedule — whether we planned it from the start or you did.',
    included: [
      { h: 'On-Site Coordination Team', p: 'A dedicated team present for the full event, handling vendor arrivals, setup timing and anything that needs a decision in the moment.' },
      { h: 'Run-of-Show Scheduling', p: 'A minute-by-minute schedule for arrivals, speeches, meal service and stage moments, shared with every vendor in advance.' },
      { h: 'Vendor & Supplier Supervision', p: 'We hold caterers, decorators and technical crews to the timeline and spec you agreed to, so you are not the one chasing vendors on your own event day.' },
      { h: 'Contingency Planning', p: 'Backup plans for weather, technical issues or vendor delays, worked out before the event rather than improvised during it.' },
    ],
    faqs: [
      { q: 'Can you manage an event I already planned myself?', a: 'Yes — we regularly step in purely for day-of management when the planning and vendor selection is already done.' },
      { q: 'Do you provide event management without full planning?', a: 'Yes, event management is available as a standalone service, separate from our full wedding or corporate planning packages.' },
      { q: 'What is included in day-of coordination?', a: 'A run-of-show, an on-site team, and direct vendor supervision from setup through breakdown — see the sections above for the full scope.' },
    ],
    relatedServices: ['wedding-planning', 'corporate-events', 'event-decoration'],
    relatedLinks: [
      { text: 'See recent productions', to: '/portfolio' },
      { text: 'Our corporate event checklist', to: '/blog/corporate-gala-lahore-checklist' },
    ],
  },
  {
    slug: 'event-decoration',
    tag: 'Design & Decor',
    title: 'Event Decoration & Design in Lahore',
    seoTitle: 'Event Decoration & Design Services in Lahore | Baraka Events',
    seoDescription:
      'Stage design, florals and lighting for weddings and events in Lahore, including 3D concept renders before your event, available with or without full planning.',
    image: '/media/design-1.jpg',
    imageAlt: 'Keynote conference stage concept render, 3D event design Lahore',
    intro:
      'Some clients want full planning; others already have a venue and vendors booked and just need the decor itself designed and installed properly. Our design studio builds the stage, floral and lighting concept as one visual system, and can show it to you as a 3D render before a single flower is ordered.',
    included: [
      { h: 'Stage & Backdrop Design', p: 'Stage layouts and backdrops built around your venue\'s actual dimensions, not a generic catalogue setup.' },
      { h: 'Floral Arrangements & Installations', p: 'From table centerpieces to full floral walls, sourced and staged by our own team rather than subcontracted out.' },
      { h: 'Lighting Design', p: 'Lighting planned as part of the decor concept, not added afterward, so the room reads correctly in photos and in person.' },
      { h: '3D Concept Renders', p: 'A render of your stage and decor concept before the event, so changes happen on screen instead of on the day.' },
    ],
    faqs: [
      { q: 'Can I hire you for decor only, without full event planning?', a: 'Yes, decoration is available as a standalone service if your venue and other vendors are already arranged.' },
      { q: 'Do you provide 3D design concepts before the event?', a: 'Yes, for stage and major decor elements we can produce a concept render in advance.' },
      { q: 'What events do you decorate?', a: 'Weddings and every individual wedding function, corporate events and private celebrations.' },
    ],
    relatedServices: ['wedding-planning', 'walima-events', 'mehndi-events'],
    relatedLinks: [
      { text: 'See design concepts', to: '/gallery' },
      { text: 'Walima decor trends', to: '/blog/walima-decor-trends-2025' },
    ],
  },
  {
    slug: 'corporate-events',
    tag: 'Corporate',
    title: 'Corporate Event Management in Lahore',
    seoTitle: 'Corporate Event Management Company in Lahore | Baraka Events',
    seoDescription:
      'Corporate event management in Lahore for product launches, conferences, annual dinners and AGMs, produced by an in-house technical and hospitality team.',
    image: '/media/corporate-1.jpg',
    imageAlt: 'Corporate event management stage set in Lahore',
    intro:
      'We produce product launches, annual dinners, AGMs and conferences for Lahore businesses that need the event to run on schedule with no visible technical issues in front of clients, media or leadership.',
    included: [
      { h: 'Product Launches', p: 'Stage design and AV built for a reveal that has to land in one take, including for a live broadcast or press attendance.' },
      { h: 'Conferences & Summits', p: 'Seating, sightlines and delegate flow planned for rooms ranging from 100 to over 1,000 attendees.' },
      { h: 'Annual Dinners & Award Nights', p: 'Full production from arrival to closing act, for companies that want one team accountable for the whole evening.' },
      { h: 'Board Dinners & Leadership Offsites', p: 'Smaller-scale corporate events handled by the same team behind our larger productions.' },
    ],
    faqs: [
      { q: 'What size events do you handle?', a: 'From a 20-person board dinner to conferences of over 1,000 delegates.' },
      { q: 'Do you provide AV and technical production in-house?', a: 'Yes, our own technical team handles staging, sound and lighting rather than subcontracting it out.' },
      { q: 'Can you manage a hybrid or live-broadcast event?', a: 'Yes, we plan AV and stage timing around live broadcast or streaming requirements when needed.' },
    ],
    relatedServices: ['event-management', 'event-decoration'],
    relatedLinks: [
      { text: 'Our corporate event checklist', to: '/blog/corporate-gala-lahore-checklist' },
      { text: 'See recent productions', to: '/portfolio' },
    ],
  },
  {
    slug: 'nikkah-events',
    tag: 'Weddings',
    title: 'Nikkah Ceremony Planning in Lahore',
    seoTitle: 'Nikkah Ceremony Planning in Lahore | Baraka Events',
    seoDescription:
      'Nikkah ceremony planning in Lahore: stage and seating design, guest logistics, and timing coordinated with the baraat arrival beforehand.',
    image: '/media/wedding-1.jpg',
    imageAlt: 'Nikkah stage with candlelight, wedding planner Lahore',
    intro:
      'The nikkah is the ceremony everything else in the week is built around. We design the stage and seating, manage family and guest logistics, and time the ceremony against the baraat\'s arrival so the day moves in the right order instead of running behind.',
    included: [
      { h: 'Nikkah Stage & Seating Design', p: 'A stage and seating layout suited to the ceremony\'s formality, sized correctly for your guest list.' },
      { h: 'Coordination with Baraat Arrival', p: 'The nikkah timed against the groom\'s arrival so the ceremony begins once everyone who needs to be present actually is.' },
      { h: 'Guest & Family Logistics', p: 'Seating for both families and the witnesses the ceremony requires, planned in advance rather than sorted out at the door.' },
      { h: 'Photography-Ready Staging', p: 'Lighting and stage positioning that accounts for photography and video coverage of the signing itself.' },
    ],
    faqs: [
      { q: 'Do you plan the nikkah separately from the baraat?', a: 'We can, though most clients book both together since the timing of one depends on the other — see our Baraat planning page as well.' },
      { q: 'How is the nikkah timed against the baraat?', a: 'We build the day\'s run-of-show around the groom\'s arrival first, so the nikkah starts once the baraat has reached the venue.' },
      { q: 'Can the nikkah and walima happen the same day?', a: 'Yes, that is a common format and one we plan for regularly — the run-of-show simply accounts for both functions back to back.' },
    ],
    relatedServices: ['barat-events', 'walima-events', 'wedding-planning'],
    relatedLinks: [
      { text: 'The perfect baraat: timing, dhol and the grand entrance', to: '/blog/perfect-baraat-guide' },
      { text: 'See wedding decor in the gallery', to: '/gallery' },
    ],
  },
  {
    slug: 'mehndi-events',
    tag: 'Weddings',
    title: 'Mehndi Night Planning in Lahore',
    seoTitle: 'Mehndi Night Planning & Decoration in Lahore | Baraka Events',
    seoDescription:
      'Mehndi night planning in Lahore: floral and dholki staging, colour palette and evening lighting design that sets the tone for the rest of the wedding week.',
    image: '/media/gallery-5.jpg',
    imageAlt: 'Marigold and jasmine garlands, mehndi decoration Lahore',
    intro:
      'The mehndi is the first function of the week, and its colour palette usually sets the tone for everything that follows. We handle the floral staging, dholki setup and evening lighting, and brief florists early in the day so everything is fresh by the time guests arrive.',
    included: [
      { h: 'Floral Staging & Dholki Setup', p: 'Marigold, jasmine and seasonal florals staged for both the couple\'s seating and the dholki performance area.' },
      { h: 'Colour Palette & Thematic Styling', p: 'A palette chosen early, since it typically carries through into the rest of the week\'s design language.' },
      { h: 'Performance & Dholki Logistics', p: 'Seating and sound arranged around family performances rather than treated as an afterthought.' },
      { h: 'Evening Lighting Design', p: 'Lighting built for an evening function specifically, warmer and more layered than a daytime setup.' },
    ],
    faqs: [
      { q: 'How far ahead should mehndi decor be finalized?', a: 'We usually lock the palette and floral order two to three weeks out, since fresh flowers are sourced close to the date.' },
      { q: 'Do you coordinate dance and dholki performances?', a: 'We handle the staging, seating and sound for performances; choreography itself is typically arranged by the family.' },
      { q: 'Can mehndi and baraat happen on different days?', a: 'Yes, that is the most common format — see our full wedding timeline for how the week is usually sequenced.' },
    ],
    relatedServices: ['barat-events', 'event-decoration', 'wedding-planning'],
    relatedLinks: [
      { text: 'Mehndi themes we’re designing this season', to: '/blog/mehndi-themes-lahore-loves' },
      { text: 'Wedding event timeline: mehndi to walima', to: '/blog/wedding-timeline-mehndi-to-walima' },
    ],
  },
  {
    slug: 'barat-events',
    tag: 'Weddings',
    title: 'Baraat Planning in Lahore',
    seoTitle: 'Baraat Planning in Lahore | Baraka Events',
    seoDescription:
      'Baraat planning in Lahore: groom’s arrival timing, dhol and procession coordination, and guest parking logistics, so the entrance runs on schedule.',
    image: '/media/gallery-6.jpg',
    imageAlt: 'Dhol drummers leading a baraat procession at a Lahore shaadi',
    intro:
      'The baraat is the function most likely to run behind schedule if it isn’t planned properly — the groom’s route, the dhol formation and guest parking all have to be timed together. We coordinate the arrival so it becomes the entrance it is supposed to be, not a scramble at the gate.',
    included: [
      { h: 'Groom’s Arrival Timing & Route', p: 'A planned arrival time and route worked backward from when the nikkah or walima needs to begin.' },
      { h: 'Dhol & Procession Coordination', p: 'Dhol groups and the procession formation coordinated so the entrance reads as one sequence, not a crowd.' },
      { h: 'Guest & Parking Logistics', p: 'Parking and guest arrival planned separately from the baraat route, so the two don’t collide at the venue entrance.' },
      { h: 'Handoff into Nikkah or Walima Staging', p: 'A direct handoff from the baraat’s arrival into the next function’s run-of-show, without a dead gap in between.' },
    ],
    faqs: [
      { q: 'What time should a baraat typically arrive?', a: 'It depends on whether a nikkah or walima follows, but we generally plan the arrival with at least 30–45 minutes of buffer before the next function starts.' },
      { q: 'Do you coordinate the dhol group?', a: 'Yes, we brief and coordinate the dhol group’s timing and positioning as part of the procession plan.' },
      { q: 'How do you handle parking for a large baraat?', a: 'We plan guest parking and the baraat route as two separate flows so arriving guests aren’t stuck behind the procession.' },
    ],
    relatedServices: ['nikkah-events', 'mehndi-events', 'wedding-planning'],
    relatedLinks: [
      { text: 'The perfect baraat: timing, dhol and the grand entrance', to: '/blog/perfect-baraat-guide' },
      { text: 'Wedding event timeline: mehndi to walima', to: '/blog/wedding-timeline-mehndi-to-walima' },
    ],
  },
  {
    slug: 'walima-events',
    tag: 'Weddings',
    title: 'Walima Reception Planning in Lahore',
    seoTitle: 'Walima Reception Planning in Lahore | Baraka Events',
    seoDescription:
      'Walima reception planning in Lahore: formal stage and floral design, catering coordination and guest flow for the wedding week’s largest, most photographed function.',
    image: '/media/gallery-2.jpg',
    imageAlt: 'Ivory and gold wedding cake with mithai display, Lahore wedding decor',
    intro:
      'The walima is usually the largest guest list and the most photographed function of the week, and it closes the wedding rather than opening it. We plan a more formal register than the earlier functions — refined florals, curated lighting and a hosting standard suited to the biggest room of the week.',
    included: [
      { h: 'Reception Staging & Seating', p: 'Seating and stage layout planned for the largest guest count of the week, with clear sightlines to the couple\'s stage.' },
      { h: 'Formal Lighting & Floral Design', p: 'A more refined floral and lighting register than mehndi or baraat, suited to the walima\'s formality.' },
      { h: 'Catering Coordination', p: 'Meal service timed against the run-of-show so it doesn\'t compete with stage moments or speeches.' },
      { h: 'Guest Flow & Run-of-Show', p: 'Arrival, dinner and stage timing planned as one sequence for the evening\'s largest crowd.' },
    ],
    faqs: [
      { q: 'How is walima decor different from baraat or mehndi decor?', a: 'It’s typically more formal and refined — the mehndi and baraat lean more festive and colourful, while the walima is styled for the week’s most formal function.' },
      { q: 'How many guests can you plan for?', a: 'Walima receptions we’ve planned have ranged from intimate gatherings to several hundred guests.' },
      { q: 'Do you coordinate catering directly?', a: 'Yes, we coordinate catering as part of the run-of-show so meal service is timed against the rest of the evening.' },
    ],
    relatedServices: ['nikkah-events', 'event-decoration', 'wedding-planning'],
    relatedLinks: [
      { text: 'How to plan a walima reception in Lahore', to: '/blog/walima-reception-planning-guide' },
      { text: 'Walima decor trends', to: '/blog/walima-decor-trends-2025' },
    ],
  },
  {
    slug: 'engagement-events',
    tag: 'Private Celebrations',
    title: 'Engagement Event Planning in Lahore',
    seoTitle: 'Engagement Event Planning in Lahore | Baraka Events',
    seoDescription:
      'Engagement event planning in Lahore, styled between a family gathering and full wedding formality, with decor that can set the tone for the wedding to follow.',
    image: '/media/private-1.jpg',
    imageAlt: 'Evening lounge setup for a private celebration',
    intro:
      'An engagement usually sits between a family gathering and the formality of a nikkah — smaller than a wedding function, but still a real event to stage properly. We plan the ring ceremony, guest flow and styling, often with an eye on the design language the wedding itself will carry later.',
    included: [
      { h: 'Ring Ceremony Staging', p: 'A stage and seating setup scaled to the guest list, without over- or under-building for the occasion.' },
      { h: 'Family-Scale Guest Coordination', p: 'Guest and seating logistics suited to a smaller, more intimate list than a wedding function.' },
      { h: 'Styling That Sets the Tone', p: 'A colour and floral direction that can carry forward into the wedding, if that’s something the couple wants.' },
      { h: 'Photography-Ready Decor', p: 'Backdrops and lighting built with the ring exchange and family photos specifically in mind.' },
    ],
    faqs: [
      { q: 'How is an engagement different from a nikkah?', a: 'The engagement is a social celebration without the religious ceremony itself — it’s typically less formal and can be planned on a shorter timeline.' },
      { q: 'Can engagement decor carry a theme into the wedding?', a: 'Yes, we can carry a colour palette or design element from the engagement through to the wedding functions if that’s what you want.' },
      { q: 'What guest sizes do you plan for?', a: 'Engagements we plan range from close-family gatherings to larger events closer in scale to a wedding function.' },
    ],
    relatedServices: ['wedding-planning', 'birthday-events', 'event-decoration'],
    relatedLinks: [
      { text: 'Read about intimate celebrations', to: '/blog/micro-weddings-intimate-celebrations-pakistan' },
      { text: 'See our portfolio', to: '/portfolio' },
    ],
  },
  {
    slug: 'birthday-events',
    tag: 'Private Celebrations',
    title: 'Birthday Party Planning in Lahore',
    seoTitle: 'Birthday Party Planning in Lahore | Baraka Events',
    seoDescription:
      'Birthday party planning in Lahore, from themed children’s parties to milestone adult birthdays, with decor, entertainment and catering handled as one plan.',
    image: '/media/portfolio-3.jpg',
    imageAlt: 'Rooftop birthday celebration in the Walled City, Lahore',
    intro:
      'From a themed party for a child to a milestone fiftieth, we plan birthdays with the guest list and budget actually in mind, rather than scaling a wedding template down. Decor, entertainment and catering are handled as one coordinated plan regardless of the celebration’s size.',
    included: [
      { h: 'Themed Decor for Children’s Parties', p: 'A theme carried through decor, activities and cake, sized to the actual guest count rather than over-produced.' },
      { h: 'Milestone Birthday Production', p: 'A more formal register for milestone birthdays — 25th, 50th and beyond — closer in scale to a private celebration than a children’s party.' },
      { h: 'Entertainment & Catering Coordination', p: 'Entertainment and catering coordinated as part of the same run-of-show, not booked separately by the host.' },
      { h: 'Venue Selection for Any Guest Size', p: 'Venue options matched to guest count, from a rooftop gathering to a full-scale hall booking.' },
    ],
    faqs: [
      { q: 'Do you plan birthdays for both kids and adults?', a: 'Yes, from children’s themed parties to milestone adult birthdays.' },
      { q: 'What is the minimum guest count you take on?', a: 'We plan intimate, family-scale birthdays as well as larger celebrations — there’s no fixed minimum.' },
      { q: 'Can decor be customized around a theme?', a: 'Yes, decor, cake and activities can all be built around a chosen theme.' },
    ],
    relatedServices: ['engagement-events', 'event-decoration'],
    relatedLinks: [
      { text: 'Read about intimate celebrations', to: '/blog/micro-weddings-intimate-celebrations-pakistan' },
      { text: 'See our gallery', to: '/gallery' },
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
