"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import perigonService from "@/services/perigonService"; // Make sure to adjust the path to your actual imp
import { useAppStore } from "../stores/appStore"; // Import the Zustand store
import { Journalist } from "@/types/journalist";
import { Source } from "@/types/source";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { JournalistsReachChart } from "@/components/JournalistsReachChart";
import { Input } from "@/components/ui/input";
import { FilterJournalists } from "@/components/FilterJournalists";
import { JournalistsList } from "@/components/JournalistsList";

export default function Home() {
  // Zustand store state and actions
  const {
    topic,
    isLoading,
    isNoJournalistsFound,
    error,
    journalistSources,
    setTopic,
    setIsLoading,
    setIsNoJournalistsFound,
    setError,
    setJournalistSources,
  } = useAppStore();

  const formSchema = z.object({
    topic: z.string().min(2, {
      message: "Topic must be at least 2 characters.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsNoJournalistsFound(false);
      setJournalistSources([]);
      setIsLoading(true);
      setError(null);
      setTopic(values.topic);
      const journalists: any = await perigonService.getJournalistsByTopic(
        values.topic
      );
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
            typeof targetSource.monthlyVisits === "number"
              ? targetSource.monthlyVisits
              : 0;

          offset += 1;
        });

        tempJournalistSources.push({ journalist, sources: tempSources, reach });
      }

      if (!tempJournalistSources || tempJournalistSources.length === 0) {
        setIsNoJournalistsFound(true);
      } else {
        setJournalistSources(tempJournalistSources);
      }

      setIsLoading(false);
    } catch (err) {
      console.log("Here: ", err);
      setIsLoading(false);
      setError(
        "Unexpected error occurred! Please make sure you have a valid Perigon API Key"
      );
    }
  }

  const isReady = !isLoading && !error && !isNoJournalistsFound;

  return (
    <main className="flex flex-col items-center justify-between p-4 pb-10">
      <h1 className="font-bold text-4xl mb-10">Journalists Ranking</h1>
      <section className="flex flex-col w-2/3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter topic name to rank journalists
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button type="submit">
                Search{" "}
                {isLoading && <LoadingSpinner size={14} className="ml-1" />}
              </Button>
            </div>
          </form>
        </Form>
        {/* <FilterJournalists /> */}
        <div className="flex flex-col mt-10">
          {!isLoading && !error && isNoJournalistsFound && (
            <p className="text-lg font-semibold text-center text-red-500">
              No Journalists Found. Please adjust your search!
            </p>
          )}
          {!isLoading && error && (
            <p className="text-lg font-semibold text-center text-red-500">
              {error}
            </p>
          )}
          {!isLoading && journalistSources.length > 0 && (
            <JournalistsReachChart journalistSources={journalistSources} />
          )}
        </div>
        {isReady && <JournalistsList />}
      </section>
    </main>
  );
}
