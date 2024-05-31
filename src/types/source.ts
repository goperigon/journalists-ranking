type Category = {
  name: string;
  count: number;
};

type Topic = {
  name: string;
  count: number;
};

type Country = {
  name: string;
  count: number;
};

type Label = {
  name: string;
  count: number;
};

type Logo = {
  url: string;
};

export type Source = {
  id: string;
  domain: string;
  name: string;
  altNames: string[];
  description: string;
  avgMonthlyPosts: number;
  paywall: string | null;
  location: string | null;
  topCategories: Category[];
  topTopics: Topic[];
  topCountries: Country[];
  topLabels: Label[];
  avgBiasRating: number | null;
  adFontesBiasRating: number | null;
  allSidesBiasRating: number | null;
  mbfcBiasRating: number | null;
  monthlyVisits: number;
  globalRank: number;
  logoLarge: string | null;
  logoFavIcon: Logo;
  logoSquare: string | null;
};
