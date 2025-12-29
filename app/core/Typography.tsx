/**
 * Nurav AI Typography System - Comprehensive responsive typography component
 *
 * Features:
 * - Responsive scaling using CSS clamp() for all devices (320px to 8K displays)
 * - Semantic HTML tag support for accessibility and SEO optimization
 * - Complete color system integration with theme-aware CSS variables
 * - Font weight, alignment, and spacing customization options
 * - Special text effects: gradients, truncation, line height control
 * - Convenience components for common use cases (Heading, Text, Paragraph)
 * - Full compatibility with Nurav AI Theme System
 */

import React, { ReactNode, CSSProperties } from 'react';

// Typography variants with responsive sizing using CSS clamp() for all device types (320px to 8K)
export type TypographyVariant =
  | 'display-xl'     // 40-72px - Hero headlines for landing pages
  | 'display-lg'     // 32-60px - Main headlines for sections
  | 'display-md'     // 28-48px - Section headlines and features
  | 'display-sm'     // 24-36px - Sub-section headlines
  | 'heading-xl'     // 22-30px - Large headings (H1-H2)
  | 'heading-lg'     // 20-24px - Medium headings (H3-H4)
  | 'heading-md'     // 18-20px - Small headings (H5-H6)
  | 'heading-sm'     // 16-18px - Tiny headings for cards/components
  | 'body-xl'        // 18-20px - Large body text for emphasis
  | 'body-lg'        // 16-18px - Medium body text for readability
  | 'body-md'        // 14-16px - Default body text for content
  | 'body-sm'        // 13-14px - Small body text for descriptions
  | 'body-xs'        // 12-13px - Tiny body text for footnotes
  | 'label-xl'       // 14-16px - Large labels for forms
  | 'label-lg'       // 13-14px - Medium labels for UI elements
  | 'label-md'       // 12-13px - Default labels for inputs
  | 'label-sm'       // 11-12px - Small labels for compact UI
  | 'caption'        // 11-12px - Captions for media/images
  | 'overline';      // 10-11px - Overlines for categories

// HTML semantic tags for proper accessibility and SEO
export type TypographyTag =
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' // Semantic headings
  | 'p' | 'span' | 'div' | 'label' | 'small' // Text elements
  | 'strong' | 'em' | 'mark' | 'code' | 'pre' // Emphasis elements
  | 'blockquote' | 'cite' | 'time' | 'address'; // Content elements

// Font weights from light to black for typography hierarchy
export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

// Theme-aware color variants that adapt to light/dark/custom themes
export type TextColor = 
  | 'primary'    // Main brand color from theme
  | 'secondary'  // Secondary brand color
  | 'tertiary'   // Tertiary text color for hierarchy
  | 'success'    // Green for positive actions/states
  | 'warning'    // Yellow/orange for warnings
  | 'error'      // Red for errors/destructive actions
  | 'info'       // Blue for informational content
  | 'inherit';   // Inherit from parent element

export interface TypographyProps {
  children: ReactNode;
  variant?: TypographyVariant;
  tag?: TypographyTag;
  color?: TextColor;
  weight?: FontWeight;
  align?: 'left' | 'center' | 'right' | 'justify';
  transform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  decoration?: 'none' | 'underline' | 'line-through' | 'overline';
  spacing?: 'tight' | 'normal' | 'relaxed' | 'loose';
  noWrap?: boolean;
  truncate?: boolean;
  italic?: boolean;
  gradient?: boolean;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

// Responsive font scaling using CSS clamp()
const variantStyles: Record<TypographyVariant, CSSProperties> = {
  // Display variants - for hero sections and major headlines
  'display-xl': {
    fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',        // 40px → 72px
    lineHeight: 'clamp(1.1, 1.05, 1.0)',           // Tighter for large text
    letterSpacing: '-0.02em',
    fontWeight: 800,
    marginBottom: 'clamp(1rem, 3vw, 2rem)'
  },
  'display-lg': {
    fontSize: 'clamp(2rem, 6vw, 3.75rem)',         // 32px → 60px
    lineHeight: 'clamp(1.15, 1.1, 1.05)',
    letterSpacing: '-0.015em',
    fontWeight: 700,
    marginBottom: 'clamp(0.75rem, 2.5vw, 1.5rem)'
  },
  'display-md': {
    fontSize: 'clamp(1.75rem, 5vw, 3rem)',         // 28px → 48px
    lineHeight: 'clamp(1.2, 1.15, 1.1)',
    letterSpacing: '-0.01em',
    fontWeight: 700,
    marginBottom: 'clamp(0.75rem, 2vw, 1.25rem)'
  },
  'display-sm': {
    fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',       // 24px → 36px
    lineHeight: 'clamp(1.25, 1.2, 1.15)',
    letterSpacing: '-0.005em',
    fontWeight: 600,
    marginBottom: 'clamp(0.5rem, 1.5vw, 1rem)'
  },

  // Heading variants - for section headers
  'heading-xl': {
    fontSize: 'clamp(1.375rem, 3vw, 1.875rem)',    // 22px → 30px
    lineHeight: 'clamp(1.3, 1.25, 1.2)',
    letterSpacing: '-0.003em',
    fontWeight: 600,
    marginBottom: 'clamp(0.5rem, 1.25vw, 0.875rem)'
  },
  'heading-lg': {
    fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',     // 20px → 24px
    lineHeight: 'clamp(1.35, 1.3, 1.25)',
    letterSpacing: '0',
    fontWeight: 600,
    marginBottom: 'clamp(0.375rem, 1vw, 0.75rem)'
  },
  'heading-md': {
    fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',     // 18px → 20px
    lineHeight: 'clamp(1.4, 1.35, 1.3)',
    letterSpacing: '0',
    fontWeight: 500,
    marginBottom: 'clamp(0.375rem, 0.875vw, 0.625rem)'
  },
  'heading-sm': {
    fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',      // 16px → 18px
    lineHeight: 'clamp(1.45, 1.4, 1.35)',
    letterSpacing: '0',
    fontWeight: 500,
    marginBottom: 'clamp(0.25rem, 0.75vw, 0.5rem)'
  },

  // Body variants - for content text
  'body-xl': {
    fontSize: 'clamp(1.125rem, 1.75vw, 1.25rem)',  // 18px → 20px
    lineHeight: 'clamp(1.6, 1.55, 1.5)',
    letterSpacing: '0',
    fontWeight: 400,
    marginBottom: 'clamp(0.75rem, 1vw, 1rem)'
  },
  'body-lg': {
    fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',      // 16px → 18px
    lineHeight: 'clamp(1.65, 1.6, 1.55)',
    letterSpacing: '0',
    fontWeight: 400,
    marginBottom: 'clamp(0.625rem, 0.875vw, 0.875rem)'
  },
  'body-md': {
    fontSize: 'clamp(0.875rem, 1.25vw, 1rem)',     // 14px → 16px
    lineHeight: 'clamp(1.7, 1.65, 1.6)',
    letterSpacing: '0',
    fontWeight: 400,
    marginBottom: 'clamp(0.5rem, 0.75vw, 0.75rem)'
  },
  'body-sm': {
    fontSize: 'clamp(0.8125rem, 1vw, 0.875rem)',   // 13px → 14px
    lineHeight: 'clamp(1.75, 1.7, 1.65)',
    letterSpacing: '0',
    fontWeight: 400,
    marginBottom: 'clamp(0.5rem, 0.625vw, 0.625rem)'
  },
  'body-xs': {
    fontSize: 'clamp(0.75rem, 0.875vw, 0.8125rem)', // 12px → 13px
    lineHeight: 'clamp(1.8, 1.75, 1.7)',
    letterSpacing: '0.005em',
    fontWeight: 400,
    marginBottom: 'clamp(0.375rem, 0.5vw, 0.5rem)'
  },

  // Label variants - for form labels and UI text
  'label-xl': {
    fontSize: 'clamp(0.875rem, 1.125vw, 1rem)',    // 14px → 16px
    lineHeight: '1.4',
    letterSpacing: '0',
    fontWeight: 500,
    marginBottom: 'clamp(0.25rem, 0.375vw, 0.375rem)'
  },
  'label-lg': {
    fontSize: 'clamp(0.8125rem, 1vw, 0.875rem)',   // 13px → 14px
    lineHeight: '1.4',
    letterSpacing: '0',
    fontWeight: 500,
    marginBottom: 'clamp(0.25rem, 0.375vw, 0.375rem)'
  },
  'label-md': {
    fontSize: 'clamp(0.75rem, 0.875vw, 0.8125rem)', // 12px → 13px
    lineHeight: '1.4',
    letterSpacing: '0.005em',
    fontWeight: 500,
    marginBottom: 'clamp(0.1875rem, 0.25vw, 0.25rem)'
  },
  'label-sm': {
    fontSize: 'clamp(0.6875rem, 0.75vw, 0.75rem)',  // 11px → 12px
    lineHeight: '1.4',
    letterSpacing: '0.01em',
    fontWeight: 500,
    marginBottom: 'clamp(0.1875rem, 0.25vw, 0.25rem)'
  },

  // Special variants
  'caption': {
    fontSize: 'clamp(0.6875rem, 0.75vw, 0.75rem)',  // 11px → 12px
    lineHeight: '1.5',
    letterSpacing: '0.01em',
    fontWeight: 400,
    marginBottom: 'clamp(0.25rem, 0.375vw, 0.375rem)'
  },
  'overline': {
    fontSize: 'clamp(0.625rem, 0.6875vw, 0.6875rem)', // 10px → 11px
    lineHeight: '1.2',
    letterSpacing: '0.15em',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    marginBottom: 'clamp(0.1875rem, 0.25vw, 0.25rem)'
  }
};

const colorStyles: Record<TextColor, string> = {
  primary: 'var(--text-primary)',
  secondary: 'var(--text-secondary)',
  tertiary: 'var(--text-tertiary)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  error: 'var(--color-error)',
  info: 'var(--color-info)',
  inherit: 'inherit'
};

const spacingStyles = {
  tight: { letterSpacing: '-0.025em' },
  normal: { letterSpacing: '0' },
  relaxed: { letterSpacing: '0.025em' },
  loose: { letterSpacing: '0.05em' }
};

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body-md',
  tag = 'p',
  color = 'primary',
  weight,
  align = 'left',
  transform = 'none',
  decoration = 'none',
  spacing,
  noWrap = false,
  truncate = false,
  italic = false,
  gradient = false,
  className = '',
  style = {},
  onClick
}) => {
  const Component = tag;
  const baseStyles = variantStyles[variant];
  
  const combinedStyles: CSSProperties = {
    ...baseStyles,
    color: gradient ? 'transparent' : colorStyles[color],
    fontWeight: weight || baseStyles.fontWeight,
    textAlign: align,
    textTransform: transform,
    textDecoration: decoration,
    fontStyle: italic ? 'italic' : 'normal',
    whiteSpace: noWrap ? 'nowrap' : 'normal',
    fontFamily: 'var(--font-family)',
    transition: 'all 0.2s ease',
    cursor: onClick ? 'pointer' : 'inherit',
    ...(spacing && spacingStyles[spacing]),
    ...(truncate && {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }),
    ...(gradient && {
      background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    }),
    ...style
  };

  return (
    <Component
      className={className}
      style={combinedStyles}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};

// Convenience components for common use cases
export const Heading = (props: Omit<TypographyProps, 'variant' | 'tag'> & { 
  level: 1 | 2 | 3 | 4 | 5 | 6 
}) => {
  const { level, ...rest } = props;
  const variants: Record<number, TypographyVariant> = {
    1: 'display-lg',
    2: 'display-md',
    3: 'heading-xl',
    4: 'heading-lg',
    5: 'heading-md',
    6: 'heading-sm'
  };
  
  return (
    <Typography 
      variant={variants[level]} 
      tag={`h${level}` as TypographyTag}
      {...rest} 
    />
  );
};

export const Text = (props: Omit<TypographyProps, 'tag'>) => (
  <Typography tag="span" {...props} />
);

export const Paragraph = (props: Omit<TypographyProps, 'tag'>) => (
  <Typography tag="p" {...props} />
);

export const Label = (props: Omit<TypographyProps, 'variant' | 'tag'>) => (
  <Typography variant="label-md" tag="label" {...props} />
);

export const Caption = (props: Omit<TypographyProps, 'variant' | 'tag'>) => (
  <Typography variant="caption" tag="small" {...props} />
);

export const Code = (props: Omit<TypographyProps, 'tag'>) => (
  <Typography tag="code" {...props} />
);

export default Typography;