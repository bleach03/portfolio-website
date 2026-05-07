export type ProjectLink = { label: string; href: string };

export type Project = {
  slug: string;
  name: string;
  /** one-liner shown in `projects` list AND in the meta line of detail */
  desc: string;
  year?: string;
  /** longer paragraph(s) shown by `project [name]`. Supports inline
   *  markdown-style links: `[label](url)`. */
  body?: string;
  links?: ProjectLink[];
};

export const PROJECTS: Project[] = [
  {
    slug: 'opencampus',
    name: 'opencampus',
    desc: 'agent for college life',
    year: '2026',
    body: `lives in iMessage. signs you up for classes. connects you with
people. tells you what's for dinner, where the nearest vending
machine is. and a lot more.`,
    links: [{ label: 'opencampus.lol', href: 'https://opencampus.lol' }],
  },
  {
    slug: 'keyless',
    name: 'keyless',
    desc: 'ai video overlays for founders',
    year: '2026',
    body: `ai video overlay tool for founders making content about their
product.`,
    links: [{ label: 'keyless.fit', href: 'https://keyless.fit' }],
  },
  {
    slug: 'raise',
    name: 'raise',
    desc: 'campus event aggregator',
    year: '2025',
    body: `scrapes 400+ club instagrams, uses ai to verify each event and
structure the output as json so the full-stack platform can
serve it.`,
    links: [{ label: 'raisetix.com', href: 'https://raisetix.com' }],
  },
  {
    slug: 'screenwriting',
    name: 'screenwriting',
    desc: 'vertical drama scripts. 10m+ views.',
    year: '2025',
    body: `over 10m views on scripts i've written for vertical drama
platforms — reelshort, dramabox, and microco.`,
  },
  {
    slug: 'bleach',
    name: 'bleach',
    desc: 'hyperpop artist project. 500k+ streams.',
    year: '2024',
    body: `over 500k streams across catalog. notable collabs include [glaive](https://www.instagram.com/1glaive/).`,
    links: [
      {
        label: 'spotify',
        href: 'https://open.spotify.com/artist/3lQ7lf6EHZzz2EhFBhVdtp?si=2kweQvR8StiLQr-PjG9_Pg',
      },
    ],
  },
];
