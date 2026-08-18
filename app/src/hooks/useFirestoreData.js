import { useEffect, useState, useCallback } from 'react';

export function useFirestoreData(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[useFirestoreData] fetch error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetcher()
      .then((result) => {
        if (mounted) setData(result);
      })
      .catch((err) => {
        if (mounted) {
          // eslint-disable-next-line no-console
          console.error('[useFirestoreData] fetch error:', err);
          setError(err);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, deps);

  return { data, loading, error, reload };
}
