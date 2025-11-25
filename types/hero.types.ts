export interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  cta: {
    primary: {
      text: string;
      href: string;
    };
    secondary?: {
      text: string;
      href: string;
    };
  };
  backgroundVideo?: string;
  gradientOrbs?: {
    count: number;
    colors: string[];
  };
}
