export interface HeroContent {
  /** A few words: it must fit two lines on a phone. */
  title: string;
  description: string;
  cta: { text: string; href: string };
  /** The agency's own footage, played as a muted loop. */
  video: string;
  fact: { value: string; label: string };
}
