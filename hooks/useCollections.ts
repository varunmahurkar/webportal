/**
 * useCollections — Manage research notebooks / conversation collections with localStorage.
 * Collections group related conversations under a named folder.
 * CRUD: create, rename, delete collections; add/remove conversations to collections.
 * Connected to: Sidebar (collections section), page.tsx (assign conversation to collection).
 */

import { useState, useCallback, useEffect } from 'react';

export interface Collection {
  id: string;
  name: string;
  emoji: string;
  conversationIds: string[];
  createdAt: string; // ISO 8601
  color: string;
}

const STORAGE_KEY = 'nurav_collections';

const DEFAULT_EMOJIS = ['📚', '🔬', '💡', '🎯', '🚀', '🌍', '⚗️', '📊', '🧠', '🔍'];
const DEFAULT_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#14b8a6',
];

export interface UseCollectionsReturn {
  collections: Collection[];
  createCollection: (name: string, emoji?: string, color?: string) => Collection;
  renameCollection: (id: string, name: string) => void;
  deleteCollection: (id: string) => void;
  addConversation: (collectionId: string, conversationId: string) => void;
  removeConversation: (collectionId: string, conversationId: string) => void;
  getCollectionForConversation: (conversationId: string) => Collection | undefined;
}

export function useCollections(): UseCollectionsReturn {
  const [collections, setCollections] = useState<Collection[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
    } catch {
      // localStorage full — silently skip
    }
  }, [collections]);

  const createCollection = useCallback((name: string, emoji?: string, color?: string): Collection => {
    const randomEmoji = DEFAULT_EMOJIS[Math.floor(Math.random() * DEFAULT_EMOJIS.length)];
    const randomColor = DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)];
    const newCollection: Collection = {
      id: `col_${Date.now()}`,
      name,
      emoji: emoji || randomEmoji,
      color: color || randomColor,
      conversationIds: [],
      createdAt: new Date().toISOString(),
    };
    setCollections((prev) => [newCollection, ...prev]);
    return newCollection;
  }, []);

  const renameCollection = useCallback((id: string, name: string) => {
    setCollections((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)));
  }, []);

  const deleteCollection = useCallback((id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const addConversation = useCallback((collectionId: string, conversationId: string) => {
    setCollections((prev) =>
      prev.map((c) =>
        c.id === collectionId && !c.conversationIds.includes(conversationId)
          ? { ...c, conversationIds: [...c.conversationIds, conversationId] }
          : c
      )
    );
  }, []);

  const removeConversation = useCallback((collectionId: string, conversationId: string) => {
    setCollections((prev) =>
      prev.map((c) =>
        c.id === collectionId
          ? { ...c, conversationIds: c.conversationIds.filter((id) => id !== conversationId) }
          : c
      )
    );
  }, []);

  const getCollectionForConversation = useCallback(
    (conversationId: string) =>
      collections.find((c) => c.conversationIds.includes(conversationId)),
    [collections]
  );

  return {
    collections,
    createCollection,
    renameCollection,
    deleteCollection,
    addConversation,
    removeConversation,
    getCollectionForConversation,
  };
}
