/**
 * Photographs used by the "Lights up" prototype.
 *
 * Only verified Baraka Events work: every file is from public/media/gallery (documented in GalleryPage.tsx as
 * celebrations shot on-site, not stock or AI-generated), plus the founder's portrait from the Team page.
 * Alt text is copied from GalleryPage.tsx so captions stay identical across the site.
 * Images whose origin is not documented (hero triptych, Before & After pair, menu and contact backgrounds,
 * showreel stills) are deliberately not used here until the owner confirms them.
 */
export interface Photo {
  src: string;
  /** 640px-wide variant, where one exists */
  small?: string;
  alt: string;
  w: number;
  h: number;
  tags: string[];
}

const g = (name: string, alt: string, w: number, h: number, tags: string[], small = true): Photo => ({
  src: `/media/gallery/${name}.webp`,
  small: small ? `/media/gallery/${name}-640.webp` : undefined,
  alt,
  w,
  h,
  tags,
});

export const photos = {
  mehndiFloor: g('wedding-30', 'Mehndi stage and checkerboard dance floor under hanging chandeliers and pink flower garlands', 1200, 902, ['Weddings', 'Mehndi']),
  walimaStage: g('wedding-24', 'Evening walima stage under a draped pink and white ceiling with a crystal chandelier and tall floral urns', 960, 1200, ['Weddings', 'Walima']),
  mehndiCeiling: g('wedding-17', 'Mehndi stage under a ceiling of blush flowers and crystal garlands, with pink drapes and a lotus-pattern lit floor', 1200, 1200, ['Weddings', 'Mehndi']),
  mehndiLanterns: g('wedding-21', 'Mehndi ceiling of hanging garlands and lanterns above a marigold stage wall, with floor cushions on a lit floor', 1200, 905, ['Weddings', 'Mehndi']),
  qawaliSeating: g('detail-4', 'Qawali night floor seating with sage-green bolsters, pink satin cushions and a flower hoop arch under chandeliers', 750, 929, ['Event Details']),
  walimaArch: g('wedding-1', 'Walima floral arch of white and blush roses under hanging bead garlands and crystal chandeliers', 1043, 1043, ['Weddings', 'Walima']),
  corporateHall: g('corporate-1', 'Corporate product showcase hall with red truss arches, a stage with LED screens and a red carpet', 1200, 900, ['Corporate']),
  corporateBallroom: g('corporate-3', 'Ballroom conference set-up with a lighting truss, LED stage screen, red carpet aisle and round tables in blue linen', 1200, 675, ['Corporate']),
  bachelorette: g('celebration-6', 'Bachelorette party backdrop with a sequin wall, neon sign, pink and silver balloons and copper tables', 1200, 1038, ['Birthdays']),
  baraatLounge: g('wedding-13', 'Baraat lounge seating on a patterned carpet facing a stage of hanging chandeliers and greenery between red drapes', 1200, 560, ['Weddings', 'Baraat']),
  baraatCanopy: g('wedding-9', 'Baraat lounge under a fairy-light canopy with crystal chandeliers, red velvet drapes and candlelit cabinets', 1200, 560, ['Weddings', 'Baraat']),
  corporateStage: g('corporate-4', 'Corporate celebration stage with a large LED screen, truss lighting and red balloon decor', 1200, 540, ['Corporate']),
  birthdayWall: g('celebration-4', 'Birthday backdrop of a white flower wall with a Happy Birthday neon sign and pink balloons', 960, 1200, ['Birthdays']),
  cateringCounter: g('detail-1', 'Catering counter with stacked colourful bowls on gold stands and hammered steel serving dishes', 675, 1200, ['Event Details'], false),
  founder: {
    src: '/media/team-bilal.webp',
    alt: 'Malik Bilal, CEO & Founder of Baraka Events', // same wording as LeadershipProfile.tsx
    w: 900,
    h: 1200,
    tags: ['Team'],
  } as Photo,
} satisfies Record<string, Photo>;

export function srcSet(p: Photo): string | undefined {
  return p.small ? `${p.small} 640w, ${p.src} ${p.w}w` : undefined;
}
