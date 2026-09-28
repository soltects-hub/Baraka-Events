export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

// Single-leadership profile (2026-09-28): the site now features Malik Bilal
// only. Previous entries for Abdul Samad and Sania Khan have been removed
// at the client's request, not just hidden from display.
export const members: TeamMember[] = [
  {
    name: 'Malik Bilal',
    role: 'CEO & Founder',
    image: '/media/team-bilal.webp',
    bio: 'Founded Baraka Events and still reviews every production personally before it goes live, from stage layout to final vendor sign-off.',
  },
];
