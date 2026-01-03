import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import IframeErrorBoundary from './components/IframeErrorBoundary/IframeErrorBoundary';
import { useEffect, useState } from 'react';
import {
  registerMessageListener,
  sendMessage,
  getAppOrigin,
} from '../../../shared/communication';
import {
  MESSAGE_ACTIONS,
  MESSAGE_TYPE,
  CartItem,
  MessagePayload,
} from '../../../shared/types';
import { FRAME_NAMES, STORAGE_KEYS } from '../../../shared/config';

interface IframeAction {
  origin: string;
  type: string;
  frameName: string;
}

const IFRAME_ACTION_ROUTER: Record<string, IframeAction> = {
  [MESSAGE_ACTIONS.SHOW_SINGLE_BOOK]: {
    origin: getAppOrigin('single-book'),
    type: MESSAGE_TYPE,
    frameName: FRAME_NAMES.SINGLE_BOOK,
  },
  [MESSAGE_ACTIONS.SEARCH_BOOK_LIST]: {
    origin: getAppOrigin('book-list'),
    type: MESSAGE_TYPE,
    frameName: FRAME_NAMES.BOOK_LIST,
  },
};

function App(): JSX.Element {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse saved cart:', error);
        localStorage.removeItem(STORAGE_KEYS.CART);
      }
    }

    // Register a listener for messages from the microfrontends
    console.log('Setting up message listener');
    const unregisterListener = registerMessageListener(
      MESSAGE_TYPE,
      (data: MessagePayload) => {
        const selfActionHandler = SELF_HANDLED_ACTIONS[data.action];
        if (selfActionHandler) {
          selfActionHandler(data);
          return;
        }

        const ACTION = IFRAME_ACTION_ROUTER[data.action];
        if (!ACTION) {
          console.warn('No router found for action:', data.action);
          return;
        }

        const iframeElement = document.getElementById(
          ACTION.frameName,
        ) as HTMLIFrameElement | null;
        const iframeWindow = iframeElement?.contentWindow;
        if (iframeWindow) {
          sendMessage(iframeWindow, ACTION.origin, ACTION.type, data);
        } else {
          console.error('iframe not found:', ACTION.frameName);
        }
      },
    );

    return () => {
      console.log('Cleaning up message listener');
      unregisterListener();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  const SELF_HANDLED_ACTIONS: Record<string, (data: MessagePayload) => void> = {
    [MESSAGE_ACTIONS.ADD_TO_CART]: (data: MessagePayload) => {
      if (data.action === MESSAGE_ACTIONS.ADD_TO_CART) {
        setCart((prevCart) => {
          const existingItemIndex = prevCart.findIndex(
            (item) => item.book.id === data.payload.book.id,
          );
          if (existingItemIndex !== -1) {
            const updatedCart = [...prevCart];
            updatedCart[existingItemIndex].quantity += data.payload.quantity;
            return updatedCart;
          } else {
            return [...prevCart, data.payload];
          }
        });
      }
    },
    [MESSAGE_ACTIONS.RESIZE_IFRAME]: (data: MessagePayload) => {
      if (data.action === MESSAGE_ACTIONS.RESIZE_IFRAME) {
        const iframe = document.getElementById(
          data.payload.frameName,
        ) as HTMLIFrameElement | null;
        if (iframe && data.payload.height) {
          iframe.style.height = `${data.payload.height}px`;
        }
      }
    },
    [MESSAGE_ACTIONS.SHOW_SINGLE_BOOK]: (data: MessagePayload) => {
      // Route the message to the iframe after it's loaded
      setTimeout(() => {
        const ACTION = IFRAME_ACTION_ROUTER[MESSAGE_ACTIONS.SHOW_SINGLE_BOOK];
        const iframeElement = document.getElementById(
          ACTION.frameName,
        ) as HTMLIFrameElement | null;
        const iframeWindow = iframeElement?.contentWindow;
        if (iframeWindow) {
          sendMessage(iframeWindow, ACTION.origin, ACTION.type, data);
        }
      }, 100);
    },
  };

  const handleSearch = (value: string): void => {
    const ACTION = IFRAME_ACTION_ROUTER[MESSAGE_ACTIONS.SEARCH_BOOK_LIST];
    const iframeElement = document.getElementById(
      ACTION.frameName,
    ) as HTMLIFrameElement | null;
    const iframeWindow = iframeElement?.contentWindow;
    if (iframeWindow) {
      sendMessage(iframeWindow, ACTION.origin, ACTION.type, {
        action: MESSAGE_ACTIONS.SEARCH_BOOK_LIST,
        payload: { query: value },
      });
    }
  };

  const removeItemFromCart = (bookId: string): void => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.book.id !== bookId);
      return updatedCart;
    });
  };

  return (
    <ErrorBoundary>
      <div className='w-full h-screen overflow-y-scroll'>
        <Header
          handleSearch={(value: any) => handleSearch(value)}
          onRemoveItem={(bookId: string) => removeItemFromCart(bookId)}
          cart={cart}
        ></Header>
        <IframeErrorBoundary
          src={getAppOrigin('single-book')}
          title='Single Book'
          name={FRAME_NAMES.SINGLE_BOOK}
          id={FRAME_NAMES.SINGLE_BOOK}
          style={{
            border: 'none',
            width: '100%',
            minHeight: '500px',
            overflow: 'hidden',
          }}
          onError={(error) => console.error('Single Book iframe error:', error)}
        />

        <IframeErrorBoundary
          src={getAppOrigin('book-list')}
          title='Book List'
          name={FRAME_NAMES.BOOK_LIST}
          id={FRAME_NAMES.BOOK_LIST}
          style={{
            border: 'none',
            width: '100%',
            minHeight: '600px',
            overflow: 'hidden',
          }}
          onError={(error) => console.error('Book List iframe error:', error)}
        />
        <Footer handleSearch={(value: any) => handleSearch(value)}></Footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
