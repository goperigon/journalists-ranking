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
    [journalistSource.articles]
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
            <span className="text-sm font-regular text-gray-400">
              (excluded)
            </span>
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="lg:px-10">
        <div className="flex items-center gap-x-1 flex-wrap">
          <span className="text-sm font-semibold">Articles:</span>
          {isNoSourceArticles && (
            <span className="text-sm text-gray-300">N/A</span>
          )}
          {sourceArticles.map((article, idx) => (
            <>
              <Link
                href={article.url}
                target="_blank"
                className="text-blue-400 hover:underline"
              >
                <span className="text-sm text-nowrap">{article.title}</span>
              </Link>
              <span className="text-gray-400 text-xs">•</span>
            </>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function TopSources(props: TopSourcesProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { journalistSource } = props;

  const sortedSourcesByMonthlyVisits = useMemo(
    () =>
      journalistSource.sources.sort(
        (a, b) => b.monthlyVisits - a.monthlyVisits
      ),
    [journalistSource.sources]
  );

  return (
    <div className="mt-2 mb-4">
      {sortedSourcesByMonthlyVisits.map((source, idx) => (
        <SourceCollapsible
          source={source}
          journalistSource={journalistSource}
          idx={idx}
        />
      ))}
    </div>
  );
}
