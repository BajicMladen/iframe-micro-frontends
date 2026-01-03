/**
 * Secure communication utilities for microfrontend message passing
 */

import type { MessagePayload, Message } from './types';

/**
 * Get allowed origins from environment variables
 * Falls back to localhost URLs if env vars not available
 */
function getAllowedOrigins(): string[] {
  const origins = [
    import.meta.env.VITE_CONTAINER_APP_URL || 'http://localhost:5173',
    import.meta.env.VITE_BOOK_LIST_APP_URL || 'http://localhost:5174',
    import.meta.env.VITE_SINGLE_BOOK_APP_URL || 'http://localhost:5175',
  ];

  // Filter out any undefined/null values and ensure unique origins
  return Array.from(new Set(origins.filter(Boolean)));
}

/**
 * Validates if the message origin is allowed
 * @param {string} origin - The origin to validate
 * @returns {boolean} True if origin is allowed
 */
export function isOriginAllowed(origin: string): boolean {
  const allowedOrigins = getAllowedOrigins();
  return allowedOrigins.includes(origin);
}

/**
 * Validates message structure
 * @param {any} data - The message data to validate
 * @returns {boolean} True if message is valid
 */
function isValidMessage(data: any): data is Message {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.type === 'string' &&
    data.data &&
    typeof data.data === 'object' &&
    typeof data.data.action === 'string'
  );
}

/**
 * Sends a message to a target window with origin validation.
 * @param {Window} targetWindow - The window to which the message will be sent.
 * @param {string} targetOrigin - The origin of the target window (use specific origin, not '*').
 * @param {string} messageType - A string identifying the type of message.
 * @param {MessagePayload} payload - The data to send.
 * @throws {Error} If targetOrigin is wildcard '*' (security risk)
 */
export function sendMessage(
  targetWindow: Window,
  targetOrigin: string,
  messageType: string,
  payload: MessagePayload
): void {
  // Prevent wildcard usage
  if (targetOrigin === '*') {
    console.error('Security Error: Cannot use wildcard "*" as targetOrigin');
    throw new Error('Wildcard targetOrigin is not allowed for security reasons');
  }

  // Validate targetOrigin is in allowed list
  if (!isOriginAllowed(targetOrigin)) {
    console.warn(`Warning: Sending message to non-whitelisted origin: ${targetOrigin}`);
  }

  const message: Message = {
    type: messageType,
    data: payload,
  };

  try {
    targetWindow.postMessage(message, targetOrigin);
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
}

/**
 * Registers a listener for messages of a specific type with origin validation.
 * @param {string} messageType - The type of message to listen for.
 * @param {function} callback - The function to call when a message is received.
 * @param {object} options - Optional configuration
 * @param {boolean} options.validateOrigin - Whether to validate message origin (default: true)
 * @returns {function} A function to unregister the listener.
 */
export function registerMessageListener(
  messageType: string,
  callback: (data: MessagePayload) => void,
  options: { validateOrigin?: boolean } = {}
): () => void {
  const { validateOrigin = true } = options;

  function messageHandler(event: MessageEvent): void {
    // Validate the origin of the message for security
    if (validateOrigin && !isOriginAllowed(event.origin)) {
      console.warn(`Rejected message from unauthorized origin: ${event.origin}`);
      return;
    }

    // Validate message structure
    if (!isValidMessage(event.data)) {
      console.warn('Received invalid message format:', event.data);
      return;
    }

    const { type, data } = event.data;

    // Check if message type matches
    if (type === messageType) {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in message callback:', error);
      }
    }
  }

  window.addEventListener('message', messageHandler);

  // Return a function to unregister the listener
  return () => {
    window.removeEventListener('message', messageHandler);
  };
}

/**
 * Gets the current app's origin from environment variables
 * @param {string} appName - Name of the app ('container' | 'book-list' | 'single-book')
 * @returns {string} The app's origin URL
 */
export function getAppOrigin(appName: 'container' | 'book-list' | 'single-book'): string {
  const originMap = {
    container: import.meta.env.VITE_CONTAINER_APP_URL || 'http://localhost:5173',
    'book-list': import.meta.env.VITE_BOOK_LIST_APP_URL || 'http://localhost:5174',
    'single-book': import.meta.env.VITE_SINGLE_BOOK_APP_URL || 'http://localhost:5175',
  };

  return originMap[appName];
}
