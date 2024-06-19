"use client";
import { calculateJournalistReach, cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { LoadingSpinner } from "../LoadingSpinner";
import { useForm } from "react-hook-form";
import perigonService from "@/services/perigonService";
import { z } from "zod";
import { useAppStore } from "@/stores/appStore";
import { useEffect } from "react";
import { Journalist } from "@/types/journalist";
import { Source } from "@/types/source";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryState, parseAsBoolean } from "nuqs";
import { withCachedTopics } from "@/lib/cachedTopics";
import app from "@/config/app";
import { JournalistSource } from "@/types/journalistSource";
import { filterJournalistsByArticles } from "@/lib/filters";
import { Article } from "@/types/article";
import { Checkbox } from "../ui/checkbox";

interface TopicFormProps<T extends z.ZodType> {}

export function TopicForm<T extends z.ZodType>(props: TopicFormProps<T>) {
  const [topicQueryState, setTopicQueryState] = useQueryState("topic");
  const [lastPostPeriodQueryState, setLastPostPeriodQueryState] =
    useQueryState("lastPost");
  const [ignoreNoArticleSourcesQuery, setIgnoreNoArticleSourcesQuery] =
    useQueryState("ignoreNoArticleSources", parseAsBoolean);

  const isLoading = useAppStore((state) => state.isLoading);
  const isTopicsLoading = useAppStore((state) => state.isTopicsLoading);
  const isNoJournalistsFound = useAppStore(
    (state) => state.isNoJournalistsFound
  );
  const error = useAppStore((state) => state.error);
  const journalistSourcesWithArticles = useAppStore(
    (state) => state.journalistSourcesWithArticles
  );
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const setIsNoJournalistsFound = useAppStore(
    (state) => state.setIsNoJournalistsFound
  );
  const setError = useAppStore((state) => state.setError);
  const setJournalistSourcesWithArticles = useAppStore(
    (state) => state.setJournalistSourcesWithArticles
  );
  const setTopics = useAppStore((state) => state.setTopics);
  const topics = useAppStore((state) => state.topics);
  const setIsTopicsLoading = useAppStore((state) => state.setIsTopicsLoading);
  const setIgnoreNoArticleSources = useAppStore(
    (state) => state.setIgnoreNoArticleSources
  );

  const formSchema = z.object({
    topic: z.string().min(2, {
      message: "Topic must be at least 2 characters.",
    }),
    lastPostPeriod: z.string(),
    ignoreNoArticleSources: z.boolean(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: topicQueryState || "",
      lastPostPeriod:
        lastPostPeriodQueryState || app.lastPostFilterValues[0].label,
      ignoreNoArticleSources: ignoreNoArticleSourcesQuery || false,
    },
  });

  const fetchAllTopics = async () => {
    setIsTopicsLoading(true);
    const topics = await withCachedTopics(perigonService.getAllTopics);
    console.log("Topics: ", topics);
    setIsTopicsLoading(false);
    if (topics) {
      return setTopics(topics);
    } else return [];
  };

  async function getJournalistsWithSources(topic: string) {
    try {
      const journalists: any = await perigonService.getJournalistsByTopic(
        topic
      );
      console.log("Journalists for topic: ", journalists);
      const allJournalists: Journalist[] = journalists.results;

      const fetchSourcesPromises: Array<Promise<unknown>> = [];

      for (const journalist of allJournalists) {
        const topSources = journalist.topSources;
        topSources.forEach((source) => {
          const fetchSourcePromise = perigonService.getSourceByDomain(
            source.name
          );
          fetchSourcesPromises.push(fetchSourcePromise);
        });
      }

      const sources: any = await Promise.all(fetchSourcesPromises);
      const allSources: Source[] = sources.map((item: any) => item.results[0]);

      const tempJournalistSources: Array<{
        journalist: Journalist;
        sources: Source[];
        reach: number;
      }> = [];

      let offset = 0;
      for (const journalist of allJournalists) {
        const topSources = journalist.topSources;
        const tempSources: Source[] = [];
        let reach = 0;
        topSources.forEach((source) => {
          const targetSource = allSources[offset];

          tempSources.push(targetSource);
          reach +=
            typeof targetSource?.monthlyVisits === "number"
              ? targetSource.monthlyVisits
              : 0;

          offset += 1;
        });

        tempJournalistSources.push({
          journalist,
          sources: tempSources,
          reach,
        });
      }

      if (!tempJournalistSources || tempJournalistSources.length === 0) {
        // setIsNoJournalistsFound(true);
        return null;
      } else {
        // setJournalistSourcesWithArticles(tempJournalistSources);
        return tempJournalistSources;
      }
    } catch (err) {
      console.log("Error: ", err);
      setError(
        "Unexpected error occurred! Please make sure you have a valid Perigon API Key"
      );
      return null;
    }
  }

  async function fetchJournalistsArticles(
    topic: string,
    lastPostPeriod: string,
    journalistSources: JournalistSource[]
  ): Promise<Array<JournalistSource & { articles: Article[] }> | null> {
    const promises = [];
    for (const journalistSource of journalistSources) {
      const period = app.lastPostFilterValues.find(
        (item) => item.label === lastPostPeriod
      )?.period;

      const journalistPromise = perigonService.getJournalistArticlesForTopic(
        journalistSource.journalist.id,
        topic,
        period?.from,
        period?.to
      );
      promises.push(journalistPromise.then((value) => value.articles));
    }

    const results = await Promise.all(promises);

    let journalistSourcesWithArticles = null;

    for (const [idx, journalistSource] of journalistSources.entries()) {
      const journalistArticles = results[idx];
    }

    journalistSourcesWithArticles = filterJournalistsByArticles(
      journalistSources,
      results
    );
    return journalistSourcesWithArticles;
  }

  useEffect(() => {
    fetchAllTopics();
  }, []);

  async function fetchAllData(
    topic: string,
    lastPostPeriod: string,
    ignoreNoArticleSources: boolean
  ) {
    setIsLoading(true);
    setIgnoreNoArticleSources(ignoreNoArticleSources);

    const internalJournalistSources = await getJournalistsWithSources(topic);

    if (internalJournalistSources) {
      const internalJournalistSourcesWithArticles =
        await fetchJournalistsArticles(
          topic,
          lastPostPeriod,
          internalJournalistSources
        );

      if (internalJournalistSourcesWithArticles) {
        const journalistsWithReach = internalJournalistSourcesWithArticles.map(
          (item) => ({
            ...item,
            reach: calculateJournalistReach(item, ignoreNoArticleSources),
          })
        );

        setJournalistSourcesWithArticles(journalistsWithReach);
      } else setIsNoJournalistsFound(true);
    }

    setIsLoading(false);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setTopicQueryState(values.topic);
    setLastPostPeriodQueryState(values.lastPostPeriod);
    setIgnoreNoArticleSourcesQuery(values.ignoreNoArticleSources);
    setIgnoreNoArticleSources(values.ignoreNoArticleSources);
    setIsNoJournalistsFound(false);
    setJournalistSourcesWithArticles([]);
    setError(null);

    await fetchAllData(
      values.topic,
      values.lastPostPeriod,
      values.ignoreNoArticleSources
    );
  }

  useEffect(() => {
    if (topicQueryState && topicQueryState.trim() !== "") {
      fetchAllData(
        topicQueryState,
        lastPostPeriodQueryState ||
          (form.formState.defaultValues?.lastPostPeriod as string),
        ignoreNoArticleSourcesQuery || false
      );
      form.setValue("topic", topicQueryState);
      if (lastPostPeriodQueryState)
        form.setValue("lastPostPeriod", lastPostPeriodQueryState);
      if (ignoreNoArticleSourcesQuery !== null)
        form.setValue("ignoreNoArticleSources", ignoreNoArticleSourcesQuery);
    }
  }, [topicQueryState, lastPostPeriodQueryState, ignoreNoArticleSourcesQuery]);

  if (isTopicsLoading)
    return (
      <div className="flex gap-x-2 w-full justify-center">
        <LoadingSpinner />
        Loading...
      </div>
    );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full relative"
      >
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel>Topic</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? topics.find((topic) => topic.name === field.value)
                            ?.name
                        : "Select Topic"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-96! p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search topic..." />
                    <CommandList>
                      <CommandEmpty>No topic found.</CommandEmpty>
                      {topics && (
                        <CommandGroup>
                          {topics.map((topic) => (
                            <CommandItem
                              value={topic.name}
                              key={topic.name}
                              onSelect={() => {
                                form.setValue("topic", topic.name);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  topic.name === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {topic.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the topic that will be used for ranking.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastPostPeriod"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel>Last Post</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? app.lastPostFilterValues.find(
                            (lastPostFilter) =>
                              lastPostFilter.label === field.value
                          )?.label
                        : "Select Topic"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-96! p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search topic..." />
                    <CommandList>
                      <CommandEmpty>No date period found.</CommandEmpty>
                      {topics && (
                        <CommandGroup>
                          {app.lastPostFilterValues.map((lastPostFilter) => (
                            <CommandItem
                              value={lastPostFilter.label}
                              key={lastPostFilter.label}
                              onSelect={() => {
                                form.setValue(
                                  "lastPostPeriod",
                                  lastPostFilter.label
                                );
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  lastPostFilter.label === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {lastPostFilter.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the journalist&apos;s latest published post time (for
                the selected topic).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ignoreNoArticleSources"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={Boolean(field.value)}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Exclude sources with zero related articles on the selected
                  topic
                </FormLabel>
                <FormDescription>
                  This will exclude sources when calculating reach but will
                  still list the sources labeled as Articles: N/A
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Searching" : "Search"}{" "}
            {isLoading && <LoadingSpinner size={14} className="ml-1" />}
          </Button>
        </div>
      </form>
    </Form>
  );
}
