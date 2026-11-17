import { siteContent } from '@/lib/site-content';

export interface WorkTile {
  src: string;
  /** width / height, so the wall can lay itself out before the picture loads. */
  ratio: number;
  name: string;
  kind: string;
  href: string;
}

const { socialMedia, eventDocumentation, videoPodcast, websiteApp, productPhotography } = siteContent.servicePages;

// ponytail: ratios are set per kind of work, not read from each file. The three
// upright frames in the photography sets are the one exception; a new picture
// of another shape needs its ratio added here.
const UPRIGHT = /photo_(3|5)|photo_property_1/;

/** Every finished piece the site can show, in the order /work lists it. */
export const workTiles: WorkTile[] = [
  ...productPhotography.projects.flatMap(project =>
    (project.images ?? []).map(src => ({
      src,
      ratio: UPRIGHT.test(src) ? 2 / 3 : 3 / 2,
      name: project.client ?? '',
      kind: project.title ?? '',
      href: '/services/product-photography',
    })),
  ),
  ...socialMedia.showcases.map(showcase => ({
    src: showcase.image,
    ratio: 7 / 10,
    name: `${showcase.category} feed`,
    kind: 'Social media',
    href: '/services/social-media',
  })),
  ...eventDocumentation.projects.map(project => ({
    src: project.image ?? '',
    ratio: 16 / 9,
    name: project.title ?? '',
    kind: 'Event & documentation',
    href: '/services/event-documentation',
  })),
  {
    src: videoPodcast.mainProject.image,
    ratio: 16 / 9,
    name: videoPodcast.mainProject.title,
    kind: 'Podcast production',
    href: '/services/video-podcast',
  },
  ...websiteApp.mockups.map(src => ({
    src,
    ratio: 9 / 16,
    name: 'Mobile app',
    kind: 'Website & app',
    href: '/services/website-app',
  })),
];
