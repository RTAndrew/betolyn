export { queryClient } from './query-client';

export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> = Awaited<
  ReturnType<FnType>
>;

export type QueryConfig<T extends (...args: any[]) => any> = Omit<
  ReturnType<T>,
  'queryKey' | 'queryFn'
>;

export interface IQueryOptions<T extends (...args: any[]) => any> {
  queryOptions?: QueryConfig<T>;
}
