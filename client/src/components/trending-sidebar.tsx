import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { formatViews } from "@/lib/video-utils";
import type { Video } from "@shared/schema";

export default function TrendingSidebar() {
  const { data: trendingVideos = [], isLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos/trending"],
    queryFn: async () => {
      const response = await fetch("/api/videos/trending");
      if (!response.ok) throw new Error("Failed to fetch trending videos");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="bg-[var(--stream-surface)] rounded-lg p-4">
        <h3 className="font-semibold text-white mb-4">🔥 Trending Now</h3>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex space-x-3 animate-pulse">
              <div className="w-16 h-12 bg-gray-700 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-700 rounded"></div>
                <div className="h-2 bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--stream-surface)] rounded-lg p-4">
      <h3 className="font-semibold text-white mb-4">🔥 Trending Now</h3>
      <div className="space-y-3">
        {trendingVideos.slice(0, 3).map((video) => (
          <Link key={video.id} href={`/video/${video.id}`}>
            <div className="flex space-x-3 hover:bg-gray-800 p-2 rounded transition-colors cursor-pointer">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-16 h-12 rounded object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white line-clamp-2 mb-1">
                  {video.title}
                </h4>
                <p className="text-xs text-gray-400 truncate">{video.creator}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatViews(video.views || 0)} views
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
