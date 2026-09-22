export type ProjectLink = { label: string; href: string };

export type Project = {
  slug: string;
  name: string;
  category: 'projects' | 'creative';
  /** One-line project summary. */
  desc: string;
  year?: string;
  /** Longer project description. Supports inline
   *  markdown-style links: `[label](url)`. */
  body?: string;
  links?: ProjectLink[];
};

export const PROJECTS: Project[] = [
  {
    slug: 'opencampus',
    name: 'opencampus',
    category: 'projects',
    desc: 'agent for college life',
    year: '2026',
    body: `lives in iMessage. signs you up for classes. connects you with
people, tells you what's for dinner and where the nearest vending
machine is. >250 Columbia students using the app in 1 week`,
    links: [{ label: 'opencampus.lol', href: 'https://opencampus.lol' }],
  },
  {
    slug: 'screenwriting',
    name: 'screenwriting',
    category: 'creative',
    desc: 'vertical drama writer. 30m+ views.',
    year: '2025',
    body: `my crush thinks i'm a boy, DramaBox
strangers, a plane, and a deadly game, ATwist
point dume, ReelShort Creator Contest Winner ($8000)`,
  },
  {
    slug: 'bleach',
    name: 'bleach',
    category: 'creative',
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
