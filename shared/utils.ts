/**
 * Utility functions for microfrontend apps
 */

import { sendMessage, getAppOrigin } from './communication';
import { MESSAGE_ACTIONS, MESSAGE_TYPE } from './types';
import { IFRAME_CONFIG } from './config';

/**
 * Debounce function to limit how often a function is called
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Send iframe height to container for dynamic resizing
 */
export function sendIframeHeight(frameName: string): void {
  const height = document.body.scrollHeight;
  sendMessage(window.parent, getAppOrigin('container'), MESSAGE_TYPE, {
    action: MESSAGE_ACTIONS.RESIZE_IFRAME,
    payload: {
      height,
      frameName,
    },
  });
}

/**
 * Setup auto-resize observer for iframe
 */
export function setupAutoResize(frameName: string): () => void {
  // Send initial height
  sendIframeHeight(frameName);

  // Debounced resize function
  const debouncedResize = debounce(
    () => sendIframeHeight(frameName),
    IFRAME_CONFIG.RESIZE_DEBOUNCE
  );

  // Observe content changes
  const resizeObserver = new ResizeObserver(() => {
    debouncedResize();
  });

  resizeObserver.observe(document.body);

  // Also listen to window resize
  window.addEventListener('resize', debouncedResize);

  // Return cleanup function
  return () => {
    resizeObserver.disconnect();
    window.removeEventListener('resize', debouncedResize);
  };
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}

/**
 * Simple in-memory cache with TTL
 */
export class SimpleCache<T> {
  private cache: Map<string, { data: T; expiry: number }> = new Map();
  private maxSize: number;

  constructor(maxSize: number = 50) {
    this.maxSize = maxSize;
  }

  set(key: string, data: T, ttl: number): void {
    // Evict oldest entry if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl,
    });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }
}
