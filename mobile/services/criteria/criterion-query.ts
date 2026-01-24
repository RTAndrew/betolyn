import { queryOptions, useQuery } from '@tanstack/react-query';
import { CriterionService } from './criterion-service';
import { ICriterion } from '@/types';
import { IApiResponse } from '@/utils/http/types';
import { IQueryOptions, queryClient } from '@/utils/react-query';

// QUERIES OPTIONS

export const getAllCriteriaQueryOptions = () => {
  return queryOptions<IApiResponse<ICriterion[]>, IApiResponse>({
    queryKey: ['criteria'],
    queryFn: async () => await CriterionService.findAllCriteria(),
  });
};

export const getCriterionByIdQueryOptions = ({ criterionId }: { criterionId: string }) => {
  return queryOptions<IApiResponse<ICriterion>, IApiResponse>({
    queryKey: ['criterion', criterionId],
    queryFn: async () => await CriterionService.findCriterionById(criterionId),
  });
};

// QUERIES

export const useGetAllCriteria = ({ queryOptions }: IQueryOptions<typeof getAllCriteriaQueryOptions>) => {
  const query = getAllCriteriaQueryOptions();
  return useQuery({ ...query, ...queryOptions }, queryClient);
};

export const useGetCriterionById = ({ criterionId }: { criterionId: string }) => {
  const query = getCriterionByIdQueryOptions({ criterionId });
  return useQuery(query, queryClient);
};
