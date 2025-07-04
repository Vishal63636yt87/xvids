import { Play, Eye, Clock } from "lucide-react";
import type { Video } from "@shared/schema";

interface VideoCardProps {
  video: Video;
  index: number;
}

export default function VideoCard({ video, index }: VideoCardProps) {
  const handleVideoClick = () => {
    // Track video view and open external link
    fetch(`/api/videos/${video.id}/view`, { method: 'POST' }).catch(() => {});
    window.open(video.externalUrl, '_blank');
  };

  return (
    <div 
      onClick={handleVideoClick}
      className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl"
    >
      {/* Professional thumbnail with overlay */}
      <div className="relative bg-gradient-to-br from-purple-900 to-pink-900 h-48 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
        {/* Play button overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="bg-red-600 bg-opacity-90 rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
            <Play className="h-8 w-8 text-white fill-white" />
          </div>
        </div>
        
        {/* Video number */}
        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-sm px-2 py-1 rounded">
          #{index + 1}
        </div>

        {/* Premium badge */}
        {video.featured && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">
            PREMIUM
          </div>
        )}

        {/* Duration */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : "HD"}
        </div>
      </div>
      
      {/* Video info */}
      <div className="p-3">
        <h3 className="font-medium text-white text-sm line-clamp-2 mb-2 group-hover:text-pink-300 transition-colors" title={video.title}>
          {video.title}
        </h3>
        
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{video.views ? `${Math.floor(video.views / 1000)}K` : '1.2K'} views</span>
          </div>
          <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
            FREE
          </div>
        </div>
      </div>
    </div>
  );
}
