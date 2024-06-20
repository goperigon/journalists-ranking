"use client";
import { Article } from "@/types/article";
import { JournalistSource } from "@/types/journalistSource";
import { Collapsible } from "../ui/collapsible";
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { useMemo, useState } from "react";
import numeral from "numeral";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Source } from "@/types/source";
import Link from "next/link";
import { useAppStore } from "@/stores/appStore";
import { cn } from "@/lib/utils";

interface TopSourcesProps {
  journalistSource: JournalistSource & { articles: Article[] };
}

function SourceCollapsible(props: {
  source: Source;
  journalistSource: JournalistSource & { articles: Article[] };
  idx: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { source, journalistSource, idx } = props;

  const ignoreNoArticleSources = useAppStore(
    (state) => state.ignoreNoArticleSources
  );

  const sourceArticles = useMemo(
    () =>
      journalistSource.articles.filter(
        (article) => article.source.domain === source.domain
      ),
    [journalistSource.articles, source]
  );

  const isNoSourceArticles = !sourceArticles || sourceArticles.length === 0;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="cursor-pointer"
    >
      <CollapsibleTrigger className="flex items-center gap-x-1">
        <Button variant="ghost" size="sm" className="w-9 p-0">
          {!isOpen && <ChevronDown className="h-4 w-4" />}
          {isOpen && <ChevronUp className="h-4 w-4" />}
        </Button>
        <div className="flex gap-x-4 items-center" key={source.id || idx}>
          <a
            className="text-blue-400 hover:underline"
            href={`https://${source.domain}`}
            target="_blank"
          >
            <span className="text-sm lg:text-base font-normal">
              {source.name || source.domain || "(N/A)"}{" "}
              {source.name ? `(${source.domain})` : ""}
            </span>
          </a>
          <span className="text-sm lg:text-base font-bold">
            {numeral(source.monthlyVisits).format("0.0a")}
          </span>
          {ignoreNoArticleSources && isNoSourceArticles && (
            <span className="text-sm font-regular dark:text-gray-300 text-gray-500">
              (excluded)
            </span>
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="lg:px-10 text-wrap">
        <div>
          <span className="text-sm font-semibold mr-2">Articles:</span>
          {isNoSourceArticles && (
            <span className="text-sm dark:text-gray-300 text-gray-500">
              N/A
            </span>
          )}
          {sourceArticles.map((article, idx) => (
            <>
              <Link
                href={article.url}
                target="_blank"
                className="text-blue-400 hover:underline"
              >
                <span className="text-sm text-wrap">{article.title}</span>
              </Link>
              <span
                className={cn("text-gray-400 text-xs mx-1", {
                  hidden: idx === sourceArticles.length - 1,
                })}
              >
                •
              </span>
            </>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

const TOP_SOURCES_SORT: {
  [key: string]: {
    label: string;
    sort: (
      journalistSource: JournalistSource & { articles: Article[] }
    ) => JournalistSource["sources"];
  };
} = {
  Reach: {
    label: "Reach",
    sort: (journalistSource: JournalistSource & { articles: Article[] }) => {
      return journalistSource.sources.sort(
        (a, b) => b.monthlyVisits - a.monthlyVisits
      );
    },
  },
  Articles: {
    label: "Articles",
    sort: (journalistSource: JournalistSource & { articles: Article[] }) => {
      return journalistSource.sources.sort((a, b) => {
        const sourceArticlesA = journalistSource.articles.filter(
          (article) => article.source.domain === a.domain
        );

        const sourceArticlesB = journalistSource.articles.filter(
          (article) => article.source.domain === b.domain
        );

        return sourceArticlesB.length - sourceArticlesA.length;
      });
    },
  },
};

export function TopSources(props: TopSourcesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sortBy, setSortBy] = useState(TOP_SOURCES_SORT.Reach.label);

  const { journalistSource } = props;

  const sortedSources = useMemo(
    () => TOP_SOURCES_SORT[sortBy].sort(journalistSource),
    [journalistSource, sortBy]
  );

  function toggleSortBy(sortBy: string) {
    setSortBy(sortBy);
  }

  return (
    <div className="mb-4">
      <div className="flex items-center gap-x-1 mb-2">
        <span className="lg:text-lg font-semibold">Top Sources:</span>
        <div className="flex text-xs font-medium text-gray-400 dark:text-gray-400">
          {Object.values(TOP_SOURCES_SORT).map((item, idx) => (
            <span
              key={idx}
              className={cn(
                "px-2 border-r dark:divide-gray-600 last:border-r-0",
                { "text-black dark:text-gray-200": sortBy === item.label }
              )}
              onClick={toggleSortBy.bind(null, item.label)}
            >
              {item.label}
            </span>
          ))}
        </div>
      </div>
      {sortedSources.map((source, idx) => (
        <SourceCollapsible
          source={source}
          journalistSource={journalistSource}
          idx={idx}
          key={idx}
        />
      ))}
    </div>
  );
}
