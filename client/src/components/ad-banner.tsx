import React from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import type { Ad } from "@shared/schema";

interface AdBannerProps {
  ad: Ad;
  variant?: "default" | "large";
}

export default function AdBanner({ ad, variant = "default" }: AdBannerProps) {
  const clickMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/ads/${ad.id}/click`, {});
    },
    onSuccess: () => {
      if (ad.clickUrl && ad.clickUrl !== "#") {
        window.open(ad.clickUrl, "_blank");
      }
    },
  });

  const impressionMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/ads/${ad.id}/impression`, {});
    },
  });

  // Record impression when component mounts
  React.useEffect(() => {
    impressionMutation.mutate();
  }, [ad.id]);

  const handleClick = () => {
    clickMutation.mutate();
  };

  if (variant === "large") {
    return (
      <div className="bg-[var(--ad-yellow)] text-gray-900 rounded-lg p-6 border-2 border-dashed border-[var(--ad-orange)]">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">🎮 {ad.title}</h2>
          <p className="text-gray-700 mb-4">{ad.description}</p>
          {ad.imageUrl && (
            <img 
              src={ad.imageUrl} 
              alt={ad.title}
              className="w-full h-32 object-cover rounded-lg mb-4"
            />
          )}
          <Button 
            onClick={handleClick}
            className="bg-[var(--ad-orange)] hover:bg-orange-600 text-white px-8 py-3 font-medium text-lg"
            disabled={clickMutation.isPending}
          >
            {clickMutation.isPending ? "Loading..." : "Shop Now"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--ad-yellow)] text-gray-900 rounded-lg p-4 border-2 border-dashed border-[var(--ad-orange)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {ad.imageUrl && (
            <img 
              src={ad.imageUrl} 
              alt={ad.title}
              className="w-20 h-12 rounded object-cover"
            />
          )}
          <div>
            <h3 className="font-semibold">{ad.title}</h3>
            <p className="text-sm text-gray-700">{ad.description}</p>
          </div>
        </div>
        <Button 
          onClick={handleClick}
          className="bg-[var(--ad-orange)] hover:bg-orange-600 text-white px-6 py-2 font-medium"
          disabled={clickMutation.isPending}
        >
          {clickMutation.isPending ? "..." : "Get Premium"}
        </Button>
      </div>
    </div>
  );
}
