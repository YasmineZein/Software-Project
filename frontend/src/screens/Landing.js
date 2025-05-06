import React, { useRef } from 'react'
import "./landing.css"
import { Link } from 'react-router-dom'

export default function Landing() {
    return (
        <>

        <header style={{marginBottom:"50px"}}>
            <div className='container appheader'>
            <div className="head_container">
            <Link to="/" className="logo">
                <img src={require("../images/sh.jpg")} alt="logo"/>
            </Link>
            
            </div>
            </div>
        </header>

        <div className="containerhome">
            <div className="image">
                <img src={require("../images/internet-advertising-analytics-seo-marketing-reports-infographics-digital-promotion-social-media-networks-advert-video-content-promo_335657-208.png")} alt="E-learning Illustration"/>
                <div className="shape shape1"></div>
                <div className="shape shape2"></div>
            </div>
            <div className="contenthome">
                    <h1>لنبدأ <span>التعلم الإلكتروني </span>من منزلك</h1>
                    <p>احصل على تعليم عالي الجودة، في أي وقت ومن أي مكان. انضم إلى ملايين المتعلمين حول العالم وطوّر مهاراتك من خلال دورات تدريبية متميزة.</p>
                <div className="buttons">
                    <Link to="/Login" className="primary"> سجل الأن </Link>
                    <a href="#" className="secondary"> اقرأ المزيد </a>
                </div>
            </div>
        </div>
        <div className="blog-container">
            <h1>أهم الدورات</h1>
            <p>احصل على تعليم عالي الجودة، في أي وقت ومن أي مكان. انضم إلى ملايين المتعلمين حول العالم وطوّر مهاراتك من خلال دورات تدريبية متميزة.</p>
            <div className="blog-entries">
                <div className="blog-entry">
                    <img src={require("../images/1.png")} alt="Blog Image 1"/>
                    <div className="blog-entry-content">
                        <h3>كورس اساسيات الجافا اسكربت</h3>
                        <p>احصل على تعليم عالي الجودة، في أي وقت ومن أي مكان. انضم إلى ملايين المتعلمين حول العالم وطوّر مهاراتك من خلال دورات تدريبية متميزة.</p>
                        <a href="#">اقرأ المزيد</a>
                    </div>
                </div>
                <div className="blog-entry">
                    <img src={require("../images/2.png")} alt="Blog Image 2"/>
                    <div className="blog-entry-content">
                        <h3>كورس اساسيات الويب</h3>
                        <p>احصل على تعليم عالي الجودة، في أي وقت ومن أي مكان. انضم إلى ملايين المتعلمين حول العالم وطوّر مهاراتك من خلال دورات تدريبية متميزة.</p>
                        <a href="#">اقرأ المزيد</a>
                    </div>
                </div>
                <div className="blog-entry">
                    <img src={require("../images/3.jpg")} alt="Blog Image 3"/>
                    <div className="blog-entry-content">
                        <h3>كورس اساسيات الريأكت</h3>
                        <p>احصل على تعليم عالي الجودة، في أي وقت ومن أي مكان. انضم إلى ملايين المتعلمين حول العالم وطوّر مهاراتك من خلال دورات تدريبية متميزة.</p>
                        <a href="#">اقرأ المزيد</a>
                    </div>
                </div>
            </div>
        </div>
        <div className="contact-container">
            <h1>للتواصل </h1>
            <div className="contact-form-wrapper">
                <div className="contact-form">
                    <form action="#" method="POST" style={{position:"unset",transform:"unset",width:"unset",boxShadow:"unset",minHeight:"unset"}}>
                        <div style={{display: "flex", gap: "20px"}}>
                            <input type="text" name="full-name" placeholder="الأسم كامل" required/>
                            <input type="email" name="email" placeholder="الايميل" required/>
                        </div>
                        <textarea name="message" placeholder="رسالتك" required></textarea>
                        <button type="submit">ارسال الرسالة</button>
                    </form>
                </div>
            </div>
        </div>
    </>
    )
  return (
    <>
        
      
        
        

    </>
  )
}