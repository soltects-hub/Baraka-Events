/** The three "Signature Experiences" cards (StickyServices.tsx and the homepage). Image paths are as before; the homepage swaps any undocumented image for a verified one. */
export const experiences = [
  {
    index: '01',
    title: 'Weddings',
    tagline: 'Every function, one plan',
    description:
      'Mehndi, baraat, nikkah and walima planned as one production instead of four separate events. We handle venue selection, stage and floral design, catering coordination and guest logistics, so the story stays consistent from the first night to the last.',
    image: '/media/gallery/wedding-13.webp',
    imageAlt: 'Baraat lounge seating on a patterned carpet facing a stage of hanging chandeliers and greenery between red drapes',
    details: ['Mehndi · Baraat · Nikkah · Walima', 'Destination & Multi-Day Weddings', 'Stage, Floral & Lighting Design'],
  },
  {
    index: '02',
    title: 'Corporate Events',
    tagline: 'Built to run on schedule',
    description:
      "Product launches, executive summits and award nights for brands that cannot afford a technical delay. We handle stage design, AV, run-of-show timing and hospitality across Lahore's hotels, expo halls and private venues.",
    image: '/media/gallery/corporate-3.webp',
    imageAlt: 'Ballroom conference set-up with a lighting truss, LED stage screen, red carpet aisle and round tables',
    details: ['Launches, Summits & Award Nights', 'Stage Design & AV Production', 'Guest & Executive Hospitality'],
  },
  {
    index: '03',
    title: 'Private Celebrations',
    tagline: 'Sized to the guest list',
    description:
      'Birthdays, aqeeqahs, anniversaries and family mehfils, planned with the same attention whether it is fifteen guests or a hundred and fifty. A smaller guest list gets more design detail per guest, not less.',
    image: '/media/private-celebrations-dinner.webp',
    imageAlt: 'Long candlelit dining table in a timber pavilion, with white draped fabric overhead, string lights, a cream table runner and candles in glass holders on the floor',
    // portrait photo in a landscape frame: show the candlelit table and the string lights
    focus: '50% 42%',
    details: ['Milestone Birthdays & Anniversaries', 'Rooftop Dinners & Garden Mehfils', 'Private & Intimate Gatherings'],
  },
];
