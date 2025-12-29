"use client";

/**
 * Nurav AI Icon Showcase Page
 *
 * This page demonstrates all Lucide React icons used in the Nurav project.
 * Features only rounded corner icons (no sharp corner icons) following design guidelines.
 *
 * Features:
 * - Categorized icon display for easy discovery
 * - Interactive size and color controls
 * - Copy-to-clipboard functionality for developers
 * - Search and filter capabilities
 * - Responsive grid layout
 * - Theme-aware icon preview
 */

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Heading, Paragraph, Text } from "../Typography";
import { GridContainer, GridRow, GridColumn } from "../Grid";
import * as Icons from "../icons";

// Icon categories with their corresponding icon names
const iconCategories = {
  "Navigation & UI": [
    "Home",
    "Settings",
    "Menu",
    "Search",
    "Filter",
    "Grid3x3",
    "List",
    "MoreHorizontal",
    "MoreVertical",
    "ChevronLeft",
    "ChevronRight",
    "ChevronUp",
    "ChevronDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "X",
    "Plus",
    "Minus",
    "Maximize2",
    "Minimize2",
    "RefreshCw",
    "Loader2",
    "Check",
    "AlertCircle",
    "Info",
    "HelpCircle",
  ],
  "Content & Media": [
    "Image",
    "Video",
    "Music",
    "File",
    "FileText",
    "Download",
    "Upload",
    "Share",
    "Copy",
    "Trash2",
    "Edit",
    "Eye",
    "EyeOff",
    "Star",
    "Heart",
    "MessageCircle",
    "Calendar",
    "Clock",
    "MapPin",
    "Globe",
    "Link",
  ],
  "User & Account": [
    "User",
    "Users",
    "UserPlus",
    "UserMinus",
    "UserCheck",
    "UserX",
    "Mail",
    "Phone",
    "Shield",
    "Lock",
    "Unlock",
    "Key",
    "LogIn",
    "LogOut",
    "UserCog",
  ],
  "Business & Finance": [
    "DollarSign",
    "CreditCard",
    "ShoppingCart",
    "ShoppingBag",
    "Package",
    "Truck",
    "Building",
    "Briefcase",
    "TrendingUp",
    "TrendingDown",
    "PieChart",
    "BarChart3",
    "Target",
    "Award",
    "Trophy",
    "Zap",
  ],
  "Technology & Development": [
    "Code",
    "Terminal",
    "Database",
    "Server",
    "Cloud",
    "Wifi",
    "Bluetooth",
    "Usb",
    "HardDrive",
    "Cpu",
    "Smartphone",
    "Monitor",
    "Tablet",
    "Headphones",
    "Camera",
    "Printer",
    "Scan",
    "QrCode",
    "Rss",
    "Webhook",
  ],
  "Communication & Social": [
    "MessageSquare",
    "Send",
    "Bell",
    "BellOff",
    "Volume2",
    "VolumeX",
    "Mic",
    "MicOff",
    "VideoOff",
    "ThumbsUp",
    "ThumbsDown",
    "Flag",
    "Bookmark",
    "Megaphone",
    "AtSign",
  ],
  "Status & Feedback": [
    "CheckCircle",
    "XCircle",
    "AlertTriangle",
    "PlayCircle",
    "PauseCircle",
    "StopCircle",
    "SkipForward",
    "SkipBack",
    "Repeat",
    "Shuffle",
    "WifiOff",
    "Battery",
    "BatteryLow",
    "Signal",
    "SignalZero",
  ],
  "Theme & Customization": [
    "Sun",
    "Moon",
    "Palette",
    "Paintbrush",
    "Pipette",
    "Contrast",
    "Sliders",
    "ToggleLeft",
    "ToggleRight",
    "CircleDot",
    "CheckSquare",
    "Square",
    "SlidersHorizontal",
  ],
  "Action & Control": [
    "Save",
    "Undo",
    "Redo",
    "RotateCcw",
    "RotateCw",
    "FlipHorizontal",
    "FlipVertical",
    "Move",
    "Crop",
    "Scissors",
    "Clipboard",
    "Archive",
    "Pin",
    "PinOff",
  ],
};

// Size options for icon preview
const sizeOptions = [
  { label: "XS (12px)", value: "xs" },
  { label: "SM (16px)", value: "sm" },
  { label: "MD (20px)", value: "md" },
  { label: "LG (24px)", value: "lg" },
  { label: "XL (32px)", value: "xl" },
  { label: "XXL (48px)", value: "xxl" },
];

// Color options for icon preview
const colorOptions = [
  { label: "Primary", value: "var(--color-primary)" },
  { label: "Secondary", value: "var(--color-secondary)" },
  { label: "Success", value: "var(--color-success)" },
  { label: "Warning", value: "var(--color-warning)" },
  { label: "Error", value: "var(--color-error)" },
  { label: "Info", value: "var(--color-info)" },
  { label: "Text Primary", value: "var(--text-primary)" },
  { label: "Text Secondary", value: "var(--text-secondary)" },
];

export default function IconShowcase() {
  const [selectedSize, setSelectedSize] = useState<Icons.IconSize>("md");
  const [selectedColor, setSelectedColor] = useState("var(--text-primary)");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Filter icons based on search term and category
  const filteredIcons = useMemo(() => {
    const allIcons = Object.entries(iconCategories).reduce(
      (acc, [category, icons]) => {
        icons.forEach((iconName) => {
          acc.push({ name: iconName, category });
        });
        return acc;
      },
      [] as { name: string; category: string }[]
    );

    return allIcons.filter(({ name, category }) => {
      const matchesSearch = name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Copy icon usage example to clipboard
  const handleCopyIcon = async (iconName: string) => {
    const usageExample = `<${iconName} size="md" strokeWidth={2} />`;
    try {
      await navigator.clipboard.writeText(usageExample);
      toast.success("Icon usage copied to clipboard!", {
        description: usageExample,
      });
    } catch (error) {
      toast.error("Failed to copy icon usage");
      console.error("Copy failed:", error);
    }
  };

  // Render individual icon card
  const renderIconCard = (iconName: string) => {
    const IconComponent = Icons[
      iconName as keyof typeof Icons
    ] as React.ComponentType<{
      size?: number | Icons.IconSize;
      color?: string;
      strokeWidth?: number;
    }>;

    if (!IconComponent) return null;

    return (
      <Card
        key={iconName}
        className="w-full h-[120px] cursor-pointer nurav-feature-card flex flex-col justify-center items-center text-center"
        onClick={() => handleCopyIcon(iconName)}
      >
        <CardContent className="p-3 flex flex-col items-center justify-center h-full">
          <div className="flex justify-center items-center mb-2 h-[60px]">
            <IconComponent
              size={Icons.getIconSize(selectedSize)}
              color={selectedColor}
              strokeWidth={2}
            />
          </div>
          <Text
            variant="body-sm"
            color="primary"
            className="text-xs leading-tight"
          >
            {iconName}
          </Text>
        </CardContent>
      </Card>
    );
  };

  // Render category section
  const renderCategorySection = (categoryName: string, iconNames: string[]) => {
    const visibleIcons = iconNames.filter((iconName) =>
      filteredIcons.some((filtered) => filtered.name === iconName)
    );

    if (visibleIcons.length === 0) return null;

    return (
      <div key={categoryName} className="mb-8">
        <Heading level={4} color="primary" className="mb-4">
          {categoryName}
        </Heading>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {visibleIcons.map((iconName) => renderIconCard(iconName))}
        </div>
      </div>
    );
  };

  const renderControls = () => (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>
          <Heading level={4} color="primary">
            Icon Controls
          </Heading>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
          <div className="space-y-2">
            <Label>Search Icons</Label>
            <Input
              placeholder="Search icon names..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.keys(iconCategories).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Size</Label>
            <Select value={selectedSize} onValueChange={(value) => setSelectedSize(value as Icons.IconSize)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sizeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <Select value={selectedColor} onValueChange={setSelectedColor}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="lg:col-span-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedSize("md");
                setSelectedColor("var(--text-primary)");
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStatistics = () => (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <Text variant="body-lg" weight={600} color="primary">
              Nurav Icon Library Statistics
            </Text>
            <Text variant="body-sm" color="secondary">
              Total Icons: {Object.values(iconCategories).flat().length} |
              Categories: {Object.keys(iconCategories).length} | Showing:{" "}
              {filteredIcons.length} icons
            </Text>
          </div>
          <Text variant="body-xs" color="tertiary">
            Click any icon to copy its usage example
          </Text>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <GridContainer maxWidth="large" padding={true}>
      <div className="space-y-8 py-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <Heading
            level={1}
            gradient={true}
            weight={800}
            className="flex items-center justify-center gap-3"
          >
            <Icons.Palette className="h-8 w-8 text-primary" />
            Nurav Icon Library
          </Heading>
          <Paragraph variant="body-xl" color="secondary" align="center">
            Comprehensive Lucide React icons with rounded corners only. Click
            any icon to copy its usage example.
          </Paragraph>
        </div>

        {/* Statistics */}
        {renderStatistics()}

        {/* Controls */}
        {renderControls()}

        {/* Icon Categories */}
        {selectedCategory === "all"
          ? Object.entries(iconCategories).map(([categoryName, iconNames]) =>
              renderCategorySection(categoryName, iconNames)
            )
          : renderCategorySection(
              selectedCategory,
              iconCategories[selectedCategory as keyof typeof iconCategories]
            )}

        {/* No Results */}
        {filteredIcons.length === 0 && (
          <Card className="py-12">
            <CardContent className="text-center">
              <Icons.Search
                size={48}
                color="var(--text-tertiary)"
                className="mx-auto mb-4"
              />
              <Heading level={4} color="secondary">
                No icons found
              </Heading>
              <Paragraph color="tertiary">
                Try adjusting your search terms or category filter
              </Paragraph>
            </CardContent>
          </Card>
        )}

        {/* Usage Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Heading level={4} color="primary">
                Usage Instructions
              </Heading>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <GridRow columns={12} gap={1.5} autoLayout={true}>
              <GridColumn>
                <Label className="text-sm font-medium mb-2 block">1. Import from centralized icon system:</Label>
                <div className="bg-muted p-3 rounded-md">
                  <code className="text-sm">
                    import &#123; Home, Settings, User &#125; from
                    &apos;@/app/core/icons&apos;;
                  </code>
                </div>
              </GridColumn>

              <GridColumn>
                <Label className="text-sm font-medium mb-2 block">2. Use with consistent sizing:</Label>
                <div className="bg-muted p-3 rounded-md">
                  <code className="text-sm">
                    &lt;Home size=&#123;ICON_SIZES.md&#125;
                    color=&quot;var(--color-primary)&quot; /&gt;
                  </code>
                </div>
              </GridColumn>

              <GridColumn>
                <Label className="text-sm font-medium mb-2 block">3. Available size constants:</Label>
                <Text variant="body-sm" color="secondary">
                  xs (12px), sm (16px), md (20px), lg (24px), xl (32px), xxl
                  (48px)
                </Text>
              </GridColumn>
            </GridRow>
          </CardContent>
        </Card>
      </div>
    </GridContainer>
  );
}