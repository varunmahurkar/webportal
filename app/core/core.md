# ALEXIKA AI Core Components

This document provides comprehensive usage examples for the core components: **ThemeWrapper** and **Typography**.

## ThemeWrapper

The ThemeWrapper provides centralized theme management with three modes: light, dark, and custom themes.

### Basic Setup

```tsx
import ThemeWrapper from "./core/ThemeWrapper";

export default function App() {
  return (
    <ThemeWrapper>
      {children}
    </ThemeWrapper>
  );
}
```

### Theme Modes

#### 1. Light Theme (Default)
Professional light theme with clean aesthetics.

```tsx
// Automatically applied - no additional code needed
// Uses professional light colors with blue primary
```

#### 2. Dark Theme
GitHub-inspired dark theme for reduced eye strain.

```tsx
// Switch via dropdown or programmatically:
const { updateTheme } = useTheme();
updateTheme({ mode: "dark" });
```

#### 3. Custom Theme
Dynamic color palette generation from a single primary color.

```tsx
// Switch to custom mode and set primary color:
const { updateTheme } = useTheme();
updateTheme({ 
  mode: "custom",
  primaryColor: "#386641"
});
```

### Using Theme Colors in Components

```tsx
// CSS Variables automatically available:
<div style={{
  backgroundColor: "var(--bg-primary)",
  color: "var(--text-primary)",
  borderColor: "var(--border-color)"
}}>
  Content
</div>

// Available CSS Variables:
// Colors: --color-primary, --color-secondary, --color-success, 
//         --color-warning, --color-error, --color-info
// Backgrounds: --bg-primary, --bg-secondary, --bg-tertiary
// Text: --text-primary, --text-secondary, --text-tertiary
// Borders: --border-color, --border-hover
// Shadows: --shadow-light, --shadow-medium
// Font: --font-family
```

### Theme Context Hook

```tsx
import { useTheme } from "./core/ThemeWrapper";

function MyComponent() {
  const { config, updateTheme, isDark } = useTheme();
  
  return (
    <div>
      <p>Current theme: {config.mode}</p>
      <p>Primary color: {config.primaryColor}</p>
      <p>Is dark mode: {isDark}</p>
      
      <button onClick={() => updateTheme({ mode: "dark" })}>
        Switch to Dark
      </button>
    </div>
  );
}
```

---

## Typography

Comprehensive typography system with responsive scaling for all devices (320px to 8K displays).

### Import Options

```tsx
// Default import
import Typography from "./core/Typography";

// Named imports for convenience components
import Typography, { 
  Heading, 
  Text, 
  Paragraph, 
  Label, 
  Caption, 
  Code 
} from "./core/Typography";
```

### Typography Variants

#### Display Variants (Hero Headlines)
```tsx
<Typography variant="display-xl">Hero Headlines</Typography>    // 40-72px
<Typography variant="display-lg">Main Headlines</Typography>    // 32-60px  
<Typography variant="display-md">Section Headlines</Typography>  // 28-48px
<Typography variant="display-sm">Sub Headlines</Typography>     // 24-36px
```

#### Heading Variants (Semantic Headers)
```tsx
<Typography variant="heading-xl">Large Headings</Typography>     // 22-30px
<Typography variant="heading-lg">Medium Headings</Typography>    // 20-24px
<Typography variant="heading-md">Small Headings</Typography>     // 18-20px
<Typography variant="heading-sm">Tiny Headings</Typography>      // 16-18px
```

#### Body Text Variants
```tsx
<Typography variant="body-xl">Large body text</Typography>       // 18-20px
<Typography variant="body-lg">Medium body text</Typography>      // 16-18px
<Typography variant="body-md">Default body text</Typography>     // 14-16px
<Typography variant="body-sm">Small body text</Typography>       // 13-14px
<Typography variant="body-xs">Tiny body text</Typography>        // 12-13px
```

#### UI Text Variants
```tsx
<Typography variant="label-xl">Large Labels</Typography>         // 14-16px
<Typography variant="label-lg">Medium Labels</Typography>        // 13-14px
<Typography variant="label-md">Default Labels</Typography>       // 12-13px
<Typography variant="label-sm">Small Labels</Typography>         // 11-12px
<Typography variant="caption">Caption text</Typography>          // 11-12px
<Typography variant="overline">OVERLINE TEXT</Typography>        // 10-11px
```

### Colors

```tsx
<Typography color="primary">Primary text</Typography>
<Typography color="secondary">Secondary text</Typography>
<Typography color="tertiary">Tertiary text</Typography>
<Typography color="success">Success text</Typography>
<Typography color="warning">Warning text</Typography>
<Typography color="error">Error text</Typography>
<Typography color="info">Info text</Typography>
<Typography color="inherit">Inherit color</Typography>
```

### Font Weights

```tsx
<Typography weight={300}>Light</Typography>
<Typography weight={400}>Regular</Typography>
<Typography weight={500}>Medium</Typography>
<Typography weight={600}>Semi-bold</Typography>
<Typography weight={700}>Bold</Typography>
<Typography weight={800}>Extra-bold</Typography>
```

### Text Alignment

```tsx
<Typography align="left">Left aligned</Typography>
<Typography align="center">Center aligned</Typography>
<Typography align="right">Right aligned</Typography>
<Typography align="justify">Justified text</Typography>
```

### Text Transformations & Decorations

```tsx
<Typography transform="uppercase">UPPERCASE TEXT</Typography>
<Typography transform="lowercase">lowercase text</Typography>
<Typography transform="capitalize">Capitalized Text</Typography>

<Typography decoration="underline">Underlined text</Typography>
<Typography decoration="line-through">Strikethrough text</Typography>
<Typography decoration="overline">Overlined text</Typography>

<Typography italic>Italic text</Typography>
```

### Special Features

```tsx
// Gradient text
<Typography gradient>Gradient colored text</Typography>

// No wrap (prevents line breaks)
<Typography noWrap>This text won't wrap to next line</Typography>

// Truncate with ellipsis
<Typography truncate>This very long text will be truncated...</Typography>

// Letter spacing
<Typography spacing="tight">Tight spacing</Typography>
<Typography spacing="normal">Normal spacing</Typography>
<Typography spacing="relaxed">Relaxed spacing</Typography>
<Typography spacing="loose">Loose spacing</Typography>
```

### HTML Tags

```tsx
<Typography tag="h1">Renders as H1 tag</Typography>
<Typography tag="p">Renders as P tag</Typography>
<Typography tag="span">Renders as SPAN tag</Typography>
<Typography tag="label">Renders as LABEL tag</Typography>
<Typography tag="code">Renders as CODE tag</Typography>

// Available tags: h1-h6, p, span, div, label, small, strong, em, 
//                 mark, code, pre, blockquote, cite, time, address
```

### Convenience Components

```tsx
// Semantic headings with proper tags
<Heading level={1}>H1 Heading</Heading>   // h1 tag, display-lg variant
<Heading level={2}>H2 Heading</Heading>   // h2 tag, display-md variant  
<Heading level={3}>H3 Heading</Heading>   // h3 tag, heading-xl variant
<Heading level={4}>H4 Heading</Heading>   // h4 tag, heading-lg variant
<Heading level={5}>H5 Heading</Heading>   // h5 tag, heading-md variant
<Heading level={6}>H6 Heading</Heading>   // h6 tag, heading-sm variant

// Inline text (span tag)
<Text>Inline text content</Text>

// Paragraph text (p tag)
<Paragraph>Block paragraph content</Paragraph>

// Form labels (label tag, label-md variant)
<Label>Form field label</Label>

// Captions (small tag, caption variant)  
<Caption>Image or media caption</Caption>

// Code snippets (code tag)
<Code>console.log('Hello World')</Code>
```

### Complete Example

```tsx
import Typography, { Heading, Text, Paragraph, Label } from "./core/Typography";

function ArticleComponent() {
  return (
    <article>
      {/* Hero section */}
      <Typography variant="display-xl" gradient align="center">
        Main Article Title
      </Typography>
      
      <Typography variant="body-lg" color="secondary" align="center">
        Article subtitle with secondary color
      </Typography>

      {/* Content sections */}
      <section>
        <Heading level={2}>Section Heading</Heading>
        <Paragraph variant="body-md">
          This is the main content paragraph with perfect readability 
          across all device sizes from mobile to desktop.
        </Paragraph>
        
        <Paragraph variant="body-sm" color="secondary">
          Supporting text with smaller font size and secondary color.
        </Paragraph>
      </section>

      {/* Interactive elements */}
      <div>
        <Label>Form Field</Label>
        <Text weight={500} color="success">Success message</Text>
        <Text weight={400} color="error">Error message</Text>
      </div>

      {/* Code example */}
      <pre style={{ backgroundColor: "var(--bg-secondary)" }}>
        <Code>const example = "responsive typography";</Code>
      </pre>
    </article>
  );
}
```

### Device Compatibility

The typography system is fully responsive across:

- **Flip phones**: 320px width
- **Small mobile**: 375px width  
- **Medium mobile**: 414px width
- **Foldable phones**: 768px width
- **Tablets**: 1024px width
- **Laptops**: 1440px width
- **Desktops**: 1920px width
- **4K TVs**: 3840px+ width

All text scales smoothly using CSS `clamp()` functions for optimal readability at every screen size.

---

## Grid System

Simple and optimized grid layout system for modern web applications.

### Import Options

```tsx
// Default import
import GridContainer from "./core/Grid";

// Named imports  
import {
  GridContainer,
  GridRow,
  GridColumn,
  FlexRow,
  FlexColumn
} from "./core/Grid";

// Backward compatibility aliases
import { Grid, GridItem, Container, Row, Column } from "./core/Grid";
```

### Grid Components

The system provides five main components for flexible layouts:

#### 1. GridContainer - Main layout wrapper
```tsx
<GridContainer maxWidth="large" padding={true}>
  {children}
</GridContainer>
```

**Props:**
- `maxWidth`: `'small' | 'medium' | 'large' | 'full'` - Container width limits
- `padding`: `boolean` - Whether to add internal padding

#### 2. GridRow - Horizontal CSS Grid layout
```tsx
<GridRow columns={12} gap={1}>
  <GridColumn span={6}>Half width</GridColumn>
  <GridColumn span={6}>Half width</GridColumn>
</GridRow>
```

**Props:**
- `columns`: `number` - Number of grid columns (default: 12)
- `gap`: `number` - Gap between items in rem (default: 1)

#### 3. GridColumn - Individual grid items
```tsx
<GridColumn span={4} offset={2}>
  Content spanning 4 columns with 2 column offset
</GridColumn>
```

**Props:**
- `span`: `number` - How many columns to span (1-12)
- `offset`: `number` - How many columns to offset from left

#### 4. FlexRow - Horizontal Flexbox layout
```tsx
<FlexRow gap={1} align="center" justify="between" wrap={true}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</FlexRow>
```

**Props:**
- `gap`: `number` - Gap between items in rem
- `align`: `'start' | 'center' | 'end' | 'stretch'` - Vertical alignment
- `justify`: `'start' | 'center' | 'end' | 'between' | 'around'` - Horizontal alignment
- `wrap`: `boolean` - Allow items to wrap to next line

#### 5. FlexColumn - Vertical Flexbox layout
```tsx
<FlexColumn gap={2} align="center">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</FlexColumn>
```

**Props:**
- `gap`: `number` - Gap between items in rem
- `align`: `'start' | 'center' | 'end' | 'stretch'` - Horizontal alignment

### Common Layout Patterns

#### Two Column Layout
```tsx
<GridContainer maxWidth="large" padding={true}>
  <GridRow columns={12} gap={1}>
    <GridColumn span={8}>Main content</GridColumn>
    <GridColumn span={4}>Sidebar</GridColumn>
  </GridRow>
</GridContainer>
```

#### Three Column Layout
```tsx
<GridRow columns={12} gap={1}>
  <GridColumn span={4}>Column 1</GridColumn>
  <GridColumn span={4}>Column 2</GridColumn>
  <GridColumn span={4}>Column 3</GridColumn>
</GridRow>
```

#### Centered Content
```tsx
<FlexRow justify="center" align="center">
  <div>Centered content</div>
</FlexRow>
```

### Complete Example

```tsx
import { 
  GridContainer, 
  GridRow, 
  GridColumn, 
  FlexRow, 
  FlexColumn 
} from "./core/Grid";
import Typography from "./core/Typography";

function ResponsivePage() {
  return (
    <GridContainer maxWidth="large" padding={true}>
      {/* Hero Section - Flexbox Layout */}
      <FlexColumn gap={2} align="center">
        <Typography variant="display-xl">Page Title</Typography>
        <Typography variant="body-lg" color="secondary">
          Page description
        </Typography>
      </FlexColumn>

      {/* Content Grid - CSS Grid Layout */}
      <GridRow columns={12} gap={2}>
        {/* Main Content */}
        <GridColumn span={8}>
          <Typography variant="heading-lg">Main Content</Typography>
          <Typography variant="body-md">
            Primary content goes here...
          </Typography>
        </GridColumn>

        {/* Sidebar */}
        <GridColumn span={4}>
          <Typography variant="heading-md">Sidebar</Typography>
          <Typography variant="body-sm">
            Secondary content...
          </Typography>
        </GridColumn>
      </GridRow>

      {/* Feature Cards - Equal Width */}
      <GridRow columns={3} gap={1}>
        <GridColumn span={1}>Feature 1</GridColumn>
        <GridColumn span={1}>Feature 2</GridColumn>
        <GridColumn span={1}>Feature 3</GridColumn>
      </GridRow>

      {/* Navigation Bar - Flexbox Layout */}
      <FlexRow justify="between" align="center" gap={1}>
        <div>Logo</div>
        <FlexRow gap={1}>
          <div>Home</div>
          <div>About</div>
          <div>Contact</div>
        </FlexRow>
      </FlexRow>
    </GridContainer>
  );
}
```

### Responsive Design

The grid system automatically adapts to different screen sizes using CSS media queries. Use CSS `@media` rules in your stylesheets for responsive behavior:

```css
.my-component {
  /* Default desktop layout */
  grid-template-columns: repeat(12, 1fr);
}

@media (max-width: 768px) {
  .my-component {
    /* Mobile layout */
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Container Width Presets

- `small`: 640px (Mobile-first layouts)
- `medium`: 768px (Tablet layouts)  
- `large`: 1024px (Desktop layouts)
- `full`: 100% (Full-width layouts)

---

## Best Practices

1. **Theme Colors**: Always use CSS variables for colors to ensure theme compatibility
2. **Typography Hierarchy**: Use semantic heading levels (H1-H6) for proper accessibility
3. **Responsive Design**: Let the typography system handle responsive scaling automatically
4. **Color Contrast**: The theme system ensures proper contrast ratios for accessibility
5. **Performance**: Both components are optimized for minimal re-renders and fast loading