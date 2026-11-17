export interface HeroContent {
  /** One entry per line; two lines at most. */
  title: string[];
  description: string;
  cta: { text: string; href: string };
  /** The agency's own footage, played as a muted loop. */
  video: string;
  fact: { value: string; label: string };
}
