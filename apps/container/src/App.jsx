import Footer from './components/Footer/Footer.tsx'
import Header from './components/Header/Header.tsx'

function App() {
  return ( 
   <div className='w-full h-screen overflow-y-scroll'>
    <Header></Header>
    <div className='w-full h-56 bg-green-100'> IFrame Vue.js</div>
    <div className='w-full h-56 bg-blue-50'>IFrame Svelte.js</div>
    <Footer></Footer>
   </div>
  )
}

export default App
