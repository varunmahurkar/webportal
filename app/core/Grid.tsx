import React, { ReactNode, CSSProperties } from 'react';

/**
 * ALEXIKA Grid System
 * Simple, clean, and optimized layout components for modern web applications
 * 
 * Components:
 * - GridContainer: Main container with responsive behavior
 * - GridRow: Horizontal layout with CSS Grid
 * - GridColumn: Individual grid items with column spanning
 * - FlexRow: Horizontal flexbox layout
 * - FlexColumn: Vertical flexbox layout
 */

// Base props interface for all grid components
interface BaseGridProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

// Container component for main layout wrapper
export interface GridContainerProps extends BaseGridProps {
  maxWidth?: 'small' | 'medium' | 'large' | 'full'; // Container width limits
  padding?: boolean; // Whether to add internal padding
}

// Row component for horizontal grid layouts
export interface GridRowProps extends BaseGridProps {
  columns?: number; // Number of grid columns (default: 12)
  gap?: number; // Gap between items in rem (default: 1)
}

// Column component for individual grid items
export interface GridColumnProps extends BaseGridProps {
  span?: number; // How many columns to span (1-12)
  offset?: number; // How many columns to offset from left
}

// Flex row component for horizontal flexbox layouts
export interface FlexRowProps extends BaseGridProps {
  gap?: number; // Gap between items in rem
  align?: 'start' | 'center' | 'end' | 'stretch'; // Vertical alignment
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'; // Horizontal alignment
  wrap?: boolean; // Allow items to wrap to next line
}

// Flex column component for vertical flexbox layouts
export interface FlexColumnProps extends BaseGridProps {
  gap?: number; // Gap between items in rem
  align?: 'start' | 'center' | 'end' | 'stretch'; // Horizontal alignment
}

/**
 * Main container component for page layouts
 * Provides responsive max-width and optional padding
 */
export const GridContainer: React.FC<GridContainerProps> = ({
  children,
  maxWidth = 'large',
  padding = true,
  className = '',
  style = {}
}) => {
  // Define responsive max-width values
  const maxWidthValues = {
    small: '640px',   // Mobile-first layouts
    medium: '768px',  // Tablet layouts
    large: '1024px',  // Desktop layouts
    full: '100%'      // Full-width layouts
  };

  const containerStyles: CSSProperties = {
    width: '100%',
    maxWidth: maxWidthValues[maxWidth],
    margin: '0 auto', // Center the container
    padding: padding ? '0 1rem' : '0',
    boxSizing: 'border-box',
    ...style
  };

  return (
    <div className={`grid-container ${className}`} style={containerStyles}>
      {children}
    </div>
  );
};

/**
 * Grid row component for horizontal layouts using CSS Grid
 * Creates equal-width columns that automatically wrap
 */
export const GridRow: React.FC<GridRowProps> = ({
  children,
  columns = 12,
  gap = 1,
  className = '',
  style = {}
}) => {
  const rowStyles: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: `${gap}rem`,
    width: '100%',
    ...style
  };

  return (
    <div className={`grid-row ${className}`} style={rowStyles}>
      {children}
    </div>
  );
};

/**
 * Grid column component for individual items within a grid row
 * Allows spanning multiple columns and offset positioning
 */
export const GridColumn: React.FC<GridColumnProps> = ({
  children,
  span = 1,
  offset = 0,
  className = '',
  style = {}
}) => {
  const columnStyles: CSSProperties = {
    gridColumn: `${offset + 1} / span ${span}`,
    minWidth: 0, // Prevents overflow issues
    ...style
  };

  return (
    <div className={`grid-column ${className}`} style={columnStyles}>
      {children}
    </div>
  );
};

/**
 * Flex row component for horizontal layouts using Flexbox
 * More flexible than CSS Grid for dynamic content
 */
export const FlexRow: React.FC<FlexRowProps> = ({
  children,
  gap = 1,
  align = 'stretch',
  justify = 'start',
  wrap = true,
  className = '',
  style = {}
}) => {
  // Map alignment props to CSS values
  const alignmentMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch'
  };

  const justificationMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around'
  };

  const rowStyles: CSSProperties = {
    display: 'flex',
    gap: `${gap}rem`,
    alignItems: alignmentMap[align],
    justifyContent: justificationMap[justify],
    flexWrap: wrap ? 'wrap' : 'nowrap',
    ...style
  };

  return (
    <div className={`flex-row ${className}`} style={rowStyles}>
      {children}
    </div>
  );
};

/**
 * Flex column component for vertical layouts using Flexbox
 * Stacks items vertically with configurable spacing and alignment
 */
export const FlexColumn: React.FC<FlexColumnProps> = ({
  children,
  gap = 1,
  align = 'stretch',
  className = '',
  style = {}
}) => {
  const alignmentMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch'
  };

  const columnStyles: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: `${gap}rem`,
    alignItems: alignmentMap[align],
    ...style
  };

  return (
    <div className={`flex-column ${className}`} style={columnStyles}>
      {children}
    </div>
  );
};

// Export aliases for backward compatibility
export const Grid = GridRow;
export const GridItem = GridColumn;
export const Container = GridContainer;
export const Row = FlexRow;
export const Column = FlexColumn;

export default GridContainer;