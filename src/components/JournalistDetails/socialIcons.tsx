import { JournalistSource } from "@/types/journalistSource";
import { Button } from "../ui/button";
import Link from "next/link";
import { Facebook, Globe2, Linkedin, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";

export function SocialIcons({
  journalist,
  className,
}: {
  journalist: JournalistSource["journalist"];
  className?: string;
}) {
  return (
    <span className={cn("gap-x-2", className)}>
      <Button size="icon" variant="outline" asChild>
        <Link href={`https://x.com/${journalist.twitterHandle}`}>
          <Twitter />
        </Link>
      </Button>
      {journalist.linkedinUrl && (
        <Button asChild size="icon" variant="outline">
          <Link href={journalist.linkedinUrl}>
            <Linkedin />
          </Link>
        </Button>
      )}
      {journalist.facebookUrl && (
        <Button asChild size="icon" variant="outline">
          <Link href={journalist.facebookUrl}>
            <Facebook />
          </Link>
        </Button>
      )}
      {journalist.blogUrl && (
        <Button asChild size="icon" variant="outline">
          <Link href={journalist.blogUrl}>
            <Globe2 />
          </Link>
        </Button>
      )}
    </span>
  );
}
