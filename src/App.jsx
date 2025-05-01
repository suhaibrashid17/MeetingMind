import './App.css';
import Navbar from './components/Navbar';
import {Route,Routes} from 'react-router-dom' 
import Login from './pages/Login';
import Signup from './pages/Signup';
import { ToastContainer} from 'react-toastify';
import Home from './pages/Home';
import CheckLogin from './pages/CheckLogin';
import OrganizationPage from './pages/OrganizationPage';
import DepartmentPage from './pages/DepartmentPage';

function App() {


  return (
     <>
        <Navbar></Navbar>
        <ToastContainer/>
        <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/home' element={<CheckLogin><Home/></CheckLogin>}/>
          <Route path='/organization/:id' element={<CheckLogin><OrganizationPage/></CheckLogin>}/>
          <Route path='/department/:id' element={<CheckLogin><DepartmentPage/></CheckLogin>}/>

        </Routes>
     </>
  );
}

export default App;