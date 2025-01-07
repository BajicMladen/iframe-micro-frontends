import Footer from './components/Footer/Footer.tsx';
import Header from './components/Header/Header.tsx';
import { useEffect, useState } from 'react';
import {
  registerMessageListener,
  sendMessage,
} from '../../../shared/communication.ts';

const IFRAME_ACTION_ROUTER = {
  SHOW_SINGLE_BOOK: {
    origin: 'http://localhost:5175',
    type: 'COMMUNICATION',
    frameName: 'single-book',
  },
  SEARCH_BOOK_LIST: {
    origin: 'http://localhost:5174',
    type: 'COMMUNICATION',
    frameName: 'book-list',
  },
};

function App() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // Register a listener for messages from the Vue iframe
    console.log('Setting up message listener');
    const unregisterListener = registerMessageListener(
      'COMMUNICATION',
      (data) => {
        const selfActionHandler = SELF_HANDLED_ACTIONS[data.action];
        if (selfActionHandler) {
          selfActionHandler(data);
          return;
        }

        const ACTION = IFRAME_ACTION_ROUTER[data.action];
        if (!ACTION) return;

        const iframeWindow = document.getElementById(
          ACTION.frameName,
        )?.contentWindow;
        if (iframeWindow) {
          sendMessage(iframeWindow, ACTION.origin, ACTION.type, data);
        }
      },
    );

    return () => {
      console.log('Cleaning up message listener');
      unregisterListener();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const SELF_HANDLED_ACTIONS = {
    ADD_TO_CART: (data) => {
      setCart((prevCart) => {
        const existingItemIndex = prevCart.findIndex(
          (item) => item.bookId === data.payload.bookId,
        );
        if (existingItemIndex !== -1) {
          const updatedCart = [...prevCart];
          updatedCart[existingItemIndex].quantity += data.payload.quantity;
          return updatedCart;
        } else {
          return [
            ...prevCart,
            { ...data.payload, quantity: data.payload.quantity },
          ];
        }
      });
    },
  };

  const handleSearch = (value) => {
    const ACTION = IFRAME_ACTION_ROUTER['SEARCH_BOOK_LIST'];
    sendMessage(
      document.getElementById(ACTION.frameName).contentWindow,
      ACTION.origin,
      ACTION.type,
      { action: 'SEARCH_BOOK_LIST', payload: value },
    );
  };

  const removeItemFromCart = (bookId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.bookId !== bookId);
      return updatedCart;
    });
  };

  return (
    <div className='w-full h-screen overflow-y-scroll'>
      <Header
        handleSearch={(value) => handleSearch(value)}
        onRemoveItem={(bookId) => removeItemFromCart(bookId)}
        cart={cart}
      ></Header>
      <iframe
        src='http://localhost:5175'
        title='Single Book'
        name='single-book'
        id='single-book'
        style={{
          border: 'none',
          width: '100%',
          height: '80vh',
          overflow: 'hidden',
          scrolling: 'no',
        }}
      />
      <iframe
        src='http://localhost:5174'
        title='Book List'
        name='book-list'
        id='book-list'
        style={{
          border: 'none',
          width: '100%',
          height: '140vh',
          overflow: 'hidden',
          scrolling: 'no',
        }}
      />
      <Footer handleSearch={(value) => handleSearch(value)}></Footer>
    </div>
  );
}

export default App;
