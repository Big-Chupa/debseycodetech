import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="global-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>DebseyCodeTech</h2>
          <p>Empowering the next generation of tech leaders.</p>
        </div>
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/catalogue">Catalogue</a></li>
            <li><a href="/login">Login</a></li>
          </ul>
        </div>
        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p>Email: debseycodetech@gmail.com</p>
          <p>Phone: +234 915 265 9566</p>
          <p>Location: Lagos State, Nigeria</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} DebseyCodeTech. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;