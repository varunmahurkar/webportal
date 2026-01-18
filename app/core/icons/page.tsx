"use client";

/**
 * Nurav AI Icon Showcase Page
 *
 * Displays all Lucide React icons used in the Nurav project.
 * Features rounded corner icons only following design guidelines.
 */

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Heading, Paragraph, Text } from "../Typography";
import { GridContainer, GridRow, GridColumn } from "../Grid";

// Import all icons directly from lucide-react
import {
  Home,
  Settings,
  Menu,
  Search,
  Filter,
  Grid3x3,
  List,
  MoreHorizontal,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  X,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  RefreshCw,
  Loader2,
  Check,
  AlertCircle,
  Info,
  HelpCircle,
  Image,
  Video,
  Music,
  File,
  FileText,
  Download,
  Upload,
  Share,
  Copy,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Star,
  Heart,
  MessageCircle,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Link,
  Paperclip,
  Lightbulb,
  User,
  Users,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Shield,
  Lock,
  Unlock,
  Key,
  LogIn,
  LogOut,
  UserCog,
  DollarSign,
  CreditCard,
  ShoppingCart,
  ShoppingBag,
  Package,
  Truck,
  Building,
  Briefcase,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Target,
  Award,
  Trophy,
  Zap,
  Sparkles,
  Code,
  Terminal,
  Database,
  Server,
  Cloud,
  Wifi,
  Bluetooth,
  Usb,
  HardDrive,
  Cpu,
  Smartphone,
  Monitor,
  Tablet,
  Headphones,
  Camera,
  Printer,
  Scan,
  QrCode,
  Rss,
  Webhook,
  MessageSquare,
  Send,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  VideoOff,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Bookmark,
  Megaphone,
  AtSign,
  CheckCircle,
  XCircle,
  AlertTriangle,
  PlayCircle,
  PauseCircle,
  StopCircle,
  SkipForward,
  SkipBack,
  Repeat,
  Shuffle,
  WifiOff,
  Battery,
  BatteryLow,
  Signal,
  SignalZero,
  Sun,
  Moon,
  Palette,
  Paintbrush,
  Pipette,
  Contrast,
  Sliders,
  ToggleLeft,
  ToggleRight,
  CircleDot,
  CheckSquare,
  Square,
  SlidersHorizontal,
  Save,
  Undo,
  Redo,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Move,
  Crop,
  Scissors,
  Clipboard,
  Archive,
  Pin,
  PinOff,
  type LucideIcon,
} from "lucide-react";

// Icon map for dynamic rendering
const IconMap: Record<string, LucideIcon> = {
  Home,
  Settings,
  Menu,
  Search,
  Filter,
  Grid3x3,
  List,
  MoreHorizontal,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  X,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  RefreshCw,
  Loader2,
  Check,
  AlertCircle,
  Info,
  HelpCircle,
  Image,
  Video,
  Music,
  File,
  FileText,
  Download,
  Upload,
  Share,
  Copy,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Star,
  Heart,
  MessageCircle,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Link,
  Paperclip,
  Lightbulb,
  User,
  Users,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Shield,
  Lock,
  Unlock,
  Key,
  LogIn,
  LogOut,
  UserCog,
  DollarSign,
  CreditCard,
  ShoppingCart,
  ShoppingBag,
  Package,
  Truck,
  Building,
  Briefcase,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Target,
  Award,
  Trophy,
  Zap,
  Sparkles,
  Code,
  Terminal,
  Database,
  Server,
  Cloud,
  Wifi,
  Bluetooth,
  Usb,
  HardDrive,
  Cpu,
  Smartphone,
  Monitor,
  Tablet,
  Headphones,
  Camera,
  Printer,
  Scan,
  QrCode,
  Rss,
  Webhook,
  MessageSquare,
  Send,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  VideoOff,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Bookmark,
  Megaphone,
  AtSign,
  CheckCircle,
  XCircle,
  AlertTriangle,
  PlayCircle,
  PauseCircle,
  StopCircle,
  SkipForward,
  SkipBack,
  Repeat,
  Shuffle,
  WifiOff,
  Battery,
  BatteryLow,
  Signal,
  SignalZero,
  Sun,
  Moon,
  Palette,
  Paintbrush,
  Pipette,
  Contrast,
  Sliders,
  ToggleLeft,
  ToggleRight,
  CircleDot,
  CheckSquare,
  Square,
  SlidersHorizontal,
  Save,
  Undo,
  Redo,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Move,
  Crop,
  Scissors,
  Clipboard,
  Archive,
  Pin,
  PinOff,
};

// Icon categories
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
    "Paperclip",
    "Lightbulb",
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
    "Sparkles",
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

// Size options
const ICON_SIZES = { xs: 12, sm: 16, md: 20, lg: 24, xl: 32, xxl: 48 };
type IconSize = keyof typeof ICON_SIZES;

const sizeOptions = [
  { label: "XS (12px)", value: "xs" },
  { label: "SM (16px)", value: "sm" },
  { label: "MD (20px)", value: "md" },
  { label: "LG (24px)", value: "lg" },
  { label: "XL (32px)", value: "xl" },
  { label: "XXL (48px)", value: "xxl" },
];

// Color options using Tailwind classes
const colorOptions = [
  { label: "Default", value: "text-foreground" },
  { label: "Primary", value: "text-primary" },
  { label: "Muted", value: "text-muted-foreground" },
  { label: "Success", value: "text-green-500" },
  { label: "Warning", value: "text-yellow-500" },
  { label: "Error", value: "text-red-500" },
  { label: "Info", value: "text-blue-500" },
];

export default function IconShowcase() {
  const [selectedSize, setSelectedSize] = useState<IconSize>("md");
  const [selectedColor, setSelectedColor] = useState("text-foreground");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Filter icons
  const filteredIcons = useMemo(() => {
    const allIcons = Object.entries(iconCategories).flatMap(
      ([category, icons]) => icons.map((name) => ({ name, category }))
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

  // Copy icon usage
  const handleCopyIcon = async (iconName: string) => {
    const usageExample = `<${iconName} size={20} strokeWidth={2} />`;
    try {
      await navigator.clipboard.writeText(usageExample);
      toast.success("Copied!", { description: usageExample });
    } catch {
      toast.error("Failed to copy");
    }
  };

  // Render icon card
  const renderIconCard = (iconName: string) => {
    const IconComponent = IconMap[iconName];
    if (!IconComponent) return null;

    return (
      <Card
        key={iconName}
        className="h-[120px] cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => handleCopyIcon(iconName)}
      >
        <CardContent className="p-3 flex flex-col items-center justify-center h-full">
          <div
            className={`flex justify-center items-center mb-2 h-[50px] ${selectedColor}`}
          >
            <IconComponent size={ICON_SIZES[selectedSize]} strokeWidth={2} />
          </div>
          <Text
            variant="body-sm"
            color="primary"
            className="text-xs font-mono text-center"
          >
            {iconName}
          </Text>
        </CardContent>
      </Card>
    );
  };

  // Render category section
  const renderCategorySection = (categoryName: string, iconNames: string[]) => {
    const visibleIcons = iconNames.filter((name) =>
      filteredIcons.some((f) => f.name === name)
    );
    if (visibleIcons.length === 0) return null;

    return (
      <div key={categoryName} className="mb-8">
        <Heading level={4} color="primary" className="mb-4">
          {categoryName}
        </Heading>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {visibleIcons.map(renderIconCard)}
        </div>
      </div>
    );
  };

  return (
    <GridContainer maxWidth="large" padding={true}>
      <div className="space-y-8 py-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Heading
            level={1}
            gradient={true}
            weight={800}
            className="flex items-center justify-center gap-3"
          >
            <Palette className="h-8 w-8 text-primary" />
            Nurav Icon Library
          </Heading>
          <Paragraph variant="body-xl" color="secondary" align="center">
            Lucide React icons with rounded corners. Click any icon to copy.
          </Paragraph>
        </div>

        {/* Statistics */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <Text variant="body-lg" weight={600} color="primary">
                  Icon Library Statistics
                </Text>
                <Text variant="body-sm" color="secondary">
                  Total: {Object.values(iconCategories).flat().length} |
                  Categories: {Object.keys(iconCategories).length} | Showing:{" "}
                  {filteredIcons.length}
                </Text>
              </div>
              <Text variant="body-xs" color="tertiary">
                Click any icon to copy usage
              </Text>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Heading level={4} color="primary">
                Icon Controls
              </Heading>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div className="space-y-2">
                <Label>Search</Label>
                <Input
                  placeholder="Search icons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.keys(iconCategories).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Size</Label>
                <Select
                  value={selectedSize}
                  onValueChange={(v) => setSelectedSize(v as IconSize)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sizeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
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
                    {colorOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedSize("md");
                  setSelectedColor("text-foreground");
                }}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Icons Grid */}
        {selectedCategory === "all"
          ? Object.entries(iconCategories).map(([cat, icons]) =>
              renderCategorySection(cat, icons)
            )
          : renderCategorySection(
              selectedCategory,
              iconCategories[selectedCategory as keyof typeof iconCategories]
            )}

        {/* No Results */}
        {filteredIcons.length === 0 && (
          <Card className="py-12">
            <CardContent className="text-center">
              <Search
                size={48}
                className="mx-auto mb-4 text-muted-foreground"
              />
              <Heading level={4} color="secondary">
                No icons found
              </Heading>
              <Paragraph color="tertiary">
                Try adjusting your search or filter
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
                <Label className="text-sm font-medium mb-2 block">
                  1. Import icons:
                </Label>
                <div className="bg-muted p-3 rounded-md">
                  <code className="text-sm">
                    {"import { Home, Settings } from '@/app/core/icons';"}
                  </code>
                </div>
              </GridColumn>
              <GridColumn>
                <Label className="text-sm font-medium mb-2 block">
                  2. Use in components:
                </Label>
                <div className="bg-muted p-3 rounded-md">
                  <code className="text-sm">
                    {'<Home size={20} className="text-primary" />'}
                  </code>
                </div>
              </GridColumn>
              <GridColumn>
                <Label className="text-sm font-medium mb-2 block">
                  3. Available sizes:
                </Label>
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
