import { IMatch } from "@/types";

class _MatchesSseStore {
  private matches: Record<string, IMatch> = {} as Record<string, IMatch>;

  public setMatches(matches: IMatch[]) {
    for (const match of matches) {
      this.matches[match.id] = match;
    }
  }

  public getMatch(id: string): IMatch | undefined {
    return this.matches?.[id] ?? undefined;
  }

  public getMatches(): Record<string, IMatch> {
    return this.matches;
  }

  public updateMatch(match: IMatch) {
    this.matches[match.id] = match;
  }
}

export const MatchesSseStore = new _MatchesSseStore();