'use client';

/**
 * ALEXIKA AI Color Showcase Page
 * 
 * This page demonstrates all color variables and design tokens used in the ALEXIKA project.
 * Features comprehensive color system with elegant UI matching the icons page design.
 * 
 * Features:
 * - Categorized color display for easy discovery
 * - Interactive theme switching and real-time preview
 * - Advanced copy-to-clipboard functionality with multiple formats
 * - Search and filter capabilities
 * - Responsive grid layout with smooth animations
 * - Complete design token documentation
 */

import React, { useState, useMemo } from 'react';
import { Card, Space, Input, Select, Row, Col, Button, message, Tag } from 'antd';
import { Heading, Paragraph, Label, Text } from '../Typography';
import * as Icons from '../icons';
import { AISearch } from '../../../features/search';
import { useAppSelector, useAppDispatch } from '../../../store';
import { setQuery } from '../../../store/searchSlice';

const { Option } = Select;

// Complete color categories with all CSS variables used in ALEXIKA project
const colorCategories = {
  'Brand Colors': [
    {
      name: 'Primary',
      variable: '--color-primary',
      lightValue: '#2c2c2c',
      darkValue: '#e5e5e5',
      description: 'Main brand color for primary actions and key elements'
    },
    {
      name: 'Secondary',
      variable: '--color-secondary',
      lightValue: '#6b6b6b',
      darkValue: '#a3a3a3',
      description: 'Secondary brand color for supporting elements'
    }
  ],
  'Semantic Colors': [
    {
      name: 'Success',
      variable: '--color-success',
      lightValue: '#16a34a',
      darkValue: '#22c55e',
      description: 'Success states, confirmations, and positive feedback'
    },
    {
      name: 'Warning',
      variable: '--color-warning',
      lightValue: '#d97706',
      darkValue: '#f59e0b',
      description: 'Warning states, cautions, and important notices'
    },
    {
      name: 'Error',
      variable: '--color-error',
      lightValue: '#dc2626',
      darkValue: '#ef4444',
      description: 'Error states, failures, and destructive actions'
    },
    {
      name: 'Info',
      variable: '--color-info',
      lightValue: '#0ea5e9',
      darkValue: '#3b82f6',
      description: 'Informational messages and neutral notifications'
    }
  ],
  'Background Colors': [
    {
      name: 'Background Primary',
      variable: '--bg-primary',
      lightValue: '#ffffff',
      darkValue: '#0a0a0a',
      description: 'Main page background color'
    },
    {
      name: 'Background Secondary',
      variable: '--bg-secondary',
      lightValue: '#f8f7f4',
      darkValue: '#171717',
      description: 'Card backgrounds and elevated surfaces'
    },
    {
      name: 'Background Tertiary',
      variable: '--bg-tertiary',
      lightValue: '#f1f0eb',
      darkValue: '#262626',
      description: 'Subtle backgrounds and hover states'
    }
  ],
  'Text Colors': [
    {
      name: 'Text Primary',
      variable: '--text-primary',
      lightValue: '#1a1a1a',
      darkValue: '#f5f5f5',
      description: 'Main text color for headings and body content'
    },
    {
      name: 'Text Secondary',
      variable: '--text-secondary',
      lightValue: '#525252',
      darkValue: '#d4d4d4',
      description: 'Secondary text for descriptions and metadata'
    },
    {
      name: 'Text Tertiary',
      variable: '--text-tertiary',
      lightValue: '#737373',
      darkValue: '#a3a3a3',
      description: 'Subtle text for captions and placeholders'
    }
  ],
  'Border & Outline': [
    {
      name: 'Border Default',
      variable: '--border-color',
      lightValue: '#e7e5e4',
      darkValue: '#404040',
      description: 'Default border color for elements'
    },
    {
      name: 'Border Hover',
      variable: '--border-hover',
      lightValue: '#d6d3d1',
      darkValue: '#525252',
      description: 'Border color for interactive hover states'
    }
  ],
  'Shadow & Elevation': [
    {
      name: 'Shadow Light',
      variable: '--shadow-light',
      lightValue: 'rgba(0, 0, 0, 0.05)',
      darkValue: 'rgba(0, 0, 0, 0.3)',
      description: 'Subtle shadows for cards and elevated elements'
    },
    {
      name: 'Shadow Medium',
      variable: '--shadow-medium',
      lightValue: 'rgba(0, 0, 0, 0.10)',
      darkValue: 'rgba(0, 0, 0, 0.5)',
      description: 'Medium shadows for dropdowns and modal overlays'
    }
  ],
  'Layout Spacing': [
    {
      name: 'Grid Gap XS',
      variable: '--grid-gap-xs',
      lightValue: '8px',
      darkValue: '8px',
      description: 'Extra small spacing for tight layouts'
    },
    {
      name: 'Grid Gap SM',
      variable: '--grid-gap-sm',
      lightValue: '12px',
      darkValue: '12px',
      description: 'Small spacing for compact elements'
    },
    {
      name: 'Grid Gap MD',
      variable: '--grid-gap-md',
      lightValue: '16px',
      darkValue: '16px',
      description: 'Medium spacing for standard layouts'
    },
    {
      name: 'Grid Gap LG',
      variable: '--grid-gap-lg',
      lightValue: '24px',
      darkValue: '24px',
      description: 'Large spacing for section separation'
    },
    {
      name: 'Grid Gap XL',
      variable: '--grid-gap-xl',
      lightValue: '32px',
      darkValue: '32px',
      description: 'Extra large spacing for major sections'
    }
  ],
  'Container Sizes': [
    {
      name: 'Container SM',
      variable: '--container-sm',
      lightValue: '576px',
      darkValue: '576px',
      description: 'Small container max-width for mobile-first design'
    },
    {
      name: 'Container MD',
      variable: '--container-md',
      lightValue: '768px',
      darkValue: '768px',
      description: 'Medium container max-width for tablet layouts'
    },
    {
      name: 'Container LG',
      variable: '--container-lg',
      lightValue: '1024px',
      darkValue: '1024px',
      description: 'Large container max-width for desktop layouts'
    },
    {
      name: 'Container XL',
      variable: '--container-xl',
      lightValue: '1200px',
      darkValue: '1200px',
      description: 'Extra large container for wide desktop screens'
    },
    {
      name: 'Container Full',
      variable: '--container-full',
      lightValue: '100%',
      darkValue: '100%',
      description: 'Full-width container without max-width constraint'
    }
  ]
};

// Theme options
const themeOptions = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' }
];

// Copy format options
const formatOptions = [
  { label: 'CSS Variable', value: 'css' },
  { label: 'Light Value', value: 'light' },
  { label: 'Dark Value', value: 'dark' },
  { label: 'Both Values', value: 'both' }
];

type ColorType = {
  name: string;
  variable: string;
  lightValue: string;
  darkValue: string;
  description: string;
};

export default function ColorShowcase() {
  const dispatch = useAppDispatch();
  const currentQuery = useAppSelector(state => state.search.currentQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTheme, setSelectedTheme] = useState('system');
  const [copyFormat, setCopyFormat] = useState('css');
  const [messageApi, contextHolder] = message.useMessage();

  // Custom search function for colors
  const searchColors = async (query: string) => {
    const allColors = Object.entries(colorCategories).reduce((acc, [category, colors]) => {
      colors.forEach(color => {
        acc.push({ 
          id: `${category}-${color.name}`.replace(/\s+/g, '-').toLowerCase(),
          title: color.name,
          description: color.description,
          category,
          metadata: {
            variable: color.variable,
            lightValue: color.lightValue,
            darkValue: color.darkValue
          }
        });
      });
      return acc;
    }, [] as ColorVariableType[]);

    // Filter based on query
    if (!query.trim()) return allColors;
    
    return allColors.filter(color => {
      const searchString = `${color.title} ${color.description} ${color.category}`.toLowerCase();
      return searchString.includes(query.toLowerCase());
    });
  };

  // Filter colors based on search term and category
  const filteredColors = useMemo(() => {
    const allColors = Object.entries(colorCategories).reduce((acc, [category, colors]) => {
      colors.forEach(color => {
        acc.push({ ...color, category });
      });
      return acc;
    }, [] as Array<ColorType & { category: string }>);

    return allColors.filter(({ name, description, category }) => {
      const searchString = `${name} ${description}`.toLowerCase();
      const matchesSearch = searchString.includes(currentQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [currentQuery, selectedCategory]);

  // Copy color value to clipboard
  const handleCopyColor = async (colorName: string) => {
    const color = filteredColors.find(c => c.name === colorName);
    if (!color) return;
    
    let valueToCopy = '';
    
    switch (copyFormat) {
      case 'css':
        valueToCopy = `var(${color.variable})`;
        break;
      case 'light':
        valueToCopy = color.lightValue;
        break;
      case 'dark':
        valueToCopy = color.darkValue;
        break;
      case 'both':
        valueToCopy = `Light: ${color.lightValue}\nDark: ${color.darkValue}`;
        break;
    }

    try {
      await navigator.clipboard.writeText(valueToCopy);
      messageApi.success("Color value copied to clipboard!");
    } catch (error) {
      messageApi.error("Failed to copy color value");
      console.error("Copy failed:", error);
    }
  };

  // Render individual color card (matching icons page structure)
  const renderColorCard = (color: ColorType, category: string) => {
    const currentValue = selectedTheme === 'dark' ? color.darkValue : 
                         selectedTheme === 'light' ? color.lightValue : 
                         color.lightValue;

    const isSpacingOrSize = color.variable.includes('grid-gap') || color.variable.includes('container');
    const isShadow = color.variable.includes('shadow');

    return (
      <Col key={color.variable} xs={12} sm={8} md={6} lg={4} xl={3}>
        <Card 
          hoverable
          size="small"
          style={{ 
            textAlign: 'center', 
            height: '120px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
          onClick={() => handleCopyColor(color.name)}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            marginBottom: '8px',
            height: '60px'
          }}>
            {/* Color Preview */}
            <div 
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                border: `2px solid ${isSpacingOrSize ? 'var(--border-color)' : currentValue}`,
                backgroundColor: isSpacingOrSize ? 'var(--bg-tertiary)' : currentValue,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {isShadow && (
                <div 
                  style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: 'var(--bg-primary)',
                    borderRadius: '4px',
                    boxShadow: `0 2px 8px ${currentValue}`
                  }}
                />
              )}
              {isSpacingOrSize && (
                <span style={{
                  fontSize: '8px',
                  fontWeight: 'bold',
                  color: 'var(--color-primary)'
                }}>
                  {color.lightValue.replace('px', '')}
                </span>
              )}
            </div>
          </div>
          <Text variant="body-sm" color="primary" style={{ fontSize: '11px', lineHeight: 1.2 }}>
            {color.name}
          </Text>
        </Card>
      </Col>
    );
  };

  // Render category section (matching icons page structure)
  const renderCategorySection = (categoryName: string, colors: ColorType[]) => {
    const visibleColors = colors.filter(color => 
      filteredColors.some(filtered => filtered.variable === color.variable)
    );

    if (visibleColors.length === 0) return null;

    return (
      <div key={categoryName} style={{ marginBottom: '2rem' }}>
        <Heading level={4} color="primary" style={{ marginBottom: '1rem' }}>
          {categoryName}
        </Heading>
        <Row gutter={[12, 12]}>
          {visibleColors.map(color => renderColorCard(color, categoryName))}
        </Row>
      </div>
    );
  };

  const renderControls = () => (
    <Card 
      title={<Heading level={4} color="primary">Color Controls</Heading>}
      style={{ marginBottom: '2rem' }}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={6}>
          <AISearch
            placeholder="Search colors, variables, themes..."
            label="AI Color Search"
            mode="debounced"
            debounceDelay={150}
            context="colors"
            searchFunction={searchColors}
            enableFilters={true}
            enableVoice={true}
            enableExport={true}
            enableAI={true}
            showStats={true}
            filterOptions={[
              {
                key: 'category',
                label: 'Category',
                type: 'select',
                options: [
                  { label: 'All Categories', value: 'all' },
                  { label: 'Brand Colors', value: 'Brand Colors' },
                  { label: 'Semantic Colors', value: 'Semantic Colors' },
                  { label: 'Background Colors', value: 'Background Colors' },
                  { label: 'Text Colors', value: 'Text Colors' }
                ]
              },
              {
                key: 'theme',
                label: 'Theme',
                type: 'select',
                options: [
                  { label: 'All Themes', value: 'all' },
                  { label: 'Light Theme', value: 'light' },
                  { label: 'Dark Theme', value: 'dark' }
                ]
              }
            ]}
          />
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Label>Category</Label>
          <Select
            value={selectedCategory}
            onChange={setSelectedCategory}
            style={{ width: '100%', marginTop: '4px' }}
          >
            <Option value="all">All Categories</Option>
            {Object.keys(colorCategories).map(category => (
              <Option key={category} value={category}>{category}</Option>
            ))}
          </Select>
        </Col>
        
        <Col xs={12} sm={6} md={3}>
          <Label>Theme</Label>
          <Select
            value={selectedTheme}
            onChange={setSelectedTheme}
            style={{ width: '100%', marginTop: '4px' }}
          >
            {themeOptions.map(option => (
              <Option key={option.value} value={option.value}>{option.label}</Option>
            ))}
          </Select>
        </Col>
        
        <Col xs={12} sm={6} md={6}>
          <Label>Copy Format</Label>
          <Select
            value={copyFormat}
            onChange={setCopyFormat}
            style={{ width: '100%', marginTop: '4px' }}
          >
            {formatOptions.map(option => (
              <Option key={option.value} value={option.value}>{option.label}</Option>
            ))}
          </Select>
        </Col>
        
        <Col xs={24} md={3}>
          <Button 
            type="primary" 
            block
            onClick={() => {
              dispatch(setQuery(''));
              setSelectedCategory('all');
              setSelectedTheme('system');
              setCopyFormat('css');
            }}
            style={{ marginTop: '20px' }}
          >
            Reset
          </Button>
        </Col>
      </Row>
    </Card>
  );

  const renderStatistics = () => (
    <Card style={{ marginBottom: '2rem' }}>
      <Row gutter={[16, 16]} align="middle">
        <Col flex="auto">
          <Space direction="vertical" size="small">
            <Text variant="body-lg" weight={600} color="primary">
              ALEXIKA Color System Statistics
            </Text>
            <Text variant="body-sm" color="secondary">
              Total Colors: {Object.values(colorCategories).flat().length} | 
              Categories: {Object.keys(colorCategories).length} | 
              Showing: {filteredColors.length} colors
            </Text>
          </Space>
        </Col>
        <Col>
          <Text variant="body-xs" color="tertiary">
            Click any color to copy its usage example
          </Text>
        </Col>
      </Row>
    </Card>
  );

  return (
    <>
      {contextHolder}
      <div style={{ 
        padding: '2rem',
        maxWidth: '1400px',
        margin: '0 auto',
        backgroundColor: 'var(--bg-primary)',
        minHeight: '100vh'
      }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <Heading level={1} gradient={true} weight={800} style={{ marginBottom: '1rem' }}>
          ALEXIKA Color Library
        </Heading>
        <Paragraph variant="body-xl" color="secondary" align="center">
          Comprehensive design tokens and color variables for consistent theming. Click any color to copy its value.
        </Paragraph>
      </div>

      {/* Statistics */}
      {renderStatistics()}

      {/* Controls */}
      {renderControls()}

      {/* Color Categories */}
      {selectedCategory === 'all' ? (
        Object.entries(colorCategories).map(([categoryName, colors]) => 
          renderCategorySection(categoryName, colors)
        )
      ) : (
        renderCategorySection(selectedCategory, colorCategories[selectedCategory as keyof typeof colorCategories])
      )}

      {/* No Results */}
      {filteredColors.length === 0 && (
        <Card style={{ textAlign: 'center', padding: '3rem' }}>
          <Icons.Search size={48} color="var(--text-tertiary)" style={{ marginBottom: '1rem' }} />
          <Heading level={4} color="secondary">No colors found</Heading>
          <Paragraph color="tertiary">
            Try adjusting your search terms or category filter
          </Paragraph>
        </Card>
      )}

      {/* Usage Instructions */}
      <Card 
        title={<Heading level={4} color="primary">Usage Instructions</Heading>}
        style={{ marginTop: '3rem' }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Label>1. Import from centralized color system:</Label>
            <Text 
              variant="body-sm" 
              style={{ 
                display: 'block', 
                backgroundColor: 'var(--bg-secondary)', 
                padding: '8px 12px', 
                borderRadius: '4px',
                marginTop: '4px',
                fontFamily: 'monospace'
              }}
            >
              color: var(--color-primary); background: var(--bg-secondary);
            </Text>
          </div>
          
          <div>
            <Label>2. Use with consistent theming:</Label>
            <Text 
              variant="body-sm" 
              style={{ 
                display: 'block', 
                backgroundColor: 'var(--bg-secondary)', 
                padding: '8px 12px', 
                borderRadius: '4px',
                marginTop: '4px',
                fontFamily: 'monospace'
              }}
            >
              border: 1px solid var(--border-color); box-shadow: var(--shadow-light);
            </Text>
          </div>

          <div>
            <Label>3. Available design tokens:</Label>
            <Text variant="body-sm" color="secondary" style={{ marginTop: '4px' }}>
              Colors, backgrounds, text, borders, shadows, spacing, and container sizes
            </Text>
          </div>
        </Space>
      </Card>
      </div>
    </>
  );
}