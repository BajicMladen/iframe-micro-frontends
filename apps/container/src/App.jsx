import Footer from './components/Footer/Footer.tsx';
import Header from './components/Header/Header.tsx';

function App() {
  return (
    <div className='w-full h-screen overflow-y-scroll'>
      <Header></Header>
      <iframe
        src='http://localhost:5175'
        title='Single Book'
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
