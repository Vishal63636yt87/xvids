import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Eye, MousePointer } from "lucide-react";

interface RevenueStats {
  today: number;
  total: number;
  clickRate: number;
}

export default function RevenueDashboard() {
  const { data: stats, isLoading } = useQuery<RevenueStats>({
    queryKey: ["/api/revenue/stats"],
    queryFn: async () => {
      const response = await fetch("/api/revenue/stats");
      if (!response.ok) throw new Error("Failed to fetch revenue stats");
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <Card className="bg-[var(--stream-surface)] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Revenue Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-gray-800 rounded animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/4"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[var(--stream-surface)] border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Revenue Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-gray-800 rounded">
          <span className="text-sm text-gray-300 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Ad Revenue Today
          </span>
          <span className="font-semibold text-[var(--stream-green)]">
            ${stats?.today.toFixed(2) || "0.00"}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-gray-800 rounded">
          <span className="text-sm text-gray-300 flex items-center">
            <Eye className="w-4 h-4 mr-2" />
            Total Revenue
          </span>
          <span className="font-semibold text-white">
            ${stats?.total.toFixed(2) || "0.00"}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-gray-800 rounded">
          <span className="text-sm text-gray-300 flex items-center">
            <MousePointer className="w-4 h-4 mr-2" />
            Ad Click Rate
          </span>
          <span className="font-semibold text-white">
            {stats?.clickRate.toFixed(1) || "0.0"}%
          </span>
        </div>
        
        <Button className="w-full bg-[var(--stream-red)] hover:bg-red-600 text-white font-medium">
          View Full Analytics
        </Button>
      </CardContent>
    </Card>
  );
}
