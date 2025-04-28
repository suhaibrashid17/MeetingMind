import './App.css';
import Navbar from './components/Navbar';
import {Route,Routes} from 'react-router-dom' 
import Login from './pages/Login';
import Signup from './pages/Signup';
function App() {


  return (
     <>
        <Navbar></Navbar>
        <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
        </Routes>
     </>
  );
}

export default App;