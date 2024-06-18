export interface Article {
  url: string;
  authorsByline: string;
  articleId: string;
  clusterId: string;
  source: {
    domain: string;
    location: string | null;
  };
  imageUrl: string;
  country: string;
  language: string;
  pubDate: string;
  addDate: string;
  refreshDate: string;
  score: number;
  title: string;
  description: string;
  content: string;
  medium: string;
  links: string[];
  labels: any[]; // You may want to define a type/interface for this
  matchedAuthors: {
    id: string | null;
    name: string;
  }[];
  claim: string;
  verdict: string;
  keywords: {
    name: string;
    weight: number;
  }[];
  topics: any[]; // You may want to define a type/interface for this
  categories: any[]; // You may want to define a type/interface for this
  entities: {
    data: string;
    type: string;
    mentions: number;
  }[];
  companies: any[]; // You may want to define a type/interface for this
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  summary: string;
  translation: string;
  translatedTitle: string;
  translatedDescription: string;
  translatedSummary: string;
  locations: any[]; // You may want to define a type/interface for this
  reprint: boolean;
  reprintGroupId: string;
  places: any[]; // You may want to define a type/interface for this
  people: any[]; // You may want to define a type/interface for this
}
