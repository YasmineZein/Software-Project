import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Navigate } from 'react-router-dom'
import AdminHeader from '../components/AdminHeader'
import "./admin.css"
import "./exams.css"
import  * as Axios  from 'axios'
import { BACKEND_DOMAIN } from '../tools'
import Swal from 'sweetalert2'
import LoadingSpinnerunvis from '../components/LoadingSpinnerunvis'
import LoadingSpinner from '../components/LoadingSpinner'
import defaultavatar from "../images/avatar.png"
import PageHeader from '../components/PageHeader'
import { Helmet } from 'react-helmet-async'

export default function Courses() {
  const [loading, setloading] = useState(true);
  const [exmas, setexams] = useState([])
  const [num, setnum] = useState(1)
  const [refresh, setrefresh] = useState(1)

  const [instructor, setinstructor] = useState("")

   const logout=()=>{
      localStorage.setItem("token",null);
      Navigate("/", {replace: true})
      window.location.reload();
    }
  
  //get codes
  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
     };
    setloading(false);
    Axios.get( 
      BACKEND_DOMAIN+`/api/course/courses?&s=${searchinput.current.value}&instructor=${instructor}`,
      config
    ).then((response)=>{
      setloading(true);
      setexams(response.data);
      console.log(response.data);

    }).catch(e=>{
      setloading(true);
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: 'error',
        title: e.response.data.msg
      })
    });
  
    
  }, [num,refresh])
  
   
    //search
    const searchinput = useRef(null)

    const searchclick=(e)=>{
    e.preventDefault();
    setrefresh(refresh+1);

    }


    
  const [instructors, setinstructors] = useState([])
  
  //get codes
  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
     };
    setloading(false);
    Axios.get( 
      BACKEND_DOMAIN+`/api/instructor`,
      config
    ).then((response)=>{
      setloading(true);
      setinstructors(response.data);
      console.log(response.data);

    }).catch(e=>{
      setloading(true);
      if(e.response.data === "not authorized")
      {
        logout();
      }
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: 'error',
        title: e.response.data.msg
      })
    });
  
    
  }, [refresh])
  


  return (
    <>  

      <Helmet>
        <title>الكورسات التعليمية</title>
        <meta name='description' content='افضل الكورسات التعليمية للصفوف الثانوية الأن علي منصة عامر اكاديمي'/>
        <link rel='canonical' href='/courses'/>
      </Helmet>

    {!loading?<LoadingSpinner/>:""}
    <div className="admincont admin container">
    <div className='commands container'>
        <div className="heading">
            <h2>الكورسات</h2>
        </div>
        <div className='search container'>
            <form onSubmit={searchclick}> 
            <input type="text" placeholder="ابحث" ref={searchinput} name='search'/>
            <button  type="submit" ><i className="fa-solid fa-magnifying-glass"></i></button>
            </form>
        </div>
        <div className='filters container'>
        
          
          <select  name="Instructor" onChange={(e)=>setinstructor(e.target.value)}>
              <option value="null" >اختار المعلم</option>
                {
                  instructors.map((e)=>{
                    return(
                      <option value={e._id}>{e.Name}</option>
                    )
                  })
                }
            </select>

          </div>

          <div className='examescont container'>
            {
            exmas&&exmas.map((e,i)=>{
              return(
                <Link to={e._id}>
                <div className="boxs" key={i}>
                <img src={BACKEND_DOMAIN+e.Img} alt=""/>
                  <div className="content">
                      <h2>{e.Name}</h2>
                      <p style={{"display":"flex"}}>
                        <div>عدد الدروس:</div> <span>{e.Sections.length}</span>
                      </p>
                      <hr/>
                      <p style={{"textAlign":"end"}}>
                      إعداد: {e.Instructor.Name}
                      </p>
                  </div>
              </div>
              </Link>
              )
            })
          }
          </div>
    </div>
    </div>
    </>
  )
}
