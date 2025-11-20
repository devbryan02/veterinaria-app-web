import { useState, useEffect } from 'react';
import { getDashboardStats } from '../service/StatsService';
import { EstadisticasDashboard } from '../types/Index';

export const useStats = () => {
  const [data, setData] = useState<EstadisticasDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const stats = await getDashboardStats();
      setData(stats);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const refetch = () => {
    fetchStats();
  };

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};