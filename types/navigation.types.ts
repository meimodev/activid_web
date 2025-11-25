export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

export interface NavigationState {
  isOpen: boolean;
  activeSection: string;
}
