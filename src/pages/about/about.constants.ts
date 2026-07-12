import { AboutSection } from './about.models';

export const ABOUT_PAGE_TITLE = 'About Last Stop Brewing';

export const ABOUT_SECTION_SKELETON: AboutSection[] = [
  {
    id: 'brewery',
    title: 'The Brewery',
    subtitle: 'About the brewery',
    description:
      "Like many great ventures, Last Stop Brewing in Shelbyville, KY was founded by a group of passionate, like-minded individuals.\n\nThe journey began in 2007, when Jon, one of our founders, started home brewing as a hobby. After relocating from Colorado to Kentucky, Jon continued to refine his skills and deepen his knowledge of craft brewing. During the COVID-19 pandemic, he dedicated significant time to perfecting his recipes and techniques.\n\nIn the post-COVID era, Jon partnered with others to launch Oldham Brewing Company in Prospect, KY, utilizing a small selection of recipes to begin commercial production. However, they quickly encountered a common challenge: great beer brewed on a small system sells out fast. It became clear that growth required a larger brewing system and a new location.\n\nTo support the next phase of growth, we needed someone with strong business experience and operational knowledge - this is where Mike came in. With Mike joining the ownership team, he brought valuable insight into running and growing a business, helping position the brewery for its next chapter.\n\nSince then, Last Stop Brewing opened it's doors in Shelbyville, Kentucky on March 17th, 2024 and upgraded to a seven-barrel brewing system to support increased production and continued growth.\n\nShortly after opening our doors, the team brought on Hunter M. as General Manager. His hard work, dedication, and leadership quickly made him an integral part of the operation, ultimately earning him a place in the ownership group. He remains a vital part of the team and the brewery's continued success.",
    imageSrc: 'assets/about/brewery-20260701.png',
    imageAlt: 'Exterior placeholder illustration for the Last Stop Brewing building.',
    imageWidth: 736,
    imageHeight: 1413,
    order: 1,
  },
  {
    id: 'jon-owner',
    title: 'Jon',
    subtitle: 'Owner',
    description: 'Placeholder content for Jon, an owner.',
    imageSrc: 'assets/about/jon-owner-20260701.png',
    imageAlt: 'Portrait placeholder illustration for Jon, owner.',
    imageWidth: 1200,
    imageHeight: 800,
    order: 2,
  },
  {
    id: 'mike-owner',
    title: 'Mike',
    subtitle: 'Owner',
    description: 'Placeholder content for Mike, an owner.',
    imageSrc: 'assets/about/mike-owner-20260701.png',
    imageAlt: 'Portrait placeholder illustration for Mike, owner.',
    imageWidth: 1200,
    imageHeight: 800,
    order: 3,
  },
  {
    id: 'hunter-owner',
    title: 'Hunter',
    subtitle: 'Owner',
    description: 'Placeholder content for Hunter, an owner.',
    imageSrc: 'assets/about/hunter-owner.svg',
    imageAlt: 'Portrait placeholder illustration for Hunter, owner.',
    imageWidth: 1200,
    imageHeight: 800,
    order: 4,
  },
  {
    id: 'hunter-brewer',
    title: 'Hunter',
    subtitle: 'Brewer',
    description: 'Placeholder content for Hunter, brewer.',
    imageSrc: 'assets/about/hunter-brewer-20260701.png',
    imageAlt: 'Portrait placeholder illustration for Hunter, brewer.',
    imageWidth: 1200,
    imageHeight: 800,
    order: 5,
  },
];
