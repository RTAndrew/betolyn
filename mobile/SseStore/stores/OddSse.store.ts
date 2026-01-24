import { IOdd } from "@/types";
import { sseClientStore } from '../provider';

type TOddChange = Partial<IOdd> & { id: string };

const cleanObject = (source: any): Record<string, any> => {
  const cleanedObject: Record<string, any> = {};
  Object.keys(source)
    .filter((key) => source[key] !== null && source[key] !== undefined)
    .forEach((key) => {
      cleanedObject[key] = source[key];
    });

  return cleanedObject;
};

class _OddSseStore {
  private odds: Record<string, IOdd> = {};

  public setOdds(odds: TOddChange[]) {
    for (const odd of odds) {
      const foundOdd = this.odds[odd.id];

      // Create a new merged object to ensure React Query detects the change
      const mergedOdd: IOdd = {
        ...foundOdd,
        ...cleanObject(odd),
      } as IOdd;

      // Update the store first
      this.odds[odd.id] = mergedOdd;

      // Then update React Query cache - this will trigger re-renders for all subscribers
      // Don't use invalidateQueries here as it causes unnecessary refetches
      // and can cause timing issues where the refetch happens before store is updated
      // sseClientStore.setQueryData(['odd', odd.id], mergedOdd);
      sseClientStore.invalidateQueries({ queryKey: ['odd', odd.id] });
    }
  }

  public getOdd(id: string): IOdd | undefined {
    return this.odds[id];
  }

  public getOdds() {
    return Object.values(this.odds);
  }
}

export const OddSseStore = new _OddSseStore();