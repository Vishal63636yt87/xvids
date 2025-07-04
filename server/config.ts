// Environment configuration loader
export interface VideoConfig {
  title: string;
  url: string;
}

export function loadVideosFromEnv(): VideoConfig[] {
  const videos: VideoConfig[] = [];
  
  // Scan all environment variables for VIDEO_ patterns
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith('VIDEO_') && key.endsWith('_TITLE') && value) {
      // Extract the number from VIDEO_X_TITLE
      const match = key.match(/^VIDEO_(\d+)_TITLE$/);
      if (match) {
        const videoNum = match[1];
        const url = process.env[`VIDEO_${videoNum}_URL`];
        
        if (url) {
          videos.push({ title: value, url });
        }
      }
    }
  }
  
  // Sort by video number to maintain order
  return videos.sort((a, b) => {
    const aNum = Object.keys(process.env).find(key => 
      key.endsWith('_TITLE') && process.env[key] === a.title
    )?.match(/(\d+)/)?.[1] || '0';
    const bNum = Object.keys(process.env).find(key => 
      key.endsWith('_TITLE') && process.env[key] === b.title
    )?.match(/(\d+)/)?.[1] || '0';
    return parseInt(aNum) - parseInt(bNum);
  });
}

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "admin123"
  };
}