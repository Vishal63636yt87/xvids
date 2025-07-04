import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Play, ThumbsUp, Share, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import AdBanner from "@/components/ad-banner";
import SidebarAd from "@/components/sidebar-ad";
import { formatViews, formatDuration, formatTimeAgo } from "@/lib/video-utils";
import type { Video, Ad } from "@shared/schema";

export default function VideoPlayer() {
  const { id } = useParams<{ id: string }>();
  const videoId = parseInt(id || "0");

  const { data: video, isLoading } = useQuery<Video>({
    queryKey: ["/api/videos", videoId],
    queryFn: async () => {
      const response = await fetch(`/api/videos/${videoId}`);
      if (!response.ok) throw new Error("Failed to fetch video");
      return response.json();
    },
    enabled: !!videoId,
  });

  const { data: relatedVideos = [] } = useQuery<Video[]>({
    queryKey: ["/api/videos", video?.category],
    queryFn: async () => {
      const response = await fetch(`/api/videos?category=${video?.category}`);
      if (!response.ok) throw new Error("Failed to fetch related videos");
      const videos = await response.json();
      return videos.filter((v: Video) => v.id !== videoId).slice(0, 8);
    },
    enabled: !!video,
  });

  const { data: sidebarAds = [] } = useQuery<Ad[]>({
    queryKey: ["/api/ads", "sidebar"],
    queryFn: async () => {
      const response = await fetch("/api/ads?type=sidebar");
      if (!response.ok) throw new Error("Failed to fetch sidebar ads");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--stream-dark)]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse">
            <div className="w-full h-96 bg-gray-700 rounded-lg mb-4"></div>
            <div className="h-8 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-[var(--stream-dark)]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="bg-[var(--stream-surface)] border-gray-700">
            <CardContent className="pt-6 text-center">
              <div className="text-red-500 text-lg font-semibold mb-2">Video Not Found</div>
              <p className="text-gray-400">The video you're looking for doesn't exist.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--stream-dark)]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <main className="flex-1">
            {/* Video Player */}
            <div className="relative bg-black rounded-lg overflow-hidden mb-4">
              <div className="aspect-video bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-white mb-4 mx-auto" />
                  <p className="text-white text-lg font-medium">{video.title}</p>
                  <p className="text-gray-400 mt-2">External Video Player</p>
                  <p className="text-gray-500 text-sm mt-1">
                    External URL: {video.externalUrl}
                  </p>
                  <a 
                    href={video.externalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-4 inline-block bg-[var(--stream-red)] hover:bg-red-600 text-white px-6 py-2 rounded transition-colors"
                  >
                    Watch Video
                  </a>
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">{video.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="text-gray-400">{formatViews(video.views || 0)} views</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">{video.uploadTime ? formatTimeAgo(video.uploadTime) : 'Unknown date'}</span>
                <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                  {video.category}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-[var(--stream-green)] rounded-full flex items-center justify-center">
                    <span className="text-black font-semibold text-sm">
                      {video.creator.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-white">{video.creator}</div>
                    <div className="text-sm text-gray-400">Creator</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="bg-gray-700 border-gray-600 text-gray-300">
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Like
                  </Button>
                  <Button variant="outline" size="sm" className="bg-gray-700 border-gray-600 text-gray-300">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="bg-gray-700 border-gray-600 text-gray-300">
                    <Download className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>

              {video.description && (
                <Card className="bg-[var(--stream-surface)] border-gray-700">
                  <CardContent className="pt-4">
                    <p className="text-gray-300 whitespace-pre-wrap">{video.description}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Related Videos */}
            {relatedVideos.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Related Videos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {relatedVideos.map((relatedVideo) => (
                    <div key={relatedVideo.id} className="bg-[var(--stream-surface)] rounded-lg overflow-hidden hover:bg-gray-800 transition-colors cursor-pointer group">
                      <img 
                        src={relatedVideo.thumbnail} 
                        alt={relatedVideo.title}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="p-3">
                        <h3 className="font-medium text-white mb-1 line-clamp-2 text-sm">
                          {relatedVideo.title}
                        </h3>
                        <p className="text-xs text-gray-400 mb-1">{relatedVideo.creator}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{formatViews(relatedVideo.views || 0)} views</span>
                          <span>{relatedVideo.uploadTime ? formatTimeAgo(relatedVideo.uploadTime) : 'Unknown date'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 space-y-6">
            {sidebarAds.map((ad, index) => (
              <SidebarAd key={ad.id} ad={ad} />
            ))}
          </aside>
        </div>
      </div>
    </div>
  );
}
