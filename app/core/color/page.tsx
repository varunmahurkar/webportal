'use client';

/**
 * ALEXIKA AI Color Showcase Page
 * 
 * This page demonstrates all color variables and design tokens used in the ALEXIKA project.
 * Features comprehensive color system with elegant UI using shadcn/ui components.
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Heading, Paragraph, Label, Text } from '../Typography';
import { GridContainer, GridRow, GridColumn } from '../Grid';
import { ThemeControls } from '../ThemeWrapper';
import * as Icons from '../icons';
import { Search } from '../../../features/search';
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard';

// Type definition for color variable structure
interface ColorVariableType {
  id: string;
  title: string;
  description: string;
  category: string;
  metadata: {
    variable: string;
    lightValue: string;
    darkValue: string;
  };
}

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
    },
    {
      name: 'Success',
      variable: '--color-success',
      lightValue: '#16a34a',
      darkValue: '#22c55e',
      description: 'Success states, confirmations, and positive actions'
    },
    {
      name: 'Warning',
      variable: '--color-warning',
      lightValue: '#d97706',
      darkValue: '#f59e0b',
      description: 'Warning states and cautionary messages'
    },
    {
      name: 'Error',
      variable: '--color-error',
      lightValue: '#dc2626',
      darkValue: '#ef4444',
      description: 'Error states, destructive actions, and alerts'
    },
    {
      name: 'Info',
      variable: '--color-info',
      lightValue: '#0ea5e9',
      darkValue: '#3b82f6',
      description: 'Informational content and neutral notifications'
    }
  ],
  'Background Colors': [
    {
      name: 'Primary Background',
      variable: '--bg-primary',
      lightValue: '#ffffff',
      darkValue: '#0a0a0a',
      description: 'Main page background color'
    },
    {
      name: 'Secondary Background',
      variable: '--bg-secondary',
      lightValue: '#f8f7f4',
      darkValue: '#171717',
      description: 'Card and component background color'
    },
    {
      name: 'Tertiary Background',
      variable: '--bg-tertiary',
      lightValue: '#f1f0eb',
      darkValue: '#262626',
      description: 'Subtle background for sections and dividers'
    }
  ],
  'Text Colors': [
    {
      name: 'Primary Text',
      variable: '--text-primary',
      lightValue: '#1a1a1a',
      darkValue: '#f5f5f5',
      description: 'Main text color for headings and body content'
    },
    {
      name: 'Secondary Text',
      variable: '--text-secondary',
      lightValue: '#525252',
      darkValue: '#d4d4d4',
      description: 'Supporting text, captions, and secondary information'
    },
    {
      name: 'Tertiary Text',
      variable: '--text-tertiary',
      lightValue: '#737373',
      darkValue: '#a3a3a3',
      description: 'Subtle text for hints and placeholder content'
    }
  ],
  'Border & Interactive': [
    {
      name: 'Border Color',
      variable: '--border-color',
      lightValue: '#e7e5e4',
      darkValue: '#404040',
      description: 'Default border color for components and dividers'
    },
    {
      name: 'Border Hover',
      variable: '--border-hover',
      lightValue: '#d6d3d1',
      darkValue: '#525252',
      description: 'Border color on hover and focus states'
    }
  ],
  'Shadows & Effects': [
    {
      name: 'Light Shadow',
      variable: '--shadow-light',
      lightValue: 'rgba(0, 0, 0, 0.05)',
      darkValue: 'rgba(0, 0, 0, 0.3)',
      description: 'Subtle shadow for cards and elevated components'
    },
    {
      name: 'Medium Shadow',
      variable: '--shadow-medium',
      lightValue: 'rgba(0, 0, 0, 0.10)',
      darkValue: 'rgba(0, 0, 0, 0.5)',
      description: 'Prominent shadow for modals and important elements'
    }
  ]
};

// Convert color categories to searchable format
const allColors: ColorVariableType[] = Object.entries(colorCategories).flatMap(([category, colors]) =>
  colors.map((color, index) => ({
    id: `${category.toLowerCase().replace(/\s+/g, '-')}-${index}`,
    title: color.name,
    description: color.description,
    category,
    metadata: {
      variable: color.variable,
      lightValue: color.lightValue,
      darkValue: color.darkValue,
    }
  }))
);

/**
 * Individual Color Card Component
 * Displays color information with copy functionality and hover effects
 */
const ColorCard: React.FC<{ color: ColorVariableType }> = ({ color }) => {
  const { copyToClipboard } = useCopyToClipboard();

  const handleCopy = async (format: 'variable' | 'light' | 'dark') => {
    let value = '';
    let description = '';

    switch (format) {
      case 'variable':
        value = `var(${color.metadata.variable})`;
        description = 'CSS Variable';
        break;
      case 'light':
        value = color.metadata.lightValue;
        description = 'Light Mode Value';
        break;
      case 'dark':
        value = color.metadata.darkValue;
        description = 'Dark Mode Value';
        break;
    }

    const success = await copyToClipboard(value);
    if (success) {
      toast.success(`${description} copied!`, {
        description: value,
      });
    } else {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <Card className="group alexika-card-enhanced">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            {color.title}
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy('variable')}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
            >
              <Icons.Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <Text variant="body-sm" color="secondary" className="mt-1">
          {color.description}
        </Text>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Color Preview */}
          <div 
            className="w-full h-20 rounded-lg border border-border shadow-sm"
            style={{ backgroundColor: `var(${color.metadata.variable})` }}
          />
          
          {/* CSS Variable */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">CSS Variable</Label>
            <div className="flex items-center justify-between p-2 bg-muted rounded-md">
              <Text variant="body-xs" className="font-mono">
                {color.metadata.variable}
              </Text>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy('variable')}
                className="h-6 w-6 p-0"
              >
                <Icons.Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Light/Dark Values */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Light Mode</Label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded border border-border flex-shrink-0"
                  style={{ backgroundColor: color.metadata.lightValue }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy('light')}
                  className="h-auto p-1 text-xs font-mono hover:bg-muted flex-1 justify-start"
                >
                  {color.metadata.lightValue}
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Dark Mode</Label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded border border-border flex-shrink-0"
                  style={{ backgroundColor: color.metadata.darkValue }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy('dark')}
                  className="h-auto p-1 text-xs font-mono hover:bg-muted flex-1 justify-start"
                >
                  {color.metadata.darkValue}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Main Color Showcase Page Component
 */
const ColorShowcasePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter colors based on search and category
  const filteredColors = useMemo(() => {
    let filtered = allColors;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(color => color.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(color => 
        color.title.toLowerCase().includes(query) ||
        color.description.toLowerCase().includes(query) ||
        color.category.toLowerCase().includes(query) ||
        color.metadata.variable.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  // Search function for the Search component
  const searchColors = async (query: string) => {
    const results = allColors.filter(color => 
      color.title.toLowerCase().includes(query.toLowerCase()) ||
      color.description.toLowerCase().includes(query.toLowerCase()) ||
      color.category.toLowerCase().includes(query.toLowerCase()) ||
      color.metadata.variable.toLowerCase().includes(query.toLowerCase())
    );

    return results.map(color => ({
      id: color.id,
      title: color.title,
      description: color.description,
      category: color.category,
    }));
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <GridContainer maxWidth="large" padding={true}>
      <div className="space-y-8 py-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <Heading level={1} className="flex items-center justify-center gap-3">
            <Icons.Palette className="h-8 w-8 text-primary" />
            ALEXIKA Color System
          </Heading>
          <Paragraph variant="body-lg" color="secondary" className="max-w-2xl mx-auto">
            Comprehensive design tokens and color variables used throughout the ALEXIKA project.
            Click any color to copy its CSS variable, light mode value, or dark mode value.
          </Paragraph>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Search and Filter */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Search
                  placeholder="Search colors, variables, themes..."
                  label="Color Search"
                  searchFunction={searchColors}
                  mode="debounced"
                  debounceDelay={150}
                  onSearch={handleSearchChange}
                />
              </div>
              <div className="sm:w-48">
                <Label className="text-sm text-muted-foreground mb-2 block">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.keys(colorCategories).map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Theme Controls */}
          <div className="lg:w-80">
            <ThemeControls />
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <Text variant="body-sm" color="secondary">
            Showing {filteredColors.length} of {allColors.length} colors
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </Text>
          {(searchQuery || selectedCategory !== 'all') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="flex items-center gap-2"
            >
              <Icons.X className="h-3 w-3" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Color Grid */}
        {filteredColors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredColors.map((color) => (
              <ColorCard key={color.id} color={color} />
            ))}
          </div>
        ) : (
          <Card className="py-12">
            <CardContent className="text-center">
              <Icons.Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <Heading level={3} className="mb-2">No colors found</Heading>
              <Text variant="body-md" color="secondary">
                Try adjusting your search terms or category filter
              </Text>
            </CardContent>
          </Card>
        )}

        {/* Usage Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.Info className="h-5 w-5" />
              Usage Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <GridRow columns={12} gap={1.5} autoLayout={true}>
              <GridColumn>
                <Heading level={4} className="mb-2">CSS Variables</Heading>
                <Text variant="body-sm" color="secondary" className="mb-3">
                  Use CSS variables for automatic theme switching:
                </Text>
                <div className="bg-muted p-3 rounded-md">
                  <code className="text-sm">
                    color: var(--text-primary);
                    <br />
                    background-color: var(--bg-secondary);
                  </code>
                </div>
              </GridColumn>
              <GridColumn>
                <Heading level={4} className="mb-2">Design Tokens</Heading>
                <Text variant="body-sm" color="secondary" className="mb-3">
                  Semantic naming ensures consistent usage:
                </Text>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use --color-* for semantic colors</li>
                  <li>• Use --bg-* for background layers</li>
                  <li>• Use --text-* for text hierarchy</li>
                  <li>• Use --border-* for component borders</li>
                </ul>
              </GridColumn>
            </GridRow>
          </CardContent>
        </Card>
      </div>
    </GridContainer>
  );
};

export default ColorShowcasePage;