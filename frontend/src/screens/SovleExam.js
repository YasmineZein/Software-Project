import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Navigate,useParams  } from 'react-router-dom'
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

export default function SovleExam() {
  let { id } = useParams();

  const [loading, setloading] = useState(true);
  const [exam, setexam] = useState([])
  const [refresh, setrefresh] = useState(1)


  const [loged, setloged] = useState(false)

  const addnamehandler=(e)=>{
    e.preventDefault();
    setloged(true)
  }
  
  //get codes
  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
     };
    setloading(false);
    Axios.get( 
      BACKEND_DOMAIN+`/api/exam/exams/${id}`,
      config
    ).then((response)=>{
      setloading(true);
      setexam(response.data);

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
  

  //exam
  const qselements = useRef([]);

  const [answers, setanswers] = useState([])
  const addanswer=(obj)=>{
    let _answers = answers;
    _answers.push(obj);
    let _answers2 = [..._answers.filter((a)=>a._id!=obj._id),obj]
    
    console.log(_answers2)
    setanswers(_answers2);
  }

  const [sended, setsended] = useState(false)

  const sendanswershandler=(e)=>{
    setloading(false)
    e.preventDefault();
    if(answers.length != exam.Questions.length)
    {
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
        title: "الرجاء حل كل الأسئلة"
      })
    }
    else
    {
      setsended(true)

    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
     };

    setloading(false);
    Axios.post( 
      BACKEND_DOMAIN+'/api/exam/solveexam',
      {Questions:answers,_id:exam._id},
      config
    ).then((response)=>{
      setloading(true);
      
      setrefresh(refresh+1);

      //answers
      
      qselements.current.forEach(e => {
        response.data.examAnswers.Questions.forEach(q => {
          if(e.getAttribute("qid") ==q._id)
          {
            e.childNodes[0].childNodes.forEach(r=>{
              if(r.getAttribute("answer")==q.CorrectAnswer)
              {
                r.className="radiobox true"
              }
              else if(r.getAttribute("answer")!=q.CorrectAnswer &&r.childNodes[0].childNodes[0].checked)
              {
                r.className="radiobox false"

              }
            })
          }
        });    
      });
      
      if(response.data.score/answers.length>0.75)
      {
        Swal.fire({
          icon: 'success',
          text: 'الله ينور',
          title: `${answers.length} درجتك ${response.data.score} من`
        })
        localStorage.setItem(exam._id, true);
      }
      else if(response.data.score/answers.length<0.75 && response.data.score/answers.length>0.5)
      {
        Swal.fire({
          icon: 'question',
          text: 'كويس بس فيه احسن',
          title: `${answers.length} درجتك ${response.data.score} من`
        })
        localStorage.setItem(exam._id, true);
      }
      else 
      {
        Swal.fire({
          icon: 'error',
          text: 'كنت متوقع منك احسن من كده',
          title: `${answers.length} درجتك ${response.data.score} من`
        })
        localStorage.setItem(exam._id, true);

      }

    }).catch(e=>{

      setloading(true);
      console.log(e)
      // const Toast = Swal.mixin({
      //   toast: true,
      //   position: 'top-end',
      //   showConfirmButton: false,
      //   timer: 3000,
      //   timerProgressBar: true,
      //   didOpen: (toast) => {
      //     toast.addEventListener('mouseenter', Swal.stopTimer)
      //     toast.addEventListener('mouseleave', Swal.resumeTimer)
      //   }
      // })
      
      // Toast.fire({
      //   icon: 'error',
      //   title: e.response.data?"":e.response.data.msg
      // })
    });
    }
  }

  if(!loged){
  return (
    <>  
    {!loading?<LoadingSpinner/>:""}
    <div className='container'>
    <div className="heading">
        <h2>امتحان : {exam.Name}</h2>
    </div>
    <div className="admincont admin container">
    <div className='commands container'>
      <form style={{
        "position":"relative",
        "top":"0","left":"0",
        "transform":"inherit",
        "width":"100%",
        "maxWidth":"inherit",
        "minHeight":"inherit",
        "boxShadow":"none",
        "justifyContent":"center"
        }}>
        <div>
        <button onClick={addnamehandler} style={{"margin":"0"}}>بداء الامتحان</button>
        </div>
      </form>
    </div>
    </div>
    </div>
    </>
  )}
  else{
  return (
    <>  
    {!loading?<LoadingSpinner/>:""}
    <div className='container'>
    <div className="heading">
        <h2>امتحان : {exam.Name}</h2>
    </div>
    <div className="admincont admin container">
    <div className='commands container'>
      {exam.Questions.map((q,i)=>{
        return(
          <div ref={el => qselements.current[i] = el} qid={q._id}  className="" style={{"width":"100%","margin":"0","marginBottom":"20px"}} key={i}>
              {q.Question}
              <div className='allradios'>
                <p className='radiobox' answer={q.Answer1}>
                <label >
                  <input type="radio"  onChange={()=>addanswer({_id:q._id,Answer:q.Answer1})}  name={`radio-group${i}`}/>
                  <span>{q.Answer1}</span></label>
                </p>
                <p className='radiobox' answer={q.Answer2}>
                <label >
                  <input type="radio"  onChange={()=>addanswer({_id:q._id,Answer:q.Answer2})}  name={`radio-group${i}`}/>
                  <span>{q.Answer2}</span></label>
                </p>
                <p className='radiobox' answer={q.Answer3}>
                <label >
                  <input type="radio"  onChange={()=>addanswer({_id:q._id,Answer:q.Answer3})}  name={`radio-group${i}`}/>
                  <span>{q.Answer3}</span></label>
                </p>
                <p className='radiobox' answer={q.Answer4}>
                <label >
                  <input type="radio"  onChange={()=>addanswer({_id:q._id,Answer:q.Answer4})}  name={`radio-group${i}`}/>
                  <span>{q.Answer4}</span></label>
                </p>
                </div>
                <hr style={{"backgroundColor":"aliceblue","borderColor":"black"}}/>

          </div>

        )
      })}

    {!sended?<button onClick={sendanswershandler} style={{"margin":"30px auto","width":"100%"}}>ارسال الأجابات</button>:""}

    </div>
    </div>
    </div>
    </>)
  }
}
