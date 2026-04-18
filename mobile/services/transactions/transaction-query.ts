import { queryOptions, useQuery } from '@tanstack/react-query';

import { ITransaction } from '@/types';
import { IApiResponse } from '@/utils/http/types';
import { IQueryOptions } from '@/utils/react-query';

import { TransactionService } from './transaction-service';

export const getMyTransactionsQueryOptions = () => {
  return queryOptions<IApiResponse<ITransaction[]>, IApiResponse>({
    queryKey: ['me', 'transactions'],
    queryFn: () => TransactionService.getMyTransactions(),
  });
};

export const getMyTransactionByIdQueryOptions = ({ id }: { id: string }) => {
  return queryOptions<IApiResponse<ITransaction>, IApiResponse>({
    queryKey: ['me', 'transactions', id],
    queryFn: () => TransactionService.getMyTransactionById(id),
  });
};

export const useGetMyTransactions = ({
  queryOptions,
}: IQueryOptions<typeof getMyTransactionsQueryOptions>) => {
  const query = getMyTransactionsQueryOptions();
  return useQuery({ ...query, ...queryOptions });
};

export const useGetMyTransactionById = ({
  id,
  queryOptions,
}: { id: string } & IQueryOptions<typeof getMyTransactionByIdQueryOptions>) => {
  const query = getMyTransactionByIdQueryOptions({ id });
  return useQuery({ ...query, ...queryOptions });
};
