import wretch from "@/lib/wretch";
import { Article } from "@/types/article";
import {
  PerigonArticlesResponse,
  PerigonInternalResponse,
} from "@/types/perigonResponse";

export default {
  async getJournalistsByTopic(topic: string) {
    return wretch
      .get(`https://api.goperigon.com/v1/journalists?topic=${topic}&size=100`)
      .json();
  },

  async getSourcesByDomains(domains: string[], size = 100) {
    return wretch
      .get(
        `https://api.goperigon.com/v1/sources?domain=${domains.join(
          ", "
        )}&size=${size}`
      )
      .json();
  },

  async getSourceByDomain(domain: string) {
    return wretch
      .get(`https://api.goperigon.com/v1/sources?domain=${domain}`)
      .json();
  },

  async getAllTopics(): Promise<PerigonInternalResponse<Topic[]>> {
    return wretch
      .get("https://api.goperigon.com/v1/topics/all?size=1000")
      .json();
  },

  async getJournalistArticlesForTopic(
    journalistId: string,
    topic: string,
    from?: string,
    to?: string
  ): Promise<PerigonArticlesResponse> {
    return wretch
      .query({ journalistId, topic, from, to })
      .get(
        `https://api.goperigon.com/v1/all?journalistId=${journalistId}&topic=${topic}`
      )
      .json();
  },
};
