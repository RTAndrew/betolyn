import { ICriterion } from "@/types";

class _CriteriaSseStore {
  private criteria: Record<string, ICriterion> = {} as Record<string, ICriterion>;

  public setCriterias(criteria: ICriterion[]) {
    for (const criterion of criteria) {
      this.criteria[criterion.id] = criterion;
    }
  }

  public getCriterion(id: string): ICriterion | undefined {
    return this.criteria?.[id] ?? undefined;
  }

  public getCriteria(): Record<string, ICriterion> {
    return this.criteria;
  }

  public updateCriterion(criterion: ICriterion) {
    this.criteria[criterion.id] = criterion;
  }
}

export const CriteriaSseStore = new _CriteriaSseStore();