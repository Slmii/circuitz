import { UseQueryOptions } from '@tanstack/react-query';
import { ApiError } from 'declarations/canister.declarations';

export type CustomUseQueryOptions<T = unknown, E = ApiError> = Omit<UseQueryOptions<T, E>, 'queryKey'>;
