# Nurav AI Core Components

Quick reference for core components used throughout the project.

---

## ThemeWrapper

Centralized theme management for light, dark, and custom modes.

```tsx
import ThemeWrapper, { useTheme } from "./core/ThemeWrapper";

// Wrap your app
<ThemeWrapper>{children}</ThemeWrapper>

// Use theme controls
const { config, updateTheme, isDark } = useTheme();
updateTheme({ mode: "dark" });
```

---

## Typography

Responsive text components that automatically scale across devices.

```tsx
import { Heading, Text, Paragraph } from "./core/Typography";

<Heading level={1}>Page Title</Heading>
<Paragraph variant="body-lg">Description text</Paragraph>
```

---

## Grid System

Auto-responsive layout components that adapt from mobile to 4K displays.

### Grid
CSS Grid layout with auto-responsive columns.

```tsx
import { Grid } from "./core/Grid";

// Auto-layout grid - automatically wraps based on screen size
<Grid columns={3} gap={4} autoLayout>
  <Grid.Item>Card 1</Grid.Item>
  <Grid.Item>Card 2</Grid.Item>
  <Grid.Item>Card 3</Grid.Item>
</Grid>

// Two-column layout
<Grid columns={2} gap={6}>
  <Grid.Item>Main Content</Grid.Item>
  <Grid.Item>Sidebar</Grid.Item>
</Grid>
```

### Box
Universal wrapper component replacing `<div>` with spacing and layout props.

```tsx
<Box padding={4} maxWidth="800px">Content</Box>
```

### Container
Page-level wrapper with auto-responsive padding and centered content.

```tsx
<Container size="lg">Page content</Container>
```

### Flex
Flexbox layout with automatic wrapping on smaller screens.

```tsx
<Flex gap={4} justifyContent="between" alignItems="center">
  <div>Item 1</div>
  <div>Item 2</div>
</Flex>
```

### Stack
Vertical or horizontal stacking with consistent spacing.

```tsx
<Stack spacing={4}>
  <div>Item 1</div>
  <div>Item 2</div>
</Stack>
```

---

## StickyBanner

Fixed position banner for important announcements at the top of the page.

```tsx
import { StickyBanner } from "./core/StickyBanner";

<StickyBanner
  title="Announcement Title"
  description="Your announcement description here."
/>
```

---

**Spacing Scale:** `1 = 0.25rem`, `4 = 1rem`, `8 = 2rem`

For detailed examples, see `/core/color`, `/core/typography`, and `/core/icons`.
