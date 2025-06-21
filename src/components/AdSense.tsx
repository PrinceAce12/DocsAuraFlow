'use client';

import { useEffect, useState } from 'react';

// AdSense publisher ID constant for easy maintenance
const AD_CLIENT = 'ca-pub-3383149380786147';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
  fallbackContent?: React.ReactNode;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdSense({
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  style = { display: 'block' },
  className = '',
  fallbackContent
}: AdSenseProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadAd = async () => {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setIsLoaded(true);
        } else {
          // Wait for AdSense to load
          const checkAdSense = setInterval(() => {
            if (window.adsbygoogle) {
              (window.adsbygoogle = window.adsbygoogle || []).push({});
              setIsLoaded(true);
              clearInterval(checkAdSense);
            }
          }, 100);

          // Timeout after 5 seconds
          setTimeout(() => {
            clearInterval(checkAdSense);
            setHasError(true);
          }, 5000);
        }
      } catch (error) {
        console.error('AdSense error:', error);
        setHasError(true);
      }
    };

    loadAd();
  }, []);

  // Don't render ads in development
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className={`ad-placeholder ${className}`} style={{ 
        minHeight: '90px', 
        backgroundColor: '#f3f4f6', 
        border: '2px dashed #d1d5db',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6b7280',
        fontSize: '14px',
        ...style 
      }}>
        [AdSense Placeholder - {adSlot}]
      </div>
    );
  }

  // Show error state
  if (hasError && fallbackContent) {
    return <div className={className}>{fallbackContent}</div>;
  }

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={AD_CLIENT}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
      {!isLoaded && !hasError && (
        <div style={{ 
          minHeight: '90px', 
          backgroundColor: '#f9fafb', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#6b7280',
          fontSize: '12px'
        }}>
          Loading advertisement...
        </div>
      )}
    </div>
  );
}

// Predefined ad components for common placements
// Note: Replace these placeholder slots with actual AdSense ad slots when available
export function HeaderAd() {
  return (
    <AdSense
      adSlot="1234567890"
      adFormat="horizontal"
      className="mb-6"
      style={{ display: 'block', minHeight: '90px' }}
      fallbackContent={
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg text-center">
          <p className="text-sm text-blue-600 dark:text-blue-400">
            📢 Premium Document Tools - Try our advanced features!
          </p>
        </div>
      }
    />
  );
}

export function SidebarAd() {
  return (
    <AdSense
      adSlot="2345678901"
      adFormat="rectangle"
      className="mb-4"
      style={{ display: 'block', width: '300px', height: '250px' }}
      fallbackContent={
        <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg text-center" style={{ width: '300px', height: '250px' }}>
          <p className="text-sm text-green-600 dark:text-green-400">
            🚀 Boost your productivity with our premium tools!
          </p>
        </div>
      }
    />
  );
}

export function FooterAd() {
  return (
    <AdSense
      adSlot="3456789012"
      adFormat="horizontal"
      className="mt-6"
      style={{ display: 'block', minHeight: '90px' }}
      fallbackContent={
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg text-center">
          <p className="text-sm text-purple-600 dark:text-purple-400">
            💡 Need more features? Upgrade to our premium suite!
          </p>
        </div>
      }
    />
  );
}

export function InContentAd() {
  return (
    <AdSense
      adSlot="4567890123"
      adFormat="rectangle"
      className="my-6 mx-auto"
      style={{ display: 'block', textAlign: 'center' }}
      fallbackContent={
        <div className="my-6 mx-auto p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg text-center max-w-md">
          <p className="text-sm text-orange-600 dark:text-orange-400">
            ⭐ Get unlimited conversions with our premium plan!
          </p>
        </div>
      }
    />
  );
}

export function MobileAd() {
  return (
    <AdSense
      adSlot="5678901234"
      adFormat="auto"
      className="block sm:hidden my-4"
      style={{ display: 'block', minHeight: '50px' }}
      fallbackContent={
        <div className="block sm:hidden my-4 p-3 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-lg text-center">
          <p className="text-xs text-teal-600 dark:text-teal-400">
            📱 Mobile-optimized tools available!
          </p>
        </div>
      }
    />
  );
}
