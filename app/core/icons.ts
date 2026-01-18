/**
 * Nurav AI Icon System - Centralized Lucide React Icons Management
 *
 * This module provides a centralized system for managing all icons used in the Nurav project.
 * All icons are from Lucide React with rounded corners only (no sharp corner icons).
 *
 * Features:
 * - Centralized icon exports for consistent usage across the application
 * - Rounded corner icons only (following Nurav design guidelines)
 * - Tree-shakable imports for optimal bundle size
 * - Categorized icon groups for easy discovery and maintenance
 * - Type-safe icon components with consistent sizing and styling
 * - Integration with Nurav theme system for color inheritance
 */

// Navigation & UI Icons - rounded corner icons for interface elements
export {
  Home,                    // Home/dashboard navigation
  Settings,               // Settings and configuration
  Menu,                   // Menu toggle and navigation
  Search,                 // Search functionality
  Filter,                 // Filter controls
  Grid3x3,               // Grid layout view
  List,                  // List layout view
  MoreHorizontal,        // More options menu (3 dots horizontal)
  MoreVertical,          // More options menu (3 dots vertical)
  ChevronLeft,           // Left navigation arrow
  ChevronRight,          // Right navigation arrow
  ChevronUp,             // Up navigation arrow
  ChevronDown,           // Down navigation arrow
  ArrowLeft,             // Back navigation
  ArrowRight,            // Forward navigation
  ArrowUp,               // Up navigation
  ArrowDown,             // Down navigation
  X,                     // Close/dismiss action
  Plus,                  // Add/create action
  Minus,                 // Remove/subtract action
  Maximize2,             // Maximize/expand
  Minimize2,             // Minimize/collapse
  RefreshCw,             // Refresh/reload
  Loader2,               // Loading spinner
  Check,                 // Success/confirmation
  AlertCircle,           // Warning alerts
  Info,                  // Information display
  HelpCircle,            // Help and support
} from 'lucide-react';

// Content & Media Icons - for content management and media handling
export {
  Image,                 // Image content
  Video,                 // Video content
  Music,                 // Audio content
  File,                  // Generic file
  FileText,              // Text document
  Download,              // Download action
  Upload,                // Upload action
  Share,                 // Share content
  Copy,                  // Copy action
  Trash2,                // Delete action (rounded delete icon)
  Edit,                  // Edit content
  Eye,                   // View/preview
  EyeOff,                // Hide/private
  Star,                  // Favorite/bookmark
  Heart,                 // Like/love
  MessageCircle,         // Comments/chat
  Calendar,              // Date/schedule
  Clock,                 // Time/duration
  MapPin,                // Location/address
  Globe,                 // Web/internet
  Link,                  // External links
  Paperclip,             // Attachment/file attachment
  Lightbulb,             // Ideas/suggestions
} from 'lucide-react';

// User & Account Icons - for user management and profiles
export {
  User,                  // Single user profile
  Users,                 // Multiple users/team
  UserPlus,              // Add user
  UserMinus,             // Remove user
  UserCheck,             // Verified user
  UserX,                 // Blocked/invalid user
  Mail,                  // Email communication
  Phone,                 // Phone contact
  Shield,                // Security/protection
  Lock,                  // Secure/private
  Unlock,                // Unlocked/public
  Key,                   // Authentication/password
  LogIn,                 // Sign in
  LogOut,                // Sign out
  UserCog,               // User settings
} from 'lucide-react';

// Business & Finance Icons - for commercial and financial features
export {
  DollarSign,            // Currency/pricing
  CreditCard,            // Payment methods
  ShoppingCart,          // E-commerce cart
  ShoppingBag,           // Shopping/purchases
  Package,               // Products/shipping
  Truck,                 // Delivery/logistics
  Building,              // Company/organization
  Briefcase,             // Business/professional
  TrendingUp,            // Growth/analytics
  TrendingDown,          // Decline/analytics
  PieChart,              // Data visualization
  BarChart3,             // Charts/reports
  Target,                // Goals/objectives
  Award,                 // Achievement/recognition
  Trophy,                // Success/winner
  Crown,                 // Premium/pro badge
  Zap,                   // Power/energy/fast
  Sparkles,              // AI/magic/intelligent features
} from 'lucide-react';

// Technology & Development Icons - for technical features
export {
  Code,                  // Code/programming
  Terminal,              // Command line/development
  Database,              // Data storage
  Server,                // Server/infrastructure
  Cloud,                 // Cloud computing
  Wifi,                  // Connectivity/network
  Bluetooth,             // Bluetooth connection
  Usb,                   // USB connection
  HardDrive,             // Storage/disk
  Cpu,                   // Processing/performance
  Smartphone,            // Mobile devices
  Monitor,               // Desktop/screen
  Tablet,                // Tablet devices
  Headphones,            // Audio devices
  Camera,                // Photography/video
  Printer,               // Printing
  Scan,                  // Scanning/QR codes
  QrCode,                // QR code display
  Rss,                   // RSS feeds/syndication
  Webhook,               // API/webhooks
} from 'lucide-react';

// Communication & Social Icons - for messaging and social features
export {
  MessageSquare,         // Chat/messaging
  Send,                  // Send message
  Bell,                  // Notifications
  BellOff,               // Muted notifications
  Volume2,               // Audio/sound on
  VolumeX,               // Audio/sound off
  Mic,                   // Microphone/voice
  MicOff,                // Muted microphone
  VideoOff,              // Video off
  ThumbsUp,              // Like/approve
  ThumbsDown,            // Dislike/disapprove
  Flag,                  // Report/flag content
  Bookmark,              // Save/bookmark
  Megaphone,             // Announcements
  AtSign,                // Mention/email symbol
} from 'lucide-react';

// Status & Feedback Icons - for states and user feedback
export {
  CheckCircle,           // Success status
  XCircle,               // Error status
  AlertTriangle,         // Warning status
  PlayCircle,            // Play/start
  PauseCircle,           // Pause/stop
  StopCircle,            // Stop/end
  SkipForward,           // Next/forward
  SkipBack,              // Previous/back
  Repeat,                // Repeat/loop
  Shuffle,               // Random/shuffle
  WifiOff,               // Disconnected state
  Battery,               // Battery level
  BatteryLow,            // Low battery
  Signal,                // Signal strength
  SignalZero,            // No signal
} from 'lucide-react';

// Theme & Customization Icons - for theme switching and customization
export {
  Sun,                   // Light theme
  Moon,                  // Dark theme
  Palette,               // Color customization
  Paintbrush,            // Design/styling
  Pipette,               // Color picker
  Contrast,              // Contrast adjustment
  Sliders,               // Settings/adjustments
  ToggleLeft,            // Toggle off state
  ToggleRight,           // Toggle on state
  CircleDot,             // Radio selection
  CheckSquare,           // Checkbox selection
  Square,                // Unchecked checkbox
  SlidersHorizontal,     // Horizontal controls
} from 'lucide-react';

// Action & Control Icons - for user actions and controls
export {
  Save,                  // Save action
  Undo,                  // Undo action
  Redo,                  // Redo action
  RotateCcw,             // Rotate counter-clockwise
  RotateCw,              // Rotate clockwise
  FlipHorizontal,        // Flip horizontal
  FlipVertical,          // Flip vertical
  Move,                  // Move/drag
  Crop,                  // Crop image
  Scissors,              // Cut action
  Clipboard,             // Clipboard/paste
  Archive,               // Archive content
  Pin,                   // Pin/attach
  PinOff,                // Unpinned state
} from 'lucide-react';

/**
 * Icon size constants for consistent sizing across the application
 */
export const ICON_SIZES = {
  xs: 12,      // Extra small - for inline text icons
  sm: 16,      // Small - for buttons and compact UI
  md: 20,      // Medium - default size for most icons
  lg: 24,      // Large - for headers and prominent features
  xl: 32,      // Extra large - for hero sections and major elements
  xxl: 48,     // Double extra large - for illustrations and large displays
} as const;

export type IconSize = keyof typeof ICON_SIZES;

/**
 * Common icon props interface for consistent usage
 */
export interface IconProps {
  size?: IconSize | number;
  className?: string;
  color?: string;
  strokeWidth?: number;
}

/**
 * Helper function to get icon size value
 */
export const getIconSize = (size: IconSize | number): number => {
  return typeof size === 'number' ? size : ICON_SIZES[size];
};

/**
 * Default icon props for consistent styling
 */
export const DEFAULT_ICON_PROPS = {
  size: ICON_SIZES.md,
  strokeWidth: 2,
  className: '',
} as const;