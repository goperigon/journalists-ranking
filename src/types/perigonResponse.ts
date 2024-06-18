import { Article } from "./article";

export interface PerigonResponse {
  results: any[];
  numResults: number;
  status: number;
}

export interface PerigonInternalResponse<T = any> {
  total: number;
  data: T;
}

export interface PerigonArticlesResponse {
  articles: Article[];
  numResults: number;
  status: number;
}
