'use client';
import { useState, useEffect } from 'react';

// Viewport information interface with device categorization and grid settings
export interface ViewportInfo {
  width: number;  // Current viewport width in pixels
  height: number; // Current viewport height in pixels
  device: 'flip' | 'mobile' | 'tablet' | 'laptop' | 'desktop' | 'tv'; // Auto-detected device type
  columns: number; // Optimal grid columns for this device (2-16)
  gap: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; // Optimal gap size for this device
}

// Device detection logic - automatically categorizes devices and sets optimal grid settings
const getDeviceInfo = (width: number): Omit<ViewportInfo, 'width' | 'height'> => {
  if (width <= 320) return { device: 'flip', columns: 2, gap: 'xs' };      // Flip phones - minimal columns
  if (width <= 768) return { device: 'mobile', columns: 4, gap: 'sm' };    // Mobile devices - compact layout  
  if (width <= 1024) return { device: 'tablet', columns: 8, gap: 'md' };   // Tablets - moderate columns
  if (width <= 1440) return { device: 'laptop', columns: 12, gap: 'lg' };  // Laptops - standard grid
  if (width <= 1920) return { device: 'desktop', columns: 12, gap: 'lg' }; // Desktop - standard grid
  return { device: 'tv', columns: 16, gap: 'xl' };                         // TV/Ultra-wide - max columns
};

// React hook for responsive viewport detection with automatic device categorization
export const useViewport = (): ViewportInfo => {
  const [viewport, setViewport] = useState<ViewportInfo>({
    width: 1200, // Safe default for SSR (prevents hydration mismatch)
    height: 800,
    device: 'laptop',
    columns: 12,
    gap: 'lg'
  });

  useEffect(() => {
    // Updates viewport state with current window dimensions and device info
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const deviceInfo = getDeviceInfo(width); // Auto-detect device type and grid settings
      
      setViewport({
        width,
        height,
        ...deviceInfo
      });
    };

    updateViewport(); // Initial viewport detection on mount

    // Listen for viewport changes - covers resize, zoom, and device rotation
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);

    // Cleanup listeners to prevent memory leaks
    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, []);

  return viewport; // Returns current viewport info for components to use
};