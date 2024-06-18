import { Article } from "@/types/article";
import { JournalistSource } from "@/types/journalistSource";

export function filterJournalistsByArticles(
  journalistSources: JournalistSource[],
  journalistArticles: Article[][]
): Array<{ articles: Article[] } & JournalistSource> | null {
  if (!journalistArticles || typeof journalistArticles !== "object")
    return null;

  let journalistSourcesWithArticles: Array<
    { articles: Article[] } & JournalistSource
  > = journalistSources.map((journalistSource) => ({
    ...journalistSource,
    articles: [],
  }));

  for (const [idx, journalistSource] of journalistSources.entries()) {
    for (const journalistArticle of journalistArticles[idx]) {
      const matchedAuthor = journalistArticle.matchedAuthors.find(
        (author) => author.id === journalistSource.journalist.id
      );

      if (journalistSource.journalist.id === matchedAuthor?.id) {
        journalistSourcesWithArticles[idx].articles.push(journalistArticle);
      }
    }
  }

  return journalistSourcesWithArticles;
}

// export function compactJournalistSources(
//   journalistSourcesWithArticles: Array<
//     { articles: Article[] } & JournalistSource
//   >
// ): Array<{ articles: Article[] } & JournalistSource> {



// }