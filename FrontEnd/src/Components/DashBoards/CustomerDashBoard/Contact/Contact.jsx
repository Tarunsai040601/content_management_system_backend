import React from 'react'
import './Contact.css'

const Contact = () => {
  return (
    <section className="contact-hero">
      <div className="contact-overlay">
        <div className="contact-left">
         

          <h1 className="contact-heading">
            FIND YOUR <br />
            DREAM HOME <br />
            TODAY
          </h1>

          <p className="contact-subtext">
            Find the place where your life fits perfectly. <br />
            Explore homes for rent and buy—simple, seamless, and stress-free.
          </p>

          
        </div>

        <div className="contact-right">
          <div className="contact-info-card">
            <p className="need-help">GET IN TOUCH</p>
            <h2 className="message-us">CONTACT INFO</h2>

            <div className="info-item">
              <i className="fa fa-map-marker-alt"></i>
              <div>
                <h4>Location</h4>
                <p>6-5-133,Balanagar,Hyderabad,500042</p>
              </div>
            </div>

            <div className="info-item">
              <i className="fa fa-envelope"></i>
              <div>
                <h4>Email</h4>
                <p>tarunsai04062002@gmail.com</p>
              </div>
            </div>

            <div className="info-item">
              <i className="fa fa-phone"></i>
              <div>
                <h4>Phone</h4>
                <p>+91-8142253035</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact