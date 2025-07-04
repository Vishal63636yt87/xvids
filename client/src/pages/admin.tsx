import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit, Plus, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Video } from "@shared/schema";
import RevenueDashboard from "@/components/revenue-dashboard";

interface VideoFormData {
  title: string;
  description: string;
  externalUrl: string;
  category: string;
  creator: string;
  duration: number;
  featured: boolean;
}

const categories = [
  "Premium", "Amateur", "Professional", "Trending", "Hot", "New", 
  "Indian", "Desi", "Viral", "Popular", "HD Quality", "Exclusive"
];

export default function Admin() {
  const { toast } = useToast();
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  
  const { data: videos = [], isLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

  const addVideoMutation = useMutation({
    mutationFn: async (data: VideoFormData) => {
      return await apiRequest("POST", "/api/videos/external", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      setIsAddingVideo(false);
      toast({ title: "Video added successfully!" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add video",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const editVideoMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: VideoFormData }) => {
      return await apiRequest("PUT", `/api/videos/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      setEditingVideo(null);
      toast({ title: "Video updated successfully!" });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteVideoMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/videos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      toast({ title: "Video deleted successfully!" });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: VideoFormData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string || "",
      externalUrl: formData.get("externalUrl") as string,
      category: formData.get("category") as string,
      creator: formData.get("creator") as string || "Anonymous",
      duration: parseInt(formData.get("duration") as string) || 0,
      featured: formData.get("featured") === "on",
    };
    
    if (editingVideo) {
      editVideoMutation.mutate({ id: editingVideo.id, data });
    } else {
      addVideoMutation.mutate(data);
    }
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setIsAddingVideo(true);
  };

  // Group videos by category
  const videosByCategory = videos.reduce((acc, video) => {
    const category = video.category || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(video);
    return acc;
  }, {} as Record<string, Video[]>);

  if (isLoading) {
    return <div className="p-4 text-white">Loading admin dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Video Management Dashboard</h1>
          <Button onClick={() => setIsAddingVideo(true)} className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Add New Video
          </Button>
        </div>

        {/* Revenue Dashboard */}
        <RevenueDashboard />

        {/* Add/Edit Video Form */}
        {isAddingVideo && (
          <Card className="mb-6 bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                {editingVideo ? "Edit Video" : "Add New Video"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="title"
                    placeholder="Video Title (e.g., Hot Desi Video #1)"
                    defaultValue={editingVideo?.title}
                    className="bg-gray-800 border-gray-600 text-white"
                    required
                  />
                  <Input
                    name="externalUrl"
                    placeholder="External Video URL (e.g., https://example.com/video)"
                    defaultValue={editingVideo?.externalUrl}
                    className="bg-gray-800 border-gray-600 text-white"
                    type="url"
                    required
                  />
                </div>
                
                <Textarea
                  name="description"
                  placeholder="Video Description"
                  defaultValue={editingVideo?.description || ""}
                  className="bg-gray-800 border-gray-600 text-white"
                  rows={3}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Select name="category" defaultValue={editingVideo?.category || "Premium"}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Input
                    name="creator"
                    placeholder="Creator Name"
                    defaultValue={editingVideo?.creator || ""}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                  
                  <Input
                    name="duration"
                    type="number"
                    placeholder="Duration (minutes)"
                    defaultValue={editingVideo?.duration ? Math.floor(editingVideo.duration / 60) : ""}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                  
                  <div className="flex items-center space-x-2 bg-gray-800 border border-gray-600 rounded-md px-3 py-2">
                    <input
                      type="checkbox"
                      name="featured"
                      id="featured"
                      defaultChecked={editingVideo?.featured || false}
                      className="rounded"
                    />
                    <label htmlFor="featured" className="text-white text-sm">Featured Video</label>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    {editingVideo ? "Update Video" : "Add Video"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setIsAddingVideo(false);
                      setEditingVideo(null);
                    }}
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Videos by Category */}
        <div className="space-y-6">
          {Object.entries(videosByCategory).map(([category, categoryVideos]) => (
            <Card key={category} className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="text-xl">{category} ({categoryVideos.length})</span>
                  <div className="text-sm text-gray-400">
                    Total Views: {categoryVideos.reduce((sum, v) => sum + (v.views || 0), 0)}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {categoryVideos.map((video) => (
                    <div key={video.id} className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-white">{video.title}</h3>
                            {video.featured && (
                              <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">
                                FEATURED
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mb-2 line-clamp-2">{video.description}</p>
                          <div className="flex gap-4 text-xs text-gray-500">
                            <span>Creator: {video.creator}</span>
                            <span>Views: {video.views || 0}</span>
                            <span>Duration: {video.duration ? `${Math.floor(video.duration / 60)}m` : "N/A"}</span>
                            <a 
                              href={video.externalUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View Link
                            </a>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            onClick={() => handleEdit(video)}
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-white hover:bg-gray-700"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => deleteVideoMutation.mutate(video.id)}
                            size="sm"
                            variant="outline"
                            className="border-red-600 text-red-400 hover:bg-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {videos.length === 0 && (
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="text-center py-12">
              <h3 className="text-white text-lg mb-2">No videos added yet</h3>
              <p className="text-gray-400 mb-4">Start by adding your first video with an external URL</p>
              <Button onClick={() => setIsAddingVideo(true)} className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Video
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}