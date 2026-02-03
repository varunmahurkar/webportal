/**
 * Markdown Renderer Component
 * Renders markdown content with syntax highlighting and citation support
 * Uses react-markdown with GitHub-flavored markdown and code highlighting
 */

"use client";

import React, { useMemo } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { cn } from "@/lib/utils";
import styles from "./MarkdownRenderer.module.css";

// Import highlight.js styles (using github-dark theme)
import "highlight.js/styles/github-dark.css";

/**
 * Citation data from web search results
 */
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

/**
 * Parses citation markers 【domain.com】 and converts them to anchor placeholders
 * that will be rendered as clickable links
 */
function processCitationMarkers(
  content: string,
  citations: Citation[]
): string {
  const citationRegex = /【([^】]+)】/g;

  return content.replace(citationRegex, (match, domain) => {
    const citation = citations.find(
      (c) => c.root_url.includes(domain) || c.url.includes(domain)
    );
    const url = citation?.url || `https://${domain}`;
    // Return a markdown link with a special data attribute marker
    return `[${domain}](${url} "citation-link")`;
  });
}

/**
 * Custom components for react-markdown
 * Provides styled rendering for all markdown elements
 */
const createComponents = (citations: Citation[]): Components => ({
  // Headings
  h1: ({ children, ...props }) => (
    <h1 className={styles.heading1} {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className={styles.heading2} {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className={styles.heading3} {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className={styles.heading4} {...props}>
      {children}
    </h4>
  ),

  // Paragraph
  p: ({ children, ...props }) => (
    <p className={styles.paragraph} {...props}>
      {children}
    </p>
  ),

  // Links - special handling for citation links
  a: ({ href, title, children, ...props }) => {
    const isCitation = title === "citation-link";
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={isCitation ? styles.citationLink : styles.link}
        title={isCitation ? href : title}
        {...props}
      >
        {children}
      </a>
    );
  },

  // Lists
  ul: ({ children, ...props }) => (
    <ul className={styles.unorderedList} {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className={styles.orderedList} {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className={styles.listItem} {...props}>
      {children}
    </li>
  ),

  // Code blocks and inline code
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className={styles.inlineCode} {...props}>
          {children}
        </code>
      );
    }
    // Block code - className contains language info from rehype-highlight
    return (
      <code className={cn(styles.blockCode, className)} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }) => (
    <pre className={styles.codeBlock} {...props}>
      {children}
    </pre>
  ),

  // Blockquote
  blockquote: ({ children, ...props }) => (
    <blockquote className={styles.blockquote} {...props}>
      {children}
    </blockquote>
  ),

  // Table
  table: ({ children, ...props }) => (
    <div className={styles.tableWrapper}>
      <table className={styles.table} {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className={styles.tableHead} {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }) => (
    <tbody className={styles.tableBody} {...props}>
      {children}
    </tbody>
  ),
  tr: ({ children, ...props }) => (
    <tr className={styles.tableRow} {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }) => (
    <th className={styles.tableHeader} {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className={styles.tableCell} {...props}>
      {children}
    </td>
  ),

  // Horizontal rule
  hr: ({ ...props }) => <hr className={styles.horizontalRule} {...props} />,

  // Strong and emphasis
  strong: ({ children, ...props }) => (
    <strong className={styles.strong} {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className={styles.emphasis} {...props}>
      {children}
    </em>
  ),

  // Strikethrough (GFM)
  del: ({ children, ...props }) => (
    <del className={styles.strikethrough} {...props}>
      {children}
    </del>
  ),
});

/**
 * MarkdownRenderer Component
 * Renders markdown content with full GFM support and syntax highlighting
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  citations = [],
  className,
}) => {
  // Process citation markers in content
  const processedContent = useMemo(() => {
    if (citations.length > 0) {
      return processCitationMarkers(content, citations);
    }
    return content;
  }, [content, citations]);

  // Memoize components to prevent unnecessary re-renders
  const components = useMemo(() => createComponents(citations), [citations]);

  return (
    <div className={cn(styles.markdownContent, className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
