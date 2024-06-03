import { Journalist } from "./journalist";
import { Source } from "./source";

export interface JournalistSource {
  journalist: Journalist;
  sources: Source[];
  reach: number;
}
