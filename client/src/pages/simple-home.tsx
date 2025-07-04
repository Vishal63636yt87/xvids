import { useQuery } from "@tanstack/react-query";
import VideoCard from "@/components/video-card";
import AdBanner from "@/components/ad-banner";
import SidebarAd from "@/components/sidebar-ad";
import TrendingSidebar from "@/components/trending-sidebar";
import ExoClickBanner from "@/components/ads/exoclick-banner";
import PopAdsIntegration, { PopAdsTrigger } from "@/components/ads/popads-integration";
import type { Video, Ad } from "@shared/schema";

export default function SimpleHome() {
  const { data: videos = [], isLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

  const { data: ads = [] } = useQuery<Ad[]>({
    queryKey: ["/api/ads/active"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading videos...</div>
      </div>
    );
  }

  const bannerAds = ads.filter(ad => ad.adType === "banner");
  const sidebarAds = ads.filter(ad => ad.adType === "sidebar");

  return (
    <div className="min-h-screen bg-black">
      {/* PopAds Integration */}
      <PopAdsIntegration 
        siteId={import.meta.env.VITE_POPADS_SITE_ID} 
        enabled={true} 
      />

      {/* ExoClick Header Banner */}
      <div className="w-full bg-gray-900 py-2">
        <div className="flex justify-center">
          <ExoClickBanner 
            size="728x90" 
            zoneId={import.meta.env.VITE_EXOCLICK_HEADER_ZONE}
            className="rounded overflow-hidden"
          />
        </div>
      </div>

      {/* Header Ad Banner */}
      {bannerAds.length > 0 && (
        <div className="w-full bg-gray-900 py-2">
          <AdBanner ad={bannerAds[0]} variant="large" />
        </div>
      )}

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-4">
          <div className="max-w-6xl mx-auto">
            {/* Telegram Channel Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 rounded-lg p-4 mb-6 text-center shadow-lg">
              <a 
                href="https://t.me/+zy245nPrYv00YTA1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white font-medium text-lg block"
              >
                🔥 Join Premium Telegram Channel - Exclusive Content Daily!
              </a>
            </div>

            {/* Mid-content Ad */}
            {bannerAds.length > 1 && (
              <div className="mb-6">
                <AdBanner ad={bannerAds[1]} />
              </div>
            )}

            {/* Category-based Video Layout */}
            {(() => {
              // Group videos by category
              const videosByCategory = videos.reduce((acc, video) => {
                const category = video.category || "Premium";
                if (!acc[category]) acc[category] = [];
                acc[category].push(video);
                return acc;
              }, {} as Record<string, typeof videos>);

              const categories = Object.keys(videosByCategory);
              
              if (categories.length === 0) {
                return (
                  <div className="text-center text-white text-lg mt-12">
                    <p>Premium content loading...</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Admin can add videos via the dashboard.
                    </p>
                  </div>
                );
              }

              return categories.map((category, categoryIndex) => (
                <div key={category} className="mb-8">
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold">
                        {category.toUpperCase()}
                      </span>
                      <span className="text-gray-400">({videosByCategory[category].length})</span>
                    </h2>
                    {videosByCategory[category].length > 6 && (
                      <button className="text-red-400 hover:text-red-300 text-sm font-medium">
                        View All →
                      </button>
                    )}
                  </div>

                  {/* Videos Grid for this category */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {videosByCategory[category].slice(0, 6).map((video, index) => (
                      <VideoCard 
                        key={video.id} 
                        video={video} 
                        index={videos.indexOf(video)}
                      />
                    ))}
                  </div>

                  {/* Insert ads between categories */}
                  {categoryIndex === 1 && (
                    <div className="my-6 flex justify-center">
                      <ExoClickBanner 
                        size="300x250" 
                        zoneId={import.meta.env.VITE_EXOCLICK_CONTENT_ZONE}
                        className="rounded-lg overflow-hidden"
                      />
                    </div>
                  )}
                  {categoryIndex === 3 && bannerAds.length > 2 && (
                    <div className="my-6">
                      <AdBanner ad={bannerAds[2]} />
                    </div>
                  )}
                </div>
              ));
            })()}
            
            {videos.length === 0 && (
              <div className="text-center text-white text-lg mt-12">
                <p>Premium content loading...</p>
                <p className="text-gray-400 text-sm mt-2">
                  Add VIDEO_1_TITLE and VIDEO_1_URL environment variables to get started.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-72 bg-gray-900 p-4 hidden lg:block">
          {/* ExoClick Sidebar Banner */}
          <div className="mb-6">
            <ExoClickBanner 
              size="160x600" 
              zoneId={import.meta.env.VITE_EXOCLICK_SIDEBAR_ZONE}
              className="rounded-lg overflow-hidden"
            />
          </div>

          {/* Sidebar Ads */}
          {sidebarAds.map((ad, index) => (
            <div key={ad.id} className="mb-4">
              <SidebarAd ad={ad} />
            </div>
          ))}
          
          {/* Trending Videos */}
          <TrendingSidebar />

          {/* Bottom ExoClick placement */}
          <div className="mt-6">
            <ExoClickBanner 
              size="300x250" 
              zoneId={import.meta.env.VITE_EXOCLICK_SIDEBAR_ZONE_2}
              className="rounded-lg overflow-hidden"
            />
          </div>
        </div>
      </div>

      {/* Footer Ad */}
      {bannerAds.length > 3 && (
        <div className="w-full bg-gray-900 py-2 border-t border-gray-700">
          <AdBanner ad={bannerAds[3]} />
        </div>
      )}
    </div>
  );
}