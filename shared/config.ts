/**
 * Shared configuration constants
 */

// API Configuration
export const API_CONFIG = {
  GOOGLE_BOOKS_BASE_URL: 'https://www.googleapis.com/books/v1/volumes',
  MAX_RESULTS: 8,
  DEFAULT_SEARCH_QUERY: 'javascript',
  REQUEST_TIMEOUT: 10000, // 10 seconds
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// UI Configuration
export const UI_CONFIG = {
  DEBOUNCE_DELAY: 300, // milliseconds for search debouncing
  DEFAULT_BOOK_PRICE: 10.00,
  MIN_BOOK_PRICE: 10.00,
  MAX_BOOK_PRICE: 12.49,
} as const;

// iframe Configuration
export const IFRAME_CONFIG = {
  BOOK_LIST_MIN_HEIGHT: 400,
  SINGLE_BOOK_MIN_HEIGHT: 300,
  RESIZE_DEBOUNCE: 100, // milliseconds
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  ENABLE_CACHE: true,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes in milliseconds
  MAX_CACHE_SIZE: 50, // Maximum number of cached items
} as const;

// Frame names for iframe routing
export const FRAME_NAMES = {
  BOOK_LIST: 'book-list',
  SINGLE_BOOK: 'single-book',
} as const;

// Storage keys
export const STORAGE_KEYS = {
  CART: 'shopping-cart',
  API_CACHE: 'api-cache',
} as const;
