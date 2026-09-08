/**
 * Which service page each blog post should point back to.
 *
 * Service pages already link down into the blog (Service.relatedLinks), but
 * nothing pointed the other way: not one of the posts linked to any
 * /services/* page, so internal link equity only ever flowed away from the
 * commercial pages. This map closes the loop. It lives outside posts.ts on
 * purpose — the pairing is an SEO decision, not part of a post's content.
 *
 * A post is only listed when there is a genuinely matching service. Posts with
 * no clear match are left out rather than pointed somewhere loosely relevant.
 */
export const postServiceLinks: Record<string, string> = {
  // Weddings, end to end
  'top-wedding-venues-lahore-2025': 'wedding-planning',
  'how-to-choose-wedding-venue-lahore-guide': 'wedding-planning',
  'luxury-shaadi-cost-lahore': 'wedding-planning',
  'wedding-timeline-mehndi-to-walima': 'wedding-planning',
  'farmhouse-wedding-raiwind-road-lahore': 'wedding-planning',
  'destination-multi-day-shaadi-lahore': 'wedding-planning',
  'destination-style-shaadi-lahore-trend': 'wedding-planning',
  'micro-weddings-intimate-celebrations-pakistan': 'wedding-planning',
  'viral-pakistani-wedding-trends-2026': 'wedding-planning',
  'baraka-events-venue-booking-guide': 'wedding-planning',
  'outdoor-garden-wedding-lahore-guide': 'event-decoration',
  'event-planning-cost-budget-lahore': 'event-management',

  // Individual functions
  'mehndi-themes-lahore-loves': 'mehndi-events',
  'perfect-baraat-guide': 'barat-events',
  'rukhsati-ceremony-planning-lahore': 'barat-events',
  'walima-decor-trends-2025': 'walima-events',
  'walima-reception-planning-guide': 'walima-events',

  // Design & decor
  'baraka-events-decor-services-lahore': 'event-decoration',

  // Corporate
  'corporate-gala-lahore-checklist': 'corporate-events',
  'baraka-events-corporate-events-lahore': 'corporate-events',

  // Private celebrations
  'anniversary-celebration-ideas-lahore': 'birthday-events',
  'aqeeqah-celebration-planning-lahore': 'birthday-events',

  // Catering sits under full wedding planning — there is no catering service page
  'luxury-event-catering-menu-lahore': 'wedding-planning',

  // Company / positioning posts point at the hub-level services
  'best-event-planner-lahore-baraka-events': 'event-management',
  'top-event-planner-lahore-checklist-2026': 'event-management',
  'baraka-events-management-how-we-work': 'event-management',
  'baraka-events-lahore-gulberg': 'event-management',
};
