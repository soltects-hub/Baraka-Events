/**
 * The <title> tag for each blog post.
 *
 * A post's own `title` is its on-page headline (H1, cards, Article schema
 * headline) and is often a full sentence. Appending " — The Baraka Journal" to
 * it pushed 39 of the site's 53 title tags past the ~60 characters search
 * results show, cutting the useful words. These titles keep each post's topic
 * and place keywords and end with the brand, so the tag stays near 60
 * characters. The headline is deliberately unchanged. Like postService.ts, this
 * is an SEO decision kept outside posts.ts so post content is untouched.
 *
 * A post missing from this map falls back to "<title> — The Baraka Journal".
 */
export const postSeoTitles: Record<string, string> = {
  'how-to-choose-wedding-planner-lahore': 'How to Choose a Wedding Planner in Lahore | Baraka Events',
  'birthday-party-planning-lahore-guide': 'Birthday Party Planning in Lahore | Baraka Events',
  'event-planning-cost-budget-lahore': 'What Event Planning in Lahore Costs | Baraka Events',
  'outdoor-garden-wedding-lahore-guide': 'Outdoor Weddings in Lahore: Month and Setup | Baraka Events',
  'rukhsati-ceremony-planning-lahore': 'Rukhsati Ceremony Planning in Lahore | Baraka Events',
  'destination-multi-day-shaadi-lahore': 'Destination & Multi-Day Shaadi Planning | Baraka Events',
  'anniversary-celebration-ideas-lahore': 'Anniversary Parties and Mehfils in Lahore | Baraka Events',
  'aqeeqah-celebration-planning-lahore': 'Aqeeqah Celebration Planning in Lahore | Baraka Events',
  'farmhouse-wedding-raiwind-road-lahore': 'Farmhouse Weddings on Raiwind Road | Baraka Events',
  'how-to-choose-wedding-venue-lahore-guide': 'How to Choose a Wedding Venue in Lahore | Baraka Events',
  'luxury-event-catering-menu-lahore': 'Luxury Wedding Catering in Lahore | Baraka Events',
  'best-event-planner-lahore-baraka-events': 'Why Baraka Events Is the Best Event Planner in Lahore',
  'top-event-planner-lahore-checklist-2026': 'Event Planner in Lahore: 2026 Checklist | Baraka Events',
  'baraka-events-management-how-we-work': 'Inside Baraka Events Management: How We Run an Event',
  'baraka-events-corporate-events-lahore': 'Corporate Event Production in Lahore | Baraka Events',
  'baraka-events-venue-booking-guide': 'Baraka Events Venue Booking: How It Works',
  'baraka-events-decor-services-lahore': 'Wedding & Event Decor Services in Lahore | Baraka Events',
  'baraka-events-lahore-gulberg': 'Event Planner in Gulberg, Lahore | Baraka Events',
  'viral-pakistani-wedding-trends-2026': 'Pakistani Wedding Trends Going Viral in 2026 | Baraka Events',
  'destination-style-shaadi-lahore-trend': 'Destination-Style Shaadis in Lahore | Baraka Events',
  'micro-weddings-intimate-celebrations-pakistan': 'Micro-Weddings and Intimate Celebrations | Baraka Events',
  'top-wedding-venues-lahore-2025': 'Wedding Venues in Lahore by Area | Baraka Events',
  'mehndi-themes-lahore-loves': 'Seven Mehndi Themes Lahore Loves | Baraka Events',
  'luxury-shaadi-cost-lahore': 'Lahore Wedding Budget: Spend and Save | Baraka Events',
  'walima-decor-trends-2025': 'Walima Decor in 2025: Pastel to Mughal | Baraka Events',
  'corporate-gala-lahore-checklist': 'Corporate Gala in Lahore: Planning Checklist | Baraka Events',
  'perfect-baraat-guide': 'The Perfect Baraat: Timing, Dhol, Entrance | Baraka Events',
  'walima-reception-planning-guide': 'How to Plan a Walima Reception in Lahore | Baraka Events',
  'wedding-timeline-mehndi-to-walima': 'Wedding Timeline: Mehndi to Walima | Baraka Events',
};
