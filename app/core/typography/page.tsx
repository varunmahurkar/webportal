'use client';

/**
 * ALEXIKA AI Typography Showcase Page
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
import { Card, Space, Divider, Switch, Select, Row, Col, Button } from 'antd';
import Typography, { 
  Heading, 
  Text, 
  Paragraph, 
  Label, 
  Caption, 
  Code,
  TypographyVariant,
  TextColor,
  FontWeight 
} from '../Typography';
import { Copy, Check } from '../icons';
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard';
import styles from './page.module.css';

const { Option } = Select;

// Sample content for demonstrating typography variants
const sampleHeading = 'ALEXIKA AI Typography System';
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
        size="small"
        icon={isThisCodeCopied ? <Check size={14} /> : <Copy size={14} />}
        onClick={() => copyToClipboard(code)}
        className={styles.copyButton}
        type={isThisCodeCopied ? "primary" : "default"}
      >
        {isThisCodeCopied ? 'Copied!' : 'Copy Code'}
      </Button>
    );
  };

  const renderVariantSection = (
    title: string,
    variants: TypographyVariant[],
    description: string
  ) => (
    <Card 
      title={<Heading level={3} color="primary">{title}</Heading>} 
      className={styles.cardContainer}
    >
      <Paragraph color="secondary" className={styles.cardContent}>
        {description}
      </Paragraph>
      <Space direction="vertical" size="large" className={styles.variantContainer}>
        {variants.map((variant) => (
          <section key={variant} className={styles.variantItem}>
            <section className={styles.variantHeader}>
              <Label color="tertiary" className={styles.variantLabel}>
                {variant}
              </Label>
              {renderCopyButton(variant)}
            </section>
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
          </section>
        ))}
      </Space>
    </Card>
  );

  const renderConvenienceComponents = () => (
    <Card 
      title={<Heading level={3} color="primary">Convenience Components</Heading>} 
      className={styles.cardContainer}
    >
      <Paragraph color="secondary" className={styles.cardContent}>
        Pre-configured components for common use cases with semantic HTML tags.
      </Paragraph>
      <Space direction="vertical" size="large" className={styles.variantContainer}>
        <section className={styles.variantItem}>
          <Label color="tertiary">Heading Component (H1-H6)</Label>
          <Space direction="vertical" className={styles.convenienceSection}>
            {[1, 2, 3, 4, 5, 6].map(level => (
              <Heading key={level} level={level as 1 | 2 | 3 | 4 | 5 | 6} color={selectedColor}>
                Heading Level {level}
              </Heading>
            ))}
          </Space>
        </section>
        
        <section className={styles.variantItem}>
          <Label color="tertiary">Text Component (Span)</Label>
          <section className={styles.convenienceSection}>
            <Text variant="body-lg" color={selectedColor}>
              Inline text component using span tag.
            </Text>
          </section>
        </section>
        
        <section className={styles.variantItem}>
          <Label color="tertiary">Paragraph Component</Label>
          <Paragraph variant="body-md" color={selectedColor} className={styles.convenienceSection}>
            {sampleText}
          </Paragraph>
        </section>
        
        <section className={styles.variantItem}>
          <Label color="tertiary">Label Component</Label>
          <section className={styles.convenienceSection}>
            <Label color={selectedColor}>Form Label</Label>
          </section>
        </section>
        
        <section className={styles.variantItem}>
          <Label color="tertiary">Caption Component</Label>
          <section className={styles.convenienceSection}>
            <Caption color={selectedColor}>Image caption or small descriptive text</Caption>
          </section>
        </section>
        
        <section className={styles.variantItem}>
          <Label color="tertiary">Code Component</Label>
          <section className={styles.convenienceSection}>
            <Code variant="body-sm" color={selectedColor} className={styles.codeBlock}>
              {sampleCode}
            </Code>
          </section>
        </section>
      </Space>
    </Card>
  );

  const renderColorShowcase = () => (
    <Card 
      title={<Heading level={3} color="primary">Color System</Heading>} 
      className={styles.cardContainer}
    >
      <Paragraph color="secondary" className={styles.cardContent}>
        Theme-aware color system that adapts to light, dark, and custom themes.
      </Paragraph>
      <Row gutter={[16, 16]}>
        {colorOptions.map((color) => (
          <Col key={color} xs={24} sm={12} md={8} lg={6}>
            <section className={styles.colorGrid}>
              <Label color="tertiary">{color}</Label>
              <Typography
                variant="heading-sm"
                color={color}
                className={styles.colorSample}
              >
                Sample Text
              </Typography>
              <Typography
                variant="body-sm"
                color={color}
                className={styles.colorDescription}
              >
                Body text in {color}
              </Typography>
            </section>
          </Col>
        ))}
      </Row>
    </Card>
  );

  const renderSpecialEffects = () => (
    <Card 
      title={<Heading level={3} color="primary">Special Effects & Features</Heading>} 
      className={styles.cardContainer}
    >
      <Paragraph color="secondary" className={styles.cardContent}>
        Advanced typography features including gradients, truncation, and text styling options.
      </Paragraph>
      <Space direction="vertical" size="large" className={styles.variantContainer}>
        <section className={styles.variantItem}>
          <Label color="tertiary">Gradient Text Effect</Label>
          <Typography
            variant="display-md"
            gradient={true}
            weight={700}
            className={styles.convenienceSection}
          >
            Gradient Text Effect
          </Typography>
        </section>
        
        <section className={styles.variantItem}>
          <Label color="tertiary">Text Truncation</Label>
          <section className={styles.truncationDemo}>
            <Typography
              variant="body-md"
              truncate={true}
              color="primary"
            >
              {sampleLongText}
            </Typography>
          </section>
        </section>
        
        <section className={styles.variantItem}>
          <Label color="tertiary">Text Decorations</Label>
          <Space direction="vertical" className={styles.convenienceSection}>
            <Typography variant="body-md" decoration="underline">Underlined text</Typography>
            <Typography variant="body-md" decoration="line-through">Strikethrough text</Typography>
            <Typography variant="body-md" decoration="overline">Overlined text</Typography>
          </Space>
        </section>
        
        <section className={styles.variantItem}>
          <Label color="tertiary">Text Transformations</Label>
          <Space direction="vertical" className={styles.convenienceSection}>
            <Typography variant="body-md" transform="uppercase">uppercase text</Typography>
            <Typography variant="body-md" transform="lowercase">LOWERCASE TEXT</Typography>
            <Typography variant="body-md" transform="capitalize">capitalize each word</Typography>
          </Space>
        </section>
        
        <section className={styles.variantItem}>
          <Label color="tertiary">Letter Spacing</Label>
          <Space direction="vertical" className={styles.convenienceSection}>
            <Typography variant="body-md" spacing="tight">Tight letter spacing</Typography>
            <Typography variant="body-md" spacing="normal">Normal letter spacing</Typography>
            <Typography variant="body-md" spacing="relaxed">Relaxed letter spacing</Typography>
            <Typography variant="body-md" spacing="loose">Loose letter spacing</Typography>
          </Space>
        </section>
        
        <section className={styles.variantItem}>
          <Label color="tertiary">Font Weights</Label>
          <Space direction="vertical" className={styles.convenienceSection}>
            {[100, 300, 400, 500, 600, 700, 800, 900].map(weight => (
              <Typography key={weight} variant="body-md" weight={weight as FontWeight}>
                Font Weight {weight}
              </Typography>
            ))}
          </Space>
        </section>
        
        <section className={styles.variantItem}>
          <Label color="tertiary">Text Alignment</Label>
          <Space direction="vertical" className={styles.alignmentDemo}>
            <Typography variant="body-md" align="left" className={styles.variantContainer}>Left aligned text</Typography>
            <Typography variant="body-md" align="center" className={styles.variantContainer}>Center aligned text</Typography>
            <Typography variant="body-md" align="right" className={styles.variantContainer}>Right aligned text</Typography>
            <Typography variant="body-md" align="justify" className={styles.variantContainer}>
              Justified text that spreads across the full width of the container, creating even spacing between words to align both left and right edges.
            </Typography>
          </Space>
        </section>
      </Space>
    </Card>
  );

  const renderInteractiveControls = () => (
    <Card 
      title={<Heading level={2} color="primary">Interactive Controls & Live Preview</Heading>} 
      className={styles.controlsCard}
    >
      <Paragraph color="secondary" className={styles.cardContent}>
        Adjust these settings to see real-time changes across all typography examples
      </Paragraph>
      
      {/* Controls Grid - Full Width */}
      <Row gutter={[20, 20]} className={styles.controlsGrid}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Label>Variant</Label>
          <Select
            value={selectedVariant}
            onChange={setSelectedVariant}
            style={{ width: '100%' }}
            className={styles.controlRow}
          >
            {[...displayVariants, ...headingVariants, ...bodyVariants, ...labelVariants, ...specialVariants].map(variant => (
              <Option key={variant} value={variant}>{variant}</Option>
            ))}
          </Select>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={6}>
          <Label>Color</Label>
          <Select
            value={selectedColor}
            onChange={setSelectedColor}
            style={{ width: '100%' }}
            className={styles.controlRow}
          >
            {colorOptions.map(color => (
              <Option key={color} value={color}>{color}</Option>
            ))}
          </Select>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={6}>
          <Label>Font Weight</Label>
          <Select
            value={selectedWeight}
            onChange={setSelectedWeight}
            style={{ width: '100%' }}
            className={styles.controlRow}
          >
            {fontWeights.map(weight => (
              <Option key={weight} value={weight}>{weight}</Option>
            ))}
          </Select>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={6}>
          <Label>Text Align</Label>
          <Select
            value={selectedAlign}
            onChange={setSelectedAlign}
            style={{ width: '100%' }}
            className={styles.controlRow}
          >
            <Option value="left">Left</Option>
            <Option value="center">Center</Option>
            <Option value="right">Right</Option>
            <Option value="justify">Justify</Option>
          </Select>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={6}>
          <Label>Transform</Label>
          <Select
            value={selectedTransform}
            onChange={setSelectedTransform}
            style={{ width: '100%' }}
            className={styles.controlRow}
          >
            <Option value="none">None</Option>
            <Option value="uppercase">Uppercase</Option>
            <Option value="lowercase">Lowercase</Option>
            <Option value="capitalize">Capitalize</Option>
          </Select>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={6}>
          <Label>Decoration</Label>
          <Select
            value={selectedDecoration}
            onChange={setSelectedDecoration}
            style={{ width: '100%' }}
            className={styles.controlRow}
          >
            <Option value="none">None</Option>
            <Option value="underline">Underline</Option>
            <Option value="line-through">Strike-through</Option>
            <Option value="overline">Overline</Option>
          </Select>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={6}>
          <Label>Letter Spacing</Label>
          <Select
            value={selectedSpacing}
            onChange={setSelectedSpacing}
            style={{ width: '100%' }}
            className={styles.controlRow}
          >
            <Option value="tight">Tight</Option>
            <Option value="normal">Normal</Option>
            <Option value="relaxed">Relaxed</Option>
            <Option value="loose">Loose</Option>
          </Select>
        </Col>
        
        <Col xs={24} sm={12} md={8}>
          <section className={styles.switchContainer}>
            <Switch checked={showGradient} onChange={setShowGradient} size="small" />
            <Label>Gradient</Label>
          </section>
        </Col>
        
        <Col xs={24} sm={12} md={8}>
          <section className={styles.switchContainer}>
            <Switch checked={showItalic} onChange={setShowItalic} size="small" />
            <Label>Italic</Label>
          </section>
        </Col>
        
        <Col xs={24} sm={12} md={8}>
          <section className={styles.switchContainer}>
            <Switch checked={showTruncate} onChange={setShowTruncate} size="small" />
            <Label>Truncate</Label>
          </section>
        </Col>
      </Row>
      
      <Divider />
      
      {/* Live Preview and Copy Section */}
      <section className={styles.previewSection}>
        <Heading level={4} color="primary" className={styles.sectionTitle}>
          Live Preview & Copy Code
        </Heading>
        
        <section className={styles.previewContainer}>
          <section className={styles.previewOutput}>
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
          </section>
          
          <section className={styles.copySection}>
            <section className={styles.copyHeader}>
              <Label color="secondary">Component Usage:</Label>
              {renderCopyButton(selectedVariant)}
            </section>
            
            <Code className={styles.codePreview}>
              {generateComponentCode()}
            </Code>
          </section>
        </section>
        
        {/* Convenience Component Examples */}
        <section className={styles.convenienceExamples}>
          <Label color="secondary">Convenience Components:</Label>
          <Row gutter={[12, 12]} className={styles.convenienceGrid}>
            <Col xs={24} sm={12} md={8}>
              <section className={styles.convenienceItem}>
                <Label color="tertiary">Heading</Label>
                {renderCopyButton('heading-md', 'Heading')}
              </section>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <section className={styles.convenienceItem}>
                <Label color="tertiary">Text</Label>
                {renderCopyButton('body-md', 'Text')}
              </section>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <section className={styles.convenienceItem}>
                <Label color="tertiary">Paragraph</Label>
                {renderCopyButton('body-md', 'Paragraph')}
              </section>
            </Col>
          </Row>
        </section>
      </section>
    </Card>
  );

  return (
    <main className={styles.typographyShowcaseContainer}>
      {/* Page Header */}
      <header className={styles.pageHeader}>
        <Typography 
          variant="display-xl" 
          gradient={true} 
          weight={800}
          className={styles.pageTitle}
        >
          ALEXIKA AI Typography
        </Typography>
        <Paragraph variant="body-xl" color="secondary" align="center">
          A comprehensive, responsive typography system with theme integration and advanced styling capabilities
        </Paragraph>
      </header>
      
      {/* Interactive Controls - Full Width at Top */}
      <section className={styles.controlsSection}>
        {renderInteractiveControls()}
      </section>
      
      {/* Main Content - Two Column Grid */}
      <Row gutter={[32, 32]} className={styles.contentGrid}>
        {/* Left Column */}
        <Col xs={24} lg={12}>
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
        </Col>
        
        {/* Right Column */}
        <Col xs={24} lg={12}>
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
        </Col>
      </Row>
    </main>
  );
}