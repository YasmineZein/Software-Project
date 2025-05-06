import  Axios  from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import "./settings.css"
import { BACKEND_DOMAIN } from '../tools'
import Swal from 'sweetalert2'
import defaultavatar from "../images/avatar.png"
import LoadingSpinnerunvis from '../components/LoadingSpinnerunvis'
import { Link } from 'react-router-dom'

export default function Profile() {
    const [loading, setloading] = useState(false)
    const [userdata, setuserdata] = useState(null)
    const username = useRef(null)
    const phone = useRef(null)

    const [inputs,setInputs] = useState({
        UserName:"",
        Phone:""
      })

    const handleChange=(e)=>{
        setInputs((prev)=>({
    
            ...prev,
            [e.target.name]: e.target.value
        }))
      }
  
    useEffect(() => {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    };
    
    Axios.get( 
      BACKEND_DOMAIN+'/api/auth/getme',
      config
    ).then((response)=>{
      setuserdata(response.data);
      setloading(true);
      username.current.value =response.data.UserName;
      phone.current.value =response.data.Phone;

        setInputs({
        UserName:response.data.UserName,
        Phone:response.data.Phone,
      })
    }).catch((e)=>{
      if(e.response.data === "not authorized")
        {
          localStorage.setItem("token",null);
        }
    });  
    }, [])

//checked={`${inputs.Year==3?true:false}`}
    

      const [sedingloading, setsedingloading] = useState(true)
      const submithandler=()=>{
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };
    
        const bodyParameters = {
        ...inputs
        };
        setsedingloading(false)
        Axios.post( 
            BACKEND_DOMAIN+'/api/auth/updateuser',
            bodyParameters,
            config,
          ).then((response)=>{
            window.location.reload();
          }).catch(e=>{
            setsedingloading(true)

            
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
      }

  const [data, setdata] = useState()
  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
     };
    setloading(false);
    Axios.get( 
      BACKEND_DOMAIN+`/api/auth/profile`,
      config
    ).then((response)=>{
      setloading(true);
      setdata(response.data);
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
  
    
  }, [])
  

    return (
    <>
    {!loading?<LoadingSpinner/>:""}
    {!sedingloading?<LoadingSpinnerunvis/>:""}
        <h1  style={{"textAlign":"center"}}>الأعدادات</h1>
        <div className="container settings">
        <div className='settingsright'>
                <label>
                    <div>
                    الأسم
                    </div>
                    <input type="text" ref={username} placeholder="الأسم" name='UserName' onChange={handleChange}/>
                </label>
                <label>
                    <div>
                    رقم الهاتف
                    </div>
                    <input type="text" ref={phone} placeholder="رقم الهاتف" name='Phone' onChange={handleChange}/>
                </label>


            <button style={{"width":"200px"}} onClick={submithandler}>حفظ</button>
        </div>
        </div>
        <h1  style={{"textAlign":"center"}}>كورساتي</h1>
        <div className='examescont container' style={{justifyContent:"left"}}>
                    {
                    data&&data.courses.map((e,i)=>{
                      return(
                        <Link to={"/courses/"+e._id}>
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

            <h1  style={{"textAlign":"center"}}>امتحاناتي</h1>

            <table>
            <thead>
                <tr>
                  <th>الأسم</th>
                  <th>الدرجة</th>
                </tr>
            </thead>
            <tbody>
                

                {data&&data.examdones.map((code,i)=>{
                  return(<tr >
                          <td>{code.Exam.Name}</td>
                          <td>{code.Result}/{code.Total}</td>
                        </tr>)
                })}
            </tbody>
        </table>

    </>
    )
}

