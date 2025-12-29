'use client';

/**
 * Nurav AI Typography Showcase Page
 * 
 * This page demonstrates all capabilities of the Typography component system:
 * - All typography variants (display, heading, body, label, special)
 * - Color system integration with theme awareness
 * - Font weight variations and text styling options
 * - Text alignment, transformation, and decoration options
 * - Special effects like gradients, truncation, and spacing controls
 * - Convenience components (Heading, Text, Paragraph, Label, Caption, Code)
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import Typography, {
  Heading,
  Text,
  Paragraph,
  Label as CustomLabel,
  Caption,
  Code,
  TypographyVariant,
  TextColor,
  FontWeight
} from '../Typography';
import { GridContainer, GridRow, GridColumn } from '../Grid';
import { Copy, Check } from '../icons';
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard';
import styles from './page.module.css';

// Sample content for demonstrating typography variants
const sampleHeading = 'Nurav AI Typography System';
const sampleText = 'This is a comprehensive typography system designed for modern web applications with responsive scaling and theme integration.';
const sampleLongText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.';
const sampleCode = 'const typography = new TypographySystem();';

// All typography variants grouped by category
const displayVariants: TypographyVariant[] = ['display-xl', 'display-lg', 'display-md', 'display-sm'];
const headingVariants: TypographyVariant[] = ['heading-xl', 'heading-lg', 'heading-md', 'heading-sm'];
const bodyVariants: TypographyVariant[] = ['body-xl', 'body-lg', 'body-md', 'body-sm', 'body-xs'];
const labelVariants: TypographyVariant[] = ['label-xl', 'label-lg', 'label-md', 'label-sm'];
const specialVariants: TypographyVariant[] = ['caption', 'overline'];

// Color options for demonstration
const colorOptions: TextColor[] = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'info'];

// Font weight options
const fontWeights: FontWeight[] = [100, 200, 300, 400, 500, 600, 700, 800, 900];

export default function TypographyShowcase() {
  const [showGradient, setShowGradient] = useState(false);
  const [selectedColor, setSelectedColor] = useState<TextColor>('primary');
  const [selectedWeight, setSelectedWeight] = useState<FontWeight>(400);
  const [showItalic, setShowItalic] = useState(false);
  const [selectedAlign, setSelectedAlign] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  const [selectedTransform, setSelectedTransform] = useState<'none' | 'uppercase' | 'lowercase' | 'capitalize'>('none');
  const [selectedDecoration, setSelectedDecoration] = useState<'none' | 'underline' | 'line-through' | 'overline'>('none');
  const [selectedSpacing, setSelectedSpacing] = useState<'tight' | 'normal' | 'relaxed' | 'loose'>('normal');
  const [showTruncate, setShowTruncate] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<TypographyVariant>('body-md');

  // Use the copy-to-clipboard hook
  const { copyToClipboard, copiedText, isCopied } = useCopyToClipboard(2000);

  // Generate component usage code based on current settings
  const generateComponentCode = (variant: TypographyVariant = selectedVariant, component: string = 'Typography') => {
    const props: string[] = [];
    
    if (variant !== 'body-md') props.push(`variant="${variant}"`);
    if (selectedColor !== 'primary') props.push(`color="${selectedColor}"`);
    if (selectedWeight !== 400) props.push(`weight={${selectedWeight}}`);
    if (selectedAlign !== 'left') props.push(`align="${selectedAlign}"`);
    if (selectedTransform !== 'none') props.push(`transform="${selectedTransform}"`);
    if (selectedDecoration !== 'none') props.push(`decoration="${selectedDecoration}"`);
    if (selectedSpacing !== 'normal') props.push(`spacing="${selectedSpacing}"`);
    if (showItalic) props.push('italic={true}');
    if (showGradient) props.push('gradient={true}');
    if (showTruncate) props.push('truncate={true}');
    
    const propsString = props.length > 0 ? ` ${props.join(' ')}` : '';
    return `<${component}${propsString}>\n  Your text content here\n</${component}>`;
  };
  
  // Render copy button with code
  const renderCopyButton = (variant: TypographyVariant, component: string = 'Typography') => {
    const code = generateComponentCode(variant, component);
    const isThisCodeCopied = copiedText === code && isCopied;
    
    return (
      <Button
        size="sm"
        variant={isThisCodeCopied ? "default" : "outline"}
        onClick={() => copyToClipboard(code)}
        className="flex items-center gap-1"
      >
        {isThisCodeCopied ? <Check size={14} /> : <Copy size={14} />}
        {isThisCodeCopied ? 'Copied!' : 'Copy Code'}
      </Button>
    );
  };

  const renderVariantSection = (
    title: string,
    variants: TypographyVariant[],
    description: string
  ) => (
    <Card className={styles.cardContainer}>
      <CardHeader>
        <CardTitle>
          <Heading level={3} color="primary">{title}</Heading>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Paragraph color="secondary" className="mb-6">
          {description}
        </Paragraph>
        <div className="space-y-6">
          {variants.map((variant) => (
            <div key={variant} className="space-y-2">
              <div className="flex items-center justify-between">
                <CustomLabel color="tertiary" className="text-sm font-medium">
                  {variant}
                </CustomLabel>
                {renderCopyButton(variant)}
              </div>
              <Typography
                variant={variant}
                color={selectedColor}
                weight={selectedWeight}
                align={selectedAlign}
                transform={selectedTransform}
                decoration={selectedDecoration}
                spacing={selectedSpacing}
                italic={showItalic}
                gradient={showGradient}
                truncate={showTruncate && variant.includes('body')}
              >
                {variant.includes('display') || variant.includes('heading') 
                  ? sampleHeading 
                  : variant.includes('overline') 
                    ? 'Category Label'
                    : showTruncate ? sampleLongText : sampleText
                }
              </Typography>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderConvenienceComponents = () => (
    <Card className={styles.cardContainer}>
      <CardHeader>
        <CardTitle>
          <Heading level={3} color="primary">Convenience Components</Heading>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Paragraph color="secondary" className="mb-6">
          Pre-configured components for common use cases with semantic HTML tags.
        </Paragraph>
        <div className="space-y-6">
          <div className="space-y-2">
            <CustomLabel color="tertiary">Heading Component (H1-H6)</CustomLabel>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map(level => (
                <Heading key={level} level={level as 1 | 2 | 3 | 4 | 5 | 6} color={selectedColor}>
                  Heading Level {level}
                </Heading>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <CustomLabel color="tertiary">Text Component (Span)</CustomLabel>
            <div>
              <Text variant="body-lg" color={selectedColor}>
                Inline text component using span tag.
              </Text>
            </div>
          </div>
          
          <div className="space-y-2">
            <CustomLabel color="tertiary">Paragraph Component</CustomLabel>
            <Paragraph variant="body-md" color={selectedColor}>
              {sampleText}
            </Paragraph>
          </div>
          
          <div className="space-y-2">
            <CustomLabel color="tertiary">Label Component</CustomLabel>
            <div>
              <CustomLabel color={selectedColor}>Form Label</CustomLabel>
            </div>
          </div>
          
          <div className="space-y-2">
            <CustomLabel color="tertiary">Caption Component</CustomLabel>
            <div>
              <Caption color={selectedColor}>Image caption or small descriptive text</Caption>
            </div>
          </div>
          
          <div className="space-y-2">
            <CustomLabel color="tertiary">Code Component</CustomLabel>
            <div>
              <Code variant="body-sm" color={selectedColor} className="bg-muted p-2 rounded">
                {sampleCode}
              </Code>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderColorShowcase = () => (
    <Card className={styles.cardContainer}>
      <CardHeader>
        <CardTitle>
          <Heading level={3} color="primary">Color System</Heading>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Paragraph color="secondary" className="mb-6">
          Theme-aware color system that adapts to light, dark, and custom themes.
        </Paragraph>
        <GridRow columns={12} gap={1} autoLayout={true}>
          {colorOptions.map((color) => (
            <GridColumn key={color} className="space-y-2">
              <CustomLabel color="tertiary">{color}</CustomLabel>
              <div className="space-y-1">
                <Typography
                  variant="heading-sm"
                  color={color}
                >
                  Sample Text
                </Typography>
                <Typography
                  variant="body-sm"
                  color={color}
                >
                  Body text in {color}
                </Typography>
              </div>
            </GridColumn>
          ))}
        </GridRow>
      </CardContent>
    </Card>
  );

  const renderSpecialEffects = () => (
    <Card className={styles.cardContainer}>
      <CardHeader>
        <CardTitle>
          <Heading level={3} color="primary">Special Effects & Features</Heading>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Paragraph color="secondary" className="mb-6">
          Advanced typography features including gradients, truncation, and text styling options.
        </Paragraph>
        <div className="space-y-6">
          <div className="space-y-2">
            <CustomLabel color="tertiary">Gradient Text Effect</CustomLabel>
            <Typography
              variant="display-md"
              gradient={true}
              weight={700}
            >
              Gradient Text Effect
            </Typography>
          </div>
          
          <div className="space-y-2">
            <CustomLabel color="tertiary">Text Truncation</CustomLabel>
            <div className="max-w-md">
              <Typography
                variant="body-md"
                truncate={true}
                color="primary"
              >
                {sampleLongText}
              </Typography>
            </div>
          </div>
          
          <div className="space-y-2">
            <CustomLabel color="tertiary">Text Decorations</CustomLabel>
            <div className="space-y-2">
              <Typography variant="body-md" decoration="underline">Underlined text</Typography>
              <Typography variant="body-md" decoration="line-through">Strikethrough text</Typography>
              <Typography variant="body-md" decoration="overline">Overlined text</Typography>
            </div>
          </div>
          
          <div className="space-y-2">
            <CustomLabel color="tertiary">Text Transformations</CustomLabel>
            <div className="space-y-2">
              <Typography variant="body-md" transform="uppercase">uppercase text</Typography>
              <Typography variant="body-md" transform="lowercase">LOWERCASE TEXT</Typography>
              <Typography variant="body-md" transform="capitalize">capitalize each word</Typography>
            </div>
          </div>
          
          <div className="space-y-2">
            <CustomLabel color="tertiary">Letter Spacing</CustomLabel>
            <div className="space-y-2">
              <Typography variant="body-md" spacing="tight">Tight letter spacing</Typography>
              <Typography variant="body-md" spacing="normal">Normal letter spacing</Typography>
              <Typography variant="body-md" spacing="relaxed">Relaxed letter spacing</Typography>
              <Typography variant="body-md" spacing="loose">Loose letter spacing</Typography>
            </div>
          </div>
          
          <div className="space-y-2">
            <CustomLabel color="tertiary">Font Weights</CustomLabel>
            <div className="space-y-2">
              {[100, 300, 400, 500, 600, 700, 800, 900].map(weight => (
                <Typography key={weight} variant="body-md" weight={weight as FontWeight}>
                  Font Weight {weight}
                </Typography>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <CustomLabel color="tertiary">Text Alignment</CustomLabel>
            <div className="space-y-3">
              <Typography variant="body-md" align="left" className="w-full">Left aligned text</Typography>
              <Typography variant="body-md" align="center" className="w-full">Center aligned text</Typography>
              <Typography variant="body-md" align="right" className="w-full">Right aligned text</Typography>
              <Typography variant="body-md" align="justify" className="w-full">
                Justified text that spreads across the full width of the container, creating even spacing between words to align both left and right edges.
              </Typography>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderInteractiveControls = () => (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>
          <Heading level={2} color="primary">Interactive Controls & Live Preview</Heading>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Paragraph color="secondary" className="mb-6">
          Adjust these settings to see real-time changes across all typography examples
        </Paragraph>
        
        {/* Controls Grid */}
        <GridRow columns={12} gap={1} autoLayout={true} className="mb-6">
          <div className="space-y-2">
            <Label>Variant</Label>
            <Select value={selectedVariant} onValueChange={(value) => setSelectedVariant(value as TypographyVariant)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[...displayVariants, ...headingVariants, ...bodyVariants, ...labelVariants, ...specialVariants].map(variant => (
                  <SelectItem key={variant} value={variant}>{variant}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Color</Label>
            <Select value={selectedColor} onValueChange={(value) => setSelectedColor(value as TextColor)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map(color => (
                  <SelectItem key={color} value={color}>{color}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Font Weight</Label>
            <Select value={selectedWeight.toString()} onValueChange={(value) => setSelectedWeight(parseInt(value) as FontWeight)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontWeights.map(weight => (
                  <SelectItem key={weight} value={weight.toString()}>{weight}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Text Align</Label>
            <Select value={selectedAlign} onValueChange={(value) => setSelectedAlign(value as 'left' | 'center' | 'right' | 'justify')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="justify">Justify</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Transform</Label>
            <Select value={selectedTransform} onValueChange={(value) => setSelectedTransform(value as 'none' | 'uppercase' | 'lowercase' | 'capitalize')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="uppercase">Uppercase</SelectItem>
                <SelectItem value="lowercase">Lowercase</SelectItem>
                <SelectItem value="capitalize">Capitalize</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Decoration</Label>
            <Select value={selectedDecoration} onValueChange={(value) => setSelectedDecoration(value as 'none' | 'underline' | 'line-through' | 'overline')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="underline">Underline</SelectItem>
                <SelectItem value="line-through">Strike-through</SelectItem>
                <SelectItem value="overline">Overline</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Letter Spacing</Label>
            <Select value={selectedSpacing} onValueChange={(value) => setSelectedSpacing(value as 'tight' | 'normal' | 'relaxed' | 'loose')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tight">Tight</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="relaxed">Relaxed</SelectItem>
                <SelectItem value="loose">Loose</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch checked={showGradient} onCheckedChange={setShowGradient} />
            <Label>Gradient</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch checked={showItalic} onCheckedChange={setShowItalic} />
            <Label>Italic</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch checked={showTruncate} onCheckedChange={setShowTruncate} />
            <Label>Truncate</Label>
          </div>
        </GridRow>
        
        <Separator className="my-6" />
        
        {/* Live Preview and Copy Section */}
        <div className="space-y-4">
          <Heading level={4} color="primary">
            Live Preview & Copy Code
          </Heading>
          
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <Typography
                variant={selectedVariant}
                color={selectedColor}
                weight={selectedWeight}
                align={selectedAlign}
                transform={selectedTransform}
                decoration={selectedDecoration}
                spacing={selectedSpacing}
                italic={showItalic}
                gradient={showGradient}
                truncate={showTruncate}
              >
                {selectedVariant.includes('display') || selectedVariant.includes('heading') 
                  ? 'Sample Heading Text' 
                  : selectedVariant.includes('overline') 
                    ? 'CATEGORY LABEL'
                    : showTruncate 
                      ? 'This is a long text that will be truncated to show how the truncate property works with different text lengths.'
                      : 'Sample text content to demonstrate typography styling'
                }
              </Typography>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <CustomLabel color="secondary">Component Usage:</CustomLabel>
                {renderCopyButton(selectedVariant)}
              </div>
              
              <Code className="block p-3 bg-muted rounded">
                {generateComponentCode()}
              </Code>
            </div>
            
            {/* Convenience Component Examples */}
            <div className="space-y-3">
              <CustomLabel color="secondary">Convenience Components:</CustomLabel>
              <GridRow columns={12} gap={1} autoLayout={true}>
                <GridColumn className="flex items-center justify-between p-2 bg-muted rounded">
                  <CustomLabel color="tertiary">Heading</CustomLabel>
                  {renderCopyButton('heading-md', 'Heading')}
                </GridColumn>
                <GridColumn className="flex items-center justify-between p-2 bg-muted rounded">
                  <CustomLabel color="tertiary">Text</CustomLabel>
                  {renderCopyButton('body-md', 'Text')}
                </GridColumn>
                <GridColumn className="flex items-center justify-between p-2 bg-muted rounded">
                  <CustomLabel color="tertiary">Paragraph</CustomLabel>
                  {renderCopyButton('body-md', 'Paragraph')}
                </GridColumn>
              </GridRow>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <main className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <header className="text-center space-y-4">
        <Typography 
          variant="display-xl" 
          gradient={true} 
          weight={800}
        >
          Nurav AI Typography
        </Typography>
        <Paragraph variant="body-xl" color="secondary" align="center">
          A comprehensive, responsive typography system with theme integration and advanced styling capabilities
        </Paragraph>
      </header>
      
      {/* Interactive Controls - Full Width at Top */}
      {renderInteractiveControls()}
      
      {/* Main Content - Two Column Grid */}
      <GridRow columns={12} gap={2} autoLayout={true}>
        {/* Left Column */}
        <div className="space-y-8">
          {/* Display Variants */}
          {renderVariantSection(
            'Display Variants',
            displayVariants,
            'Large, eye-catching text for hero sections and major headlines with responsive scaling from 24px to 72px.'
          )}
          
          {/* Body Variants */}
          {renderVariantSection(
            'Body Text Variants',
            bodyVariants,
            'Readable body text options for content, descriptions, and paragraphs with optimal line height and spacing.'
          )}
          
          {/* Special Variants */}
          {renderVariantSection(
            'Special Variants',
            specialVariants,
            'Caption text for media descriptions and overline text for categories and tags.'
          )}
          
          {/* Color System */}
          {renderColorShowcase()}
        </div>
        
        {/* Right Column */}
        <div className="space-y-8">
          {/* Heading Variants */}
          {renderVariantSection(
            'Heading Variants',
            headingVariants,
            'Semantic heading styles for section headers and content hierarchy, scaling from 16px to 30px.'
          )}
          
          {/* Label Variants */}
          {renderVariantSection(
            'Label Variants',
            labelVariants,
            'UI labels for forms, buttons, and interface elements with medium font weight for clarity.'
          )}
          
          {/* Convenience Components */}
          {renderConvenienceComponents()}
          
          {/* Special Effects */}
          {renderSpecialEffects()}
        </div>
      </GridRow>
    </main>
  );
}