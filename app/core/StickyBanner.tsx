/**
 * Nurav AI Sticky Banner Component
 * Client-side banner that stays fixed at the top of the viewport
 * Ensures lucide-react icons render properly with client-side hydration
 */

'use client';

import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Megaphone } from 'lucide-react';

interface StickyBannerProps {
  title: string;
  description: string;
  className?: string;
}

/**
 * StickyBanner - A fixed position banner that displays at the top of the page
 * Uses client-side rendering to ensure icons display correctly
 */
export const StickyBanner: React.FC<StickyBannerProps> = ({
  title,
  description,
  className = '',
}) => {
  return (
    <div className={`sticky top-0 z-50 w-full ${className}`}>
      <Alert className="rounded-none border-x-0 border-t-0 border-primary/20 bg-primary/5 backdrop-blur-sm">
        <Megaphone className="h-5 w-5 text-primary" />
        <AlertTitle className="font-semibold">{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
    </div>
  );
};

export default StickyBanner;
