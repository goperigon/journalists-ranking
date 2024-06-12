"use client";
import { cn } from "@/lib/utils";
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
import { useQueryState } from "nuqs";
import { withCachedTopics } from "@/lib/cachedTopics";

interface TopicFormProps<T extends z.ZodType> {}

export function TopicForm<T extends z.ZodType>(props: TopicFormProps<T>) {
  const [topicQueryState, setTopicQueryState] = useQueryState("topic");

  const isLoading = useAppStore((state) => state.isLoading);
  const isTopicsLoading = useAppStore((state) => state.isTopicsLoading);
  const isNoJournalistsFound = useAppStore(
    (state) => state.isNoJournalistsFound
  );
  const error = useAppStore((state) => state.error);
  const journalistSources = useAppStore((state) => state.journalistSources);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const setIsNoJournalistsFound = useAppStore(
    (state) => state.setIsNoJournalistsFound
  );
  const setError = useAppStore((state) => state.setError);
  const setJournalistSources = useAppStore(
    (state) => state.setJournalistSources
  );
  const setTopics = useAppStore((state) => state.setTopics);
  const topics = useAppStore((state) => state.topics);
  const setIsTopicsLoading = useAppStore((state) => state.setIsTopicsLoading);

  const formSchema = z.object({
    topic: z.string().min(2, {
      message: "Topic must be at least 2 characters.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: topicQueryState || "",
    },
  });

  const fetchAllTopics = async () => {
    setIsTopicsLoading(true);
    const topics = await withCachedTopics(perigonService.getAllTopics);
    console.log("Topics: ", topics);
    setIsTopicsLoading(false);
    if (topics) {
      // setCachedTopics(topicsResponse.data);
      return setTopics(topics);
    } else return [];
  };

  async function getJournalistsWithSources(topic: string) {
    setIsLoading(true);
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
        setIsNoJournalistsFound(true);
      } else {
        setJournalistSources(tempJournalistSources);
      }

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log("Error: ", err);
      setError(
        "Unexpected error occurred! Please make sure you have a valid Perigon API Key"
      );
    }
  }

  useEffect(() => {
    fetchAllTopics();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setTopicQueryState(values.topic);
    setIsNoJournalistsFound(false);
    setJournalistSources([]);
    setError(null);
    await getJournalistsWithSources(values.topic);
  }

  useEffect(() => {
    if (topicQueryState && topicQueryState.trim() !== "") {
      getJournalistsWithSources(topicQueryState);
      form.setValue("topic", topicQueryState);
    }
  }, [topicQueryState]);

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
