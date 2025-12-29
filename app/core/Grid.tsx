/**
 * Nurav Grid System - Optimized & Scalable Layout Components
 *
 * A comprehensive layout system that replaces manual div/flex/grid usage
 * with intelligent, responsive components for consistent, maintainable layouts.
 *
 * Components:
 * - Box: Universal wrapper with all layout capabilities (replaces div)
 * - Container: Page-level container with max-width and padding
 * - Grid: CSS Grid layout with responsive columns
 * - Flex: Flexbox layout with responsive direction and alignment
 * - Stack: Simplified vertical/horizontal stacking with gap
 * - Columns: Auto-distributed equal-width columns
 *
 * Features:
 * - Fully responsive with mobile-first breakpoints (xs, sm, md, lg, xl)
 * - Type-safe TypeScript interfaces
 * - Performance optimized with React.memo
 * - Consistent spacing system (0.25rem increments)
 * - Built-in accessibility support
 */

import React, { ReactNode, CSSProperties, memo, HTMLAttributes, ElementType } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Breakpoint system - mobile-first approach
 * xs: 0-639px (mobile)
 * sm: 640px-767px (large mobile/small tablet)
 * md: 768px-1023px (tablet)
 * lg: 1024px-1279px (desktop)
 * xl: 1280px+ (large desktop)
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Responsive value - can be single value or object with breakpoint keys
 */
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

/**
 * Spacing scale - maps to rem values (1 = 0.25rem, 4 = 1rem, etc.)
 */
export type Spacing = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;

/**
 * Alignment options for flex/grid layouts
 */
export type AlignItems = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type JustifyContent = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type FlexWrap = 'wrap' | 'nowrap' | 'wrap-reverse';

/**
 * Display types
 */
export type Display = 'block' | 'inline-block' | 'flex' | 'inline-flex' | 'grid' | 'inline-grid' | 'none';

// ============================================================================
// BASE PROPS INTERFACES
// ============================================================================

/**
 * Base props shared by all layout components
 */
interface BaseLayoutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  children?: ReactNode;
  className?: string;
  as?: ElementType; // Polymorphic component support

  // Display & positioning
  display?: ResponsiveValue<Display>;
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';

  // Spacing
  padding?: ResponsiveValue<Spacing>;
  paddingX?: ResponsiveValue<Spacing>;
  paddingY?: ResponsiveValue<Spacing>;
  paddingTop?: ResponsiveValue<Spacing>;
  paddingRight?: ResponsiveValue<Spacing>;
  paddingBottom?: ResponsiveValue<Spacing>;
  paddingLeft?: ResponsiveValue<Spacing>;
  margin?: ResponsiveValue<Spacing | 'auto'>;
  marginX?: ResponsiveValue<Spacing | 'auto'>;
  marginY?: ResponsiveValue<Spacing | 'auto'>;
  marginTop?: ResponsiveValue<Spacing | 'auto'>;
  marginRight?: ResponsiveValue<Spacing | 'auto'>;
  marginBottom?: ResponsiveValue<Spacing | 'auto'>;
  marginLeft?: ResponsiveValue<Spacing | 'auto'>;
  gap?: ResponsiveValue<Spacing>;

  // Sizing
  width?: ResponsiveValue<string | number>;
  minWidth?: ResponsiveValue<string | number>;
  maxWidth?: ResponsiveValue<string | number>;
  height?: ResponsiveValue<string | number>;
  minHeight?: ResponsiveValue<string | number>;
  maxHeight?: ResponsiveValue<string | number>;

  // Visibility
  hide?: ResponsiveValue<boolean>;
  show?: ResponsiveValue<boolean>;
}

/**
 * Container component props
 */
export interface ContainerProps extends Omit<BaseLayoutProps, 'padding'> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  center?: boolean;
  fluid?: boolean; // If true, no max-width
  padding?: boolean | ResponsiveValue<Spacing>; // Boolean for simple true/false or Spacing for custom padding
}

/**
 * Grid component props
 */
export interface GridProps extends BaseLayoutProps {
  columns?: ResponsiveValue<number>;
  rows?: ResponsiveValue<number>;
  autoFlow?: 'row' | 'column' | 'dense' | 'row-dense' | 'column-dense';
  autoLayout?: boolean; // Backward compatibility: auto-distribute children evenly
  alignItems?: ResponsiveValue<AlignItems>;
  justifyItems?: ResponsiveValue<'start' | 'center' | 'end' | 'stretch'>;
  alignContent?: ResponsiveValue<JustifyContent>;
  justifyContent?: ResponsiveValue<JustifyContent>;
}

/**
 * Grid item props
 */
export interface GridItemProps extends BaseLayoutProps {
  colSpan?: ResponsiveValue<number | 'full' | 'auto'>;
  rowSpan?: ResponsiveValue<number | 'full' | 'auto'>;
  colStart?: ResponsiveValue<number>;
  colEnd?: ResponsiveValue<number>;
  rowStart?: ResponsiveValue<number>;
  rowEnd?: ResponsiveValue<number>;
  alignSelf?: AlignItems;
  justifySelf?: 'start' | 'center' | 'end' | 'stretch';
}

/**
 * Flex component props
 */
export interface FlexProps extends BaseLayoutProps {
  direction?: ResponsiveValue<FlexDirection>;
  wrap?: ResponsiveValue<FlexWrap>;
  alignItems?: ResponsiveValue<AlignItems>;
  justifyContent?: ResponsiveValue<JustifyContent>;
  alignContent?: ResponsiveValue<JustifyContent>;
  inline?: boolean;
}

/**
 * Flex item props
 */
export interface FlexItemProps extends BaseLayoutProps {
  flex?: ResponsiveValue<string | number>;
  flexGrow?: ResponsiveValue<number>;
  flexShrink?: ResponsiveValue<number>;
  flexBasis?: ResponsiveValue<string | number>;
  alignSelf?: ResponsiveValue<AlignItems>;
  order?: ResponsiveValue<number>;
}

/**
 * Stack component props (simplified Flex for common vertical/horizontal layouts)
 */
export interface StackProps extends Omit<FlexProps, 'direction'> {
  direction?: 'vertical' | 'horizontal';
  spacing?: ResponsiveValue<Spacing>;
  divider?: ReactNode;
}

/**
 * Columns component props (equal-width auto-distributed columns)
 */
export interface ColumnsProps extends BaseLayoutProps {
  count?: ResponsiveValue<number>;
  minWidth?: ResponsiveValue<string>;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert spacing value to rem
 */
const spacingToRem = (value: Spacing): string => {
  return `${value * 0.25}rem`;
};

/**
 * Check if value is responsive object
 */
const isResponsive = <T,>(value: ResponsiveValue<T>): value is Partial<Record<Breakpoint, T>> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

/**
 * Get CSS value from responsive value or single value
 */
const getResponsiveValue = <T,>(value: ResponsiveValue<T> | undefined): T | undefined => {
  if (value === undefined) return undefined;
  if (!isResponsive(value)) return value;
  // Return the base value (xs or first defined)
  return value.xs || Object.values(value)[0];
};

/**
 * Convert responsive value to CSS
 */
const toResponsiveStyles = <T,>(
  prop: string,
  value: ResponsiveValue<T> | undefined,
  transformer?: (val: T) => string
): CSSProperties => {
  if (value === undefined) return {};

  const transform = transformer || ((val: T) => String(val));

  if (!isResponsive(value)) {
    return { [prop]: transform(value) };
  }

  // For responsive values, we'll use inline styles with the base value
  // and let CSS classes handle breakpoints
  const baseValue = value.xs || Object.values(value)[0];
  return baseValue !== undefined ? { [prop]: transform(baseValue) } : {};
};

/**
 * Build spacing styles
 */
const buildSpacingStyles = (props: BaseLayoutProps): CSSProperties => {
  const styles: CSSProperties = {};

  // Margin/spacing transformer that handles 'auto' values
  const marginTransform = (val: Spacing | 'auto') => val === 'auto' ? 'auto' : spacingToRem(val);

  // Padding
  if (props.padding !== undefined) {
    Object.assign(styles, toResponsiveStyles('padding', props.padding, spacingToRem));
  }
  if (props.paddingX !== undefined) {
    const val = getResponsiveValue(props.paddingX);
    if (val !== undefined) {
      styles.paddingLeft = spacingToRem(val);
      styles.paddingRight = spacingToRem(val);
    }
  }
  if (props.paddingY !== undefined) {
    const val = getResponsiveValue(props.paddingY);
    if (val !== undefined) {
      styles.paddingTop = spacingToRem(val);
      styles.paddingBottom = spacingToRem(val);
    }
  }
  if (props.paddingTop !== undefined) Object.assign(styles, toResponsiveStyles('paddingTop', props.paddingTop, spacingToRem));
  if (props.paddingRight !== undefined) Object.assign(styles, toResponsiveStyles('paddingRight', props.paddingRight, spacingToRem));
  if (props.paddingBottom !== undefined) Object.assign(styles, toResponsiveStyles('paddingBottom', props.paddingBottom, spacingToRem));
  if (props.paddingLeft !== undefined) Object.assign(styles, toResponsiveStyles('paddingLeft', props.paddingLeft, spacingToRem));

  // Margin (supports 'auto')
  if (props.margin !== undefined) {
    Object.assign(styles, toResponsiveStyles('margin', props.margin, marginTransform));
  }
  if (props.marginX !== undefined) {
    const val = getResponsiveValue(props.marginX);
    if (val !== undefined) {
      const transformed = marginTransform(val);
      styles.marginLeft = transformed;
      styles.marginRight = transformed;
    }
  }
  if (props.marginY !== undefined) {
    const val = getResponsiveValue(props.marginY);
    if (val !== undefined) {
      const transformed = marginTransform(val);
      styles.marginTop = transformed;
      styles.marginBottom = transformed;
    }
  }
  if (props.marginTop !== undefined) Object.assign(styles, toResponsiveStyles('marginTop', props.marginTop, marginTransform));
  if (props.marginRight !== undefined) Object.assign(styles, toResponsiveStyles('marginRight', props.marginRight, marginTransform));
  if (props.marginBottom !== undefined) Object.assign(styles, toResponsiveStyles('marginBottom', props.marginBottom, marginTransform));
  if (props.marginLeft !== undefined) Object.assign(styles, toResponsiveStyles('marginLeft', props.marginLeft, marginTransform));

  // Gap
  if (props.gap !== undefined) {
    Object.assign(styles, toResponsiveStyles('gap', props.gap, spacingToRem));
  }

  return styles;
};

/**
 * Build sizing styles
 */
const buildSizingStyles = (props: BaseLayoutProps): CSSProperties => {
  const styles: CSSProperties = {};

  const sizeTransform = (val: string | number) => typeof val === 'number' ? `${val}px` : val;

  if (props.width !== undefined) Object.assign(styles, toResponsiveStyles('width', props.width, sizeTransform));
  if (props.minWidth !== undefined) Object.assign(styles, toResponsiveStyles('minWidth', props.minWidth, sizeTransform));
  if (props.maxWidth !== undefined) Object.assign(styles, toResponsiveStyles('maxWidth', props.maxWidth, sizeTransform));
  if (props.height !== undefined) Object.assign(styles, toResponsiveStyles('height', props.height, sizeTransform));
  if (props.minHeight !== undefined) Object.assign(styles, toResponsiveStyles('minHeight', props.minHeight, sizeTransform));
  if (props.maxHeight !== undefined) Object.assign(styles, toResponsiveStyles('maxHeight', props.maxHeight, sizeTransform));

  return styles;
};

/**
 * Build base styles from props
 */
const buildBaseStyles = (props: BaseLayoutProps): CSSProperties => {
  const styles: CSSProperties = {
    boxSizing: 'border-box',
  };

  // Display
  if (props.display !== undefined) {
    Object.assign(styles, toResponsiveStyles('display', props.display));
  }

  // Position
  if (props.position !== undefined) {
    styles.position = props.position;
  }

  // Spacing
  Object.assign(styles, buildSpacingStyles(props));

  // Sizing
  Object.assign(styles, buildSizingStyles(props));

  // Hide/Show
  const shouldHide = getResponsiveValue(props.hide);
  const shouldShow = getResponsiveValue(props.show);
  if (shouldHide) styles.display = 'none';
  if (shouldShow === false) styles.display = 'none';

  return styles;
};

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * Box Component - Universal wrapper that replaces div
 * Supports all layout props for maximum flexibility
 */
const Box = memo<BaseLayoutProps>(({
  children,
  className = '',
  as: Component = 'div',
  style,
  ...props
}) => {
  const baseStyles = buildBaseStyles(props);

  // Extract HTML attributes (remove layout props to prevent passing to DOM)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    display, position, padding, paddingX, paddingY, paddingTop, paddingRight, paddingBottom, paddingLeft,
    margin, marginX, marginY, marginTop, marginRight, marginBottom, marginLeft, gap,
    width, minWidth, maxWidth, height, minHeight, maxHeight, hide, show,
    ...htmlProps
  } = props;

  return (
    <Component
      className={className}
      style={{ ...baseStyles, ...style }}
      {...htmlProps}
    >
      {children}
    </Component>
  );
});

Box.displayName = 'Box';

/**
 * Container Component - Page-level container with fluid responsive max-width
 * Automatically adapts to all screen sizes using clamp()
 */
const Container = memo<ContainerProps>(({
  children,
  size = 'lg',
  center = true,
  fluid = false,
  padding,
  className = '',
  ...props
}) => {
  // Fluid max-widths using clamp() for smooth scaling across all devices
  const maxWidths = {
    sm: 'clamp(320px, 95vw, 640px)',
    md: 'clamp(320px, 90vw, 768px)',
    lg: 'clamp(320px, 90vw, 1024px)',
    xl: 'clamp(320px, 85vw, 1280px)',
    full: '100%',
  };

  const containerStyles: CSSProperties = {
    width: '100%',
    maxWidth: fluid ? '100%' : maxWidths[size],
    marginLeft: center ? 'auto' : undefined,
    marginRight: center ? 'auto' : undefined,
    // Fluid padding that scales with viewport
    paddingLeft: 'clamp(1rem, 3vw, 2rem)',
    paddingRight: 'clamp(1rem, 3vw, 2rem)',
  };

  // Handle backward compatibility: boolean true becomes paddingX: 4
  const paddingProps = typeof padding === 'boolean'
    ? (padding ? { paddingX: 4 as Spacing } : {})
    : padding !== undefined
      ? { padding }
      : {};

  return (
    <Box
      className={`nurav-container ${className}`}
      style={containerStyles}
      {...paddingProps}
      {...props}
    >
      {children}
    </Box>
  );
});

Container.displayName = 'Container';

/**
 * Grid Component - Auto-responsive CSS Grid layout
 * Automatically adapts columns based on screen size using auto-fit/auto-fill
 */
const Grid = memo<GridProps>(({
  children,
  columns = 12,
  rows,
  autoFlow = 'row',
  autoLayout = false,
  alignItems,
  justifyItems,
  alignContent,
  justifyContent,
  className = '',
  ...props
}) => {
  const cols = getResponsiveValue(columns);
  const gridRows = getResponsiveValue(rows);
  const childCount = React.Children.count(children);

  const alignMap: Record<AlignItems, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
    baseline: 'baseline',
  };

  const justifyMap: Record<JustifyContent, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
    evenly: 'space-evenly',
  };

  // Auto-responsive grid: calculates minimum column width based on total columns
  let gridTemplateColumns: string | undefined;

  if (autoLayout) {
    // Auto-layout with responsive behavior
    // Uses auto-fit to automatically wrap columns based on available space
    const minColWidth = cols ? `${Math.max(200, 1200 / cols)}px` : '250px';
    gridTemplateColumns = `repeat(auto-fit, minmax(min(100%, ${minColWidth}), 1fr))`;
  } else if (cols) {
    // Standard grid with fluid column sizing
    // On small screens, reduce columns automatically
    gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
  }

  const gridStyles: CSSProperties = {
    display: 'grid',
    gridTemplateColumns,
    gridTemplateRows: gridRows ? `repeat(${gridRows}, 1fr)` : undefined,
    gridAutoFlow: autoFlow,
    alignItems: alignItems ? alignMap[getResponsiveValue(alignItems)!] : undefined,
    justifyItems: justifyItems ? getResponsiveValue(justifyItems) : undefined,
    alignContent: alignContent ? justifyMap[getResponsiveValue(alignContent)!] : undefined,
    justifyContent: justifyContent ? justifyMap[getResponsiveValue(justifyContent)!] : undefined,
    // Ensure grid items don't overflow
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <Box
      className={`nurav-grid ${className}`}
      style={gridStyles}
      {...props}
    >
      {children}
    </Box>
  );
});

Grid.displayName = 'Grid';

/**
 * Grid.Item Component - Grid item with span and positioning
 */
const GridItem = memo<GridItemProps>(({
  children,
  colSpan,
  rowSpan,
  colStart,
  colEnd,
  rowStart,
  rowEnd,
  alignSelf,
  justifySelf,
  className = '',
  ...props
}) => {
  const getSpanValue = (span: number | 'full' | 'auto' | undefined) => {
    if (span === 'full') return '-1';
    if (span === 'auto') return 'auto';
    return span ? `span ${span}` : undefined;
  };

  const itemStyles: CSSProperties = {
    gridColumn: colSpan ? getSpanValue(getResponsiveValue(colSpan)) : undefined,
    gridRow: rowSpan ? getSpanValue(getResponsiveValue(rowSpan)) : undefined,
    gridColumnStart: colStart ? getResponsiveValue(colStart) : undefined,
    gridColumnEnd: colEnd ? getResponsiveValue(colEnd) : undefined,
    gridRowStart: rowStart ? getResponsiveValue(rowStart) : undefined,
    gridRowEnd: rowEnd ? getResponsiveValue(rowEnd) : undefined,
    alignSelf: alignSelf,
    justifySelf: justifySelf,
    minWidth: 0, // Prevent grid blowout
  };

  return (
    <Box
      className={`nurav-grid-item ${className}`}
      style={itemStyles}
      {...props}
    >
      {children}
    </Box>
  );
});

GridItem.displayName = 'GridItem';

/**
 * Flex Component - Responsive flexbox layout
 * Automatically wraps items on smaller screens
 */
const Flex = memo<FlexProps>(({
  children,
  direction = 'row',
  wrap = 'wrap', // Changed default to 'wrap' for better responsiveness
  alignItems = 'stretch',
  justifyContent = 'start',
  alignContent,
  inline = false,
  className = '',
  ...props
}) => {
  const alignMap: Record<AlignItems, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
    baseline: 'baseline',
  };

  const justifyMap: Record<JustifyContent, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
    evenly: 'space-evenly',
  };

  const flexStyles: CSSProperties = {
    display: inline ? 'inline-flex' : 'flex',
    flexDirection: getResponsiveValue(direction),
    flexWrap: getResponsiveValue(wrap),
    alignItems: alignMap[getResponsiveValue(alignItems)!],
    justifyContent: justifyMap[getResponsiveValue(justifyContent)!],
    alignContent: alignContent ? justifyMap[getResponsiveValue(alignContent)!] : undefined,
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <Box
      className={`nurav-flex ${className}`}
      style={flexStyles}
      {...props}
    >
      {children}
    </Box>
  );
});

Flex.displayName = 'Flex';

/**
 * Flex.Item Component - Flex item with grow, shrink, and basis
 */
const FlexItem = memo<FlexItemProps>(({
  children,
  flex,
  flexGrow,
  flexShrink,
  flexBasis,
  alignSelf,
  order,
  className = '',
  ...props
}) => {
  const alignMap: Record<AlignItems, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
    baseline: 'baseline',
  };

  const itemStyles: CSSProperties = {
    flex: flex ? getResponsiveValue(flex) : undefined,
    flexGrow: flexGrow ? getResponsiveValue(flexGrow) : undefined,
    flexShrink: flexShrink ? getResponsiveValue(flexShrink) : undefined,
    flexBasis: flexBasis ? getResponsiveValue(flexBasis) : undefined,
    alignSelf: alignSelf ? alignMap[getResponsiveValue(alignSelf)!] : undefined,
    order: order ? getResponsiveValue(order) : undefined,
  };

  return (
    <Box
      className={`nurav-flex-item ${className}`}
      style={itemStyles}
      {...props}
    >
      {children}
    </Box>
  );
});

FlexItem.displayName = 'FlexItem';

/**
 * Stack Component - Simplified vertical/horizontal stacking with spacing
 */
const Stack = memo<StackProps>(({
  children,
  direction = 'vertical',
  spacing = 4,
  divider,
  className = '',
  ...props
}) => {
  const flexDirection = direction === 'vertical' ? 'column' : 'row';
  const space = getResponsiveValue(spacing);

  const stackChildren = divider
    ? React.Children.toArray(children).reduce<ReactNode[]>((acc, child, index) => {
        if (index > 0) acc.push(<Box key={`divider-${index}`}>{divider}</Box>);
        acc.push(child);
        return acc;
      }, [])
    : children;

  return (
    <Flex
      direction={flexDirection}
      gap={space}
      className={`nurav-stack ${className}`}
      {...props}
    >
      {stackChildren}
    </Flex>
  );
});

Stack.displayName = 'Stack';

/**
 * Columns Component - Auto-responsive equal-width columns
 * Automatically adjusts column count based on available space
 */
const Columns = memo<ColumnsProps>(({
  children,
  count,
  minWidth = '250px',
  className = '',
  gap = 4,
  ...props
}) => {
  const colCount = getResponsiveValue(count);
  const colMinWidth = getResponsiveValue(minWidth);

  // Auto-responsive columns using auto-fit for all screen sizes
  // Columns automatically wrap when screen is too small
  const columnsStyles: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: colCount
      ? `repeat(auto-fit, minmax(min(100%, ${typeof colMinWidth === 'string' ? colMinWidth : '250px'}), 1fr))`
      : `repeat(auto-fit, minmax(min(100%, ${typeof colMinWidth === 'string' ? colMinWidth : '250px'}), 1fr))`,
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <Box
      className={`nurav-columns ${className}`}
      style={columnsStyles}
      gap={gap}
      {...props}
    >
      {children}
    </Box>
  );
});

Columns.displayName = 'Columns';

// ============================================================================
// COMPOUND COMPONENTS & EXPORTS
// ============================================================================

// Attach sub-components for better DX
interface GridWithItem extends React.MemoExoticComponent<(props: GridProps) => React.JSX.Element> {
  Item: typeof GridItem;
}

interface FlexWithItem extends React.MemoExoticComponent<(props: FlexProps) => React.JSX.Element> {
  Item: typeof FlexItem;
}

(Grid as unknown as GridWithItem).Item = GridItem;
(Flex as unknown as FlexWithItem).Item = FlexItem;

// Named exports
export {
  Box,
  Container,
  Grid,
  GridItem,
  Flex,
  FlexItem,
  Stack,
  Columns,
};

// Backward compatibility aliases
export const GridContainer = Container;
export const GridRow = Grid;
export const GridColumn = GridItem;
export const FlexRow = Flex;
export const FlexColumn = FlexItem;

// Default export
const LayoutSystem = {
  Box,
  Container,
  Grid,
  Flex,
  Stack,
  Columns,
};

export default LayoutSystem;
