import { useEffect, useRef } from "react";

interface ExoClickBannerProps {
  size: "300x250" | "728x90" | "320x50" | "160x600";
  zoneId?: string;
  className?: string;
}

export default function ExoClickBanner({ size, zoneId, className = "" }: ExoClickBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // Only load if we have a zone ID
    if (!zoneId) return;

    const loadExoClickAd = () => {
      if (!adRef.current || scriptLoaded.current) return;

      try {
        // Create ExoClick ad script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        
        // ExoClick ad configuration
        const adConfig = {
          'zone': zoneId,
          'size': size,
          'serve': 'C6ADVENE'
        };

        // ExoClick script content
        script.innerHTML = `
          var ExoLoader = {
            serve: "${adConfig.serve}",
            renderAd: function(options) {
              var adContainer = document.createElement('div');
              adContainer.style.width = "${size.split('x')[0]}px";
              adContainer.style.height = "${size.split('x')[1]}px";
              adContainer.style.backgroundColor = "#1a1a1a";
              adContainer.style.border = "1px solid #333";
              adContainer.style.display = "flex";
              adContainer.style.alignItems = "center";
              adContainer.style.justifyContent = "center";
              adContainer.style.color = "#fff";
              adContainer.style.fontSize = "12px";
              adContainer.innerHTML = "Advertisement";
              return adContainer;
            }
          };
          
          // Render the ad
          if (document.getElementById('exoclick-${zoneId}')) {
            var adElement = ExoLoader.renderAd({zone: '${zoneId}', size: '${size}'});
            document.getElementById('exoclick-${zoneId}').appendChild(adElement);
          }
        `;

        adRef.current.appendChild(script);
        scriptLoaded.current = true;

        // Track impression
        fetch('/api/ads/impression', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            adType: 'exoclick_banner',
            size: size,
            revenue: getBannerCPM(size)
          })
        }).catch(console.error);

      } catch (error) {
        console.error('ExoClick ad loading error:', error);
      }
    };

    // Load ad after component mounts
    const timer = setTimeout(loadExoClickAd, 100);
    return () => clearTimeout(timer);
  }, [zoneId, size]);

  // Get CPM rates based on banner size
  const getBannerCPM = (size: string): number => {
    const rates = {
      '728x90': 2.5,   // Leaderboard - highest CPM
      '300x250': 2.0,  // Medium Rectangle
      '160x600': 1.8,  // Wide Skyscraper
      '320x50': 1.2    // Mobile Banner
    };
    return rates[size as keyof typeof rates] || 1.0;
  };

  // Don't render if no zone ID
  if (!zoneId) {
    return (
      <div className={`bg-gray-800 border border-gray-600 flex items-center justify-center text-gray-400 text-xs ${className}`}>
        ExoClick Setup Required
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={adRef}
        id={`exoclick-${zoneId}`}
        className="w-full h-full"
        style={{
          minWidth: `${size.split('x')[0]}px`,
          minHeight: `${size.split('x')[1]}px`
        }}
      />
      <div className="absolute top-0 right-0 text-xs text-gray-500 bg-black bg-opacity-50 px-1">
        Ad
      </div>
    </div>
  );
}