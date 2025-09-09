import { useEffect, useState } from "react";
import { getRequest } from ".";

export const useQuery = (url: string, options?: any) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any | null>(null);
  const [data, setData] = useState<any | null>(null);

  const fetchData = async (url: string, options: any) => {
    setLoading(true);
    try {
      const response = await getRequest(url, options);
      const data = await (response as any).data;
      setData(data);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async (newUrl?: string, newOptions?: any) => {
    await fetchData(newUrl ?? url, newOptions ?? options);
    return { loading, error, data };
  };

  useEffect(() => {
    fetchData(url, options);
  }, []);


  return { loading, error, data, refetch };
}