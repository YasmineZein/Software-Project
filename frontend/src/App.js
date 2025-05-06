import { useEffect,useState } from 'react';
import './App.css';
import {BrowserRouter , Route,Routes,Navigate,useNavigate } from "react-router-dom";
import Header from './components/Header.js';
import Home from './screens/Home';
import Register from './screens/Register';
import Login from './screens/Login';
import LoadingSpinner from './components/LoadingSpinner';
import Admin from './screens/Admin';
import Axios from "axios"
import Error404 from './screens/Error404';
import { parseJwt,BACKEND_DOMAIN } from './tools';
import Landing from './screens/Landing';
import Soon from './screens/Soon';
import Verifyemail from './screens/Verifyemail';
import Resendemailverification from './screens/Resendemailverification';
import Resendpassowrdreset from './screens/Resendpassowrdreset';
import ResetPassword from './screens/ResetPassword';
import Admincode from './screens/Admincode';
import Wallet from './screens/Wallet';
import Adminteacher from './screens/AdminInstructor.js';
import Users from './screens/Users';
import Adminquestion from './screens/Adminquestion';
import Adminexam from './screens/Adminexam';
import Exams from './screens/Exams';
import SovleExam from './screens/SovleExam';
import Adminblock from './screens/Adminblock';
import Adminsection from './screens/Adminsection';
import Admincourse from './screens/Admincourse';
import Courses from './screens/Courses';
import CoursePage from './screens/CoursePage';
import SectionPage from './screens/SectionPage';
import { MyContext } from './tools';
import { HelmetProvider } from 'react-helmet-async';
import AdminInstructor from './screens/AdminInstructor.js';
import Profile from './screens/Profile.js';

function App() {
  const [islogedin, setislogedin] = useState(false)
  const [loaded, setloaded] = useState(false)
  const [Money, setMoney] = useState(0)
  useEffect(() => {
    Axios.get( 
      BACKEND_DOMAIN+'/api/auth/isloggedin',
      {headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }}
    ).then(response=>{
      if(response.data == "not authorized")
      {
        setislogedin(false);
        localStorage.setItem("token",null);
      }
      else if (response.data == "logedin")
      {
        setislogedin(true);
      }
      setloaded(true);
    }).catch(e=>{
      if(e.response.data === "not authorized")
      {
        setislogedin(false);
        localStorage.setItem("token",null);
      }
      else if (e.response.data === "logedin")
      {
        setislogedin(true);
      }
      setloaded(true);
    })
  }, [])

  return (
    <MyContext.Provider value={{ Money, setMoney }}>
      <HelmetProvider>
    <BrowserRouter>
      {
        loaded?
        islogedin?
        <>
          <Header/>
          <Routes>
            <Route path="*" exact element={<Error404/>} />
            <Route path="/" exact element={<Home/>} />
            <Route path="/Error404" exact element={<Error404/>} />
            <Route path="/soon" exact element={<Soon/>} />
            <Route path="/Kqw86u/home" exact element={islogedin&&parseJwt(localStorage.getItem("token"))?.role==="admin"?<Admin/>:<Error404/>} />
            <Route path="/Kqw86u/code" exact element={islogedin&&parseJwt(localStorage.getItem("token"))?.role==="admin"?<Admincode/>:<Error404/>} />
            <Route path="/Kqw86u/instructor" exact element={islogedin&&parseJwt(localStorage.getItem("token"))?.role==="admin"?<AdminInstructor/>:<Error404/>} />
            <Route path="/Kqw86u/users" exact element={islogedin&&parseJwt(localStorage.getItem("token"))?.role==="admin"?<Users/>:<Error404/>} />
            <Route path="/Kqw86u/questions" exact element={islogedin&&parseJwt(localStorage.getItem("token"))?.role==="admin"?<Adminquestion/>:<Error404/>} />
            <Route path="/Kqw86u/exams" exact element={islogedin&&parseJwt(localStorage.getItem("token"))?.role==="admin"?<Adminexam/>:<Error404/>} />
            <Route path="/Kqw86u/block" exact element={islogedin&&parseJwt(localStorage.getItem("token"))?.role==="admin"?<Adminblock/>:<Error404/>} />
            <Route path="/Kqw86u/section" exact element={islogedin&&parseJwt(localStorage.getItem("token"))?.role==="admin"?<Adminsection/>:<Error404/>} />
            <Route path="/Kqw86u/course" exact element={islogedin&&parseJwt(localStorage.getItem("token"))?.role==="admin"?<Admincourse/>:<Error404/>} />
            <Route path="/register" exact element={!islogedin?<Register/>:<Navigate to="/" replace={true}/>} />
            <Route path="/login" exact element={!islogedin?<Login/>:<Navigate to="/" replace={true}/>} />
            <Route path="/profile" exact element={<Profile/>} />
            <Route path="/wallet" exact element={<Wallet/>} />
            <Route path="/courses" exact element={<Courses/>} />
            <Route path="/courses/:id" exact element={<CoursePage/>} />
            <Route path="/course/:cid/section/:id" exact element={<SectionPage/>} />
            <Route path="/exams" exact element={<Exams/>} />
            <Route path="/exams/:id" exact element={<SovleExam/>} />
          </Routes>
        </>
      :
      <Routes>
        <Route path="*" exact element={<Error404/>} />
        <Route path="/" exact element={<Landing/>} />
        <Route path="/soon" exact element={<Soon/>} />
        <Route path="/register" exact element={!islogedin?<Register/>:<Navigate to="/" replace={true}/>} />
        <Route path="/login" exact element={!islogedin?<Login/>:<Navigate to="/" replace={true}/>} />
      </Routes>
      :
      <LoadingSpinner/>
    }
    </BrowserRouter>
    </HelmetProvider>
    </MyContext.Provider>

  );
}

export default App;
