import { AboutSection } from './about.models';

export const ABOUT_PAGE_TITLE = 'About Last Stop Brewing';

export const ABOUT_SECTION_SKELETON: AboutSection[] = [
  {
    id: 'brewery',
    title: 'The Brewery',
    subtitle: 'About the brewery',
    description:
      'Last Stop Brewing is a Shelbyville, Kentucky brewery built by a group of passionate, like-minded people. We opened our doors on March 17, 2024, with a seven-barrel brewing system and room to keep growing.',
    imageSrc: 'assets/about/brewery-20260701.png',
    imageAlt: 'Exterior placeholder illustration for the Last Stop Brewing building.',
    imageWidth: 736,
    imageHeight: 1413,
    order: 1,
  },
  {
    id: 'jon-owner',
    title: 'Jon Fee',
    subtitle: 'Owner',
    description:
      'Jon Fee began home brewing in 2007. After moving from Colorado to Kentucky, he kept refining his craft and, during the COVID-19 pandemic, devoted time to perfecting his recipes and techniques. In the post-COVID years, he helped launch Oldham Brewing Company in Prospect, Kentucky, bringing a small collection of recipes to commercial production. He went on to start Last Stop Brewing in Shelbyville.',
    imageSrc: 'assets/about/jon-owner-20260701.png',
    imageAlt: 'Portrait placeholder illustration for Jon Fee, owner.',
    imageWidth: 1200,
    imageHeight: 800,
    order: 2,
  },
  {
    id: 'mike-owner',
    title: 'Mike Sims',
    subtitle: 'Owner',
    description:
      'As demand for great beer outgrew a small brewing system, the team needed a larger system, a new home, and strong operational experience. Mike Sims joined the ownership team with valuable business insight that helped position the brewery for its next chapter.',
    imageSrc: 'assets/about/mike-owner-20260701.png',
    imageAlt: 'Portrait placeholder illustration for Mike Sims, owner.',
    imageWidth: 1200,
    imageHeight: 800,
    order: 3,
  },
  {
    id: 'hunter-owner',
    title: 'Hunter Monarch',
    subtitle: 'Owner',
    description:
      'Hunter Monarch joined the team soon after Last Stop Brewing opened as General Manager. His hard work, dedication, and leadership quickly made him integral to the operation and earned him a place in the ownership group.',
    imageSrc: 'assets/about/hunter-owner-20260831.png',
    imageAlt: 'Portrait of Hunter Monarch, owner of Last Stop Brewing.',
    imageWidth: 1254,
    imageHeight: 1254,
    order: 4,
  },
  {
    id: 'hunter-brewer',
    title: 'Hunter Freeman',
    subtitle: 'Brewer',
    description:
      'Hunter Freeman joined Last Stop Brewing as a bartender and soon showed the team his skill as a home brewer. That talent and dedication led him to become our head brewer.',
    imageSrc: 'assets/about/hunter-brewer-20260701.png',
    imageAlt: 'Portrait placeholder illustration for Hunter Freeman, brewer.',
    imageWidth: 1200,
    imageHeight: 800,
    order: 5,
  },
];
