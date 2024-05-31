import wretch from "@/lib/wretch";

export default {
  async getJournalistsByTopic(topic: string) {
    return wretch
      .get(`https://api.goperigon.com/v1/journalists?topic=${topic}`)
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
};
