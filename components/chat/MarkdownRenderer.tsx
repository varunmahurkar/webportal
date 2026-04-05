/**
 * Markdown Renderer — renders LLM response content with:
 *  - Syntax highlighting (rehype-highlight)
 *  - Citation [N] badges with tooltips
 *  - [[LIVE:type:symbol]] marker → inline LiveDataWidget
 *  - Auto Table of Contents for responses > 400 words (research/deep modes)
 * Connected to: ChatMessage (renders assistant message content).
 */

"use client";

import React, { useMemo } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { cn } from "@/lib/utils";
import styles from "./MarkdownRenderer.module.css";
import { LiveDataWidget } from "@/components/widgets/LiveDataWidget";

// Import highlight.js styles (github-dark theme)
import "highlight.js/styles/github-dark.css";

export interface Citation {
  id: number;
  url: string;
  root_url: string;
  title: string;
  snippet?: string;
  favicon_url?: string;
}

export interface MarkdownRendererProps {
  content: string;
  citations?: Citation[];
  className?: string;
}

// ---------------------------------------------------------------------------
// Live data marker parsing — [[LIVE:stock:AAPL]] or [[LIVE:weather:London]]
// ---------------------------------------------------------------------------

const LIVE_MARKER_RE = /\[\[LIVE:(stock|crypto|weather):([^\]]+)\]\]/g;

/**
 * Split content at [[LIVE:...]] markers.
 * Returns array of { text } or { liveType, liveSymbol } segments.
 */
function splitLiveMarkers(content: string): Array<
  | { kind: 'text'; text: string }
  | { kind: 'live'; type: 'stock' | 'crypto' | 'weather'; symbol: string }
> {
  const segments: ReturnType<typeof splitLiveMarkers> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  LIVE_MARKER_RE.lastIndex = 0;
  while ((match = LIVE_MARKER_RE.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ kind: 'text', text: content.slice(lastIndex, match.index) });
    }
    segments.push({
      kind: 'live',
      type: match[1] as 'stock' | 'crypto' | 'weather',
      symbol: match[2],
    });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    segments.push({ kind: 'text', text: content.slice(lastIndex) });
  }
  return segments;
}

// ---------------------------------------------------------------------------
// Citation marker processing
// ---------------------------------------------------------------------------

function processCitationMarkers(content: string, citations: Citation[]): string {
  const citationRegex = /(?<![!\[])\[(\d{1,2}(?:,\s*\d{1,2})*)\](?!\()/g;
  return content.replace(citationRegex, (match, numGroup: string) => {
    const nums = numGroup.split(",").map((n: string) => n.trim());
    return nums
      .map((num: string) => {
        const id = parseInt(num, 10);
        const citation = citations.find((c) => c.id === id);
        const url = citation?.url || "#";
        return `[${num}](${url} "citation-ref-${num}")`;
      })
      .join("");
  });
}

// ---------------------------------------------------------------------------
// Table of Contents — auto-generated for long responses (> 400 words)
// ---------------------------------------------------------------------------

interface TocEntry { level: number; text: string; id: string }

function extractHeadings(content: string): TocEntry[] {
  const headingRe = /^(#{1,3})\s+(.+)$/gm;
  const entries: TocEntry[] = [];
  let match: RegExpExecArray | null;
  while ((match = headingRe.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    entries.push({ level, text, id });
  }
  return entries;
}

const TableOfContents: React.FC<{ headings: TocEntry[] }> = ({ headings }) => {
  if (headings.length < 3) return null;
  return (
    <nav className={styles.toc} aria-label="Table of Contents">
      <p className={styles.tocTitle}>Contents</p>
      <ol className={styles.tocList}>
        {headings.map((h, i) => (
          <li
            key={i}
            className={cn(
              styles.tocItem,
              h.level === 2 && styles.tocItem2,
              h.level === 3 && styles.tocItem3,
            )}
          >
            <a href={`#${h.id}`} className={styles.tocLink}>
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
};

// ---------------------------------------------------------------------------
// Custom react-markdown components
// ---------------------------------------------------------------------------

const createComponents = (citations: Citation[]): Components => ({
  h1: ({ children, ...props }) => (
    <h1 className={styles.heading1} id={slugify(children)} {...props}>{children}</h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className={styles.heading2} id={slugify(children)} {...props}>{children}</h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className={styles.heading3} id={slugify(children)} {...props}>{children}</h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className={styles.heading4} {...props}>{children}</h4>
  ),
  p: ({ children, ...props }) => (
    <p className={styles.paragraph} {...props}>{children}</p>
  ),
  a: ({ href, title, children, ...props }) => {
    const isCitationRef = title?.startsWith("citation-ref-");
    if (isCitationRef) {
      const num = title!.replace("citation-ref-", "");
      const id = parseInt(num, 10);
      const citation = citations.find((c) => c.id === id);
      const tooltipText = citation
        ? `${citation.title || "Source"}\n${citation.snippet?.slice(0, 120) || ""}`
        : `Source ${num}`;
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.citationBadge}
          data-tooltip={tooltipText}
          {...props}
        >
          {num}
        </a>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={styles.link} title={title} {...props}>
        {children}
      </a>
    );
  },
  ul: ({ children, ...props }) => <ul className={styles.unorderedList} {...props}>{children}</ul>,
  ol: ({ children, ...props }) => <ol className={styles.orderedList} {...props}>{children}</ol>,
  li: ({ children, ...props }) => <li className={styles.listItem} {...props}>{children}</li>,
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    if (isInline) return <code className={styles.inlineCode} {...props}>{children}</code>;
    return <code className={cn(styles.blockCode, className)} {...props}>{children}</code>;
  },
  pre: ({ children, ...props }) => <pre className={styles.codeBlock} {...props}>{children}</pre>,
  blockquote: ({ children, ...props }) => (
    <blockquote className={styles.blockquote} {...props}>{children}</blockquote>
  ),
  table: ({ children, ...props }) => (
    <div className={styles.tableWrapper}><table className={styles.table} {...props}>{children}</table></div>
  ),
  thead: ({ children, ...props }) => <thead className={styles.tableHead} {...props}>{children}</thead>,
  tbody: ({ children, ...props }) => <tbody className={styles.tableBody} {...props}>{children}</tbody>,
  tr: ({ children, ...props }) => <tr className={styles.tableRow} {...props}>{children}</tr>,
  th: ({ children, ...props }) => <th className={styles.tableHeader} {...props}>{children}</th>,
  td: ({ children, ...props }) => <td className={styles.tableCell} {...props}>{children}</td>,
  hr: ({ ...props }) => <hr className={styles.horizontalRule} {...props} />,
  strong: ({ children, ...props }) => <strong className={styles.strong} {...props}>{children}</strong>,
  em: ({ children, ...props }) => <em className={styles.emphasis} {...props}>{children}</em>,
  del: ({ children, ...props }) => <del className={styles.strikethrough} {...props}>{children}</del>,
});

function slugify(children: React.ReactNode): string {
  const text = typeof children === 'string' ? children : String(children ?? '');
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

// ---------------------------------------------------------------------------
// MarkdownRenderer Component
// ---------------------------------------------------------------------------

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  citations = [],
  className,
}) => {
  const wordCount = useMemo(() => content.split(/\s+/).length, [content]);
  const isLong = wordCount > 400;

  // Extract TOC headings for long responses
  const tocHeadings = useMemo(
    () => (isLong ? extractHeadings(content) : []),
    [content, isLong],
  );

  // Split content at [[LIVE:...]] markers
  const segments = useMemo(() => splitLiveMarkers(content), [content]);

  // Memoize react-markdown components
  const components = useMemo(() => createComponents(citations), [citations]);

  return (
    <div className={cn(styles.markdownContent, className)}>
      {/* Auto Table of Contents for long structured responses */}
      {isLong && tocHeadings.length >= 3 && (
        <TableOfContents headings={tocHeadings} />
      )}

      {/* Render each segment — text through ReactMarkdown, live data as widget */}
      {segments.map((seg, idx) => {
        if (seg.kind === 'live') {
          return (
            <LiveDataWidget
              key={idx}
              type={seg.type}
              symbol={seg.symbol}
            />
          );
        }

        // Process citation markers in text segments before rendering
        const processed =
          citations.length > 0
            ? processCitationMarkers(seg.text, citations)
            : seg.text;

        return (
          <ReactMarkdown
            key={idx}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={components}
          >
            {processed}
          </ReactMarkdown>
        );
      })}
    </div>
  );
};

export default MarkdownRenderer;
