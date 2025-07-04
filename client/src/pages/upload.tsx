import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload as UploadIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/header";

const categories = ["Gaming", "Music", "Entertainment", "Education", "Technology"];

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [creator, setCreator] = useState("");
  const [dragActive, setDragActive] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await apiRequest("POST", "/api/videos", formData);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your video has been uploaded successfully.",
      });
      // Reset form
      setFile(null);
      setTitle("");
      setDescription("");
      setCategory("");
      setCreator("");
      // Invalidate videos cache
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload video. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('video/')) {
        setFile(droppedFile);
      } else {
        toast({
          title: "Invalid File",
          description: "Please select a video file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type.startsWith('video/')) {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid File",
          description: "Please select a video file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !title || !category || !creator) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select a video file.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('creator', creator);

    uploadMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-[var(--stream-dark)]">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="bg-[var(--stream-surface)] border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white flex items-center">
              <UploadIcon className="w-6 h-6 mr-2" />
              Upload Video
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload Area */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Video File *</label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? "border-[var(--stream-red)] bg-red-500/10"
                      : file
                      ? "border-green-500 bg-green-500/10"
                      : "border-gray-600 hover:border-gray-500"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {file ? (
                    <div className="space-y-2">
                      <div className="text-green-400 font-medium">{file.name}</div>
                      <div className="text-sm text-gray-400">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFile(null)}
                        className="bg-gray-700 border-gray-600 text-gray-300"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <UploadIcon className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-gray-300 font-medium">
                          Drag & drop your video here
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          or click to browse files
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="video-upload"
                      />
                      <label htmlFor="video-upload">
                        <Button
                          type="button"
                          variant="outline"
                          className="bg-gray-700 border-gray-600 text-gray-300"
                          asChild
                        >
                          <span>Browse Files</span>
                        </Button>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Video Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Title *</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter video title..."
                    className="bg-gray-800 border-gray-600 text-white focus:border-[var(--stream-red)]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Creator *</label>
                  <Input
                    value={creator}
                    onChange={(e) => setCreator(e.target.value)}
                    placeholder="Your name or channel name..."
                    className="bg-gray-800 border-gray-600 text-white focus:border-[var(--stream-red)]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Category *</label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-[var(--stream-red)]">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-white hover:bg-gray-700">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your video..."
                  className="bg-gray-800 border-gray-600 text-white focus:border-[var(--stream-red)] min-h-[100px] resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                  onClick={() => {
                    setFile(null);
                    setTitle("");
                    setDescription("");
                    setCategory("");
                    setCreator("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[var(--stream-red)] hover:bg-red-600 text-white"
                  disabled={uploadMutation.isPending || !file || !title || !category || !creator}
                >
                  {uploadMutation.isPending ? "Uploading..." : "Upload Video"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
