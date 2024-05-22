import type { Icons } from '@/components/icons';

export interface ILink {
  url: string;
  title?: string;
  icon: keyof typeof Icons;
}

export interface ILinksProps {
  links: ILink[];
  socials: ILink[];
}
