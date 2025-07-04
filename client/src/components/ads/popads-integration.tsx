import { useEffect } from "react";

interface PopAdsProps {
  siteId?: string;
  enabled?: boolean;
}

export default function PopAdsIntegration({ siteId, enabled = true }: PopAdsProps) {
  
  useEffect(() => {
    if (!siteId || !enabled) return;

    // Load PopAds script
    const loadPopAds = () => {
      try {
        // Create PopAds configuration
        window.addEventListener('load', () => {
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.async = true;
          script.src = `//d3bqldt7rwn8up.cloudfront.net/js/popads.js`;
          
          script.onload = () => {
            // Initialize PopAds with site configuration
            if (typeof window.PopAds !== 'undefined') {
              window.PopAds({
                site_id: siteId,
                frequency_cap: 1, // 1 pop per user session
                frequency_delay: 86400, // 24 hours between pops
                trigger_method: 3, // On click
                trigger_class: 'popads-trigger'
              });
            }
          };

          document.head.appendChild(script);

          // Track impression
          fetch('/api/ads/impression', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              adType: 'popads',
              revenue: 1.5 // Average PopAds CPM
            })
          }).catch(console.error);
        });

      } catch (error) {
        console.error('PopAds loading error:', error);
      }
    };

    loadPopAds();
  }, [siteId, enabled]);

  // This component doesn't render anything visible
  return null;
}

// PopAds trigger component for strategic placement
export function PopAdsTrigger({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`popads-trigger ${className}`}>
      {children}
    </div>
  );
}