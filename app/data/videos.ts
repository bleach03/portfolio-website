export type VideoLink = { label: string; href: string };

export type VideoEntry = {
  title: string;
  desc: string;
  /** One or more links shown inline at the end of the entry. */
  links: VideoLink[];
};

// Swap each `#` for the real link when ready.
export const VIDEOS: VideoEntry[] = [
  {
    title: 'billboard web series',
    desc: 'a fun project me and my cofounder did with one camera in two nights.',
    links: [
      { label: 'ep. 5', href: 'https://youtu.be/LAR_eHFIo5Q' },
      { label: 'ep. 1', href: 'https://youtu.be/MyuVQJc6jIY' },
    ],
  },
  {
    title: 'opencampus launch',
    desc: 'launched opencampus and sold the vision.',
    links: [{ label: 'watch', href: 'https://youtu.be/Hl0mfUvOu-w' }],
  },
  {
    title: "my crush thinks i'm a boy",
    desc: 'a vertical drama i wrote for dramabox. over 25 million views.',
    links: [
      { label: 'pt. 1', href: 'https://youtube.com/shorts/ldjaXwLM1Ao' },
      { label: 'pt. 2', href: 'https://youtube.com/shorts/j4mtJTYKQvE' },
    ],
  },
];

export const MELIUS_NOTE = `dear melius,
i'd love to talk — i can deliver.`;
