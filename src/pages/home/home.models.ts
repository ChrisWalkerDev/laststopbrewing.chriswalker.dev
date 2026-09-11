export interface HomeApp {
  id: string;
  label: string;
  route: string;
  icon: string;
  alt: string;
  iconType?: 'emoji' | 'image';
}

export interface HomeSocialLink {
  id: string;
  label: string;
  url: string;
  icon: string;
  iconType?: 'emoji' | 'image';
}
