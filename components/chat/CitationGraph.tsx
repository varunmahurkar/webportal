/**
 * CitationGraph — Visual SVG graph showing source type clusters and inter-relationships.
 * Groups sources into nodes by type (web/arxiv/news/youtube) with connecting edges.
 * Hover shows snippet. Click opens source URL.
 * Connected to: ChatMessage (shown below detailed sources in research/deep mode).
 */

'use client';

import React, { useMemo, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@/app/core/Typography';
import { Box, Flex } from '@/app/core/Grid';
import { GitBranch, ExternalLink } from '@/app/core/icons';
import styles from './CitationGraph.module.css';

export interface GraphCitation {
  id: number;
  url: string;
  title: string;
  source_type?: string;
  snippet?: string;
  quality_score?: number;
}

interface GraphNode {
  id: number;
  label: string;
  type: string;
  url: string;
  snippet?: string;
  quality: number;
  x: number;
  y: number;
  radius: number;
}

const SOURCE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  arxiv:     { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af' },
  pubmed:    { bg: '#f0fdf4', border: '#22c55e', text: '#166534' },
  youtube:   { bg: '#fef2f2', border: '#ef4444', text: '#991b1b' },
  news:      { bg: '#fff7ed', border: '#f97316', text: '#c2410c' },
  web:       { bg: '#f5f3ff', border: '#8b5cf6', text: '#5b21b6' },
  wikipedia: { bg: '#fefce8', border: '#eab308', text: '#854d0e' },
  reddit:    { bg: '#fff1f0', border: '#ff4500', text: '#c23600' },
};

const DARK_SOURCE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  arxiv:     { bg: '#1e3a5f', border: '#3b82f6', text: '#93c5fd' },
  pubmed:    { bg: '#14532d', border: '#22c55e', text: '#86efac' },
  youtube:   { bg: '#450a0a', border: '#ef4444', text: '#fca5a5' },
  news:      { bg: '#431407', border: '#f97316', text: '#fdba74' },
  web:       { bg: '#2e1065', border: '#8b5cf6', text: '#c4b5fd' },
  wikipedia: { bg: '#422006', border: '#eab308', text: '#fde047' },
  reddit:    { bg: '#3d0000', border: '#ff4500', text: '#ff9580' },
};

/** Place nodes in a radial layout based on source type clusters */
function layoutNodes(citations: GraphCitation[], width: number, height: number): GraphNode[] {
  const cx = width / 2;
  const cy = height / 2;

  const byType: Record<string, GraphCitation[]> = {};
  for (const c of citations) {
    const type = c.source_type || 'web';
    if (!byType[type]) byType[type] = [];
    byType[type].push(c);
  }

  const types = Object.keys(byType);
  const nodes: GraphNode[] = [];

  types.forEach((type, typeIdx) => {
    const typeAngle = (typeIdx / types.length) * Math.PI * 2;
    const clusterRadius = Math.min(width, height) * 0.32;
    const clusterX = cx + clusterRadius * Math.cos(typeAngle);
    const clusterY = cy + clusterRadius * Math.sin(typeAngle);
    const sources = byType[type];

    sources.forEach((source, srcIdx) => {
      const spread = Math.min(40, 70 / (sources.length || 1));
      const angle = typeAngle + (srcIdx - sources.length / 2) * (spread * (Math.PI / 180));
      const dist = 20 + srcIdx * 8;
      const quality = source.quality_score ?? 60;
      const radius = 18 + (quality / 100) * 10;

      nodes.push({
        id: source.id,
        label: source.title?.slice(0, 20) || `Source ${source.id}`,
        type,
        url: source.url,
        snippet: source.snippet,
        quality,
        x: clusterX + dist * Math.cos(angle + Math.PI / 2),
        y: clusterY + dist * Math.sin(angle + Math.PI / 2),
        radius,
      });
    });
  });

  return nodes;
}

/** Generate edges from center hub to each node */
function generateEdges(nodes: GraphNode[], cx: number, cy: number) {
  return nodes.map((node) => ({
    x1: cx,
    y1: cy,
    x2: node.x,
    y2: node.y,
    type: node.type,
  }));
}

export interface CitationGraphProps {
  citations: GraphCitation[];
  className?: string;
}

export const CitationGraph: React.FC<CitationGraphProps> = ({ citations, className }) => {
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const width = 520;
  const height = 280;
  const cx = width / 2;
  const cy = height / 2;

  const nodes = useMemo(() => layoutNodes(citations, width, height), [citations]);
  const edges = useMemo(() => generateEdges(nodes, cx, cy), [nodes, cx, cy]);

  // Group counts by type for legend
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of citations) {
      const t = c.source_type || 'web';
      counts[t] = (counts[t] || 0) + 1;
    }
    return counts;
  }, [citations]);

  if (citations.length < 3) return null;

  return (
    <Box className={cn(styles.graphContainer, className)}>
      <Flex alignItems="center" justifyContent="between" className={styles.graphHeader}>
        <Flex alignItems="center" gap={2}>
          <GitBranch size={15} className={styles.headerIcon} />
          <Text variant="label-sm" weight={600}>Source Map</Text>
          <span className={styles.nodeCount}>{citations.length} sources</span>
        </Flex>
        <button
          className={styles.expandBtn}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Collapse' : 'Expand graph'}
        </button>
      </Flex>

      {isExpanded && (
        <>
          {/* Legend */}
          <Flex className={styles.legend} gap={2} wrap="wrap">
            {Object.entries(typeCounts).map(([type, count]) => {
              const colors = SOURCE_COLORS[type] || SOURCE_COLORS.web;
              return (
                <Flex key={type} alignItems="center" gap={1} className={styles.legendItem}>
                  <div
                    className={styles.legendDot}
                    style={{ background: colors.border }}
                  />
                  <Text variant="caption" color="secondary">
                    {type} ({count})
                  </Text>
                </Flex>
              );
            })}
          </Flex>

          {/* SVG Graph */}
          <Box className={styles.svgWrapper}>
            <svg
              ref={svgRef}
              viewBox={`0 0 ${width} ${height}`}
              className={styles.svg}
              role="img"
              aria-label="Citation source graph"
            >
              {/* Edges from center hub */}
              {edges.map((edge, i) => {
                const colors = SOURCE_COLORS[edge.type] || SOURCE_COLORS.web;
                return (
                  <line
                    key={i}
                    x1={edge.x1}
                    y1={edge.y1}
                    x2={edge.x2}
                    y2={edge.y2}
                    stroke={colors.border}
                    strokeWidth={1}
                    strokeOpacity={0.3}
                    strokeDasharray="4,3"
                  />
                );
              })}

              {/* Center hub */}
              <circle cx={cx} cy={cy} r={22} fill="var(--accent-primary)" opacity={0.9} />
              <text
                x={cx}
                y={cy + 4}
                textAnchor="middle"
                fontSize={9}
                fill="#fff"
                fontWeight="600"
              >
                Nurav
              </text>

              {/* Source nodes */}
              {nodes.map((node) => {
                const colors = SOURCE_COLORS[node.type] || SOURCE_COLORS.web;
                const isHovered = hoveredNode?.id === node.id;
                return (
                  <g
                    key={node.id}
                    onClick={() => window.open(node.url, '_blank', 'noopener,noreferrer')}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isHovered ? node.radius + 3 : node.radius}
                      fill={colors.bg}
                      stroke={colors.border}
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      style={{ transition: 'r 0.15s ease, stroke-width 0.15s ease' }}
                    />
                    <text
                      x={node.x}
                      y={node.y + 4}
                      textAnchor="middle"
                      fontSize={8}
                      fill={colors.text}
                      fontWeight="600"
                      pointerEvents="none"
                    >
                      [{node.id}]
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Tooltip */}
            {hoveredNode && (
              <Box className={styles.tooltip}>
                <Text variant="label-sm" weight={600} className={styles.tooltipTitle}>
                  {hoveredNode.label}
                </Text>
                {hoveredNode.snippet && (
                  <Text variant="caption" color="secondary" className={styles.tooltipSnippet}>
                    {hoveredNode.snippet.slice(0, 100)}...
                  </Text>
                )}
                <Flex alignItems="center" gap={1} className={styles.tooltipLink}>
                  <ExternalLink size={11} />
                  <Text variant="caption" color="secondary">Click to open</Text>
                </Flex>
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default CitationGraph;
