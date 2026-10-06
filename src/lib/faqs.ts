export interface FaqLink {
  text: string;
  to: string;
}

export interface Faq {
  q: string;
  a: string;
  /**
   * Internal links rendered under the answer in the on-page accordion
   * (components/FAQ.tsx). Deliberately NOT part of the FAQPage JSON-LD, which
   * only mirrors q/a — links are navigation, not answer text.
   */
  related?: FaqLink[];
}

export const faqs: Faq[] = [
  {
    q: 'How early should I book a wedding planner in Lahore?',
    a: 'For a full multi-function wedding — mehndi, baraat, nikkah and walima — book 9 to 12 months ahead if you want your first choice of venue and date, especially in wedding season (October to March). For a single function or a smaller private event, 2 to 4 months is usually enough. If your date is closer than that, contact us anyway — we can often still make it work.',
    related: [
      { text: 'Wedding planning in Lahore', to: '/services/wedding-planning' },
      { text: 'Wedding timeline: mehndi to walima', to: '/blog/wedding-timeline-mehndi-to-walima' },
    ],
  },
  {
    q: 'Does Baraka Events handle complete wedding planning, or just one function?',
    a: 'Both. We plan full weddings end to end — mehndi, baraat, nikkah and walima as one coordinated event — or a single function on its own if that is what you need. Most families book us for the whole wedding because it keeps the design and vendors consistent across every night.',
    related: [
      { text: 'Mehndi night planning', to: '/services/mehndi-events' },
      { text: 'Baraat planning', to: '/services/barat-events' },
      { text: 'Nikkah ceremony planning', to: '/services/nikkah-events' },
      { text: 'Walima reception planning', to: '/services/walima-events' },
    ],
  },
  {
    q: 'Do you plan corporate events as well as weddings?',
    a: 'Yes. We produce product launches, conferences, AGMs, award dinners and smaller business events. The same team and production process apply — venue selection, stage and AV, run-of-show timing and on-site coordination.',
    related: [{ text: 'Corporate event management in Lahore', to: '/services/corporate-events' }],
  },
  {
    q: 'Do you handle event decoration and production, or only planning and coordination?',
    a: 'Both. We design the stage, florals and lighting in-house, and our own team handles the technical production — sound, AV and rigging. You are not being handed between a separate planner, decorator and production company.',
    related: [{ text: 'Event decoration in Lahore', to: '/services/event-decoration' }],
  },
  {
    q: 'What does an event management company in Lahore actually do?',
    a: 'Planning decides what the event will be; event management makes sure it happens that way on the day. In practice that means on-site coordination, a detailed run-of-show with timings and backup plans, supervision of every vendor and supplier, and a plan for when something goes wrong. At Baraka Events it covers weddings, corporate events and private celebrations, and it can sit on top of our full planning service or be booked on its own if your venue and vendors are already arranged.',
    related: [{ text: 'Event management in Lahore', to: '/services/event-management' }],
  },
  {
    q: 'Which areas of Lahore do you work in?',
    a: 'All of Lahore, including Gulberg, DHA, Model Town, Johar Town, Bahria Town, Cantt and the Walled City. Our office is in Gulberg III, and we regularly build for venues across every part of the city.',
    related: [{ text: 'Event planning services across Lahore', to: '/services' }],
  },
  {
    q: 'Can you manage vendors and event-day coordination if we already have a venue booked?',
    a: 'Yes. We can step in at any stage. If you already have a venue or caterer you like, we coordinate them into the production plan and handle the rest — decor, lighting, timing and on-the-day management — so you are not the one fielding vendor calls.',
    related: [{ text: 'Day-of event management and coordination', to: '/services/event-management' }],
  },
  {
    q: 'What does a typical Baraka Events production cost?',
    a: 'It depends entirely on guest count, venue and how many functions are involved, so we do not quote a single number here. After a short consultation, you get a line-item proposal broken down by venue, decor, catering, lighting and staffing, so you know exactly what you are paying for before committing.',
    related: [
      { text: 'What event planning in Lahore costs', to: '/blog/event-planning-cost-budget-lahore' },
      { text: 'Request a line-item proposal', to: '/contact' },
    ],
  },
  {
    q: 'How do I choose an event planner in Lahore?',
    a: 'Ask to see real work from events of the same type and size as yours, and ask who will actually be on site on the day, not just who runs the first meeting. Ask for a line-item proposal rather than a single package price, and find out whether decor, lighting and AV are handled by the planner itself or subcontracted. Then read recent Google reviews and meet the person who will coordinate your event before you commit. We have written a fuller buyer’s checklist that goes through these questions in more detail.',
    related: [
      { text: 'How to choose the best event planner in Lahore', to: '/blog/top-event-planner-lahore-checklist-2026' },
      { text: 'How to choose a wedding planner in Lahore', to: '/blog/how-to-choose-wedding-planner-lahore' },
    ],
  },
  {
    q: 'What makes Baraka Events different from other event planners in Lahore?',
    a: 'We are a design and production company, not just a booking service. Décor, lighting and technical production are handled in-house by our own team, with one coordinator staying with your event from the first meeting to the last guest leaving — instead of being passed between separate vendors.',
    related: [
      { text: 'About Baraka Events', to: '/about' },
      { text: 'See our work', to: '/portfolio' },
    ],
  },
];
