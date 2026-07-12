export interface AboutSection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  order: number;
}

export interface AboutPageViewModel {
  title: string;
  sections: AboutSection[];
}
