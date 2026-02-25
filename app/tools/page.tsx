/**
 * Tools Showcase Page — Interactive catalog of all Nurav AI tools
 *
 * Displays tools grouped by niche with search, filtering, status badges,
 * and a playground modal for testing each tool interactively.
 * Fetches tool manifest from GET /tools API endpoint.
 */

"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  Wrench,
  Globe,
  Database,
  PlayCircle,
  Terminal,
  BarChart3,
  HardDrive,
  Sparkles,
  FileText,
  Image,
  Loader2,
  AlertCircle,
} from "@/app/core/icons";
import { Heading, Text, Paragraph } from "@/app/core/Typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ToolPlayground from "@/components/tools/ToolPlayground";
import { apiClient } from "@/lib/api";
import styles from "./page.module.css";
import type { LucideIcon } from "lucide-react";

/** Tool metadata shape from the backend */
interface ToolMeta {
  name: string;
  description: string;
  niche: string;
  status: string;
  icon: string;
  version: string;
  examples: Array<{ input: Record<string, unknown>; output: string; description: string }>;
  input_schema: Record<string, string> | null;
  output_schema: Record<string, string> | null;
  avg_response_ms: number | null;
  success_rate: number | null;
  cost_per_call: number | null;
}

interface ToolManifest {
  tools: ToolMeta[];
  total: number;
  niches: string[];
}

/** Map backend icon names to lucide icon components */
const ICON_MAP: Record<string, LucideIcon> = {
  search: Search,
  globe: Globe,
  "graduation-cap": Sparkles,
  "play-circle": PlayCircle,
  database: Database,
  "hard-drive": HardDrive,
  "scan-search": Search,
  "shield-check": Sparkles,
  "message-circle-question": Sparkles,
  terminal: Terminal,
  calculator: BarChart3,
  "file-text": FileText,
  image: Image,
  languages: Globe,
  "bar-chart-3": BarChart3,
  wrench: Wrench,
};

/** Niche display labels and icons */
const NICHE_CONFIG: Record<string, { label: string; icon: LucideIcon }> = {
  search: { label: "Search & Retrieval", icon: Search },
  academic: { label: "Academic Research", icon: Sparkles },
  media: { label: "Media & Video", icon: PlayCircle },
  knowledge: { label: "Knowledge & Retrieval", icon: Database },
  analysis: { label: "AI & Analysis", icon: Sparkles },
  code: { label: "Code Execution", icon: Terminal },
  math: { label: "Math & Calculation", icon: BarChart3 },
  files: { label: "File Analysis", icon: FileText },
  language: { label: "Language", icon: Globe },
  visualization: { label: "Data Visualization", icon: BarChart3 },
};

/** Get status badge CSS class */
function getStatusClass(status: string): string {
  switch (status) {
    case "active":
      return styles.statusActive;
    case "beta":
      return styles.statusBeta;
    case "coming_soon":
      return styles.statusComingSoon;
    case "deprecated":
      return styles.statusDeprecated;
    default:
      return styles.statusComingSoon;
  }
}

/** Format status for display */
function formatStatus(status: string): string {
  switch (status) {
    case "active":
      return "Active";
    case "beta":
      return "Beta";
    case "coming_soon":
      return "Coming Soon";
    case "deprecated":
      return "Deprecated";
    default:
      return status;
  }
}

export default function ToolsPage() {
  const [manifest, setManifest] = useState<ToolManifest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNiche, setActiveNiche] = useState<string | null>(null);
  const [playgroundTool, setPlaygroundTool] = useState<ToolMeta | null>(null);

  /** Fetch tool manifest from backend */
  useEffect(() => {
    async function fetchTools() {
      try {
        const data = await apiClient<ToolManifest>("/tools");
        setManifest(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load tools");
      } finally {
        setLoading(false);
      }
    }
    fetchTools();
  }, []);

  /** Filter tools by search query and active niche */
  const filteredTools = useMemo(() => {
    if (!manifest) return [];

    return manifest.tools.filter((tool) => {
      const matchesSearch =
        !searchQuery ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.niche.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesNiche = !activeNiche || tool.niche === activeNiche;

      return matchesSearch && matchesNiche;
    });
  }, [manifest, searchQuery, activeNiche]);

  /** Group filtered tools by niche */
  const toolsByNiche = useMemo(() => {
    const groups: Record<string, ToolMeta[]> = {};
    for (const tool of filteredTools) {
      if (!groups[tool.niche]) {
        groups[tool.niche] = [];
      }
      groups[tool.niche].push(tool);
    }
    return groups;
  }, [filteredTools]);

  /** Count tools by status */
  const stats = useMemo(() => {
    if (!manifest) return { total: 0, active: 0, comingSoon: 0, niches: 0 };
    return {
      total: manifest.total,
      active: manifest.tools.filter((t) => t.status === "active").length,
      comingSoon: manifest.tools.filter((t) => t.status === "coming_soon").length,
      niches: manifest.niches.length,
    };
  }, [manifest]);

  const handleNicheClick = useCallback((niche: string) => {
    setActiveNiche((prev) => (prev === niche ? null : niche));
  }, []);

  const getToolIcon = useCallback((iconName: string): LucideIcon => {
    return ICON_MAP[iconName] || Wrench;
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className={styles.toolsPage}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh", gap: "0.75rem" }}>
          <Loader2 size={20} className="animate-spin" />
          <Text variant="body-md" color="secondary">Loading tools...</Text>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.toolsPage}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "50vh", gap: "0.75rem" }}>
          <AlertCircle size={24} color="var(--color-error, #dc2626)" />
          <Text variant="body-md" color="secondary">{error}</Text>
          <Text variant="body-sm" color="tertiary">Make sure the backend is running on localhost:8000</Text>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.toolsPage}>
      {/* Page header */}
      <div className={styles.toolsHeader}>
        <Heading level={2}>Tools</Heading>
        <Paragraph color="secondary" className={styles.toolsSubtitle}>
          Explore and test all available AI tools. Click any tool to try it in the playground.
        </Paragraph>
      </div>

      {/* Stats bar */}
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{stats.total}</span> total tools
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{stats.active}</span> active
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{stats.comingSoon}</span> coming soon
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{stats.niches}</span> niches
        </div>
      </div>

      {/* Search + niche filters */}
      <div className={styles.filterBar}>
        <div className={styles.searchInput}>
          <Input
            placeholder="Search tools by name, description, or niche..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Niche chips */}
      {manifest && (
        <div className={styles.nicheFilter} style={{ marginBottom: "1.5rem" }}>
          {manifest.niches.map((niche) => (
            <button
              key={niche}
              className={`${styles.nicheChip} ${activeNiche === niche ? styles.nicheChipActive : ""}`}
              onClick={() => handleNicheClick(niche)}
            >
              {NICHE_CONFIG[niche]?.label || niche}
            </button>
          ))}
          {activeNiche && (
            <button
              className={styles.nicheChip}
              onClick={() => setActiveNiche(null)}
              style={{ fontStyle: "italic" }}
            >
              Clear filter
            </button>
          )}
        </div>
      )}

      {/* Tool cards grouped by niche */}
      {Object.keys(toolsByNiche).length === 0 ? (
        <div className={styles.emptyState}>
          <Text variant="body-md" color="secondary">No tools match your search.</Text>
        </div>
      ) : (
        Object.entries(toolsByNiche).map(([niche, tools]) => {
          const NicheIcon = NICHE_CONFIG[niche]?.icon || Wrench;
          return (
            <div key={niche} className={styles.nicheGroup}>
              <div className={styles.nicheGroupHeader}>
                <div className={styles.nicheGroupIcon}>
                  <NicheIcon size={16} />
                </div>
                <Heading level={4}>{NICHE_CONFIG[niche]?.label || niche}</Heading>
                <Text variant="body-sm" color="secondary">({tools.length})</Text>
              </div>

              <div className={styles.toolGrid}>
                {tools.map((tool) => {
                  const ToolIcon = getToolIcon(tool.icon);
                  return (
                    <div
                      key={tool.name}
                      className={styles.toolCard}
                      onClick={() => setPlaygroundTool(tool)}
                    >
                      <div className={styles.toolCardHeader}>
                        <div className={styles.toolCardLeft}>
                          <div className={styles.toolIconWrapper}>
                            <ToolIcon size={18} />
                          </div>
                          <span className={styles.toolName}>{tool.name}</span>
                        </div>
                        <span className={`${styles.statusBadge} ${getStatusClass(tool.status)}`}>
                          {formatStatus(tool.status)}
                        </span>
                      </div>

                      <div className={styles.toolDescription}>{tool.description}</div>

                      <div className={styles.toolCardFooter}>
                        <div className={styles.toolMeta}>
                          <span className={styles.nicheBadge}>{niche}</span>
                          {tool.avg_response_ms && (
                            <span className={styles.nicheBadge}>~{tool.avg_response_ms}ms</span>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className={styles.tryButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            setPlaygroundTool(tool);
                          }}
                        >
                          Try it
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}

      {/* Playground modal */}
      {playgroundTool && (
        <ToolPlayground
          tool={playgroundTool}
          onClose={() => setPlaygroundTool(null)}
        />
      )}
    </div>
  );
}
