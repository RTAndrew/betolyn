import { queryOptions, useQuery } from '@tanstack/react-query';
import { CriterionService } from './criterion-service';
import { ICriteria } from '@/types';
import { IApiResponse } from '@/utils/http/types';
import { IQueryOptions } from '@/utils/react-query';

// QUERIES OPTIONS

export const getAllCriteriaQueryOptions = () => {
  return queryOptions<IApiResponse<ICriteria[]>, IApiResponse>({
    queryKey: ['criteria'],
    queryFn: async () => await CriterionService.findAllCriteria(),
  });
};

export const getCriterionByIdQueryOptions = ({ criterionId }: { criterionId: string }) => {
  return queryOptions<IApiResponse<ICriteria>, IApiResponse>({
    queryKey: ['criterion', criterionId],
    queryFn: async () => await CriterionService.findCriterionById(criterionId),
  });
};

// QUERIES

export const useGetAllCriteria = ({ queryOptions }: IQueryOptions<typeof getAllCriteriaQueryOptions>) => {
  const query = getAllCriteriaQueryOptions();
  return useQuery({ ...query, ...queryOptions });
};

export const useGetCriterionById = ({ criterionId }: { criterionId: string }) => {
  const query = getCriterionByIdQueryOptions({ criterionId });
  return useQuery(query);
};
