/**
 * Thumbnail extraction service for various video hosting platforms
 */

export interface ThumbnailResult {
  url: string;
  width?: number;
  height?: number;
  source: string;
}

export class ThumbnailExtractor {
  
  /**
   * Extract thumbnail URL from video URL
   */
  static async extractThumbnail(videoUrl: string): Promise<ThumbnailResult | null> {
    try {
      const url = new URL(videoUrl);
      const hostname = url.hostname.toLowerCase();

      // YouTube
      if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
        return this.extractYouTubeThumbnail(videoUrl);
      }

      // Vimeo
      if (hostname.includes('vimeo.com')) {
        return await this.extractVimeoThumbnail(videoUrl);
      }

      // Dailymotion
      if (hostname.includes('dailymotion.com')) {
        return this.extractDailymotionThumbnail(videoUrl);
      }

      // Pornhub
      if (hostname.includes('pornhub.com')) {
        return this.extractPornhubThumbnail(videoUrl);
      }

      // XVideos
      if (hostname.includes('xvideos.com')) {
        return this.extractXVideosThumbnail(videoUrl);
      }

      // RedTube
      if (hostname.includes('redtube.com')) {
        return this.extractRedTubeThumbnail(videoUrl);
      }

      // Fallback: Generate a gradient thumbnail
      return this.generateFallbackThumbnail(videoUrl);

    } catch (error) {
      console.error('Thumbnail extraction error:', error);
      return this.generateFallbackThumbnail(videoUrl);
    }
  }

  /**
   * Extract YouTube thumbnail
   */
  private static extractYouTubeThumbnail(videoUrl: string): ThumbnailResult {
    let videoId = '';
    
    if (videoUrl.includes('youtu.be/')) {
      videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
    } else if (videoUrl.includes('youtube.com/watch?v=')) {
      videoId = videoUrl.split('v=')[1].split('&')[0];
    } else if (videoUrl.includes('youtube.com/embed/')) {
      videoId = videoUrl.split('embed/')[1].split('?')[0];
    }

    if (videoId) {
      return {
        url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        width: 1280,
        height: 720,
        source: 'youtube'
      };
    }

    return this.generateFallbackThumbnail(videoUrl);
  }

  /**
   * Extract Vimeo thumbnail (requires API call)
   */
  private static async extractVimeoThumbnail(videoUrl: string): Promise<ThumbnailResult> {
    try {
      const videoId = videoUrl.match(/vimeo\.com\/(\d+)/)?.[1];
      if (!videoId) {
        return this.generateFallbackThumbnail(videoUrl);
      }

      const response = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(videoUrl)}`);
      const data = await response.json();
      
      if (data.thumbnail_url) {
        return {
          url: data.thumbnail_url,
          width: data.thumbnail_width,
          height: data.thumbnail_height,
          source: 'vimeo'
        };
      }
    } catch (error) {
      console.error('Vimeo thumbnail extraction failed:', error);
    }

    return this.generateFallbackThumbnail(videoUrl);
  }

  /**
   * Extract Dailymotion thumbnail
   */
  private static extractDailymotionThumbnail(videoUrl: string): ThumbnailResult {
    const videoId = videoUrl.match(/dailymotion\.com\/video\/([^_?]+)/)?.[1];
    
    if (videoId) {
      return {
        url: `https://www.dailymotion.com/thumbnail/video/${videoId}`,
        width: 480,
        height: 360,
        source: 'dailymotion'
      };
    }

    return this.generateFallbackThumbnail(videoUrl);
  }

  /**
   * Extract Pornhub thumbnail (generic approach)
   */
  private static extractPornhubThumbnail(videoUrl: string): ThumbnailResult {
    // Pornhub thumbnails require complex extraction, using fallback
    return this.generateFallbackThumbnail(videoUrl);
  }

  /**
   * Extract XVideos thumbnail (generic approach)
   */
  private static extractXVideosThumbnail(videoUrl: string): ThumbnailResult {
    // XVideos thumbnails require complex extraction, using fallback
    return this.generateFallbackThumbnail(videoUrl);
  }

  /**
   * Extract RedTube thumbnail (generic approach)
   */
  private static extractRedTubeThumbnail(videoUrl: string): ThumbnailResult {
    // RedTube thumbnails require complex extraction, using fallback
    return this.generateFallbackThumbnail(videoUrl);
  }

  /**
   * Generate fallback gradient thumbnail
   */
  private static generateFallbackThumbnail(videoUrl: string): ThumbnailResult {
    // Create a hash-based gradient for consistent thumbnails
    const hash = this.simpleHash(videoUrl);
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    ];

    const selectedGradient = gradients[hash % gradients.length];
    
    return {
      url: this.generateGradientDataUrl(selectedGradient),
      width: 320,
      height: 180,
      source: 'generated'
    };
  }

  /**
   * Generate a simple hash from string
   */
  private static simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Generate gradient data URL for fallback thumbnails
   */
  private static generateGradientDataUrl(gradient: string): string {
    const svg = `
      <svg width="320" height="180" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="320" height="180" fill="url(#grad)" />
        <circle cx="160" cy="90" r="25" fill="rgba(255,255,255,0.8)" />
        <polygon points="150,80 150,100 175,90" fill="rgba(0,0,0,0.6)" />
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  }

  /**
   * Validate if URL is a supported video platform
   */
  static isSupportedPlatform(videoUrl: string): boolean {
    try {
      const url = new URL(videoUrl);
      const hostname = url.hostname.toLowerCase();
      
      const supportedHosts = [
        'youtube.com', 'youtu.be', 'vimeo.com', 'dailymotion.com',
        'pornhub.com', 'xvideos.com', 'redtube.com'
      ];

      return supportedHosts.some(host => hostname.includes(host));
    } catch {
      return false;
    }
  }
}