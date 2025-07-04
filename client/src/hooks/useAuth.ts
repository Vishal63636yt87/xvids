import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/admin/status"],
    retry: false,
  });

  return {
    isAuthenticated: (data as any)?.isAuthenticated || false,
    isLoading,
  };
}