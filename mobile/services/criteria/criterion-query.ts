import { queryOptions, useQuery } from '@tanstack/react-query';

import { ICriterion, ICriterionMetrics, IOdd } from '@/types';
import { IApiResponse } from '@/utils/http/types';
import { IQueryOptions, queryClient } from '@/utils/react-query';

import { CriterionService } from './criterion-service';

// QUERIES OPTIONS

export const getAllCriteriaQueryOptions = () => {
  return queryOptions<IApiResponse<ICriterion[]>, IApiResponse>({
    queryKey: ['criteria'],
    queryFn: async () => await CriterionService.findAllCriteria(),
  });
};

export const getCriterionByIdQueryOptions = ({ criterionId }: { criterionId: string }) => {
  return queryOptions<IApiResponse<ICriterion & { odds: IOdd[] }>, IApiResponse>({
    queryKey: ['criterion', criterionId],
    queryFn: async () => await CriterionService.findCriterionById(criterionId),
  });
};

export const getCriterionMetricsQueryOptions = ({ criterionId }: { criterionId: string }) => {
  return queryOptions<IApiResponse<ICriterionMetrics>, IApiResponse>({
    queryKey: ['criterion', criterionId, 'metrics'],
    queryFn: async () => await CriterionService.getCriterionMetrics(criterionId),
  });
};

// QUERIES

export const useGetAllCriteria = ({
  queryOptions,
}: IQueryOptions<typeof getAllCriteriaQueryOptions>) => {
  const query = getAllCriteriaQueryOptions();
  return useQuery({ ...query, ...queryOptions }, queryClient);
};

export const useGetCriterionById = ({
  criterionId,
  queryOptions,
}: { criterionId: string } & IQueryOptions<typeof getCriterionByIdQueryOptions>) => {
  const query = getCriterionByIdQueryOptions({ criterionId });
  return useQuery({ ...query, ...queryOptions }, queryClient);
};

export const useGetCriterionMetrics = ({
  criterionId,
  queryOptions,
}: { criterionId: string } & IQueryOptions<typeof getCriterionMetricsQueryOptions>) => {
  const query = getCriterionMetricsQueryOptions({ criterionId });
  return useQuery({ ...query, ...queryOptions }, queryClient);
};
