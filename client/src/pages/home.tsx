import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Upload, Bell, User } from "lucide-react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import VideoCard from "@/components/video-card";
import AdBanner from "@/components/ad-banner";
import SidebarAd from "@/components/sidebar-ad";
import TrendingSidebar from "@/components/trending-sidebar";
import RevenueDashboard from "@/components/revenue-dashboard";
import Header from "@/components/header";
import type { Video, Ad } from "@shared/schema";

const categories = ["All", "Entertainment", "Music", "Gaming", "Education", "Technology", "Sports", "News"];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: videos = [], isLoading: videosLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos", selectedCategory, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== "All") params.append("category", selectedCategory);
      if (searchQuery) params.append("search", searchQuery);
      
      const response = await fetch(`/api/videos?${params}`);
      if (!response.ok) throw new Error("Failed to fetch videos");
      return response.json();
    },
  });

  const { data: bannerAds = [] } = useQuery<Ad[]>({
    queryKey: ["/api/ads", "banner"],
    queryFn: async () => {
      const response = await fetch("/api/ads?type=banner");
      if (!response.ok) throw new Error("Failed to fetch banner ads");
      return response.json();
    },
  });

  const { data: midContentAds = [] } = useQuery<Ad[]>({
    queryKey: ["/api/ads", "midcontent"],
    queryFn: async () => {
      const response = await fetch("/api/ads?type=midcontent");
      if (!response.ok) throw new Error("Failed to fetch mid-content ads");
      return response.json();
    },
  });

  const { data: sidebarAds = [] } = useQuery<Ad[]>({
    queryKey: ["/api/ads", "sidebar"],
    queryFn: async () => {
      const response = await fetch("/api/ads?type=sidebar");
      if (!response.ok) throw new Error("Failed to fetch sidebar ads");
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-[var(--stream-dark)]">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content Area */}
          <main className="flex-1">
            {/* Top Banner Ad */}
            {bannerAds.length > 0 && (
              <div className="mb-6">
                <AdBanner ad={bannerAds[0]} />
              </div>
            )}

            {/* Video Categories */}
            <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "secondary"}
                  className={`whitespace-nowrap font-medium ${
                    selectedCategory === category
                      ? "bg-[var(--stream-red)] hover:bg-red-600 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Video Grid */}
            {videosLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-[var(--stream-surface)] rounded-lg animate-pulse">
                    <div className="w-full h-48 bg-gray-700 rounded-t-lg"></div>
                    <div className="p-3 space-y-2">
                      <div className="h-4 bg-gray-700 rounded"></div>
                      <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                      <div className="flex justify-between">
                        <div className="h-3 bg-gray-700 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg">No videos found</div>
                <p className="text-gray-500 mt-2">
                  {searchQuery ? "Try adjusting your search terms" : "No videos available in this category"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {videos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            )}

            {/* Mid-Content Ad Banner */}
            {midContentAds.length > 0 && videos.length > 4 && (
              <div className="my-8">
                <AdBanner ad={midContentAds[0]} variant="large" />
              </div>
            )}

            {videos.length > 0 && (
              <div className="text-center py-8">
                <Button
                  variant="outline"
                  className="bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-300"
                >
                  Load More Videos
                </Button>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 space-y-6">
            {/* Sidebar Ads */}
            {sidebarAds.slice(0, 1).map((ad) => (
              <SidebarAd key={ad.id} ad={ad} />
            ))}

            {/* Trending Section */}
            <TrendingSidebar />

            {/* More Sidebar Ads */}
            {sidebarAds.slice(1, 2).map((ad) => (
              <SidebarAd key={ad.id} ad={ad} />
            ))}

            {/* Revenue Dashboard */}
            <RevenueDashboard />

            {/* Final Sidebar Ad */}
            {sidebarAds.slice(2, 3).map((ad) => (
              <SidebarAd key={ad.id} ad={ad} />
            ))}
          </aside>
        </div>
      </div>
    </div>
  );
}
