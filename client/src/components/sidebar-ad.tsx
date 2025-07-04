import React from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import type { Ad } from "@shared/schema";

interface SidebarAdProps {
  ad: Ad;
}

export default function SidebarAd({ ad }: SidebarAdProps) {
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

  const getEmoji = () => {
    switch (ad.title.toLowerCase()) {
      case "mobile app download":
        return "📱";
      case "online courses":
        return "💻";
      case "music streaming":
        return "🎵";
      default:
        return "🎯";
    }
  };

  return (
    <div className="bg-[var(--ad-yellow)] text-gray-900 rounded-lg p-4 border-2 border-dashed border-[var(--ad-orange)]">
      <h3 className="font-semibold mb-2">
        {getEmoji()} {ad.title}
      </h3>
      <p className="text-sm text-gray-700 mb-3">{ad.description}</p>
      {ad.imageUrl && (
        <img 
          src={ad.imageUrl} 
          alt={ad.title}
          className="w-full h-24 object-cover rounded mb-3"
        />
      )}
      <Button 
        onClick={handleClick}
        className="w-full bg-[var(--ad-orange)] hover:bg-orange-600 text-white py-2 font-medium"
        disabled={clickMutation.isPending}
      >
        {clickMutation.isPending ? "Loading..." : getButtonText()}
      </Button>
    </div>
  );

  function getButtonText() {
    switch (ad.title.toLowerCase()) {
      case "mobile app download":
        return "Download Free";
      case "online courses":
        return "Start Learning";
      case "music streaming":
        return "Try 30 Days Free";
      default:
        return "Learn More";
    }
  }
}
