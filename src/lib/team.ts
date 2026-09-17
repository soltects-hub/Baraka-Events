export interface TeamMember {
  name: string;
  role: string;
  /** '' when no confirmed real photo exists yet — the carousel renders its
   *  existing dashed-border placeholder slot instead of inventing a face. */
  image: string;
  bio: string;
}

export const members: TeamMember[] = [
  {
    name: 'Malik Bilal',
    role: 'CEO & Founder',
    image: '/media/team-bilal.webp',
    bio: 'Founded Baraka Events and still reviews every production personally before it goes live, from stage layout to final vendor sign-off.',
  },
  {
    name: 'Abdul Samad',
    role: 'Marketing Team Head',
    image: '/media/team-samad.webp',
    bio: 'Runs Baraka’s brand and client communication, from the first inquiry response to how each event gets documented and shared afterward.',
  },
  {
    name: 'Sania Khan',
    role: 'Sales Director',
    image: '/media/team-sania.webp',
    bio: 'Leads the sales process from first inquiry to signed proposal, and negotiates scope and budget directly rather than routing it through someone else.',
  },
];
