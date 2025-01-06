import Footer from './components/Footer/Footer.tsx';
import Header from './components/Header/Header.tsx';
import { useEffect } from 'react';
import {
  registerMessageListener,
  sendMessage,
} from '../../../shared/communication.ts';

const ACTIONS_FACTORY = {
  SHOW_SINGLE_BOOK: {
    origin: 'http://localhost:5175',
    type: 'COMMUNICATION',
    frameName: 'single-book',
  },
};

function App() {
  useEffect(() => {
    // Register a listener for messages from the Vue iframe
    const unregisterListener = registerMessageListener(
      'COMMUNICATION',
      (data) => {
        const ACTION = ACTIONS_FACTORY[data.action];
        if (!ACTION) return;
        sendMessage(
          document.getElementById(ACTION.frameName).contentWindow,
          ACTION.origin,
          ACTION.type,
          data,
        );
      },
    );

    // Clean up the listener on component unmount
    return () => {
      unregisterListener();
    };
  }, []);

  return (
    <div className='w-full h-screen overflow-y-scroll'>
      <Header></Header>
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
      <Footer></Footer>
    </div>
  );
}

export default App;
