'use client';

/**
 * ALEXIKA AI - Simple Search Showcase
 * Clean demonstration of AISearch component
 */

import React from "react";
import { Heading, Text } from "./core/Typography";
import { AISearch } from "../features/search";
import styles from "./page.module.css";

// Simple search function
const simpleSearch = async (query: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { id: 1, title: `Result for: ${query}`, description: "Search result description", category: "general", score: 0.95 },
    { id: 2, title: `Another: ${query}`, description: "Another search result", category: "content", score: 0.87 },
    { id: 3, title: `Related: ${query}`, description: "Related search result", category: "data", score: 0.78 }
  ];
};

export default function HomePage() {
  return (
    <div className={styles.simpleContainer}>
      <header className={styles.simpleHeader}>
        <Heading level={1} color="primary">ALEXIKA AI Search</Heading>
        <Text variant="body-lg" color="secondary">
          Powerful AI search for your project
        </Text>
      </header>

      <section className={styles.searchSection}>
        <AISearch
          placeholder="Search anything..."
          searchFunction={simpleSearch}
          enableVoice={true}
          enableExport={true}
          enableAI={true}
          filterOptions={[
            {
              key: "category",
              label: "Category",
              type: "select",
              options: [
                { label: "All", value: "all" },
                { label: "General", value: "general" },
                { label: "Content", value: "content" },
                { label: "Data", value: "data" }
              ]
            }
          ]}
        />
      </section>
    </div>
  );
}