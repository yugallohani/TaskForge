/**
 * TaskForge — Cross-tab synced state
 * ----------------------------------
 * Lightweight wrapper around localStorage + BroadcastChannel that
 * keeps a piece of state in sync across browser tabs in real time.
 *
 * Use case: Admin opens one tab, Member opens another tab. When the
 * admin approves a request, the member's UI updates instantly.
 *
 * No backend / WebSockets needed — perfect for the demo and easy to
 * swap for a real socket connection later (just replace the channel).
 */
import { useEffect, useRef, useState } from "react";

const CHANNEL_NAME = "taskforge:sync";

let channel: BroadcastChannel | null = null;
const getChannel = () => {
  if (typeof BroadcastChannel === "undefined") return null;
  if (!channel) channel = new BroadcastChannel(CHANNEL_NAME);
  return channel;
};

interface SyncMessage<T> {
  key: string;
  value: T;
  origin: string; // tab id, so we don't echo to self
}

const tabId = Math.random().toString(36).slice(2);

export function useSyncedState<T>(
  storageKey: string,
  initial: T | (() => T)
): [T, (next: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) return JSON.parse(stored);
    } catch {
      /* ignore */
    }
    return typeof initial === "function" ? (initial as () => T)() : initial;
  });

  const valueRef = useRef(value);
  valueRef.current = value;

  // Persist + broadcast on change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }, [storageKey, value]);

  // Listen for changes from other tabs
  useEffect(() => {
    const ch = getChannel();
    if (!ch) return;

    const handler = (event: MessageEvent<SyncMessage<T>>) => {
      const msg = event.data;
      if (!msg || msg.key !== storageKey || msg.origin === tabId) return;
      setValue(msg.value);
    };
    ch.addEventListener("message", handler);

    // Also handle the storage event as a fallback (works across origins)
    const storageHandler = (e: StorageEvent) => {
      if (e.key !== storageKey || !e.newValue) return;
      try {
        setValue(JSON.parse(e.newValue));
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("storage", storageHandler);

    return () => {
      ch.removeEventListener("message", handler);
      window.removeEventListener("storage", storageHandler);
    };
  }, [storageKey]);

  const setSyncedValue = (next: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const computed =
        typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      const ch = getChannel();
      if (ch) {
        ch.postMessage({
          key: storageKey,
          value: computed,
          origin: tabId,
        } as SyncMessage<T>);
      }
      return computed;
    });
  };

  return [value, setSyncedValue];
}
