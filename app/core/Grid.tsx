import React, { ReactNode, CSSProperties } from 'react';
import { useViewport } from '../../hooks/useViewport';

// Main Grid container - automatically adapts columns and gaps based on device type
export interface GridProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

// Grid items with fraction-based sizing - 1=full width, 0.5=half, 0.33=third, 0.25=quarter
export interface GridItemProps {
  children: ReactNode;
  size?: number; // Fraction of available width (auto-converts to columns)
  className?: string;
  style?: CSSProperties;
}

// Main Grid component - CSS Grid with auto-responsive columns (2-16 cols) and device-optimized gaps
export const Grid: React.FC<GridProps> = ({
  children,
  className = '',
  style = {}
}) => {
  const viewport = useViewport(); // Get device type, columns, and gap size

  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${viewport.columns}, 1fr)`, // Auto columns based on device
    gap: `var(--grid-gap-${viewport.gap})`, // Auto gap size (xs/sm/md/lg/xl)
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden', // Prevents any content overflow issues
    ...style
  };

  return (
    <div 
      className={`perfect-grid ${className}`}
      style={gridStyle}
    >
      {children}
    </div>
  );
};

// Grid Item component - converts fraction sizes to columns with smart device optimization
export const GridItem: React.FC<GridItemProps> = ({
  children,
  size = 1,
  className = '',
  style = {}
}) => {
  const viewport = useViewport(); // Get current device info for smart sizing
  
  let actualSize = size; // Start with requested size
  
  // Smart mobile optimization - prevents tiny items on small screens
  if (viewport.device === 'flip' && size < 1) {
    actualSize = 1; // Force full width on flip phones for readability
  } else if (viewport.device === 'mobile' && size < 0.5) {
    actualSize = 0.5; // Minimum half width on mobile for usability
  }
  
  // Convert fraction to column span (e.g., 0.5 * 12 cols = 6 col span)
  const columns = Math.round(actualSize * viewport.columns);
  const finalColumns = Math.max(1, Math.min(columns, viewport.columns)); // Clamp between 1 and max cols

  const itemStyle: CSSProperties = {
    gridColumn: `span ${finalColumns}`, // CSS Grid column span
    minWidth: 0, // Allows content to shrink below min-content
    boxSizing: 'border-box',
    overflow: 'hidden', // Prevents content from breaking grid layout
    ...style
  };

  return (
    <div
      className={`perfect-item ${className}`}
      style={itemStyle}
    >
      {children}
    </div>
  );
};

// Container component - responsive wrapper with optional padding and max-width control
export const Container: React.FC<{
  children: ReactNode;
  edge?: boolean; // true = edge-to-edge layout, false = padded container
  className?: string;
  style?: CSSProperties;
}> = ({ children, edge = false, className = '', style = {} }) => {
  const viewport = useViewport(); // Get device info for responsive padding
  
  return (
    <div 
      className={`perfect-container ${className}`}
      style={{
        width: '100%',
        maxWidth: viewport.device === 'tv' ? '2000px' : '100%', // Prevent ultra-wide layouts on TVs
        margin: '0 auto', // Center container
        padding: edge ? 0 : `var(--grid-gap-${viewport.gap})`, // Conditional padding based on edge prop
        boxSizing: 'border-box',
        overflow: 'hidden', // Prevents horizontal scrolling
        ...style
      }}
    >
      {children}
    </div>
  );
};

// Row component - horizontal flexbox layout with responsive gaps and auto-wrapping
export const Row: React.FC<{
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}> = ({ children, className = '', style = {} }) => {
  const viewport = useViewport(); // Get device-specific gap size
  
  return (
    <div 
      className={`perfect-row ${className}`}
      style={{
        display: 'flex',
        gap: `var(--grid-gap-${viewport.gap})`, // Auto gap based on device type
        alignItems: 'stretch', // Equal height for all flex items
        flexWrap: 'wrap', // Allows items to wrap on small screens
        overflow: 'hidden',
        ...style
      }}
    >
      {children}
    </div>
  );
};

// Column component - vertical flexbox layout with responsive gaps and stretch alignment
export const Column: React.FC<{
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}> = ({ children, className = '', style = {} }) => {
  const viewport = useViewport(); // Get device-specific gap size
  
  return (
    <div 
      className={`perfect-column ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column', // Stack items vertically
        gap: `var(--grid-gap-${viewport.gap})`, // Auto gap based on device type
        alignItems: 'stretch', // Full width for all flex items
        overflow: 'hidden',
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default Grid;