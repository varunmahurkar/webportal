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

Auto-responsive grid layout system that adapts to ANY device viewport automatically.

### Import Options

```tsx
// Default import
import Grid from "./core/Grid";

// Named imports
import Grid, { 
  GridItem, 
  Container, 
  Row, 
  Column,
  GridContainer  // Edge-to-edge grid
} from "./core/Grid";

// Viewport hook
import { useViewport } from "../hooks/useViewport";
```

### Auto-Detection System

**No manual breakpoints needed!** The system automatically detects device type and optimizes:

- **Flip Phones** (≤320px): 2 columns, xs gap
- **Mobile** (≤768px): 4 columns, sm gap  
- **Tablet** (≤1024px): 8 columns, md gap
- **Laptop** (≤1440px): 12 columns, lg gap
- **Desktop** (≤1920px): 12 columns, lg gap
- **TV/Ultra-wide** (>1920px): 16 columns, xl gap

### Grid Containers

#### Standard Grid (with container padding)
```tsx
<Container padding={true}>
  <Grid gap="auto" align="stretch">
    <GridItem span={0.5}>Half width</GridItem>
    <GridItem span={0.5}>Half width</GridItem>
  </Grid>
</Container>
```

#### Edge-to-Edge Grid (no screen padding, just gutters)
```tsx
<GridContainer gap="auto">
  <GridItem span={1}>Full width - touches edges</GridItem>
  <GridItem span={0.5}>Half width with gutters</GridItem>
  <GridItem span={0.5}>Half width with gutters</GridItem>
</GridContainer>
```

**Props:**
- `gap`: `'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'auto'` (auto uses device-optimized gap)
- `align`: `'start' | 'center' | 'end' | 'stretch'`
- `justify`: `'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'`

### Grid Items

```tsx
// Fraction-based spans (automatic)
<GridItem span={0.5}>50% of available columns</GridItem>
<GridItem span={0.33}>33% of available columns</GridItem>
<GridItem span={1}>100% of available columns</GridItem>

// Device-specific overrides
<GridItem 
  span={0.25}      // Default: 25%
  mobile={1}       // 100% on mobile
  tablet={0.5}     // 50% on tablet  
  desktop={0.25}   // 25% on desktop
  tv={0.2}         // 20% on TV
>
  Smart responsive content
</GridItem>
```

**Props:**
- `span`: Fraction of columns (0.5 = 50%, 0.33 = 33%, 1 = 100%)
- `mobile`, `tablet`, `laptop`, `desktop`, `tv`: Device-specific overrides
- `align`: Individual item alignment

### Common Layouts

#### Full Width
```tsx
<GridItem span={{ mobile: 4, tablet: 8, desktop: 12 }}>
  Full width content
</GridItem>
```

#### Two Column
```tsx
<GridItem span={{ mobile: 4, tablet: 4, desktop: 6 }}>
  Left column
</GridItem>
<GridItem span={{ mobile: 4, tablet: 4, desktop: 6 }}>
  Right column
</GridItem>
```

#### Three Column (Desktop only)
```tsx
<GridItem span={{ mobile: 4, tablet: 8, desktop: 4 }}>
  Column 1
</GridItem>
<GridItem span={{ mobile: 4, tablet: 4, desktop: 4 }}>
  Column 2
</GridItem>
<GridItem span={{ mobile: 4, tablet: 4, desktop: 4 }}>
  Column 3
</GridItem>
```

#### Sidebar Layout
```tsx
<GridItem span={{ mobile: 4, tablet: 6, desktop: 8 }}>
  Main content
</GridItem>
<GridItem span={{ mobile: 4, tablet: 2, desktop: 4 }}>
  Sidebar
</GridItem>
```

### Container Component

```tsx
// Standard container with padding
<Container padding={true}>
  Content with responsive padding
</Container>

// Edge-to-edge container (no padding)
<Container padding={false}>
  Content touches screen edges
</Container>
```

**Props:**
- `padding`: `boolean` - Whether to add responsive padding or not

### Row & Column Components

#### Row (Horizontal Layout)
```tsx
<Row 
  gap="md" 
  align="center" 
  justify="between" 
  wrap={true}
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Row>
```

#### Column (Vertical Layout)
```tsx
<Column 
  gap="lg" 
  align="center" 
  justify="start"
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Column>
```

### Complete Example

```tsx
import Grid, { GridItem, Container, Row, Column } from "./core/Grid";
import Typography from "./core/Typography";

function ResponsivePage() {
  return (
    <Container maxWidth="xl" padding="lg">
      {/* Hero Section */}
      <Row justify="center" gap="lg">
        <Column align="center" gap="md">
          <Typography variant="display-xl">Page Title</Typography>
          <Typography variant="body-lg" color="secondary">
            Page description
          </Typography>
        </Column>
      </Row>

      {/* Content Grid */}
      <Grid gap="lg">
        {/* Main Content */}
        <GridItem span={{ mobile: 4, tablet: 6, desktop: 8 }}>
          <div>
            <Typography variant="heading-lg">Main Content</Typography>
            <Typography variant="body-md">
              Primary content goes here...
            </Typography>
          </div>
        </GridItem>

        {/* Sidebar */}
        <GridItem span={{ mobile: 4, tablet: 2, desktop: 4 }}>
          <div>
            <Typography variant="heading-md">Sidebar</Typography>
            <Typography variant="body-sm">
              Secondary content...
            </Typography>
          </div>
        </GridItem>

        {/* Feature Cards */}
        <GridItem span={{ mobile: 4, tablet: 8, desktop: 4 }}>
          <div>Feature 1</div>
        </GridItem>
        <GridItem span={{ mobile: 4, tablet: 4, desktop: 4 }}>
          <div>Feature 2</div>
        </GridItem>
        <GridItem span={{ mobile: 4, tablet: 4, desktop: 4 }}>
          <div>Feature 3</div>
        </GridItem>
      </Grid>
    </Container>
  );
}
```

### Gap System

- `xs`: 8px
- `sm`: 12px  
- `md`: 16px
- `lg`: 24px
- `xl`: 32px

### Edge-to-Edge Grid Features

The `GridContainer` component provides a special layout that:

- **Touches screen edges** - No padding from viewport boundaries
- **Automatic gutters** - Gaps between grid items based on device type
- **Full viewport usage** - Uses 100vw width and 100vh minimum height
- **Perfect for layouts** - Navigation bars, hero sections, dashboards

```tsx
// Perfect for full-page layouts
<GridContainer>
  {/* Header - spans full width */}
  <GridItem span={1}>
    <Header />
  </GridItem>
  
  {/* Navigation - 25% width */}
  <GridItem span={0.25} mobile={1}>
    <Navigation />
  </GridItem>
  
  {/* Main content - 75% width */}
  <GridItem span={0.75} mobile={1}>
    <MainContent />
  </GridItem>
  
  {/* Footer - spans full width */}
  <GridItem span={1}>
    <Footer />
  </GridItem>
</GridContainer>
```

**Benefits:**
- ✅ No manual padding calculations
- ✅ Responsive gaps automatically optimized  
- ✅ Content can use full viewport
- ✅ Clean edge-to-edge design
- ✅ Works on any device size

### Advanced Features

#### Viewport Hook
```tsx
import { useViewport } from "../hooks/useViewport";

function MyComponent() {
  const viewport = useViewport();
  
  return (
    <div>
      <p>Device: {viewport.device}</p>
      <p>Size: {viewport.width}×{viewport.height}</p>
      <p>Columns: {viewport.columns}</p>
      <p>Gap: {viewport.gap}</p>
    </div>
  );
}
```

#### Device-Specific Overrides
```tsx
<GridItem 
  span={{ mobile: 4, tablet: 4, desktop: 4 }}
  order={{ mobile: 2, tablet: 1, desktop: 1 }}
>
  Shows second on mobile, first on tablet/desktop
</GridItem>
```

#### Column Offset
```tsx
<GridItem 
  span={{ mobile: 2, tablet: 3, desktop: 4 }}
  offset={{ mobile: 1, tablet: 2, desktop: 2 }}
>
  Content with left margin
</GridItem>
```

#### Mixed Layouts
```tsx
<Grid gap="md">
  {/* Full header */}
  <GridItem span={{ mobile: 4, tablet: 8, desktop: 12 }}>
    Header
  </GridItem>
  
  {/* Asymmetric content */}
  <GridItem span={{ mobile: 4, tablet: 5, desktop: 7 }}>
    Main content (wider)
  </GridItem>
  
  <GridItem span={{ mobile: 4, tablet: 3, desktop: 5 }}>
    Sidebar (narrower)
  </GridItem>
</Grid>
```

---

## Best Practices

1. **Theme Colors**: Always use CSS variables for colors to ensure theme compatibility
2. **Typography Hierarchy**: Use semantic heading levels (H1-H6) for proper accessibility
3. **Responsive Design**: Let the typography system handle responsive scaling automatically
4. **Color Contrast**: The theme system ensures proper contrast ratios for accessibility
5. **Performance**: Both components are optimized for minimal re-renders and fast loading