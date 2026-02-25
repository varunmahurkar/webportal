/**
 * Tool Playground Modal — Interactive tool testing interface
 *
 * Allows users to test any registered tool with custom inputs
 * and see the raw JSON output. Supports both active and coming_soon tools.
 */

"use client";

import React, { useState, useCallback } from "react";
import { X, PlayCircle, Copy, Info } from "@/app/core/icons";
import { apiClient } from "@/lib/api";
import styles from "./ToolPlayground.module.css";

/** Tool metadata shape from the backend /tools API */
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
}

interface ToolPlaygroundProps {
  tool: ToolMeta;
  onClose: () => void;
}

export default function ToolPlayground({ tool, onClose }: ToolPlaygroundProps) {
  const [inputValue, setInputValue] = useState(() => {
    // Pre-fill with first example input if available
    if (tool.examples && tool.examples.length > 0) {
      return JSON.stringify(tool.examples[0].input, null, 2);
    }
    return "{}";
  });
  const [output, setOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [executionMs, setExecutionMs] = useState<number | null>(null);

  /** Execute the tool via POST /tools/execute */
  const handleExecute = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setOutput("");
    setExecutionMs(null);

    const startTime = performance.now();

    try {
      let parsedInputs: Record<string, unknown>;
      try {
        parsedInputs = JSON.parse(inputValue);
      } catch {
        setOutput("Invalid JSON input. Please check your input format.");
        setIsError(true);
        setIsLoading(false);
        return;
      }

      const response = await apiClient<{ tool_name: string; result: string; status: string }>(
        "/tools/execute",
        {
          method: "POST",
          body: JSON.stringify({
            tool_name: tool.name,
            inputs: parsedInputs,
          }),
        }
      );

      const elapsed = Math.round(performance.now() - startTime);
      setExecutionMs(elapsed);

      if (response.status === "error") {
        setIsError(true);
        setOutput(response.result);
      } else {
        // Try to pretty-print JSON output
        try {
          const parsed = JSON.parse(response.result);
          setOutput(JSON.stringify(parsed, null, 2));
        } catch {
          setOutput(response.result);
        }
      }
    } catch (err: unknown) {
      const elapsed = Math.round(performance.now() - startTime);
      setExecutionMs(elapsed);
      setIsError(true);
      setOutput(err instanceof Error ? err.message : "Failed to execute tool");
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, tool.name]);

  /** Copy output to clipboard */
  const handleCopyOutput = useCallback(() => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  }, [output]);

  /** Close on overlay click */
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  const isComingSoon = tool.status === "coming_soon";

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <div className={styles.modalIcon}>
              <PlayCircle size={18} />
            </div>
            <div>
              <div className={styles.modalTitle}>{tool.name}</div>
              <div className={styles.modalDescription}>{tool.niche} &middot; v{tool.version}</div>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {/* Coming soon notice */}
          {isComingSoon && (
            <div className={styles.comingSoonNotice}>
              <Info size={16} />
              This tool is coming soon. Execution returns mock data.
            </div>
          )}

          {/* Tool description */}
          <div style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
            {tool.description}
          </div>

          {/* Input */}
          <div className={styles.inputSection}>
            <label className={styles.inputLabel}>Input (JSON)</label>
            <textarea
              className={styles.inputField}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder='{"query": "your search query"}'
              spellCheck={false}
            />
            {tool.input_schema && (
              <div className={styles.inputHint}>
                Schema: {Object.entries(tool.input_schema).map(([k, v]) => `${k}: ${v}`).join(", ")}
              </div>
            )}
          </div>

          {/* Execute button */}
          <div className={styles.executeBar}>
            <button
              className={styles.executeButton}
              onClick={handleExecute}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className={styles.spinner} />
                  Running...
                </>
              ) : (
                <>
                  <PlayCircle size={14} />
                  Execute
                </>
              )}
            </button>
            {executionMs !== null && (
              <span className={styles.executionTime}>{executionMs}ms</span>
            )}
          </div>

          {/* Output */}
          {output && (
            <div className={styles.outputSection}>
              <div className={styles.outputLabel}>
                <span>Output</span>
                <button
                  className={styles.closeButton}
                  onClick={handleCopyOutput}
                  title="Copy output"
                >
                  <Copy size={14} />
                </button>
              </div>
              <div className={`${styles.outputBox} ${isError ? styles.outputError : ""}`}>
                {output}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
