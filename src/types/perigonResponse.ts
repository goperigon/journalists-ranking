export interface PerigonResponse {
  results: any[];
  numResults: number;
  status: number;
}

export interface PerigonInternalResponse<T = any> {
  total: number;
  data: T;
}
