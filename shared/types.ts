/**
 * Shared type definitions for microfrontend communication
 */

// Message action types
export const MESSAGE_ACTIONS = {
  SHOW_SINGLE_BOOK: 'SHOW_SINGLE_BOOK',
  ADD_TO_CART: 'ADD_TO_CART',
  SEARCH_BOOK_LIST: 'SEARCH_BOOK_LIST',
  RESIZE_IFRAME: 'RESIZE_IFRAME',
} as const;

export type MessageAction = typeof MESSAGE_ACTIONS[keyof typeof MESSAGE_ACTIONS];

// Message type for all communications
export const MESSAGE_TYPE = 'COMMUNICATION';

// Book interface
export interface Book {
  id: string;
  title: string;
  author: string;
  thumbnail?: string;
  description?: string;
  price?: number;
  rating?: number;
  publisher?: string;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
  images?: string[];
}

// Cart item interface
export interface CartItem {
  book: Book;
  quantity: number;
}

// Message payload types
export interface ShowSingleBookPayload {
  action: typeof MESSAGE_ACTIONS.SHOW_SINGLE_BOOK;
  payload: {
    bookId: string;
  };
}

export interface AddToCartPayload {
  action: typeof MESSAGE_ACTIONS.ADD_TO_CART;
  payload: {
    book: Book;
    quantity: number;
  };
}

export interface SearchBookListPayload {
  action: typeof MESSAGE_ACTIONS.SEARCH_BOOK_LIST;
  payload: {
    query: string;
  };
}

export interface ResizeIframePayload {
  action: typeof MESSAGE_ACTIONS.RESIZE_IFRAME;
  payload: {
    height: number;
    frameName: string;
  };
}

// Union type of all message payloads
export type MessagePayload =
  | ShowSingleBookPayload
  | AddToCartPayload
  | SearchBookListPayload
  | ResizeIframePayload;

// Message envelope
export interface Message {
  type: string;
  data: MessagePayload;
}

// Environment configuration interface
export interface EnvConfig {
  VITE_CONTAINER_APP_URL: string;
  VITE_BOOK_LIST_APP_URL: string;
  VITE_SINGLE_BOOK_APP_URL: string;
}
