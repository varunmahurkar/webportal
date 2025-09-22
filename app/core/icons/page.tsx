"use client";

/**
 * ALEXIKA AI Icon Showcase Page
 *
 * This page demonstrates all Lucide React icons used in the ALEXIKA project.
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
import { Card, Space, Input, Select, Row, Col, Button, message } from "antd";
import { Heading, Paragraph, Label, Text } from "../Typography";
import { useCopyToClipboard } from "../../../hooks/useCopyToClipboard";
import * as Icons from "../icons";

const { Search } = Input;
const { Option } = Select;

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
  const { copyToClipboard } = useCopyToClipboard();
  const [messageApi, contextHolder] = message.useMessage();

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
      messageApi.success("Icon usage copied to clipboard!");
    } catch (error) {
      messageApi.error("Failed to copy icon usage");
      console.error("Copy failed:", error);
    }
  };

  // Render individual icon card
  const renderIconCard = (iconName: string, category: string) => {
    const IconComponent = Icons[
      iconName as keyof typeof Icons
    ] as React.ComponentType<{
      size?: number | Icons.IconSize;
      color?: string;
      strokeWidth?: number;
    }>;

    if (!IconComponent) return null;

    return (
      <Col key={iconName} xs={12} sm={8} md={6} lg={4} xl={3}>
        <Card
          hoverable
          size="small"
          style={{
            textAlign: "center",
            height: "120px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
          onClick={() => handleCopyIcon(iconName)}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "8px",
              height: "60px",
            }}
          >
            <IconComponent
              size={Icons.getIconSize(selectedSize)}
              color={selectedColor}
              strokeWidth={2}
            />
          </div>
          <Text
            variant="body-sm"
            color="primary"
            style={{ fontSize: "11px", lineHeight: 1.2 }}
          >
            {iconName}
          </Text>
        </Card>
      </Col>
    );
  };

  // Render category section
  const renderCategorySection = (categoryName: string, iconNames: string[]) => {
    const visibleIcons = iconNames.filter((iconName) =>
      filteredIcons.some((filtered) => filtered.name === iconName)
    );

    if (visibleIcons.length === 0) return null;

    return (
      <div key={categoryName} style={{ marginBottom: "2rem" }}>
        <Heading level={4} color="primary" style={{ marginBottom: "1rem" }}>
          {categoryName}
        </Heading>
        <Row gutter={[12, 12]}>
          {visibleIcons.map((iconName) =>
            renderIconCard(iconName, categoryName)
          )}
        </Row>
      </div>
    );
  };

  const renderControls = () => (
    <Card
      title={
        <Heading level={4} color="primary">
          Icon Controls
        </Heading>
      }
      style={{ marginBottom: "2rem" }}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={6}>
          <Label>Search Icons</Label>
          <Search
            placeholder="Search icon names..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
            style={{ marginTop: "4px" }}
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Label>Category</Label>
          <Select
            value={selectedCategory}
            onChange={setSelectedCategory}
            style={{ width: "100%", marginTop: "4px" }}
          >
            <Option value="all">All Categories</Option>
            {Object.keys(iconCategories).map((category) => (
              <Option key={category} value={category}>
                {category}
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={12} sm={6} md={3}>
          <Label>Size</Label>
          <Select
            value={selectedSize}
            onChange={setSelectedSize}
            style={{ width: "100%", marginTop: "4px" }}
          >
            {sizeOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={12} sm={6} md={6}>
          <Label>Color</Label>
          <Select
            value={selectedColor}
            onChange={setSelectedColor}
            style={{ width: "100%", marginTop: "4px" }}
          >
            {colorOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} md={3}>
          <Button
            type="primary"
            block
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setSelectedSize("md");
              setSelectedColor("var(--text-primary)");
            }}
            style={{ marginTop: "20px" }}
          >
            Reset
          </Button>
        </Col>
      </Row>
    </Card>
  );

  const renderStatistics = () => (
    <Card style={{ marginBottom: "2rem" }}>
      <Row gutter={[16, 16]} align="middle">
        <Col flex="auto">
          <Space direction="vertical" size="small">
            <Text variant="body-lg" weight={600} color="primary">
              ALEXIKA Icon Library Statistics
            </Text>
            <Text variant="body-sm" color="secondary">
              Total Icons: {Object.values(iconCategories).flat().length} |
              Categories: {Object.keys(iconCategories).length} | Showing:{" "}
              {filteredIcons.length} icons
            </Text>
          </Space>
        </Col>
        <Col>
          <Text variant="body-xs" color="tertiary">
            Click any icon to copy its usage example
          </Text>
        </Col>
      </Row>
    </Card>
  );

  return (
    <>
      {contextHolder}
      <div
        style={{
          padding: "2rem",
          maxWidth: "1400px",
          margin: "0 auto",
          backgroundColor: "var(--bg-primary)",
          minHeight: "100vh",
        }}
      >
        {/* Page Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <Heading
            level={1}
            gradient={true}
            weight={800}
            style={{ marginBottom: "1rem" }}
          >
            ALEXIKA Icon Library
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
          <Card style={{ textAlign: "center", padding: "3rem" }}>
            <Icons.Search
              size={48}
              color="var(--text-tertiary)"
              style={{ marginBottom: "1rem" }}
            />
            <Heading level={4} color="secondary">
              No icons found
            </Heading>
            <Paragraph color="tertiary">
              Try adjusting your search terms or category filter
            </Paragraph>
          </Card>
        )}

        {/* Usage Instructions */}
        <Card
          title={
            <Heading level={4} color="primary">
              Usage Instructions
            </Heading>
          }
          style={{ marginTop: "3rem" }}
        >
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div>
              <Label>1. Import from centralized icon system:</Label>
              <Text
                variant="body-sm"
                style={{
                  display: "block",
                  backgroundColor: "var(--bg-secondary)",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  marginTop: "4px",
                  fontFamily: "monospace",
                }}
              >
                import &#123; Home, Settings, User &#125; from
                &apos;@/app/core/icons&apos;;
              </Text>
            </div>

            <div>
              <Label>2. Use with consistent sizing:</Label>
              <Text
                variant="body-sm"
                style={{
                  display: "block",
                  backgroundColor: "var(--bg-secondary)",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  marginTop: "4px",
                  fontFamily: "monospace",
                }}
              >
                &lt;Home size=&#123;ICON_SIZES.md&#125;
                color=&quot;var(--color-primary)&quot; /&gt;
              </Text>
            </div>

            <div>
              <Label>3. Available size constants:</Label>
              <Text
                variant="body-sm"
                color="secondary"
                style={{ marginTop: "4px" }}
              >
                xs (12px), sm (16px), md (20px), lg (24px), xl (32px), xxl
                (48px)
              </Text>
            </div>
          </Space>
        </Card>
      </div>
    </>
  );
}
