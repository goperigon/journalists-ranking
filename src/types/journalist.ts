type Topic = {
  name: string;
  count: number;
};

type Source = {
  name: string;
  count: number;
};

type Category = {
  name: string;
  count: number;
};

type Label = {
  name: string;
  count: number;
};

type Country = {
  name: string;
  count: number;
};

export type Journalist = {
  id: string;
  name: string;
  title: string;
  locations: string[];
  topTopics: Topic[];
  topSources: Source[];
  topCategories: Category[];
  topLabels: Label[];
  topCountries: Country[];
  avgMonthlyPosts: number;
  twitterHandle: string;
  twitterBio: string;
  imageUrl: string;
  linkedinUrl: string;
  facebookUrl: string | null;
  instagramUrl: string;
  websiteUrl: string;
  blogUrl: string | null;
  tumblrUrl: string | null;
  youtubeUrl: string | null;
};
