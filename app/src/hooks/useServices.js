import { useMemo } from 'react';
import { useFirestoreData } from './useFirestoreData.js';
import { getPublishedServices } from '../services/firestore.js';
import { services as localServices } from '../data/services.js';

export function useServices() {
  const { data, loading, error } = useFirestoreData(getPublishedServices, []);

  return {
    services: data || localServices,
    loading,
    error,
    usingFallback: !data && !loading,
  };
}
