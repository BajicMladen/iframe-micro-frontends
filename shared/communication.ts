/**
 * Sends a message to a target window.
 * @param {Window} targetWindow - The window to which the message will be sent.
 * @param {string} targetOrigin - The origin of the target window.
 * @param {string} messageType - A string identifying the type of message.
 * @param {any} payload - The data to send.
 */
export function sendMessage(
    targetWindow: Window,
    targetOrigin: string,
    messageType: string,
    payload: any
  ): void {
    const message = {
      type: messageType,
      data: payload,
    };
    targetWindow.postMessage(message, targetOrigin);
  }
  
  /**
   * Registers a listener for messages of a specific type.
   * @param {string} messageType - The type of message to listen for.
   * @param {function} callback - The function to call when a message is received.
   * @returns {function} A function to unregister the listener.
   */
  export function registerMessageListener(
    messageType: string,
    callback: (data: any) => void
  ): () => void {
    function messageHandler(event: MessageEvent): void {
      // Validate the origin of the message for security
    //   if (event.origin !== 'http://allowed-origin.com') return;
  
      const { type, data } = event.data;
      if (type === messageType) {
        callback(data);
      }
    }
  
    window.addEventListener('message', messageHandler);
  
    // Return a function to unregister the listener
    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }
  