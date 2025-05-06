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

export default function Home() {

      
  return (
    <>  
    <div className="admincont admin container">
    <div className='commands container'>
      
      <div className="containerhome">
          <div className="image">
              <img src={require("../images/internet-advertising-analytics-seo-marketing-reports-infographics-digital-promotion-social-media-networks-advert-video-content-promo_335657-208.png")} alt="E-learning Illustration"/>
              <div className="shape shape1"></div>
              <div className="shape shape2"></div>
          </div>
          <div className="contenthome">
                  <h1>لنبدأ <span>التعلم الإلكتروني </span>من منزلك</h1>
                  <p>احصل على تعليم عالي الجودة، في أي وقت ومن أي مكان. انضم إلى ملايين المتعلمين حول العالم وطوّر مهاراتك من خلال دورات تدريبية متميزة.</p>
          </div>
      </div>

    </div>
    </div>
    </>
  )
}
