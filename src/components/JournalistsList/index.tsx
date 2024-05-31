import { useAppStore } from "@/stores/appStore";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import {
  ChevronsUpDown,
  Facebook,
  Globe2,
  Linkedin,
  Twitter,
  X,
} from "lucide-react";
import Link from "next/link";
import { Separator } from "../ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import numeral from "numeral";

export function JournalistsList() {
  const setJournalistSources = useAppStore(
    (state) => state.setJournalistSources
  );

  const journalistSources = useAppStore((state) => state.journalistSources);

  return (
    <section className="flex flex-col w-full">
      {/* <Collapsible open={true}> */}
      <div className="flex items-center justify-between space-x-4 px-4 mb-4">
        <h3 className="font-semibold text-xl">Journalists List</h3>
        {/* <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger> */}
      </div>
      {/* <CollapsibleContent className="w-full"> */}
      <ScrollArea className="h-72 rounded-md border w-full">
        <div className="flex flex-col p-4 w-full">
          {journalistSources.map((journalist) => (
            <>
              <div
                key={journalist.journalist.id}
                className="flex justify-between text-xl gap-x-4 w-full items-center"
              >
                <div className="flex items-center gap-x-7">
                  {journalist.journalist.imageUrl && (
                    <img
                      className="w-20 h-20"
                      src={journalist.journalist.imageUrl}
                    />
                  )}
                  <Link
                    href={journalist.journalist.websiteUrl || "#"}
                    className="hover:underline font-semibold"
                  >
                    {journalist.journalist.name}
                  </Link>
                  <span className="flex gap-x-2">
                    <Button size="icon" variant="outline" asChild>
                      <Link
                        href={`https://x.com/${journalist.journalist.twitterHandle}`}
                      >
                        <Twitter />
                      </Link>
                    </Button>
                    {journalist.journalist.linkedinUrl && (
                      <Button asChild size="icon" variant="outline">
                        <Link href={journalist.journalist.linkedinUrl}>
                          <Linkedin />
                        </Link>
                      </Button>
                    )}
                    {journalist.journalist.facebookUrl && (
                      <Button asChild size="icon" variant="outline">
                        <Link href={journalist.journalist.facebookUrl}>
                          <Facebook />
                        </Link>
                      </Button>
                    )}
                    {journalist.journalist.blogUrl && (
                      <Button asChild size="icon" variant="outline">
                        <Link href={journalist.journalist.blogUrl}>
                          <Globe2 />
                        </Link>
                      </Button>
                    )}
                  </span>
                </div>
                <div className="flex gap-x-2 font-semibold text-blue-500">
                  <p>Topic reach:</p>
                  <p>
                    {numeral(journalist.reach).format("0.0a").toUpperCase()}
                  </p>
                </div>
              </div>
              <Separator className="my-2" />
            </>
          ))}
        </div>
      </ScrollArea>
      {/* </CollapsibleContent> */}
      {/* </Collapsible> */}
    </section>
  );
}
