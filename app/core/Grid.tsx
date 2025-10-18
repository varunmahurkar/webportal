import React, { ReactNode, CSSProperties } from 'react';

/**
 * ALEXIKA Grid System
 * Responsive, adaptive grid layout components with mobile-first design
 *
 * Components:
 * - GridContainer: Main container with responsive behavior
 * - GridRow: Horizontal layout with CSS Grid and responsive columns
 * - GridColumn: Individual grid items with responsive column spanning
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
  maxWidth?: 'small' | 'medium' | 'large' | 'xlarge' | 'full';
  padding?: boolean;
}

// Responsive span configuration
export interface ResponsiveSpan {
  xs?: number;  // Mobile: < 640px
  sm?: number;  // Tablet: >= 640px
  md?: number;  // Desktop: >= 768px
  lg?: number;  // Large desktop: >= 1024px
  xl?: number;  // Extra large: >= 1280px
}

// Row component for horizontal grid layouts
export interface GridRowProps extends BaseGridProps {
  columns?: number;
  gap?: number;
  autoLayout?: boolean; // Automatically distribute columns based on children count
}

// Column component for individual grid items
export interface GridColumnProps extends BaseGridProps {
  span?: number | ResponsiveSpan;
  offset?: number;
  xs?: number;  // Mobile breakpoint
  sm?: number;  // Tablet breakpoint
  md?: number;  // Desktop breakpoint
  lg?: number;  // Large desktop breakpoint
  xl?: number;  // Extra large breakpoint
  auto?: boolean; // Auto-calculate span based on parent grid columns
}

// Flex row component
export interface FlexRowProps extends BaseGridProps {
  gap?: number;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
}

// Flex column component
export interface FlexColumnProps extends BaseGridProps {
  gap?: number;
  align?: 'start' | 'center' | 'end' | 'stretch';
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
  const maxWidthValues = {
    small: '640px',
    medium: '768px',
    large: '1024px',
    xlarge: '1280px',
    full: '100%'
  };

  const containerStyles: CSSProperties = {
    width: '100%',
    maxWidth: maxWidthValues[maxWidth],
    margin: '0 auto',
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
 * Grid row component with responsive column support and auto-layout
 * Automatically distributes columns based on children count when autoLayout is enabled
 */
export const GridRow: React.FC<GridRowProps> = ({
  children,
  columns = 12,
  gap = 1,
  autoLayout = false,
  className = '',
  style = {}
}) => {
  const childArray = React.Children.toArray(children);
  const childCount = childArray.length;

  // Calculate optimal column distribution for auto-layout
  const getAutoColumns = () => {
    if (!autoLayout || childCount === 0) return columns;

    // For 12-column grid
    if (columns === 12) {
      if (childCount === 1) return 1;
      if (childCount === 2) return 2;
      if (childCount === 3) return 3;
      if (childCount === 4) return 4;
      if (childCount === 5) return 5;
      if (childCount === 6) return 6;
      if (childCount <= 12) return childCount;
      return 12;
    }

    // For 8-column grid
    if (columns === 8) {
      if (childCount === 1) return 1;
      if (childCount === 2) return 2;
      if (childCount === 3) return 4; // 3 items: 2 in first row, 1 in second
      if (childCount === 4) return 4;
      return Math.min(childCount, 8);
    }

    // For 4-column grid
    if (columns === 4) {
      return 1; // Each div in different row
    }

    return columns;
  };

  const effectiveColumns = autoLayout ? getAutoColumns() : columns;

  const rowStyles: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${effectiveColumns}, 1fr)`,
    gap: `${gap}rem`,
    width: '100%',
    ...style
  };

  // Auto-apply span to children if autoLayout is enabled
  const processedChildren = autoLayout ? React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const spanValue = Math.floor(columns / effectiveColumns);
      return React.cloneElement(child as React.ReactElement<any>, {
        auto: true,
        span: spanValue
      });
    }
    return child;
  }) : children;

  return (
    <div className={`grid-row ${className}`} style={rowStyles}>
      {processedChildren}
    </div>
  );
};

/**
 * Grid column component with responsive breakpoints
 * Supports both simple span and responsive span objects
 */
export const GridColumn: React.FC<GridColumnProps> = ({
  children,
  span = 12,
  offset = 0,
  xs,
  sm,
  md,
  lg,
  xl,
  className = '',
  style = {}
}) => {
  // Build responsive classes based on breakpoints
  const getResponsiveClasses = () => {
    const classes: string[] = [];

    // Handle responsive span object or individual breakpoint props
    const defaultSpan = typeof span === 'number' ? span : 12;
    const xsSpan = xs || (typeof span === 'object' ? span.xs : undefined) || defaultSpan;
    const smSpan = sm || (typeof span === 'object' ? span.sm : undefined);
    const mdSpan = md || (typeof span === 'object' ? span.md : undefined);
    const lgSpan = lg || (typeof span === 'object' ? span.lg : undefined);
    const xlSpan = xl || (typeof span === 'object' ? span.xl : undefined);

    // Add responsive span classes
    if (xsSpan) classes.push(`col-span-xs-${xsSpan}`);
    if (smSpan) classes.push(`col-span-sm-${smSpan}`);
    if (mdSpan) classes.push(`col-span-md-${mdSpan}`);
    if (lgSpan) classes.push(`col-span-lg-${lgSpan}`);
    if (xlSpan) classes.push(`col-span-xl-${xlSpan}`);

    return classes.join(' ');
  };

  // Only apply inline styles if offset is needed or no responsive breakpoints
  const columnStyles: CSSProperties = {
    minWidth: 0,
    ...(offset > 0 && { gridColumnStart: offset + 1 }),
    ...style
  };

  return (
    <div
      className={`grid-column ${getResponsiveClasses()} ${className}`}
      style={columnStyles}
    >
      {children}
    </div>
  );
};

/**
 * Flex row component for horizontal layouts using Flexbox
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
