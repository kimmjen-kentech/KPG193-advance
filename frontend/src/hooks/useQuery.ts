import { useEffect, useState } from 'react';
import { query, type Row } from '../lib/duckdb';

export interface QueryState<T> {
  data: T[] | null;
  error: Error | null;
  loading: boolean;
}

export const useQuery = <T = Row>(sql: string): QueryState<T> => {
  const [state, setState] = useState<QueryState<T>>({ data: null, error: null, loading: true });

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, error: null, loading: true });
    query<T>(sql)
      .then((data) => {
        if (!cancelled) setState({ data, error: null, loading: false });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({ data: null, error: error as Error, loading: false });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [sql]);

  return state;
};
